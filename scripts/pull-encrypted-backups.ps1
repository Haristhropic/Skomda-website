[CmdletBinding()]
param(
    [string]$Destination = (Join-Path $env:USERPROFILE 'Downloads\Skomda-backups'),
    [string]$KeyPath = (Join-Path $env:USERPROFILE '.ssh\skomda-deploy-vps')
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$archivePattern = '^(\d{8}T\d{6}Z)\.dump\.enc$'
$generatedPattern = '^(\d{8}T\d{6}Z)\.dump\.(enc|json)$'
$destinationPath = [System.IO.Path]::GetFullPath($Destination).TrimEnd('\', '/')
if ($destinationPath -eq [System.IO.Path]::GetPathRoot($destinationPath).TrimEnd('\', '/')) {
    throw 'A dedicated backup directory is required.'
}
New-Item -ItemType Directory -Path $destinationPath -Force | Out-Null
$destinationPath = (Resolve-Path -LiteralPath $destinationPath).ProviderPath.TrimEnd('\', '/')
if ((Get-Item -LiteralPath $destinationPath).Attributes -band [System.IO.FileAttributes]::ReparsePoint) {
    throw 'Backup destination must not be a symlink or junction.'
}
if (-not (Test-Path -LiteralPath $KeyPath -PathType Leaf)) { throw 'The configured deployment SSH key is missing.' }
$knownHosts = Join-Path $env:USERPROFILE '.ssh\known_hosts'
if (-not (Test-Path -LiteralPath $knownHosts -PathType Leaf)) { throw 'Trusted SSH known_hosts is missing.' }
$ssh = (Get-Command ssh.exe -CommandType Application | Select-Object -First 1).Source
$scp = (Get-Command scp.exe -CommandType Application | Select-Object -First 1).Source
$connection = @('-i', $KeyPath, '-o', 'IdentitiesOnly=yes', '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=yes', '-o', "UserKnownHostsFile=$knownHosts", '-o', 'ConnectTimeout=10', '-o', 'ServerAliveInterval=15', '-o', 'ServerAliveCountMax=2')

function Confirm-LocalPath([string]$FilePath) {
    $absolute = [System.IO.Path]::GetFullPath($FilePath)
    if (-not [System.IO.Path]::GetDirectoryName($absolute).Equals($destinationPath, [System.StringComparison]::OrdinalIgnoreCase)) {
        throw 'Backup operation must remain inside its dedicated directory.'
    }
    if ((Test-Path -LiteralPath $absolute) -and ((Get-Item -LiteralPath $absolute).Attributes -band [System.IO.FileAttributes]::ReparsePoint)) {
        throw 'Backup files must not be symlinks.'
    }
    return $absolute
}

function Complete-AtomicFile([string]$TemporaryPath, [string]$FinalPath) {
    $temporary = Confirm-LocalPath $TemporaryPath
    $final = Confirm-LocalPath $FinalPath
    if (Test-Path -LiteralPath $final) { [System.IO.File]::Replace($temporary, $final, [System.Management.Automation.Language.NullString]::Value) }
    else { [System.IO.File]::Move($temporary, $final) }
}

function Confirm-Archive([string]$ArchivePath, $Metadata) {
    if (-not (Test-Path -LiteralPath $ArchivePath -PathType Leaf)) { return $false }
    $path = Confirm-LocalPath $ArchivePath
    return (Get-Item -LiteralPath $path).Length -eq [long]$Metadata.bytes -and (Get-FileHash -LiteralPath $path -Algorithm SHA256).Hash -eq $Metadata.sha256
}

$lock = $null
$report = [ordered]@{ status = 'failed'; checked_at_utc = [DateTime]::UtcNow.ToString('o'); downloaded = 0; verified = 0; deleted_expired_files = 0; retention_days = 30; archives = @() }
try {
    $lock = [System.IO.File]::Open((Join-Path $destinationPath '.pull.lock'), [System.IO.FileMode]::OpenOrCreate, [System.IO.FileAccess]::ReadWrite, [System.IO.FileShare]::None)
    $remoteFiles = @(& $ssh @connection -p 58300 'deploy@101.50.1.15' "find /opt/skomda-demo/backups -maxdepth 1 -type f -printf '%f\n'")
    if ($LASTEXITCODE -ne 0) { throw 'Unable to list encrypted VPS backups using the trusted SSH connection.' }
    $archives = @($remoteFiles | Where-Object { $_ -match $archivePattern } | Sort-Object -Unique)
    if ($archives.Count -eq 0) { throw 'No validated encrypted backup filenames were found.' }
    foreach ($archiveName in $archives) {
        $null = $archiveName -match $archivePattern
        $stamp = $Matches[1]
        $null = [DateTime]::ParseExact($stamp, 'yyyyMMddTHHmmssZ', [System.Globalization.CultureInfo]::InvariantCulture, [System.Globalization.DateTimeStyles]::AssumeUniversal)
        $metadataName = "$stamp.dump.json"
        if ($remoteFiles -notcontains $metadataName) { throw 'An encrypted backup is missing its matching metadata.' }
        $archivePath = Confirm-LocalPath (Join-Path $destinationPath $archiveName)
        $metadataPath = Confirm-LocalPath (Join-Path $destinationPath $metadataName)
        $nonce = [Guid]::NewGuid().ToString('N')
        $pendingArchive = Confirm-LocalPath (Join-Path $destinationPath ".$archiveName.$nonce.pending")
        $pendingMetadata = Confirm-LocalPath (Join-Path $destinationPath ".$metadataName.$nonce.pending")
        try {
            & $scp @connection -q -P 58300 "deploy@101.50.1.15:/opt/skomda-demo/backups/$metadataName" $pendingMetadata
            if ($LASTEXITCODE -ne 0) { throw 'Encrypted backup metadata transfer failed.' }
            if ((Get-Item -LiteralPath $pendingMetadata).Length -gt 65536) { throw 'Backup metadata is unexpectedly large.' }
            $metadata = Get-Content -LiteralPath $pendingMetadata -Raw | ConvertFrom-Json
            if ($metadata.created_at_utc -ne $stamp -or $metadata.sha256 -notmatch '^[a-fA-F0-9]{64}$' -or [long]$metadata.bytes -lt 1024 -or [long]$metadata.bytes -gt 10737418240) {
                throw 'Backup metadata failed timestamp, size or hash validation.'
            }
            if (-not (Confirm-Archive $archivePath $metadata)) {
                & $scp @connection -q -P 58300 "deploy@101.50.1.15:/opt/skomda-demo/backups/$archiveName" $pendingArchive
                if ($LASTEXITCODE -ne 0) { throw 'Encrypted archive transfer failed.' }
                if (-not (Confirm-Archive $pendingArchive $metadata)) { throw 'Encrypted archive failed SHA256 or byte-size verification.' }
                Complete-AtomicFile $pendingArchive $archivePath
                $report.downloaded++
            }
            Complete-AtomicFile $pendingMetadata $metadataPath
            $report.verified++
            $report.archives += $archiveName
        } finally {
            foreach ($pending in @($pendingArchive, $pendingMetadata)) {
                $validated = Confirm-LocalPath $pending
                if (Test-Path -LiteralPath $validated -PathType Leaf) { Remove-Item -LiteralPath $validated -Force }
            }
        }
    }
    $cutoff = [DateTime]::UtcNow.AddDays(-30)
    foreach ($item in Get-ChildItem -LiteralPath $destinationPath -File) {
        if ($item.Name -notmatch $generatedPattern) { continue }
        $stamp = $Matches[1]
        try { $created = [DateTime]::ParseExact($stamp, 'yyyyMMddTHHmmssZ', [System.Globalization.CultureInfo]::InvariantCulture, ([System.Globalization.DateTimeStyles]::AssumeUniversal -bor [System.Globalization.DateTimeStyles]::AdjustToUniversal)) }
        catch { continue }
        if ($created -lt $cutoff) {
            $validated = Confirm-LocalPath $item.FullName
            Remove-Item -LiteralPath $validated -Force
            $report.deleted_expired_files++
        }
    }
    $report.status = 'ok'
} catch {
    # Error category is recorded without command output, credentials or contents.
    $report.error_category = $_.Exception.GetType().Name
    throw
} finally {
    if ($null -ne $lock) {
        try {
            $statusPath = Join-Path $destinationPath 'pull-encrypted-backups-status.json'
            $statusPending = Join-Path $destinationPath '.pull-encrypted-backups-status.pending'
            [System.IO.File]::WriteAllText((Confirm-LocalPath $statusPending), ($report | ConvertTo-Json -Depth 4))
            Complete-AtomicFile $statusPending $statusPath
        } finally { $lock.Dispose() }
    }
}
$report | ConvertTo-Json -Depth 4
