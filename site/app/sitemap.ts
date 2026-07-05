import type { MetadataRoute } from "next";
import projects from "@/data/projects.json";
import type { Project } from "@/lib/types";

const BASE = "https://aryanmalhotra.dev"; // placeholder — swap for the real domain at deploy

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    ...(projects as Project[]).map((p) => ({
      url: `${BASE}/work/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
