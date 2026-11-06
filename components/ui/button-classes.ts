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
    "chamfer inline-flex items-center justify-center font-medium whitespace-nowrap transition-[background-color,color,transform] duration-150 active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
    {
      "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-700": variant === "primary",
      "bg-ink-800 text-ink-100 hover:bg-ink-700 hover:text-ink-50": variant === "secondary",
      "text-ink-400 hover:text-ink-50": variant === "ghost",
      "bg-red-600 text-white hover:bg-red-500": variant === "danger",
    },
    {
      "text-xs px-3 py-1.5 gap-1.5": size === "sm",
      "text-sm px-4 py-2.5 gap-2": size === "md",
      "text-sm px-6 py-3.5 gap-2": size === "lg",
    }
  );
}
