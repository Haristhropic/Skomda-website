#!/usr/bin/env python3
"""Forward only allowlisted edge metadata to private Loki; never Docker env/body logs."""
import datetime
import json
import subprocess
import time
import urllib.request

result = subprocess.run(["docker", "logs", "--since", "65s", "skomda-infra-edge-1"], capture_output=True, text=True, timeout=15)
values = []
for line in result.stdout.splitlines():
    try:
        row = json.loads(line)
        # Parse then whitelist fields, excluding paths, addresses, cookies, identities.
        clean = {key: row[key] for key in ("time", "method", "status", "duration")}
        stamp = int(datetime.datetime.fromisoformat(str(clean["time"])).timestamp() * 1_000_000_000)
        values.append([str(stamp), json.dumps(clean, separators=(",", ":"))])
    except (ValueError, KeyError, TypeError):
        continue
if values:
    body = json.dumps({"streams": [{"stream": {"service": "edge"}, "values": sorted(values)}]}).encode()
    address = subprocess.check_output(["docker", "inspect", "--format", '{{(index .NetworkSettings.Networks "skomda-runtime").IPAddress}}', "skomda-infra-loki-1"], text=True, timeout=10).strip()
    request = urllib.request.Request(f"http://{address}:3100/loki/api/v1/push", data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(request, timeout=10) as response:
        if response.status != 204:
            raise RuntimeError("Loki did not accept metadata")
