import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteTransaction } from "@/lib/actions/finance";
import { formatCurrency, formatDate } from "@/lib/format";
import { Tip } from "@/components/tip";
import { TransactionForm } from "./transaction-form";

function chipHref(base: Record<string, string>, patch: Record<string, string>) {
  const params = new URLSearchParams({ ...base, ...patch });
  return `/dashboard/transactions?${params.toString()}`;
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ periodo?: string; categoria?: string }>;
}) {
  const { periodo = "mes", categoria = "Todas" } = await searchParams;
  const supabase = await createClient();

  const [{ data: transactions }, { data: accounts }, { data: cards }, { data: categories }] =
    await Promise.all([
      supabase
        .from("transactions")
        .select(
          "id, kind, amount, description, occurred_on, is_recurring, installment_number, installment_total, accounts(name), cards(name), categories(name)",
        )
        .order("occurred_on", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase.from("accounts").select("id, name").order("name"),
      supabase.from("cards").select("id, name").order("name"),
      supabase.from("categories").select("id, name, kind").order("name"),
    ]);

  const recurring = transactions?.filter((tx) => tx.is_recurring) ?? [];
  const currentMonth = new Date().toISOString().slice(0, 7);

  const periodFiltered = (transactions ?? []).filter((tx) =>
    periodo === "mes" ? tx.occurred_on.slice(0, 7) === currentMonth : true,
  );

  const categoryNames = [...new Set(periodFiltered.map((t) => t.categories?.name ?? "Sem categoria"))];

  const visible = periodFiltered.filter(
    (tx) => categoria === "Todas" || (tx.categories?.name ?? "Sem categoria") === categoria,
  );

  const groupsMap = new Map<string, typeof visible>();
  for (const tx of visible) {
    const key = tx.categories?.name ?? "Sem categoria";
    groupsMap.set(key, [...(groupsMap.get(key) ?? []), tx]);
  }
  const groups = [...groupsMap.entries()]
    .map(([name, items]) => ({
      name,
      items,
      total: items.reduce((sum, t) => sum + (t.kind === "income" ? t.amount : -t.amount), 0),
    }))
    .sort((a, b) => Math.abs(b.total) - Math.abs(a.total));

  const baseParams = { periodo, categoria };

  return (
    <div className="flex flex-col gap-6 px-[22px] pt-3.5 pb-8">
      <h1 className="font-heading text-2xl font-semibold text-wine">Transações</h1>

      <TransactionForm
        accounts={accounts ?? []}
        cards={cards ?? []}
        categories={categories ?? []}
      />

      {transactions?.length === 1 && (
        <Tip>
          Essa foi sua primeira transação! Continue registrando suas receitas e
          despesas para a Stella entender seus padrões de gasto e gerar
          insights melhores para você.
        </Tip>
      )}

      {recurring.length > 0 && (
        <div>
          <p className="font-heading text-sm font-semibold text-wine">
            Recorrentes e assinaturas
          </p>
          <div className="mt-2 flex flex-col gap-2">
            {recurring.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-2xl border border-rose bg-white px-4 py-3"
              >
                <p className="m-0 text-sm text-wine">
                  {tx.description || tx.categories?.name || "Sem descrição"}
                </p>
                <span className="font-heading text-sm font-semibold text-wine">
                  {formatCurrency(tx.amount)}/mês
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {transactions?.length ? (
        <div className="flex flex-col gap-3.5">
          <div className="flex gap-1.5 overflow-x-auto">
            {[
              { key: "mes", label: "Este mês" },
              { key: "todos", label: "Todo o período" },
            ].map((p) => (
              <Link
                key={p.key}
                href={chipHref(baseParams, { periodo: p.key })}
                className={`shrink-0 rounded-full border px-[15px] py-2 font-heading text-[13.5px] font-semibold ${
                  periodo === p.key
                    ? "border-berry bg-berry text-white"
                    : "border-rose bg-white text-wine"
                }`}
              >
                {p.label}
              </Link>
            ))}
          </div>

          <div className="flex gap-1.5 overflow-x-auto">
            <Link
              href={chipHref(baseParams, { categoria: "Todas" })}
              className={`shrink-0 rounded-full border px-3.5 py-2 text-[13.5px] ${
                categoria === "Todas"
                  ? "border-berry bg-berry text-white"
                  : "border-rose bg-white text-wine"
              }`}
            >
              Todas
            </Link>
            {categoryNames.map((name) => (
              <Link
                key={name}
                href={chipHref(baseParams, { categoria: name })}
                className={`shrink-0 rounded-full border px-3.5 py-2 text-[13.5px] ${
                  categoria === name
                    ? "border-berry bg-berry text-white"
                    : "border-rose bg-white text-wine"
                }`}
              >
                {name}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2.5">
            {groups.length ? (
              groups.map((group) => (
                <details
                  key={group.name}
                  className="group overflow-hidden rounded-[18px] border border-rose bg-white"
                >
                  <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        background:
                          group.name === "Sem categoria" ? "var(--color-wine)" : "var(--color-rose)",
                      }}
                    />
                    <span className="flex flex-1 flex-col gap-0.5">
                      <span className="font-heading text-[15.5px] font-semibold text-wine">
                        {group.name}
                      </span>
                      <span className="text-[12.5px] text-wine/55">
                        {group.items.length === 1
                          ? "1 lançamento"
                          : `${group.items.length} lançamentos`}
                      </span>
                    </span>
                    <span className="font-heading text-base font-semibold text-wine">
                      {formatCurrency(Math.abs(group.total))}
                    </span>
                    <span className="w-3.5 text-center text-wine/45 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>

                  <div className="flex flex-col px-4 pb-2">
                    {group.items.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center gap-3 border-t border-cream py-3"
                      >
                        <span className="flex flex-1 flex-col gap-0.5">
                          <span className="text-[14.5px] text-wine">
                            {t.description || group.name}
                            {t.is_recurring && (
                              <span className="ml-2 rounded-full bg-cream px-2 py-0.5 text-[10px] font-medium text-wine/60">
                                Recorrente
                              </span>
                            )}
                            {t.installment_total && t.installment_total > 1 && (
                              <span className="ml-2 rounded-full bg-cream px-2 py-0.5 text-[10px] font-medium text-wine/60">
                                {t.installment_number}/{t.installment_total}
                              </span>
                            )}
                          </span>
                          <span className="text-xs text-wine/50">
                            {formatDate(t.occurred_on)}
                            {t.accounts?.name ? ` · ${t.accounts.name}` : ""}
                            {t.cards?.name ? ` · ${t.cards.name}` : ""}
                          </span>
                        </span>
                        <span
                          className={`font-heading text-[14.5px] font-semibold ${
                            t.kind === "income" ? "text-berry" : "text-wine"
                          }`}
                        >
                          {t.kind === "income" ? "+ " : "− "}
                          {formatCurrency(t.amount)}
                        </span>
                        <form action={deleteTransaction.bind(null, t.id)}>
                          <button
                            type="submit"
                            className="text-xs font-medium text-wine/40 underline hover:text-berry"
                          >
                            Remover
                          </button>
                        </form>
                      </div>
                    ))}
                  </div>
                </details>
              ))
            ) : (
              <p className="rounded-2xl bg-cream px-4 py-6 text-center text-sm text-wine/50">
                Nada por aqui com esse filtro.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-rose bg-cream px-[22px] py-11 text-center">
          <p className="text-pretty font-heading text-[18.5px] font-semibold text-wine">
            Nada registrado por aqui ainda
          </p>
          <p className="text-pretty text-[14.5px] font-light leading-relaxed text-wine/65">
            Comece pela receita do mês ou por um gasto recente — o resto vai
            se organizando junto.
          </p>
        </div>
      )}
    </div>
  );
}
