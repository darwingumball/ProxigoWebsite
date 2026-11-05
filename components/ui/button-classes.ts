import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

// Shared by <Button> and by <Link>s that should look like buttons. Kept out of
// button.tsx so server components can import it.
export function buttonClasses({
  variant = "primary",
  size = "md",
}: { variant?: ButtonVariant; size?: ButtonSize } = {}) {
  return cn(
    "inline-flex items-center justify-center font-medium whitespace-nowrap transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
    {
      "bg-signal-500 text-ink-950 hover:bg-signal-400 active:bg-signal-600": variant === "primary",
      "border border-ink-700 text-ink-200 hover:border-ink-500 hover:text-white": variant === "secondary",
      "text-ink-400 hover:text-white": variant === "ghost",
      "bg-red-600 text-white hover:bg-red-500": variant === "danger",
    },
    {
      "text-xs px-3 py-1.5 rounded gap-1.5": size === "sm",
      "text-sm px-4 py-2.5 rounded-md gap-2": size === "md",
      "text-sm px-5 py-3 rounded-md gap-2": size === "lg",
    }
  );
}
