import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // OAuth sign-ins (e.g. Google) don't carry custom metadata like email/password
      // signup does — the consent notice next to the OAuth button is the affirmative
      // act, so we record it here on first login instead.
      await supabase
        .from("profiles")
        .update({ privacy_accepted_at: new Date().toISOString() })
        .eq("id", data.user.id)
        .is("privacy_accepted_at", null);

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
