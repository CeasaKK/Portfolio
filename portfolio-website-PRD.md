# Portfolio Website — Product Requirements Document

**Owner:** Aryan Malhotra
**Built by:** Aryan + Fable 5
**Version:** 1.0 (finalised design)
**Date:** July 6, 2026
**Status:** Ready for build

---

## 0. How to read this document

- This is the single source spec for the portfolio build. Every section maps to a decision already locked.
- **Governing thesis:** *maximise perceived engineering, minimise actual engineering* — via disciplined aesthetics — while keeping a small core of genuinely real engineering so it survives scrutiny (see §3).
- When a spec choice appears, it references the **Design Philosophy rule** it serves (R1–R8).

---

## 1. Vision & purpose

- **What it is:** a cinematic, single-narrative portfolio — "one film" — that presents Aryan's full body of work across five domains and *keeps growing* as new work is added.
- **Primary audience:** **off-campus recruiters** (SDE + Data Science). This is where a portfolio earns its keep (on-campus pushes the CV first).
- **Secondary purpose:** a permanent personal artifact of everything built to date.
- **Core promise:** it must read as *both* — a filmmaker's eye **and** an engineer's system, at the same time.
- **Additive by design:** new domains and new projects slot in through a data model with zero redesign (§9).

### 1.1 Success criteria
- A rushed recruiter forms "this person is hireable" conviction in **< 10 seconds** (fast path).
- An engaged visitor *wants to stay* (the wow).
- Adding a new project = adding one data entry, no code changes.
- Loads fast on a random device/network; 60fps motion; no layout shift.
- Reads as an **engineering marvel** without a marvel's build cost.

### 1.2 Non-goals (v1)
- **No hand-built CMS/admin** — content management uses an off-the-shelf headless/Git CMS (§9.5), never a custom-coded panel (that would be weeks of auth+DB+CRUD and a maintenance burden).
- No blog engine yet (addable later via the same data pipe / CMS).
- No custom backend or database beyond the CMS itself + one read-only API call (GitHub). Auth is limited to the CMS's own login.

---

## 2. Audience & the dual-speed principle

- The site serves two speeds simultaneously; neither compromises the other.
- **Fast path (recruiter):** a persistent **Résumé** affordance pinned from frame one — on click it opens a **dropdown of CV variants** (e.g. SDE · Data Science · General), each downloadable; scannable contents; substance one click deep.
- **Deep path (explorer):** the living hero, the sun-born filament, the cinematic domain scenes, per-project case studies.
- **Rule:** the *wow lands passively* in the first 1–2 seconds (no interaction required to be impressed), while the fast path is always one tap away. The wow must **carry** substance, never delay it.

---

## 3. Design Philosophy — aesthetics as an engineering signal (R1–R8)

> The load-bearing framework. Every visual/interaction decision below cites one of these. A recruiter can't audit code; they infer competence from surface cues. These are the cheap cues that read as "built by someone serious." The split target: **~20% real engineering placed where it counts + ~80% disciplined aesthetics.**

- **R1 · Restraint reads as mastery** — one accent (gold) + teal counter, two fonts, heavy negative space. Cost: negative (doing less).
- **R2 · Consistency reads as systems-thinking** — one spacing scale, one grid, one easing, one radius, palette tokens; everything inherits.
- **R3 · Input-linked motion reads as "alive/real"** — motion tied to scroll/cursor (transform × progress). Cheap, high signal.
- **R4 · Depth reads as sophistication** — parallax layers + subtle card tilt. Parallax = ×scroll; tilt = CSS transform on cursor.
- **R5 · Localised detail reads as care** — 2–3 "sweated" spots (grain, node pulse, drawing hairline, count-up), never everywhere.
- **R6 · One genuinely live element reads as undeniable competence** — the *one* place to spend real engineering (live GitHub feed). Survives scrutiny.
- **R7 · Performance reads as discipline** — fast load, 60fps, no CLS. The floor that makes everything else read premium.
- **R8 · Coherent art direction reads as authorship** — one graded world, one sun motif, "one film." Zero engineering cost; pure taste.

