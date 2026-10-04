import { NextRequest, NextResponse } from "next/server";
import { VIRTUAL_CLASS_DATA } from "@/data/virtualClassData";

const VIDEO_IDS = new Set(VIRTUAL_CLASS_DATA.map((item) => item.driveVideoId));

function videoStream(body: ReadableStream<Uint8Array>, abort: AbortController) {
  const reader = body.getReader();
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      // Bound network inactivity while allowing a slow device to pause playback.
      const deadline = setTimeout(() => abort.abort(), 30_000);
      try {
        const chunk = await reader.read();
        if (chunk.done) { reader.releaseLock(); controller.close(); }
        else controller.enqueue(chunk.value);
      } catch { controller.error(new Error("Video stream tidak tersedia")); }
      finally { clearTimeout(deadline); }
    },
    async cancel(reason) { abort.abort(); await reader.cancel(reason); },
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id || !/^[A-Za-z0-9_-]{10,200}$/.test(id)) {
    return new NextResponse("Video id tidak valid", { status: 400 });
  }
  if (!VIDEO_IDS.has(id)) return new NextResponse("Video tidak ditemukan", { status: 404 });

  const driveUrl = `https://drive.google.com/uc?export=download&id=${encodeURIComponent(id)}`;

  const range = request.headers.get("range");
  if (range && (range.length > 64 || !/^bytes=(?:\d+-\d*|-\d+)$/.test(range))) {
    return new NextResponse("Range tidak valid", { status: 416 });
  }
  const forwardHeaders: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  };
  if (range) {
    forwardHeaders["Range"] = range;
  }

  const abort = new AbortController();
  const deadline = setTimeout(() => abort.abort(), 15_000);
  try {
    const upstream = await fetch(driveUrl, {
      headers: forwardHeaders,
      redirect: "follow",
      signal: abort.signal,
    });
    clearTimeout(deadline);
    const contentType = upstream.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
    if (!upstream.ok || !upstream.body || !contentType || !(contentType.startsWith("video/") || contentType === "application/octet-stream")) {
      await upstream.body?.cancel();
      return new NextResponse("Video provider belum tersedia", { status: upstream.status === 404 ? 404 : 502, headers: { "cache-control": "no-store" } });
    }

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", contentType === "application/octet-stream" ? "video/mp4" : contentType);
    responseHeaders.set("X-Content-Type-Options", "nosniff");
    responseHeaders.set("Cache-Control", "private, no-store");
    responseHeaders.set("Accept-Ranges", "bytes");

    const len = upstream.headers.get("Content-Length");
    if (len) responseHeaders.set("Content-Length", len);

    const cr = upstream.headers.get("Content-Range");
    if (cr) responseHeaders.set("Content-Range", cr);

    return new NextResponse(videoStream(upstream.body, abort), {
      status: upstream.status === 206 ? 206 : 200,
      headers: responseHeaders,
    });
  } catch { return new NextResponse("Video provider tidak dapat dijangkau", { status: 502 }); }
  finally { clearTimeout(deadline); }
}
