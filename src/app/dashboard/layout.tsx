import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_completed_at) {
    redirect("/onboarding");
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-zinc-200">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <nav className="flex gap-6 text-sm font-medium text-zinc-600">
            <Link href="/dashboard" className="hover:text-zinc-900">
              Resumo
            </Link>
            <Link href="/dashboard/transactions" className="hover:text-zinc-900">
              Transações
            </Link>
            <Link href="/dashboard/accounts" className="hover:text-zinc-900">
              Contas
            </Link>
            <Link href="/dashboard/goals" className="hover:text-zinc-900">
              Metas
            </Link>
          </nav>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm font-medium text-zinc-500 underline hover:text-zinc-900"
            >
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-8">
        {children}
      </main>
    </div>
  );
}
