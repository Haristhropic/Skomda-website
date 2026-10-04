#!/usr/bin/env python3
"""Daily encrypted PostgreSQL backup, integrity tag and seven-day local retention."""
import datetime
import hashlib
import hmac
import json
import os
from pathlib import Path
import secrets
import subprocess

ROOT = Path('/opt/skomda-demo')
os.chdir(ROOT)
os.umask(0o077)
directory = ROOT / 'backups'; directory.mkdir(mode=0o700,exist_ok=True)
key = ROOT / 'secrets/backup.pass'
if not key.exists(): key.write_text(secrets.token_hex(32)); key.chmod(0o600)
stamp = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
encrypted = directory / (stamp+'.dump.enc')
raw = directory / (stamp+'.dump.pending')
try:
    with raw.open('wb') as target:
        subprocess.run(['docker','run','--rm','--env-file','backend/migrate.env','--entrypoint','/bin/sh','postgres:17-alpine','-c','exec pg_dump "$DATABASE_URL" --format=custom --no-owner --schema=public --schema=skomda_internal'],stdout=target,check=True,timeout=120)
    if raw.stat().st_size < 1024: raise RuntimeError('Backup archive is unexpectedly small')
    subprocess.run(['openssl','enc','-aes-256-cbc','-pbkdf2','-iter','200000','-salt','-in',str(raw),'-out',str(encrypted),'-pass','file:'+str(key)],check=True,timeout=60)
    payload = encrypted.read_bytes()
    metadata = {'created_at_utc':stamp,'bytes':len(payload),'sha256':hashlib.sha256(payload).hexdigest(),
                'hmac_sha256':hmac.new(key.read_bytes(),payload,hashlib.sha256).hexdigest(),
                'encryption':'AES-256-CBC/PBKDF2-200000 + encrypt-then-HMAC-SHA256',
                'scope':'public+skomda_internal','offsite_status':'requires independent transfer'}
    encrypted.with_suffix('.json').write_text(json.dumps(metadata,indent=2)+'\n')
    # Delete only exact generated archive/metadata names in this fixed backup directory.
    cutoff = datetime.datetime.now(datetime.timezone.utc)-datetime.timedelta(days=7)
    for item in directory.iterdir():
        if item.name[:16].endswith('Z') and item.suffix in ('.enc','.json') and item.stat().st_mtime < cutoff.timestamp():
            item.unlink()
    print(json.dumps({'status':'ok','archive':encrypted.name,'bytes':len(payload)}))
finally:
    raw.unlink(missing_ok=True)
