import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PATHS = ["/dashboard", "/admin"];

// Block AI scrapers and LLM crawlers at the edge
const BLOCKED_UA_PATTERNS = [
  /GPTBot/i,
  /ChatGPT-User/i,
  /anthropic-ai/i,
  /ClaudeBot/i,
  /Claude-Web/i,
  /Bytespider/i,
  /CCBot/i,
  /cohere-ai/i,
  /PerplexityBot/i,
  /YouBot/i,
  /Diffbot/i,
  /ImagesiftBot/i,
];

// Block obviously malicious path patterns
const BLOCKED_PATH_PATTERNS = [
  /\.env/i,
  /wp-admin/i,
  /wp-login/i,
  /phpMyAdmin/i,
  /\.php$/i,
  /\/etc\/passwd/i,
  /\/proc\//i,
  /\.\.\//,                  // path traversal
  /<script/i,                // XSS probe
  /union.*select/i,          // SQL injection probe
];

export async function proxy(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  const path = request.nextUrl.pathname;

  // Block AI crawlers
  if (BLOCKED_UA_PATTERNS.some((re) => re.test(ua))) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // Block malicious path probes
  if (BLOCKED_PATH_PATTERNS.some((re) => re.test(path))) {
    return new NextResponse("Not Found", { status: 404 });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PATHS.some((p) =>
    request.nextUrl.pathname.startsWith(p)
  );

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
