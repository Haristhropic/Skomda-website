import { NextRequest, NextResponse } from "next/server";

const BODY_LIMIT_BYTES = 15 * 1024 * 1024;
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const FORWARDED_REQUEST_HEADERS = [
  "accept",
  "authorization",
  "content-type",
  "cookie",
  "origin",
  "cf-connecting-ip",
  "x-request-id",
];
const FORWARDED_RESPONSE_HEADERS = [
  "cache-control",
  "content-type",
  "location",
  "retry-after",
  "vary",
];

async function readBodyLimited(request: NextRequest): Promise<ArrayBuffer | null> {
  if (!request.body || !MUTATING_METHODS.has(request.method)) return null;

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    totalBytes += value.byteLength;
    if (totalBytes > BODY_LIMIT_BYTES) {
      await reader.cancel();
      throw new Error("body-too-large");
    }
    chunks.push(value);
  }

  const combined = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return combined.buffer;
}

export async function proxyToBackend(request: NextRequest, path: string[]) {
  if (MUTATING_METHODS.has(request.method)) {
    const configuredOrigin = process.env.FRONTEND_ORIGIN?.replace(/\/+$/, "");
    const allowedOrigin = configuredOrigin || request.nextUrl.origin;
    if (request.headers.get("origin") !== allowedOrigin) {
      return NextResponse.json({ error: "Origin permintaan tidak diizinkan" }, { status: 403 });
    }
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > BODY_LIMIT_BYTES) {
    return NextResponse.json({ error: "Ukuran permintaan melebihi batas 15 MB" }, { status: 413 });
  }

  const backendBaseUrl = (process.env.BACKEND_API_URL || "http://localhost:8080/api").replace(/\/+$/, "");
  const backendPath = path.map((part) => encodeURIComponent(part)).join("/");
  const backendUrl = `${backendBaseUrl}/${backendPath}${request.nextUrl.search}`;
  const headers = new Headers();

  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  let body: ArrayBuffer | null;
  try {
    body = await readBodyLimited(request);
  } catch (error) {
    if (error instanceof Error && error.message === "body-too-large") {
      return NextResponse.json({ error: "Ukuran permintaan melebihi batas 15 MB" }, { status: 413 });
    }
    return NextResponse.json({ error: "Gagal membaca isi permintaan" }, { status: 400 });
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
    return NextResponse.json({ error: "Layanan backend tidak dapat dijangkau" }, { status: 502 });
  }

  const responseHeaders = new Headers();
  for (const name of FORWARDED_RESPONSE_HEADERS) {
    const value = upstream.headers.get(name);
    if (value) responseHeaders.set(name, value);
  }
  for (const cookie of upstream.headers.getSetCookie()) {
    responseHeaders.append("set-cookie", cookie);
  }

  const responseBody = [204, 205, 304].includes(upstream.status) ? null : upstream.body;
  return new NextResponse(responseBody, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}
