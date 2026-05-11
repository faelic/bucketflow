"use client";

import { motion } from "motion/react";

import { PrimaryActions } from "@/components/dashboard/PrimaryActions";
import { SectionIntro } from "@/components/dashboard/SectionIntro";
import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { demoAccountData } from "@/data/demo-data";

export default function AppPage() {
  const { mode, balances, receipts, savingsCooldown } = demoAccountData;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <SectionIntro
        eyebrow="Demo mode"
        title="Stablecoin income dashboard"
        copy="Explore your live-mode structure before connecting a wallet."
        ultraCompact
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="flex-1"
      >
        <SummaryCards
          balances={balances}
          savingsCooldown={savingsCooldown}
          receiptCount={receipts.length}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <PrimaryActions disabled={mode === "demo"} mode={mode} compact />
      </motion.div>
    </div>
  );
}
