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
