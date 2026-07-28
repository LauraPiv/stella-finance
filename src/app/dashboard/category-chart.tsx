import { formatCurrency } from "@/lib/format";
import type { expenseByCategory } from "@/lib/category-breakdown";

export function CategoryChart({
  data,
}: {
  data: ReturnType<typeof expenseByCategory>;
}) {
  if (data.length === 0) {
    return (
      <p className="rounded-lg bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-400">
        Sem despesas categorizadas esse mês ainda.
      </p>
    );
  }

  const max = Math.max(...data.map((d) => d.amount));

  return (
    <div className="flex flex-col gap-2.5" role="img" aria-label="Gastos por categoria esse mês">
      {data.map((slice) => (
        <div key={slice.name} className="flex items-center gap-3" title={`${slice.name}: ${formatCurrency(slice.amount)}`}>
          <span className="w-28 shrink-0 truncate text-xs text-zinc-600">{slice.name}</span>
          <div className="h-5 flex-1 overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-[#2a78d6]"
              style={{ width: `${max > 0 ? (slice.amount / max) * 100 : 0}%` }}
            />
          </div>
          <span className="w-24 shrink-0 text-right text-xs font-medium text-zinc-900">
            {formatCurrency(slice.amount)}
          </span>
        </div>
      ))}
    </div>
  );
}
