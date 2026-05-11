import Link from "next/link";

import { HeroFlowVisual } from "@/components/landing/HeroFlowVisual";
import { LandingSectionHeader } from "@/components/landing/LandingSectionHeader";
import { AppIcon } from "@/components/shared/AppIcon";

const features = [
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

const steps = [
  {
    number: "01",
    title: "Open the app",
    copy: "Start in demo mode to understand the workflow, then connect your wallet when you are ready to use live actions.",
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
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-black tracking-tight text-[var(--accent-strong)]">
              BucketFlow
            </div>
            <p className="hidden text-[11px] uppercase tracking-[0.35em] text-[var(--muted)] sm:block">
              Stablecoin income infrastructure
            </p>
          </div>

          <Link
            href="/app"
            className="rounded-full border border-[var(--accent-strong)] bg-[var(--accent-strong)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.25em] text-white transition hover:bg-[var(--accent)]"
          >
            Explore App
          </Link>
        </div>
      </section>

      <section className="hero-grid relative overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          <div className="relative z-10">
            <p className="mb-5 text-[11px] uppercase tracking-[0.45em] text-[var(--muted)]">
              Stablecoin income, organized for real life
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-[var(--accent-strong)] sm:text-6xl lg:text-7xl">
              Organize your stablecoin income.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[var(--soft-ink)] sm:text-lg">
              BucketFlow helps African freelancers turn incoming stablecoin payments
              into a practical money system for rent, savings, tax, family support,
              and cash-out.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/app"
                className="inline-flex items-center justify-center rounded-2xl bg-[var(--action)] px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white transition hover:translate-y-[-1px] hover:bg-[var(--action-strong)]"
              >
                Launch App
              </Link>

            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[22px] border border-[var(--line)] bg-white/70 px-4 py-4 shadow-[0_14px_32px_rgba(86,73,50,0.05)]">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">
                  Supported flow
                </p>
                <p className="mt-2 text-sm font-black tracking-tight text-[var(--ink)]">
                  Deposit → Organize → Withdraw
                </p>
              </div>
              <div className="rounded-[22px] border border-[var(--line)] bg-white/70 px-4 py-4 shadow-[0_14px_32px_rgba(86,73,50,0.05)]">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">
                  Savings logic
                </p>
                <p className="mt-2 text-sm font-black tracking-tight text-[var(--ink)]">
                  30-day withdrawal cooldown
                </p>
              </div>
              <div className="rounded-[22px] border border-[var(--line)] bg-white/70 px-4 py-4 shadow-[0_14px_32px_rgba(86,73,50,0.05)]">
                <p className="text-[10px] uppercase tracking-[0.28em] text-[var(--muted)]">
                  V1 network
                </p>
                <p className="mt-2 text-sm font-black tracking-tight text-[var(--ink)]">
                  One stablecoin on Sepolia
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[420px] items-center justify-center lg:min-h-[560px]">
            <HeroFlowVisual />
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[var(--panel-soft)]">
        <div className="mx-auto grid w-full max-w-7xl gap-px px-5 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="flex min-h-[180px] flex-col items-center justify-center border-x border-[var(--line)] bg-[var(--panel-soft)] px-6 py-8 text-center transition hover:bg-[#f6f1e8]"
            >
              <div className="inline-flex h-8 w-8 items-center justify-center text-[var(--action)]">
                <AppIcon name={feature.icon} className="h-5 w-5" />
              </div>
              <h2 className="mt-8 text-[12px] font-semibold uppercase tracking-[0.38em] text-[var(--muted)]">
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

      <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
        <LandingSectionHeader
          eyebrow="// How it works"
          title="Build calm around every payment."
          copy="BucketFlow should feel less like crypto tooling and more like a dependable money system for freelancers."
          accent="orange"
        />

        <div className="mt-10 grid gap-px overflow-hidden rounded-[32px] border border-[var(--line)] bg-[var(--line)] lg:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group bg-white px-7 py-8 transition duration-300 hover:bg-[#fcfaf5]"
            >
              <div className="flex items-center justify-between">
                <p className="text-5xl font-black tracking-tight text-[var(--accent-soft-text)]">
                  {step.number}
                </p>
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--panel-soft)] text-[var(--accent-strong)] transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-[var(--accent-soft)] group-hover:text-[var(--action)]">
                  <AppIcon name={step.icon} className="h-5 w-5" />
                </div>
              </div>
              <h3 className="mt-6 text-2xl font-bold tracking-tight text-[var(--ink)] transition duration-300 group-hover:text-[var(--accent-strong)]">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[var(--soft-ink)]">
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
              Sepolia-first • Demo mode available
            </div>
            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-full border border-[var(--accent-strong)] bg-[var(--accent-strong)] px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[var(--accent)]"
            >
              Open App
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
