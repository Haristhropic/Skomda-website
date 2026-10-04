[CmdletBinding()]
param()
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$operationDirectory = [System.IO.Path]::GetFullPath((Join-Path $env:LOCALAPPDATA 'Skomda-operations'))
New-Item -ItemType Directory -Path $operationDirectory -Force | Out-Null
if ((Get-Item -LiteralPath $operationDirectory).Attributes -band [System.IO.FileAttributes]::ReparsePoint) { throw 'Operations directory must not be a symlink or junction.' }
$installedScript = Join-Path $operationDirectory 'pull-encrypted-backups.ps1'
Copy-Item -LiteralPath (Join-Path $PSScriptRoot 'pull-encrypted-backups.ps1') -Destination $installedScript -Force
$powershell = Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe'
$action = New-ScheduledTaskAction -Execute $powershell -Argument "-NoProfile -NonInteractive -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$installedScript`"" -WorkingDirectory (Join-Path $env:SystemRoot 'System32')
$triggers = @(New-ScheduledTaskTrigger -Daily -At '03:00'; New-ScheduledTaskTrigger -AtLogOn -User ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name))
$principal = New-ScheduledTaskPrincipal -UserId ([System.Security.Principal.WindowsIdentity]::GetCurrent().Name) -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -ExecutionTimeLimit (New-TimeSpan -Minutes 10) -MultipleInstances IgnoreNew -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
try {
    Register-ScheduledTask -TaskName 'Skomda encrypted backup pull' -Action $action -Trigger $triggers -Principal $principal -Settings $settings -Description 'Pull and verify encrypted SKOMDA backups to this PC, retaining 30 days. No decryption.' -Force | Out-Null
    $registered = Get-ScheduledTask -TaskName 'Skomda encrypted backup pull'
    if ($registered.Principal.LogonType -ne 'Interactive' -or $registered.Principal.RunLevel -ne 'Limited') { throw 'Registered task does not have the requested user-only permissions.' }
    [ordered]@{ status = 'registered'; task = $registered.TaskName; state = [string]$registered.State; daily_local_time = '03:00'; at_user_logon = $true; requires_logged_in_user = $true; execution_limit_minutes = 10 } | ConvertTo-Json
} catch {
    Write-Error 'Scheduled task registration failed under standard user permissions. The copied pull script remains available for manual execution; automation is not confirmed.'
    throw
}
