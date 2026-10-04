import { NextRequest, NextResponse } from "next/server";
import { readBoundedRequestBody, RequestBodyError } from "@/lib/boundedRequestBody";

export const dynamic = "force-dynamic";
const PREFIX = "/api/observability/grafana";
const NO_STORE = { "cache-control": "no-store, private" };
type Context = { params: Promise<{ path?: string[] }> };

async function handle(request: NextRequest, context: Context) {
  const origin = process.env.FRONTEND_ORIGIN?.replace(/\/+$/, "") || request.nextUrl.origin;
  if (!["GET", "HEAD"].includes(request.method) && request.headers.get("origin") !== origin) {
    return NextResponse.json({ error: "Origin permintaan tidak diizinkan" }, { status: 403, headers: NO_STORE });
  }
  const backend = (process.env.BACKEND_API_URL || "http://backend:8080/api").replace(/\/+$/, "");
  let identity: { user?: { email?: string; role?: string } };
  try {
    const auth = await fetch(`${backend}/auth/me`, {
      headers: { cookie: request.headers.get("cookie") || "" },
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(5_000),
    });
    if (!auth.ok) return NextResponse.json({ error: "Sesi admin diperlukan" }, { status: 401, headers: NO_STORE });
    identity = await auth.json();
  } catch {
    return NextResponse.json({ error: "Verifikasi sesi tidak tersedia" }, { status: 503, headers: NO_STORE });
  }
  if (identity.user?.role !== "super_admin" || !identity.user.email) {
    return NextResponse.json({ error: "Akses khusus super admin" }, { status: 403, headers: NO_STORE });
  }
  const { path = [] } = await context.params;
  if (path.some((part) => part === "." || part === ".." || /[\\/\u0000]/.test(part))) {
    return NextResponse.json({ error: "Jalur tidak valid" }, { status: 400, headers: NO_STORE });
  }
  const grafana = new URL(process.env.GRAFANA_URL || "http://grafana:3000");
  grafana.pathname = `${PREFIX}/${path.map(encodeURIComponent).join("/")}`;
  grafana.search = request.nextUrl.search;
  const headers = new Headers();
  for (const name of ["accept", "content-type"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  // Never forward a caller's identity, authorization or cookies to Grafana.
  headers.set("x-webauth-user", identity.user.email);
  headers.set("x-forwarded-proto", new URL(origin).protocol.replace(":", ""));
  headers.set("x-forwarded-host", new URL(origin).host);
  let body: Uint8Array<ArrayBuffer> | null;
  try {
    body = await readBoundedRequestBody(request, 1024 * 1024);
  } catch (error) {
    const status = error instanceof RequestBodyError ? error.status : 400;
    return NextResponse.json({ error: status === 413 ? "Permintaan melebihi batas 1 MiB" : "Isi permintaan tidak valid" }, { status, headers: NO_STORE });
  }
  try {
    const upstream = await fetch(grafana, {
      method: request.method, headers, body: body ?? undefined,
      redirect: "manual", cache: "no-store", signal: AbortSignal.timeout(20_000),
    });
    const responseHeaders = new Headers(NO_STORE);
    for (const name of ["content-type", "content-security-policy", "x-content-type-options"]) {
      const value = upstream.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }
    responseHeaders.set("x-frame-options", "SAMEORIGIN");
    const redirect = upstream.headers.get("location");
    if (redirect) {
      const location = new URL(redirect, grafana);
      if (![grafana.origin, origin].includes(location.origin) || !location.pathname.startsWith(`${PREFIX}/`)) {
        return NextResponse.json({ error: "Redirect monitoring tidak valid" }, { status: 502, headers: NO_STORE });
      }
      responseHeaders.set("location", `${location.pathname}${location.search}`);
    }
    return new NextResponse(request.method === "HEAD" || [204, 205, 304].includes(upstream.status) ? null : upstream.body, {
      status: upstream.status, headers: responseHeaders,
    });
  } catch {
    return NextResponse.json({ error: "Grafana belum tersedia. Gunakan ringkasan monitoring dan coba lagi." }, { status: 503, headers: NO_STORE });
  }
}

export const GET = handle;
export const HEAD = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
