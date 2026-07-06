import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/types";
import TiltCard from "./TiltCard";
import styles from "./ProjectCard.module.css";

export default function ProjectCard({
  project,
  index = 0,
}: {
  project: Project;
  index?: number;
}) {
  return (
    <TiltCard className={styles.tilt}>
      <Link
        href={`/work/${project.id}`}
        className={styles.card}
        style={{ animationDelay: `${(index % 4) * 1.1}s` }}
      >
        <div className={styles.thumbWrap}>
          <Image
            src={project.media.thumb}
            alt=""
            width={720}
            height={405}
            sizes="(max-width: 760px) 100vw, 33vw"
            className={styles.thumb}
          />
        </div>
        <div className={styles.body}>
          <div className={styles.meta}>
            <span className={styles.year}>{project.year}</span>
            {project.featured && <span className={styles.featured}>Featured</span>}
          </div>
          <h3 className={`display ${styles.title}`}>{project.title}</h3>
          <p className={styles.oneLine}>{project.oneLine}</p>
          <ul className={styles.stack}>
            {project.stack.slice(0, 4).map((s) => (
              <li key={s} className={styles.chip}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </TiltCard>
  );
}
