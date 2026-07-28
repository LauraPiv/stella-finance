"use client";

import { useActionState } from "react";
import { createGoal } from "@/lib/actions/finance";

export function GoalForm() {
  const [state, action, pending] = useActionState(createGoal, undefined);

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <div className="flex flex-col gap-1">
        <label htmlFor="name" className="text-xs font-medium text-zinc-600">
          Meta
        </label>
        <input
          id="name"
          name="name"
          required
          placeholder="Ex: Reserva de emergência"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="target_amount" className="text-xs font-medium text-zinc-600">
          Valor alvo
        </label>
        <input
          id="target_amount"
          name="target_amount"
          type="number"
          step="0.01"
          min="0.01"
          required
          className="w-32 rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="target_date" className="text-xs font-medium text-zinc-600">
          Prazo
        </label>
        <input
          id="target_date"
          name="target_date"
          type="date"
          required
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Criando…" : "Criar meta"}
      </button>

      {state?.error && <p className="w-full text-sm text-red-600">{state.error}</p>}
    </form>
  );
}
