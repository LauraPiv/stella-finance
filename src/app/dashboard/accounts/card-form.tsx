"use client";

import { useActionState } from "react";
import { createCard } from "@/lib/actions/finance";

type Option = { id: string; name: string };

export function CardForm({ accounts }: { accounts: Option[] }) {
  const [state, action, pending] = useActionState(createCard, undefined);

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="card_name" className="text-xs font-medium text-zinc-600">
          Nome
        </label>
        <input
          id="card_name"
          name="name"
          required
          placeholder="Ex: Nubank Mastercard"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="card_account_id" className="text-xs font-medium text-zinc-600">
          Conta vinculada
        </label>
        <select
          id="card_account_id"
          name="account_id"
          defaultValue=""
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        >
          <option value="">Nenhuma</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="closing_day" className="text-xs font-medium text-zinc-600">
          Fechamento
        </label>
        <input
          id="closing_day"
          name="closing_day"
          type="number"
          min="1"
          max="31"
          placeholder="Dia"
          className="w-20 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="due_day" className="text-xs font-medium text-zinc-600">
          Vencimento
        </label>
        <input
          id="due_day"
          name="due_day"
          type="number"
          min="1"
          max="31"
          placeholder="Dia"
          className="w-20 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="credit_limit" className="text-xs font-medium text-zinc-600">
          Limite
        </label>
        <input
          id="credit_limit"
          name="credit_limit"
          type="number"
          step="0.01"
          placeholder="R$"
          className="w-28 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Adicionando…" : "Adicionar cartão"}
      </button>

      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
