import Image from "next/image";
import DomainSection from "@/components/DomainSection";
import Filament from "@/components/Filament";
import GitHubFeed from "@/components/GitHubFeed";
import Hero from "@/components/Hero";
import Reveal from "@/components/Reveal";
import Timeline from "@/components/Timeline";
import { getDomains, getProfile, getProjects } from "@/lib/content";
import styles from "./page.module.css";

export default async function Home() {
  const [p, allProjects, all] = await Promise.all([
    getProfile(),
    getProjects(),
    getDomains(),
  ]);
  const features = all.filter((d) => d.tier === "primary");
  const beyond = all.filter((d) => d.tier === "beyond");
  const byDomain = (id: string) => allProjects.filter((pr) => pr.domainId === id);

  return (
    <main id="top" className={styles.main}>
      <Hero />

      <section className={`container ${styles.lead}`}>
        <Reveal>
          <p className={styles.leadLine}>
            Five disciplines, one continuous story — code, data, product, a
            company, and a camera. Every new build joins the reel;{" "}
            <em>it keeps growing</em>.
          </p>
        </Reveal>
      </section>

      <section id="work" className={`container ${styles.work}`}>
        <Reveal>
          <p className="eyebrow">Filmography</p>
        </Reveal>

        <div id="features" className={styles.featureList}>
          {features.map((d, i) => (
            <a key={d.id} href={`#${d.id}`} className={styles.featureRow}>
              <span className={styles.featureIndex}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.featureMain}>
                <span className={`display ${styles.featureTitle}`}>{d.name}</span>
                <span className={styles.featureMeta}>
                  {byDomain(d.id).length} projects
                </span>
              </span>
              <span className={styles.featureBlurb}>{d.blurb}</span>
            </a>
          ))}
        </div>

        <div className={styles.beyondHead}>
          <p className="eyebrow">Beyond the Frame</p>
          <p className={styles.beyondSub}>
            Where the builder moonlights — a company, and a camera.
          </p>
        </div>
        <div className={styles.beyondGrid}>
          {beyond.map((d) => (
            <a key={d.id} href={`#${d.id}`} className={styles.beyondCard}>
              <Image
                src={d.keyArt.still}
                alt=""
                width={720}
                height={405}
                sizes="(max-width: 760px) 100vw, 50vw"
                className={styles.beyondArt}
              />
              <span className={`display ${styles.beyondTitle}`}>{d.name}</span>
              <span className={styles.featureBlurb}>{d.blurb}</span>
            </a>
          ))}
        </div>
      </section>

      {all.map((d) => (
        <DomainSection key={d.id} domain={d} projects={byDomain(d.id)} />
      ))}

      <GitHubFeed />
      <Timeline />

      <footer id="contact" className={`container ${styles.footer}`}>
        <p className="eyebrow">Contact</p>
        <p className={`display sheen ${styles.footerLine}`}>Roll credits — then write.</p>
        <ul className={styles.socials}>
          {p.socials.map((s) => (
            <li key={s.label}>
              <a href={s.url} target="_blank" rel="noreferrer" className={styles.social}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <p className={styles.colophon}>
          © {new Date().getFullYear()} {p.name} · Built as one film, still rolling.
        </p>
      </footer>

      <Filament />
    </main>
  );
}
