"use client";

import { useActionState, useState } from "react";
import { completeOnboarding } from "@/lib/actions/onboarding";
import { LIFE_PHASES, INITIAL_GOALS } from "@/lib/onboarding-options";

const STEPS = [
  {
    title: "Onde você está agora?",
    why: "Isso muda o que a Stella te mostra primeiro — e o que deixa de fora. Nenhuma resposta te tranca em nada.",
  },
  {
    title: "O que mais importa nos próximos meses?",
    why: "Uso isso pra sugerir sua primeira meta com um valor que faça sentido pra você, não um número genérico.",
  },
] as const;

export function OnboardingForm() {
  const [state, action, pending] = useActionState(completeOnboarding, undefined);
  const [step, setStep] = useState(0);
  const [lifePhase, setLifePhase] = useState<string | null>(null);
  const [goals, setGoals] = useState<string[]>([]);

  const progress = ((step + 1) / STEPS.length) * 100;
  const current = STEPS[step];

  function toggleGoal(value: string) {
    setGoals((prev) =>
      prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value],
    );
  }

  return (
    <form action={action} className="mx-auto flex max-w-sm flex-col gap-6 px-5 py-10">
      <input type="hidden" name="life_phase" value={lifePhase ?? ""} />

      <div className="flex items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            aria-label="Voltar"
            className="p-1.5 text-xl leading-none text-wine"
          >
            ←
          </button>
        )}
        <div className="h-1 flex-1 overflow-hidden rounded-full bg-cream">
          <div
            className="h-full rounded-full bg-berry transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-heading text-xs font-semibold text-wine/50">
          {step + 1}/{STEPS.length}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-pretty font-heading text-[27px] font-semibold leading-tight tracking-tight text-wine">
          {current.title}
        </h1>
        <p className="text-pretty text-[14.5px] font-light leading-relaxed text-wine/65">
          {current.why}
        </p>
      </div>

      {step === 0 && (
        <div className="flex flex-col gap-2.5">
          {LIFE_PHASES.map((phase) => (
            <button
              key={phase.value}
              type="button"
              onClick={() => {
                setLifePhase(phase.value);
                setStep(1);
              }}
              className={`min-h-14 rounded-2xl border-[1.5px] px-[18px] py-4 text-left text-[15.5px] leading-tight text-wine transition-colors hover:border-berry ${
                lifePhase === phase.value
                  ? "border-berry bg-cream"
                  : "border-rose bg-white"
              }`}
            >
              {phase.label}
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <>
          <div className="flex flex-col gap-2.5">
            {INITIAL_GOALS.map((goal) => {
              const checked = goals.includes(goal.value);
              return (
                <label
                  key={goal.value}
                  className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] px-[18px] py-4 text-[15.5px] leading-tight text-wine transition-colors hover:border-berry ${
                    checked ? "border-berry bg-cream" : "border-rose bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="initial_goals"
                    value={goal.value}
                    checked={checked}
                    onChange={() => toggleGoal(goal.value)}
                    className="accent-berry"
                  />
                  {goal.label}
                </label>
              );
            })}
          </div>

          {state?.error && (
            <div className="rounded-2xl border border-berry bg-cream px-4 py-3.5">
              <p className="m-0 text-sm text-wine">{state.error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={pending}
            className="min-h-[52px] rounded-full bg-berry px-4 py-4 font-heading text-base font-semibold text-white transition-colors hover:bg-berry-dark disabled:opacity-50"
          >
            {pending ? "Salvando…" : "Continuar"}
          </button>
        </>
      )}
    </form>
  );
}
