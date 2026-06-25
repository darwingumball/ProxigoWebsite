"use client";

import { useState, useEffect } from "react";

const CX = 200;
const CY = 115;
const R = 100;

const BLIPS = [
  { angle: 42,  r: 68 },
  { angle: 128, r: 88 },
  { angle: 215, r: 54 },
  { angle: 285, r: 78 },
  { angle: 165, r: 42 },
  { angle: 320, r: 93 },
];

function polar(angle: number, r: number) {
  const rad = (angle - 90) * (Math.PI / 180);
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

// Pre-compute sweep wedge end point (40° arc from 12 o'clock)
const wedgeEnd = polar(40, R);
const sweepPath = `M ${CX} ${CY} L ${CX} ${CY - R} A ${R} ${R} 0 0 1 ${wedgeEnd.x.toFixed(2)} ${wedgeEnd.y.toFixed(2)} Z`;

export function HeroVisual() {
  const [coord, setCoord] = useState({ x: "+0.000", y: "+0.000" });

  useEffect(() => {
    let t = 0;
    const id = setInterval(() => {
      t += 0.06;
      const x = Math.sin(t) * 0.031;
      const y = Math.cos(t * 1.3) * 0.024;
      setCoord({
        x: (x >= 0 ? "+" : "") + x.toFixed(3),
        y: (y >= 0 ? "+" : "") + y.toFixed(3),
      });
    }, 100);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative w-full aspect-video rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden select-none">
      <div className="absolute inset-0 grid-pattern opacity-20" />

      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-4 h-px bg-orange-500/70" />
      <div className="absolute top-4 left-4 w-px h-4 bg-orange-500/70" />
      <div className="absolute top-4 right-4 w-4 h-px bg-orange-500/70" />
      <div className="absolute top-4 right-4 w-px h-4 bg-orange-500/70" />
      <div className="absolute bottom-4 left-4 w-px h-4 bg-orange-500/70" />
      <div className="absolute bottom-4 left-4 w-4 h-px bg-orange-500/70" />
      <div className="absolute bottom-4 right-4 w-px h-4 bg-orange-500/70" />
      <div className="absolute bottom-4 right-4 w-4 h-px bg-orange-500/70" />

      {/* Header */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[10px] font-mono tracking-[0.2em] text-zinc-500">MACULA · VPS · ACTIVE</span>
      </div>

      <svg viewBox="0 0 400 230" className="absolute inset-0 w-full h-full" fill="none">
        <defs>
          <radialGradient id="radar-bg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1c0a02" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#09090c" stopOpacity="0.8" />
          </radialGradient>
          <radialGradient id="sweep-fade" cx="200" cy="115" r="100"
            gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#ea580c" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Background disc */}
        <circle cx={CX} cy={CY} r={R} fill="url(#radar-bg)" stroke="#252530" strokeWidth="1" />

        {/* Range rings */}
        {[25, 50, 75, R].map(r => (
          <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="#1c1c26" strokeWidth="0.7" />
        ))}

        {/* Radial grid lines */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(a => {
          const inner = polar(a, 4);
          const outer = polar(a, R);
          return (
            <line key={a} x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
              stroke="#1c1c26" strokeWidth="0.7" />
          );
        })}

        {/* Rotating sweep */}
        <g>
          <path d={sweepPath} fill="url(#sweep-fade)">
            <animateTransform attributeName="transform" type="rotate"
              from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`} dur="4s" repeatCount="indefinite" />
          </path>
          {/* Leading edge line */}
          <line x1={CX} y1={CY} x2={CX} y2={CY - R} stroke="#ea580c" strokeWidth="0.8" opacity="0.55">
            <animateTransform attributeName="transform" type="rotate"
              from={`0 ${CX} ${CY}`} to={`360 ${CX} ${CY}`} dur="4s" repeatCount="indefinite" />
          </line>
        </g>

        {/* Blips — appear when sweep passes over them */}
        {BLIPS.map((blip, i) => {
          const pt = polar(blip.angle, blip.r);
          const begin = `${((blip.angle / 360) * 4).toFixed(2)}s`;
          return (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="7" fill="#ea580c" fillOpacity="0">
                <animate attributeName="fill-opacity"
                  values="0;0.12;0.02" keyTimes="0;0.03;1"
                  dur="4s" begin={begin} repeatCount="indefinite" />
              </circle>
              <circle cx={pt.x} cy={pt.y} r="2.5" fill="#ea580c" opacity="0.05">
                <animate attributeName="opacity"
                  values="0;1;0.7;0.08" keyTimes="0;0.02;0.12;1"
                  dur="4s" begin={begin} repeatCount="indefinite" />
              </circle>
            </g>
          );
        })}

        {/* Center crosshair */}
        <line x1={CX - 12} y1={CY} x2={CX - 5} y2={CY} stroke="#ea580c" strokeWidth="0.7" opacity="0.5" />
        <line x1={CX + 5}  y1={CY} x2={CX + 12} y2={CY} stroke="#ea580c" strokeWidth="0.7" opacity="0.5" />
        <line x1={CX} y1={CY - 12} x2={CX} y2={CY - 5} stroke="#ea580c" strokeWidth="0.7" opacity="0.5" />
        <line x1={CX} y1={CY + 5}  x2={CX} y2={CY + 12} stroke="#ea580c" strokeWidth="0.7" opacity="0.5" />
        <circle cx={CX} cy={CY} r="2.5" fill="none" stroke="#ea580c" strokeWidth="0.9" opacity="0.8" />
        <circle cx={CX} cy={CY} r="0.8" fill="#ea580c" opacity="0.9" />

        {/* Cardinal labels */}
        <text x={CX} y={CY - R - 6} textAnchor="middle" fill="#3f3f46" fontSize="7" fontFamily="monospace">N</text>
        <text x={CX + R + 7} y={CY + 2.5} fill="#3f3f46" fontSize="7" fontFamily="monospace">E</text>
        <text x={CX} y={CY + R + 12} textAnchor="middle" fill="#3f3f46" fontSize="7" fontFamily="monospace">S</text>
        <text x={CX - R - 12} y={CY + 2.5} fill="#3f3f46" fontSize="7" fontFamily="monospace">W</text>

        {/* Range annotation */}
        <text x={CX + 3} y={CY - 72} fill="#2e2e3a" fontSize="5.5" fontFamily="monospace">30m</text>
        <text x={CX + 3} y={CY - 47} fill="#2e2e3a" fontSize="5.5" fontFamily="monospace">20m</text>

        {/* Left status column */}
        <text x="28" y="88" fill="#52525b" fontSize="6.5" fontFamily="monospace">ACCURACY</text>
        <text x="28" y="99" fill="#ea580c" fontSize="8" fontFamily="monospace">&lt;5cm</text>
        <line x1="28" y1="104" x2="82" y2="104" stroke="#27272a" strokeWidth="0.5" />
        <text x="28" y="116" fill="#52525b" fontSize="6.5" fontFamily="monospace">FOV</text>
        <text x="28" y="127" fill="#a1a1aa" fontSize="8" fontFamily="monospace">100°</text>

        {/* Right status column */}
        <text x="318" y="88" fill="#52525b" fontSize="6.5" fontFamily="monospace">WEIGHT</text>
        <text x="318" y="99" fill="#a1a1aa" fontSize="8" fontFamily="monospace">~210g</text>
        <line x1="318" y1="104" x2="372" y2="104" stroke="#27272a" strokeWidth="0.5" />
        <text x="318" y="116" fill="#52525b" fontSize="6.5" fontFamily="monospace">FPS</text>
        <text x="318" y="127" fill="#a1a1aa" fontSize="8" fontFamily="monospace">60Hz</text>
      </svg>

      {/* Bottom status bar */}
      <div className="absolute bottom-4 left-0 right-0 px-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-500">
            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            LOCK ACQUIRED
          </span>
          <span className="text-[10px] font-mono text-zinc-600">X {coord.x}m</span>
          <span className="text-[10px] font-mono text-zinc-600">Y {coord.y}m</span>
        </div>
        <span className="text-[10px] font-mono text-zinc-700">PROXIGO OS v1.0</span>
      </div>
    </div>
  );
}
