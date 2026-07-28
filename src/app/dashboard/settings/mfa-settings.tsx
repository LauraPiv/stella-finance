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
        <p className="text-sm text-zinc-600">
          Autenticação de dois fatores ativada.
        </p>
        {factors.map((factor) => (
          <div key={factor.id} className="flex items-center justify-between">
            <span className="text-sm text-zinc-700">
              {factor.friendly_name || "Aplicativo autenticador"}
            </span>
            <button
              type="button"
              disabled={busy}
              onClick={() => removeFactor(factor.id)}
              className="text-xs font-medium text-red-600 underline disabled:opacity-50"
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
        <p className="text-sm text-zinc-600">
          Escaneie o QR code com seu app autenticador (Google Authenticator, Authy,
          etc.) e digite o código gerado.
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={enrollment.qrCode}
          alt="QR code para ativar autenticação de dois fatores"
          className="h-40 w-40"
        />
        <p className="text-xs text-zinc-400">
          Não consegue escanear? Use o código:{" "}
          <code className="font-mono">{enrollment.secret}</code>
        </p>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          className="w-32 rounded-lg border border-zinc-300 px-3 py-2 text-center text-lg tracking-[0.3em] outline-none focus:border-zinc-900"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={confirmEnrollment}
            disabled={busy || code.length !== 6}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
          >
            {busy ? "Confirmando…" : "Confirmar"}
          </button>
          <button
            type="button"
            onClick={() => setEnrollment(null)}
            className="text-sm font-medium text-zinc-500 underline"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-zinc-600">
        Adicione uma camada extra de segurança pedindo um código do seu celular
        toda vez que você entrar.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={startEnrollment}
        disabled={busy}
        className="self-start rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 disabled:opacity-50"
      >
        Ativar autenticação de dois fatores
      </button>
    </div>
  );
}
