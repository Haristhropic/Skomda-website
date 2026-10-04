#!/usr/bin/env python3
"""Bounded read-only HTTP load against the owned SKOMDA demo VPS.

Requires aiohttp. No cookies, credentials, mutation, or response bodies are saved.
Virtual users are paced browsing sessions, not simultaneous inflight requests.
"""

import argparse
import asyncio
from collections import Counter, defaultdict
from datetime import datetime, timezone
import json
import math
import random
from pathlib import Path
import sys
import time
from urllib.parse import urlparse

import aiohttp

FRONTEND = "https://linear.smktelkom-sidoarjo.my.id"
API = "https://api-linear.smktelkom-sidoarjo.my.id/api"
PAGES = ("/", "/program/profil-jurusan", "/informasi/berita", "/tentang-kami/profil-sekolah")
PUBLIC_API = (
    "/jurusan", "/news?status=published&page=1&limit=10", "/teachers",
    "/prestasi", "/bkk/jobs", "/bkk/partners", "/ekskul", "/fasilitas",
    "/documents", "/dtp", "/alumni?page=1&limit=10",
)
MAX_BODY = 4 * 1024 * 1024
BROWSER_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"


def percentile(values, fraction):
    if not values:
        return None
    ordered = sorted(values)
    return round(ordered[max(0, math.ceil(len(ordered) * fraction) - 1)], 2)


class Measurements:
    def __init__(self):
        self.started = time.perf_counter()
        self.rows = []
        self.inflight = 0
        self.peak_inflight = 0
        self.loop_lag = []
        self.windows = []
        self.failure_samples = []
        self.abort = asyncio.Event()
        self.abort_reason = None

    def summarize(self, rows=None, elapsed=None):
        rows = self.rows if rows is None else rows
        elapsed = elapsed or max(0.001, time.perf_counter() - self.started)
        errors = sum(not row[3] for row in rows)
        groups = defaultdict(list)
        for row in rows:
            groups[row[0]].append(row)
        return {
            "requests": len(rows), "errors": errors,
            "error_rate": round(errors / max(1, len(rows)), 5),
            "requests_per_second": round(len(rows) / elapsed, 2),
            "status_counts": dict(Counter(str(row[2]) for row in rows)),
            "per_target": {
                name: {
                    "requests": len(entries),
                    "errors": sum(not row[3] for row in entries),
                    "p50_ms": percentile([r[4] for r in entries], 0.50),
                    "p95_ms": percentile([r[4] for r in entries], 0.95),
                    "p99_ms": percentile([r[4] for r in entries], 0.99),
                    "max_ms": round(max(r[4] for r in entries), 2),
                    "bytes_received": sum(r[5] for r in entries),
                } for name, entries in sorted(groups.items())
            },
            "per_endpoint": {
                path: {
                    "requests": len(entries),
                    "errors": sum(not row[3] for row in entries),
                    "p95_ms": percentile([r[4] for r in entries], 0.95),
                } for path, entries in self._by_endpoint(rows)
            },
        }

    @staticmethod
    def _by_endpoint(rows):
        groups = defaultdict(list)
        for row in rows:
            groups[row[1]].append(row)
        return sorted(groups.items())

    def fail(self, reason):
        if not self.abort.is_set():
            self.abort_reason = reason
            self.abort.set()


async def request(session, metrics, url, target, *, record=True):
    started = time.perf_counter()
    status, okay, size = 0, False, 0
    edge = {}
    transport_error = None
    metrics.inflight += 1
    metrics.peak_inflight = max(metrics.peak_inflight, metrics.inflight)
    try:
        async with session.get(url, allow_redirects=False) as response:
            status = response.status
            # Only public diagnostic headers: never capture cookies, auth, bodies,
            # client IPs or arbitrary headers in failure evidence.
            edge = {name: response.headers[name] for name in ("Server", "CF-Ray", "CF-Mitigated") if name in response.headers}
            chunks = []
            async for chunk in response.content.iter_chunked(64 * 1024):
                size += len(chunk)
                if size > MAX_BODY:
                    raise ValueError("response exceeds bounded body limit")
                chunks.append(chunk)
            body = b"".join(chunks)
            content_type = response.headers.get("Content-Type", "").lower()
            okay = status == 200 and not response.headers.get("cf-mitigated")
            if target == "frontend":
                okay = okay and "text/html" in content_type and b"<html" in body.lower()
            else:
                okay = okay and "application/json" in content_type
                try:
                    parsed = json.loads(body)
                    okay = okay and isinstance(parsed, (dict, list))
                    if target == "health":
                        okay = okay and parsed.get("status") == "ok" and parsed.get("database") == "ok"
                    else:
                        # Public list contracts return a data collection; HTTP 200
                        # with an error envelope must not count as successful load.
                        okay = okay and isinstance(parsed, dict) and "error" not in parsed and isinstance(parsed.get("data"), (list, type(None))) and "data" in parsed
                except (ValueError, AttributeError):
                    okay = False
    except (aiohttp.ClientError, asyncio.TimeoutError, ValueError, OSError) as error:
        okay = False
        transport_error = type(error).__name__
    finally:
        metrics.inflight -= 1
    duration_ms = (time.perf_counter() - started) * 1000
    if record:
        path = urlparse(url).path + ("?" + urlparse(url).query if urlparse(url).query else "")
        metrics.rows.append((target, path, status, okay, duration_ms, size))
        if not okay and len(metrics.failure_samples) < 100:
            metrics.failure_samples.append({"observed_at_utc": datetime.now(timezone.utc).isoformat(), "target": target, "endpoint": path, "status": status, "duration_ms": round(duration_ms, 2), "public_edge_headers": edge, "transport_error_type": transport_error})
    return okay


