import { createClient } from "@supabase/supabase-js";

export function createBearerClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    }
  );
}

export function extractBearerToken(req: Request): string | null {
  const header = req.headers.get("Authorization");
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return null;
}

/**
 * Resolve the authenticated user from a request.
 * For bearer token requests (desktop app), passes the JWT explicitly to
 * getUser(jwt) so the SDK validates it directly instead of relying on a
 * persisted session (which doesn't exist in a stateless serverless function).
 * Falls back to cookie-based auth for browser sessions.
 */
export async function getUserFromRequest(req: Request) {
  const token = extractBearerToken(req);
  if (token) {
    const client = createBearerClient(token);
    // Pass jwt explicitly — without this, getUser() reads from internal session
    // (null when persistSession:false), returning no user even with a valid JWT.
    const { data: { user } } = await client.auth.getUser(token);
    return user;
  }
  // Cookie-based fallback for browser clients
  const { createClient: createServerClient } = await import("@/lib/supabase/server");
  const cookieClient = await createServerClient();
  const { data: { user } } = await cookieClient.auth.getUser();
  return user;
}
