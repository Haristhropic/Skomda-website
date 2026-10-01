import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://smktelkom-sda.sch.id";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/gate-internal-skomda/", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
