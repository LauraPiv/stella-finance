import { formatCurrency } from "@/lib/format";
import type { expenseByCategory } from "@/lib/category-breakdown";

const BAR_COLORS = ["var(--color-berry)", "#E1749A", "var(--color-rose)"];

export function CategoryChart({
  data,
}: {
  data: ReturnType<typeof expenseByCategory>;
}) {
  if (data.length === 0) {
    return (
      <p className="rounded-2xl bg-cream px-4 py-6 text-center text-sm text-wine/50">
        Sem despesas categorizadas esse mês ainda.
      </p>
    );
  }

  const max = Math.max(...data.map((d) => d.amount));

  return (
    <div className="flex flex-col gap-3" role="img" aria-label="Gastos por categoria esse mês">
      {data.map((slice, i) => (
        <div key={slice.name} className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-sm text-wine">{slice.name}</span>
            <span className="font-heading text-[13.5px] font-semibold text-wine/70">
              {formatCurrency(slice.amount)}
            </span>
          </div>
          <div className="h-[9px] overflow-hidden rounded-full bg-cream">
            <div
              className="h-full rounded-full"
              style={{
                width: `${max > 0 ? (slice.amount / max) * 100 : 0}%`,
                background: BAR_COLORS[Math.min(i, BAR_COLORS.length - 1)],
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
