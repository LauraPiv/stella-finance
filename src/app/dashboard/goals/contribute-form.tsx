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
        className="w-32 rounded-lg border border-zinc-300 px-2 py-1.5 text-xs outline-none focus:border-zinc-900"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg border border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
      >
        {pending ? "Adicionando…" : "Registrar aporte"}
      </button>
      {state?.error && <span className="text-xs text-red-600">{state.error}</span>}
    </form>
  );
}
