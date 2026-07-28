"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type OnboardingFormState = { error: string } | undefined;

export async function completeOnboarding(
  _prevState: OnboardingFormState,
  formData: FormData,
): Promise<OnboardingFormState> {
  const lifePhase = formData.get("life_phase") as string;
  const initialGoals = formData.getAll("initial_goals") as string[];

  if (!lifePhase) {
    return { error: "Escolha a opção que mais combina com você." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      life_phase: lifePhase,
      initial_goals: initialGoals,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Não foi possível salvar suas respostas. Tente novamente." };
  }

  redirect("/dashboard");
}
