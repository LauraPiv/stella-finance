import { createClient } from "@/lib/supabase/server";
import { deleteAccount } from "@/lib/actions/finance";
import { ACCOUNT_TYPE_LABELS } from "@/lib/account-types";
import { formatCurrency } from "@/lib/format";
import { AccountForm } from "./account-form";

export default async function AccountsPage() {
  const supabase = await createClient();
  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .order("created_at", { ascending: true });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Contas e cartões</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Cadastre onde seu dinheiro vive para acompanhar receitas e despesas.
        </p>
      </div>

      <AccountForm />

      <ul className="flex flex-col divide-y divide-zinc-100 rounded-lg border border-zinc-200">
        {accounts?.length ? (
          accounts.map((account) => (
            <li
              key={account.id}
              className="flex items-center justify-between px-4 py-3 text-sm"
            >
              <div>
                <p className="font-medium text-zinc-900">{account.name}</p>
                <p className="text-xs text-zinc-500">
                  {ACCOUNT_TYPE_LABELS[account.type] ?? account.type} ·{" "}
                  {formatCurrency(account.initial_balance)}
                </p>
              </div>
              <form action={deleteAccount.bind(null, account.id)}>
                <button
                  type="submit"
                  className="text-xs font-medium text-zinc-400 underline hover:text-red-600"
                >
                  Remover
                </button>
              </form>
            </li>
          ))
        ) : (
          <li className="px-4 py-6 text-center text-sm text-zinc-400">
            Nenhuma conta cadastrada ainda.
          </li>
        )}
      </ul>
    </div>
  );
}
