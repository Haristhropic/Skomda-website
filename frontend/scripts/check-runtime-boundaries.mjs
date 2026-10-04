import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, "..");
function load(relative, mocks = {}) {
  const file = path.join(root, relative);
  const localRequire = createRequire(file);
  const compiled = ts.transpileModule(fs.readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const module = { exports: {} };
  new Function("require", "module", "exports", compiled)((name) => mocks[name] || localRequire(name), module, module.exports);
  return module.exports;
}
const images = load("src/lib/cloudinary.ts");
const loader = load("src/lib/cloudinaryLoader.ts", { "./cloudinary": images }).default;
const resized = loader({ src: "https://res.cloudinary.com/other-cloud/image/upload/c_fill,w_720/v12345/folder/photo.png", width: 320, quality: 85 });
assert.match(resized, /^https:\/\/res.cloudinary.com\/other-cloud\/image\/upload\/c_fill,w_720\/f_auto,q_auto:good\/f_auto,q_85,w_320,c_limit\/v12345\/folder\/photo.png$/);
assert.equal(loader({ src: "/unmapped-icon.svg", width: 32 }), "/unmapped-icon.svg");
assert.equal(images.getCloudinaryUrl("https://res.cloudinary.com.attacker.invalid/photo.png", { width: 320 }), "https://res.cloudinary.com.attacker.invalid/photo.png");
assert.equal(images.getCloudinaryUrl("https://res.cloudinary.com/other/image/upload/s--signature--/v1/photo.png", { width: 320 }), "https://res.cloudinary.com/other/image/upload/s--signature--/v1/photo.png");
const originalLocalAssets = process.env.NEXT_PUBLIC_CLOUDINARY_LOCAL_ASSETS;
process.env.NEXT_PUBLIC_CLOUDINARY_LOCAL_ASSETS = JSON.stringify(["berita/news-thumb-1.png", "documents/thumbnails/thumb-brosur-ppdb.jpg"]);
const localFallbackImages = load("src/lib/cloudinary.ts");
const fallbackLoader = load("src/lib/cloudinaryLoader.ts", { "./cloudinary": localFallbackImages }).default;
assert.equal(fallbackLoader({ src: "/images/berita/news-thumb-1.png", width: 320 }), "/images/berita/news-thumb-1.png");
assert.equal(fallbackLoader({ src: "/documents/thumbnails/thumb-brosur-ppdb.jpg", width: 320 }), "/documents/thumbnails/thumb-brosur-ppdb.jpg");
if (originalLocalAssets === undefined) delete process.env.NEXT_PUBLIC_CLOUDINARY_LOCAL_ASSETS;
else process.env.NEXT_PUBLIC_CLOUDINARY_LOCAL_ASSETS = originalLocalAssets;

const { NextRequest } = require("next/server");
const boundedBody = load("src/lib/boundedRequestBody.ts");
const grafana = load("src/app/api/observability/grafana/[[...path]]/route.ts", { "@/lib/boundedRequestBody": boundedBody });
const proxy = load("src/lib/backendProxy.ts", { "./boundedRequestBody": boundedBody });
const video = load("src/app/api/virtual-class/video/route.ts", { "@/data/virtualClassData": { VIRTUAL_CLASS_DATA: [{ driveVideoId: "schoolvideo12345" }] } });
const uploads = load("src/app/uploads/[...path]/route.ts");
const originalFetch = globalThis.fetch;
process.env.FRONTEND_ORIGIN = "https://linear.smktelkom-sidoarjo.my.id";
process.env.BACKEND_API_URL = "http://backend:8080/api";
process.env.GRAFANA_URL = "http://grafana:3000";
const origin = process.env.FRONTEND_ORIGIN;
const context = { params: Promise.resolve({ path: ["public", "build", "script.js"] }) };
try {
  let calls = 0;
  globalThis.fetch = async () => { calls++; return Response.json({ error: "unauthorized" }, { status: 401 }); };
  assert.equal((await grafana.GET(new NextRequest(`${origin}/api/observability/grafana/public/build/script.js`), context)).status, 401);
  assert.equal(calls, 1);
  globalThis.fetch = async () => Response.json({ user: { email: "editor@example.invalid", role: "editor" } });
  assert.equal((await grafana.GET(new NextRequest(`${origin}/api/observability/grafana/`), context)).status, 403);
  calls = 0;
  globalThis.fetch = async (url, options) => {
    calls++;
    if (String(url).endsWith("/auth/me")) return Response.json({ user: { email: "operator@example.invalid", role: "super_admin" } });
    assert.equal(new Headers(options.headers).get("x-webauth-user"), "operator@example.invalid");
    assert.equal(new Headers(options.headers).get("cookie"), null);
    assert.equal(new Headers(options.headers).get("authorization"), null);
    return new Response("asset", { headers: { "content-type": "application/javascript" } });
  };
  const response = await grafana.GET(new NextRequest(`${origin}/api/observability/grafana/public/build/script.js`, { headers: { cookie: "skomda_admin_token=fixture", authorization: "Bearer caller", "x-webauth-user": "caller" } }), context);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "no-store, private");
  assert.equal(response.headers.get("x-frame-options"), "SAMEORIGIN");
  assert.equal(calls, 2);
  assert.equal((await grafana.POST(new NextRequest(`${origin}/api/observability/grafana/api/query`, { method: "POST" }), context)).status, 403);
  assert.equal((await grafana.GET(new NextRequest(`${origin}/api/observability/grafana/`), { params: Promise.resolve({ path: ["..", "login"] }) })).status, 400);
  assert.equal((await proxy.proxyToBackend(new NextRequest(`${origin}/api/backend/auth/login`, { method: "POST" }), ["auth", "login"])).status, 403);
  assert.equal((await proxy.proxyToBackend(new NextRequest(`${origin}/api/backend/auth/login`, { method: "POST", headers: { origin: "https://attacker.invalid" } }), ["auth", "login"])).status, 403);
  assert.equal((await proxy.proxyToBackend(new NextRequest("https://attacker.invalid/api/backend/auth/login", { method: "POST", headers: { origin: "https://attacker.invalid" } }), ["auth", "login"])).status, 403);
  globalThis.fetch = async () => Response.json({ user: {} }, { headers: { "cache-control": "public,max-age=600", "set-cookie": "skomda_admin_token=fixture; HttpOnly; Path=/api/auth" } });
  const login = await proxy.proxyToBackend(new NextRequest(`${origin}/api/backend/auth/login`, { method: "POST", headers: { origin }, body: "{}" }), ["auth", "login"]);
  assert.equal(login.status, 200);
  assert.equal(login.headers.get("cache-control"), "no-store, private");
  assert.match(login.headers.get("set-cookie"), /Path=\/(?:;|$)/);
  assert.equal((await proxy.proxyToBackend(new NextRequest(`${origin}/api/backend/..`), [".."])).status, 400);
  const MiB = 1024 * 1024;
  calls = 0;
  globalThis.fetch = async (url, options) => {
    if (String(url).endsWith("/auth/me")) return Response.json({ user: { role: "editor" } });
    calls++;
    assert.equal(options.body.byteLength, 10 * MiB + 256);
    return Response.json({ uploaded: true });
  };
  function streamedRequest(path, size, extraHeaders = {}) {
    let offset = 0;
    const body = new ReadableStream({ pull(controller) {
      if (offset >= size) { controller.close(); return; }
      const length = Math.min(64 * 1024, size - offset);
      controller.enqueue(new Uint8Array(length));
      offset += length;
    } });
    return new NextRequest(`${origin}/api/backend/${path.join("/")}`, { method: "POST", headers: { origin, ...extraHeaders }, body, duplex: "half" });
  }
  assert.equal((await proxy.proxyToBackend(streamedRequest(["upload", "document"], 10 * MiB + 256, { "content-type": "multipart/form-data; boundary=fixture" }), ["upload", "document"])).status, 200);
  assert.equal(calls, 1);
  assert.equal((await proxy.proxyToBackend(streamedRequest(["upload", "image"], 0, { "content-length": String(11 * MiB + 1) }), ["upload", "image"])).status, 413);
  assert.equal((await proxy.proxyToBackend(streamedRequest(["upload", "document"], 11 * MiB + 1), ["upload", "document"])).status, 413);
  assert.equal((await proxy.proxyToBackend(streamedRequest(["auth", "login"], MiB + 1), ["auth", "login"])).status, 413);
  assert.equal((await proxy.proxyToBackend(streamedRequest(["auth", "login"], MiB + 1, { "content-length": "1" }), ["auth", "login"])).status, 400);
  assert.equal((await proxy.proxyToBackend(streamedRequest(["auth", "login"], 0, { "content-length": "-1" }), ["auth", "login"])).status, 400);
  assert.equal(calls, 1, "oversized or dishonest bodies must not reach backend");
  let reads = 0;
  const unreadBody = new ReadableStream({ pull(controller) { reads++; controller.enqueue(new Uint8Array(1)); } }, { highWaterMark: 0 });
  globalThis.fetch = async () => Response.json({ error: "invalid session" }, { status: 401 });
  const unauthenticatedUpload = new NextRequest(`${origin}/api/backend/upload/image`, { method: "POST", headers: { origin }, body: unreadBody, duplex: "half" });
  assert.equal((await proxy.proxyToBackend(unauthenticatedUpload, ["upload", "image"])).status, 401);
  assert.equal(reads, 0, "unauthenticated upload must not read its body");
  globalThis.fetch = async () => Response.json({ user: { role: "super_admin" } });
  assert.equal((await proxy.proxyToBackend(streamedRequest(["upload", "image"], 1), ["upload", "image"])).status, 403);

  const pending = [];
  let started = 0;
  globalThis.fetch = async (url) => {
    if (String(url).endsWith("/auth/me")) return Response.json({ user: { role: "editor" } });
    started++;
    return new Promise((resolve) => pending.push(resolve));
  };
  const firstUpload = proxy.proxyToBackend(streamedRequest(["upload", "image"], 1), ["upload", "image"]);
  const secondUpload = proxy.proxyToBackend(streamedRequest(["upload", "document"], 1), ["upload", "document"]);
  while (started < 2) await new Promise((resolve) => setImmediate(resolve));
  const saturated = await proxy.proxyToBackend(streamedRequest(["upload", "image"], 1), ["upload", "image"]);
  assert.equal(saturated.status, 429);
  assert.equal(saturated.headers.get("retry-after"), "5");
  pending[0](Response.json({ uploaded: true }));
  pending[1](Response.json({ uploaded: true }));
  assert.equal((await firstUpload).status, 200);
  assert.equal((await secondUpload).status, 200);
  globalThis.fetch = async (url) => {
    if (String(url).endsWith("/auth/me")) return Response.json({ user: { role: "editor" } });
    throw new Error("fixture unavailable");
  };
  assert.equal((await proxy.proxyToBackend(streamedRequest(["upload", "image"], 1), ["upload", "image"])).status, 502);
  globalThis.fetch = async (url) => String(url).endsWith("/auth/me") ? Response.json({ user: { role: "editor" } }) : Response.json({ uploaded: true });
  assert.equal((await proxy.proxyToBackend(streamedRequest(["upload", "image"], 1), ["upload", "image"])).status, 200, "slots release after upstream failures");
  const exact = await boundedBody.readBoundedRequestBody(new Request("https://fixture.invalid", { method: "POST", body: "{}", headers: { "content-length": "2" } }), MiB);
  assert.equal(exact.byteLength, 2);
  assert.equal(exact.buffer.byteLength, 2, "declared bodies should allocate only their actual size");
  calls = 0;
  globalThis.fetch = async () => { calls++; return new Response("fixture"); };
  assert.equal((await uploads.GET(new NextRequest(`${origin}/uploads/file`), { params: Promise.resolve({ path: ["..", "api", "auth"] }) })).status, 400);
  assert.equal((await video.GET(new NextRequest(`${origin}/api/virtual-class/video?id=invalid%26id=other`))).status, 400);
  assert.equal((await video.GET(new NextRequest(`${origin}/api/virtual-class/video?id=unknownvideo12345`))).status, 404);
  assert.equal((await video.GET(new NextRequest(`${origin}/api/virtual-class/video?id=schoolvideo12345`, { headers: { range: "bytes=0-1,5-6" } }))).status, 416);
  assert.equal(calls, 0);
  globalThis.fetch = async () => new Response("provider login", { headers: { "content-type": "text/html" } });
  assert.equal((await video.GET(new NextRequest(`${origin}/api/virtual-class/video?id=schoolvideo12345`))).status, 502);
  globalThis.fetch = async () => new Response("missing", { status: 404 });
  assert.equal((await video.GET(new NextRequest(`${origin}/api/virtual-class/video?id=schoolvideo12345`))).status, 404);
  globalThis.fetch = async (_url, options) => {
    assert.equal(options.headers.Range, "bytes=0-3");
    assert.ok(options.signal instanceof AbortSignal);
    return new Response(new Uint8Array([1, 2, 3, 4]), { status: 206, headers: { "content-type": "video/mp4", "content-range": "bytes 0-3/4" } });
  };
  const streamedVideo = await video.GET(new NextRequest(`${origin}/api/virtual-class/video?id=schoolvideo12345`, { headers: { range: "bytes=0-3" } }));
  assert.equal(streamedVideo.status, 206);
  assert.equal((await streamedVideo.arrayBuffer()).byteLength, 4);
  assert.equal(streamedVideo.headers.get("content-type"), "video/mp4");
  assert.equal(streamedVideo.headers.get("x-content-type-options"), "nosniff");
  console.log("PASS: Cloudinary fallback/URLs, Grafana security, API privacy, upload boundaries/auth/concurrency, safe Drive stream and file paths.");
} finally { globalThis.fetch = originalFetch; }
