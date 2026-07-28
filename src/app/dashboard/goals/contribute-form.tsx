"use client";

import { useActionState } from "react";
import { contributeToGoal } from "@/lib/actions/finance";

export function ContributeForm({ goalId }: { goalId: string }) {
  const action = contributeToGoal.bind(null, goalId);
  const [state, formAction, pending] = useActionState(action, undefined);

  return (
    <form action={formAction} className="mt-3 flex items-center gap-2">
      <input
        name="amount"
        type="number"
        step="0.01"
        min="0.01"
        placeholder="Valor do aporte"
        required
        className="w-32 rounded-full border-[1.5px] border-rose bg-white px-3.5 py-2 text-[13px] text-wine outline-none focus:border-berry"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-cream px-3.5 py-2 font-heading text-[13px] font-semibold text-berry transition-colors hover:bg-rose/40 disabled:opacity-50"
      >
        {pending ? "Adicionando…" : "Registrar aporte"}
      </button>
      {state?.error && <span className="text-xs text-berry">{state.error}</span>}
    </form>
  );
}
