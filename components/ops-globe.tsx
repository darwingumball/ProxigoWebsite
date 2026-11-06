"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "mapbox-gl/dist/mapbox-gl.css";

// Global operations view, as shown in Proxigo Desktop. Three layers:
//  1. StaticGlobe — coded SVG, server-rendered so the space is never empty.
//  2. CanvasGlobe — real coastlines (Natural Earth 110m via d3-geo), slow
//     rotation, drag/arrow-key control, and pulses running from a hub to each
//     site to show data moving through integrations.
//  3. MapboxGlobe — the live Mapbox GL globe, used instead of the canvas when
//     NEXT_PUBLIC_MAPBOX_TOKEN is set.
// The sites are illustrative, not real client locations.

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type LngLat = [number, number];

const HUB: LngLat = [-98.5, 39.5];
const SITES: LngLat[] = [
  [-122.4, 37.8], [-87.6, 41.9], [-74.0, 40.7], [-95.4, 29.8], [-114.1, 51.0],
  [-99.1, 19.4], [-46.6, -23.5], [-0.1, 51.5], [4.5, 51.9], [-58.4, -34.6],
];

const VIEW_CENTER: LngLat = [-62, 24];

// ── 1. Static fallback: orthographic projection ───────────────────────────

const RAD = Math.PI / 180;

function project([lon, lat]: LngLat, [lon0, lat0]: LngLat, r: number): [number, number] | null {
  const λ = (lon - lon0) * RAD, φ = lat * RAD, φ0 = lat0 * RAD;
  const cosc = Math.sin(φ0) * Math.sin(φ) + Math.cos(φ0) * Math.cos(φ) * Math.cos(λ);
  if (cosc < 0) return null;
  const x = r * Math.cos(φ) * Math.sin(λ);
  const y = r * (Math.cos(φ0) * Math.sin(φ) - Math.sin(φ0) * Math.cos(φ) * Math.cos(λ));
  // Rounded so server and browser trig agree, avoiding a hydration mismatch.
  return [Math.round(x * 10) / 10, Math.round(-y * 10) / 10];
}

function toPath(points: LngLat[], r: number) {
  let d = "";
  let pen = false;
  for (const p of points) {
    const xy = project(p, VIEW_CENTER, r);
    if (!xy) { pen = false; continue; }
    d += `${pen ? "L" : "M"}${xy[0].toFixed(1)} ${xy[1].toFixed(1)}`;
    pen = true;
  }
  return d;
}

// Great-circle interpolation between two points.
function arc(a: LngLat, b: LngLat, steps = 48): LngLat[] {
  const toVec = ([lon, lat]: LngLat) => [
    Math.cos(lat * RAD) * Math.cos(lon * RAD),
    Math.cos(lat * RAD) * Math.sin(lon * RAD),
    Math.sin(lat * RAD),
  ];
  const va = toVec(a), vb = toVec(b);
  const ω = Math.acos(Math.min(1, va[0] * vb[0] + va[1] * vb[1] + va[2] * vb[2]));
  const out: LngLat[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const s1 = ω === 0 ? 1 - t : Math.sin((1 - t) * ω) / Math.sin(ω);
    const s2 = ω === 0 ? t : Math.sin(t * ω) / Math.sin(ω);
    const [x, y, z] = [0, 1, 2].map((k) => s1 * va[k] + s2 * vb[k]);
    out.push([Math.atan2(y, x) / RAD, Math.atan2(z, Math.hypot(x, y)) / RAD]);
  }
  return out;
}

