import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";
import { DeleteAccount } from "./delete-account";
import { MfaSettings } from "./mfa-settings";
import { ProfileSettings } from "./profile-settings";

function Row({ href, label, sub }: { href: string; label: string; sub?: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-14 items-center gap-3 rounded-[18px] border border-rose bg-white px-4 py-4 transition-colors hover:border-berry"
    >
      <span className="flex flex-1 flex-col gap-0.5">
        <span className="text-[15px] text-wine">{label}</span>
        {sub && <span className="text-[12.5px] text-wine/55">{sub}</span>}
      </span>
      <span className="text-[15px] text-wine/40">›</span>
    </Link>
  );
}

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const [{ data: factorsData }, { data: profile }] = await Promise.all([
    supabase.auth.mfa.listFactors(),
    supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user?.id ?? "")
      .single(),
  ]);
  const verifiedFactors = factorsData?.totp.filter((f) => f.status === "verified") ?? [];

  return (
    <div className="flex flex-col gap-7 px-[22px] pt-3.5 pb-8">
      <h1 className="font-heading text-2xl font-semibold text-wine">Perfil</h1>

      <ProfileSettings
        userId={user?.id ?? ""}
        fullName={profile?.full_name ?? null}
        avatarUrl={profile?.avatar_url ?? null}
        email={user?.email ?? ""}
      />

      <div className="flex flex-col gap-2.5">
        <p className="m-0 font-heading text-[12.5px] font-semibold tracking-[0.1em] text-wine/50 uppercase">
          Navegar
        </p>
        <Row href="/dashboard/accounts" label="Contas e cartões" />
        <Row href="/dashboard/aprender" label="Aprender e conquistas" />
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="m-0 font-heading text-[12.5px] font-semibold tracking-[0.1em] text-wine/50 uppercase">
          Segurança
        </p>
        <div className="rounded-[18px] border border-rose bg-white p-4">
          <p className="m-0 mb-3 font-heading text-[15px] font-semibold text-wine">
            Autenticação de dois fatores
          </p>
          <MfaSettings factors={verifiedFactors} />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <p className="m-0 font-heading text-[12.5px] font-semibold tracking-[0.1em] text-wine/50 uppercase">
          Seus dados
        </p>
        <div className="rounded-[18px] border border-berry/40 bg-cream p-4">
          <p className="m-0 text-[13px] leading-relaxed text-wine/70">
            A exclusão da conta é definitiva e apaga todos os seus dados
            financeiros, conforme nossa{" "}
            <Link href="/privacidade" className="underline">
              Política de Privacidade
            </Link>
            .
          </p>
          <div className="mt-3">
            <DeleteAccount />
          </div>
        </div>
      </div>

      <form action={logout}>
        <button
          type="submit"
          className="min-h-11 px-3 font-heading text-[14.5px] font-semibold text-berry"
        >
          Sair da conta
        </button>
      </form>
    </div>
  );
}
