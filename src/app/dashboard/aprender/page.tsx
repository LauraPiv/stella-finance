import { BEGINNER_TRACK } from "@/lib/learning-content";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { createClient } from "@/lib/supabase/server";

export default async function LearnPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: unlockedRows } = await supabase
    .from("achievements")
    .select("code")
    .eq("user_id", user?.id ?? "");
  const unlocked = new Set(unlockedRows?.map((a) => a.code));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold text-zinc-900">Conquistas</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Marcos que você já alcançou na sua jornada financeira.
        </p>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlocked.has(achievement.code);
          return (
            <li
              key={achievement.code}
              className={
                isUnlocked
                  ? "rounded-lg border border-zinc-200 bg-amber-50 p-4"
                  : "rounded-lg border border-zinc-200 p-4 opacity-50"
              }
            >
              <p className="font-medium text-zinc-900">
                {isUnlocked ? "🏆" : "🔒"} {achievement.title}
              </p>
              <p className="mt-1 text-xs text-zinc-500">{achievement.description}</p>
            </li>
          );
        })}
      </ul>

      <div>
        <h2 className="text-xl font-semibold text-zinc-900">
          Trilha para iniciantes
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          Conceitos financeiros explicados de forma simples, no seu tempo.
        </p>
      </div>

      <ol className="flex flex-col gap-4">
        {BEGINNER_TRACK.map((lesson, i) => (
          <li key={lesson.title} className="rounded-lg border border-zinc-200 p-4">
            <p className="text-xs font-medium text-zinc-400">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-1 font-medium text-zinc-900">{lesson.title}</h2>
            <p className="mt-1.5 text-sm text-zinc-600">{lesson.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
