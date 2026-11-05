"use client";

import { useRouter } from "next/navigation";
import { SupportForm } from "@/components/support-form";

// Refreshes the server-rendered ticket list after a ticket is created.
export function DashboardSupportForm({ account }: { account: { name: string; email: string } }) {
  const router = useRouter();
  return <SupportForm account={account} onSubmitted={() => router.refresh()} />;
}
