"use client";

import { useActionState } from "react";
import { createCard } from "@/lib/actions/finance";

type Option = { id: string; name: string };

export function CardForm({ accounts }: { accounts: Option[] }) {
  const [state, action, pending] = useActionState(createCard, undefined);

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-[20px] border border-rose bg-white p-4"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="card_name" className="text-[13px] text-wine/60">
          Nome
        </label>
        <input
          id="card_name"
          name="name"
          required
          placeholder="Ex: Nubank Mastercard"
          className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-4 py-3.5 text-base text-wine outline-none focus:border-berry"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="card_account_id" className="text-[13px] text-wine/60">
          Conta vinculada
        </label>
        <select
          id="card_account_id"
          name="account_id"
          defaultValue=""
          className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-4 py-3.5 text-base text-wine outline-none focus:border-berry"
        >
          <option value="">Nenhuma</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="closing_day" className="text-[13px] text-wine/60">
            Fechamento
          </label>
          <input
            id="closing_day"
            name="closing_day"
            type="number"
            min="1"
            max="31"
            placeholder="Dia"
            className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-3 py-3.5 text-base text-wine outline-none focus:border-berry"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="due_day" className="text-[13px] text-wine/60">
            Vencimento
          </label>
          <input
            id="due_day"
            name="due_day"
            type="number"
            min="1"
            max="31"
            placeholder="Dia"
            className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-3 py-3.5 text-base text-wine outline-none focus:border-berry"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="credit_limit" className="text-[13px] text-wine/60">
            Limite
          </label>
          <input
            id="credit_limit"
            name="credit_limit"
            type="number"
            step="0.01"
            placeholder="R$"
            className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-3 py-3.5 text-base text-wine outline-none focus:border-berry"
          />
        </div>
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
        {pending ? "Adicionando…" : "+ Adicionar cartão"}
      </button>
    </form>
  );
}
