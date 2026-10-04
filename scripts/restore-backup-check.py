#!/usr/bin/env python3
"""Verify HMAC, decrypt, and restore only into a disposable networkless PostgreSQL."""
import argparse
import hashlib
import hmac
import json
import os
from pathlib import Path
import secrets
import subprocess
import time

parser=argparse.ArgumentParser()
parser.add_argument('archive',type=Path)
args=parser.parse_args()
root=Path('/opt/skomda-demo'); os.chdir(root); os.umask(0o077)
archive=args.archive.resolve()
if archive.parent != (root/'backups').resolve(): raise RuntimeError('Archive must be in the fixed private backup directory')
metadata=json.loads(archive.with_suffix('.json').read_text())
key=root/'secrets/backup.pass'; payload=archive.read_bytes()
expected=hmac.new(key.read_bytes(),payload,hashlib.sha256).hexdigest()
if not hmac.compare_digest(expected,metadata['hmac_sha256']): raise RuntimeError('Backup authentication failed')
raw=root/'backups/restore-check.pending'
envfile=root/'secrets/restore-check.env'
container='skomda-restore-check'
try:
    subprocess.run(['openssl','enc','-d','-aes-256-cbc','-pbkdf2','-iter','200000','-in',str(archive),'-out',str(raw),'-pass','file:'+str(key)],check=True,timeout=60)
    envfile.write_text('POSTGRES_PASSWORD='+secrets.token_hex(32)+'\n')
    subprocess.run(['docker','run','-d','--name',container,'--network','none','--memory','256m','--cpus','0.5','--env-file',str(envfile),'-v',str(raw)+':/backup.dump:ro','postgres:17-alpine'],stdout=subprocess.DEVNULL,check=True)
    for _ in range(30):
        if subprocess.run(['docker','exec',container,'pg_isready','-U','postgres'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode == 0: break
        time.sleep(1)
    else: raise RuntimeError('Isolated recovery database is not ready')
    subprocess.run(['docker','exec',container,'psql','-U','postgres','-v','ON_ERROR_STOP=1','-c','CREATE ROLE skomda_runtime NOLOGIN;'],stdout=subprocess.DEVNULL,check=True)
    subprocess.run(['docker','exec',container,'pg_restore','-U','postgres','-d','postgres','--clean','--if-exists','--no-owner','--no-acl','--exit-on-error','/backup.dump'],check=True,timeout=120)
    count=subprocess.check_output(['docker','exec',container,'psql','-U','postgres','-At','-c',"SELECT count(*) FROM pg_tables WHERE schemaname='public'; SELECT max(version_id) FROM skomda_internal.goose_db_version;"],text=True).splitlines()
    if count != ['17','2']: raise RuntimeError('Restored schema/ledger differs from expected state')
    print(json.dumps({'status':'restored_in_isolation','public_tables':17,'migration_version':2,'production_modified':False,'archive':archive.name}))
finally:
    subprocess.run(['docker','rm','-f',container],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    raw.unlink(missing_ok=True); envfile.unlink(missing_ok=True)
