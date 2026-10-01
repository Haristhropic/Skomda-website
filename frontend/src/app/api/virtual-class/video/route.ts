import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Missing video id", { status: 400 });
  }

  const driveUrl = `https://drive.google.com/uc?export=download&id=${id}`;

  const range = request.headers.get("range");
  const forwardHeaders: Record<string, string> = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  };
  if (range) {
    forwardHeaders["Range"] = range;
  }

  try {
    const upstream = await fetch(driveUrl, {
      headers: forwardHeaders,
      redirect: "follow",
    });

    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", upstream.headers.get("Content-Type") || "video/mp4");
    responseHeaders.set("Accept-Ranges", "bytes");

    const len = upstream.headers.get("Content-Length");
    if (len) responseHeaders.set("Content-Length", len);

    const cr = upstream.headers.get("Content-Range");
    if (cr) responseHeaders.set("Content-Range", cr);

    return new NextResponse(upstream.body, {
      status: upstream.status === 206 ? 206 : 200,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Error streaming video from Drive:", error);
    return new NextResponse("Error streaming video", { status: 500 });
  }
}
