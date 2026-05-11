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
        className={`text-[10px] uppercase tracking-[0.42em] ${
          accent === "orange" ? "text-[var(--action)]" : "text-[var(--muted)]"
        }`}
      >
        {eyebrow}
      </p>
      <h2 className="mt-4 text-4xl font-black leading-none tracking-tight text-[var(--ink)] sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {copy ? (
        <p className="mt-4 max-w-xl text-base leading-8 text-[var(--soft-ink)]">
          {copy}
        </p>
      ) : null}
    </div>
  );
}
