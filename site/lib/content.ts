import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../keystatic.config";
import type { Domain, Profile, Project, Resume, TimelineEntry } from "./types";

// Single source of truth: the CMS content in content/, read at build/request time.
// Every page renders over these getters, so a content edit needs no code change.
const reader = createReader(process.cwd(), keystaticConfig);

export async function getDomains(): Promise<Domain[]> {
  const all = await reader.collections.domains.all();
  return all
    .map(({ slug, entry }) => ({
      id: slug,
      name: entry.name,
      tier: entry.tier as Domain["tier"],
      order: entry.order ?? 0,
      blurb: entry.blurb,
      keyArt: {
        layers: [],
        still: entry.keyArtStill,
        sun: { x: entry.sunX ?? 0.5, y: entry.sunY ?? 0.7 },
      },
    }))
    .sort((a, b) => a.order - b.order);
}

export async function getProjects(): Promise<Project[]> {
  const all = await reader.collections.projects.all();
  return all
    .map(({ slug, entry }) => {
      const links: Project["links"] = {};
      if (entry.demo) links.demo = entry.demo;
      if (entry.repo) links.repo = entry.repo;
      if (entry.more) links.more = entry.more;
      return {
        id: slug,
        domainId: entry.domainId ?? "",
        title: entry.title,
        year: entry.year,
        oneLine: entry.oneLine,
        problem: entry.problem,
        approach: entry.approach,
        tradeoffs: entry.tradeoffs || undefined,
        outcome: entry.outcome,
        stack: [...entry.stack],
        links,
        media: { thumb: entry.thumb },
        featured: entry.featured,
        _order: entry.order ?? 0,
      } as Project & { _order: number };
    })
    .sort((a, b) => a._order - b._order)
    .map(({ _order, ...p }) => p);
}

export async function getTimeline(): Promise<TimelineEntry[]> {
  const all = await reader.collections.timeline.all();
  return all
    .map(({ slug, entry }) => ({
      id: slug,
      kind: entry.kind as TimelineEntry["kind"],
      org: entry.org,
      title: entry.title,
      start: entry.start,
      end: entry.end || undefined,
      oneLine: entry.oneLine,
      order: entry.order ?? 0,
    }))
    .sort((a, b) => a.order - b.order);
}

export async function getResumes(): Promise<Resume[]> {
  const all = await reader.collections.resumes.all();
  return all
    .map(({ slug, entry }) => ({
      id: slug,
      label: entry.label,
      // The file field stores just the filename; prefix with the public path.
      file: entry.file ? `/resumes/${entry.file}` : "",
      order: entry.order ?? 0,
    }))
    .filter((r) => r.file)
    .sort((a, b) => a.order - b.order);
}

export async function getProfile(): Promise<Profile> {
  const p = await reader.singletons.profile.read();
  if (!p) throw new Error("Profile singleton missing from content/");
  return {
    name: p.name,
    tagline: p.tagline,
    eyebrow: p.eyebrow,
    githubHandle: p.githubHandle,
    socials: p.socials.map((s) => ({ label: s.label, url: s.url })),
  };
}
