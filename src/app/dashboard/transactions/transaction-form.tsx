"use client";

import { useActionState, useState } from "react";
import { createTransaction } from "@/lib/actions/finance";

type Option = { id: string; name: string };

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

  const filteredCategories = categories.filter((c) => c.kind === kind);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4">
      <div className="flex gap-2">
        <label className="flex-1">
          <input
            type="radio"
            name="kind"
            value="expense"
            checked={kind === "expense"}
            onChange={() => setKind("expense")}
            className="peer sr-only"
          />
          <span className="block cursor-pointer rounded-lg border border-zinc-300 px-3 py-2 text-center text-sm font-medium text-zinc-600 peer-checked:border-zinc-900 peer-checked:bg-zinc-900 peer-checked:text-white">
            Despesa
          </span>
        </label>
        <label className="flex-1">
          <input
            type="radio"
            name="kind"
            value="income"
            checked={kind === "income"}
            onChange={() => setKind("income")}
            className="peer sr-only"
          />
          <span className="block cursor-pointer rounded-lg border border-zinc-300 px-3 py-2 text-center text-sm font-medium text-zinc-600 peer-checked:border-zinc-900 peer-checked:bg-zinc-900 peer-checked:text-white">
            Receita
          </span>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="amount" className="text-xs font-medium text-zinc-600">
            Valor
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="occurred_on" className="text-xs font-medium text-zinc-600">
            Data
          </label>
          <input
            id="occurred_on"
            name="occurred_on"
            type="date"
            defaultValue={today}
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="category_id" className="text-xs font-medium text-zinc-600">
            Categoria
          </label>
          <select
            id="category_id"
            name="category_id"
            defaultValue=""
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          >
            <option value="">Sem categoria</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="account_id" className="text-xs font-medium text-zinc-600">
            Conta
          </label>
          <select
            id="account_id"
            name="account_id"
            defaultValue=""
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          >
            <option value="">Sem conta</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>

        {kind === "expense" && (
          <div className="flex flex-col gap-1">
            <label htmlFor="card_id" className="text-xs font-medium text-zinc-600">
              Cartão
            </label>
            <select
              id="card_id"
              name="card_id"
              defaultValue=""
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            >
              <option value="">Sem cartão</option>
              {cards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-xs font-medium text-zinc-600">
          Descrição (opcional)
        </label>
        <input
          id="description"
          name="description"
          placeholder="Ex: Mercado do mês"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-600">
        <input type="checkbox" name="is_recurring" className="accent-zinc-900" />
        É uma despesa/receita recorrente (assinatura, salário fixo, etc.)
      </label>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Salvando…" : "Adicionar transação"}
      </button>
    </form>
  );
}
