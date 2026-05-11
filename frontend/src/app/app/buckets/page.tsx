"use client";

import { motion } from "motion/react";

import { BucketGrid } from "@/components/dashboard/BucketGrid";
import { SectionIntro } from "@/components/dashboard/SectionIntro";
import { demoAccountData } from "@/data/demo-data";

export default function BucketsPage() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <SectionIntro
        eyebrow="Bucket balances"
        title="Keep every priority visible."
        copy="Five fixed buckets. One clear financial system."
        ultraCompact
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="min-h-0 flex-1 overflow-hidden"
      >
        <BucketGrid balances={demoAccountData.balances} />
      </motion.div>
    </div>
  );
}
