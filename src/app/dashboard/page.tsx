import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/format";
import { buildInsights, healthIndicator, summarizeMonth } from "@/lib/insights";
import { expenseByCategory } from "@/lib/category-breakdown";
import { Greeting } from "@/components/greeting";
import { CategoryChart } from "./category-chart";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: accounts }, { data: transactions }, { data: profile }] =
    await Promise.all([
      supabase.from("accounts").select("initial_balance"),
      supabase
        .from("transactions")
        .select("kind, amount, occurred_on, categories(name)"),
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user?.id ?? "")
        .single(),
    ]);

  const displayName = profile?.full_name || user?.email?.split("@")[0];

  const accountsBalance =
    accounts?.reduce((sum, a) => sum + a.initial_balance, 0) ?? 0;
  const netFromTransactions =
    transactions?.reduce(
      (sum, t) => sum + (t.kind === "income" ? t.amount : -t.amount),
      0,
    ) ?? 0;
  const balance = accountsBalance + netFromTransactions;

  const currentKey = new Date().toISOString().slice(0, 7);
  const { income, expense } = summarizeMonth(transactions ?? [], currentKey);
  const insights = buildInsights(transactions ?? []);
  const health = healthIndicator(income, expense);
  const categoryBreakdown = expenseByCategory(transactions ?? [], currentKey);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">
          <Greeting name={displayName} />
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Aqui está um resumo de como suas finanças estão esse mês.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-zinc-200 p-4">
          <p className="text-xs font-medium text-zinc-500">Saldo total</p>
          <p className="mt-1 text-xl font-semibold text-zinc-900">
            {formatCurrency(balance)}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4">
          <p className="text-xs font-medium text-zinc-500">Receitas do mês</p>
          <p className="mt-1 text-xl font-semibold text-emerald-600">
            {formatCurrency(income)}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-200 p-4">
          <p className="text-xs font-medium text-zinc-500">Despesas do mês</p>
          <p className="mt-1 text-xl font-semibold text-zinc-900">
            {formatCurrency(expense)}
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-200 p-4">
        <p className="text-xs font-medium text-zinc-500">Saúde financeira</p>
        <p className="mt-1 text-base font-medium text-zinc-900">{health.label}</p>
        {health.score !== null && (
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-zinc-900"
              style={{ width: `${health.score}%` }}
            />
          </div>
        )}
        <details className="mt-3 text-xs text-zinc-500">
          <summary className="cursor-pointer font-medium text-zinc-600">
            Como calculamos isso?
          </summary>
          <p className="mt-1.5">
            Comparamos quanto entrou (receitas) com quanto saiu (despesas) esse
            mês. Quanto maior a parte da sua renda que sobra no fim do mês,
            mais forte fica esse indicador — sem julgamento, é só um retrato do
            momento atual para você acompanhar a evolução ao longo do tempo.
          </p>
        </details>
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-700">Gastos por categoria esse mês</p>
        <div className="mt-3 rounded-lg border border-zinc-200 p-4">
          <CategoryChart data={categoryBreakdown} />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-700">Insights para você</p>
        <ul className="mt-2 flex flex-col gap-2">
          {insights.map((insight, i) => (
            <li
              key={i}
              className="rounded-lg bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
            >
              {insight}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/dashboard/transactions"
        className="self-start rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
      >
        Registrar transação
      </Link>
    </div>
  );
}
