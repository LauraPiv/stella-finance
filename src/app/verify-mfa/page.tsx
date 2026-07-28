import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { StellaMark } from "@/components/stella-logo";
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
        <StellaMark />
        <h1 className="mt-3.5 font-heading text-[28px] font-semibold leading-tight tracking-tight text-wine">
          Confirme sua identidade
        </h1>
        <p className="mt-1.5 text-[15px] font-light leading-relaxed text-wine/65">
          Digite o código de 6 dígitos do seu aplicativo autenticador.
        </p>

        <VerifyForm factorId={factor.id} />
      </div>
    </div>
  );
}
