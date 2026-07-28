import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/format";
import { buildInsights, healthIndicator, summarizeMonth } from "@/lib/insights";
import { expenseByCategory } from "@/lib/category-breakdown";
import { Greeting } from "@/components/greeting";
import { ProgressRing } from "@/components/progress-ring";
import { StellaSparkle } from "@/components/stella-logo";
import { CategoryChart } from "./category-chart";

function monthLabel(date: Date) {
  const label = date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

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
        .select("full_name, avatar_url")
        .eq("id", user?.id ?? "")
        .single(),
    ]);

  const displayName = profile?.full_name || user?.email?.split("@")[0];
  const hasAnyData = (transactions?.length ?? 0) > 0;

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
    <div className="flex flex-col gap-5 px-[22px] pt-3.5 pb-8">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[13.5px] font-light text-wine/55">{monthLabel(new Date())}</p>
          <h1 className="mt-0.5 font-heading text-[22px] font-semibold text-wine">
            <Greeting name={displayName} />
          </h1>
        </div>
        <Link
          href="/dashboard/settings"
          className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-rose bg-cream font-heading text-[15px] font-semibold text-wine"
        >
          {profile?.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.avatar_url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            (displayName ?? "?").charAt(0).toUpperCase()
          )}
        </Link>
      </div>

      {!hasAnyData ? (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-rose bg-cream px-[22px] py-11 text-center">
          <StellaSparkle size={46} />
          <div className="flex flex-col gap-2">
            <p className="text-pretty font-heading text-[19px] font-semibold text-wine">
              Seu panorama começa na primeira transação
            </p>
            <p className="text-pretty text-[14.5px] font-light leading-relaxed text-wine/65">
              Registre uma receita ou uma despesa e a Stella já consegue te
              mostrar como o mês está indo.
            </p>
          </div>
          <Link
            href="/dashboard/transactions"
            className="min-h-12 rounded-full bg-berry px-6 py-3.5 font-heading text-[15.5px] font-semibold text-white transition-colors hover:bg-berry-dark"
          >
            Registrar primeira transação
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-3.5 rounded-3xl bg-wine px-[22px] pt-[26px] pb-6">
            <ProgressRing percent={health.score ?? 0}>
              <span className="font-heading text-4xl font-semibold leading-none text-white">
                {health.score ?? "–"}
                {health.score !== null && "%"}
              </span>
              <span className="text-xs tracking-wide text-rose">do planejado</span>
            </ProgressRing>
            <p className="text-center font-heading text-xl font-semibold text-white">
              {health.label}
            </p>
            <p className="text-pretty text-center text-sm font-light leading-relaxed text-white/72">
              Comparamos receitas e despesas do mês para chegar nesse número.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-cream p-3.5">
              <p className="m-0 mb-1 text-[11.5px] text-wine/55">Saldo</p>
              <p className="m-0 font-heading text-base font-semibold text-wine">
                {formatCurrency(balance)}
              </p>
            </div>
            <div className="rounded-2xl bg-cream p-3.5">
              <p className="m-0 mb-1 text-[11.5px] text-wine/55">Receitas</p>
              <p className="m-0 font-heading text-base font-semibold text-wine">
                {formatCurrency(income)}
              </p>
            </div>
            <div className="rounded-2xl bg-cream p-3.5">
              <p className="m-0 mb-1 text-[11.5px] text-wine/55">Despesas</p>
              <p className="m-0 font-heading text-base font-semibold text-wine">
                {formatCurrency(expense)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/dashboard/transactions"
              className="flex min-h-[88px] flex-col items-start gap-2.5 rounded-[18px] border border-rose bg-white p-3.5 transition-colors hover:border-berry"
            >
              <StellaSparkle size={19} />
              <span className="text-pretty font-heading text-[13px] font-semibold leading-tight text-wine">
                Nova transação
              </span>
            </Link>
            <Link
              href="/dashboard/goals"
              className="flex min-h-[88px] flex-col items-start gap-2.5 rounded-[18px] border border-rose bg-white p-3.5 transition-colors hover:border-berry"
            >
              <StellaSparkle size={19} />
              <span className="text-pretty font-heading text-[13px] font-semibold leading-tight text-wine">
                Ver metas
              </span>
            </Link>
            <Link
              href="/dashboard/aprender"
              className="flex min-h-[88px] flex-col items-start gap-2.5 rounded-[18px] border border-rose bg-white p-3.5 transition-colors hover:border-berry"
            >
              <StellaSparkle size={19} />
              <span className="text-pretty font-heading text-[13px] font-semibold leading-tight text-wine">
                Aprender
              </span>
            </Link>
          </div>

          <div className="flex flex-col gap-3.5 rounded-[22px] border border-rose bg-white p-5">
            <p className="m-0 font-heading text-base font-semibold text-wine">
              No que o mês foi
            </p>
            <CategoryChart data={categoryBreakdown} />
          </div>

          {insights.map((insight, i) => (
            <div
              key={i}
              className="flex flex-col gap-3.5 rounded-[22px] border border-rose bg-cream p-5"
            >
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full bg-berry">
                  <StellaSparkle size={14} color="white" />
                </div>
                <p className="text-pretty m-0 text-[15px] leading-relaxed text-wine">
                  {insight}
                </p>
              </div>
              {i === 0 && (
                <div className="flex gap-2">
                  <Link
                    href="/dashboard/transactions"
                    className="flex min-h-11 flex-1 items-center justify-center rounded-full border border-wine/18 bg-white px-4 font-heading text-sm font-semibold text-wine"
                  >
                    Ver no extrato
                  </Link>
                  <Link
                    href="/dashboard/mentora"
                    className="flex min-h-11 flex-1 items-center justify-center rounded-full bg-berry px-4 font-heading text-sm font-semibold text-white transition-colors hover:bg-berry-dark"
                  >
                    Perguntar à Stella
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
