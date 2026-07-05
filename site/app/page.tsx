import Image from "next/image";
import domains from "@/data/domains.json";
import profile from "@/data/profile.json";
import type { Domain, Profile } from "@/lib/types";
import styles from "./page.module.css";

const p = profile as Profile;
const all = [...(domains as Domain[])].sort((a, b) => a.order - b.order);
const features = all.filter((d) => d.tier === "primary");
const beyond = all.filter((d) => d.tier === "beyond");

export default function Home() {
  return (
    <main id="top">
      <section className={styles.hero}>
        <Image
          src="/scenes/hero.png"
          alt="Golden-hour beach scene: a figure works on a laptop as the sun sets over the ocean, pier and city skyline behind"
          fill
          priority
          className={styles.heroArt}
        />
        <div className={styles.heroVignette} aria-hidden="true" />
        <div className={`container ${styles.heroCopy}`}>
          <p className="eyebrow">{p.eyebrow}</p>
          <h1 className={`display ${styles.wordmark}`}>
            Aryan
            <br />
            Malhotra
          </h1>
          <p className={styles.manifesto}>{p.tagline}</p>
        </div>
        <a href="#work" className={styles.scrollCue} aria-label="Scroll to work">
          <span aria-hidden="true">↓</span>
        </a>
      </section>

      <section id="work" className={`container ${styles.work}`}>
        <p className="eyebrow">Filmography</p>

        <div id="features" className={styles.featureList}>
          {features.map((d, i) => (
            <a key={d.id} href={`#${d.id}`} className={styles.featureRow}>
              <span className={styles.featureIndex}>{String(i + 1).padStart(2, "0")}</span>
              <span className={`display ${styles.featureTitle}`}>{d.name}</span>
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
                className={styles.beyondArt}
              />
              <span className={`display ${styles.beyondTitle}`}>{d.name}</span>
              <span className={styles.featureBlurb}>{d.blurb}</span>
            </a>
          ))}
        </div>
      </section>

      <footer className={`container ${styles.footer}`}>
        <p className="eyebrow">Contact</p>
        <ul className={styles.socials}>
          {p.socials.map((s) => (
            <li key={s.label}>
              <a href={s.url} target="_blank" rel="noreferrer" className={styles.social}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </footer>
    </main>
  );
}
