import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Home Healers",
    short_name: "Home Healers",
    description:
      "In-home physiotherapy and medical rehabilitation services in Saudi Arabia",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#143087",
    lang: "ar",
    dir: "rtl",
    icons: [
      {
        src: "/assets/images/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
