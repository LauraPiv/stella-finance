import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-1 flex-col px-6 py-10 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900">
          Olá, {user?.email}
        </h1>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm font-medium text-zinc-500 underline hover:text-zinc-900"
          >
            Sair
          </button>
        </form>
      </div>
      <p className="mt-2 text-sm text-zinc-500">
        Seu dashboard financeiro vai aparecer aqui.
      </p>
    </div>
  );
}
