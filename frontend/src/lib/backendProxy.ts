import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { readBoundedRequestBody, RequestBodyError } from "./boundedRequestBody";

const UPLOAD_BODY_LIMIT_BYTES = 11 * 1024 * 1024;
const JSON_BODY_LIMIT_BYTES = 1024 * 1024;
// Each frontend replica buffers at most two authenticated file uploads.
const MAX_UPLOADS_IN_FLIGHT = 2;
// Shared across separately bundled /api/backend and legacy upload route modules.
const uploadStateKey = Symbol.for("skomda.frontend.uploads");
const processState = globalThis as unknown as Record<symbol, { active: number }>;
const uploadState = processState[uploadStateKey] ??= { active: 0 };
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const FORWARDED_REQUEST_HEADERS = [
  "accept",
  "authorization",
  "content-type",
  "cookie",
  "origin",
  "cf-connecting-ip",
];
const FORWARDED_RESPONSE_HEADERS = [
  "cache-control",
  "content-type",
  "location",
  "retry-after",
  "vary",
  "x-request-id",
  "x-accel-buffering",
];

function requestError(message: string, status: number, requestId: string) {
  console.warn(JSON.stringify({
    event: "backend_proxy_error",
    request_id: requestId,
    status,
    reason: message,
  }));
  return NextResponse.json(
    { error: message },
    { status, headers: { "x-request-id": requestId, "cache-control": "no-store, private" } },
  );
}

export async function proxyToBackend(request: NextRequest, path: string[]) {
  const requestId = randomUUID();

  if (MUTATING_METHODS.has(request.method)) {
    const configuredOrigin = process.env.FRONTEND_ORIGIN?.replace(/\/+$/, "");
    const requestOrigin = request.headers.get("origin");
    const expectedOrigin = configuredOrigin || request.nextUrl.origin;
    if (!requestOrigin || requestOrigin !== expectedOrigin) {
      return requestError("Origin permintaan tidak diizinkan", 403, requestId);
    }
  }

  if (path.some((part) => part === "." || part === ".." || /[\\/\u0000]/.test(part))) {
    return requestError("Jalur permintaan tidak valid", 400, requestId);
  }

  const isUpload = request.method === "POST" && path.length === 2 && path[0] === "upload" && ["image", "document"].includes(path[1]);
  const backendBaseUrl = (process.env.BACKEND_API_URL || "http://localhost:8080/api").replace(/\/+$/, "");
  if (isUpload) {
    let identity: { user?: { role?: string } };
    try {
      const auth = await fetch(`${backendBaseUrl}/auth/me`, {
        headers: { cookie: request.headers.get("cookie") || "" },
        cache: "no-store", redirect: "error", signal: AbortSignal.timeout(5_000),
      });
      if (!auth.ok) return requestError("Sesi editor diperlukan", auth.status === 401 || auth.status === 403 ? 401 : 503, requestId);
      identity = await auth.json();
    } catch {
      return requestError("Verifikasi sesi tidak tersedia", 503, requestId);
    }
    if (identity.user?.role !== "editor") return requestError("Upload hanya untuk editor", 403, requestId);
    if (uploadState.active >= MAX_UPLOADS_IN_FLIGHT) {
      const response = requestError("Upload sedang penuh. Coba lagi sebentar.", 429, requestId);
      response.headers.set("retry-after", "5");
      return response;
    }
    uploadState.active++;
  }
  try {
    return await forwardToBackend(request, path, requestId, isUpload, backendBaseUrl);
  } finally {
    if (isUpload) uploadState.active--;
  }
}

async function forwardToBackend(request: NextRequest, path: string[], requestId: string, isUpload: boolean, backendBaseUrl: string) {
  const bodyLimit = isUpload ? UPLOAD_BODY_LIMIT_BYTES : JSON_BODY_LIMIT_BYTES;
  const backendPath = path.map((part) => encodeURIComponent(part)).join("/");
  const backendUrl = `${backendBaseUrl}/${backendPath}${request.nextUrl.search}`;
  const headers = new Headers();

  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  // Replace any caller-supplied value with an ID generated at this proxy.
  headers.set("x-request-id", requestId);

  let body: Uint8Array<ArrayBuffer> | null;
  try {
    body = await readBoundedRequestBody(request, bodyLimit);
  } catch (error) {
    if (error instanceof RequestBodyError && error.status === 413) {
      return requestError(`Ukuran permintaan melebihi batas ${isUpload ? 11 : 1} MiB`, 413, requestId);
    }
    return requestError("Gagal membaca isi permintaan", 400, requestId);
  }

  let upstream: Response;
  try {
    const upstreamRequest: RequestInit = {
      method: request.method,
      headers,
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(30_000),
    };
    if (body !== null) upstreamRequest.body = body;
    upstream = await fetch(backendUrl, upstreamRequest);
  } catch {
    return requestError("Layanan backend tidak dapat dijangkau", 502, requestId);
  }

  const responseHeaders = new Headers();
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  if (path[0] === "auth" || path[0] === "admin" || MUTATING_METHODS.has(request.method) || request.headers.has("cookie")) {
    responseHeaders.set("cache-control", "no-store, private");
  }
  for (const cookie of upstream.headers.getSetCookie()) {
    // The admin cookie must also reach page requests such as /admin, not only
    // requests beneath the login endpoint's default path.
    if (/^skomda_admin_token=/i.test(cookie)) {
      const attributes = cookie.split(";");
      const pathIndex = attributes.findIndex((attribute) => /^\s*path\s*=/i.test(attribute));
      if (pathIndex === -1) {
        attributes.push(" Path=/");
      } else {
        attributes[pathIndex] = " Path=/";
      }
      responseHeaders.append("set-cookie", attributes.join(";"));
      continue;
    }

    responseHeaders.append("set-cookie", cookie);
  }

  const responseBody = [204, 205, 304].includes(upstream.status) ? null : upstream.body;
  return new NextResponse(responseBody, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
