"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./LivingScene.module.css";

type Props = {
  still: string;
  alt: string;
  /** Sun centre as fractions of the frame. */
  sun?: { x: number; y: number };
  /** "hero" = full ambient treatment; "light" = 1–2 motions (§6). */
  treatment: "hero" | "light";
  priority?: boolean;
  sizes?: string;
};

// Code-drawn ambient layers over flat art (locked decision — no layered exports).
export default function LivingScene({ still, alt, sun, treatment, priority, sizes }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const artRef = useRef<HTMLDivElement>(null);

  // Micro-parallax: the art plane drifts against scroll (§6, R4).
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const root = rootRef.current;
    const art = artRef.current;
    if (!root || !art) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = root.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < 0 || r.top > vh) return; // off-screen: skip (pauses ambient cost)
      const progress = (vh - r.top) / (vh + r.height); // 0 entering → 1 leaving
      art.style.transform = `translateY(${(progress - 0.5) * r.height * 0.08}px) scale(1.06)`;
    };
    const schedule = () => {
      if (document.hidden) update();
      else if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const sunStyle = sun
    ? { left: `${sun.x * 100}%`, top: `${sun.y * 100}%` }
    : undefined;

  return (
    <div ref={rootRef} className={styles.scene}>
      <div ref={artRef} className={styles.art}>
        <Image src={still} alt={alt} fill priority={priority} sizes={sizes} className={styles.img} />
      </div>

      {sun && (
        <div
          className={`${styles.glow} ${treatment === "hero" ? styles.glowHero : ""}`}
          style={sunStyle}
          aria-hidden="true"
        />
      )}
      {sun && (
        <div className={styles.shimmer} style={{ top: `${sun.y * 100}%` }} aria-hidden="true" />
      )}

      {treatment === "hero" && (
        <div aria-hidden="true">
          <div className={`${styles.cloud} ${styles.cloudA}`} />
          <div className={`${styles.cloud} ${styles.cloudB}`} />
          <div className={`${styles.twinkle} ${styles.tw1}`} />
          <div className={`${styles.twinkle} ${styles.tw2}`} />
          <div className={`${styles.twinkle} ${styles.tw3}`} />
        </div>
      )}
    </div>
  );
}
