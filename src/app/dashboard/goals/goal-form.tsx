"use client";

import { useActionState } from "react";
import { createGoal } from "@/lib/actions/finance";

export function GoalForm() {
  const [state, action, pending] = useActionState(createGoal, undefined);

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-[20px] border border-rose bg-white p-4"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-[13px] text-wine/60">
          Meta
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Ex: Reserva de emergência"
          className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-4 py-3.5 text-base text-wine outline-none focus:border-berry"
        />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="target_amount" className="text-[13px] text-wine/60">
            Valor alvo
          </label>
          <input
            id="target_amount"
            name="target_amount"
            type="number"
            step="0.01"
            min="0.01"
            required
            className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-4 py-3.5 text-base text-wine outline-none focus:border-berry"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="target_date" className="text-[13px] text-wine/60">
            Prazo
          </label>
          <input
            id="target_date"
            name="target_date"
            type="date"
            required
            className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-4 py-3.5 text-base text-wine outline-none focus:border-berry"
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
        {pending ? "Criando…" : "+ Nova meta"}
      </button>
    </form>
  );
}
