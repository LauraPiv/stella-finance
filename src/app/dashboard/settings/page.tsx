import { createClient } from "@/lib/supabase/server";
import { DeleteAccount } from "./delete-account";
import { MfaSettings } from "./mfa-settings";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: factorsData } = await supabase.auth.mfa.listFactors();
  const verifiedFactors = factorsData?.totp.filter((f) => f.status === "verified") ?? [];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Configurações</h1>
        <p className="mt-1 text-sm text-zinc-500">{user?.email}</p>
      </div>

      <div className="rounded-lg border border-zinc-200 p-4">
        <p className="text-sm font-medium text-zinc-900">
          Autenticação de dois fatores
        </p>
        <div className="mt-3">
          <MfaSettings factors={verifiedFactors} />
        </div>
      </div>

      <div className="rounded-lg border border-red-200 bg-red-50/40 p-4">
        <p className="text-sm font-medium text-zinc-900">Zona de risco</p>
        <p className="mt-1 text-xs text-zinc-500">
          A exclusão da conta é definitiva e apaga todos os seus dados
          financeiros, conforme nossa{" "}
          <a href="/privacidade" className="underline">
            Política de Privacidade
          </a>
          .
        </p>
        <div className="mt-3">
          <DeleteAccount />
        </div>
      </div>
    </div>
  );
}
