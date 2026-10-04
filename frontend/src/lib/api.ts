/**
 * Helper untuk mengarahkan request API publik maupun admin secara otomatis:
 * - Sisi Klien (Browser): Menggunakan proxy internal same-origin `/api/backend` agar bebas CORS & tidak bergantung subdomain eksternal.
 * - Sisi Server (SSR / Server Component di Docker): Langsung menghubungi Go backend lewat network internal (`BACKEND_API_URL`).
 */

export function getApiBaseUrl(): string {
  if (typeof window === "undefined") {
    return (
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:8080/api"
    ).replace(/\/+$/, "");
  }
  return "/api/backend";
}

/**
 * Membangun URL endpoint API dengan query params secara aman di lingkungan browser maupun Node.js runtime.
 */
export function buildApiUrl(
  path: string,
  params?: Record<string, string | number | boolean | undefined | null>
): string {
  const base = getApiBaseUrl();
  const cleanPath = path.replace(/^\/+/, "");
  const baseSlash = base.endsWith("/") ? base : `${base}/`;
  const urlStr = `${baseSlash}${cleanPath}`;

  if (!params) return urlStr;

  const searchParams = new URLSearchParams();
  for (const [key, val] of Object.entries(params)) {
    if (val !== undefined && val !== null && val !== "" && val !== "Semua") {
      searchParams.set(key, String(val));
    }
  }

  const qs = searchParams.toString();
  return qs ? `${urlStr}?${qs}` : urlStr;
}
