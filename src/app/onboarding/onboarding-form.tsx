"use client";

import { useActionState } from "react";
import { completeOnboarding } from "@/lib/actions/onboarding";
import { LIFE_PHASES, INITIAL_GOALS } from "@/lib/onboarding-options";

export function OnboardingForm() {
  const [state, action, pending] = useActionState(completeOnboarding, undefined);

  return (
    <form action={action} className="mx-auto flex max-w-xl flex-col gap-10 px-4 py-12">
      <div>
        <p className="text-sm font-medium tracking-wide text-zinc-500 uppercase">
          Bem-vinda
        </p>
        <h1 className="mt-2 text-2xl font-semibold text-zinc-900">
          Me conta um pouco sobre você
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Isso ajuda a Stella a personalizar seus insights e sugestões.
        </p>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-zinc-700">
          Qual dessas frases mais combina com sua fase de vida?
        </legend>
        {LIFE_PHASES.map((phase) => (
          <label
            key={phase.value}
            className="flex cursor-pointer flex-col gap-0.5 rounded-lg border border-zinc-200 px-4 py-3 text-sm has-checked:border-zinc-900 has-checked:bg-zinc-50"
          >
            <span className="flex items-center gap-2 font-medium text-zinc-900">
              <input
                type="radio"
                name="life_phase"
                value={phase.value}
                required
                className="accent-zinc-900"
              />
              {phase.label}
            </span>
            {phase.hint && (
              <span className="pl-6 text-xs text-zinc-500">{phase.hint}</span>
            )}
          </label>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-sm font-medium text-zinc-700">
          O que você quer alcançar agora? (escolha quantas fizer sentido)
        </legend>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {INITIAL_GOALS.map((goal) => (
            <label
              key={goal.value}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm has-checked:border-zinc-900 has-checked:bg-zinc-50"
            >
              <input
                type="checkbox"
                name="initial_goals"
                value={goal.value}
                className="accent-zinc-900"
              />
              {goal.label}
            </label>
          ))}
        </div>
      </fieldset>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
      >
        {pending ? "Salvando…" : "Continuar"}
      </button>
    </form>
  );
}
