"use client";

import { useEffect, useRef } from "react";

function rrect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

interface Feature {
  wx: number;
  opacity: number;
  flashT: number; // -1 = idle, 0..1 = detection flash animation
}

export function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = 800;
    const H = 600;
    canvas.width  = W;
    canvas.height = H;

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    const DRONE_SPEED  = 35;
    const GROUND_BASE  = H * 0.72;   // ≈ 432 — nominal terrain centre
    const DRONE_Y_BASE = H * 0.295;  // ≈ 177 — nominal drone centre
    const HALF_FOV_DEG = 45;         // half of 90° horiz. FOV (100° diagonal approx)

    let worldOffset = 0;
    let lastTs      = 0;

    const features: Feature[] = [];
    // Seed uniformly from well behind the start to well ahead so the cone is never empty
    for (let i = 0; i < 40; i++) {
      features.push({ wx: i * 20 - 150 + (Math.random() * 12 - 6), opacity: 0, flashT: -1 });
    }

    function tY(wx: number): number {
      return GROUND_BASE
        + 13 * Math.sin(wx * 0.0065)
        +  7 * Math.sin(wx * 0.019  + 1.4)
        +  4 * Math.cos(wx * 0.034  + 0.7);
    }

    function sX(wx: number): number { return wx - worldOffset + W / 2; }

    // Convert screen-x back to world-x
    function wX(sx: number): number { return sx + worldOffset - W / 2; }

    let raf: number;

    function draw(ts: number) {
      const dt = lastTs === 0 ? 0.016 : Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;

      worldOffset += DRONE_SPEED * dt;

      const droneX = W / 2;
      const droneY = DRONE_Y_BASE + Math.sin(ts * 0.00095) * 8;
      const camY   = droneY + 32;          // camera lens y (bottom of Macula)
      const groundY = tY(worldOffset);     // terrain directly below drone

      // Cone geometry — footprint edges follow terrain
      const altitude = groundY - camY;
      const fpHalf   = altitude * Math.tan(HALF_FOV_DEG * Math.PI / 180);
      const coneL    = droneX - fpHalf;
      const coneR    = droneX + fpHalf;
      const leftGY   = tY(wX(coneL));     // terrain height at left edge
      const rightGY  = tY(wX(coneR));     // terrain height at right edge

      // ── Feature management ────────────────────────────────────
      for (let i = features.length - 1; i >= 0; i--) {
        if (sX(features[i].wx) < -160) features.splice(i, 1);
      }
      // Spawn close to the cone's right edge so replacements enter within ~3s,
      // not 7+ seconds later (the old far-ahead spawn caused visible empty gaps).
      while (features.length < 40) {
        features.push({
          wx: worldOffset + fpHalf * 0.5 + Math.random() * (fpHalf + 280),
          opacity: 0,
          flashT:  -1,
        });
      }
      for (const f of features) {
        const sx     = sX(f.wx);
        const inCone = Math.abs(sx - droneX) < fpHalf - 12;
        if (inCone && f.opacity < 0.06 && f.flashT < 0) f.flashT = 0;
        if (f.flashT >= 0) { f.flashT += dt * 2; if (f.flashT > 1) f.flashT = -1; }
        f.opacity = inCone
          ? Math.min(1, f.opacity + dt * 4.5)
          : Math.max(0, f.opacity - dt * 3);
      }

      // ── Background ────────────────────────────────────────────
      ctx.fillStyle = "#09090b";
      ctx.fillRect(0, 0, W, H);

      // Scrolling parallax grid
      const gOff = (worldOffset * 0.22) % 40;
      ctx.strokeStyle = "rgba(255,255,255,0.022)";
      ctx.lineWidth = 1;
      for (let x = -gOff; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // ── Terrain fill ──────────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let sx = 0; sx <= W; sx += 3) ctx.lineTo(sx, tY(wX(sx)));
      ctx.lineTo(W, H);
      ctx.closePath();
      const tGrad = ctx.createLinearGradient(0, GROUND_BASE - 20, 0, H);
      tGrad.addColorStop(0, "#17171b");
      tGrad.addColorStop(1, "#0b0b0d");
      ctx.fillStyle = tGrad;
      ctx.fill();

      // Terrain surface line
      ctx.beginPath();
      for (let sx = 0; sx <= W; sx += 3) {
        const ty = tY(wX(sx));
        if (sx === 0) ctx.moveTo(0, ty); else ctx.lineTo(sx, ty);
      }
      ctx.strokeStyle = "#3f3f46";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = "#27272a";
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.fillText("TERRAIN SURFACE", W / 2, H - 10);

      // ── Cone of vision (terrain-following) ───────────────────
      const maxGY  = Math.max(leftGY, rightGY) + 8;
      const cGrad  = ctx.createLinearGradient(droneX, camY, droneX, maxGY);
      cGrad.addColorStop(0, "rgba(234,88,12,0.22)");
      cGrad.addColorStop(1, "rgba(234,88,12,0.03)");

      // Cone fill — bottom traces terrain
      ctx.beginPath();
      ctx.moveTo(droneX, camY);          // apex at camera
      ctx.lineTo(coneR, rightGY);        // right edge to terrain
      for (let sx = coneR; sx >= coneL; sx -= 4) {
        ctx.lineTo(sx, tY(wX(sx)));      // walk terrain right → left
      }
      ctx.lineTo(coneL, leftGY);         // ensure we land exactly on left edge
      ctx.closePath();                   // back to apex (= left cone edge line)
      ctx.fillStyle = cGrad;
      ctx.fill();

      // Cone edge dashes
      ctx.strokeStyle = "rgba(234,88,12,0.50)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath(); ctx.moveTo(droneX, camY); ctx.lineTo(coneL, leftGY);  ctx.stroke();
      ctx.beginPath(); ctx.moveTo(droneX, camY); ctx.lineTo(coneR, rightGY); ctx.stroke();
      ctx.setLineDash([]);

      // Terrain-following footprint highlight
      ctx.strokeStyle = "rgba(234,88,12,0.80)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(coneL, leftGY);
      for (let sx = coneL + 4; sx <= coneR; sx += 4) {
        ctx.lineTo(sx, tY(wX(sx)));
      }
      ctx.lineTo(coneR, rightGY);
      ctx.stroke();

      // Sub-terrain illumination patch
      ctx.beginPath();
      ctx.moveTo(coneL, leftGY);
      for (let sx = coneL + 4; sx <= coneR; sx += 4) {
        ctx.lineTo(sx, tY(wX(sx)));
      }
      ctx.lineTo(coneR, rightGY);
      ctx.lineTo(coneR, H);
      ctx.lineTo(coneL, H);
      ctx.closePath();
      const pGrad = ctx.createLinearGradient(coneL, 0, coneR, 0);
      pGrad.addColorStop(0,   "rgba(234,88,12,0)");
      pGrad.addColorStop(0.5, "rgba(234,88,12,0.05)");
      pGrad.addColorStop(1,   "rgba(234,88,12,0)");
      ctx.fillStyle = pGrad;
      ctx.fill();

      // FOV label
      ctx.fillStyle = "rgba(234,88,12,0.38)";
      ctx.font = "8px monospace";
      ctx.textAlign = "center";
      ctx.fillText("100° FOV", droneX + fpHalf * 0.65, (camY + groundY) * 0.5 + 4);

      // ── Feature points + optical flow ─────────────────────────
      for (const f of features) {
        if (f.opacity < 0.01 && f.flashT < 0) continue;
        const sx = sX(f.wx);
        const sy = tY(f.wx) - 6;
        const op = f.opacity;

        // Detection flash ring
        if (f.flashT >= 0) {
          const fr = f.flashT;
          ctx.strokeStyle = `rgba(234,88,12,${(1 - fr) * 0.65})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(sx, sy, 4 + fr * 16, 0, Math.PI * 2);
          ctx.stroke();
        }

        if (op > 0.04) {
          const norm  = (sx - droneX) / Math.max(fpHalf, 1);
          const fLen  = 18 + Math.abs(norm) * 7;
          const fx    = -fLen * 0.88 + norm * fLen * 0.38;
          const fy    = norm * fLen * 0.14;
          const ang   = Math.atan2(fy, fx);
          const ah    = 5;

          ctx.strokeStyle = `rgba(234,88,12,${0.52 * op})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + fx, sy + fy);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(sx + fx, sy + fy);
          ctx.lineTo(sx + fx - ah * Math.cos(ang - 0.5), sy + fy - ah * Math.sin(ang - 0.5));
          ctx.moveTo(sx + fx, sy + fy);
          ctx.lineTo(sx + fx - ah * Math.cos(ang + 0.5), sy + fy - ah * Math.sin(ang + 0.5));
          ctx.stroke();

          const cs = 3.5;
          ctx.strokeStyle = `rgba(234,88,12,${0.9 * op})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(sx - cs, sy); ctx.lineTo(sx + cs, sy);
          ctx.moveTo(sx, sy - cs); ctx.lineTo(sx, sy + cs);
          ctx.stroke();

          ctx.fillStyle = `rgba(234,88,12,${op})`;
          ctx.beginPath();
          ctx.arc(sx, sy, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ── Drone (quadcopter, 4-motor 3/4 perspective) ───────────
      drawDrone(ctx, droneX, droneY, ts);

      // ── Corner brackets ───────────────────────────────────────
      // altitude in metres derived from visual pixel geometry
      const altMeters = altitude * 0.036;
      const bm = 18, bs = 16;
      ctx.strokeStyle = "rgba(234,88,12,0.70)";
      ctx.lineWidth = 2;
      for (const [bx, by, dx, dy] of [
        [bm,     bm,     1, 1],
        [W - bm, bm,     -1, 1],
        [bm,     H - bm, 1, -1],
        [W - bm, H - bm, -1, -1],
      ] as [number, number, number, number][]) {
        ctx.beginPath();
        ctx.moveTo(bx + bs * dx, by);
        ctx.lineTo(bx, by);
        ctx.lineTo(bx, by + bs * dy);
        ctx.stroke();
      }

      // ── HUD overlays ──────────────────────────────────────────
      drawHUD(ctx, W, H, ts, altMeters);

      raf = requestAnimationFrame(draw);
    }

    // ── Quadcopter drone ─────────────────────────────────────────
    // Rendered in a slight 3/4 elevated perspective so all 4 motors
    // are visible. Back pair is slightly smaller and dimmer (depth cue).
    function drawDrone(ctx: CanvasRenderingContext2D, x: number, y: number, ts: number) {
      // Back-pair motors (drawn first, behind body)
      const backMotors  = [
        { dx: -43, dy: -13, r: 19, al: 0.60 },
        { dx:  43, dy: -13, r: 19, al: 0.60 },
      ];
      // Front-pair motors (drawn last, in front)
      const frontMotors = [
        { dx: -52, dy: -27, r: 23, al: 1.00 },
        { dx:  52, dy: -27, r: 23, al: 1.00 },
      ];

      // Back arms
      ctx.strokeStyle = "#2a2a2f";
      ctx.lineWidth = 2.5;
      ctx.lineCap = "round";
      for (const m of backMotors) {
        ctx.beginPath();
        ctx.moveTo(x + m.dx * 0.28, y - 3);
        ctx.lineTo(x + m.dx, y + m.dy);
        ctx.stroke();
      }

      // Flight controller body
      ctx.fillStyle = "#1a1a1e";
      ctx.strokeStyle = "#3f3f46";
      ctx.lineWidth = 1.5;
      rrect(ctx, x - 22, y - 12, 44, 20, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#3f3f46";
      ctx.font = "7px monospace";
      ctx.textAlign = "center";
      ctx.fillText("FC", x, y + 3);

      // Front arms
      ctx.strokeStyle = "#3f3f46";
      ctx.lineWidth = 3;
      for (const m of frontMotors) {
        ctx.beginPath();
        ctx.moveTo(x + m.dx * 0.28, y - 8);
        ctx.lineTo(x + m.dx, y + m.dy);
        ctx.stroke();
      }

      // All 4 motors + propeller disks
      for (const m of [...backMotors, ...frontMotors]) {
        const mx = x + m.dx;
        const my = y + m.dy;

        // Prop disk
        ctx.strokeStyle = `rgba(100,100,110,${0.11 * m.al})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mx, my, m.r, 0, Math.PI * 2);
        ctx.stroke();

        // Spinning blade blur (2 blades, opposite phase per side for visual variety)
        for (let i = 0; i < 2; i++) {
          const a = (ts * 0.016 + i * Math.PI + (m.dx > 0 ? 0.9 : 0)) % (Math.PI * 2);
          ctx.strokeStyle = `rgba(160,160,170,${0.22 * m.al})`;
          ctx.lineWidth = m.r > 20 ? 2.5 : 1.8;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(mx + Math.cos(a) * 2, my + Math.sin(a) * 2);
          ctx.lineTo(mx + Math.cos(a) * (m.r - 2), my + Math.sin(a) * (m.r - 2));
          ctx.stroke();
        }

        // Motor body
        ctx.fillStyle  = m.al > 0.8 ? "#222226" : "#1d1d21";
        ctx.strokeStyle = m.al > 0.8 ? "#52525b" : "#3a3a41";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mx, my, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Connector wires between FC and Macula
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 3]);
      ctx.strokeStyle = "rgba(234,88,12,0.45)";
      ctx.beginPath();
      ctx.moveTo(x - 8, y + 8);
      ctx.lineTo(x - 8, y + 14);
      ctx.stroke();
      ctx.strokeStyle = "rgba(113,113,122,0.50)";
      ctx.beginPath();
      ctx.moveTo(x + 8, y + 8);
      ctx.lineTo(x + 8, y + 14);
      ctx.stroke();
      ctx.setLineDash([]);

      // Macula VPS module
      ctx.fillStyle  = "#0e0e11";
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 1.2;
      rrect(ctx, x - 16, y + 14, 32, 16, 3);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ea580c";
      ctx.font = "6px monospace";
      ctx.textAlign = "center";
      ctx.fillText("MACULA", x, y + 24.5);

      // Camera lens
      ctx.fillStyle  = "#07070a";
      ctx.strokeStyle = "rgba(234,88,12,0.90)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y + 32, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(234,88,12,0.40)";
      ctx.beginPath();
      ctx.arc(x, y + 32, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawHUD(ctx: CanvasRenderingContext2D, W: number, H: number, ts: number, altMeters: number) {
      // Header status
      const pulseOn = Math.floor(ts / 600) % 2 === 0;
      ctx.fillStyle = pulseOn ? "#10b981" : "#065f46";
      ctx.beginPath();
      ctx.arc(W / 2 - 68, 24, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#52525b";
      ctx.font = "11px monospace";
      ctx.textAlign = "left";
      ctx.fillText("MACULA · VPS · ACTIVE", W / 2 - 60, 28);

      // Left column
      ctx.fillStyle = "#3f3f46";
      ctx.font = "8px monospace";
      ctx.textAlign = "left";
      ctx.fillText("ACCURACY", 30, 110);
      ctx.fillStyle = "#ea580c";
      ctx.font = "13px monospace";
      ctx.fillText("<1m", 30, 127);
      ctx.fillStyle = "#1f1f23";
      ctx.fillRect(30, 132, 75, 1);
      ctx.fillStyle = "#3f3f46";
      ctx.font = "8px monospace";
      ctx.fillText("ALTITUDE", 30, 148);
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "13px monospace";
      ctx.fillText(altMeters.toFixed(1) + "m", 30, 165);

      // Right column
      const fc = 38 + Math.floor(Math.sin(ts * 0.002) * 8 + 8);
      ctx.textAlign = "right";
      ctx.fillStyle = "#3f3f46";
      ctx.font = "8px monospace";
      ctx.fillText("FEATURES", W - 30, 110);
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "13px monospace";
      ctx.fillText(String(fc), W - 30, 127);
      ctx.fillStyle = "#1f1f23";
      ctx.fillRect(W - 105, 132, 75, 1);
      ctx.fillStyle = "#3f3f46";
      ctx.font = "8px monospace";
      ctx.fillText("FRAME RATE", W - 30, 148);
      ctx.fillStyle = "#a1a1aa";
      ctx.font = "13px monospace";
      ctx.fillText("60Hz", W - 30, 165);

      // Bottom position bar
      const cx  = Math.sin(ts * 0.00055) * 0.031;
      const cy  = Math.cos(ts * 0.00075) * 0.024;
      const xs  = cx >= 0 ? "+" : "";
      const ys  = cy >= 0 ? "+" : "";
      const p2  = Math.floor(ts / 700) % 2 === 0;
      ctx.fillStyle = p2 ? "#10b981" : "#065f46";
      ctx.beginPath();
      ctx.arc(34, H - 21, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#10b981";
      ctx.font = "9px monospace";
      ctx.textAlign = "left";
      ctx.fillText("LOCK", 43, H - 17);
      ctx.fillStyle = "#3f3f46";
      ctx.fillText(`X ${xs}${cx.toFixed(3)}m  Y ${ys}${cy.toFixed(3)}m`, 87, H - 17);
      ctx.textAlign = "right";
      ctx.fillStyle = "#3f3f46";
      ctx.fillText("PROXIGO OS v1.0", W - 28, H - 17);
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative w-full aspect-[4/3] rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden select-none">
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
    </div>
  );
}
