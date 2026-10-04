#!/usr/bin/env python3
"""Provision a private runtime password, prove grants, then atomically update env."""
import os
from pathlib import Path
import secrets
import subprocess
from urllib.parse import quote, urlsplit, urlunsplit

os.umask(0o077)
root = Path('/opt/skomda-demo')
os.chdir(root)

def env_value(path, name):
    for line in path.read_text().splitlines():
        if line.startswith(name + '='):
            value = line.split('=', 1)[1].strip()
            return value[1:-1] if len(value) >= 2 and value[0] == value[-1] and value[0] in '\"\'' else value
    raise RuntimeError('Required private configuration is absent')

def sql(envfile, statement):
    result = subprocess.run(['docker', 'run', '--rm', '-i', '--env-file', str(envfile), '--entrypoint', '/bin/sh', 'postgres:17-alpine', '-c', 'exec psql "$DATABASE_URL" -X -v ON_ERROR_STOP=1 -At'], input=statement, text=True, capture_output=True, timeout=90)
    if result.returncode:
        raise RuntimeError('Database verification failed; runtime env has not been switched')
    return result.stdout.strip()

runtime_env = root / 'backend/.env'
current = env_value(runtime_env, 'DATABASE_URL')
if (urlsplit(current).username or '').startswith('skomda_runtime.'):
    print('RUNTIME_ROLE_ALREADY_CONFIGURED')
    raise SystemExit(0)
admin_env = root / 'backend/migrate.env'
url = urlsplit(env_value(admin_env, 'DATABASE_URL'))
if '.pooler.supabase.com' not in (url.hostname or ''):
    raise RuntimeError('Expected the verified session pooler configuration')
project = (url.username or '').split('.', 1)[1]
password = secrets.token_hex(32)
sql(admin_env, f"ALTER ROLE skomda_runtime LOGIN PASSWORD '{password}';\n")
netloc = f"skomda_runtime.{project}:{quote(password, safe='')}@{url.hostname}:{url.port or 5432}"
new_url = urlunsplit((url.scheme, netloc, url.path, url.query, url.fragment))
check_env = root / 'secrets/runtime-check.env'
check_env.write_text('DATABASE_URL='+new_url+'\n')
check_env.chmod(0o600)
try:
    answer = sql(check_env, """
SELECT current_user;
SELECT rolsuper OR rolbypassrls OR rolcreatedb OR rolcreaterole FROM pg_roles WHERE rolname=current_user;
SELECT count(*) FROM users;
SELECT count(*) FROM news;
SELECT count(*) FROM trial_class_registrations;
BEGIN;
INSERT INTO audit_logs (action,entity,details,created_at) VALUES ('runtime_permission_probe','system','rollback-only',NOW());
ROLLBACK;
SELECT has_schema_privilege(current_user,'public','CREATE');
SELECT has_table_privilege(current_user,'users','DELETE');
SELECT has_table_privilege(current_user,'bkk_alumnis','SELECT');
""")
    fields = answer.splitlines()
    if fields[0] != 'skomda_runtime' or fields[1] != 'f' or fields[-3:] != ['f','f','f']:
        raise RuntimeError('Runtime role has unexpected effective permissions')
    backup = root / 'backend/.env.before-runtime-role'
    if not backup.exists(): backup.write_bytes(runtime_env.read_bytes())
    backup.chmod(0o600)
    lines = [line for line in runtime_env.read_text().splitlines() if not line.startswith('DATABASE_URL=')]
    lines.append('DATABASE_URL='+new_url)
    temp = runtime_env.with_name('.env.next')
    temp.write_text('\n'.join(lines)+'\n'); temp.chmod(0o600)
    temp.replace(runtime_env)
    print('RUNTIME_ROLE_VERIFIED_AND_CONFIGURED_NO_APPLICATION_DATA_CHANGED')
finally:
    check_env.unlink(missing_ok=True)
