import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonClasses } from "@/components/ui/button-classes";

export const metadata: Metadata = {
  title: "About",
  description: "Proxigo AI builds field software and positioning hardware so drones can navigate precisely without GPS.",
};

const VALUES = [
  {
    title: "Precision first",
    desc: "Centimeter-level positioning isn't a marketing number to us. It's the whole point of the product, and every design decision gets measured against it.",
  },
  {
    title: "Built to fly, not just to demo",
    desc: "Macula is engineered for real flight conditions: vibration, temperature swings, and the kind of signal-denied environments where GPS was never going to help anyway.",
  },
  {
    title: "Small team, direct accountability",
    desc: "We're a small team. When you open a ticket, an engineer who works on the product reads it, not a support script.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="pt-32 sm:pt-40 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl font-semibold text-white tracking-tight mb-6">
          Positioning that doesn&apos;t depend on the sky.
        </h1>
        <p className="text-lg text-ink-400 leading-relaxed max-w-2xl">
          Proxigo AI builds Proxigo Desktop, the software platform that drone operators use to prepare,
          configure, and fly their hardware, and the products that run on it. The first is the Macula
          Visual Positioning System, a module that gives drones centimeter-level position estimates using
          only a downward-facing camera and onboard computer vision. No GPS, no external infrastructure,
          no signal to jam or lose.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="border-t border-ink-800 pt-10">
          <h2 className="text-2xl font-semibold text-white mb-4">Why we built this</h2>
          <p className="max-w-xl text-ink-300 leading-relaxed mb-4">
            GPS is convenient until it isn&apos;t: indoors, under canopy, near jamming, or anywhere
            positioning accuracy actually matters at close range. Most alternatives to GPS require
            new ground infrastructure, expensive sensors, or both. We wanted something that mounts
            to a drone in minutes and just works, using a camera and a vision model instead of a
            signal that has to reach the sky and back.
          </p>
          <p className="max-w-xl text-ink-300 leading-relaxed">
            Macula is the result: a self-contained module that handles the entire vision pipeline
            onboard, streams standard MAVLink position data to any flight controller, and never
            needs a network connection to do its job mid-flight.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-2xl font-semibold text-white mb-8">How we work</h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {VALUES.map(({ title, desc }) => (
            <div key={title} className="border-t border-ink-700 pt-5">
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-ink-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
        <div className="border-t border-ink-800 pt-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Want to talk to the team?</h2>
            <p className="text-sm text-ink-400">
              Questions about the product, a partnership, or press — we read every message ourselves.
            </p>
          </div>
          <Link href="/support#contact" className={buttonClasses({ size: "lg" })}>
            Get in touch <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
