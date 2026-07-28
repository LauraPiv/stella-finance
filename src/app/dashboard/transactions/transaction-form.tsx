"use client";

import { useActionState, useState } from "react";
import { createTransaction } from "@/lib/actions/finance";

type Option = { id: string; name: string };

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-11 rounded-full border px-[15px] py-2.5 text-sm ${
        active ? "border-berry bg-berry text-white" : "border-rose bg-white text-wine"
      }`}
    >
      {label}
    </button>
  );
}

export function TransactionForm({
  accounts,
  cards,
  categories,
}: {
  accounts: Option[];
  cards: Option[];
  categories: (Option & { kind: string })[];
}) {
  const [state, action, pending] = useActionState(createTransaction, undefined);
  const [kind, setKind] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [cardId, setCardId] = useState<string | null>(null);
  const [recurring, setRecurring] = useState(false);

  const filteredCategories = categories.filter((c) => c.kind === kind);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form
      action={action}
      className="flex flex-col gap-5 rounded-[20px] border border-rose bg-white p-4"
    >
      <input type="hidden" name="category_id" value={categoryId ?? ""} />
      <input type="hidden" name="account_id" value={accountId ?? ""} />
      <input type="hidden" name="card_id" value={cardId ?? ""} />

      <div className="flex gap-1.5 rounded-full bg-cream p-[5px]">
        <button
          type="button"
          onClick={() => setKind("expense")}
          className={`min-h-[46px] flex-1 rounded-full font-heading text-[14.5px] font-semibold ${
            kind === "expense" ? "bg-wine text-white" : "text-wine/60"
          }`}
        >
          Despesa
        </button>
        <button
          type="button"
          onClick={() => setKind("income")}
          className={`min-h-[46px] flex-1 rounded-full font-heading text-[14.5px] font-semibold ${
            kind === "income" ? "bg-wine text-white" : "text-wine/60"
          }`}
        >
          Receita
        </button>
        <input type="hidden" name="kind" value={kind} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="amount" className="text-[13px] text-wine/60">
          Valor
        </label>
        <input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="R$ 0,00"
          required
          className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-4 py-4 font-heading text-[30px] font-semibold text-wine outline-none focus:border-berry"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="occurred_on" className="text-[13px] text-wine/60">
          Data
        </label>
        <input
          id="occurred_on"
          name="occurred_on"
          type="date"
          defaultValue={today}
          required
          className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-4 py-3.5 text-base text-wine outline-none focus:border-berry"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[13px] text-wine/60">Categoria</span>
        <div className="flex flex-wrap gap-1.5">
          {filteredCategories.map((category) => (
            <Chip
              key={category.id}
              label={category.name}
              active={categoryId === category.id}
              onClick={() => setCategoryId(categoryId === category.id ? null : category.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[13px] text-wine/60">Conta ou cartão</span>
        <div className="flex flex-wrap gap-1.5">
          {accounts.map((acc) => (
            <Chip
              key={acc.id}
              label={acc.name}
              active={accountId === acc.id}
              onClick={() => setAccountId(accountId === acc.id ? null : acc.id)}
            />
          ))}
          {kind === "expense" &&
            cards.map((card) => (
              <Chip
                key={card.id}
                label={card.name}
                active={cardId === card.id}
                onClick={() => setCardId(cardId === card.id ? null : card.id)}
              />
            ))}
        </div>
      </div>

      {kind === "expense" && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="installments" className="text-[13px] text-wine/60">
            Parcelas
          </label>
          <input
            id="installments"
            name="installments"
            type="number"
            min="1"
            max="60"
            defaultValue="1"
            className="w-24 rounded-2xl border-[1.5px] border-rose bg-white px-4 py-3.5 text-base text-wine outline-none focus:border-berry"
          />
          <span className="text-xs text-wine/45">
            O valor acima é o da parcela, não o total da compra.
          </span>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-[13px] text-wine/60">
          Descrição (opcional)
        </label>
        <input
          id="description"
          name="description"
          placeholder="Ex: Mercado do mês"
          className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-4 py-3.5 text-base text-wine outline-none focus:border-berry"
        />
      </div>

      <button
        type="button"
        onClick={() => setRecurring(!recurring)}
        className="flex min-h-[52px] items-center justify-between gap-3 rounded-2xl border border-rose bg-white px-4 py-3.5 text-left"
      >
        <span className="flex flex-col gap-0.5">
          <span className="text-[15px] text-wine">É recorrente?</span>
          <span className="text-[12.5px] text-wine/55">
            Repete todo mês na mesma data
          </span>
        </span>
        <span
          className="relative h-[26px] w-11 shrink-0 rounded-full transition-colors"
          style={{ background: recurring ? "var(--color-berry)" : "rgba(75,21,40,0.18)" }}
        >
          <span
            className="absolute top-[3px] h-5 w-5 rounded-full bg-white transition-all"
            style={{ left: recurring ? "21px" : "3px" }}
          />
        </span>
        <input type="hidden" name="is_recurring" value={recurring ? "on" : ""} />
      </button>

      {state?.error && (
        <div className="rounded-2xl border border-berry bg-cream px-4 py-3.5">
          <p className="m-0 text-sm text-wine">{state.error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="min-h-[52px] rounded-full bg-berry font-heading text-base font-semibold text-white transition-colors hover:bg-berry-dark disabled:opacity-50"
      >
        {pending ? "Salvando…" : "Salvar transação"}
      </button>
    </form>
  );
}