- **Honest caveat (keeps this from going hollow):** aesthetics win the first impression and the non-technical/rushed viewer. They do **not** survive a technical interviewer in devtools. That's why **R6 + real projects + clean code** are non-negotiable — the true-substance floor under the perception layer.

---

## 4. Art direction & visual system

### 4.1 "One film" concept
- The entire site is a single cinematic world at golden hour: the recurring **low sun**, teal-over-gold grade, flat painterly-geometric illustration, gold schematic connector-lines with node dots. (R8)
- The hero and all five domain key-arts are *frames from the same movie*.

### 4.2 Palette (sourced from the hero asset)
- **Rule:** all colours derive from the hero; gold is primary, teal is the cool counterweight. Any new asset must sample this palette.

| Token | Hex | Role |
|---|---|---|
| `--ink` | `#14100B` | base background (warm near-black) |
| `--surface` | `#201811` | raised surfaces / cards |
| `--cream` | `#F1E6CE` | primary text / film-white |
| `--muted` | `#9C8A6C` | secondary text, captions |
| `--gold` | `#EBA13A` | **primary accent** (the sun) |
| `--gold-hi` | `#FFD98C` | bright/hover, sun core |
| `--teal` | `#557E9C` | **secondary accent** (sky/ocean) |
| `--teal-deep` | `#2E4C5C` | deep shadow / cool blocks |
| `--line` | `rgba(241,230,206,.12)` | hairlines |

- **Signature gradient:** the sunset itself — `--teal-deep → --gold → --gold-hi` — reserved for hero overlays and rare accent moments only. (R1)

### 4.3 Typography — Pairing A (Wide blockbuster / Top Gun register)
- **Display:** *Monument Extended* (licensed) — or free fallback *Archivo Expanded* / *Anton*. Uppercase, tracked, cinematic. **Name + headlines only.**
- **Body/UI:** **Inter** — all reading text, labels, nav.
- **Rule:** wide/condensed caps never carry long-form text (readability). (R1)

**Type scale** (rem, 1rem = 16px):
| Use | Size | Font |
|---|---|---|
| Hero wordmark | clamp(3.5, 11vw, 12) | Display |
| Section H1 | clamp(2, 5vw, 4) | Display |
| Feature title | clamp(1.9, 5vw, 4.5) | Display |
| Body | 1 – 1.0625 | Inter 300/400 |
| Caption/label | 0.75 (tracked .16em, uppercase) | Inter 500 |

### 4.4 Grain & texture
- One seamless grain tile (from the asset sheet) or `feTurbulence` in code, low-opacity `soft-light` overlay across the site. (R5) Unifies code sections with the illustrated art.

### 4.5 Iconography & UI components — **rendered in code, not AI-sliced**
- The two asset sheets (`assets1`, `assets2`) are a **component-system reference**, not files to slice.
- **Build as SVG/CSS** matching that language: icons (sun, buildings, aperture, code `</>`, target/radar, graph, cube), search/email/password fields, buttons (solid-gold + outline), sliders, dividers with node dots.
- **Why:** consistency, crisp at any resolution, interactive, no AI artifacts — and it *is* engineering on display. (R2, R6)
- **Slice/export only:** grain tiles, abstract project-thumbnail frames (content images). Read hexes off the swatch row.

### 4.6 Spacing & grid (R2)
- Spacing scale (px): 4, 8, 12, 16, 24, 32, 48, 64, 96, 120.
- Max content width 1500px; side padding `clamp(20px, 4vw, 56px)`.
- One corner radius family: 4px (cards), 100px (pills). Nothing else.

---

## 5. The signature — Sun-born Branching Filament

- **The identity element.** A luminous gold line, born from the **sun in the hero (lower-left)**, that threads down through the entire site. (R3, R8)
- **Behaviour:**
  - **Origin:** anchored to the hero sun's coordinates; ignites as the user begins to scroll.
  - **Draw-on-scroll:** stroke draws continuously as scroll progresses; a **glowing head rides the tip**, tracking the viewport centre — it *leads the eye* through the work.
  - **Weave:** left-right swivel is intentional and kept — it's the aesthetic. (Vertical-minimal was rejected.)
  - **Branching:** the trunk sends a **branch to every section** (all disciplines + Beyond the Frame). Each **branch originates from a node on the trunk** — never floating. Branch nodes link/scroll to their section.
  - **Continuity (hard rule):** the line **must never break**. Render it **above** card fills as one continuous path; it must stay visible across whatever it crosses. (The old bug was routing it *behind* solid cards.)
  - **Colour:** `--gold → --cream` gradient stroke + soft `--gold` glow; node dots in `--cream`.
