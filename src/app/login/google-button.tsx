"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function GoogleButton({ disabled }: { disabled?: boolean }) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading || disabled}
      className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border-[1.5px] border-wine/20 bg-white px-4 font-heading text-[15.5px] font-semibold text-wine transition-colors hover:bg-cream disabled:opacity-50"
    >
      <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.7-.4-3.5z"
        />
        <path
          fill="#FF3D00"
          d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3c-7.4 0-13.8 4.1-17.1 10.2z"
        />
        <path
          fill="#4CAF50"
          d="M24 45c5.5 0 10.4-1.9 14.2-5.1l-6.5-5.5c-2.1 1.5-4.8 2.4-7.7 2.4-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.9 40.6 16.4 45 24 45z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.5C41.5 36 45 30.4 45 24c0-1.4-.1-2.7-.4-3.5z"
        />
      </svg>
      {loading ? "Redirecionando…" : "Continuar com Google"}
    </button>
  );
}
