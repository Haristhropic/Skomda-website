#!/usr/bin/env python3
"""One request/second continuity probe during a demo blue/green deployment."""
import argparse
import asyncio
from collections import Counter
from datetime import datetime, timezone
import json
from pathlib import Path
import time

import aiohttp

FRONTEND = "https://linear.smktelkom-sidoarjo.my.id"
API = "https://api-linear.smktelkom-sidoarjo.my.id/api"
TARGETS = (("frontend", FRONTEND + "/"), ("direct_api", API + "/jurusan"), ("proxy_api", FRONTEND + "/api/backend/jurusan"))
BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"


async def persist(path, report):
    """Atomic reports; a transient Windows reader/AV lock must not end probing."""
    temporary = path.with_suffix(path.suffix + ".pending")
    for attempt in range(3):
        try:
            temporary.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
            temporary.replace(path)
            return True
        except OSError as error:
            if attempt == 2:
                report["report_write_errors"] = report.get("report_write_errors", 0) + 1
                print(json.dumps({"report_write_error": type(error).__name__, "errno": error.errno, "samples_in_memory": len(report["samples"])}), flush=True)
                return False
            await asyncio.sleep(0.05 * (attempt + 1))


async def run(args):
    rows = []
    report = {"old_revision": args.old_revision, "new_revision": args.new_revision, "started_at_utc": datetime.now(timezone.utc).isoformat(), "model": "sequential GET, maximum1 request/second, fixed owned demo URLs", "finished": False, "failures": 0, "samples": rows}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    deadline = time.perf_counter() + args.seconds
    async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=10), cookie_jar=aiohttp.DummyCookieJar(), headers={"User-Agent": BROWSER_UA}) as session:
        while time.perf_counter() < deadline and not args.stop_file.exists():
            target, url = TARGETS[len(rows) % len(TARGETS)]
            started = time.perf_counter()
            row = {"utc": datetime.now(timezone.utc).isoformat(), "target": target, "status": 0, "passed": False}
            try:
                async with session.get(url, allow_redirects=False) as response:
                    chunks = []
                    received = 0
                    async for chunk in response.content.iter_chunked(64 * 1024):
                        received += len(chunk)
                        chunks.append(chunk)
                        if received > 4 * 1024 * 1024:
                            break
                    body = b"".join(chunks)
                    row.update({"status": response.status, "bytes": len(body), "cf_cache_status": response.headers.get("cf-cache-status"), "waf_challenge": bool(response.headers.get("cf-mitigated")), "instance": response.headers.get("x-instance-id"), "request_id": response.headers.get("x-request-id")})
                    content_type = response.headers.get("content-type", "").lower()
                    row["passed"] = response.status == 200 and not row["waf_challenge"] and received <= 4 * 1024 * 1024
                    if target == "frontend":
                        row["passed"] = row["passed"] and "text/html" in content_type and b"<html" in body.lower()
                    else:
                        try:
                            payload = json.loads(body)
                            row["passed"] = row["passed"] and "application/json" in content_type and isinstance(payload, dict) and "data" in payload and "error" not in payload
                        except ValueError:
                            row["passed"] = False
            except (aiohttp.ClientError, asyncio.TimeoutError, OSError) as error:
                row["error_type"] = type(error).__name__
            row["duration_ms"] = round((time.perf_counter() - started) * 1000, 2)
            rows.append(row)
            report["failures"] = sum(not r["passed"] for r in rows)
            await persist(args.output, report)
            if len(rows) % 20 == 0 or not row["passed"]:
                print(json.dumps({"samples": len(rows), "failures": report["failures"], "last": row}), flush=True)
            await asyncio.sleep(max(0, 1 - (time.perf_counter() - started)))
    report["finished"] = True
    report["finished_at_utc"] = datetime.now(timezone.utc).isoformat()
    report["passed"] = bool(rows) and report.get("failures", 0) == 0
    report["statuses"] = dict(Counter(str(r["status"]) for r in rows))
    report["per_target"] = {}
    for target, _ in TARGETS:
        samples = [r for r in rows if r["target"] == target]
        durations = sorted(r["duration_ms"] for r in samples)
        report["per_target"][target] = {"samples": len(samples), "failures": sum(not r["passed"] for r in samples), "p95_ms": durations[max(0, __import__('math').ceil(len(durations) * .95) - 1)] if durations else None}
    if not await persist(args.output, report):
        recovery = args.output.with_name(args.output.stem + "-recovery-" + datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ") + ".json")
        recovery.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
        print(json.dumps({"recovery_output": str(recovery)}), flush=True)
    print(json.dumps({"complete": True, "samples": len(rows), "failures": report["failures"], "passed": report["passed"], "output": str(args.output)}), flush=True)
    return 0 if report["passed"] else 1


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--confirm-owned-demo", action="store_true")
    parser.add_argument("--old-revision", required=True)
    parser.add_argument("--new-revision", required=True)
    parser.add_argument("--seconds", type=int, default=1200)
    parser.add_argument("--output", type=Path, default=Path("artifacts/deploy-availability.json"))
    parser.add_argument("--stop-file", type=Path, default=Path("artifacts/deploy-availability.stop"))
    args = parser.parse_args()
    if not args.confirm_owned_demo or not 10 <= args.seconds <= 3600:
        parser.error("owned demo confirmation required; duration must be10..3600 seconds")
    raise SystemExit(asyncio.run(run(args)))
