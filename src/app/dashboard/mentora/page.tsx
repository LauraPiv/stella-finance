import { StellaSparkle } from "@/components/stella-logo";

export default function MentoraPage() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2.5 border-b border-cream px-5 py-3.5">
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-cream">
          <StellaSparkle size={18} />
        </div>
        <div>
          <p className="font-heading text-[16.5px] font-semibold text-wine">Stella</p>
          <p className="text-xs text-wine/55">sua mentora</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
        <StellaSparkle size={32} />
        <p className="text-pretty font-heading text-xl font-semibold leading-snug text-wine">
          A Stella ainda está aprendendo a conversar.
        </p>
        <p className="text-pretty text-sm font-light leading-relaxed text-wine/65">
          A mentora com IA está a caminho — em breve você vai poder perguntar
          sobre seus gastos e metas em linguagem natural, direto por aqui.
        </p>
      </div>
    </div>
  );
}
