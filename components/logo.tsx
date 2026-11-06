import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ suffix, className }: { suffix?: string; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="w-7 h-7 bg-brand-500 flex items-center justify-center p-1.5 shrink-0">
        <Image src="/proxigo-mark.png" alt="" width={20} height={20} className="w-full h-full" priority />
      </span>
      <span className="font-medium text-ink-50 uppercase tracking-[-0.01em] text-lg">Proxigo</span>
      {suffix && <span className="text-ink-500 font-normal">{suffix}</span>}
    </span>
  );
}
