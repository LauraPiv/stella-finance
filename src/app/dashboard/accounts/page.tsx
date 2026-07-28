import { createClient } from "@/lib/supabase/server";
import { deleteAccount, deleteCard } from "@/lib/actions/finance";
import { ACCOUNT_TYPE_LABELS } from "@/lib/account-types";
import { formatCurrency } from "@/lib/format";
import { Tip } from "@/components/tip";
import { AccountForm } from "./account-form";
import { CardForm } from "./card-form";

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

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
    <div className="flex flex-col gap-10 px-[22px] pt-3.5 pb-8">
      <div className="flex flex-col gap-4">
        <h1 className="font-heading text-2xl font-semibold text-wine">Contas</h1>

        {accounts?.length === 1 && (
          <Tip>
            Conta cadastrada! Agora você pode vincular suas transações a ela
            na hora de registrar uma receita ou despesa.
          </Tip>
        )}

        <div className="flex flex-col gap-2.5">
          {accounts?.length ? (
            accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center gap-3.5 rounded-[20px] border border-rose bg-white px-4 py-[18px]"
              >
                <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl bg-cream font-heading text-sm font-semibold text-berry">
                  {initials(account.name)}
                </span>
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="font-heading text-[15.5px] font-semibold text-wine">
                    {account.name}
                  </span>
                  <span className="text-[12.5px] text-wine/55">
                    {ACCOUNT_TYPE_LABELS[account.type] ?? account.type}
                  </span>
                </span>
                <span className="font-heading text-[15.5px] font-semibold text-wine">
                  {formatCurrency(account.initial_balance)}
                </span>
                <form action={deleteAccount.bind(null, account.id)}>
                  <button
                    type="submit"
                    className="text-xs font-medium text-wine/40 underline hover:text-berry"
                  >
                    Remover
                  </button>
                </form>
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-cream px-4 py-6 text-center text-sm text-wine/50">
              Nenhuma conta cadastrada ainda.
            </p>
          )}
        </div>

        <AccountForm />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-heading text-2xl font-semibold text-wine">Cartões</h2>

        <div className="flex flex-col gap-2.5">
          {cards?.length ? (
            cards.map((card) => (
              <div
                key={card.id}
                className="flex items-center gap-3.5 rounded-[20px] border border-rose bg-white px-4 py-[18px]"
              >
                <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-xl bg-cream font-heading text-sm font-semibold text-berry">
                  {initials(card.name)}
                </span>
                <span className="flex flex-1 flex-col gap-0.5">
                  <span className="font-heading text-[15.5px] font-semibold text-wine">
                    {card.name}
                  </span>
                  <span className="text-[12.5px] text-wine/55">
                    {card.accounts?.name ? `${card.accounts.name} · ` : ""}
                    {card.closing_day ? `fecha dia ${card.closing_day}` : ""}
                    {card.due_day ? ` · vence dia ${card.due_day}` : ""}
                  </span>
                </span>
                {card.credit_limit && (
                  <span className="font-heading text-[15.5px] font-semibold text-wine">
                    {formatCurrency(card.credit_limit)}
                  </span>
                )}
                <form action={deleteCard.bind(null, card.id)}>
                  <button
                    type="submit"
                    className="text-xs font-medium text-wine/40 underline hover:text-berry"
                  >
                    Remover
                  </button>
                </form>
              </div>
            ))
          ) : (
            <p className="rounded-2xl bg-cream px-4 py-6 text-center text-sm text-wine/50">
              Nenhum cartão cadastrado ainda.
            </p>
          )}
        </div>

        <CardForm accounts={accounts ?? []} />
      </div>
    </div>
  );
}