function StaticGlobe() {
  const r = 200;
  const graticule: string[] = [];
  for (let lon = -180; lon < 180; lon += 20) {
    const line: LngLat[] = [];
    for (let lat = -90; lat <= 90; lat += 3) line.push([lon, lat]);
    graticule.push(toPath(line, r));
  }
  for (let lat = -60; lat <= 60; lat += 20) {
    const line: LngLat[] = [];
    for (let lon = -180; lon <= 180; lon += 3) line.push([lon, lat]);
    graticule.push(toPath(line, r));
  }
  const hub = project(HUB, VIEW_CENTER, r);

  return (
    <svg viewBox="-215 -215 430 430" className="w-full h-full" aria-hidden>
      <circle r={r} fill="var(--color-ink-950)" stroke="var(--color-ink-700)" />
      <g fill="none" stroke="var(--color-ink-800)" strokeWidth="0.8">
        {graticule.map((d, i) => <path key={i} d={d} />)}
      </g>
      <g fill="none" stroke="var(--color-signal-500)" strokeWidth="1.3" strokeLinecap="round" opacity="0.85">
        {SITES.map((s, i) => <path key={i} d={toPath(arc(HUB, s), r)} />)}
      </g>
      {SITES.map((s, i) => {
        const xy = project(s, VIEW_CENTER, r);
        return xy && <circle key={i} cx={xy[0]} cy={xy[1]} r="3.5" fill="var(--color-ink-950)" stroke="var(--color-signal-500)" strokeWidth="1.5" />;
      })}
      {hub && (
        <>
          <circle cx={hub[0]} cy={hub[1]} r="10" fill="color-mix(in oklab, var(--color-signal-500) 18%, transparent)" />
          <circle cx={hub[0]} cy={hub[1]} r="4.5" fill="var(--color-signal-500)" />
        </>
      )}
    </svg>
  );
}

// ── 2. Interactive canvas globe ───────────────────────────────────────────

const SPIN_DEG_PER_SEC = 5;
const PULSE_MS = 2600;
const PULSE_LENGTH = 0.18; // fraction of an arc lit at once
const RESUME_AFTER_MS = 1800;

