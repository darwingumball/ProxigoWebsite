"use client";

import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/40",
          {
            "bg-orange-600 text-white hover:bg-orange-500 active:bg-orange-700": variant === "primary",
            "border border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:text-white bg-transparent": variant === "secondary",
            "text-zinc-400 hover:text-white bg-transparent": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-500": variant === "danger",
          },
          {
            "text-xs px-3 py-1.5 rounded-md gap-1.5": size === "sm",
            "text-sm px-4 py-2.5 rounded-lg gap-2": size === "md",
            "text-base px-6 py-3.5 rounded-lg gap-2": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
