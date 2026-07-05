import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDomains, getProjects } from "@/lib/content";
import styles from "./page.module.css";

// §8.5 — the canonical project article: every project renders through this
// template. Deep path for the engaged visitor.

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const project = (await getProjects()).find((p) => p.id === id);
  if (!project) return {};
  return {
    title: project.title,
    description: project.oneLine,
    openGraph: { title: project.title, description: project.oneLine },
  };
}

const SECTIONS: { key: "problem" | "approach" | "tradeoffs"; label: string }[] = [
  { key: "problem", label: "Problem" },
  { key: "approach", label: "Approach" },
  { key: "tradeoffs", label: "Tradeoffs" },
];

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [projects, domains] = await Promise.all([getProjects(), getDomains()]);
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  const domain = domains.find((d) => d.id === project.domainId);

  return (
    <main className={styles.main}>
      <article className={`container ${styles.article}`}>
        <Link href={`/#${project.domainId}`} className={styles.back}>
          ← Back to the reel
        </Link>

        <div className={styles.heroMedia}>
          <Image
            src={project.media.thumb}
            alt={`${project.title} key art`}
            width={1500}
            height={844}
            priority
            sizes="(max-width: 1500px) 100vw, 1500px"
            className={styles.heroImg}
          />
        </div>

        <header className={styles.header}>
          <p className="eyebrow">
            {domain?.name} · {project.year}
          </p>
          <h1 className={`display ${styles.title}`}>{project.title}</h1>
          <p className={styles.oneLine}>{project.oneLine}</p>
        </header>

        <div className={styles.body}>
          {SECTIONS.map(({ key, label }) => {
            const text = project[key];
            if (!text) return null;
            return (
              <section key={key} className={styles.block}>
                <h2 className="eyebrow">{label}</h2>
                <p>{text}</p>
              </section>
            );
          })}

          <section className={styles.outcomeBlock}>
            <h2 className="eyebrow">Outcome</h2>
            <p className={`display ${styles.outcome}`}>{project.outcome}</p>
          </section>

          <section className={styles.block}>
            <h2 className="eyebrow">Stack</h2>
            <ul className={styles.stack}>
              {project.stack.map((s) => (
                <li key={s} className={styles.chip}>
                  {s}
                </li>
              ))}
            </ul>
          </section>

          {(project.links.demo || project.links.repo || project.links.more) && (
            <section className={styles.block}>
              <h2 className="eyebrow">Links</h2>
              <div className={styles.links}>
                {project.links.demo && (
                  <a href={project.links.demo} target="_blank" rel="noreferrer" className={styles.linkSolid}>
                    Live demo
                  </a>
                )}
                {project.links.repo && (
                  <a href={project.links.repo} target="_blank" rel="noreferrer" className={styles.linkOutline}>
                    Repository
                  </a>
                )}
                {project.links.more && (
                  <a href={project.links.more} target="_blank" rel="noreferrer" className={styles.linkOutline}>
                    More
                  </a>
                )}
              </div>
            </section>
          )}
        </div>
      </article>
    </main>
  );
}