- **Tech:** SVG path in real pixel coordinates (not a stretched viewBox), `stroke-dashoffset` × scroll progress; head positioned via `getPointAtLength`. Anchored to real section positions on layout + resize.
- **Mobile:** thinner stroke, reduced weave amplitude.
- **Reduced-motion:** filament renders fully drawn, static; head hidden.

---

## 6. Living Scenes — the "alive" system

> Requirement: the hero **and** other sections are *alive* — ambient movement in the imagery (drifting clouds, breathing light, shimmer, sway). Emotion of a living frame, not a static poster.

- **Method: code-driven ambient motion over layered assets** — NOT photoreal video. This keeps the flat art crisp, matches the illustration style, *is* the engineering (R3/R6), and stays performant (R7). Photoreal image-to-video would reintroduce AI-morph tells and muddy the flatness.
- **Layered delivery (asset requirement):** each scene is exported as separated layers, e.g.:
  - `sky` · `clouds` · `sun` (+glow) · `water` (+reflection) · `foreground/silhouette` · `palms` · `city` · `filament-nodes`.
- **Ambient motions (per layer):**
  - Clouds: slow horizontal drift + gentle opacity breathe.
  - Sun: soft glow pulse; reflection shimmer on water.
  - Water: subtle horizontal shimmer / micro-parallax.
  - Palms/foliage: slight sway.
  - Nodes/lines: slow travel + faint twinkle.
  - Foreground silhouette: static anchor (stability).
- **Motion character:** slow, looping, *independent of scroll* (ambient) — layered *with* scroll-parallax (R4). Nothing jarring; everything drifts.
- **Tech:** CSS/GSAP transforms per layer + optional lightweight canvas/WebGL shader for water shimmer and sun glow. Parallax = layer offset × scroll.
- **Applied to:** hero (full treatment) + the five domain scenes (lighter treatment — 1–2 ambient motions each, so it stays calm; R1/R5).
- **Reduced-motion:** freeze every scene to its graded still.
- **Fallback:** if a scene can't be cleanly layered, a *very subtle* image-to-video loop is acceptable — but layered-code is the default and preferred everywhere.

---

## 7. Information architecture

