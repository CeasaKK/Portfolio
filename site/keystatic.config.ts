import { config, collection, singleton, fields } from "@keystatic/core";

// Git-based CMS (PRD §9.5). Content lives in the repo under content/; the admin
// UI is at /keystatic.
//   • Local dev  → writes straight to the filesystem (edit at localhost:3000/keystatic).
//   • Production → once the Keystatic GitHub App env vars are set, edits commit
//     to GitHub (login-gated). Until then it stays in local mode so the site
//     still builds and deploys — edit locally in the meantime (see README).
const useGithub =
  process.env.NODE_ENV === "production" &&
  !!process.env.KEYSTATIC_GITHUB_CLIENT_ID;

const storage = useGithub
  ? ({ kind: "github", repo: { owner: "CeasaKK", name: "Portfolio" } } as const)
  : ({ kind: "local" } as const);

export default config({
  storage,
  ui: {
    brand: { name: "Aryan Malhotra — Studio" },
  },
  collections: {
    // §9 Domain — one branch/section/page per entry
    domains: collection({
      label: "Domains",
      path: "content/domains/*",
      slugField: "id",
      format: { data: "json" },
      schema: {
        id: fields.slug({
          name: { label: "ID / slug", description: "e.g. software-engineering" },
        }),
        name: fields.text({ label: "Name (literal label)" }),
        tier: fields.select({
          label: "Tier",
          options: [
            { label: "Primary (Feature)", value: "primary" },
            { label: "Beyond the Frame", value: "beyond" },
          ],
          defaultValue: "primary",
        }),
        order: fields.integer({ label: "Order", defaultValue: 1 }),
        blurb: fields.text({ label: "Blurb", multiline: true }),
        keyArtStill: fields.text({
          label: "Key-art image path",
          description: "e.g. /scenes/software-engineering.png",
        }),
        sunX: fields.number({ label: "Sun X (0–1 of frame)", defaultValue: 0.5 }),
        sunY: fields.number({ label: "Sun Y (0–1 of frame)", defaultValue: 0.7 }),
      },
    }),

    // §9 Project — add an entry, it renders into the template automatically
    projects: collection({
      label: "Projects",
      path: "content/projects/*",
      slugField: "id",
      format: { data: "json" },
      columns: ["title", "year"],
      schema: {
        id: fields.slug({ name: { label: "ID / slug" } }),
        title: fields.text({ label: "Title" }),
        domainId: fields.relationship({
          label: "Domain",
          collection: "domains",
        }),
        year: fields.text({ label: "Year" }),
        oneLine: fields.text({ label: "One-line" }),
        problem: fields.text({ label: "Problem", multiline: true }),
        approach: fields.text({ label: "Approach", multiline: true }),
        tradeoffs: fields.text({ label: "Tradeoffs (optional)", multiline: true }),
        outcome: fields.text({
          label: "Outcome (the punch metric)",
          multiline: true,
        }),
        stack: fields.array(fields.text({ label: "Tech" }), {
          label: "Tech stack",
          itemLabel: (p) => p.value,
        }),
        demo: fields.url({ label: "Live demo link" }),
        repo: fields.url({ label: "Repo link" }),
        more: fields.url({ label: "More link" }),
        thumb: fields.text({ label: "Thumbnail image path" }),
        featured: fields.checkbox({ label: "Featured", defaultValue: false }),
        order: fields.integer({ label: "Order (within domain)", defaultValue: 1 }),
      },
    }),

    // §8.7 Professional timeline
    timeline: collection({
      label: "Timeline",
      path: "content/timeline/*",
      slugField: "id",
      format: { data: "json" },
      columns: ["org", "start"],
      schema: {
        id: fields.slug({ name: { label: "ID / slug" } }),
        kind: fields.select({
          label: "Kind",
          options: [
            { label: "Education", value: "education" },
            { label: "Internship", value: "internship" },
            { label: "Position", value: "role" },
            { label: "Venture", value: "venture" },
            { label: "Milestone", value: "milestone" },
          ],
          defaultValue: "role",
        }),
        org: fields.text({ label: "Organisation" }),
        title: fields.text({ label: "Title / role" }),
        start: fields.text({ label: "Start", description: 'e.g. "Aug 2025"' }),
        end: fields.text({ label: "End (blank = Present)" }),
        oneLine: fields.text({ label: "One-line", multiline: true }),
        order: fields.integer({ label: "Order", defaultValue: 1 }),
      },
    }),

    // §7.5 Résumé variants — renders as the top-bar dropdown
    resumes: collection({
      label: "Résumés",
      path: "content/resumes/*",
      slugField: "id",
      format: { data: "json" },
      columns: ["label", "order"],
      schema: {
        id: fields.slug({ name: { label: "ID / slug" } }),
        label: fields.text({ label: "Label", description: "e.g. Software Engineering" }),
        file: fields.file({
          label: "PDF file",
          directory: "public/resumes",
          publicPath: "/resumes/",
        }),
        order: fields.integer({ label: "Order", defaultValue: 1 }),
      },
    }),
  },

  singletons: {
    // §9 Profile + socials
    profile: singleton({
      label: "Profile & socials",
      path: "content/profile",
      format: { data: "json" },
      schema: {
        name: fields.text({ label: "Name" }),
        tagline: fields.text({ label: "Tagline / manifesto", multiline: true }),
        eyebrow: fields.text({ label: "Eyebrow (roles line)" }),
        githubHandle: fields.text({ label: "GitHub handle (for live feed)" }),
        socials: fields.array(
          fields.object({
            label: fields.text({ label: "Label" }),
            url: fields.text({ label: "URL" }),
          }),
          { label: "Socials", itemLabel: (p) => p.fields.label.value }
        ),
      },
    }),
  },
});
