#!/usr/bin/env python3
"""Private host resource counters. Reads no application environment or personal data."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import shutil
import time
import re


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_):
        pass

    def do_GET(self):
        if self.path != '/metrics':
            self.send_error(404); return
        memory = {}
        for line in Path('/proc/meminfo').read_text().splitlines():
            name, value = line.split(':', 1)
            if name in ('MemTotal','MemAvailable'): memory[name] = int(value.split()[0])*1024
        disk = shutil.disk_usage('/opt/skomda-demo')
        cpu = Path('/proc/stat').read_text().splitlines()[0].split()[1:]
        rows = [f'skomda_host_memory_total_bytes {memory["MemTotal"]}',
                f'skomda_host_memory_available_bytes {memory["MemAvailable"]}',
                f'skomda_host_disk_total_bytes {disk.total}', f'skomda_host_disk_available_bytes {disk.free}']
        for mode, ticks in zip(('user','nice','system','idle','iowait','irq','softirq','steal'),cpu):
            rows.append(f'skomda_host_cpu_seconds_total{{mode="{mode}"}} {int(ticks)/100}')
        for name in ('current','max'):
            value=Path('/sys/fs/cgroup/pids/pids.'+name).read_text().strip()
            if value.isdigit(): rows.append(f'skomda_host_pids_{name} {value}')
        backups = [item.stat().st_mtime for item in Path('/opt/skomda-demo/backups').glob('*.dump.enc')
                   if re.fullmatch(r'\d{8}T\d{6}Z\.dump\.enc', item.name)]
        rows.append(f'skomda_host_backup_age_seconds {max(0, time.time() - max(backups)) if backups else 1e9}')
        data=('\n'.join(rows)+'\n').encode()
        self.send_response(200); self.send_header('Content-Type','text/plain; version=0.0.4')
        self.send_header('Content-Length',str(len(data))); self.end_headers(); self.wfile.write(data)


if __name__ == '__main__':
    ThreadingHTTPServer(('172.29.0.1',9100),Handler).serve_forever()
