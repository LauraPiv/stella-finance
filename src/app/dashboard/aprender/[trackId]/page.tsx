import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function TrackPage({
  params,
}: {
  params: Promise<{ trackId: string }>;
}) {
  const { trackId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: track }, { data: lessons }, { data: completions }] = await Promise.all([
    supabase.from("lesson_tracks").select("*").eq("id", trackId).single(),
    supabase
      .from("lessons")
      .select("id, title, xp_reward")
      .eq("track_id", trackId)
      .order("sort_order"),
    supabase
      .from("lesson_completions")
      .select("lesson_id")
      .eq("user_id", user?.id ?? ""),
  ]);

  if (!track) notFound();

  const completedIds = new Set(completions?.map((c) => c.lesson_id));

  return (
    <div className="flex flex-col gap-6 px-[22px] pt-3.5 pb-8">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/aprender" aria-label="Voltar" className="p-1 text-xl text-wine">
          ←
        </Link>
        <div>
          <p className="m-0 text-[11px] font-semibold tracking-wide text-berry uppercase">
            {track.tema}
          </p>
          <h1 className="m-0 font-heading text-xl font-semibold text-wine">{track.name}</h1>
        </div>
      </div>

      <p className="text-pretty text-[14.5px] leading-relaxed text-wine/65">
        {track.description}
      </p>

      <div className="flex flex-col gap-2.5">
        {lessons?.map((lesson, i) => {
          const isDone = completedIds.has(lesson.id);
          const isUnlocked = i === 0 || completedIds.has(lessons[i - 1].id);

          const content = (
            <>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-heading text-[13px] font-semibold ${
                  isDone
                    ? "bg-berry text-white"
                    : isUnlocked
                      ? "bg-cream text-berry"
                      : "bg-cream text-wine/30"
                }`}
              >
                {isDone ? "✓" : i + 1}
              </span>
              <span className="flex flex-1 flex-col gap-0.5">
                <span
                  className={`text-[15px] leading-snug ${isUnlocked ? "text-wine" : "text-wine/40"}`}
                >
                  {lesson.title}
                </span>
                <span className="text-xs text-wine/45">
                  {isDone ? "Concluída" : `+${lesson.xp_reward} XP`}
                </span>
              </span>
              {!isUnlocked && <span className="text-wine/30">🔒</span>}
            </>
          );

          return isUnlocked ? (
            <Link
              key={lesson.id}
              href={`/dashboard/aprender/${trackId}/${lesson.id}`}
              className="flex items-center gap-3.5 rounded-[20px] border border-rose bg-white p-4 transition-colors hover:border-berry"
            >
              {content}
            </Link>
          ) : (
            <div
              key={lesson.id}
              className="flex items-center gap-3.5 rounded-[20px] border border-rose bg-white p-4 opacity-60"
            >
              {content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
