"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { unlockAchievements } from "@/lib/achievements";

export async function completeLesson(
  lessonId: string,
  correctCount: number,
  totalCount: number,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: lesson } = await supabase
    .from("lessons")
    .select("xp_reward, track_id")
    .eq("id", lessonId)
    .single();

  if (!lesson) return;

  await supabase.from("lesson_completions").upsert(
    {
      user_id: user.id,
      lesson_id: lessonId,
      correct_count: correctCount,
      total_count: totalCount,
      xp_earned: lesson.xp_reward,
    },
    { onConflict: "user_id,lesson_id", ignoreDuplicates: true },
  );

  await unlockAchievements(supabase, user.id);

  revalidatePath("/dashboard/aprender");
}
