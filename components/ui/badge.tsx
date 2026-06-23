import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-zinc-800 text-zinc-300 border border-zinc-700": variant === "default",
          "bg-emerald-950 text-emerald-400 border border-emerald-800": variant === "success",
          "bg-yellow-950 text-yellow-400 border border-yellow-800": variant === "warning",
          "bg-red-950 text-red-400 border border-red-800": variant === "error",
        },
        className
      )}
    >
      {children}
    </span>
  );
}
