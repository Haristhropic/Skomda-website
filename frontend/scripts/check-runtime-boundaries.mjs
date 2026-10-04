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

const { NextRequest } = require("next/server");
const grafana = load("src/app/api/observability/grafana/[[...path]]/route.ts");
const proxy = load("src/lib/backendProxy.ts");
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
  console.log("PASS: responsive Cloudinary URL preservation, Grafana role/identity/CSRF isolation, private API caching and cookie path.");
} finally { globalThis.fetch = originalFetch; }
