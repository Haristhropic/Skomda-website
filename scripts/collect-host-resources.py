#!/usr/bin/env python3
"""Bounded Linux host telemetry during an authorized VPS load test; no secrets."""
import argparse
import datetime
import json
import os
from pathlib import Path
import shutil
import time


def sample(root):
    memory = {}
    for line in Path('/proc/meminfo').read_text().splitlines():
        name, value = line.split(':', 1)
        if name in ('MemTotal', 'MemAvailable'):
            memory[name] = int(value.split()[0]) * 1024
    ticks = list(map(int, Path('/proc/stat').read_text().splitlines()[0].split()[1:9]))
    disk = shutil.disk_usage(root)
    return {
        'timestamp_utc': datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'cpu_total_ticks': sum(ticks), 'cpu_idle_ticks': ticks[3] + ticks[4],
        'memory_available_bytes': memory['MemAvailable'], 'memory_total_bytes': memory['MemTotal'],
        'disk_available_bytes': disk.free, 'load': os.getloadavg(),
        'pid_current': int(Path('/sys/fs/cgroup/pids/pids.current').read_text()),
        'pid_limit': Path('/sys/fs/cgroup/pids/pids.max').read_text().strip(),
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--seconds', type=int, default=600)
    parser.add_argument('--interval', type=int, default=5)
    parser.add_argument('--root', type=Path, default=Path('/opt/skomda-demo'))
    parser.add_argument('--output', type=Path, required=True)
    args = parser.parse_args()
    if not 10 <= args.seconds <= 1800 or not 5 <= args.interval <= 60:
        parser.error('duration10..1800 seconds, interval5..60 seconds')
    os.umask(0o077)
    report = {'deployed_image_tag': (args.root / '.deployed-image-tag').read_text().strip(), 'samples': []}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    deadline = time.monotonic() + args.seconds
    while True:
        row = sample(args.root)
        if report['samples']:
            before = report['samples'][-1]
            total = row['cpu_total_ticks'] - before['cpu_total_ticks']
            idle = row['cpu_idle_ticks'] - before['cpu_idle_ticks']
            row['cpu_busy_percent'] = round(100 * (1 - idle / max(total, 1)), 2)
        report['samples'].append(row)
        pending = args.output.with_suffix('.pending')
        pending.write_text(json.dumps(report, indent=2) + '\n')
        pending.replace(args.output)
        if time.monotonic() >= deadline:
            break
        time.sleep(min(args.interval, max(0, deadline - time.monotonic())))
    print(json.dumps({'samples': len(report['samples']), 'peak_pid': max(x['pid_current'] for x in report['samples']),
                      'minimum_memory_available_bytes': min(x['memory_available_bytes'] for x in report['samples']),
                      'peak_cpu_busy_percent': max(x.get('cpu_busy_percent', 0) for x in report['samples'])}))


if __name__ == '__main__':
    main()
