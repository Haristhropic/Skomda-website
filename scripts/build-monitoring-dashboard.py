#!/usr/bin/env python3
"""Generate provisioned read-only Grafana dashboard from bounded metric queries."""
import json
from pathlib import Path

panels = []
queries = [
    ('API requests per second', 'sum(rate(skomda_http_requests_total[1m]))', 'reqps'),
    ('API HTTP 5xx (%)', '100 * (sum(rate(skomda_http_requests_total{status=~"5.."}[5m])) or vector(0)) / clamp_min(sum(rate(skomda_http_requests_total[5m])), 0.01)', 'percent'),
    ('API p95 latency', 'histogram_quantile(0.95, sum by (le) (rate(skomda_http_request_duration_seconds_bucket[5m])))', 's'),
    ('Nginx connections', 'nginx_connections_active', 'short'),
    ('API heap by replica', 'skomda_go_memory_bytes', 'bytes'),
    ('API goroutines by replica', 'skomda_go_goroutines', 'short'),
    ('VPS available RAM', 'skomda_host_memory_available_bytes', 'bytes'),
    ('VPS PID/thread usage (%)', '100 * skomda_host_pids_current / skomda_host_pids_max', 'percent'),
    ('VPS disk available', 'skomda_host_disk_available_bytes', 'bytes'),
    ('VPS CPU busy (%)', '100 * (1 - sum(rate(skomda_host_cpu_seconds_total{mode="idle"}[5m])) / clamp_min(sum(rate(skomda_host_cpu_seconds_total[5m])), 0.01))', 'percent'),
    ('Encrypted database backup age', 'skomda_host_backup_age_seconds', 's'),
    ('Available backend replicas', 'sum(up{job="skomda-backend"})', 'short'),
]
for index, (title, expr, unit) in enumerate(queries):
    panels.append({'id': index+1, 'title': title, 'type': 'timeseries',
                   'datasource': {'type':'prometheus','uid':'prometheus'},
                   'gridPos': {'x':(index%2)*12,'y':(index//2)*8,'w':12,'h':8},
                   'targets':[{'refId':'A','expr':expr,'legendFormat':'{{instance}}'}],
                   'fieldConfig':{'defaults':{'unit':unit},'overrides':[]},
                   'options': {'legend':{'displayMode':'list','placement':'bottom'}}})
panels.append({'id':len(queries)+1,'title':'Safe HTTP metadata (no paths, identities, bodies, or IPs)', 'type':'logs',
               'datasource':{'type':'loki','uid':'loki'},'gridPos':{'x':0,'y':((len(queries)+1)//2)*8,'w':24,'h':10},
               'targets':[{'refId':'A','expr':'{service="edge"} | json'}], 'options':{'showTime':True,'sortOrder':'Descending'}})
document = {'uid':'skomda-operations','title':'SKOMDA operations','schemaVersion':39,'version':1,
            'editable':False,'refresh':'15s','time':{'from':'now-1h','to':'now'},'tags':['skomda'], 'panels':panels}
directory = Path('deploy/grafana/dashboards'); directory.mkdir(parents=True,exist_ok=True)
(directory/'operations.json').write_text(json.dumps(document,indent=2)+'\n',encoding='utf8')
