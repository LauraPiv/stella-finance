import { createClient } from "@/lib/supabase/server";
import { deleteGoal, moveGoalPriority } from "@/lib/actions/finance";
import { monthlyAmountNeeded } from "@/lib/goal-math";
import { formatCurrency, formatDate } from "@/lib/format";
import { Tip } from "@/components/tip";
import { ProgressRing } from "@/components/progress-ring";
import { GoalForm } from "./goal-form";
import { ContributeForm } from "./contribute-form";

export default async function GoalsPage() {
  const supabase = await createClient();
  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .order("priority", { ascending: true });

  return (
    <div className="flex flex-col gap-5 px-[22px] pt-3.5 pb-8">
      <h1 className="font-heading text-2xl font-semibold text-wine">Metas</h1>

      {goals?.length === 1 && (
        <Tip>
          Você criou sua primeira meta! Acompanhe o progresso sempre que
          quiser por aqui — a Stella recalcula quanto guardar por mês
          automaticamente conforme você avança.
        </Tip>
      )}

      <div className="flex flex-col gap-3">
        {goals?.length ? (
          goals.map((goal, i) => {
            const progress = Math.min(
              (goal.current_amount / goal.target_amount) * 100,
              100,
            );
            const monthly = monthlyAmountNeeded(
              goal.target_amount,
              goal.current_amount,
              goal.target_date,
            );

            return (
              <div
                key={goal.id}
                className="flex flex-col gap-1 rounded-[22px] border border-rose bg-white p-4"
              >
                <div className="flex items-center gap-4">
                  <ProgressRing
                    percent={progress}
                    size={58}
                    trackColor="var(--color-cream)"
                    fillColor="var(--color-berry)"
                  >
                    <span className="font-heading text-[13.5px] font-semibold text-wine">
                      {Math.round(progress)}%
                    </span>
                  </ProgressRing>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span className="font-heading text-[16.5px] font-semibold text-wine">
                      {goal.name}
                    </span>
                    <span className="text-[13.5px] text-wine/60">
                      {formatCurrency(goal.current_amount)} de{" "}
                      {formatCurrency(goal.target_amount)}
                    </span>
                    <span className="text-[12.5px] text-wine/50">
                      até {formatDate(goal.target_date)} · guarde{" "}
                      {formatCurrency(monthly)}/mês
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <form action={moveGoalPriority.bind(null, goal.id, "up")}>
                      <button
                        type="submit"
                        disabled={i === 0}
                        aria-label="Priorizar mais"
                        className="block text-wine/35 hover:text-berry disabled:opacity-20"
                      >
                        ▲
                      </button>
                    </form>
                    <form action={moveGoalPriority.bind(null, goal.id, "down")}>
                      <button
                        type="submit"
                        disabled={i === goals.length - 1}
                        aria-label="Priorizar menos"
                        className="block text-wine/35 hover:text-berry disabled:opacity-20"
                      >
                        ▼
                      </button>
                    </form>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <ContributeForm goalId={goal.id} />
                  <form action={deleteGoal.bind(null, goal.id)}>
                    <button
                      type="submit"
                      className="text-xs font-medium text-wine/40 underline hover:text-berry"
                    >
                      Remover
                    </button>
                  </form>
                </div>
              </div>
            );
          })
        ) : (
          <p className="rounded-2xl bg-cream px-4 py-6 text-center text-sm text-wine/50">
            Nenhuma meta criada ainda.
          </p>
        )}
      </div>

      <GoalForm />
    </div>
  );
}
