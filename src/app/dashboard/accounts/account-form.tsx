"use client";

import { useActionState } from "react";
import { createAccount } from "@/lib/actions/finance";
import { ACCOUNT_TYPE_LABELS } from "@/lib/account-types";

export function AccountForm() {
  const [state, action, pending] = useActionState(createAccount, undefined);

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-[20px] border border-rose bg-white p-4"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-[13px] text-wine/60">
          Nome
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Ex: Nubank"
          className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-4 py-3.5 text-base text-wine outline-none focus:border-berry"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="type" className="text-[13px] text-wine/60">
          Tipo
        </label>
        <select
          id="type"
          name="type"
          required
          defaultValue=""
          className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-4 py-3.5 text-base text-wine outline-none focus:border-berry"
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

      <div className="flex flex-col gap-1.5">
        <label htmlFor="initial_balance" className="text-[13px] text-wine/60">
          Saldo inicial
        </label>
        <input
          id="initial_balance"
          name="initial_balance"
          type="number"
          step="0.01"
          defaultValue="0"
          className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-4 py-3.5 text-base text-wine outline-none focus:border-berry"
        />
      </div>

      {state?.error && (
        <div className="rounded-2xl border border-berry bg-cream px-4 py-3.5">
          <p className="m-0 text-sm text-wine">{state.error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="min-h-[50px] rounded-full border-[1.5px] border-berry bg-white font-heading text-[15px] font-semibold text-berry transition-colors hover:bg-cream disabled:opacity-50"
      >
        {pending ? "Adicionando…" : "+ Adicionar conta"}
      </button>
    </form>
  );
}
