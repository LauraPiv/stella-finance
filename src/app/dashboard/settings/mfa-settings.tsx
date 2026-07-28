"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Factor = { id: string; friendly_name?: string };

export function MfaSettings({ factors }: { factors: Factor[] }) {
  const router = useRouter();
  const [enrollment, setEnrollment] = useState<{
    factorId: string;
    qrCode: string;
    secret: string;
  } | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function startEnrollment() {
    setError(null);
    setBusy(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp" });
    setBusy(false);

    if (error || !data) {
      setError("Não foi possível iniciar a ativação. Tente novamente.");
      return;
    }

    setEnrollment({
      factorId: data.id,
      qrCode: data.totp.qr_code,
      secret: data.totp.secret,
    });
  }

  async function confirmEnrollment() {
    if (!enrollment) return;
    setError(null);
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: enrollment.factorId,
      code,
    });
    setBusy(false);

    if (error) {
      setError("Código inválido. Confira o app autenticador e tente de novo.");
      return;
    }

    setEnrollment(null);
    setCode("");
    router.refresh();
  }

  async function removeFactor(factorId: string) {
    setBusy(true);
    const supabase = createClient();
    await supabase.auth.mfa.unenroll({ factorId });
    setBusy(false);
    router.refresh();
  }

  if (factors.length > 0) {
    return (
      <div className="flex flex-col gap-3">
        <p className="m-0 text-sm text-wine/70">Autenticação de dois fatores ativada.</p>
        {factors.map((factor) => (
          <div key={factor.id} className="flex items-center justify-between">
            <span className="text-sm text-wine">
              {factor.friendly_name || "Aplicativo autenticador"}
            </span>
            <button
              type="button"
              disabled={busy}
              onClick={() => removeFactor(factor.id)}
              className="text-xs font-medium text-berry underline disabled:opacity-50"
            >
              Desativar
            </button>
          </div>
        ))}
      </div>
    );
  }

  if (enrollment) {
    return (
      <div className="flex flex-col gap-3">
        <p className="m-0 text-sm text-wine/70">
          Escaneie o QR code com seu app autenticador (Google Authenticator, Authy,
          etc.) e digite o código gerado.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={enrollment.qrCode}
          alt="QR code para ativar autenticação de dois fatores"
          className="h-40 w-40 rounded-2xl border border-rose"
        />
        <p className="m-0 text-xs text-wine/45">
          Não consegue escanear? Use o código:{" "}
          <code className="font-mono">{enrollment.secret}</code>
        </p>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          className="w-32 rounded-2xl border-[1.5px] border-rose bg-white px-3 py-2.5 text-center text-lg tracking-[0.3em] text-wine outline-none focus:border-berry"
        />
        {error && <p className="m-0 text-sm text-berry">{error}</p>}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={confirmEnrollment}
            disabled={busy || code.length !== 6}
            className="rounded-full bg-berry px-4 py-2.5 font-heading text-sm font-semibold text-white transition-colors hover:bg-berry-dark disabled:opacity-50"
          >
            {busy ? "Confirmando…" : "Confirmar"}
          </button>
          <button
            type="button"
            onClick={() => setEnrollment(null)}
            className="font-heading text-sm font-semibold text-wine/60"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2.5">
      <p className="m-0 text-sm text-wine/70">
        Adicione uma camada extra de segurança pedindo um código do seu celular
        toda vez que você entrar.
      </p>
      {error && <p className="m-0 text-sm text-berry">{error}</p>}
      <button
        type="button"
        onClick={startEnrollment}
        disabled={busy}
        className="min-h-11 self-start rounded-full border-[1.5px] border-berry px-4 font-heading text-[13.5px] font-semibold text-berry transition-colors hover:bg-cream disabled:opacity-50"
      >
        Ativar autenticação de dois fatores
      </button>
    </div>
  );
}
