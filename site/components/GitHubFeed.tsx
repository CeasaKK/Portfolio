import { getProfile } from "@/lib/content";
import Reveal from "./Reveal";
import styles from "./GitHubFeed.module.css";

// §8.6 (R6): the one genuinely live element — a read-only GitHub commit feed,
// fetched server-side and cached for an hour.
type Commit = { repo: string; message: string; date: string; sha: string };

const GH = { Accept: "application/vnd.github+json" };

// The events API no longer ships commit payloads reliably, so: recently-pushed
// public repos → their latest commits, merged newest-first.
async function getCommits(handle: string): Promise<Commit[] | null> {
  try {
    const repoRes = await fetch(
      `https://api.github.com/users/${handle}/repos?sort=pushed&per_page=4`,
      { headers: GH, next: { revalidate: 3600 } }
    );
    if (!repoRes.ok) return null;
    const repos: { full_name: string }[] = await repoRes.json();

    const perRepo = await Promise.all(
      repos.map(async (r) => {
        const res = await fetch(
          `https://api.github.com/repos/${r.full_name}/commits?per_page=5`,
          { headers: GH, next: { revalidate: 3600 } }
        );
        if (!res.ok) return [];
        const commits: {
          sha: string;
          commit: { message: string; author: { date: string } };
        }[] = await res.json();
        return commits.map((c) => ({
          repo: r.full_name,
          message: c.commit.message.split("\n")[0],
          date: c.commit.author.date,
          sha: c.sha.slice(0, 7),
        }));
      })
    );

    return perRepo
      .flat()
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .slice(0, 5);
  } catch {
    return null;
  }
}

function ago(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "a month ago" : `${months} months ago`;
}

export default async function GitHubFeed() {
  const p = await getProfile();
  const commits = await getCommits(p.githubHandle);
  const profileUrl = `https://github.com/${p.githubHandle}`;

  return (
    <section id="live" data-filament className={`container ${styles.section}`}>
      <Reveal>
        <p className="eyebrow">Live from the repo</p>
        <h2 data-filament-target className={`display ${styles.title}`}>
          Now Playing
        </h2>
        <p className={styles.sub}>
          Recent commits, straight from the GitHub API — refreshed hourly.
        </p>
        {commits && commits.length > 0 ? (
          <ol className={styles.list}>
            {commits.map((c) => (
              <li key={`${c.sha}-${c.date}`} className={styles.row}>
                <span className={styles.dot} aria-hidden="true" />
                <div className={styles.commit}>
                  <p className={styles.message}>{c.message}</p>
                  <p className={styles.meta}>
                    <span className={styles.repo}>{c.repo}</span>
                    <span className={styles.sha}>{c.sha}</span>
                    <span>{ago(c.date)}</span>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className={styles.fallback}>
            The feed is catching its breath — see everything at{" "}
            <a href={profileUrl} target="_blank" rel="noreferrer">
              github.com/{p.githubHandle}
            </a>
            .
          </p>
        )}
        <a href={profileUrl} target="_blank" rel="noreferrer" className={styles.more}>
          Full history on GitHub →
        </a>
      </Reveal>
    </section>
  );
}
