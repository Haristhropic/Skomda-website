#!/usr/bin/env python3
"""Read-only operational snapshot for the SKOMDA Linux VPS (stdlib only)."""

import argparse
from datetime import datetime, timezone
import http.client
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
import urllib.error
import urllib.request


INSPECT_FORMAT = (
    '{"status":{{json .State.Status}},'
    '"health":{{if .State.Health}}{{json .State.Health.Status}}{{else}}null{{end}},'
    '"restarts":{{.RestartCount}},"oom_killed":{{.State.OOMKilled}},'
    '"image":{{json .Config.Image}}}'
)


class CheckError(Exception):
    """Safe diagnostic message, without command output or environment values."""


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def command(arguments, directory):
    try:
        result = subprocess.run(
            arguments, cwd=directory, capture_output=True, text=True,
            timeout=15, check=False,
        )
    except (OSError, subprocess.TimeoutExpired) as error:
        raise CheckError("docker_command_unavailable_or_timeout") from error
    if result.returncode:
        # Docker/Compose errors can include configuration values: do not echo them.
        raise CheckError("docker_command_failed_check_permissions_and_compose_files")
    return result.stdout


def container_snapshot(directory, tunnel_name):
    containers = []
    active_path = directory / ".active-slot"
    active = active_path.read_text().strip() if active_path.exists() else ""
    if active and active not in ("blue", "green"):
        raise CheckError("invalid_active_release_slot")
    if active:
        os.environ["RELEASE_SLOT"] = active
        os.environ["IMAGE_TAG"] = (directory / ".deployed-image-tag").read_text().strip()
    services = ("backend-a", "backend-b", "frontend-a", "frontend-b") if active else ("backend", "frontend")
    compose = ["docker", "compose"] + (["-f", "compose.release.yaml"] if active else [])
    for service in services:
        if active:
            ids = command(compose + ["--env-file", "deploy.env", "ps", "--all", "--quiet", service], directory).split()
        else:
            # During first cutover the new infrastructure Compose no longer owns
            # the still-serving legacy application containers.
            ids = command(["docker", "ps", "--all", "--quiet", "--filter",
                           "name=^/skomda-demo-" + service + "-1$"], directory).split()
        if len(ids) != 1:
            containers.append({"service": service, "status": "missing_or_multiple"})
            continue
        container = json.loads(command([
            "docker", "inspect", "--format", INSPECT_FORMAT, ids[0],
        ], directory))
        container["service"] = service
        container["requires_health"] = True
        containers.append(container)
    for service in ("edge", "redis", "prometheus", "nginx-exporter", "loki", "grafana"):
        ids = command(["docker", "ps", "--all", "--quiet", "--filter",
                       "name=^/skomda-infra-" + service + "-1$"], directory).split()
        if len(ids) != 1:
            containers.append({"service": service, "status": "missing_or_multiple"})
            continue
        container = json.loads(command(["docker", "inspect", "--format", INSPECT_FORMAT, ids[0]], directory))
        container["service"] = service
        container["requires_health"] = service in ("edge", "redis")
        containers.append(container)
    # cloudflared is intentionally a separate container in the current deployment.
    ids = command([
        "docker", "ps", "--all", "--quiet", "--filter", "name=^/" + tunnel_name + "$",
    ], directory).split()
    if len(ids) != 1:
        containers.append({"service": "cloudflared", "status": "missing_or_multiple"})
    else:
        tunnel = json.loads(command([
            "docker", "inspect", "--format", INSPECT_FORMAT, ids[0],
        ], directory))
        tunnel["service"] = "cloudflared"
        containers.append(tunnel)
    return containers


def resource_snapshot(directory):
    disk = shutil.disk_usage(directory)
    memory = {}
    for line in Path("/proc/meminfo").read_text().splitlines():
        key, value = line.split(":", 1)
        if key in ("MemTotal", "MemAvailable"):
            memory[key] = int(value.split()[0]) * 1024
    total = memory.get("MemTotal", 0)
    available = memory.get("MemAvailable")
    if not total or available is None:
        raise CheckError("memory_metrics_unavailable")
    pid_root = Path("/sys/fs/cgroup/pids")
    pid_current = int((pid_root / "pids.current").read_text()) if (pid_root / "pids.current").exists() else None
    pid_limit_text = (pid_root / "pids.max").read_text().strip() if (pid_root / "pids.max").exists() else "max"
    pid_limit = int(pid_limit_text) if pid_limit_text.isdigit() else None
    return {
        "pid_current": pid_current,
        "pid_limit": pid_limit,
        "disk_used_percent": round(disk.used / disk.total * 100, 1),
        "disk_free_bytes": disk.free,
        "memory_available_percent": round(available / total * 100, 1),
        "memory_available_bytes": available,
        "memory_total_bytes": total,
        "load_1_5_15_minutes": list(os.getloadavg()),
    }


