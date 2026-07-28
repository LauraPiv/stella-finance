import { createClient } from "@/lib/supabase/server";
import { deleteTransaction } from "@/lib/actions/finance";
import { formatCurrency, formatDate } from "@/lib/format";
import { TransactionForm } from "./transaction-form";

export default async function TransactionsPage() {
  const supabase = await createClient();

  const [{ data: transactions }, { data: accounts }, { data: categories }] =
    await Promise.all([
      supabase
        .from("transactions")
        .select("id, kind, amount, description, occurred_on, accounts(name), categories(name)")
        .order("occurred_on", { ascending: false })
        .order("created_at", { ascending: false }),
      supabase.from("accounts").select("id, name").order("name"),
      supabase.from("categories").select("id, name, kind").order("name"),
    ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Transações</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Registre suas receitas e despesas para acompanhar para onde vai seu dinheiro.
        </p>
      </div>

      <TransactionForm accounts={accounts ?? []} categories={categories ?? []} />

      <ul className="flex flex-col divide-y divide-zinc-100 rounded-lg border border-zinc-200">
        {transactions?.length ? (
          transactions.map((tx) => (
            <li key={tx.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <div>
                <p className="font-medium text-zinc-900">
                  {tx.description || tx.categories?.name || "Sem descrição"}
                </p>
                <p className="text-xs text-zinc-500">
                  {formatDate(tx.occurred_on)}
                  {tx.categories?.name ? ` · ${tx.categories.name}` : ""}
                  {tx.accounts?.name ? ` · ${tx.accounts.name}` : ""}
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
