import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Analytics } from "@vercel/analytics/next";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: { default: "Proxigo | Drone Visual Positioning", template: "%s | Proxigo" },
  description:
    "The Macula VPS Module delivers centimeter-level visual positioning for drones. No GPS required.",
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    siteName: "Proxigo",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
