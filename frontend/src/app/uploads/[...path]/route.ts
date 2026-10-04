import { NextRequest, NextResponse } from "next/server";

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  if (path.some((part) => part === "." || part === ".." || /[\\/\u0000]/.test(part))) {
    return new NextResponse("Jalur berkas tidak valid", { status: 400 });
  }
  const backendBase = process.env.BACKEND_API_URL || "http://localhost:8080/api";
  
  // Ambil host/origin backend (buang akhiran /api)
  const backendOrigin = backendBase.replace(/\/api\/?$/, "");
  const targetPath = path.map((p) => encodeURIComponent(p)).join("/");
  const targetUrl = `${backendOrigin}/uploads/${targetPath}`;

  try {
    const upstream = await fetch(targetUrl, {
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10_000),
    });

    if (!upstream.ok) {
      return new NextResponse("File tidak ditemukan di server", { status: upstream.status });
    }

    const headers = new Headers();
    const contentType = upstream.headers.get("content-type");
    if (contentType) headers.set("content-type", contentType);
    const contentLength = upstream.headers.get("content-length");
    if (contentLength) headers.set("content-length", contentLength);
    headers.set("cache-control", "public, max-age=86400, stale-while-revalidate=604800");

    return new NextResponse(upstream.body, {
      status: 200,
      headers,
    });
  } catch {
    return new NextResponse("Gagal mengambil berkas dari penyimpanan server", { status: 502 });
  }
}
