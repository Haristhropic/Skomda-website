import os from "os";
import fs from "node:fs";
import path from "node:path";
import type { NextConfig } from "next";

function runtimeImageConfig(): { redirects: { source: string; destination: string; permanent: false }[]; localAssets: string[] } {
  try {
    const prepared = JSON.parse(fs.readFileSync(path.join(process.cwd(), ".runtime-public-assets.json"), "utf8"));
    if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || prepared.cloud !== process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !Array.isArray(prepared.redirects)) return { redirects: [], localAssets: [] };
    const redirects = prepared.redirects.filter((entry: { source: string; destination: string }) => {
      const url = new URL(entry.destination);
      return /^\/(?:images|documents\/thumbnails)\/[a-zA-Z0-9_./-]+\.(png|jpe?g|webp|avif)$/i.test(entry.source) && !entry.source.split("/").includes("..") && url.protocol === "https:" && url.hostname === "res.cloudinary.com" && url.pathname.split("/")[1] === prepared.cloud;
    }).map((entry: { source: string; destination: string }) => ({ ...entry, permanent: false }));
    const localAssets = Array.isArray(prepared.localAssets) ? prepared.localAssets.filter((key: string) => /^[a-zA-Z0-9_./-]+\.(png|jpe?g|webp|avif)$/i.test(key) && !key.split("/").includes("..")) : [];
    return { redirects, localAssets };
  } catch { return { redirects: [], localAssets: [] }; }
}
const runtimeImages = runtimeImageConfig();

// Dapatkan semua IPv4 lokal aktif secara otomatis agar bisa diakses dari HP / device lain di jaringan yang sama
function getLocalDevOrigins(): string[] {
  const origins = new Set<string>([
    "10.218.20.68",
    "192.168.100.13",
  ]);

  try {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name] || []) {
        if (net.family === "IPv4" && !net.internal) {
          origins.add(net.address);
        }
      }
    }
  } catch (err) {
    console.error("Gagal mendapatkan network interfaces:", err);
  }

  return Array.from(origins);
}

const nextConfig: NextConfig = {
  env: { NEXT_PUBLIC_CLOUDINARY_LOCAL_ASSETS: JSON.stringify(runtimeImages.localAssets) },
  output: "standalone",
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  poweredByHeader: false,
  compress: true,
  allowedDevOrigins: getLocalDevOrigins(),
  images: {
    loader: "custom",
    loaderFile: "./src/lib/cloudinaryLoader.ts",
    qualities: [85, 90, 100],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async headers() {
    return [{
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
      ],
    }];
  },
  async redirects() {
    return [
      ...runtimeImages.redirects,
      {
        source: "/akomodasi",
        destination: "/tentang-kami/akomodasi",
        permanent: true,
      },
      {
        source: "/informasi/unduh",
        destination: "/unduh-informasi",
        permanent: true,
      },
      {
        source: "/jurusan",
        destination: "/program/profil-jurusan",
        permanent: true,
      },
      {
        source: "/jurusan/:slug*",
        destination: "/program/profil-jurusan",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
