import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "fizzo — fizikadan Milliy sertifikatga tayyorgarlik",
    short_name: "fizzo",
    description: "Fizikani har kuni oz-ozdan: animatsiyali yechimlar bilan mashq qiling.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f3ec",
    theme_color: "#1b2430",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
