#!/usr/bin/env python3
"""Bounded read-only role/Grafana audit of the demo VPS. Never records tokens/PII."""
import argparse
import asyncio
import datetime
import json
import os
from pathlib import Path
import aiohttp

ORIGIN = 'https://linear.smktelkom-sidoarjo.my.id'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36'

async def audit(args):
    email = os.environ.pop('SKOMDA_AUDIT_EMAIL', '')
    password = os.environ.pop('SKOMDA_AUDIT_PASSWORD', '')
    if not email or not password:
        raise RuntimeError('Set SKOMDA_AUDIT_EMAIL and SKOMDA_AUDIT_PASSWORD privately')
    checks = []
    async with aiohttp.ClientSession(headers={'User-Agent': UA, 'Origin': ORIGIN},
                                     timeout=aiohttp.ClientTimeout(total=15)) as session:
        async with session.post(ORIGIN+'/api/backend/auth/login', json={'email':email,'password':password}) as response:
            status = response.status
            body = await response.json(content_type=None)
            role = body.get('user',{}).get('role')
            checks.append({'check':'login','status':status,'role':role,'ok':status==200 and role==args.role})
        password = ''
        if status != 200:
            return {'checks':checks, 'ok':False}
        routes = [
            ('identity','/api/backend/auth/me',200),
            ('monitoring','/api/backend/admin/monitoring',200 if role=='super_admin' else 403),
            ('content_read','/api/backend/admin/news',200 if role=='editor' else 403),
            ('grafana_health','/api/observability/grafana/api/health',200 if role=='super_admin' else 403),
            ('grafana_user','/api/observability/grafana/api/user',200 if role=='super_admin' else 403),
            ('grafana_admin_settings','/api/observability/grafana/api/admin/settings',403),
            ('grafana_metrics','/api/observability/grafana/api/datasources/proxy/uid/prometheus/api/v1/query?query=up',200 if role=='super_admin' else 403),
            ('grafana_logs','/api/observability/grafana/api/datasources/proxy/uid/loki/loki/api/v1/query_range?query=%7Bservice%3D%22edge%22%7D&limit=1',200 if role=='super_admin' else 403),
        ]
        for name, route, expected in routes:
            async with session.get(ORIGIN+route, allow_redirects=False) as response:
                data = await response.read()
                ok = response.status == expected
                if name=='grafana_user' and expected==200:
                    user=json.loads(data)
                    ok=ok and user.get('login')==email and not user.get('isGrafanaAdmin',False)
                if name in ('grafana_metrics','grafana_logs') and expected==200:
                    payload=json.loads(data)
                    ok=ok and payload.get('status')=='success' and bool(payload.get('data',{}).get('result'))
                checks.append({'check':name,'status':response.status,'expected':expected,'ok':ok})
        if role=='super_admin':
            for method,route in [('POST','/api/backend/news'),('PUT','/api/backend/news/0'),('DELETE','/api/backend/news/0')]:
                async with session.request(method,ORIGIN+route,json={}) as response:
                    await response.read()
                    checks.append({'check':'super_content_mutation_'+method.lower(),'status':response.status,'expected':403,'ok':response.status==403})
        async with session.post(ORIGIN+'/api/backend/auth/logout', headers={'Origin':'https://untrusted.invalid'}) as response:
            await response.read()
            checks.append({'check':'authenticated_csrf','status':response.status,'expected':403,'ok':response.status==403})
        async with session.post(ORIGIN+'/api/backend/auth/logout') as response:
            await response.read()
            checks.append({'check':'logout','status':response.status,'expected':200,'ok':response.status==200})
    return {'checks':checks, 'ok':all(x['ok'] for x in checks)}

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--role',choices=('super_admin','editor'),required=True)
    parser.add_argument('--revision',required=True)
    parser.add_argument('--output',type=Path,required=True)
    args=parser.parse_args()
    report=asyncio.run(audit(args))
    report.update(timestamp_utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),revision=args.revision,target=ORIGIN)
    args.output.parent.mkdir(parents=True,exist_ok=True)
    args.output.write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
    print(json.dumps(report,indent=2))
    return 0 if report['ok'] else 1

if __name__=='__main__':
    raise SystemExit(main())
