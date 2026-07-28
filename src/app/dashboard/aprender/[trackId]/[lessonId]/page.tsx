import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LessonPlayer } from "./lesson-player";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ trackId: string; lessonId: string }>;
}) {
  const { trackId, lessonId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: lesson }, { data: allLessons }, { data: exercises }, { data: completions }] =
    await Promise.all([
      supabase.from("lessons").select("id, title, xp_reward, track_id").eq("id", lessonId).single(),
      supabase.from("lessons").select("id").eq("track_id", trackId).order("sort_order"),
      supabase
        .from("lesson_exercises")
        .select("id, prompt, options, correct_index, explanation")
        .eq("lesson_id", lessonId)
        .order("sort_order"),
      supabase.from("lesson_completions").select("lesson_id").eq("user_id", user?.id ?? ""),
    ]);

  if (!lesson || lesson.track_id !== trackId) notFound();

  const completedIds = new Set(completions?.map((c) => c.lesson_id));
  const lessonIndex = allLessons?.findIndex((l) => l.id === lessonId) ?? -1;
  const isUnlocked =
    lessonIndex === 0 || (lessonIndex > 0 && completedIds.has(allLessons![lessonIndex - 1].id));

  if (!isUnlocked) {
    redirect(`/dashboard/aprender/${trackId}`);
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center gap-3 px-[22px] pt-3.5">
        <Link
          href={`/dashboard/aprender/${trackId}`}
          aria-label="Sair da lição"
          className="p-1 text-xl text-wine"
        >
          ✕
        </Link>
      </div>
      <LessonPlayer
        lessonId={lesson.id}
        trackId={trackId}
        lessonTitle={lesson.title}
        xpReward={lesson.xp_reward}
        exercises={
          (exercises ?? []).map((e) => ({
            ...e,
            options: e.options as string[],
          }))
        }
      />
    </div>
  );
}