### 7.1 Hierarchy — placement-first
- **Primary (lead, large):** Software Engineering · Data Science · Product.
- **Secondary cluster — "Beyond the Frame"** *("Where the builder moonlights — a company, and a camera.")*: Entrepreneurship · Filmmaking.
- **Rule:** domain *names stay literal* (recruiters can't decode cleverness); only *section/grouping labels* are cinematic.

### 7.2 Cinematic naming system (labels only)
- Work section eyebrow: **"Filmography"** (or "Selected Work").
- Primary cluster: **"Features."**
- Secondary cluster: **"Beyond the Frame."**
- Domain names inside: literal (Software Engineering, Data Science, …).

### 7.3 Navigation model
- **Single-scroll cinematic hub** as the main surface + a **dedicated page per project** (deep path). Per-domain pages can be added later as domains deepen — via the same data model.
- Persistent top bar: wordmark (left) · Work · Featured · **Résumé** (right, pinned).

### 7.4 Scope — full build, all five domains in v1
- All five domains ship in v1 (Aryan's call). Manage visual density so all-sections-branching reads as a system, not noise (R1).

### 7.5 Recruiter fast-path — résumé dropdown
- The pinned top-bar **Résumé** control is a **dropdown**, not a single link.
- On click it lists **multiple CV variants** (e.g. SDE · Data Science · General), each downloadable.
- Variants are **CMS-managed and replaceable** (§9.5) — CVs change constantly; swapping one is a 30-second no-code task.
- If only one CV exists, it behaves as a direct download (no empty dropdown).

---

## 8. Page & section specification

### 8.1 Hero (living scene)
- Full-viewport **living** golden-hour scene (§6). Muted, autoplay-equivalent ambient motion, `playsinline`; poster still for slow loads; pause off-screen.
- **Giant wordmark** "ARYAN MALHOTRA" (Display), anchored in the open **upper-left** negative space.
- **Eyebrow:** `Software Engineer · Data · Product` (Inter, tracked).
- **Manifesto** (one line, understated): e.g. *"I build software, model data, and ship products — and before any of it, I made films."*
- **Filament birth** from the sun on first scroll (§5).
- **Résumé** pinned; a quiet scroll cue.
- **Fast-path guarantee:** a fast flick clears the hero into the contents in 1–2 gestures.

### 8.2 Lead / manifesto
- Short cinematic statement + the "keeps growing" idea. Generous space (R1).

### 8.3 Contents — "Filmography"
- **Features** (primary): three large feature rows — Software Engineering, Data Science, Product. Each: Display title · meta (counts) · one-line descriptor · hover padding-shift. Filament branches to each.
- **Beyond the Frame** (secondary): Entrepreneurship · Filmmaking, smaller two-up cards + the clever subheading. Filament branches to each.

### 8.4 Domain sections
- Each domain gets a **cinematic key-art scene** (living, light treatment) as its title-card + a list of its projects (rendered from the schema).

### 8.5 Project article template (the schema, rendered)
- Canonical layout for every project (deep page + featured teaser):
  - Hero media (thumbnail/scene) · Title · Domain · Year · One-line
  - **Problem → Approach → Tradeoffs → Outcome/metric**
  - Tech stack chips · Live demo link · Repo link
- Outcome line styled in Display for punch (e.g. `O(N log N) → O(N log K)`).

### 8.6 Live element — GitHub activity (R6)
- A real, read-only **GitHub activity/commit feed** (contribution graph or recent commits) via the GitHub API.
- This is the *one* genuine-engineering credibility anchor — small effort, disproportionate signal to technical recruiters.

### 8.7 Professional timeline (LinkedIn-style)
- A vertical **chronological timeline** of the career/education journey — the recruiter's familiar mental model, rendered in the cinematic system.
- **Entries:** education (IIT KGP), internships (JSW, Lloyds, 365 Bizness, Dobbe AI), positions (TFPS Governing Batch Member), ventures (Isocode Labs), and milestones (SIH, Inter-IIT gold, JEE ranks).
- **Style:** the filament doubles as the timeline spine where natural — dates on one side, role/org/one-line on the other; nodes mark each entry (visual rhyme with §5).
- **CMS-managed** (§9.5): add/edit/reorder entries with no code. Extensible by design — new roles append over time, so it never goes stale.
- **Fast-path value:** gives a rushed recruiter the whole trajectory at a glance, complementing the downloadable CV.

### 8.8 Footer / contact
- Contact + links: **Email · GitHub · LinkedIn · Codeforces · LeetCode** (Aryan to confirm final set), all CMS-managed (§9.5).
- **Résumé dropdown** (multiple, replaceable CV variants — §7.5/§9.5). Quiet, cinematic close.

---

## 9. Data model — the extensibility engine

> This is what makes "additive" real. Content is data; the UI is a renderer over it. Add a project/domain = add an entry.

```ts
// Domain config
type Domain = {
  id: string;                 // "software-engineering"
  name: string;               // literal label
  tier: "primary" | "beyond"; // hierarchy
  order: number;
  keyArt: SceneAsset;         // layered living scene
  blurb: string;
};

// Project entry (one file/record per project)
type Project = {
  id: string;
  domainId: string;           // links to a Domain
  title: string;
  year: string;
  oneLine: string;
  problem: string;
  approach: string;
  tradeoffs?: string;
  outcome: string;            // the punch metric
  stack: string[];
  links: { demo?: string; repo?: string; more?: string };
  media: { thumb: string; scene?: SceneAsset };
  featured?: boolean;         // may surface on the hub / in ambient hero
};

// Layered living-scene asset
type SceneAsset = {
  layers: { id: string; src: string; parallax: number; motion?: MotionSpec }[];
  still: string;              // reduced-motion / poster fallback
};

// Site profile + socials (single editable record)
type Profile = {
  name: string;
  tagline: string;            // manifesto line
  eyebrow: string;            // roles line
  socials: { label: string; url: string }[];   // email, GitHub, LinkedIn, Codeforces, LeetCode...
  githubHandle: string;       // for the live activity feed
};

// Résumé variants — multiple, replaceable (renders as the dropdown)
type Resume = {
  id: string;
  label: string;              // "SDE" | "Data Science" | "General"
  file: string;               // uploaded/replaced in the CMS
  order: number;
};

// Professional timeline entry (LinkedIn-style)
type TimelineEntry = {
  id: string;
  kind: "education" | "internship" | "role" | "venture" | "milestone";
  org: string;
  title: string;
  start: string;              // "Aug 2025"
  end?: string;               // "Present" if omitted
  oneLine: string;
  order: number;
};
```

- **Add a domain:** new `Domain` entry (+ key-art) → appears with its own branch, section, page.
- **Add a project:** new `Project` entry → renders into the template automatically.
- Storage: **MDX (Contentlayer)** or a typed **JSON** collection. Either is acceptable; pick one and keep it consistent (R2).

### 9.1 Seed content (v1)
- **Software Engineering:** Delhi Metro Route Planner (Dijkstra, min-heap) · Social Media Feed Ranking System (heap top-K, `O(N log N)→O(N log K)`) · File Compression Tool (Huffman + LZW) · internships: JSW, Lloyds, 365 Bizness, Dobbe AI.
- **Data Science:** 100 Days of ML track · AyurSutra (PyTorch + FastAPI Dosha assessment, SIH) · IIT-G Summer Analytics.
- **Product:** LifeTreeOS · CVBuddy.
- **Entrepreneurship:** Isocode Labs (with Mishra) — studio + products.
- **Filmmaking:** TFPS Governing Batch Member · Inter-IIT 8.0 gold · directed short films (2K+ views).
- *(Aryan confirms/edits copy; the schema holds the shape.)*

### 9.5 Content management & admin (anti-staleness)

> **Problem:** a purely code-managed site goes stale — every edit needs touching code + a redeploy. **Solution:** an off-the-shelf CMS on top of the same schema, so content is editable from a real admin/portal without code.

- **Decision: use a headless/Git CMS, NOT a hand-built admin panel.**
  - Building custom auth + database + CRUD UI is weeks of work and a maintenance burden — and, during placement season, the exact "high-dopamine build displacing DSA" trap. An off-the-shelf CMS gives the same portal for a fraction of the effort.
- **Recommended options (pick one):**
  - **Sanity** — hosted, customisable Studio; strong at file uploads (CV PDFs), images, and structured content (timeline). Generous free tier. **Recommended** for the media-heavy "portal" described.
  - **Keystatic / TinaCMS / Decap** — Git-based, free, content lives in the repo. Choose if zero external dependency is preferred; edits commit to Git and trigger a redeploy.
- **What the portal manages (all no-code):**
  - **Domains/tabs & projects** — add/edit/reorder (feeds §9). New tab or project appears automatically with its branch/section/page.
  - **Profile & socials** — name, tagline, roles, all social links (§Profile type).
  - **Professional timeline** — add/edit/reorder entries (§8.7).
  - **Résumés** — upload **multiple** labelled CV variants and **replace** them anytime (renders as the §7.5 dropdown). CVs are ever-changing; this makes swapping them a 30-second task.
  - **Media** — hero/domain scene assets, thumbnails, OG image.
- **Tradeoff (honest):** a CMS adds a bit of setup + a login. That's far less than building/maintaining a custom admin, and it preserves the additive philosophy — the site never goes stale, and *you never touch code to keep it current*.

---

## 10. Interaction & motion tokens

- **Smooth scroll:** Lenis.
- **Scroll choreography:** GSAP ScrollTrigger (filament draw, reveals, parallax).
- **Easing (one curve):** `cubic-bezier(.2,.7,.2,1)`. (R2)
- **Durations:** micro 250ms · reveal 900ms · ambient loops 6–14s.
- **Reveals:** sections rise (opacity + 26px translateY) as the filament reaches them.
- **Micro-interactions:** feature-row padding shift on hover; button/pill states. Minimal elsewhere (R1).
- **3D cards (§11).**
- **Reduced-motion:** all of the above degrade to static.

---

## 11. 3D interactive cards

- The project/section cards are the site's **mindful 3D** (Aryan's rule #2), functionality-first. (R4)
- Behaviour: subtle **tilt toward cursor** (perspective transform), soft parallax on inner layers, light/shadow shift — *never* obstructing content or click targets.
- Tech: React Three Fiber where genuine 3D is warranted; CSS 3D transforms where sufficient (prefer the cheaper option that reads the same — R7).
- Cap tilt angle low; disable on touch; respect reduced-motion.

---

## 12. Tech stack & architecture

- **Framework:** Next.js (App Router), TypeScript.
- **Styling:** CSS Modules (+ design tokens as CSS variables from §4.2). Tailwind optional if preferred — tokens must still be the source.
- **Scroll/motion:** Lenis · GSAP ScrollTrigger.
- **3D:** React Three Fiber + drei (cards, any 3D accents).
- **Content:** MDX/Contentlayer *or* typed JSON (§9), edited through a **headless/Git CMS** (§9.5) — **Sanity** (recommended) or Keystatic/TinaCMS/Decap. No custom admin panel.
- **Live data:** GitHub REST API (read-only, cached).
- **Images:** Next/Image; AVIF/WebP; layered scene assets optimised; lazy-load below the fold and all 3D.
- **Hosting:** Vercel (or equivalent static/edge host).
- **Analytics (optional):** privacy-friendly (Plausible/Umami).

---

## 13. Asset specification

### 13.1 Inventory
- **Hero:** one graded scene, delivered **layered** (§6) + a flat still.
- **5 domain key-arts:** one cinematic scene each (SE, DS, Product, Entrepreneurship, Filmmaking), layered (light motion) + still.
- **Project thumbnails:** one abstract, on-palette key-art per project.
- **Favicon + OG/social image:** one minimal sun/aperture mark (the OG image is the link-preview a recruiter sees — it matters).
- **Grain tile(s):** one seamless texture (or `feTurbulence`).
- **Icons/UI:** built in code from the reference sheets (§4.5) — not generated.

### 13.2 Rules
- **Palette-locked:** every asset uses only the §4.2 hexes.
- **Consistency:** feed the hero + the five scenes as **style references** and reuse **one seed family**; curate hard, reject any drift toward realism or off-palette. (R8)
- **Format:** 16:9 for scenes; **no on-image text** (the site adds real type); export layers as transparent PNG/WebP.
- **No gifs** (banding/weight); motion is code, not gif.

---

## 14. Responsive / mobile

- Hero: living scene simplified (fewer ambient layers), wordmark scales, résumé pinned.
- Filament: thinner, reduced weave; branches shorten.
- Sections stack single-column; cards full-width; 3D tilt disabled on touch.
- Performance budget is stricter on mobile (§15).

---

## 15. Performance & accessibility

- **Performance (R7):** LCP < 2.5s on 4G; 60fps motion; zero CLS; hero poster loads instantly; 3D + heavy scenes lazy-loaded; assets compressed.
- **Accessibility:** full `prefers-reduced-motion` support (freeze scenes, static filament); keyboard-navigable; visible focus rings; alt text on all content images; semantic headings; color-contrast checked for `--cream` on `--ink`.
- **Autoplay:** ambient motion muted, `playsinline`, pauses off-screen and on reduced-motion.

---

## 16. SEO & meta

- Per-page titles + meta descriptions; Open Graph + Twitter cards (the sun/aperture OG image).
- Structured data (`Person` / `CreativeWork`) for the profile + projects.
- Semantic, crawlable content (not locked behind JS-only rendering where avoidable).

---

## 17. Build sequence (ship-order)

1. **Foundation:** Next.js + tokens (§4.2) + type + grain + layout shell + top bar with résumé dropdown (fast path first).
2. **Data model + CMS:** schema + seed content (§9); wire the headless/Git CMS (§9.5) so projects, domains, profile/socials, timeline, and résumés are editable with no code.
3. **Contents/Filmography:** Features + Beyond the Frame, static.
4. **Hero (static):** scene + wordmark + manifesto.
5. **Filament:** sun-born branching, scroll-draw, continuity, branches (§5).
6. **Living Scenes:** layer the hero + domain scenes; ambient motion (§6).
7. **3D cards** (§11).
8. **Live GitHub element** (§8.6, R6).
9. **Per-project pages** (deep path).
10. **Professional timeline** (§8.7) + multi-résumé dropdown wired to the CMS (§7.5).
11. **Polish:** reveals, micro-interactions, grain, node pulses (R5).
12. **Perf + a11y pass** (§15).
13. **SEO/OG + deploy** (§16).

- Each step is independently shippable; the site is presentable from step 4 onward.

---

## 18. Open items / future (additive roadmap)

- Per-domain dedicated pages as domains deepen.
- Case-study long-form / build-in-public notes (same data pipe / CMS).
- Add domains beyond the five (new branch, zero redesign).

### 18.1 Resolved (Jul 6, 2026 clarification round)
- **Living scenes:** flat art stays as delivered; ambient layers are **drawn in code on top** (sun-glow pulse, water shimmer, drifting cloud shapes, node twinkle). No layered asset exports needed; flat still doubles as the reduced-motion fallback.
- **CMS:** ship v1 on **typed JSON collections** (same schema); wire Sanity/Git CMS after launch. Real project copy lands once the admin portal exists.
- **Display font:** **Archivo Expanded** (free). Monument Extended is a later one-token swap if licensed.
- **Seed copy:** placeholders for Problem/Approach/Tradeoffs/Outcome until the CMS portal is set up; structure + titles ship now.

### 18.2 Still to confirm (needed by the step listed)
- ~~GitHub handle~~ → **CeasaKK**.
- CV variants: **SDE PDF delivered** (résumé control acts as direct download per §7.5 until more variants exist). Data Science / General CVs later.
- Contact links: **Email · GitHub (CeasaKK) · LinkedIn (/in/aryan-malhotra-profile) · LeetCode (Ceasak) · Codeforces (ceasak)**.
- Deploy target: Vercel account + domain (step 13) — still open.

---

## Appendix A — Palette quick-reference
`--ink #14100B` · `--surface #201811` · `--cream #F1E6CE` · `--muted #9C8A6C` · `--gold #EBA13A` · `--gold-hi #FFD98C` · `--teal #557E9C` · `--teal-deep #2E4C5C` · `--line rgba(241,230,206,.12)`

## Appendix B — Design Philosophy quick-reference
R1 Restraint · R2 Consistency · R3 Input-linked motion · R4 Depth · R5 Localised detail · R6 One live element · R7 Performance · R8 Coherent art direction.
Target mix: ~20% real engineering (placed at R6 + real projects + clean code) + ~80% disciplined aesthetics.

## Appendix C — Locked decisions log
- Direction: cinematic scroll experience; hero is a **living scene** + sun-born **branching filament**.
- Filament: branching, all sections, branches from trunk nodes, weave kept, continuous over cards.
- 3D: cards as mindful 3D, functionality-first.
- Type: Pairing A — Monument Extended / Archivo Expanded (display) + Inter (body).
- Palette: derived from hero (gold primary, teal counter); colours from hero unless specified.
- Naming: literal domains; cinematic labels; "Beyond the Frame" + subheading.
- Résumé: pinned, **multiple variants in a dropdown**, replaceable via CMS.
- Content management: **headless/Git CMS (Sanity recommended), no hand-built admin** — manages projects, domains, profile/socials, timeline, résumés, media (anti-staleness).
- Professional timeline: **LinkedIn-style, CMS-managed** section (§8.7).
- Motion: code-driven; living scenes; card 3D; minimal hovers; reduced-motion floor.
- Live element: GitHub feed.
- Scope: full build, all five domains, v1.
- Tech: Next.js · Lenis · GSAP · R3F · MDX/JSON · CSS Modules · CMS.
- Assets: hero + 5 domain scenes (layered/living) + project thumbnails + favicon/OG + grain; icons/UI in code.
