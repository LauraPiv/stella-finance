import { createClient } from "@/lib/supabase/server";
import { deleteTransaction } from "@/lib/actions/finance";
import { formatCurrency, formatDate } from "@/lib/format";
import { Tip } from "@/components/tip";
import { TransactionForm } from "./transaction-form";

export default async function TransactionsPage() {
  const supabase = await createClient();

  const [{ data: transactions }, { data: accounts }, { data: cards }, { data: categories }] =
    await Promise.all([
      supabase
        .from("transactions")
        .select(
          "id, kind, amount, description, occurred_on, is_recurring, accounts(name), cards(name), categories(name)",
        )
        .order("occurred_on", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase.from("accounts").select("id, name").order("name"),
      supabase.from("cards").select("id, name").order("name"),
      supabase.from("categories").select("id, name, kind").order("name"),
    ]);

  const recurring = transactions?.filter((tx) => tx.is_recurring) ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Transações</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Registre suas receitas e despesas para acompanhar para onde vai seu dinheiro.
        </p>
      </div>

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
          <p className="text-sm font-medium text-zinc-700">Recorrentes e assinaturas</p>
          <ul className="mt-2 flex flex-col divide-y divide-zinc-100 rounded-lg border border-zinc-200">
            {recurring.map((tx) => (
              <li key={tx.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <p className="font-medium text-zinc-900">
                  {tx.description || tx.categories?.name || "Sem descrição"}
                </p>
                <span className="font-medium text-zinc-900">
                  {formatCurrency(tx.amount)}/mês
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="flex flex-col divide-y divide-zinc-100 rounded-lg border border-zinc-200">
        {transactions?.length ? (
          transactions.map((tx) => (
            <li key={tx.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-zinc-900">
                  {tx.description || tx.categories?.name || "Sem descrição"}
                  {tx.is_recurring && (
                    <span className="ml-2 rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                      Recorrente
                    </span>
                  )}
                </p>
                <p className="text-xs text-zinc-500">
                  {formatDate(tx.occurred_on)}
                  {tx.categories?.name ? ` · ${tx.categories.name}` : ""}
                  {tx.accounts?.name ? ` · ${tx.accounts.name}` : ""}
                  {tx.cards?.name ? ` · ${tx.cards.name}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={
                    tx.kind === "income"
                      ? "font-medium text-emerald-600"
                      : "font-medium text-zinc-900"
                  }
                >
                  {tx.kind === "income" ? "+" : "−"}
                  {formatCurrency(tx.amount)}
                </span>
                <form action={deleteTransaction.bind(null, tx.id)}>
                  <button
                    type="submit"
                    className="text-xs font-medium text-zinc-400 underline hover:text-red-600"
                  >
                    Remover
                  </button>
                </form>
              </div>
            </li>
          ))
        ) : (
          <li className="px-4 py-6 text-center text-sm text-zinc-400">
            Nenhuma transação registrada ainda.
          </li>
        )}
      </ul>
    </div>
  );
}
