import Link from "next/link";

import { HeroFlowVisual } from "@/components/landing/HeroFlowVisual";
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader";
import { AppIcon } from "@/components/shared/AppIcon";
import type { IconName } from "@/components/shared/AppIcon";

type Feature = {
  title: string;
  icon: IconName;
};

type Step = {
  number: string;
  title: string;
  copy: string;
  icon: IconName;
};

const features: Feature[] = [
  {
    title: "Income Control",
    icon: "sliders",
  },
  {
    title: "Clear Receipts",
    icon: "spark",
  },
  {
    title: "Savings Discipline",
    icon: "lock",
  },
  {
    title: "Priority Planning",
    icon: "clock",
  },
];

const steps: Step[] = [
  {
    number: "01",
    title: "Open the app",
    copy: "Start in preview mode to understand the workflow, then connect your wallet when you are ready to use live actions.",
    icon: "spark",
  },
  {
    number: "02",
    title: "Set your split",
    copy: "Review or update how each payment should flow across Rent, Savings, Tax, Family Support, and Cash-out.",
    icon: "sliders",
  },
  {
    number: "03",
    title: "Deposit and withdraw",
    copy: "Approve the stablecoin, deposit once, and withdraw from the specific bucket that matches the real-life priority you need.",
    icon: "deposit",
  },
];

