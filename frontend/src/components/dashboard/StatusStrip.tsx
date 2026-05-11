type StatusStripItem = {
  label: string;
  value: string;
  tone?: "olive" | "orange" | "stone";
};

type StatusStripProps = {
  items: StatusStripItem[];
};

const toneClasses: Record<NonNullable<StatusStripItem["tone"]>, string> = {
  olive:
    "border-[rgba(116,138,61,0.18)] bg-[var(--accent-soft)] text-[var(--accent-strong)]",
  orange:
    "border-[rgba(230,120,63,0.18)] bg-[#fbe8dc] text-[var(--action-strong)]",
  stone:
    "border-[var(--line)] bg-[var(--panel)] text-[var(--ink)]",
};

export function StatusStrip({ items }: StatusStripProps) {
  return (
    <section className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const tone = toneClasses[item.tone ?? "stone"];

        return (
          <div
            key={`${item.label}-${item.value}`}
            className={`rounded-[18px] border px-3.5 py-3 ${tone}`}
          >
            <p className="text-[10px] uppercase tracking-[0.28em] opacity-70">
              {item.label}
            </p>
            <p className="mt-1.5 text-sm font-black tracking-tight">
              {item.value}
            </p>
          </div>
        );
      })}
    </section>
  );
}
