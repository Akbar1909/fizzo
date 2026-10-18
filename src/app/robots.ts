import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/panel", "/kirish", "/mavzular", "/mashq", "/mock", "/natijalar", "/api"],
    },
    sitemap: "https://fizzo.app/sitemap.xml",
  };
}
