"use client";

import { useActionState } from "react";
import { verifyMfaChallenge } from "@/lib/actions/mfa";

export function VerifyForm({ factorId }: { factorId: string }) {
  const [state, action, pending] = useActionState(verifyMfaChallenge, undefined);

  return (
    <form action={action} className="mt-7 flex flex-col gap-4">
      <input type="hidden" name="factor_id" value={factorId} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="code" className="text-[13px] text-wine/60">
          Código do autenticador
        </label>
        <input
          id="code"
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          required
          className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-4 py-4 text-center text-lg tracking-[0.3em] text-wine outline-none focus:border-berry"
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
        className="min-h-[52px] rounded-full bg-berry font-heading text-base font-semibold text-white transition-colors hover:bg-berry-dark disabled:opacity-50"
      >
        {pending ? "Verificando…" : "Confirmar"}
      </button>
    </form>
  );
}