def http_probe(name, url, database=False, local=False):
    started = time.monotonic()
    result = {"check": name, "ok": False}
    # Local probes must not be diverted through an environment HTTP proxy.
    handlers = [NoRedirect()]
    if local:
        handlers.append(urllib.request.ProxyHandler({}))
    opener = urllib.request.build_opener(*handlers)
    request = urllib.request.Request(url, headers={
        "User-Agent": "SKOMDA-ops-status/1.0",
        "Cache-Control": "no-cache",
        "Accept": "application/json" if database else "text/html",
    })
    try:
        with opener.open(request, timeout=5) as response:
            result["http_status"] = response.status
            result["ok"] = response.status == 200
            if database:
                try:
                    body = json.loads(response.read(65537))
                    result["ok"] = (
                        result["ok"] and isinstance(body, dict)
                        and body.get("status") == "ok" and body.get("database") == "ok"
                    )
                except (ValueError, UnicodeError):
                    result["ok"] = False
                if not result["ok"]:
                    result["reason"] = "health_response_not_ready"
    except urllib.error.HTTPError as error:
        result["http_status"] = error.code
        result["reason"] = "non_200_response"
    except (OSError, urllib.error.URLError, ValueError, http.client.HTTPException):
        result["reason"] = "dns_tls_connection_or_timeout"
    result["duration_ms"] = round((time.monotonic() - started) * 1000)
    return result


def port(value):
    parsed = int(value)
    if not 1 <= parsed <= 65535:
        raise argparse.ArgumentTypeError("port must be between 1 and 65535")
    return parsed


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--deploy-dir", type=Path, default=Path("/opt/skomda-demo"))
    parser.add_argument("--frontend-port", type=port, default=3000)
    parser.add_argument("--backend-port", type=port, default=8080)
    parser.add_argument("--tunnel-container", default="skomda-cloudflared")
    parser.add_argument("--public", action="store_true", help="Also probe the three demo HTTPS URLs")
    args = parser.parse_args()
    report = {
        "timestamp_utc": datetime.now(timezone.utc).isoformat(),
        "status": "ok", "scope": "local_and_public" if args.public else "local",
        "findings": [],
    }
    if not sys.platform.startswith("linux") or not args.deploy_dir.is_dir():
        report.update(status="check_error", findings=["linux_vps_and_deploy_directory_required"])
        print(json.dumps(report, indent=2))
        return 2
    try:
        report["resources"] = resource_snapshot(args.deploy_dir)
        report["containers"] = container_snapshot(args.deploy_dir, args.tunnel_container)
    except (CheckError, OSError, ValueError) as error:
        reason = str(error) if isinstance(error, CheckError) else "snapshot_unavailable"
        report.update(status="check_error", findings=[reason])
        print(json.dumps(report, indent=2))
        return 2

    edge = command(["docker", "ps", "--quiet", "--filter", "name=^/skomda-infra-edge-1$"], args.deploy_dir).strip()
    address = command(["docker", "inspect", "--format", '{{(index .NetworkSettings.Networks "skomda-runtime").IPAddress}}', edge], args.deploy_dir).strip() if edge else "127.0.0.1"
    frontend_port = 3000 if edge else args.frontend_port
    backend_port = 8080 if edge else args.backend_port
    report["probes"] = [
        http_probe("local_frontend", f"http://{address}:{frontend_port}/", local=True),
        http_probe("local_backend", f"http://{address}:{backend_port}/api/health", database=True, local=True),
    ]
    if args.public:
        report["probes"].extend([
            http_probe("public_frontend", "https://linear.smktelkom-sidoarjo.my.id/"),
            http_probe("public_proxy", "https://linear.smktelkom-sidoarjo.my.id/api/backend/health", database=True),
            http_probe("public_backend", "https://api-linear.smktelkom-sidoarjo.my.id/api/health", database=True),
        ])
    findings = report["findings"]
    for container in report["containers"]:
        service = container["service"]
        if container["status"] != "running" or container.get("oom_killed"):
            findings.append(service + ":not_running_or_oom")
        elif container.get("requires_health") and container.get("health") != "healthy":
            findings.append(service + ":not_healthy")
    for probe in report["probes"]:
        if not probe["ok"]:
            findings.append(probe["check"] + ":failed")
    resources = report["resources"]
    if resources.get("pid_limit") and resources["pid_current"] >= resources["pid_limit"] * 0.9:
        findings.append("processes:warning_over_90_percent_of_provider_limit")
    if resources["disk_used_percent"] >= 90:
        findings.append("disk:critical_over_90_percent")
    elif resources["disk_used_percent"] >= 80:
        findings.append("disk:warning_over_80_percent")
    if resources["memory_available_percent"] <= 5:
        findings.append("memory:critical_available_under_5_percent")
    elif resources["memory_available_percent"] <= 15:
        findings.append("memory:warning_available_under_15_percent")
    if findings:
        report["status"] = "attention_needed"
    print(json.dumps(report, indent=2))
    return 1 if findings else 0


if __name__ == "__main__":
    sys.exit(main())
