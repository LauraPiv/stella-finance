"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const searchParams = useSearchParams();
  const checkEmail = searchParams.get("checkEmail");

  return (
    <div className="w-full max-w-sm">
      <h1 className="text-2xl font-semibold text-zinc-900">Entrar</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Continue organizando suas finanças com a Stella.
      </p>

      {checkEmail && (
        <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Conta criada! Confirme seu e-mail para poder entrar.
        </p>
      )}

      <form action={action} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-sm font-medium text-zinc-700">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-sm font-medium text-zinc-700">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          />
        </div>

        {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <p className="mt-6 text-sm text-zinc-500">
        Ainda não tem conta?{" "}
        <Link href="/signup" className="font-medium text-zinc-900 underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