async def user(session, metrics, user_id, args, deadline):
    # Spread arrivals; a spike is selected explicitly by its profile.
    arrival_spread = 0.1 if args.profile == "spike" and user_id >= 5 else min(args.think_seconds, args.ramp_seconds)
    await asyncio.sleep(random.random() * arrival_spread)
    iteration = 0
    while time.perf_counter() < deadline and not metrics.abort.is_set():
        page = PAGES[(user_id + iteration) % len(PAGES)]
        api_path = PUBLIC_API[(user_id + iteration) % len(PUBLIC_API)]
        await request(session, metrics, FRONTEND + page, "frontend")
        if metrics.abort.is_set():
            break
        # Both public entry paths are exercised, including Next.js same-origin proxy.
        same_origin = (user_id + iteration) % 2 == 0
        base = FRONTEND + "/api/backend" if same_origin else API
        await request(session, metrics, base + api_path, "proxy_api" if same_origin else "direct_api")
        iteration += 1
        try:
            await asyncio.wait_for(metrics.abort.wait(), timeout=args.think_seconds)
        except asyncio.TimeoutError:
            pass


def violations(summary, args):
    problems = []
    if summary["error_rate"] >= args.max_error_rate:
        problems.append("error_rate")
    for target, values in summary["per_target"].items():
        budget = args.frontend_p95_ms if target == "frontend" else args.api_p95_ms
        if values["p95_ms"] is not None and values["p95_ms"] >= budget:
            problems.append(target + "_p95")
    return problems


async def monitor(metrics, args):
    previous = 0
    bad_windows = 0
    while not metrics.abort.is_set():
        expected = time.perf_counter() + 10
        try:
            await asyncio.wait_for(metrics.abort.wait(), timeout=10)
            return
        except asyncio.TimeoutError:
            pass
        lag = max(0, time.perf_counter() - expected) * 1000
        metrics.loop_lag.append(lag)
        window = metrics.rows[previous:]
        previous = len(metrics.rows)
        summary = metrics.summarize(window, 10)
        problems = violations(summary, args) if len(window) >= 50 else []
        bad_windows = bad_windows + 1 if problems else 0
        metrics.windows.append({"observed_at_utc": datetime.now(timezone.utc).isoformat(), "requests": summary["requests"], "rps": summary["requests_per_second"], "error_rate": summary["error_rate"], "status_counts": summary["status_counts"], "inflight": metrics.inflight, "per_target": summary["per_target"], "violations": problems})
        print(json.dumps({"progress_requests": len(metrics.rows), "window_rps": summary["requests_per_second"], "window_error_rate": summary["error_rate"], "inflight": metrics.inflight, "loop_lag_ms": round(lag, 2), "violations": problems}), flush=True)
        if bad_windows >= 2:
            metrics.fail("two consecutive 10-second windows exceeded thresholds: " + ", ".join(problems))
        if lag >= 1000:
            metrics.fail("generator event loop lag >= 1000 ms; target capacity cannot be inferred")


