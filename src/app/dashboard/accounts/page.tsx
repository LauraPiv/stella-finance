import { createClient } from "@/lib/supabase/server";
import { deleteAccount, deleteCard } from "@/lib/actions/finance";
import { ACCOUNT_TYPE_LABELS } from "@/lib/account-types";
import { formatCurrency } from "@/lib/format";
import { Tip } from "@/components/tip";
import { AccountForm } from "./account-form";
import { CardForm } from "./card-form";

export default async function AccountsPage() {
  const supabase = await createClient();
  const [{ data: accounts }, { data: cards }] = await Promise.all([
    supabase.from("accounts").select("*").order("created_at", { ascending: true }),
    supabase
      .from("cards")
      .select("*, accounts(name)")
      .order("created_at", { ascending: true }),
  ]);

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-xl font-semibold text-zinc-900">Contas</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Cadastre onde seu dinheiro vive para acompanhar receitas e despesas.
          </p>
        </div>

        <AccountForm />

        {accounts?.length === 1 && (
          <Tip>
            Conta cadastrada! Agora você pode vincular suas transações a ela
            na hora de registrar uma receita ou despesa.
          </Tip>
        )}

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

      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-xl font-semibold text-zinc-900">Cartões</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Acompanhe fechamento, vencimento e limite dos seus cartões de crédito.
          </p>
        </div>

        <CardForm accounts={accounts ?? []} />

        <ul className="flex flex-col divide-y divide-zinc-100 rounded-lg border border-zinc-200">
          {cards?.length ? (
            cards.map((card) => (
              <li
                key={card.id}
                className="flex items-center justify-between px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-medium text-zinc-900">{card.name}</p>
                  <p className="text-xs text-zinc-500">
                    {card.accounts?.name ? `${card.accounts.name} · ` : ""}
                    {card.closing_day ? `fecha dia ${card.closing_day}` : ""}
                    {card.due_day ? ` · vence dia ${card.due_day}` : ""}
                    {card.credit_limit
                      ? ` · limite ${formatCurrency(card.credit_limit)}`
                      : ""}
                  </p>
                </div>
                <form action={deleteCard.bind(null, card.id)}>
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
              Nenhum cartão cadastrado ainda.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
