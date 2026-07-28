"use client";

import { useActionState } from "react";
import { verifyMfaChallenge } from "@/lib/actions/mfa";

export function VerifyForm({ factorId }: { factorId: string }) {
  const [state, action, pending] = useActionState(verifyMfaChallenge, undefined);

  return (
    <form action={action} className="mt-8 flex flex-col gap-4">
      <input type="hidden" name="factor_id" value={factorId} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="code" className="text-sm font-medium text-zinc-700">
          Código do autenticador
        </label>
        <input
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          required
          className="rounded-lg border border-zinc-300 px-3 py-2 text-center text-lg tracking-[0.3em] outline-none focus:border-zinc-900"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Verificando…" : "Confirmar"}
      </button>
    </form>
  );
}
