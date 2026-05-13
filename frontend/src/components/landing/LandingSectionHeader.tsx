type LandingSectionHeaderProps = {
  eyebrow: string;
  title: string;
  copy?: string;
  accent?: "olive" | "orange";
};

export function LandingSectionHeader({
  eyebrow,
  title,
  copy,
  accent = "olive",
}: LandingSectionHeaderProps) {
  return (
    <div className="max-w-2xl">
      <p
        className={`text-[10px] uppercase tracking-[0.28em] sm:tracking-[0.42em] ${
          accent === "orange" ? "text-[var(--action)]" : "text-[var(--muted)]"
        }`}
      >
        {eyebrow}
      </p>
      <h2 className="mt-3 text-[2.15rem] font-black leading-[0.98] tracking-tight text-[var(--ink)] sm:mt-4 sm:text-5xl sm:leading-none lg:text-6xl">
        {title}
      </h2>
      {copy ? (
        <p className="mt-3 max-w-xl text-[15px] leading-7 text-[var(--soft-ink)] sm:mt-4 sm:text-base sm:leading-8">
          {copy}
        </p>
      ) : null}
    </div>
  );
}
