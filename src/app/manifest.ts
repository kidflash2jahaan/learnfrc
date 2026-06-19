import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LearnFRC — Master FIRST Robotics Competition",
    short_name: "LearnFRC",
    description:
      "The complete, structured guide to mastering every department of the FIRST Robotics Competition.",
    start_url: "/",
    display: "standalone",
    background_color: "#060912",
    theme_color: "#060912",
    categories: ["education", "productivity"],
  };
}
