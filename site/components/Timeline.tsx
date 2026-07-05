import timeline from "@/data/timeline.json";
import type { TimelineEntry } from "@/lib/types";
import Reveal from "./Reveal";
import styles from "./Timeline.module.css";

const entries = [...(timeline as TimelineEntry[])].sort((a, b) => a.order - b.order);

const KIND_LABEL: Record<TimelineEntry["kind"], string> = {
  education: "Education",
  internship: "Internship",
  role: "Position",
  venture: "Venture",
  milestone: "Milestone",
};

// §8.7: LinkedIn-style chronological spine, rendered in the cinematic system —
// nodes rhyme with the filament (§5).
export default function Timeline() {
  return (
    <section id="timeline" data-filament className={`container ${styles.section}`}>
      <Reveal>
        <p className="eyebrow">The Reel So Far</p>
        <h2 data-filament-target className={`display ${styles.title}`}>
          Timeline
        </h2>
      </Reveal>
      <ol className={styles.spine}>
        {entries.map((e) => (
          <li key={e.id} className={styles.entry}>
            <Reveal className={styles.entryInner}>
              <span className={styles.node} aria-hidden="true" />
              <p className={styles.dates}>
                {e.start}
                {e.end !== e.start && ` — ${e.end ?? "Present"}`}
              </p>
              <div className={styles.body}>
                <p className={styles.kind}>{KIND_LABEL[e.kind]}</p>
                <h3 className={styles.role}>
                  {e.title} · <span className={styles.org}>{e.org}</span>
                </h3>
                <p className={styles.oneLine}>{e.oneLine}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