async def run(args):
    if sys.platform == "win32":
        # Proactor is required for more than Windows select()'s 512 socket handles.
        connector = aiohttp.TCPConnector(limit=1200, limit_per_host=1200, family=2, ttl_dns_cache=300)
    else:
        connector = aiohttp.TCPConnector(limit=1200, limit_per_host=1200, ttl_dns_cache=300)
    metrics = Measurements()
    report = {
        "started_at_utc": datetime.now(timezone.utc).isoformat(),
        "revision": args.revision,
        "target_frontend": FRONTEND, "target_api": API,
        "profile": args.profile, "think_seconds": args.think_seconds,
        "limits": {"error_rate_below": args.max_error_rate, "frontend_p95_below_ms": args.frontend_p95_ms, "api_p95_below_ms": args.api_p95_ms},
        "model": "paced read-only HTTP sessions; 2 requests/iteration; no browser JS/assets/AI/uploads/writes",
        "stages": [], "passed": False,
    }
    timeout = aiohttp.ClientTimeout(total=15, connect=10, sock_read=10)
    async with aiohttp.ClientSession(connector=connector, timeout=timeout, cookie_jar=aiohttp.DummyCookieJar(), headers={"User-Agent": BROWSER_UA, "Accept": "text/html,application/json"}) as session:
        healthy = await request(session, metrics, API + "/health", "health", record=False)
        frontend_ready = await request(session, metrics, FRONTEND + "/", "frontend", record=False)
        if not healthy or not frontend_ready:
            metrics.fail("preflight frontend/API/database was not ready; no load sent")
        levels = [5] if args.profile == "smoke" else [n for n in (5, 50, 100, 250, 500, 1000) if n <= args.max_vus]
        if args.profile == "soak":
            levels = [min(args.max_vus, 100)]
        if args.profile == "spike":
            levels = [5, args.max_vus]
        monitor_task = asyncio.create_task(monitor(metrics, args))
        try:
            for vus in levels:
                if metrics.abort.is_set():
                    break
                seconds = args.hold_seconds if vus == levels[-1] else args.stage_seconds
                start_index = len(metrics.rows)
                started = time.perf_counter()
                deadline = started + seconds
                tasks = [asyncio.create_task(user(session, metrics, n, args, deadline)) for n in range(vus)]
                await asyncio.gather(*tasks)
                elapsed = time.perf_counter() - started
                summary = metrics.summarize(metrics.rows[start_index:], elapsed)
                stage_violations = violations(summary, args)
                stage = {"vus": vus, "elapsed_seconds": round(elapsed, 2), **summary, "violations": stage_violations, "passed": not stage_violations and not metrics.abort.is_set() and summary["requests"] >= vus * 2}
                report["stages"].append(stage)
                print(json.dumps({"stage_complete": stage}), flush=True)
                if not stage["passed"]:
                    metrics.fail("stage did not satisfy thresholds or coverage at " + str(vus) + " virtual users")
                # Persist progress so an operator interruption preserves completed stages.
                write_report(args.output, report)
        finally:
            monitor_task.cancel()
            await asyncio.gather(monitor_task, return_exceptions=True)
    report["finished_at_utc"] = datetime.now(timezone.utc).isoformat()
    report["aggregate"] = metrics.summarize()
    report["peak_inflight_requests"] = metrics.peak_inflight
    report["generator_loop_lag_p95_ms"] = percentile(metrics.loop_lag, 0.95)
    report["ten_second_windows"] = metrics.windows
    report["first_failure_samples"] = metrics.failure_samples
    report["abort_reason"] = metrics.abort_reason
    report["passed"] = bool(report["stages"]) and all(stage["passed"] for stage in report["stages"]) and not metrics.abort.is_set()
    write_report(args.output, report)
    print(json.dumps({"passed": report["passed"], "highest_completed_vus": max((s["vus"] for s in report["stages"] if s["passed"]), default=0), "output": str(args.output), "abort_reason": report["abort_reason"]}), flush=True)
    return 0 if report["passed"] else 1


def write_report(path, report):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")


def parse_args():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--confirm-owned-demo", action="store_true", help="Confirm authorization to load test the fixed demo hosts")
    parser.add_argument("--profile", choices=("smoke", "stress", "spike", "soak"), default="smoke")
    parser.add_argument("--max-vus", type=int, choices=(5, 50, 100, 250, 500, 1000), default=50)
    parser.add_argument("--stage-seconds", type=int, default=45)
    parser.add_argument("--hold-seconds", type=int, default=120)
    parser.add_argument("--think-seconds", type=float, default=15)
    parser.add_argument("--ramp-seconds", type=float, default=15)
    parser.add_argument("--max-error-rate", type=float, default=0.01)
    parser.add_argument("--frontend-p95-ms", type=float, default=2000)
    parser.add_argument("--api-p95-ms", type=float, default=1000)
    parser.add_argument("--revision", required=True, help="Deployed image SHA; never infer this from local HEAD")
    parser.add_argument("--output", type=Path, default=Path("artifacts/demo-load-test.json"))
    args = parser.parse_args()
    if not args.confirm_owned_demo:
        parser.error("--confirm-owned-demo is required before sending any traffic")
    if not 10 <= args.stage_seconds <= 180 or not 10 <= args.hold_seconds <= 1800:
        parser.error("stage duration must be10..180 seconds and hold10..1800 seconds")
    if not 1 <= args.think_seconds <= 60 or not 0.1 <= args.ramp_seconds <= 30:
        parser.error("think time must be1..60 seconds and arrival spread0.1..30 seconds")
    if not 0 < args.max_error_rate <= 0.05 or min(args.frontend_p95_ms, args.api_p95_ms) <= 0:
        parser.error("thresholds must be positive; max error rate must be <=5%")
    return args


if __name__ == "__main__":
    if sys.platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    try:
        raise SystemExit(asyncio.run(run(parse_args())))
    except KeyboardInterrupt:
        print("Interrupted; inspect completed stage evidence in output JSON.", file=sys.stderr)
        raise SystemExit(130)
