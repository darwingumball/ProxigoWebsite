"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import "mapbox-gl/dist/mapbox-gl.css";

// Global operations view, as shown in Proxigo Desktop. Renders a coded
// orthographic globe on the server and, when NEXT_PUBLIC_MAPBOX_TOKEN is set,
// swaps in a live Mapbox GL globe once it has loaded. The sites are
// illustrative, not real client locations.

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

type LngLat = [number, number];

const HUB: LngLat = [-98.5, 39.5];
const SITES: LngLat[] = [
  [-122.4, 37.8], [-87.6, 41.9], [-74.0, 40.7], [-95.4, 29.8], [-114.1, 51.0],
  [-99.1, 19.4], [-46.6, -23.5], [-0.1, 51.5], [4.5, 51.9], [-58.4, -34.6],
];

const VIEW_CENTER: LngLat = [-62, 24];

// ── Static fallback: orthographic projection ──────────────────────────────

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

// ── Live Mapbox globe ─────────────────────────────────────────────────────

export function OpsGlobe({ className }: { className?: string }) {
  const container = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

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
        m.setFog({ color: "#fbfaf7", "high-color": "#dfe8ff", "space-color": "#fbfaf7", "horizon-blend": 0.04, "star-intensity": 0 });
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
        m.addLayer({ id: "arcs", type: "line", source: "arcs", paint: { "line-color": "#1f4ed8", "line-width": 1.5, "line-opacity": 0.8 } });
        m.addLayer({
          id: "sites",
          type: "circle",
          source: "sites",
          paint: {
            "circle-radius": ["case", ["get", "hub"], 6, 4],
            "circle-color": ["case", ["get", "hub"], "#1f4ed8", "#ffffff"],
            "circle-stroke-color": "#1f4ed8",
            "circle-stroke-width": 1.5,
          },
        });
        setLive(true);
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
  }, []);

  return (
    <div className={cn("relative aspect-square", className)}>
      <div className={cn("absolute inset-0 transition-opacity duration-700", live && "opacity-0")}>
        <StaticGlobe />
      </div>
      {TOKEN && (
        <div
          ref={container}
          className={cn("absolute inset-0 transition-opacity duration-700", live ? "opacity-100" : "opacity-0")}
          aria-label="Interactive globe showing operations sites connected to a central hub"
          role="img"
        />
      )}
    </div>
  );
}
