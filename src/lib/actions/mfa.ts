"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type MfaFormState = { error: string } | undefined;

export async function verifyMfaChallenge(
  _prevState: MfaFormState,
  formData: FormData,
): Promise<MfaFormState> {
  const factorId = formData.get("factor_id") as string;
  const code = formData.get("code") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });

  if (error) {
    return { error: "Código inválido. Tente novamente." };
  }

  redirect("/dashboard");
}
