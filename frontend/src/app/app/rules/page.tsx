"use client";

import { motion } from "motion/react";

import { PrimaryActions } from "@/components/dashboard/PrimaryActions";
import { SectionIntro } from "@/components/dashboard/SectionIntro";
import { SplitRulePanel } from "@/components/dashboard/SplitRulePanel";
import { StatusStrip } from "@/components/dashboard/StatusStrip";
import { demoAccountData } from "@/data/demo-data";

export default function RulesPage() {
  const splitTotal =
    demoAccountData.splitRule.rent +
    demoAccountData.splitRule.savings +
    demoAccountData.splitRule.tax +
    demoAccountData.splitRule.familySupport +
    demoAccountData.splitRule.cashOut;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <SectionIntro
        eyebrow="Saved allocation"
        title="Make every incoming payment predictable."
        copy="Each deposit follows the same life-priority formula."
        ultraCompact
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.04 }}
      >
        <StatusStrip
          items={[
            { label: "Rule status", value: "Active in demo", tone: "olive" },
            { label: "Allocation total", value: `${splitTotal / 100}%`, tone: "stone" },
            { label: "Remainder handling", value: "To Savings", tone: "orange" },
          ]}
        />
      </motion.div>

      <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[1.08fr_0.92fr]">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="min-h-0"
        >
          <SplitRulePanel splitRule={demoAccountData.splitRule} compact />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.14 }}
          className="min-h-0"
        >
          <PrimaryActions
            disabled={demoAccountData.mode === "demo"}
            mode={demoAccountData.mode}
            compact
          />
        </motion.div>
      </div>
    </div>
  );
}
