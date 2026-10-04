/** Same-origin API URLs for requests that require the admin HttpOnly cookie. */
export const ADMIN_API_BASE_URL = "/api/backend";

export function adminApiUrl(path: string): string {
  return `${ADMIN_API_BASE_URL}/${path.replace(/^\/+/, "")}`;
}
