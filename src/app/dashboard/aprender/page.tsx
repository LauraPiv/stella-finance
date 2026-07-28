import { BEGINNER_TRACK } from "@/lib/learning-content";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { createClient } from "@/lib/supabase/server";
import { StellaSparkle } from "@/components/stella-logo";

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
    <div className="flex flex-col gap-8 px-[22px] pt-3.5 pb-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-wine">Conquistas</h1>
        <p className="mt-1 text-[13.5px] text-wine/55">
          Marcos que você já alcançou na sua jornada financeira.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {ACHIEVEMENTS.map((achievement) => {
          const isUnlocked = unlocked.has(achievement.code);
          return (
            <div
              key={achievement.code}
              className={`flex min-h-[120px] flex-col items-start gap-2 rounded-[20px] p-3.5 ${
                isUnlocked ? "border-[1.5px] border-berry bg-cream" : "border border-rose bg-white opacity-60"
              }`}
            >
              <span
                className="flex h-[34px] w-[34px] items-center justify-center rounded-full"
                style={{ background: isUnlocked ? "var(--color-berry)" : "var(--color-cream)" }}
              >
                <StellaSparkle size={17} color={isUnlocked ? "white" : "var(--color-rose)"} />
              </span>
              <span className="font-heading text-sm font-semibold leading-tight text-wine">
                {achievement.title}
              </span>
              <span className="text-[11.5px] leading-relaxed text-wine/55">
                {achievement.description}
              </span>
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="font-heading text-2xl font-semibold text-wine">
          Trilha para iniciantes
        </h2>
        <p className="mt-1 text-[13.5px] text-wine/55">
          Conceitos financeiros explicados de forma simples, no seu tempo.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {BEGINNER_TRACK.map((lesson, i) => (
          <div key={lesson.title} className="rounded-[20px] border border-rose bg-white p-4">
            <p className="m-0 text-xs font-medium text-wine/40">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h3 className="m-0 mt-1 font-heading text-[15.5px] font-semibold text-wine">
              {lesson.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-wine/65">{lesson.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
