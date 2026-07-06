"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./LivingScene.module.css";

type Props = {
  still: string;
  alt: string;
  /** Sun centre as fractions of the frame. */
  sun?: { x: number; y: number };
  /** "hero" = full ambient treatment; "light" = lighter treatment (§6). */
  treatment: "hero" | "light";
  /** Which scene's region/fx choreography to use. */
  sceneId?: string;
  priority?: boolean;
  sizes?: string;
};

// ---------------------------------------------------------------------------
// Lifelike element motion from flat art: each region is a duplicate of the
// still, soft-masked to one element (palms / water / person / wheel) and
// animated with its own transform. The duplicate lives inside the same Ken
// Burns plane as the base image, so it stays pixel-aligned; feathered mask
// edges hide the seams. No layered exports needed.
// ---------------------------------------------------------------------------

type RegionSpec = {
  id: string;
  mask: string; // feathered CSS mask
  anim: "swayA" | "swayB" | "waterSway" | "personBreathe" | "wheelRock";
  origin: string;
  filter?: string;
};

type FxSpec = {
  birds?: boolean;
  rays?: boolean;
  glyphs?: { c: string; x: number; y: number }[];
  embers?: "gold" | "teal" | "cream";
  sweep?: "gold" | "teal";
  orbit?: { x: number; y: number };
  flicker?: boolean;
  scratch?: boolean;
};

const SCENES: Record<string, { regions: RegionSpec[]; fx: FxSpec }> = {
  hero: {
    regions: [
      // palm cluster, right edge — wind sway from the trunk base
      {
        id: "palmsA",
        mask: "radial-gradient(ellipse 26% 85% at 90% 42%, #000 52%, transparent 78%)",
        anim: "swayA",
        origin: "90% 100%",
      },
      // nearer palm, mid-right — counter-phase sway
      {
        id: "palmsB",
        mask: "radial-gradient(ellipse 15% 55% at 79% 62%, #000 48%, transparent 76%)",
        anim: "swayB",
        origin: "79% 100%",
      },
      // ocean, lower-left — lateral swell + turbulence displacement ripple
      {
        id: "water",
        mask: "radial-gradient(ellipse 55% 26% at 22% 93%, #000 55%, transparent 82%)",
        anim: "waterSway",
        origin: "22% 100%",
        filter: "url(#water-wobble)",
      },
      // the coder on the beach — slow breathing
      {
        id: "person",
        mask: "radial-gradient(ellipse 11% 20% at 66.5% 87%, #000 45%, transparent 75%)",
        anim: "personBreathe",
        origin: "66.5% 96%",
      },
      // ferris wheel on the pier — gentle rock about its hub
      {
        id: "wheel",
        mask: "radial-gradient(ellipse 6.5% 11.5% at 57% 82%, #000 58%, transparent 82%)",
        anim: "wheelRock",
        origin: "57% 82%",
      },
    ],
    fx: {
      birds: true,
      rays: true,
      embers: "gold",
      glyphs: [
        { c: "</>", x: 62, y: 76 },
        { c: "{ }", x: 69, y: 72 },
        { c: "01", x: 58, y: 71 },
      ],
    },
  },
  "software-engineering": {
    regions: [
      {
        id: "water",
        mask: "radial-gradient(ellipse 60% 24% at 25% 92%, #000 50%, transparent 80%)",
        anim: "waterSway",
        origin: "25% 100%",
      },
    ],
    fx: {
      sweep: "gold",
      glyphs: [
        { c: "</>", x: 56, y: 48 },
        { c: "{ }", x: 72, y: 34 },
        { c: "0 1", x: 64, y: 62 },
      ],
    },
  },
  "data-science": {
    regions: [
      {
        id: "water",
        mask: "radial-gradient(ellipse 60% 20% at 30% 94%, #000 50%, transparent 80%)",
        anim: "waterSway",
        origin: "30% 100%",
      },
    ],
    fx: { sweep: "teal", orbit: { x: 70, y: 34 }, embers: "teal" },
  },
  product: {
    regions: [],
    fx: { sweep: "gold", orbit: { x: 30, y: 38 } },
  },
  entrepreneurship: {
    regions: [],
    fx: { embers: "gold", sweep: "gold" },
  },
  filmmaking: {
    regions: [],
    fx: { flicker: true, scratch: true, embers: "cream" },
  },
};

const ANIM_CLASS: Record<RegionSpec["anim"], string> = {
  swayA: styles.swayA,
  swayB: styles.swayB,
  waterSway: styles.waterSway,
  personBreathe: styles.personBreathe,
  wheelRock: styles.wheelRock,
};

const EMBER_COLOR = {
  gold: "rgba(255, 217, 140, 0.9)",
  teal: "rgba(85, 126, 156, 0.9)",
  cream: "rgba(241, 230, 206, 0.8)",
};

const SWEEP_COLOR = {
  gold: "rgba(255, 217, 140, 0.09)",
  teal: "rgba(85, 126, 156, 0.13)",
};

const EMBERS = [
  { left: "10%", delay: "0s", dur: "8s" },
  { left: "22%", delay: "2.4s", dur: "10s" },
  { left: "37%", delay: "5s", dur: "7.5s" },
  { left: "52%", delay: "1.2s", dur: "9s" },
  { left: "64%", delay: "3.8s", dur: "11s" },
  { left: "78%", delay: "6.2s", dur: "8.5s" },
  { left: "90%", delay: "0.8s", dur: "9.5s" },
];

