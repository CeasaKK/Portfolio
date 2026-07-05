// Schema from PRD §9 — content is data; the UI is a renderer over it.

export type MotionSpec = {
  kind: "drift" | "breathe" | "shimmer" | "sway" | "pulse" | "twinkle";
  durationS: number;
};

export type SceneAsset = {
  layers: { id: string; src: string; parallax: number; motion?: MotionSpec }[];
  still: string;
  /** Sun centre as fractions of the 16:9 frame — anchors code-drawn glow + the filament origin. */
  sun?: { x: number; y: number };
};

export type Domain = {
  id: string;
  name: string;
  tier: "primary" | "beyond";
  order: number;
  keyArt: SceneAsset;
  blurb: string;
};

export type Project = {
  id: string;
  domainId: string;
  title: string;
  year: string;
  oneLine: string;
  problem: string;
  approach: string;
  tradeoffs?: string;
  outcome: string;
  stack: string[];
  links: { demo?: string; repo?: string; more?: string };
  media: { thumb: string; scene?: SceneAsset };
  featured?: boolean;
};

export type Profile = {
  name: string;
  tagline: string;
  eyebrow: string;
  socials: { label: string; url: string }[];
  githubHandle: string;
};

export type Resume = {
  id: string;
  label: string;
  file: string;
  order: number;
};

export type TimelineEntry = {
  id: string;
  kind: "education" | "internship" | "role" | "venture" | "milestone";
  org: string;
  title: string;
  start: string;
  end?: string;
  oneLine: string;
  order: number;
};
