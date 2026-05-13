"use client";

import { motion } from "motion/react";

import { useDashboardState } from "@/components/dashboard/DashboardStateProvider";
import { ReceiptsTimeline } from "@/components/dashboard/ReceiptsTimeline";
import { SectionIntro } from "@/components/dashboard/SectionIntro";
import { StatusStrip } from "@/components/dashboard/StatusStrip";
import { formatDateTimeLabel } from "@/lib/format";

export default function ActivityPage() {
  const { accountData, status } = useDashboardState();
  const lastReceipt = accountData.receipts[accountData.receipts.length - 1];

  return (
    <div className="flex flex-col gap-5">
      <SectionIntro
        eyebrow={
          status === "preview"
            ? "Preview receipts"
            : status === "wrong_network"
              ? "Wallet on wrong network"
              : "Receipts and history"
        }
        title="Follow deposits from payment to bucket."
        copy={
          status === "live_empty"
            ? "Your live receipt trail will begin after the first deposit, allocation, or withdrawal."
            : "V1 can rely on event history for a readable receipt trail, so the product stays simple without a backend."
        }
        compact
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.04 }}
        className="hidden sm:block"
      >
        <StatusStrip
          items={[
            {
              label: "Feed mode",
              value:
                status === "preview"
                  ? "Preview receipts"
                  : status === "wrong_network"
                    ? "Preview while disconnected"
                    : status === "live_empty"
                      ? "Waiting for first live event"
                      : "Live receipts",
              tone: "olive",
            },
            {
              label: "Latest event",
              value: lastReceipt ? formatDateTimeLabel(lastReceipt.timestamp) : "No events yet",
              tone: "stone",
            },
            {
              label: "Entries loaded",
              value: `${accountData.receipts.length} receipts`,
              tone: "orange",
            },
          ]}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.08 }}
        className="flex overflow-hidden"
      >
        <div className="w-full max-w-full overflow-hidden">
          <div className="h-[min(66vh,40rem)] overflow-hidden sm:h-[min(60vh,38rem)]">
            <ReceiptsTimeline receipts={accountData.receipts} compact />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
