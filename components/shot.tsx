import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { cn } from "@/lib/utils";

// A slot for a client-supplied screenshot or photo in public/products. Until
// the file exists, the coded preview passed as children renders instead, so a
// slot never shows an empty frame. Images are cropped to the frame's aspect.
export function Shot({
  file,
  alt,
  aspect = "aspect-[16/10]",
  priority,
  className,
  children,
}: {
  file: string;
  alt: string;
  aspect?: string;
  priority?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  if (!fs.existsSync(path.join(process.cwd(), "public", "products", file))) return <>{children}</>;

  return (
    <div className={cn("group relative overflow-hidden bg-ink-900", aspect, className)}>
      <Image
        src={`/products/${file}`}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1280px) 1200px, 100vw"
        className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
      />
    </div>
  );
}
