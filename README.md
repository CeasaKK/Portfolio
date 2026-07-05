# Aryan Malhotra — Portfolio

A cinematic, single-narrative portfolio ("one film") across five domains, built
per [portfolio-website-PRD.md](portfolio-website-PRD.md). Next.js (App Router) +
TypeScript, GSAP/Lenis motion, a sun-born branching filament, live GitHub feed,
and a **Keystatic** Git-based CMS.

The app lives in [`site/`](site/).

```bash
cd site
npm install
npm run dev      # http://localhost:3000
```

## Content — the Keystatic CMS

All content is data under [`site/content/`](site/content/); the UI is a renderer
over it. Add a project or domain = add one entry, no code changes.

- **Projects** · **Domains** · **Timeline** · **Résumés** — one JSON file per
  entry under `content/<collection>/`.
- **Profile & socials** — `content/profile.json`.
- Résumé PDFs live in `site/public/resumes/`; scene art in `site/public/scenes/`.

### Editing locally (works today, no accounts)

1. `cd site && npm run dev`
2. Open **http://localhost:3000/keystatic**
3. Edit anything — projects, timeline, profile, upload résumé PDFs, reorder.
   Saves write straight to the `content/` files.
4. `git commit` + `git push` → Vercel redeploys with the new content.

This is the fastest way to fill the placeholder copy (see below).

### Editing in production (optional — edit on the live site)

To edit at `https://<your-domain>/keystatic` without a local checkout, connect
the Keystatic GitHub App (this also login-gates the admin in production):

1. In the running admin, Keystatic can guide app creation, or create one at
   **keystatic.com** / GitHub → *Settings → Developer settings → GitHub Apps*.
2. Point it at the `CeasaKK/Portfolio` repo (Contents: read & write).
3. Put the four values from [`site/.env.example`](site/.env.example) into
   **Vercel → Settings → Environment Variables**:
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`,
   `KEYSTATIC_SECRET` (any long random string), and
   `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`.
4. Redeploy. Edits made on the live `/keystatic` commit to GitHub → auto-redeploy.

Until this is set up, production editing is disabled (the public site still
builds and serves the committed content normally) — edit locally instead.

## Placeholder copy still to fill

Fill these via `/keystatic` (or by editing the JSON):

- **Projects** — every `problem`, most `approach`, and 9 of 10 `outcome` metrics
  are placeholder text; project `links` (demo/repo) are empty.
- **Timeline** — every `oneLine` is placeholder and the **dates are guesses** —
  correct start/end, JEE ranks, and role titles.

## Deploy (Vercel)

1. Push to GitHub (already wired to `CeasaKK/Portfolio`).
2. Vercel → *Add New → Project* → import the repo.
3. **Set Root Directory to `site`** (the app isn't at the repo root).
4. Deploy. Add a custom domain under *Settings → Domains*, then update the
   placeholder domain `aryanmalhotra.dev` in `site/app/layout.tsx`,
   `site/app/sitemap.ts`, and `site/app/robots.ts`.

No env vars are required for the public site or the live GitHub feed. The
Keystatic GitHub App vars above are only for production content editing.
