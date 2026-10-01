import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("skomda_admin_token")?.value;

  // 1. Gerbang otentikasi rahasia internal SKOMDA
  if (
    pathname === "/gate-internal-skomda" ||
    pathname === "/gate-internal-skomda/login"
  ) {
    // Jika admin sudah memiliki sesi aktif, alihkan langsung ke dashboard
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // Jika belum, izinkan akses ke formulir masuk rahasia
    return NextResponse.next();
  }

  // 2. Alihkan /admin/login langsung ke gerbang masuk resmi internal
  if (pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/gate-internal-skomda", request.url));
  }

  // 3. Proteksi stealth seluruh rute /admin
  if (pathname.startsWith("/admin")) {
    // Jika tidak memiliki token otentikasi, samarkan dengan halaman 404 Not Found
    if (!token) {
      return NextResponse.rewrite(new URL("/not-found", request.url));
    }
    // Jika memiliki token otentikasi valid, izinkan akses ke panel admin
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/gate-internal-skomda",
    "/gate-internal-skomda/:path*",
  ],
};
