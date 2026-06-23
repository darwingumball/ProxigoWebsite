import { DocsSidebar } from "@/components/docs/sidebar";

export default function DocsContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
      <div className="flex gap-12">
        <DocsSidebar />
        <div className="flex-1 min-w-0 py-10">{children}</div>
      </div>
    </div>
  );
}
