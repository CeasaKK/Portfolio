import type { Domain, Project } from "@/lib/types";
import LivingScene from "./LivingScene";
import ProjectCard from "./ProjectCard";
import Reveal from "./Reveal";
import styles from "./DomainSection.module.css";

// §8.4: cinematic key-art title-card (living, light treatment) + project list.
export default function DomainSection({
  domain,
  projects,
}: {
  domain: Domain;
  projects: Project[];
}) {
  return (
    <section id={domain.id} data-filament className={styles.section}>
      <Reveal>
        <div className={styles.keyArt}>
          <LivingScene
            still={domain.keyArt.still}
            alt={`${domain.name} key art`}
            sun={domain.keyArt.sun}
            treatment="light"
            sizes="(max-width: 1500px) 100vw, 1500px"
          />
          <div className={styles.scrim} aria-hidden="true" />
          <div className={styles.titleBlock}>
            <p className="eyebrow">
              {domain.tier === "primary" ? "Feature" : "Beyond the Frame"} ·{" "}
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </p>
            <h2 data-filament-target className={`display ${styles.title}`}>
              {domain.name}
            </h2>
            <p className={styles.blurb}>{domain.blurb}</p>
          </div>
        </div>
      </Reveal>
      <div className={`container ${styles.grid}`}>
        {projects.map((pr) => (
          <Reveal key={pr.id}>
            <ProjectCard project={pr} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
