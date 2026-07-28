"use client";

import { useActionState } from "react";
import { createAccount } from "@/lib/actions/finance";
import { ACCOUNT_TYPE_LABELS } from "@/lib/account-types";

export function AccountForm() {
  const [state, action, pending] = useActionState(createAccount, undefined);

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-xs font-medium text-zinc-600">
          Nome
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Ex: Nubank"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="type" className="text-xs font-medium text-zinc-600">
          Tipo
        </label>
        <select
          id="type"
          name="type"
          required
          defaultValue=""
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        >
          <option value="" disabled>
            Selecione
          </option>
          {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="initial_balance" className="text-xs font-medium text-zinc-600">
          Saldo inicial
        </label>
        <input
          id="initial_balance"
          name="initial_balance"
          type="number"
          step="0.01"
          defaultValue="0"
          className="w-32 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Adicionando…" : "Adicionar conta"}
      </button>

      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
