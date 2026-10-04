import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("skomda_admin_token")?.value;

  // Keep the legacy login URL pointed at the configured internal login page.
  if (pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/gate-internal-skomda", request.url));
  }

  // The same-origin API proxy sets the host-only cookie on this frontend host.
  // This only hides the page shell; AdminLayout and the Go API still validate JWT.
  if (pathname.startsWith("/admin") && !token) {
    return NextResponse.rewrite(new URL("/not-found", request.url));
  }

  const response = NextResponse.next();
  response.headers.set("cache-control", "no-store, private");
  response.headers.set("x-robots-tag", "noindex, nofollow");
  return response;
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/gate-internal-skomda",
    "/gate-internal-skomda/:path*",
  ],
};
