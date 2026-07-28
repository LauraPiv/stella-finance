import { createClient } from "@/lib/supabase/server";
import { deleteGoal, moveGoalPriority } from "@/lib/actions/finance";
import { monthlyAmountNeeded } from "@/lib/goal-math";
import { formatCurrency, formatDate } from "@/lib/format";
import { Tip } from "@/components/tip";
import { GoalForm } from "./goal-form";
import { ContributeForm } from "./contribute-form";

export default async function GoalsPage() {
  const supabase = await createClient();
  const { data: goals } = await supabase
    .from("goals")
    .select("*")
    .order("priority", { ascending: true });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Metas financeiras</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Defina onde quer chegar e a Stella calcula quanto guardar por mês.
        </p>
      </div>

      <GoalForm />

      {goals?.length === 1 && (
        <Tip>
          Você criou sua primeira meta! Acompanhe o progresso sempre que
          quiser por aqui — a Stella recalcula quanto guardar por mês
          automaticamente conforme você avança.
        </Tip>
      )}

      <ul className="flex flex-col gap-3">
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
              <li key={goal.id} className="rounded-lg border border-zinc-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <div className="flex flex-col pt-0.5">
                      <form action={moveGoalPriority.bind(null, goal.id, "up")}>
                        <button
                          type="submit"
                          disabled={i === 0}
                          aria-label="Priorizar mais"
                          className="block text-zinc-400 hover:text-zinc-900 disabled:opacity-20"
                        >
                          ▲
                        </button>
                      </form>
                      <form action={moveGoalPriority.bind(null, goal.id, "down")}>
                        <button
                          type="submit"
                          disabled={i === goals.length - 1}
                          aria-label="Priorizar menos"
                          className="block text-zinc-400 hover:text-zinc-900 disabled:opacity-20"
                        >
                          ▼
                        </button>
                      </form>
                    </div>
                    <div>
                      <p className="font-medium text-zinc-900">{goal.name}</p>
                      <p className="text-xs text-zinc-500">
                        {formatCurrency(goal.current_amount)} de{" "}
                        {formatCurrency(goal.target_amount)} · até{" "}
                        {formatDate(goal.target_date)}
                      </p>
                    </div>
                  </div>
                  <form action={deleteGoal.bind(null, goal.id)}>
                    <button
                      type="submit"
                      className="text-xs font-medium text-zinc-400 underline hover:text-red-600"
                    >
                      Remover
                    </button>
                  </form>
                </div>

                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-zinc-900"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-2 text-xs text-zinc-500">
                  Guarde {formatCurrency(monthly)}/mês para chegar lá a tempo.
                </p>

                <ContributeForm goalId={goal.id} />
              </li>
            );
          })
        ) : (
          <li className="rounded-lg border border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400">
            Nenhuma meta criada ainda.
          </li>
        )}
      </ul>
    </div>
  );
}
