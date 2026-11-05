import { Badge } from "@/components/ui/badge";

const STATUS: Record<string, { label: string; variant: "default" | "success" | "warning" }> = {
  open:        { label: "Open",        variant: "warning" },
  in_progress: { label: "In progress", variant: "warning" },
  resolved:    { label: "Resolved",    variant: "success" },
  closed:      { label: "Closed",      variant: "default" },
};

export function TicketStatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, variant: "default" as const };
  return <Badge variant={s.variant}>{s.label}</Badge>;
}
