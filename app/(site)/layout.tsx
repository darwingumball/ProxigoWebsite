import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-light min-h-screen">
      <Nav />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