const BIRDS = [
  { top: "14%", delay: "0s", dur: "28s", scale: 1 },
  { top: "23%", delay: "10s", dur: "34s", scale: 0.7 },
  { top: "9%", delay: "19s", dur: "31s", scale: 0.55 },
];

function Bird({ top, delay, dur, scale }: (typeof BIRDS)[number]) {
  return (
    <span
      className={styles.bird}
      style={{ top, animationDelay: delay, animationDuration: dur, scale: String(scale) }}
    >
      <svg viewBox="0 0 10 4" width="18" height="8">
        <path d="M0 3.2 Q2.5 0 5 3.2 Q7.5 0 10 3.2" fill="none" stroke="rgba(20,16,11,0.6)" strokeWidth="0.9" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export default function LivingScene({
  still,
  alt,
  sun,
  treatment,
  sceneId,
  priority,
  sizes,
}: Props) {
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
      if (r.bottom < 0 || r.top > vh) return;
      const progress = (vh - r.top) / (vh + r.height);
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

  // Perf: pause every animation in the scene while it's off-screen.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(
      ([e]) => root.classList.toggle(styles.paused, !e.isIntersecting),
      { rootMargin: "120px" }
    );
    io.observe(root);
    return () => io.disconnect();
  }, []);

  const scene = sceneId ? SCENES[sceneId] : undefined;
  const regions = scene?.regions ?? [];
  const fx = scene?.fx ?? {};

  const sunStyle = sun
    ? { left: `${sun.x * 100}%`, top: `${sun.y * 100}%` }
    : undefined;

  return (
    <div ref={rootRef} className={styles.scene}>
      {/* Displacement filter for the hero water — defined once. */}
      {sceneId === "hero" && (
        <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
          <filter id="water-wobble" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.01 0.045" numOctaves="2" seed="3" result="n">
              <animate
                attributeName="baseFrequency"
                dur="12s"
                values="0.01 0.045;0.014 0.06;0.01 0.045"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G">
              <animate attributeName="scale" dur="9s" values="4;10;4" repeatCount="indefinite" />
            </feDisplacementMap>
          </filter>
        </svg>
      )}

      <div ref={artRef} className={styles.art}>
        <div className={`${styles.drift} ${treatment === "hero" ? styles.driftHero : ""}`}>
          <Image src={still} alt={alt} fill priority={priority} sizes={sizes} className={styles.img} />

          {/* Masked duplicates — the elements that move within the frame */}
          {regions.map((r) => (
            <div
              key={r.id}
              className={`${styles.region} ${ANIM_CLASS[r.anim]}`}
              style={{
                maskImage: r.mask,
                WebkitMaskImage: r.mask,
                transformOrigin: r.origin,
                filter: r.filter,
              }}
              aria-hidden="true"
            >
              <Image src={still} alt="" fill sizes={sizes} className={styles.img} />
            </div>
          ))}
        </div>
      </div>

      {sun && (
        <div
          className={`${styles.glow} ${treatment === "hero" ? styles.glowHero : ""}`}
          style={sunStyle}
          aria-hidden="true"
        />
      )}
      {sun && fx.rays && (
        <div className={styles.rays} style={sunStyle} aria-hidden="true" />
      )}
      {sun && (
        <div className={styles.shimmer} style={{ top: `${sun.y * 100}%` }} aria-hidden="true" />
      )}

      {/* Additive life: birds, embers, glyphs, sweeps, projector artefacts */}
      <div aria-hidden="true">
        {treatment === "hero" && <div className={styles.breathe} />}

        {fx.birds && BIRDS.map((b) => <Bird key={b.top} {...b} />)}

        {fx.embers &&
          EMBERS.map((e) => (
            <span
              key={e.left}
              className={styles.ember}
              style={{
                left: e.left,
                animationDelay: e.delay,
                animationDuration: e.dur,
                background: EMBER_COLOR[fx.embers!],
                boxShadow: `0 0 6px 1px ${EMBER_COLOR[fx.embers!]}`,
              }}
            />
          ))}

        {fx.glyphs?.map((g, i) => (
          <span
            key={g.c + i}
            className={styles.glyph}
            style={{ left: `${g.x}%`, top: `${g.y}%`, animationDelay: `${i * 2.6}s` }}
          >
            {g.c}
          </span>
        ))}

        {fx.sweep && (
          <div
            className={styles.sweep}
            style={{
              background: `linear-gradient(100deg, transparent 25%, ${SWEEP_COLOR[fx.sweep]} 50%, transparent 75%)`,
            }}
          />
        )}

        {fx.orbit && (
          <span
            className={styles.orbitWrap}
            style={{ left: `${fx.orbit.x}%`, top: `${fx.orbit.y}%` }}
          >
            <span className={styles.orbitDot} />
          </span>
        )}

        {fx.flicker && <div className={styles.flicker} />}
        {fx.scratch && <div className={styles.scratch} />}

        {treatment === "hero" && (
          <>
            <div className={`${styles.cloud} ${styles.cloudA}`} />
            <div className={`${styles.cloud} ${styles.cloudB}`} />
            <div className={`${styles.twinkle} ${styles.tw1}`} />
            <div className={`${styles.twinkle} ${styles.tw2}`} />
            <div className={`${styles.twinkle} ${styles.tw3}`} />
          </>
        )}
      </div>
    </div>
  );
}
