import { formatCurrency } from "@/lib/format";

export type TxForInsights = {
  kind: string;
  amount: number;
  occurred_on: string;
  categories: { name: string } | null;
};

function monthKey(date: Date | string) {
  return typeof date === "string" ? date.slice(0, 7) : date.toISOString().slice(0, 7);
}

export function summarizeMonth(transactions: TxForInsights[], key: string) {
  const inMonth = transactions.filter((t) => monthKey(t.occurred_on) === key);
  const income = inMonth
    .filter((t) => t.kind === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = inMonth
    .filter((t) => t.kind === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  return { income, expense };
}

function topExpenseCategory(transactions: TxForInsights[], key: string) {
  const totals = new Map<string, number>();
  for (const t of transactions) {
    if (t.kind !== "expense" || monthKey(t.occurred_on) !== key) continue;
    const name = t.categories?.name ?? "Sem categoria";
    totals.set(name, (totals.get(name) ?? 0) + t.amount);
  }
  let best: { name: string; amount: number } | null = null;
  for (const [name, amount] of totals) {
    if (!best || amount > best.amount) best = { name, amount };
  }
  return best;
}

export function buildInsights(transactions: TxForInsights[]): string[] {
  const now = new Date();
  const currentKey = monthKey(now);
  const previousKey = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));

  const current = summarizeMonth(transactions, currentKey);
  const previous = summarizeMonth(transactions, previousKey);

  if (!current.income && !current.expense) {
    return ["Adicione suas primeiras transações para começar a ver insights personalizados aqui."];
  }

  const insights: string[] = [];

  if (previous.expense > 0) {
    const change = ((current.expense - previous.expense) / previous.expense) * 100;
    if (Math.abs(change) >= 1) {
      insights.push(
        change > 0
          ? `Seus gastos esse mês estão ${change.toFixed(0)}% maiores do que no mês passado.`
          : `Seus gastos esse mês estão ${Math.abs(change).toFixed(0)}% menores do que no mês passado.`,
      );
    }
  }

  const top = topExpenseCategory(transactions, currentKey);
  if (top) {
    insights.push(
      `Sua maior categoria de gasto esse mês é ${top.name}, com ${formatCurrency(top.amount)}.`,
    );
  }

  if (current.income > 0) {
    const savingsRate = ((current.income - current.expense) / current.income) * 100;
    insights.push(
      savingsRate >= 0
        ? `Você guardou ${savingsRate.toFixed(0)}% da sua renda esse mês.`
        : `Suas despesas esse mês passaram sua renda em ${Math.abs(savingsRate).toFixed(0)}%.`,
    );
  }

  return insights.length
    ? insights
    : ["Continue registrando suas transações para ver mais insights."];
}

export function healthIndicator(income: number, expense: number) {
  if (income === 0 && expense === 0) {
    return { score: null as number | null, label: "Sem dados suficientes ainda" };
  }

  const savingsRate = income > 0 ? (income - expense) / income : -1;
  const score = Math.max(0, Math.min(100, Math.round((savingsRate + 0.5) * 100)));

  if (savingsRate >= 0.2) {
    return { score, label: "Sua saúde financeira está forte esse mês" };
  }
  if (savingsRate >= 0) {
    return { score, label: "Você está no caminho certo" };
  }
  return { score, label: "Esse mês pediu mais atenção — vamos ajustar juntas" };
}
