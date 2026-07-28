import Link from "next/link";

export const metadata = { title: "Termos de Uso — Stella Finance" };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 text-sm text-wine/75">
      <Link href="/" className="text-xs font-medium text-wine/50 underline">
        ← Voltar
      </Link>
      <h1 className="mt-4 font-heading text-2xl font-semibold text-wine">Termos de Uso</h1>
      <p className="mt-1 text-xs text-wine/40">Última atualização: julho de 2026</p>

      <div className="mt-8 flex flex-col gap-6">
        <section>
          <h2 className="font-heading font-semibold text-wine">1. O que é a Stella</h2>
          <p className="mt-1">
            A Stella é uma plataforma de organização financeira pessoal e educação
            financeira. As informações e sugestões apresentadas têm caráter
            educativo e não substituem aconselhamento financeiro, contábil ou de
            investimentos certificado.
          </p>
        </section>

        <section>
          <h2 className="font-heading font-semibold text-wine">2. Sua conta</h2>
          <p className="mt-1">
            Você é responsável por manter a confidencialidade da sua senha e por
            todas as informações financeiras que registrar na plataforma. Os
            valores e transações são inseridos manualmente por você e a Stella não
            tem qualquer acesso às suas contas bancárias reais.
          </p>
        </section>

        <section>
          <h2 className="font-heading font-semibold text-wine">3. Uso permitido</h2>
          <p className="mt-1">
            A plataforma deve ser usada apenas para fins pessoais e lícitos. Não é
            permitido usar a Stella para armazenar dados de terceiros sem
            consentimento, nem tentar acessar dados de outras usuárias.
          </p>
        </section>

        <section>
          <h2 className="font-heading font-semibold text-wine">4. Cancelamento</h2>
          <p className="mt-1">
            Você pode encerrar sua conta a qualquer momento nas configurações da
            plataforma. O encerramento apaga permanentemente seus dados
            financeiros, conforme detalhado na nossa{" "}
            <Link href="/privacidade" className="underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
