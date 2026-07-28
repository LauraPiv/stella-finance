export type TxForBreakdown = {
  kind: string;
  amount: number;
  occurred_on: string;
  categories: { name: string } | null;
};

const MAX_SLICES = 6;

export function expenseByCategory(transactions: TxForBreakdown[], monthKey: string) {
  const totals = new Map<string, number>();

  for (const t of transactions) {
    if (t.kind !== "expense" || t.occurred_on.slice(0, 7) !== monthKey) continue;
    const name = t.categories?.name ?? "Sem categoria";
    totals.set(name, (totals.get(name) ?? 0) + t.amount);
  }

  const sorted = [...totals.entries()]
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount);

  if (sorted.length <= MAX_SLICES) return sorted;

  const top = sorted.slice(0, MAX_SLICES - 1);
  const restTotal = sorted.slice(MAX_SLICES - 1).reduce((sum, s) => sum + s.amount, 0);
  return [...top, { name: "Outras", amount: restTotal }];
}
