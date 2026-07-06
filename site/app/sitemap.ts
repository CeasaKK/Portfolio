import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/content";

const BASE = "https://aryan.isocodelabs.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  return [
    { url: BASE, changeFrequency: "weekly", priority: 1 },
    ...projects.map((p) => ({
      url: `${BASE}/work/${p.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
