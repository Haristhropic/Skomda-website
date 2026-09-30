import os from "os";
import type { NextConfig } from "next";

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
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  allowedDevOrigins: getLocalDevOrigins(),
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
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
