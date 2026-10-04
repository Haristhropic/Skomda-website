import http from "k6/http";
import { check, sleep } from "k6";

const FRONTEND_URL = (__ENV.FRONTEND_BASE_URL || "https://linear.smktelkom-sidoarjo.my.id").replace(/\/$/, "");
const API_URL = (__ENV.API_BASE_URL || "https://api-linear.smktelkom-sidoarjo.my.id/api").replace(/\/$/, "");
const MAX_VUS = Number(__ENV.MAX_VUS || 50);
const TEST_PROFILE = __ENV.TEST_PROFILE || "stress";
const CONFIRM_DEMO_STRESS = __ENV.CONFIRM_DEMO_STRESS === "YES_RUN_READ_ONLY_DEMO_LOAD";

const allowedFrontendHost = "linear.smktelkom-sidoarjo.my.id";
const allowedApiHost = "api-linear.smktelkom-sidoarjo.my.id";
const frontendHost = FRONTEND_URL.match(/^https:\/\/([^/?#]+)/i)?.[1]?.toLowerCase();
const apiMatch = API_URL.match(/^https:\/\/([^/?#]+)(\/[^?#]*)?/i);
const apiHost = apiMatch?.[1]?.toLowerCase();
const apiPath = apiMatch?.[2] || "";

if (!CONFIRM_DEMO_STRESS) {
  throw new Error("Set CONFIRM_DEMO_STRESS=YES_RUN_READ_ONLY_DEMO_LOAD to confirm this sends load to the public demo VPS.");
}

if (!Number.isInteger(MAX_VUS) || ![50, 100, 250, 500, 1000].includes(MAX_VUS)) {
  throw new Error("MAX_VUS must be one of 50, 100, 250, 500, or 1000.");
}

if (frontendHost !== allowedFrontendHost || apiHost !== allowedApiHost || !["/api", "/api/"].includes(apiPath)) {
  throw new Error("This test is restricted to the linear demo frontend and api-linear demo API hostnames.");
}

const stressStages = [...new Set([50, 100, 250, 500, MAX_VUS])]
  .filter((target) => target <= MAX_VUS)
  .map((target, index) => ({ duration: index === 0 ? "45s" : "60s", target }));
stressStages.push({ duration: "3m", target: MAX_VUS });
stressStages.push({ duration: "60s", target: 0 });

const soakVus = Math.min(MAX_VUS, 100);
const profiles = {
  smoke: [{ duration: "30s", target: 5 }, { duration: "60s", target: 5 }, { duration: "30s", target: 0 }],
  load: [{ duration: "60s", target: MAX_VUS }, { duration: "5m", target: MAX_VUS }, { duration: "60s", target: 0 }],
  stress: stressStages,
  spike: [
    { duration: "60s", target: 50 },
    { duration: "15s", target: MAX_VUS },
    { duration: "2m", target: MAX_VUS },
    { duration: "60s", target: 0 },
  ],
  soak: [{ duration: "60s", target: soakVus }, { duration: "30m", target: soakVus }, { duration: "60s", target: 0 }],
};

if (!profiles[TEST_PROFILE]) {
  throw new Error("TEST_PROFILE must be smoke, load, stress, spike, or soak.");
}

const frontendPages = ["/", "/", "/program/profil-jurusan"];
const publicApiPaths = [
  "/jurusan",
  "/news?status=published&page=1&limit=10",
  "/teachers",
  "/prestasi",
  "/bkk/jobs",
  "/bkk/partners",
  "/ekskul",
  "/fasilitas",
  "/documents",
  "/dtp",
  "/alumni?page=1&limit=10",
];

export const options = {
  discardResponseBodies: true,
  scenarios: {
    demo_read_only: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: profiles[TEST_PROFILE],
      gracefulRampDown: "30s",
    },
  },
  thresholds: {
    http_req_failed: [{ threshold: "rate<0.01", abortOnFail: true, delayAbortEval: "60s" }],
    checks: [{ threshold: "rate>0.99", abortOnFail: true, delayAbortEval: "60s" }],
    "http_req_duration{target:frontend}": [
      { threshold: "p(95)<2000", abortOnFail: true, delayAbortEval: "2m" },
    ],
    "http_req_duration{target:api}": [
      { threshold: "p(95)<1000", abortOnFail: true, delayAbortEval: "2m" },
    ],
  },
};

export function setup() {
  // Health checks the DB, so run it once before the load rather than once per VU iteration.
  const response = http.get(`${API_URL}/health`, {
    tags: { target: "preflight" },
    timeout: "15s",
  });
  const healthy = check(response, {
    "demo API and database health are ready": (res) => res.status === 200 && isJsonResponse(res),
  });

  if (!healthy) {
    throw new Error(`Demo API preflight returned HTTP ${response.status}; load test was not started.`);
  }

  return { startedAt: new Date().toISOString() };
}

export default function () {
  const page = frontendPages[(__VU - 1) % frontendPages.length];
  const pageResponse = http.get(`${FRONTEND_URL}${page}`, {
    tags: { target: "frontend" },
    timeout: "20s",
  });
  check(pageResponse, {
    "frontend page returns HTML without a Cloudflare challenge":
      (res) => res.status === 200 && isHtmlResponse(res) && !getHeader(res, "cf-mitigated"),
  });

  const apiPath = publicApiPaths[(__VU - 1) % publicApiPaths.length];
  const apiResponse = http.get(`${API_URL}${apiPath}`, {
    tags: { target: "api" },
    timeout: "20s",
  });
  check(apiResponse, {
    "read-only public API returns JSON without a Cloudflare challenge":
      (res) => res.status === 200 && isJsonResponse(res) && !getHeader(res, "cf-mitigated"),
  });

  // Approximate a browsing session instead of generating a tight request loop.
  sleep(15);
}

function isHtmlResponse(response) {
  return getHeader(response, "content-type").toLowerCase().includes("text/html");
}

function isJsonResponse(response) {
  return getHeader(response, "content-type").toLowerCase().includes("application/json");
}

function getHeader(response, name) {
  const key = Object.keys(response.headers).find((headerName) => headerName.toLowerCase() === name.toLowerCase());
  return key ? String(response.headers[key]) : "";
}
