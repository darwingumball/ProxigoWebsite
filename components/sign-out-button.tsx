"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();

  async function handleClick() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-white transition-colors py-2"
    >
      <LogOut size={14} />
      Sign out
    </button>
  );
}
