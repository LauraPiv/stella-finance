import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
        Stella
      </p>
      <h1 className="mt-3 max-w-xl text-3xl font-semibold text-zinc-900 sm:text-4xl">
        Organize o presente, entenda o dinheiro, construa o futuro.
      </h1>
      <p className="mt-4 max-w-md text-base text-zinc-600">
        Um copiloto financeiro para mulheres, com controle financeiro,
        educação contextual e uma mentora de IA.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/signup"
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          Criar conta
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
        >
          Entrar
        </Link>
      </div>
    </div>
  );
}