export default function Home() {
  const flowStripItems = [
    "Deposit",
    "Organize",
    "Withdraw",
    "Plan with clarity",
  ];
  const tickerItems = Array.from({ length: 4 }, (_, index) =>
    flowStripItems.map((item) => ({
      id: `${item}-${index}`,
      label: item,
    })),
  ).flat();

  return (
    <main className="min-h-screen bg-[var(--surface)] text-[var(--ink)]">
      <section className="sticky top-0 z-40 border-b border-[var(--line)] bg-[rgba(247,242,234,0.9)] backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 sm:py-5 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-black tracking-tight text-[var(--accent-strong)] sm:text-3xl">
              BucketFlow
            </div>
            <p className="hidden text-[11px] uppercase tracking-[0.35em] text-[var(--muted)] sm:block">
              Stablecoin income infrastructure
            </p>
          </div>

          <Link
            href="/app"
            className="rounded-[10px] border border-[var(--accent-strong)] bg-[var(--accent-strong)] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--accent)] sm:px-5 sm:text-xs sm:tracking-[0.25em]"
          >
            Explore App
          </Link>
        </div>
      </section>

      <section className="hero-grid relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 pb-10 pt-6 sm:px-6 md:pb-16 md:pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 lg:px-8 lg:pb-20 lg:pt-20">
          <div className="relative z-10">

            <h1 className="max-w-3xl text-[2.75rem] font-black leading-[0.95] tracking-tight text-[var(--accent-strong)] sm:text-6xl lg:text-7xl">
              Organize your stablecoin income.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--soft-ink)] sm:text-lg sm:leading-8">
              <span className="sm:hidden">
                Turn incoming USDC into a calm system for rent, savings, tax, family support, and cash-out.
              </span>
              <span className="hidden sm:inline">
                BucketFlow helps African freelancers turn incoming stablecoin payments
                into a practical money system for rent, savings, tax, family support,
                and cash-out.
              </span>
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/app"
                className="inline-flex items-center justify-center rounded-[10px] bg-[var(--action)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:translate-y-[-1px] hover:bg-[var(--action-strong)]"
              >
                Launch App
              </Link>

            </div>

            <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-3">
              <div className="rounded-[12px] border border-[var(--line)] bg-white/70 px-4 py-3.5 shadow-[0_14px_32px_rgba(86,73,50,0.05)] sm:py-4">
                <p className="text-[9px] uppercase tracking-[0.18em] text-[var(--muted)] sm:text-[10px] sm:tracking-[0.28em]">
                  Supported flow
                </p>
                <p className="mt-2 text-sm font-black tracking-tight text-[var(--ink)]">
                  Deposit → Organize → Withdraw
                </p>
              </div>
              <div className="rounded-[12px] border border-[var(--line)] bg-white/70 px-4 py-3.5 shadow-[0_14px_32px_rgba(86,73,50,0.05)] sm:py-4">
                <p className="text-[9px] uppercase tracking-[0.18em] text-[var(--muted)] sm:text-[10px] sm:tracking-[0.28em]">
                  Savings logic
                </p>
                <p className="mt-2 text-sm font-black tracking-tight text-[var(--ink)]">
                  30-day withdrawal cooldown
                </p>
              </div>
              <div className="rounded-[12px] border border-[var(--line)] bg-white/70 px-4 py-3.5 shadow-[0_14px_32px_rgba(86,73,50,0.05)] sm:py-4">
                <p className="text-[9px] uppercase tracking-[0.18em] text-[var(--muted)] sm:text-[10px] sm:tracking-[0.28em]">
                  V1 network
                </p>
                <p className="mt-2 text-sm font-black tracking-tight text-[var(--ink)]">
                  USDC on Sepolia
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[360px] items-center justify-center sm:min-h-[420px] lg:min-h-[560px]">
            <HeroFlowVisual />
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--panel-soft)]">
        <div className="mx-auto flex w-full max-w-7xl gap-3 overflow-x-auto px-4 py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:grid sm:gap-px sm:overflow-visible sm:px-6 sm:py-0 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex min-h-[104px] min-w-[12rem] shrink-0 flex-col items-center justify-center rounded-[12px] border border-[var(--line)] bg-[var(--panel-soft)] px-5 py-5 text-center transition hover:bg-[#f6f1e8] sm:min-h-[180px] sm:min-w-0 sm:rounded-none sm:border-x sm:border-y-0 sm:px-6 sm:py-8"
            >
              <div className="inline-flex h-8 w-8 items-center justify-center text-[var(--action)]">
                <AppIcon name={feature.icon} className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--muted)] sm:mt-8 sm:text-[12px] sm:tracking-[0.38em]">
                {feature.title}
              </h2>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="landing-ticker overflow-hidden py-4">
          <div className="landing-ticker__track">
            {tickerItems.map((item) => (
              <span
                key={item.id}
                className="landing-ticker__item px-5 text-[13px] uppercase tracking-[0.42em] text-[var(--muted)] sm:px-6 lg:px-8"
              >
                <span>{item.label}</span>
                <span className="text-[var(--action)]" aria-hidden="true">
                  •
                </span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <LandingSectionHeader
          eyebrow="// How it works"
          title="Control your cash flow, instantly"
          copy="BucketFlow feels less like a crypto tool and more like a dependable money system for freelancers."
          accent="orange"
        />

        <div className="mt-8 grid gap-px overflow-hidden rounded-[12px] border border-[var(--line)] bg-[var(--line)] lg:mt-10 lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group bg-white px-5 py-6 transition duration-300 hover:bg-[#fcfaf5] sm:px-7 sm:py-8"
            >
              <div className="flex items-center justify-between">
                <p className="text-4xl font-black tracking-tight text-[var(--accent-soft-text)] sm:text-5xl">
                  {step.number}
                </p>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-[var(--panel-soft)] text-[var(--accent-strong)] transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-[var(--accent-soft)] group-hover:text-[var(--action)]">
                  <AppIcon name={step.icon} className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mt-5 text-xl font-bold tracking-tight text-[var(--ink)] transition duration-300 group-hover:text-[var(--accent-strong)] sm:mt-6 sm:text-2xl">
                {step.title}
              </h3>
              <p className="mt-3 text-[13px] leading-6 text-[var(--soft-ink)] sm:mt-4 sm:text-sm sm:leading-7">
                {step.copy}
              </p>
              <div className="mt-6 h-[2px] w-14 bg-[var(--line)] transition duration-300 group-hover:w-24 group-hover:bg-[var(--action)]" />
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-[var(--line)] bg-[var(--panel-soft)]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
          <div className="max-w-xl">
            <p className="text-[10px] uppercase tracking-[0.36em] text-[var(--muted)]">
              BucketFlow
            </p>
            <h2 className="mt-3 text-2xl font-black tracking-tight text-[var(--ink)]">
              Stablecoin income infrastructure for freelancers.
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--soft-ink)]">
              Organize stablecoin payments into rent, savings, tax, family support,
              and cash-out with a calmer money workflow.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between lg:min-w-[320px] lg:justify-end">
            <div className="text-[11px] uppercase tracking-[0.3em] text-[var(--muted)]">
              • Built on Sepolia
            </div>
            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-[10px] border border-[var(--accent-strong)] bg-[var(--accent-strong)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[var(--accent)]"
            >
              Open App
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
