import { getProfile } from "@/lib/content";
import LivingScene from "./LivingScene";
import styles from "./Hero.module.css";

// Hero sun centre (fractions of the frame) — glow anchor + filament origin (§5).
const SUN = { x: 0.145, y: 0.8 };

export default async function Hero() {
  const p = await getProfile();
  return (
    <section className={styles.hero}>
      <LivingScene
        still="/scenes/hero.png"
        alt="Golden-hour beach scene: a figure works on a laptop as the sun sets over the ocean, pier and city skyline behind"
        sun={SUN}
        treatment="hero"
        sceneId="hero"
        priority
        sizes="100vw"
      />
      <div className={styles.vignette} aria-hidden="true" />
      <span
        data-sun-origin
        className={styles.sunAnchor}
        style={{ left: `${SUN.x * 100}%`, top: `${SUN.y * 100}%` }}
        aria-hidden="true"
      />
      <div className={`container ${styles.copy}`}>
        <p className="eyebrow">{p.eyebrow}</p>
        <h1 className={`display sheen ${styles.wordmark}`}>
          Aryan
          <br />
          Malhotra
        </h1>
        <p className={styles.manifesto}>{p.tagline}</p>
      </div>
      <a href="#work" className={styles.cue} aria-label="Scroll to work">
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
