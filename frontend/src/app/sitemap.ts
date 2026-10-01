import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://smktelkom-sda.sch.id";
  const now = new Date();

  const routes = [
    "",
    "/tentang-kami/profil-sekolah",
    "/tentang-kami/hub-industri",
    "/tentang-kami/prestasi",
    "/tentang-kami/fasilitas",
    "/tentang-kami/profil-guru",
    "/tentang-kami/akomodasi",
    "/program/profil-jurusan",
    "/program/ekstrakurikuler",
    "/program/digital-talent",
    "/program/ts21",
    "/program/bkk",
    "/informasi/berita",
    "/informasi/pengumuman-kelulusan",
    "/informasi/penerapan-k3",
    "/tefa",
    "/tefa/produk",
    "/tefa/request",
    "/trial-class",
    "/trial-class/virtual-class",
    "/ppdb",
    "/unduh-informasi",
  ];

  return routes.map((route) => {
    let priority = 0.8;
    let changeFrequency: "daily" | "weekly" | "monthly" = "weekly";

    if (route === "") {
      priority = 1.0;
      changeFrequency = "daily";
    } else if (route === "/ppdb" || route === "/program/profil-jurusan") {
      priority = 0.9;
    } else if (route === "/informasi/berita") {
      priority = 0.9;
      changeFrequency = "daily";
    }

    return {
      url: `${baseUrl}${route}`,
      lastModified: now,
      changeFrequency,
      priority,
    };
  });
}
