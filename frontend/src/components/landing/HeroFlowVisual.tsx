"use client";

import { motion } from "motion/react";

const buckets = [
  {
    label: "Rent",
    value: "40%",
    amount: "$480",
    tone: "bg-[var(--accent-soft)] text-[var(--accent-strong)]",
    desktopClassName: "left-[8%] top-[8%]",
    desktopSizeClassName: "w-[186px] p-4",
  },
  {
    label: "Savings",
    value: "20%",
    amount: "$240",
    tone: "bg-[#edf5d7] text-[#6d7f2d]",
    desktopClassName: "right-[8%] top-[8%]",
    desktopSizeClassName: "w-[186px] p-4",
  },
  {
    label: "Tax",
    value: "15%",
    amount: "$180",
    tone: "bg-[#f6eadc] text-[#9a6b2f]",
    desktopClassName: "left-1/2 bottom-[9%] -translate-x-1/2",
    desktopSizeClassName: "w-[196px] p-4",
  },
  {
    label: "Family",
    value: "15%",
    amount: "$180",
    tone: "bg-[#eee8de] text-[#7a6750]",
    desktopClassName: "right-[8%] top-[57%]",
    desktopSizeClassName: "w-[178px] p-4",
  },
  {
    label: "Cash-out",
    value: "10%",
    amount: "$120",
    tone: "bg-[#fbe1d1] text-[#b35b2f]",
    desktopClassName: "left-[8%] top-[57%]",
    desktopSizeClassName: "w-[178px] p-4",
  },
];

export function HeroFlowVisual() {
  return (
    <>
      <div className="relative mx-auto w-full max-w-[540px] lg:hidden">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="rounded-[12px] border border-[rgba(230,221,208,0.8)] bg-[rgba(255,253,250,0.72)] p-5 shadow-[0_22px_50px_rgba(86,73,50,0.08)] backdrop-blur"
        >
          <div className="grid gap-4">
            <div className="flex items-center justify-between gap-4 rounded-[10px] border border-[var(--line)] bg-white/80 p-4 shadow-[0_14px_32px_rgba(86,73,50,0.05)]">
              <div>
                <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
                  Incoming payment
                </p>
                <h3 className="mt-2 text-2xl font-black tracking-tight text-[var(--action)]">
                  $1,200
                </h3>
                <p className="mt-1 text-sm text-[var(--soft-ink)]">USDC on Sepolia</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-[10px] bg-[linear-gradient(135deg,var(--action),#f29a62)] shadow-[0_18px_40px_rgba(230,120,63,0.24)]">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-xs font-black tracking-[0.18em] text-[var(--action)]">
                  BF
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {buckets.map((bucket, index) => (
                <motion.div
                  key={bucket.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.36, delay: 0.08 + index * 0.06, ease: "easeOut" }}
                  className={`rounded-[10px] border border-white/75 p-3.5 shadow-[0_16px_32px_rgba(86,73,50,0.08)] ${bucket.tone} ${bucket.label === "Rent" ? "col-span-2" : ""
                    }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.24em] opacity-70">
                        {bucket.label}
                      </p>
                      <p className="mt-2 text-lg font-black tracking-tight">
                        {bucket.amount}
                      </p>
                    </div>
                    <div className="rounded-full bg-white/70 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.18em]">
                      {bucket.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-full bg-white/90 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.26em] text-[var(--accent-strong)] shadow-[0_12px_28px_rgba(116,138,61,0.12)]">
                Split rules saved
              </div>
              <div className="rounded-full bg-[var(--action)] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.26em] text-white shadow-[0_12px_28px_rgba(230,120,63,0.2)]">
                Savings cooldown active
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative hidden h-[560px] w-full max-w-[560px] lg:block">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="absolute inset-0 rounded-[12px] border border-[rgba(230,221,208,0.75)] bg-[rgba(255,253,250,0.55)] backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="absolute inset-[7%] rounded-[12px] border border-dashed border-[rgba(166,150,132,0.28)]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="absolute left-1/2 top-[18%] h-56 w-56 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(135,158,76,0.18),_transparent_70%)] blur-2xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.16 }}
          className="absolute left-1/2 top-[58%] h-48 w-48 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(230,120,63,0.11),_transparent_72%)] blur-2xl"
        />

        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.45, delay: 0.16 }}
          viewBox="0 0 560 560"
          className="absolute inset-0 z-10 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="heroLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(230,120,63,0.72)" />
              <stop offset="100%" stopColor="rgba(230,120,63,0.12)" />
            </linearGradient>
          </defs>
          <g
            stroke="url(#heroLine)"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            className="motion-path"
          >
            <path d="M248 214 L156 148" />
            <path d="M312 214 L402 148" />
            <path d="M238 212 L152 332" />
            <path d="M322 212 L408 332" />
            <path d="M280 320 L280 442" />
            {/* <path d="M290 360 L300 430" /> */}
          </g>
        </motion.svg>

        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.12, ease: "easeOut" }}
          className="absolute left-1/2 top-[31%] z-20 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, -5, 0], scale: [1, 1.02, 1] }}
            transition={{
              duration: 4.2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="hero-payment pulse-soft min-w-[278px] px-7 py-6 text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.34em] text-[var(--muted)]">
              Incoming payment
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-tight text-[var(--action)]">
              $1,200
            </h3>
            <p className="mt-1 text-sm text-[var(--soft-ink)]">USDC on Sepolia</p>
          </motion.div>
        </motion.div>

        {buckets.map((bucket, index) => (
          <motion.div
            key={bucket.label}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.42,
              delay: 0.24 + index * 0.08,
              ease: "easeOut",
            }}
            className={`absolute z-20 rounded-[10px] border border-white/70 shadow-[0_20px_50px_rgba(86,73,50,0.11)] bucket-reveal ${bucket.tone} ${bucket.desktopClassName} ${bucket.desktopSizeClassName}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.26em] opacity-70">
                  {bucket.label}
                </p>
                <p className="mt-2 text-lg font-black tracking-tight">
                  {bucket.amount}
                </p>
              </div>
              <div className="rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em]">
                {bucket.value}
              </div>
            </div>
          </motion.div>
        ))}

      </div>
    </>
  );
}