function CanvasGlobe({ onReady }: { onReady: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    let frame = 0;
    let visible = true;
    let cleanup = () => {};

    (async () => {
      const [d3, topo, atlas] = await Promise.all([
        import("d3-geo"),
        import("topojson-client"),
        import("world-atlas/land-110m.json"),
      ]);
      if (cancelled) return;

      const world = (atlas.default ?? atlas) as unknown as Parameters<typeof topo.feature>[0];
      const land = topo.feature(world, (world.objects as Record<string, Parameters<typeof topo.feature>[1]>).land);
      const graticule = d3.geoGraticule10();
      const arcs = SITES.map((s) => d3.geoInterpolate(HUB, s));

      const css = getComputedStyle(canvas);
      const color = (name: string) => css.getPropertyValue(name).trim();
      const C = {
        ocean: color("--color-ink-950"),
        land: color("--color-ink-800"),
        coast: color("--color-ink-700"),
        grid: color("--color-ink-800"),
        rim: color("--color-ink-600"),
        accent: color("--color-signal-500"),
      };

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const projection = d3.geoOrthographic().clipAngle(90).precision(0.4);
      const path = d3.geoPath(projection, ctx);
      const rotation: [number, number] = [-VIEW_CENTER[0], -VIEW_CENTER[1]];

      let size = 0;
      const resize = () => {
        const rect = canvas.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        size = rect.width;
        canvas.width = Math.round(rect.width * dpr);
        canvas.height = Math.round(rect.height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        projection.scale(size / 2 - 2).translate([size / 2, size / 2]);
      };
      resize();

      const isFacing = (p: LngLat) => d3.geoDistance(p, [-rotation[0], -rotation[1]]) < Math.PI / 2 - 0.02;

      const draw = (now: number) => {
        projection.rotate(rotation);
        ctx.clearRect(0, 0, size, size);

        ctx.beginPath(); path({ type: "Sphere" });
        ctx.fillStyle = C.ocean; ctx.fill();

        ctx.beginPath(); path(graticule);
        ctx.strokeStyle = C.grid; ctx.lineWidth = 0.6; ctx.stroke();

        ctx.beginPath(); path(land);
        ctx.fillStyle = C.land; ctx.fill();
        ctx.strokeStyle = C.coast; ctx.lineWidth = 0.6; ctx.stroke();

        ctx.beginPath(); path({ type: "Sphere" });
        ctx.strokeStyle = C.rim; ctx.lineWidth = 1; ctx.stroke();

        // Routes: faint full arc, then a travelling pulse.
        arcs.forEach((interp, i) => {
          ctx.beginPath();
          path({ type: "LineString", coordinates: [HUB, SITES[i]] });
          ctx.strokeStyle = C.accent; ctx.globalAlpha = 0.28; ctx.lineWidth = 1.2; ctx.stroke();
          ctx.globalAlpha = 1;

          const t = reduced ? 1 : ((now / PULSE_MS + i * 0.37) % 1) * (1 + PULSE_LENGTH);
          const start = Math.max(0, t - PULSE_LENGTH), end = Math.min(1, t);
          if (end > start) {
            const pts: LngLat[] = [];
            for (let k = 0; k <= 12; k++) pts.push(interp(start + ((end - start) * k) / 12) as LngLat);
            ctx.beginPath(); path({ type: "LineString", coordinates: pts });
            ctx.strokeStyle = C.accent; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.stroke();
          }

          const site = SITES[i];
          if (isFacing(site)) {
            const [x, y] = projection(site)!;
            const arrival = reduced ? 0 : Math.max(0, t - 1) / PULSE_LENGTH; // 0→1 just after the pulse lands
            if (arrival > 0) {
              ctx.beginPath(); ctx.arc(x, y, 4 + arrival * 9, 0, Math.PI * 2);
              ctx.strokeStyle = C.accent; ctx.globalAlpha = 1 - arrival; ctx.lineWidth = 1.2; ctx.stroke();
              ctx.globalAlpha = 1;
            }
            ctx.beginPath(); ctx.arc(x, y, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = C.ocean; ctx.fill();
            ctx.strokeStyle = C.accent; ctx.lineWidth = 1.5; ctx.stroke();
          }
        });

        if (isFacing(HUB)) {
          const [x, y] = projection(HUB)!;
          ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2);
          ctx.fillStyle = C.accent; ctx.globalAlpha = 0.18; ctx.fill(); ctx.globalAlpha = 1;
          ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fillStyle = C.accent; ctx.fill();
        }
      };

      // ── Interaction ──
      let dragging = false;
      let last: [number, number] | null = null;
      let pausedUntil = 0;

      const rotateBy = (dLon: number, dLat: number) => {
        rotation[0] += dLon;
        rotation[1] = Math.max(-70, Math.min(70, rotation[1] + dLat));
      };
      const onDown = (e: PointerEvent) => {
        dragging = true; last = [e.clientX, e.clientY];
        canvas.setPointerCapture(e.pointerId);
        canvas.style.cursor = "grabbing";
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging || !last) return;
        const k = 180 / Math.max(size, 1);
        rotateBy((e.clientX - last[0]) * k, -(e.clientY - last[1]) * k);
        last = [e.clientX, e.clientY];
        if (reduced) draw(performance.now());
      };
      const onUp = () => {
        dragging = false; last = null; pausedUntil = performance.now() + RESUME_AFTER_MS;
        canvas.style.cursor = "grab";
      };
      const onKey = (e: KeyboardEvent) => {
        const step = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, 10], ArrowDown: [0, -10] }[e.key];
        if (!step) return;
        e.preventDefault();
        rotateBy(step[0], step[1]);
        pausedUntil = performance.now() + RESUME_AFTER_MS;
        if (reduced) draw(performance.now());
      };
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointercancel", onUp);
      canvas.addEventListener("keydown", onKey);

      const ro = new ResizeObserver(() => { resize(); draw(performance.now()); });
      ro.observe(canvas);

      // Loop only while on screen; reduced motion draws on demand instead.
      let prev = performance.now();
      const loop = (now: number) => {
        const dt = Math.min(now - prev, 64);
        prev = now;
        if (!dragging && now > pausedUntil) rotation[0] += (SPIN_DEG_PER_SEC * dt) / 1000;
        draw(now);
        frame = requestAnimationFrame(loop);
      };
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        cancelAnimationFrame(frame);
        if (visible && !reduced) { prev = performance.now(); frame = requestAnimationFrame(loop); }
      });
      io.observe(canvas);

      draw(performance.now());
      onReady();

      cleanup = () => {
        cancelAnimationFrame(frame);
        io.disconnect();
        ro.disconnect();
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointercancel", onUp);
        canvas.removeEventListener("keydown", onKey);
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [onReady]);

  return (
    <canvas
      ref={canvasRef}
      tabIndex={0}
      role="img"
      aria-roledescription="interactive globe"
      aria-label="Globe showing operations sites connected to a central hub. Drag or use the arrow keys to rotate."
      className="absolute inset-0 w-full h-full cursor-grab rounded-full touch-pan-y focus-visible:outline-offset-4"
    />
  );
}

