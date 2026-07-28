"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/lib/actions/auth";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">Criar conta</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Comece a organizar o presente e construir o futuro.
        </p>

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
              minLength={8}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            />
            <span className="text-xs text-zinc-400">Mínimo de 8 caracteres.</span>
          </div>

          {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
          >
            {pending ? "Criando conta…" : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-sm text-zinc-500">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-zinc-900 underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
