"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { completeLesson } from "@/lib/actions/learning";

type Exercise = {
  id: string;
  prompt: string;
  options: string[];
  correct_index: number;
  explanation: string;
};

export function LessonPlayer({
  lessonId,
  trackId,
  lessonTitle,
  xpReward,
  exercises,
}: {
  lessonId: string;
  trackId: string;
  lessonTitle: string;
  xpReward: number;
  exercises: Exercise[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const exercise = exercises[index];
  const answered = selected !== null;
  const isCorrect = answered && selected === exercise.correct_index;

  function pick(optionIndex: number) {
    if (answered) return;
    setSelected(optionIndex);
    if (optionIndex === exercise.correct_index) {
      setCorrectCount((c) => c + 1);
    }
  }

  function next() {
    if (index + 1 < exercises.length) {
      setIndex(index + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  }

  function finish() {
    startTransition(async () => {
      await completeLesson(lessonId, correctCount, exercises.length);
      router.push(`/dashboard/aprender/${trackId}`);
    });
  }

  if (finished) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-[22px] py-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-berry font-heading text-2xl font-semibold text-white">
          +{xpReward}
        </span>
        <div className="flex flex-col gap-1.5">
          <p className="m-0 font-heading text-xl font-semibold text-wine">Lição concluída!</p>
          <p className="m-0 text-sm text-wine/60">
            Você acertou {correctCount} de {exercises.length} perguntas.
          </p>
        </div>
        <button
          type="button"
          onClick={finish}
          disabled={isPending}
          className="min-h-[52px] rounded-full bg-berry px-8 font-heading text-base font-semibold text-white transition-colors hover:bg-berry-dark disabled:opacity-50"
        >
          {isPending ? "Salvando…" : "Concluir"}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-[22px] pt-3.5 pb-8">
      <div className="flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream">
          <div
            className="h-full rounded-full bg-berry transition-all duration-200"
            style={{ width: `${((index + (answered ? 1 : 0)) / exercises.length) * 100}%` }}
          />
        </div>
        <span className="font-heading text-xs font-semibold text-wine/50">
          {index + 1}/{exercises.length}
        </span>
      </div>

      <p className="m-0 text-xs font-semibold tracking-wide text-berry uppercase">
        {lessonTitle}
      </p>

      <h2 className="text-pretty m-0 font-heading text-[21px] font-semibold leading-snug text-wine">
        {exercise.prompt}
      </h2>

      <div className="flex flex-col gap-2.5">
        {exercise.options.map((option, i) => {
          let stateClass = "border-rose bg-white text-wine";
          if (answered) {
            if (i === exercise.correct_index) {
              stateClass = "border-emerald-500 bg-emerald-50 text-wine";
            } else if (i === selected) {
              stateClass = "border-red-400 bg-red-50 text-wine";
            } else {
              stateClass = "border-rose bg-white text-wine/50";
            }
          }
          return (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              disabled={answered}
              className={`min-h-14 rounded-2xl border-[1.5px] px-[18px] py-4 text-left text-[15px] leading-snug transition-colors ${stateClass}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`rounded-2xl border p-4 ${
            isCorrect ? "border-emerald-500 bg-emerald-50" : "border-rose bg-cream"
          }`}
        >
          <p className="m-0 font-heading text-sm font-semibold text-wine">
            {isCorrect ? "Isso mesmo!" : "Quase — veja por quê"}
          </p>
          <p className="mt-1 text-[13.5px] leading-relaxed text-wine/70">
            {exercise.explanation}
          </p>
        </div>
      )}

      {answered && (
        <button
          type="button"
          onClick={next}
          className="mt-auto min-h-[52px] rounded-full bg-berry font-heading text-base font-semibold text-white transition-colors hover:bg-berry-dark"
        >
          {index + 1 < exercises.length ? "Continuar" : "Ver resultado"}
        </button>
      )}
    </div>
  );
}