// ── 3. Live Mapbox globe ──────────────────────────────────────────────────

function MapboxGlobe({ onReady }: { onReady: () => void }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!TOKEN || !container.current) return;
    let cancelled = false;
    let map: import("mapbox-gl").Map | undefined;

    (async () => {
      const { default: mapboxgl } = await import("mapbox-gl");
      if (cancelled || !container.current) return;

      mapboxgl.accessToken = TOKEN;
      map = new mapboxgl.Map({
        container: container.current,
        style: "mapbox://styles/mapbox/light-v11",
        projection: "globe",
        center: VIEW_CENTER,
        zoom: 1.4,
        cooperativeGestures: true,
      });

      const m = map;
      m.on("style.load", () => {
        m.setFog({ color: "#fbfaf7", "high-color": "#f3ece4", "space-color": "#fbfaf7", "horizon-blend": 0.04, "star-intensity": 0 });
        m.addSource("arcs", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: SITES.map((s) => ({ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: arc(HUB, s) } })),
          },
        });
        m.addSource("sites", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [HUB, ...SITES].map((s, i) => ({ type: "Feature", properties: { hub: i === 0 }, geometry: { type: "Point", coordinates: s } })),
          },
        });
        m.addLayer({ id: "arcs", type: "line", source: "arcs", paint: { "line-color": "#ea580c", "line-width": 1.5, "line-opacity": 0.8 } });
        m.addLayer({
          id: "sites",
          type: "circle",
          source: "sites",
          paint: {
            "circle-radius": ["case", ["get", "hub"], 6, 4],
            "circle-color": ["case", ["get", "hub"], "#ea580c", "#ffffff"],
            "circle-stroke-color": "#ea580c",
            "circle-stroke-width": 1.5,
          },
        });
        onReady();
      });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      let interacting = false;
      const spin = () => {
        if (interacting || cancelled) return;
        const c = m.getCenter();
        c.lng -= 3;
        m.easeTo({ center: c, duration: 1000, easing: (n) => n });
      };
      m.on("mousedown", () => { interacting = true; });
      m.on("touchstart", () => { interacting = true; });
      m.on("moveend", spin);
      m.once("idle", spin);
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [onReady]);

  return (
    <div
      ref={container}
      className="absolute inset-0"
      aria-label="Interactive globe showing operations sites connected to a central hub"
      role="img"
    />
  );
}

// ── Wrapper ───────────────────────────────────────────────────────────────

export function OpsGlobe({ className }: { className?: string }) {
  const [ready, setReady] = useState(false);
  const [markReady] = useState(() => () => setReady(true));

  return (
    <div className={cn("relative aspect-square", className)}>
      <div className={cn("absolute inset-0 transition-opacity duration-500", ready && "opacity-0")} aria-hidden={ready}>
        <StaticGlobe />
      </div>
      <div className={cn("absolute inset-0 transition-opacity duration-500", ready ? "opacity-100" : "opacity-0")}>
        {TOKEN ? <MapboxGlobe onReady={markReady} /> : <CanvasGlobe onReady={markReady} />}
      </div>
    </div>
  );
}
