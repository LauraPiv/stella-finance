import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { computeStreak, levelFromXp } from "@/lib/learning";

export const ACHIEVEMENTS = [
  {
    code: "first_transaction",
    title: "Primeiro passo",
    description: "Registrou a primeira transação.",
  },
  {
    code: "five_transactions",
    title: "Constância",
    description: "Registrou 5 transações.",
  },
  {
    code: "first_goal",
    title: "Rumo a algo",
    description: "Criou a primeira meta financeira.",
  },
  {
    code: "goal_completed",
    title: "Meta batida",
    description: "Concluiu uma meta financeira.",
  },
  {
    code: "positive_month",
    title: "No azul",
    description: "Fechou um mês com mais receitas do que despesas.",
  },
  {
    code: "first_lesson",
    title: "Primeira aula",
    description: "Concluiu a primeira lição de uma trilha.",
  },
  {
    code: "streak_3",
    title: "Pegando o ritmo",
    description: "3 dias seguidos aprendendo.",
  },
  {
    code: "streak_7",
    title: "Uma semana inteira",
    description: "7 dias seguidos aprendendo.",
  },
  {
    code: "level_3",
    title: "Subindo de nível",
    description: "Alcançou o nível 3 na trilha de aprendizado.",
  },
] as const;

export type AchievementCode = (typeof ACHIEVEMENTS)[number]["code"];

export async function unlockAchievements(
  supabase: SupabaseClient<Database>,
  userId: string,
) {
  const [
    { data: existing },
    { count: txCount },
    { data: goals },
    { data: transactions },
    { data: lessonCompletions },
  ] = await Promise.all([
    supabase.from("achievements").select("code").eq("user_id", userId),
    supabase
      .from("transactions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
    supabase.from("goals").select("current_amount, target_amount").eq("user_id", userId),
    supabase.from("transactions").select("kind, amount, occurred_on").eq("user_id", userId),
    supabase
      .from("lesson_completions")
      .select("xp_earned, completed_at")
      .eq("user_id", userId),
  ]);

  const unlocked = new Set(existing?.map((a) => a.code) ?? []);
  const toUnlock: AchievementCode[] = [];

  if (!unlocked.has("first_transaction") && (txCount ?? 0) >= 1) {
    toUnlock.push("first_transaction");
  }
  if (!unlocked.has("five_transactions") && (txCount ?? 0) >= 5) {
    toUnlock.push("five_transactions");
  }
  if (!unlocked.has("first_goal") && (goals?.length ?? 0) >= 1) {
    toUnlock.push("first_goal");
  }
  if (
    !unlocked.has("goal_completed") &&
    goals?.some((g) => g.current_amount >= g.target_amount)
  ) {
    toUnlock.push("goal_completed");
  }

  if (!unlocked.has("positive_month") && transactions?.length) {
    const byMonth = new Map<string, { income: number; expense: number }>();
    for (const t of transactions) {
      const key = t.occurred_on.slice(0, 7);
      const entry = byMonth.get(key) ?? { income: 0, expense: 0 };
      if (t.kind === "income") entry.income += t.amount;
      else entry.expense += t.amount;
      byMonth.set(key, entry);
    }
    const hasPositiveMonth = [...byMonth.values()].some(
      (m) => m.income > 0 && m.income > m.expense,
    );
    if (hasPositiveMonth) toUnlock.push("positive_month");
  }

  if (!unlocked.has("first_lesson") && (lessonCompletions?.length ?? 0) >= 1) {
    toUnlock.push("first_lesson");
  }

  if (lessonCompletions?.length) {
    const streak = computeStreak(lessonCompletions.map((c) => c.completed_at));
    if (!unlocked.has("streak_3") && streak >= 3) toUnlock.push("streak_3");
    if (!unlocked.has("streak_7") && streak >= 7) toUnlock.push("streak_7");

    const totalXp = lessonCompletions.reduce((sum, c) => sum + c.xp_earned, 0);
    if (!unlocked.has("level_3") && levelFromXp(totalXp) >= 3) toUnlock.push("level_3");
  }

  if (toUnlock.length) {
    await supabase
      .from("achievements")
      .insert(toUnlock.map((code) => ({ user_id: userId, code })));
  }
}
