"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./Filament.module.css";

// §5 — the identity element. A gold line born from the hero sun that draws on
// scroll, weaves down the page, and branches to every section from trunk nodes.
// Real pixel coordinates, stroke-dashoffset × scroll, head via getPointAtLength.

type Pt = { x: number; y: number };

type Branch = {
  id: string; // section id the node links to
  d: string;
  length: number; // branch's own length
  trunkLength: number; // trunk length at the branch's node
  node: Pt;
};

type Geometry = {
  width: number;
  height: number;
  trunkD: string;
  trunkLength: number;
  branches: Branch[];
  samples: { l: number; y: number }[];
};

const SAMPLE_STEP = 24;
const BRANCH_DRAW_SPAN = 320; // trunk px over which a branch finishes drawing

function measure(d: string): SVGPathElement {
  const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
  p.setAttribute("d", d);
  return p;
}

// Catmull-Rom through-points → smooth cubic path. Returns the d string and the
// cumulative length at each through-point (for node placement on the trunk).
function smoothPath(pts: Pt[]): { d: string; lengthsAt: number[] } {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  const lengthsAt = [0];
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
    lengthsAt.push(measure(d).getTotalLength());
  }
  return { d, lengthsAt };
}

export default function Filament() {
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [reduced, setReduced] = useState(false);
  const trunkRef = useRef<SVGPathElement>(null);
  const headRef = useRef<SVGCircleElement>(null);
  const branchRefs = useRef<(SVGPathElement | null)[]>([]);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);
  const sampleIdx = useRef(0);

  const build = useCallback(() => {
    const sunEl = document.querySelector("[data-sun-origin]");
    const sections = [...document.querySelectorAll<HTMLElement>("[data-filament]")];
    if (!sunEl || sections.length === 0) return;

    const vw = document.documentElement.clientWidth;
    const height = document.documentElement.scrollHeight;
    const mobile = vw < 760;
    const [fL, fR] = mobile ? [0.18, 0.82] : [0.08, 0.92];
    const scrollY = window.scrollY;

    const sunRect = sunEl.getBoundingClientRect();
    const sun: Pt = {
      x: sunRect.left + sunRect.width / 2,
      y: sunRect.top + sunRect.height / 2 + scrollY,
    };

    // Trunk through-points: the sun, then one node per section, alternating sides.
    const ordered = sections
      .map((el) => ({ el, top: el.getBoundingClientRect().top + scrollY }))
      .sort((a, b) => a.top - b.top);

    const pts: Pt[] = [sun];
    const nodeMeta: { id: string; node: Pt; target: Pt }[] = [];
    ordered.forEach(({ el, top }, i) => {
      const node: Pt = { x: vw * (i % 2 === 0 ? fR : fL), y: top + 96 };
      pts.push(node);
      const heading = el.querySelector("[data-filament-target]") ?? el;
      const hr = heading.getBoundingClientRect();
      const target: Pt = {
        x: i % 2 === 0 ? hr.right + 28 : Math.max(hr.left - 28, 12),
        y: hr.top + hr.height / 2 + scrollY,
      };
      nodeMeta.push({ id: el.id, node, target });
    });
    pts.push({ x: vw / 2, y: height - 140 }); // settle at the footer

    const { d: trunkD, lengthsAt } = smoothPath(pts);
    const trunkEl = measure(trunkD);
    const trunkLength = trunkEl.getTotalLength();

    const branches: Branch[] = nodeMeta.map((m, i) => {
      const midX = (m.node.x + m.target.x) / 2;
      const d = `M ${m.node.x} ${m.node.y} Q ${midX} ${m.node.y}, ${m.target.x} ${m.target.y}`;
      return {
        id: m.id,
        d,
        length: measure(d).getTotalLength(),
        trunkLength: lengthsAt[i + 1],
        node: m.node,
      };
    });

    const samples: { l: number; y: number }[] = [];
    for (let l = 0; l <= trunkLength; l += SAMPLE_STEP) {
      samples.push({ l, y: trunkEl.getPointAtLength(l).y });
    }
    samples.push({ l: trunkLength, y: trunkEl.getPointAtLength(trunkLength).y });

    sampleIdx.current = 0;
    setGeo({ width: vw, height, trunkD, trunkLength, branches, samples });
  }, []);

  // Build on mount; rebuild on resize and document-height changes.
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    build();
    let t: ReturnType<typeof setTimeout>;
    const rebuild = () => {
      clearTimeout(t);
      t = setTimeout(build, 150);
    };
    window.addEventListener("resize", rebuild);
    const ro = new ResizeObserver(rebuild);
    ro.observe(document.body);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", rebuild);
      ro.disconnect();
    };
  }, [build]);

  // Scroll-driven draw: the glowing head tracks the viewport centre (§5).
  useEffect(() => {
    if (!geo || reduced) return;
    const { samples, trunkLength, branches } = geo;

    let raf = 0;
    const update = () => {
      raf = 0;
      const targetY = window.scrollY + window.innerHeight * 0.5;

      let i = sampleIdx.current;
      while (i < samples.length - 1 && samples[i].y < targetY) i++;
      while (i > 0 && samples[i - 1].y >= targetY) i--;
      sampleIdx.current = i;
      const L = samples[i].y < targetY ? trunkLength : samples[i].l;

      const trunk = trunkRef.current;
      if (trunk) trunk.style.strokeDashoffset = String(Math.max(trunkLength - L, 0));

      const head = headRef.current;
      if (head) {
        if (L <= 1) {
          head.style.opacity = "0";
        } else {
          const pt = trunk!.getPointAtLength(Math.min(L, trunkLength));
          head.setAttribute("cx", String(pt.x));
          head.setAttribute("cy", String(pt.y));
          head.style.opacity = "1";
        }
      }

      branches.forEach((b, bi) => {
        const p = Math.min(Math.max((L - b.trunkLength) / BRANCH_DRAW_SPAN, 0), 1);
        const el = branchRefs.current[bi];
        if (el) el.style.strokeDashoffset = String(b.length * (1 - p));
        const node = nodeRefs.current[bi];
        if (node) node.classList.toggle(styles.nodeLit, p > 0);
      });
    };
    const schedule = () => {
      // rAF is suspended in hidden tabs — update synchronously there so the
      // drawn state is never stale when the tab becomes visible again.
      if (document.hidden) update();
      else if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    return () => {
      window.removeEventListener("scroll", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [geo, reduced]);

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!geo) return null;
  const { width, height, trunkD, trunkLength, branches } = geo;
  const mobile = width < 760;

  return (
    <div className={styles.wrap} aria-hidden={false}>
      <svg
        className={styles.svg}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        role="presentation"
      >
        <defs>
          <linearGradient id="filament-stroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="var(--gold)" />
            <stop offset="1" stopColor="var(--cream)" />
          </linearGradient>
          <filter id="filament-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          ref={trunkRef}
          d={trunkD}
          className={styles.trunk}
          strokeWidth={mobile ? 1.5 : 2.5}
          strokeDasharray={trunkLength}
          strokeDashoffset={reduced ? 0 : trunkLength}
          filter="url(#filament-glow)"
        />

        {branches.map((b, i) => (
          <path
            key={b.id}
            ref={(el) => {
              branchRefs.current[i] = el;
            }}
            d={b.d}
            className={styles.branch}
            strokeWidth={mobile ? 1 : 1.5}
            strokeDasharray={b.length}
            strokeDashoffset={reduced ? 0 : b.length}
          />
        ))}

        {branches.map((b, i) => (
          <a
            key={`n-${b.id}`}
            href={`#${b.id}`}
            onClick={goTo(b.id)}
            className={styles.nodeLink}
            aria-label={`Go to ${b.id.replace(/-/g, " ")}`}
          >
            <circle
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
              cx={b.node.x}
              cy={b.node.y}
              r={mobile ? 4 : 5.5}
              className={`${styles.node} ${reduced ? styles.nodeLit : ""}`}
            />
          </a>
        ))}

        {!reduced && (
          <circle ref={headRef} r={mobile ? 4 : 5} className={styles.head} filter="url(#filament-glow)" />
        )}
      </svg>
    </div>
  );
}
