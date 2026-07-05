"use client";

import { useEffect, useRef, useState } from "react";
import type { Resume } from "@/lib/types";
import styles from "./TopBar.module.css";

// Résumé fast path (§7.5): one variant = direct download, several = dropdown.
function ResumeControl({ resumes }: { resumes: Resume[] }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const sorted = [...resumes].sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (sorted.length === 0) return null;

  if (sorted.length === 1) {
    return (
      <a className={styles.resumeButton} href={sorted[0].file} download>
        Résumé
      </a>
    );
  }

  return (
    <div className={styles.resumeRoot} ref={rootRef}>
      <button
        type="button"
        className={styles.resumeButton}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Résumé
      </button>
      {open && (
        <div className={styles.resumeMenu} role="menu">
          {sorted.map((r) => (
            <a
              key={r.id}
              role="menuitem"
              className={styles.resumeItem}
              href={r.file}
              download
              onClick={() => setOpen(false)}
            >
              {r.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TopBar({ resumes }: { resumes: Resume[] }) {
  return (
    <header className={styles.bar}>
      <nav className={`container ${styles.inner}`} aria-label="Primary">
        <a href="#top" className={`display ${styles.wordmark}`}>
          AM
        </a>
        <div className={styles.links}>
          <a className={styles.link} href="#work">
            Work
          </a>
          <a className={styles.link} href="#features">
            Features
          </a>
          <ResumeControl resumes={resumes} />
        </div>
      </nav>
    </header>
  );
}
