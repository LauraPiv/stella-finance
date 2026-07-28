import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/dashboard", "/onboarding"];
const AUTH_PAGES = ["/login", "/signup"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (user && (isProtectedRoute || pathname === "/verify-mfa")) {
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
    const needsMfa = aal && aal.nextLevel === "aal2" && aal.currentLevel !== aal.nextLevel;

    if (needsMfa && pathname !== "/verify-mfa") {
      return NextResponse.redirect(new URL("/verify-mfa", request.url));
    }
    if (!needsMfa && pathname === "/verify-mfa") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return response;
}
