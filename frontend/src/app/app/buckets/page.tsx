"use client";

import { motion } from "motion/react";

import { BucketGrid } from "@/components/dashboard/BucketGrid";
import { useDashboardState } from "@/components/dashboard/DashboardStateProvider";
import { SectionIntro } from "@/components/dashboard/SectionIntro";

export default function BucketsPage() {
  const { accountData, status } = useDashboardState();

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <SectionIntro
        eyebrow={
          status === "preview"
            ? "Preview buckets"
            : status === "wrong_network"
              ? "Preview on wrong network"
              : "Live bucket balances"
        }
        title="Keep every priority visible."
        copy={
          status === "live_empty"
            ? "Your live buckets are ready for the first deposit."
            : "Five fixed buckets. One clear financial system."
        }
        ultraCompact
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="min-h-0 flex-1 overflow-hidden"
      >
        <BucketGrid balances={accountData.balances} />
      </motion.div>
    </div>
  );
}
