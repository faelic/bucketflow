"use client";

import { motion } from "motion/react";

import { useDashboardState } from "@/components/dashboard/DashboardStateProvider";
import { SplitRuleEditor } from "@/components/dashboard/SplitRuleEditor";
import { SectionIntro } from "@/components/dashboard/SectionIntro";
import { SplitRulePanel } from "@/components/dashboard/SplitRulePanel";

export default function RulesPage() {
  const { accountData, status } = useDashboardState();

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <SectionIntro
        eyebrow={
          status === "preview"
            ? "Preview allocation"
            : status === "wrong_network"
              ? "Wallet on wrong network"
              : "Saved allocation"
        }
        title="Make every incoming payment predictable."
        copy={
          status === "live_empty"
            ? "Set a live split rule before your first deposit."
            : "Each deposit follows the same life-priority formula."
        }
        ultraCompact
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.04 }}
        className="min-h-0"
      >
        <SplitRulePanel splitRule={accountData.splitRule} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.1 }}
      >
        <SplitRuleEditor
          key={`${accountData.splitRule.rent}-${accountData.splitRule.savings}-${accountData.splitRule.tax}-${accountData.splitRule.familySupport}-${accountData.splitRule.cashOut}-${status}`}
        />
      </motion.div>
    </div>
  );
}
