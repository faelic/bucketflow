"use client";

import { motion } from "motion/react";

type SectionIntroProps = {
  eyebrow: string;
  title: string;
  copy: string;
  compact?: boolean;
  ultraCompact?: boolean;
};

export function SectionIntro({
  eyebrow,
  title,
  copy,
  compact = false,
  ultraCompact = false,
}: SectionIntroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="max-w-2xl"
    >
      <p className="text-[10px] uppercase tracking-[0.38em] text-[var(--muted)]">
        {eyebrow}
      </p>
      <h1
        className={`mt-3 font-black tracking-tight text-[var(--ink)] ${
          ultraCompact
            ? "text-2xl sm:text-3xl"
            : compact
              ? "text-3xl sm:text-4xl"
              : "text-4xl sm:text-5xl"
        }`}
      >
        {title}
      </h1>
      <p
        className={`mt-2 text-[var(--soft-ink)] ${
          ultraCompact
            ? "text-xs leading-5"
            : compact
              ? "text-sm leading-6"
              : "text-base leading-8"
        }`}
      >
        {copy}
      </p>
    </motion.div>
  );
}
