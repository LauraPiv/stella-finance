"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "@/lib/actions/auth";
import { GoogleButton } from "./google-button";

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

      <div className="mt-4 flex items-center gap-3 text-xs text-zinc-400">
        <div className="h-px flex-1 bg-zinc-200" />
        ou
        <div className="h-px flex-1 bg-zinc-200" />
      </div>

      <div className="mt-4">
        <GoogleButton />
        <p className="mt-1.5 text-xs text-zinc-400">
          Ao continuar com o Google, você concorda com nossos{" "}
          <Link href="/termos" target="_blank" className="underline">
            Termos de Uso
          </Link>{" "}
          e{" "}
          <Link href="/privacidade" target="_blank" className="underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </div>

      <p className="mt-6 text-sm text-zinc-500">
        Ainda não tem conta?{" "}
        <Link href="/signup" className="font-medium text-zinc-900 underline">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
