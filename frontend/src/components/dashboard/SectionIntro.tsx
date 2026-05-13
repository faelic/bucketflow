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
      <p className="text-[9px] uppercase tracking-[0.28em] text-[var(--muted)] sm:text-[10px] sm:tracking-[0.38em]">
        {eyebrow}
      </p>
      <h1
        className={`mt-3 font-black tracking-tight text-[var(--ink)] ${
          ultraCompact
            ? "text-[1.7rem] leading-tight sm:text-3xl"
            : compact
              ? "text-[2rem] leading-tight sm:text-4xl"
              : "text-[2.35rem] leading-[1.02] sm:text-5xl"
        }`}
      >
        {title}
      </h1>
      <p
        className={`mt-2 text-[var(--soft-ink)] ${
          ultraCompact
            ? "text-[11px] leading-5 sm:text-xs"
            : compact
              ? "text-[13px] leading-6 sm:text-sm"
              : "text-sm leading-7 sm:text-base sm:leading-8"
        }`}
      >
        {copy}
      </p>
    </motion.div>
  );
}
