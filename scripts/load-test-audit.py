#!/usr/bin/env python3
"""Small, bounded live smoke/security audit of the owned demo; no stored bodies."""
import argparse
import asyncio
from datetime import datetime, timezone
import json
from pathlib import Path
import time

import aiohttp

FRONTEND = "https://linear.smktelkom-sidoarjo.my.id"
API = "https://api-linear.smktelkom-sidoarjo.my.id/api"
PAGE_PATHS = (
    "/", "/tentang-kami/profil-sekolah", "/tentang-kami/hub-industri",
    "/tentang-kami/prestasi", "/tentang-kami/fasilitas", "/tentang-kami/profil-guru",
    "/tentang-kami/akomodasi", "/program/profil-jurusan", "/program/ekstrakurikuler",
    "/program/digital-talent", "/program/ts21", "/program/bkk", "/informasi/berita",
    "/informasi/pengumuman-kelulusan", "/informasi/penerapan-k3", "/tefa",
    "/tefa/produk", "/tefa/request", "/trial-class", "/ppdb", "/unduh-informasi",
    "/gate-internal-skomda",
)
PRIVATE_PATHS = ("/admin/users", "/admin/news", "/admin/documents", "/admin/alumni", "/admin/audit-logs", "/admin/monitoring", "/auth/me")
SAFE_HEADERS = ("content-type", "cache-control", "x-content-type-options", "x-frame-options", "referrer-policy", "content-security-policy", "strict-transport-security", "x-request-id", "cf-cache-status")


async def probe(session, method, url, expected, **kwargs):
    started = time.perf_counter()
    row = {"method": method, "url": url, "expected_status": expected}
    try:
        async with session.request(method, url, allow_redirects=False, **kwargs) as response:
            # Drain a bounded response; never preserve body text or Set-Cookie.
            body = await response.content.read(4 * 1024 * 1024 + 1)
            row["status"] = response.status
            row["bytes"] = len(body)
            row["headers"] = {name: response.headers[name] for name in SAFE_HEADERS if name in response.headers}
            row["passed"] = response.status in expected and not response.headers.get("cf-mitigated") and len(body) <= 4 * 1024 * 1024
            if url.endswith("/health") and row["passed"]:
                try:
                    parsed = json.loads(body)
                    row["passed"] = parsed.get("status") == "ok" and parsed.get("database") == "ok"
                except (ValueError, AttributeError):
                    row["passed"] = False
    except (aiohttp.ClientError, asyncio.TimeoutError, OSError) as error:
        row.update({"status": 0, "passed": False, "error_type": type(error).__name__})
    row["elapsed_ms"] = round((time.perf_counter() - started) * 1000, 2)
    return row


async def run(args):
    rows = []
    async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=20), cookie_jar=aiohttp.DummyCookieJar(), headers={"User-Agent": "SKOMDA-Owned-Demo-Audit/1.0"}) as session:
        rows.append(await probe(session, "GET", API + "/health", [200]))
        # Sequential bounded traffic keeps this a smoke audit, not a load test.
        for path in PAGE_PATHS:
            rows.append(await probe(session, "GET", FRONTEND + path, [200]))
        for base in (API, FRONTEND + "/api/backend"):
            for path in PRIVATE_PATHS:
                rows.append(await probe(session, "GET", base + path, [401, 403]))
        # Cross-origin cookie mutation is rejected before executing login.
        rows.append(await probe(session, "POST", FRONTEND + "/api/backend/auth/login", [403], headers={"Origin": "https://untrusted.invalid", "Content-Type": "application/json"}, data="{}"))
        # Invalid token cannot grant admin access; no account/login attempts needed.
        rows.append(await probe(session, "GET", FRONTEND + "/api/backend/admin/users", [401], headers={"Authorization": "Bearer invalid-audit-token"}))
    homepage = next((r for r in rows if r["url"] == FRONTEND + "/"), {})
    header_warnings = [name for name in ("x-content-type-options", "referrer-policy", "strict-transport-security") if name not in homepage.get("headers", {})]
    report = {"tested_at_utc": datetime.now(timezone.utc).isoformat(), "revision": args.revision, "passed": all(r["passed"] for r in rows), "checks": rows, "missing_homepage_header_warnings": header_warnings, "limitations": ["Anonymous probes only; editor/super-admin sessions require separate functional verification", "No exploit payloads, account guessing, writes, provider AI, upload or confidential response bodies", "Header presence is not proof of complete security"]}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({"passed": report["passed"], "checks": len(rows), "failures": [{"url": r["url"], "status": r["status"]} for r in rows if not r["passed"]], "header_warnings": header_warnings, "output": str(args.output)}), flush=True)
    return 0 if report["passed"] else 1


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--confirm-owned-demo", action="store_true")
    parser.add_argument("--revision", required=True)
    parser.add_argument("--output", type=Path, default=Path("artifacts/live-audit.json"))
    args = parser.parse_args()
    if not args.confirm_owned_demo:
        parser.error("--confirm-owned-demo is required before any live request")
    if __import__("sys").platform == "win32":
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    raise SystemExit(asyncio.run(run(args)))
