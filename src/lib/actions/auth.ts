"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = { error: string } | undefined;

export async function login(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "E-mail ou senha incorretos." };
  }

  redirect("/dashboard");
}

export async function signup(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const privacyAccepted = formData.get("privacy_accepted") === "on";

  if (!privacyAccepted) {
    return { error: "Você precisa aceitar os Termos de Uso e a Política de Privacidade." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: { privacy_accepted: true },
    },
  });

  if (error) {
    return { error: "Não foi possível criar sua conta. Tente novamente." };
  }

  redirect("/login?checkEmail=1");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function deleteAccountPermanently() {
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_own_account");

  if (error) {
    redirect("/dashboard/settings?error=1");
  }

  await supabase.auth.signOut();
  redirect("/login?accountDeleted=1");
}
