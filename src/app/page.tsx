import Link from "next/link";
import { StellaWordmark } from "@/components/stella-logo";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <StellaWordmark />
      <h1 className="mt-6 max-w-xl font-heading text-3xl font-semibold leading-tight tracking-tight text-wine sm:text-4xl">
        Organize o presente, entenda o dinheiro, construa o futuro.
      </h1>
      <p className="mt-4 max-w-md text-base font-light text-wine/65">
        Um copiloto financeiro para mulheres, com controle financeiro,
        educação contextual e uma mentora de IA.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/signup"
          className="rounded-full bg-berry px-6 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-berry-dark"
        >
          Criar conta
        </Link>
        <Link
          href="/login"
          className="rounded-full border-[1.5px] border-wine/20 bg-white px-6 py-3 font-heading text-sm font-semibold text-wine transition-colors hover:bg-cream"
        >
          Entrar
        </Link>
      </div>
    </div>
  );
}
