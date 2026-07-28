import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { VerifyForm } from "./verify-form";

export default async function VerifyMfaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: factors } = await supabase.auth.mfa.listFactors();
  const factor = factors?.totp.find((f) => f.status === "verified");

  if (!factor) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Confirme sua identidade
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Digite o código de 6 dígitos do seu aplicativo autenticador.
        </p>

        <VerifyForm factorId={factor.id} />
      </div>
    </div>
  );
}
