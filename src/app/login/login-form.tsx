"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "@/lib/actions/auth";
import { StellaMark } from "@/components/stella-logo";
import { GoogleButton } from "./google-button";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  const searchParams = useSearchParams();
  const checkEmail = searchParams.get("checkEmail");

  return (
    <div className="w-full max-w-sm">
      <StellaMark />
      <h1 className="mt-3.5 font-heading text-[32px] font-semibold leading-tight tracking-tight text-wine">
        Bem-vinda de volta
      </h1>
      <p className="mt-1.5 text-[15.5px] font-light leading-relaxed text-wine/65">
        Continue organizando suas finanças com a Stella.
      </p>

      {checkEmail && (
        <p className="mt-4 rounded-2xl border border-rose bg-cream px-4 py-3 text-sm text-wine">
          Conta criada! Confirme seu e-mail para poder entrar.
        </p>
      )}

      <form action={action} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-[13px] text-wine/60">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="voce@email.com"
            required
            className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-4 py-[15px] text-base text-wine outline-none focus:border-berry"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-[13px] text-wine/60">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-4 py-[15px] text-base text-wine outline-none focus:border-berry"
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
          className="min-h-[52px] rounded-full bg-berry px-4 py-4 font-heading text-base font-semibold text-white transition-colors hover:bg-berry-dark disabled:opacity-50"
        >
          {pending ? "Entrando…" : "Entrar"}
        </button>
      </form>

      <div className="mt-4 flex items-center gap-3 text-xs text-wine/40">
        <div className="h-px flex-1 bg-rose/50" />
        ou
        <div className="h-px flex-1 bg-rose/50" />
      </div>

      <div className="mt-4">
        <GoogleButton />
        <p className="mt-2 text-xs leading-relaxed text-wine/45">
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

      <p className="mt-6 text-center text-[14.5px] text-wine/70">
        Ainda não tem conta?{" "}
        <Link href="/signup" className="font-semibold text-berry">
          Criar conta
        </Link>
      </p>
    </div>
  );
}
