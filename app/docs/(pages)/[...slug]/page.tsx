import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DOCS_NAV, findDocPage } from "@/lib/docs-config";
import { Clock, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  return DOCS_NAV.flatMap((section) =>
    section.pages.map((page) => ({ slug: page.path.split("/") }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = findDocPage(slug);
  if (!page) return {};
  return { title: page.title, description: page.description };
}

export default async function DocPage({ params }: Props) {
  const { slug } = await params;
  const page = findDocPage(slug);
  if (!page) notFound();

  // Find prev/next for navigation
  const allPages = DOCS_NAV.flatMap((s) => s.pages);
  const idx = allPages.findIndex((p) => p.path === slug.join("/"));
  const prev = idx > 0 ? allPages[idx - 1] : null;
  const next = idx < allPages.length - 1 ? allPages[idx + 1] : null;

  // Find which section this page belongs to
  const section = DOCS_NAV.find((s) => s.pages.some((p) => p.path === slug.join("/")));

  return (
    <article className="max-w-3xl">
      {/* Breadcrumb */}
      <p className="text-xs text-zinc-600 mb-6">{section?.section}</p>

      {/* Title */}
      <h1 className="text-4xl font-bold text-white tracking-tight mb-3">{page.title}</h1>
      <p className="text-zinc-400 text-lg leading-relaxed mb-10">{page.description}</p>

      {/* Coming soon placeholder */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-8 flex flex-col items-center text-center gap-4">
        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
          <Clock size={18} className="text-zinc-500" />
        </div>
        <div>
          <p className="font-medium text-white mb-1">Content coming soon</p>
          <p className="text-sm text-zinc-500 max-w-xs">
            This page is being written ahead of the October 2026 launch. Check back soon or{" "}
            <Link href="/support" className="text-zinc-300 hover:text-white transition-colors underline underline-offset-2">
              open a ticket
            </Link>{" "}
            if you need help now.
          </p>
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div className="mt-12 pt-8 border-t border-zinc-800 flex items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/docs/${prev.path}`}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>{prev.title}</span>
          </Link>
        ) : <div />}
        {next ? (
          <Link
            href={`/docs/${next.path}`}
            className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors group ml-auto"
          >
            <span>{next.title}</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : <div />}
      </div>
    </article>
  );
}
