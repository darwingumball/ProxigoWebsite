import { PRODUCTS } from "@/lib/products";

// A static, coded rendition of the Proxigo desktop app, used until real
// captures or an interactive demo are available (see ProductDemo).

const TELEMETRY = [
  ["Fix", "VPS · 3D"],
  ["Confidence", "0.94"],
  ["Horiz. error", "0.42 m"],
  ["Altitude AGL", "38.0 m"],
  ["Ground speed", "6.1 m/s"],
  ["MAVLink", "57600 · OK"],
];

const LAYERS = [
  { name: "Imagery · 0.3 m/px", on: true },
  { name: "Coverage area", on: true },
  { name: "Flight log 14:02", on: true },
  { name: "No-fly zones", on: false },
];

export function AppPreview({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-lg border border-ink-700 bg-ink-900 overflow-hidden shadow-2xl shadow-black/40 text-[11px] ${className}`}
      role="img"
      aria-label="Proxigo desktop app showing a coverage map, flight path, and live positioning telemetry from a Macula module"
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 px-3 h-8 border-b border-ink-800 bg-ink-950">
        <div className="flex gap-1.5" aria-hidden>
          <span className="w-2.5 h-2.5 rounded-full bg-ink-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-ink-700" />
          <span className="w-2.5 h-2.5 rounded-full bg-ink-700" />
        </div>
        <span className="text-ink-400 font-mono">Proxigo — Field site 7 / North quarry</span>
        <span className="ml-auto hidden sm:flex items-center gap-1.5 text-ink-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> MAC-A1B2 connected
        </span>
      </div>

      <div className="grid grid-cols-[1fr] md:grid-cols-[150px_1fr_170px] min-h-[300px] sm:min-h-[360px]">
        {/* Left rail */}
        <div className="hidden md:flex flex-col border-r border-ink-800 bg-ink-950/60 py-3">
          <p className="px-3 mb-1.5 text-ink-500">Products</p>
          {PRODUCTS.map((p) => (
            <div key={p.slug} className="mx-1.5 px-2 py-1.5 rounded bg-ink-800 text-ink-100 flex items-center justify-between">
              {p.name}
              <span className="w-1.5 h-1.5 rounded-full bg-signal-500" />
            </div>
          ))}
          <div className="mx-1.5 px-2 py-1.5 text-ink-500">+ Add product</div>

          <p className="px-3 mt-4 mb-1.5 text-ink-500">Map layers</p>
          {LAYERS.map((l) => (
            <div key={l.name} className="px-3 py-1 flex items-center gap-2 text-ink-300">
              <span className={`w-2.5 h-2.5 rounded-sm border ${l.on ? "bg-signal-500 border-signal-500" : "border-ink-600"}`} />
              <span className="truncate">{l.name}</span>
            </div>
          ))}
        </div>

        {/* Map */}
        <div className="relative bg-[#161613] survey-grid overflow-hidden">
          <svg viewBox="0 0 720 300" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full" aria-hidden>
            {/* terrain contours */}
            <g fill="none" stroke="var(--color-ink-700)" strokeWidth="0.8">
              <path d="M0 225 C 120 190, 230 245, 360 212 S 590 170, 720 205" />
              <path d="M0 258 C 130 222, 250 275, 380 242 S 600 200, 720 236" />
              <path d="M0 66 C 140 36, 260 98, 400 58 S 620 28, 720 52" />
              <path d="M0 98 C 150 66, 280 128, 420 92 S 630 66, 720 86" />
            </g>
            {/* coverage polygon */}
            <path
              d="M230 60 L460 45 L500 190 L410 255 L250 230 Z"
              fill="color-mix(in oklab, var(--color-signal-500) 10%, transparent)"
              stroke="var(--color-signal-500)"
              strokeWidth="1.2"
              strokeDasharray="5 4"
            />
            {/* flight path */}
            <path
              className="route-draw"
              style={{ ["--route-length" as string]: 900 }}
              d="M270 210 L270 80 L310 75 L310 215 L350 220 L350 70 L390 65 L390 225 L430 230 L430 60"
              fill="none"
              stroke="var(--color-ink-100)"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            {/* aircraft */}
            <g transform="translate(430 60)">
              <circle r="11" fill="color-mix(in oklab, var(--color-signal-500) 20%, transparent)" />
              <circle r="4" fill="var(--color-signal-500)" />
            </g>
          </svg>

          <div className="absolute top-2 left-2 rounded bg-ink-950/90 border border-ink-800 px-2 py-1 font-mono text-ink-300">
            42.1 km² · 3 tiles cached
          </div>
          <div className="absolute bottom-2 left-2 font-mono text-ink-400">100 m ━━━</div>
        </div>

        {/* Telemetry */}
        <div className="hidden md:flex flex-col border-l border-ink-800 bg-ink-950/60 p-3 gap-3">
          <div>
            <p className="text-ink-500 mb-1">Macula · live</p>
            <dl className="font-mono">
              {TELEMETRY.map(([k, v]) => (
                <div key={k} className="flex justify-between py-1 border-b border-ink-800/80">
                  <dt className="text-ink-500">{k}</dt>
                  <dd className="text-ink-100">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <p className="text-ink-500 mb-1.5">Confidence, last 60 s</p>
            <svg viewBox="0 0 140 36" className="w-full" aria-hidden>
              <polyline
                fill="none"
                stroke="var(--color-signal-400)"
                strokeWidth="1.2"
                points="0,20 10,18 20,14 30,15 40,10 50,9 60,12 70,8 80,7 90,9 100,6 110,7 120,5 130,6 140,5"
              />
            </svg>
          </div>
          <div className="mt-auto rounded border border-ink-700 px-2 py-1.5 text-ink-300">
            Firmware 2.4.1 · up to date
          </div>
        </div>
      </div>
    </div>
  );
}
