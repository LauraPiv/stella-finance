import Link from "next/link";

export const metadata = { title: "Política de Privacidade — Stella Finance" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 text-sm text-wine/75">
      <Link href="/" className="text-xs font-medium text-wine/50 underline">
        ← Voltar
      </Link>
      <h1 className="mt-4 font-heading text-2xl font-semibold text-wine">
        Política de Privacidade
      </h1>
      <p className="mt-1 text-xs text-wine/40">Última atualização: julho de 2026</p>

      <div className="mt-8 flex flex-col gap-6">
        <section>
          <h2 className="font-heading font-semibold text-wine">1. Quais dados coletamos</h2>
          <p className="mt-1">
            Coletamos seu e-mail e senha (para autenticação), as respostas do
            onboarding (fase de vida e objetivos) e os dados financeiros que você
            mesma cadastra: contas, cartões, categorias, transações e metas.
          </p>
        </section>

        <section>
          <h2 className="font-heading font-semibold text-wine">2. Como usamos seus dados</h2>
          <p className="mt-1">
            Usamos esses dados exclusivamente para operar a plataforma: exibir seu
            dashboard, calcular insights e progresso de metas, e personalizar sua
            experiência. Não vendemos nem compartilhamos seus dados financeiros
            com terceiros para fins de marketing.
          </p>
        </section>

        <section>
          <h2 className="font-heading font-semibold text-wine">
            3. Onde seus dados ficam armazenados
          </h2>
          <p className="mt-1">
            Seus dados são armazenados de forma criptografada, em trânsito (HTTPS)
            e em repouso, em infraestrutura fornecida pela Supabase. Cada usuária
            só tem acesso aos seus próprios dados — isso é garantido no nível do
            banco de dados (Row Level Security), não apenas na interface.
          </p>
        </section>

        <section>
          <h2 className="font-heading font-semibold text-wine">4. Seus direitos (LGPD)</h2>
          <p className="mt-1">
            Você pode, a qualquer momento: acessar todos os seus dados dentro da
            própria plataforma, corrigir informações incorretas, e excluir
            permanentemente sua conta e todos os dados associados nas
            configurações da sua conta. A exclusão é imediata e definitiva.
          </p>
        </section>

        <section>
          <h2 className="font-heading font-semibold text-wine">5. Contato</h2>
          <p className="mt-1">
            Dúvidas sobre privacidade ou tratamento de dados podem ser enviadas
            para{" "}
            <a href="mailto:privacidade@stellafinance.app" className="underline">
              privacidade@stellafinance.app
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
