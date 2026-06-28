import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Blocked: AI training crawlers, aggressive SEO bots, vulnerability scanners
const BLOCKED_UA_SUBSTRINGS = [
  // AI / LLM training scrapers
  "GPTBot", "ChatGPT-User", "anthropic-ai", "ClaudeBot", "Claude-Web",
  "Bytespider", "CCBot", "omgili", "omgilibot", "Diffbot", "ImagesiftBot",
  "cohere-ai", "PerplexityBot", "YouBot", "FacebookBot",
  // Aggressive SEO crawlers
  "AhrefsBot", "SemrushBot", "MJ12bot", "DotBot", "BLEXBot",
  // Vulnerability / recon scanners
  "sqlmap", "nikto", "masscan", "zgrab", "nuclei",
];

// Public (unauthenticated) API routes — block requests with no user agent
const PUBLIC_API_PREFIXES = ["/api/support"];

export async function middleware(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  const { pathname } = request.nextUrl;

  // Block known bad bots on all routes
  const uaLower = ua.toLowerCase();
  if (BLOCKED_UA_SUBSTRINGS.some((s) => uaLower.includes(s.toLowerCase()))) {
    return new NextResponse(null, { status: 403 });
  }

  // Block empty-UA requests on public API routes (raw scripted abuse)
  if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p)) && !ua.trim()) {
    return new NextResponse(null, { status: 403 });
  }

  // Refresh Supabase auth session so server components stay in sync with the cookie
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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Must call getUser() to trigger token refresh — do not remove
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Run on everything except static assets and media files
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?|ico)$).*)",
  ],
};
