"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { signup } from "@/lib/actions/auth";
import { GoogleButton } from "@/app/login/google-button";
import { StellaMark } from "@/components/stella-logo";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <StellaMark />
        <h1 className="mt-3.5 font-heading text-[32px] font-semibold leading-tight tracking-tight text-wine">
          Criar conta
        </h1>
        <p className="mt-1.5 text-[15.5px] font-light leading-relaxed text-wine/65">
          Comece a organizar o presente e construir o futuro.
        </p>

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
              minLength={8}
              placeholder="mínimo de 8 caracteres"
              className="w-full rounded-2xl border-[1.5px] border-rose bg-white px-4 py-[15px] text-base text-wine outline-none focus:border-berry"
            />
          </div>

          <label className="flex items-start gap-2 text-xs text-wine/60">
            <input
              type="checkbox"
              name="privacy_accepted"
              required
              checked={privacyAccepted}
              onChange={(e) => setPrivacyAccepted(e.target.checked)}
              className="mt-0.5 accent-berry"
            />
            <span>
              Li e concordo com os{" "}
              <Link href="/termos" target="_blank" className="underline">
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link href="/privacidade" target="_blank" className="underline">
                Política de Privacidade
              </Link>
              .
            </span>
          </label>

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
            {pending ? "Criando conta…" : "Criar conta"}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-3 text-xs text-wine/40">
          <div className="h-px flex-1 bg-rose/50" />
          ou
          <div className="h-px flex-1 bg-rose/50" />
        </div>

        <div className="mt-4">
          <GoogleButton disabled={!privacyAccepted} />
          {!privacyAccepted && (
            <p className="mt-1.5 text-xs text-wine/40">
              Aceite os termos acima para continuar com o Google.
            </p>
          )}
        </div>

        <p className="mt-6 text-center text-[14.5px] text-wine/70">
          Já tem conta?{" "}
          <Link href="/login" className="font-semibold text-berry">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
