import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ACHIEVEMENTS } from "@/lib/achievements";
import { levelFromXp, xpProgressInLevel, xpForNextLevel, computeStreak } from "@/lib/learning";
import { StellaSparkle } from "@/components/stella-logo";
import { ProgressRing } from "@/components/progress-ring";

export default async function LearnPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? "";

  const [{ data: tracks }, { data: lessons }, { data: completions }, { data: unlockedRows }] =
    await Promise.all([
      supabase.from("lesson_tracks").select("*").order("sort_order"),
      supabase.from("lessons").select("id, track_id").order("sort_order"),
      supabase
        .from("lesson_completions")
        .select("lesson_id, xp_earned, completed_at")
        .eq("user_id", userId),
      supabase.from("achievements").select("code").eq("user_id", userId),
    ]);

  const unlocked = new Set(unlockedRows?.map((a) => a.code));
  const totalXp = completions?.reduce((sum, c) => sum + c.xp_earned, 0) ?? 0;
  const level = levelFromXp(totalXp);
  const progressInLevel = xpProgressInLevel(totalXp);
  const streak = computeStreak(completions?.map((c) => c.completed_at) ?? []);
  const completedLessonIds = new Set(completions?.map((c) => c.lesson_id));

  return (
    <div className="flex flex-col gap-8 px-[22px] pt-3.5 pb-8">
      <h1 className="font-heading text-2xl font-semibold text-wine">Aprender</h1>

      <div className="flex flex-col gap-4 rounded-3xl border border-rose bg-cream p-5">
        <div className="flex items-center gap-3.5">
          <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-berry">
            <StellaSparkle size={26} color="white" />
          </span>
          <div className="flex flex-col gap-0.5">
            <span className="font-heading text-[19px] font-semibold text-wine">
              Nível {level}
            </span>
            <span className="text-[13px] text-wine/60">{totalXp} XP no total</span>
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="h-2.5 overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-berry transition-all"
              style={{ width: `${(progressInLevel / xpForNextLevel()) * 100}%` }}
            />
          </div>
          <p className="m-0 text-[13px] text-wine/60">
            {xpForNextLevel() - progressInLevel} XP para o próximo nível
          </p>
        </div>
        <div className="flex items-center gap-2.5 rounded-2xl bg-white p-3.5">
          <span className="font-heading text-xl font-semibold text-berry">{streak}</span>
          <span className="text-pretty text-[13.5px] leading-relaxed text-wine/70">
            {streak === 1 ? "dia seguido aprendendo" : "dias seguidos aprendendo"}. A
            constância vale mais que o ritmo.
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="m-0 font-heading text-[12.5px] font-semibold tracking-[0.1em] text-wine/50 uppercase">
          Trilhas
        </p>
        {tracks?.map((track) => {
          const lessonsInTrack = lessons?.filter((l) => l.track_id === track.id) ?? [];
          const completedInTrack = lessonsInTrack.filter((l) =>
            completedLessonIds.has(l.id),
          ).length;
          const pct = lessonsInTrack.length
            ? (completedInTrack / lessonsInTrack.length) * 100
            : 0;

          return (
            <Link
              key={track.id}
              href={`/dashboard/aprender/${track.id}`}
              className="flex items-center gap-3.5 rounded-[22px] border border-rose bg-white p-4 transition-colors hover:border-berry"
            >
              <ProgressRing
                percent={pct}
                size={52}
                trackColor="var(--color-cream)"
                fillColor="var(--color-berry)"
              >
                <span className="font-heading text-[13px] font-semibold text-wine">
                  {Math.round(pct)}%
                </span>
              </ProgressRing>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-[11px] font-semibold tracking-wide text-berry uppercase">
                  {track.tema}
                </span>
                <span className="font-heading text-[15.5px] font-semibold leading-tight text-wine">
                  {track.name}
                </span>
                <span className="text-[12.5px] text-wine/55">
                  {completedInTrack}/{lessonsInTrack.length} lições
                </span>
              </div>
              <span className="text-[15px] text-wine/40">›</span>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        <p className="m-0 font-heading text-[12.5px] font-semibold tracking-[0.1em] text-wine/50 uppercase">
          Conquistas
        </p>
        <div className="grid grid-cols-2 gap-2.5">
          {ACHIEVEMENTS.map((achievement) => {
            const isUnlocked = unlocked.has(achievement.code);
            return (
              <div
                key={achievement.code}
                className={`flex min-h-[120px] flex-col items-start gap-2 rounded-[20px] p-3.5 ${
                  isUnlocked
                    ? "border-[1.5px] border-berry bg-cream"
                    : "border border-rose bg-white opacity-60"
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
      </div>
    </div>
  );
}
