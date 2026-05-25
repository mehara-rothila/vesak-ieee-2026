// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from "react";

function LotusBackground({ children, onReady }: { children: React.ReactNode; onReady?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w: number, h: number;

    const resize = () => {
      // Read canvas's CSS size (set by the 1:1 square stage), so internal pixels match
      w = canvas.width = canvas.clientWidth || window.innerWidth;
      h = canvas.height = canvas.clientHeight || window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const HORIZON = 0.46;

    // ── Stars ──
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.43,
      r: Math.random() * 1.3 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.01 + 0.003,
      color: Math.random() > 0.85 ? [255, 200, 150] : Math.random() > 0.7 ? [180, 200, 255] : [220, 225, 245],
    }));

    // ── Shooting stars ──
    const shootingStars = [];
    let shootTimer = 0;

    // ── Clouds ──
    const clouds = Array.from({ length: 6 }, () => ({
      x: Math.random() * 1.4 - 0.2,
      y: 0.05 + Math.random() * 0.25,
      w: 0.08 + Math.random() * 0.15,
      h: 0.012 + Math.random() * 0.018,
      speed: 0.000008 + Math.random() * 0.000015,
      opacity: 0.03 + Math.random() * 0.04,
      blobs: Array.from({ length: 4 + Math.floor(Math.random() * 4) }, () => ({
        ox: (Math.random() - 0.5) * 0.8,
        oy: (Math.random() - 0.5) * 0.6,
        rx: 0.3 + Math.random() * 0.5,
        ry: 0.5 + Math.random() * 0.5,
      })),
    }));

    // ── Aurora ──
    const auroraWaves = Array.from({ length: 5 }, (_, i) => ({
      phase: i * 1.3,
      freq: 1.5 + i * 0.4,
      amp: 0.015 + Math.random() * 0.02,
      y: 0.08 + i * 0.05,
      hue: 140 + i * 25,
      opacity: 0.025 + Math.random() * 0.02,
      speed: 0.002 + i * 0.0005,
    }));

    // ── Fireflies ──
    const fireflies = Array.from({ length: 25 }, () => ({
      x: Math.random(),
      y: 0.36 + Math.random() * 0.26,
      r: Math.random() * 2 + 0.8,
      dx: (Math.random() - 0.5) * 0.00018,
      dy: (Math.random() - 0.5) * 0.00012,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.015 + 0.006,
      hue: Math.random() > 0.7 ? 100 : 45,
    }));

    // ── Ripples ──
    const ripples = [];
    let rippleTimer = 0;

    // ── Fish jump splashes ──
    const fishSplashes = [];
    let fishTimer = 0;

    // ── Floating petals ──
    const petals = Array.from({ length: 12 }, () => ({
      x: Math.random(),
      y: 0.54 + Math.random() * 0.38,
      size: Math.random() * 4.5 + 2,
      drift: (Math.random() - 0.5) * 0.00005,
      sway: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.3 + 0.08,
      hue: 325 + Math.random() * 30,
    }));

    // ── Lily pads ──
    const lilyPads = Array.from({ length: 5 }, () => ({
      x: 0.05 + Math.random() * 0.9,
      y: 0.58 + Math.random() * 0.32,
      size: 8 + Math.random() * 14,
      rot: Math.random() * 360,
      drift: (Math.random() - 0.5) * 0.000015,
      sway: Math.random() * Math.PI * 2,
      opacity: 0.2 + Math.random() * 0.2,
      notch: Math.random() * 360,
    }));

    // ── Ambient particles (pollen/dust) ──
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.6,
      r: Math.random() * 0.8 + 0.2,
      dx: (Math.random() - 0.5) * 0.00008,
      dy: Math.random() * 0.00003 + 0.00001,
      phase: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.25 + 0.05,
    }));

    // ── Glowing mushrooms at shore ──
    const mushrooms = Array.from({ length: 6 }, () => ({
      x: Math.random() > 0.5 ? (0.01 + Math.random() * 0.1) : (0.88 + Math.random() * 0.1),
      y: HORIZON - 0.005 + Math.random() * 0.025,
      size: 3 + Math.random() * 4,
      hue: 140 + Math.random() * 40,
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.008 + Math.random() * 0.01,
    }));

    let t = 0;

    const draw = () => {
      t++;
      const time = t * 0.003;
      ctx.clearRect(0, 0, w, h);

      // ════════════════ SKY ════════════════
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * HORIZON);
      skyGrad.addColorStop(0, "#03060f");
      skyGrad.addColorStop(0.15, "#080e1e");
      skyGrad.addColorStop(0.3, "#0d1830");
      skyGrad.addColorStop(0.5, "#152540");
      skyGrad.addColorStop(0.7, "#1d3050");
      skyGrad.addColorStop(0.85, "#283d5e");
      skyGrad.addColorStop(0.95, "#354a68");
      skyGrad.addColorStop(1, "#3e5575");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, w, h * HORIZON + 5);

      // ════════════════ AURORA BOREALIS ════════════════
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      auroraWaves.forEach((aw) => {
        const points = [];
        for (let x = 0; x <= w; x += 4) {
          const nx = x / w;
          const yBase = aw.y * h;
          const wave = Math.sin(nx * Math.PI * aw.freq + time * aw.speed * 100 + aw.phase) * aw.amp * h;
          const wave2 = Math.cos(nx * Math.PI * aw.freq * 1.7 + time * aw.speed * 60) * aw.amp * h * 0.4;
          points.push({ x, y: yBase + wave + wave2 });
        }
        // Draw aurora band
        const bandH = h * 0.04;
        const aGrad = ctx.createLinearGradient(0, points[0].y - bandH, 0, points[0].y + bandH);
        aGrad.addColorStop(0, `hsla(${aw.hue}, 70%, 50%, 0)`);
        aGrad.addColorStop(0.3, `hsla(${aw.hue}, 70%, 55%, ${aw.opacity * (0.7 + Math.sin(time * 0.5 + aw.phase) * 0.3)})`);
        aGrad.addColorStop(0.5, `hsla(${aw.hue}, 80%, 60%, ${aw.opacity * 1.2 * (0.7 + Math.sin(time * 0.5 + aw.phase) * 0.3)})`);
        aGrad.addColorStop(0.7, `hsla(${aw.hue + 20}, 70%, 55%, ${aw.opacity * 0.8 * (0.7 + Math.sin(time * 0.5 + aw.phase) * 0.3)})`);
        aGrad.addColorStop(1, `hsla(${aw.hue + 20}, 70%, 50%, 0)`);

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y - bandH);
        points.forEach((p) => ctx.lineTo(p.x, p.y - bandH));
        points.slice().reverse().forEach((p) => ctx.lineTo(p.x, p.y + bandH));
        ctx.closePath();
        ctx.fillStyle = aGrad;
        ctx.fill();
      });
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();

      // ════════════════ MOON (enhanced) ════════════════
      const moonX = w * 0.73;
      const moonY = h * 0.13;
      const moonR = Math.min(w, h) * 0.065;

      // Outer atmospheric glow — large soft bloom
      for (let i = 7; i >= 0; i--) {
        const r = moonR * (7 + i * 5);
        const hGrad = ctx.createRadialGradient(moonX, moonY, moonR * 0.3, moonX, moonY, r);
        hGrad.addColorStop(0, `rgba(210, 225, 250, ${0.09 - i * 0.01})`);
        hGrad.addColorStop(0.2, `rgba(195, 215, 245, ${0.06 - i * 0.007})`);
        hGrad.addColorStop(0.5, `rgba(175, 200, 240, ${0.035 - i * 0.004})`);
        hGrad.addColorStop(0.75, `rgba(155, 185, 230, ${0.015 - i * 0.0015})`);
        hGrad.addColorStop(1, "rgba(140, 170, 220, 0)");
        ctx.fillStyle = hGrad;
        ctx.beginPath();
        ctx.arc(moonX, moonY, r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Moonlight column — vertical light beam down to horizon
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const colGrad = ctx.createLinearGradient(moonX, moonY + moonR, moonX, h * HORIZON);
      colGrad.addColorStop(0, "rgba(200, 215, 245, 0.06)");
      colGrad.addColorStop(0.3, "rgba(190, 210, 240, 0.03)");
      colGrad.addColorStop(0.7, "rgba(180, 200, 235, 0.015)");
      colGrad.addColorStop(1, "rgba(170, 195, 230, 0)");
      ctx.fillStyle = colGrad;
      ctx.beginPath();
      ctx.moveTo(moonX - moonR * 2, moonY + moonR);
      ctx.lineTo(moonX - moonR * 6, h * HORIZON);
      ctx.lineTo(moonX + moonR * 6, h * HORIZON);
      ctx.lineTo(moonX + moonR * 2, moonY + moonR);
      ctx.closePath();
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();

      // Inner bright halo ring
      const innerHalo = ctx.createRadialGradient(moonX, moonY, moonR * 0.85, moonX, moonY, moonR * 3);
      innerHalo.addColorStop(0, "rgba(240, 245, 255, 0.3)");
      innerHalo.addColorStop(0.2, "rgba(230, 238, 252, 0.18)");
      innerHalo.addColorStop(0.5, "rgba(210, 225, 248, 0.08)");
      innerHalo.addColorStop(0.75, "rgba(195, 212, 242, 0.03)");
      innerHalo.addColorStop(1, "rgba(180, 200, 235, 0)");
      ctx.fillStyle = innerHalo;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR * 3, 0, Math.PI * 2);
      ctx.fill();

      // Secondary warm halo
      const warmHalo = ctx.createRadialGradient(moonX, moonY, moonR * 1.2, moonX, moonY, moonR * 4);
      warmHalo.addColorStop(0, "rgba(255, 245, 225, 0.06)");
      warmHalo.addColorStop(0.5, "rgba(255, 240, 215, 0.025)");
      warmHalo.addColorStop(1, "rgba(255, 235, 210, 0)");
      ctx.fillStyle = warmHalo;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR * 4, 0, Math.PI * 2);
      ctx.fill();

      // Subtle pulsing glow
      const moonPulse = Math.sin(time * 0.3) * 0.02 + 0.98;

      // Moon body — richer gradient with warm/cool tones
      const moonGrad = ctx.createRadialGradient(moonX - moonR * 0.35, moonY - moonR * 0.35, 0, moonX + moonR * 0.1, moonY + moonR * 0.1, moonR);
      moonGrad.addColorStop(0, `rgba(255, 254, 250, ${0.99 * moonPulse})`);
      moonGrad.addColorStop(0.2, `rgba(250, 248, 242, ${0.96 * moonPulse})`);
      moonGrad.addColorStop(0.45, `rgba(235, 238, 248, ${0.92 * moonPulse})`);
      moonGrad.addColorStop(0.65, `rgba(218, 225, 242, ${0.85 * moonPulse})`);
      moonGrad.addColorStop(0.85, `rgba(195, 208, 235, ${0.7 * moonPulse})`);
      moonGrad.addColorStop(1, `rgba(170, 190, 225, ${0.45 * moonPulse})`);
      ctx.fillStyle = moonGrad;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fill();

      // Subtle warm edge light (sunlit limb)
      ctx.save();
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.clip();
      const limbGrad = ctx.createLinearGradient(moonX - moonR, moonY - moonR, moonX + moonR, moonY + moonR);
      limbGrad.addColorStop(0, "rgba(255, 245, 220, 0.15)");
      limbGrad.addColorStop(0.5, "rgba(255, 240, 210, 0)");
      limbGrad.addColorStop(1, "rgba(200, 210, 240, 0.08)");
      ctx.fillStyle = limbGrad;
      ctx.fillRect(moonX - moonR, moonY - moonR, moonR * 2, moonR * 2);
      ctx.restore();

      // Moon craters — more detailed with depth
      ctx.save();
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.clip();
      const craters = [
        { ox: -0.2, oy: 0.18, r: 0.22, a: 0.07 },
        { ox: 0.28, oy: -0.12, r: 0.16, a: 0.06 },
        { ox: -0.06, oy: -0.32, r: 0.11, a: 0.05 },
        { ox: 0.32, oy: 0.32, r: 0.18, a: 0.06 },
        { ox: -0.38, oy: -0.06, r: 0.13, a: 0.05 },
        { ox: 0.1, oy: 0.42, r: 0.1, a: 0.04 },
        { ox: -0.3, oy: 0.35, r: 0.08, a: 0.035 },
        { ox: 0.4, oy: 0.05, r: 0.07, a: 0.03 },
        { ox: -0.15, oy: -0.15, r: 0.06, a: 0.025 },
        { ox: 0.15, oy: 0.15, r: 0.09, a: 0.04 },
      ];
      craters.forEach((c) => {
        const cx = moonX + c.ox * moonR;
        const cy = moonY + c.oy * moonR;
        const cr = c.r * moonR;
        // Crater shadow (depth)
        const crGrad = ctx.createRadialGradient(cx - cr * 0.2, cy - cr * 0.2, 0, cx, cy, cr);
        crGrad.addColorStop(0, `rgba(155, 170, 200, ${c.a * 0.5})`);
        crGrad.addColorStop(0.6, `rgba(165, 180, 205, ${c.a})`);
        crGrad.addColorStop(1, `rgba(180, 192, 215, ${c.a * 0.3})`);
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.fillStyle = crGrad;
        ctx.fill();
        // Crater rim highlight
        ctx.beginPath();
        ctx.arc(cx, cy, cr, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(220, 230, 245, ${c.a * 0.6})`;
        ctx.lineWidth = 0.4;
        ctx.stroke();
      });

      // Mare (dark patches) — lunar seas
      const mares = [
        { ox: -0.1, oy: 0.05, rx: 0.35, ry: 0.25, rot: 0.3, a: 0.03 },
        { ox: 0.15, oy: -0.15, rx: 0.2, ry: 0.3, rot: -0.4, a: 0.025 },
        { ox: -0.25, oy: -0.2, rx: 0.18, ry: 0.15, rot: 0.6, a: 0.02 },
      ];
      mares.forEach((m) => {
        ctx.beginPath();
        ctx.ellipse(moonX + m.ox * moonR, moonY + m.oy * moonR, m.rx * moonR, m.ry * moonR, m.rot, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(160, 175, 200, ${m.a})`;
        ctx.fill();
      });

      ctx.restore();

      // Bright specular highlight
      const specGrad = ctx.createRadialGradient(moonX - moonR * 0.3, moonY - moonR * 0.35, 0, moonX - moonR * 0.15, moonY - moonR * 0.15, moonR * 0.55);
      specGrad.addColorStop(0, "rgba(255, 255, 255, 0.5)");
      specGrad.addColorStop(0.3, "rgba(255, 255, 255, 0.2)");
      specGrad.addColorStop(0.6, "rgba(255, 255, 255, 0.06)");
      specGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = specGrad;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fill();

      // Thin bright edge (limb brightening)
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(230, 240, 255, 0.2)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // God rays — prominent light beams
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      for (let i = 0; i < 12; i++) {
        const rayAngle = (i / 12) * Math.PI * 2 + time * 0.04;
        const rayLen = moonR * (5 + Math.sin(time * 0.4 + i * 1.5) * 2);
        const rayW = moonR * 0.18;
        const rayAlpha = 0.025 + Math.sin(time * 0.6 + i * 0.8) * 0.012;
        const ex = moonX + Math.cos(rayAngle) * rayLen;
        const ey = moonY + Math.sin(rayAngle) * rayLen;
        const rayGrad = ctx.createLinearGradient(moonX, moonY, ex, ey);
        rayGrad.addColorStop(0, `rgba(220, 230, 250, ${rayAlpha * 2})`);
        rayGrad.addColorStop(0.3, `rgba(200, 215, 240, ${rayAlpha})`);
        rayGrad.addColorStop(1, "rgba(180, 200, 230, 0)");
        ctx.beginPath();
        ctx.moveTo(moonX + Math.cos(rayAngle + rayW) * moonR, moonY + Math.sin(rayAngle + rayW) * moonR);
        ctx.lineTo(ex + Math.cos(rayAngle + Math.PI / 2) * rayW * 2, ey + Math.sin(rayAngle + Math.PI / 2) * rayW * 2);
        ctx.lineTo(ex - Math.cos(rayAngle + Math.PI / 2) * rayW * 2, ey - Math.sin(rayAngle + Math.PI / 2) * rayW * 2);
        ctx.lineTo(moonX + Math.cos(rayAngle - rayW) * moonR, moonY + Math.sin(rayAngle - rayW) * moonR);
        ctx.closePath();
        ctx.fillStyle = rayGrad;
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.restore();

      // ════════════════ STARS ════════════════
      stars.forEach((s) => {
        const flicker = Math.sin(t * s.speed + s.phase) * 0.5 + 0.5;
        const alpha = 0.15 + flicker * 0.65;
        const sx = s.x * w;
        const sy = s.y * h;
        const [cr, cg, cb] = s.color;

        // Star glow
        if (s.r > 0.8) {
          const sGlow = ctx.createRadialGradient(sx, sy, 0, sx, sy, s.r * 5);
          sGlow.addColorStop(0, `rgba(${cr}, ${cg}, ${cb}, ${alpha * 0.15})`);
          sGlow.addColorStop(1, `rgba(${cr}, ${cg}, ${cb}, 0)`);
          ctx.fillStyle = sGlow;
          ctx.beginPath();
          ctx.arc(sx, sy, s.r * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Star cross sparkle for bright stars
        if (s.r > 1) {
          const sparkLen = s.r * 4 * flicker;
          ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(sx - sparkLen, sy);
          ctx.lineTo(sx + sparkLen, sy);
          ctx.moveTo(sx, sy - sparkLen);
          ctx.lineTo(sx, sy + sparkLen);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(sx, sy, s.r * (0.8 + flicker * 0.2), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
        ctx.fill();
      });

      // ════════════════ SHOOTING STARS ════════════════
      shootTimer++;
      if (shootTimer > 300 + Math.random() * 500) {
        shootingStars.push({
          x: Math.random() * 0.6 + 0.1,
          y: Math.random() * 0.15 + 0.02,
          dx: 0.003 + Math.random() * 0.004,
          dy: 0.001 + Math.random() * 0.002,
          life: 1,
          decay: 0.012 + Math.random() * 0.008,
          len: 0.04 + Math.random() * 0.06,
        });
        shootTimer = 0;
      }
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        ss.x += ss.dx;
        ss.y += ss.dy;
        ss.life -= ss.decay;
        if (ss.life <= 0) { shootingStars.splice(i, 1); continue; }
        const sx = ss.x * w;
        const sy = ss.y * h;
        const tailX = (ss.x - ss.dx * ss.len / ss.decay * 3) * w;
        const tailY = (ss.y - ss.dy * ss.len / ss.decay * 3) * h;
        const ssGrad = ctx.createLinearGradient(tailX, tailY, sx, sy);
        ssGrad.addColorStop(0, `rgba(255, 255, 255, 0)`);
        ssGrad.addColorStop(0.7, `rgba(220, 235, 255, ${ss.life * 0.4})`);
        ssGrad.addColorStop(1, `rgba(255, 255, 255, ${ss.life * 0.9})`);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(sx, sy);
        ctx.strokeStyle = ssGrad;
        ctx.lineWidth = 1.5 * ss.life;
        ctx.stroke();
        // Head glow
        const headGlow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 6);
        headGlow.addColorStop(0, `rgba(255, 255, 255, ${ss.life * 0.8})`);
        headGlow.addColorStop(1, `rgba(200, 220, 255, 0)`);
        ctx.fillStyle = headGlow;
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      // ════════════════ CLOUDS ════════════════
      clouds.forEach((c) => {
        c.x += c.speed;
        if (c.x > 1.3) c.x = -c.w - 0.1;
        const cx = c.x * w;
        const cy = c.y * h;
        const cw = c.w * w;
        const ch = c.h * h;
        const pulse = 1 + Math.sin(time * 0.3 + c.x * 10) * 0.1;
        c.blobs.forEach((b) => {
          const bx = cx + b.ox * cw;
          const by = cy + b.oy * ch;
          const brx = b.rx * cw * 0.5 * pulse;
          const bry = b.ry * ch * pulse;
          const bGrad = ctx.createRadialGradient(bx, by, 0, bx, by, brx);
          bGrad.addColorStop(0, `rgba(80, 100, 140, ${c.opacity * 1.2})`);
          bGrad.addColorStop(0.5, `rgba(60, 80, 120, ${c.opacity * 0.6})`);
          bGrad.addColorStop(1, `rgba(40, 60, 100, 0)`);
          ctx.fillStyle = bGrad;
          ctx.beginPath();
          ctx.ellipse(bx, by, brx, bry, 0, 0, Math.PI * 2);
          ctx.fill();
        });
      });

      // Horizon warm glow
      const horizonGlow = ctx.createRadialGradient(w * 0.5, h * HORIZON, 0, w * 0.5, h * HORIZON, w * 0.55);
      horizonGlow.addColorStop(0, "rgba(90, 65, 110, 0.1)");
      horizonGlow.addColorStop(0.4, "rgba(60, 45, 80, 0.04)");
      horizonGlow.addColorStop(1, "rgba(30, 20, 50, 0)");
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, h * 0.2, w, h * 0.3);

      // ════════════════ MOUNTAINS ════════════════
      // Far range (snow-capped)
      ctx.beginPath();
      ctx.moveTo(0, h * HORIZON);
      for (let x = 0; x <= w; x += 2) {
        const nx = x / w;
        let y = h * HORIZON;
        y -= Math.sin(nx * Math.PI * 1.1 + 0.3) * h * 0.065;
        y -= Math.sin(nx * Math.PI * 2.6 + 1.5) * h * 0.028;
        y -= Math.sin(nx * Math.PI * 6.2 + 2.8) * h * 0.012;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h * HORIZON);
      ctx.closePath();
      ctx.fillStyle = "rgba(18, 25, 42, 0.95)";
      ctx.fill();

      // Snow highlight on peaks
      ctx.save();
      ctx.beginPath();
      for (let x = 0; x <= w; x += 2) {
        const nx = x / w;
        let y = h * HORIZON;
        y -= Math.sin(nx * Math.PI * 1.1 + 0.3) * h * 0.065;
        y -= Math.sin(nx * Math.PI * 2.6 + 1.5) * h * 0.028;
        y -= Math.sin(nx * Math.PI * 6.2 + 2.8) * h * 0.012;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      for (let x = w; x >= 0; x -= 2) {
        const nx = x / w;
        let y = h * HORIZON;
        y -= Math.sin(nx * Math.PI * 1.1 + 0.3) * h * 0.065;
        y -= Math.sin(nx * Math.PI * 2.6 + 1.5) * h * 0.028;
        y -= Math.sin(nx * Math.PI * 6.2 + 2.8) * h * 0.012;
        ctx.lineTo(x, y + h * 0.012);
      }
      ctx.closePath();
      ctx.clip();
      ctx.fillStyle = "rgba(160, 175, 200, 0.08)";
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Near range
      ctx.beginPath();
      ctx.moveTo(0, h * (HORIZON + 0.008));
      for (let x = 0; x <= w; x += 2) {
        const nx = x / w;
        let y = h * (HORIZON + 0.008);
        y -= Math.sin(nx * Math.PI * 1.7 + 0.8) * h * 0.04;
        y -= Math.sin(nx * Math.PI * 3.5 + 2.1) * h * 0.018;
        y -= Math.sin(nx * Math.PI * 8 + 4) * h * 0.006;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h * (HORIZON + 0.008));
      ctx.closePath();
      ctx.fillStyle = "rgba(12, 18, 32, 0.93)";
      ctx.fill();

      // ════════════════ TREELINE ════════════════
      const treeBaseY = h * (HORIZON + 0.006);
      ctx.fillStyle = "rgba(6, 12, 22, 0.95)";
      ctx.beginPath();
      ctx.moveTo(0, treeBaseY);
      for (let x = 0; x <= w; x += 2) {
        const nx = x / w;
        const noise =
          Math.sin(nx * 45) * 3 +
          Math.sin(nx * 72 + 1.2) * 2 +
          Math.sin(nx * 28 + 2.5) * 4 +
          Math.cos(nx * 110) * 1.5 +
          Math.sin(nx * 160 + 0.7) * 1;
        const baseH = 14 + Math.sin(nx * Math.PI * 2.2 + 0.5) * 7;
        ctx.lineTo(x, treeBaseY - (baseH + noise) * (h / 650));
      }
      ctx.lineTo(w, treeBaseY);
      ctx.closePath();
      ctx.fill();

      // ════════════════ GLOWING MUSHROOMS ════════════════
      mushrooms.forEach((m) => {
        const mx = m.x * w;
        const my = m.y * h;
        const pulse = Math.sin(t * m.pulseSpeed + m.phase) * 0.5 + 0.5;
        const glowAlpha = 0.08 + pulse * 0.12;

        // Glow
        const mGlow = ctx.createRadialGradient(mx, my, 0, mx, my, m.size * 5);
        mGlow.addColorStop(0, `hsla(${m.hue}, 70%, 55%, ${glowAlpha})`);
        mGlow.addColorStop(0.5, `hsla(${m.hue}, 60%, 45%, ${glowAlpha * 0.3})`);
        mGlow.addColorStop(1, `hsla(${m.hue}, 50%, 35%, 0)`);
        ctx.fillStyle = mGlow;
        ctx.beginPath();
        ctx.arc(mx, my, m.size * 5, 0, Math.PI * 2);
        ctx.fill();

        // Stem
        ctx.fillStyle = `rgba(60, 50, 40, ${0.6 + pulse * 0.2})`;
        ctx.fillRect(mx - 0.8, my, 1.6, m.size * 1.2);

        // Cap
        ctx.beginPath();
        ctx.ellipse(mx, my, m.size, m.size * 0.55, 0, Math.PI, 0);
        ctx.fillStyle = `hsla(${m.hue}, 60%, ${45 + pulse * 15}%, ${0.5 + pulse * 0.3})`;
        ctx.fill();
        // Cap spots
        ctx.beginPath();
        ctx.arc(mx - m.size * 0.3, my - m.size * 0.2, m.size * 0.12, 0, Math.PI * 2);
        ctx.arc(mx + m.size * 0.2, my - m.size * 0.3, m.size * 0.09, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${m.hue}, 80%, 75%, ${0.3 + pulse * 0.3})`;
        ctx.fill();
      });

      // ════════════════ BEAUTIFUL TREES ════════════════
      // Tree 1: Coconut palm — tall slim trunk with a crown of curved fronds
      const drawCoconutPalm = (cx, baseY, scale, swayPhase) => {
        const trunkH = scale * 1.3;
        const sway = Math.sin(time * 0.5 + swayPhase) * (scale * 0.04);
        const crownX = cx + sway;
        const crownY = baseY - trunkH;

        // trunk (curving slim silhouette)
        ctx.strokeStyle = "rgba(38, 24, 14, 0.95)";
        ctx.lineWidth = Math.max(1, scale * 0.06);
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(cx, baseY);
        ctx.quadraticCurveTo(cx - sway * 0.5, baseY - trunkH * 0.5, crownX, crownY);
        ctx.stroke();

        // palm rings on trunk
        ctx.strokeStyle = "rgba(15, 8, 4, 0.7)";
        ctx.lineWidth = 0.4;
        for (let r = 1; r < 11; r++) {
          const t = r / 11;
          const px = cx * (1 - t) * (1 - t) + 2 * (cx - sway * 0.5) * (1 - t) * t + crownX * t * t;
          const py = baseY * (1 - t) * (1 - t) + 2 * (baseY - trunkH * 0.5) * (1 - t) * t + crownY * t * t;
          ctx.beginPath();
          ctx.moveTo(px - scale * 0.035, py);
          ctx.lineTo(px + scale * 0.035, py);
          ctx.stroke();
        }

        // crown fronds — 8 curving leaves drooping outward
        const numFronds = 8;
        for (let f = 0; f < numFronds; f++) {
          const angle = Math.PI + (f / (numFronds - 1)) * Math.PI + Math.sin(f * 2.7) * 0.12;
          const length = scale * (0.6 + Math.sin(f * 1.7) * 0.1);
          const swayF = Math.sin(time * 0.7 + f * 0.5 + swayPhase) * 1.8;

          const droopFactor = Math.abs(Math.cos(angle)) * 0.25;
          const tipX = crownX + Math.cos(angle) * length + swayF;
          const tipY = crownY + Math.sin(angle) * length + length * droopFactor;
          const midX = crownX + Math.cos(angle) * length * 0.5;
          const midY = crownY + Math.sin(angle) * length * 0.4 - length * 0.05;

          // frond spine
          ctx.strokeStyle = "rgba(28, 52, 30, 0.95)";
          ctx.lineWidth = Math.max(0.8, scale * 0.025);
          ctx.beginPath();
          ctx.moveTo(crownX, crownY);
          ctx.quadraticCurveTo(midX, midY, tipX, tipY);
          ctx.stroke();

          // leaflets perpendicular to spine
          ctx.strokeStyle = "rgba(48, 80, 50, 0.82)";
          ctx.lineWidth = 0.55;
          for (let lf = 2; lf <= 7; lf++) {
            const t = lf / 8;
            const pX = crownX * (1 - t) * (1 - t) + 2 * midX * (1 - t) * t + tipX * t * t;
            const pY = crownY * (1 - t) * (1 - t) + 2 * midY * (1 - t) * t + tipY * t * t;
            const perpA = angle + Math.PI / 2;
            const leafL = scale * 0.07 * (1 - t * 0.4);
            ctx.beginPath();
            ctx.moveTo(pX, pY);
            ctx.lineTo(pX + Math.cos(perpA) * leafL, pY + Math.sin(perpA) * leafL * 0.6);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(pX, pY);
            ctx.lineTo(pX - Math.cos(perpA) * leafL, pY - Math.sin(perpA) * leafL * 0.6);
            ctx.stroke();
          }
        }

        // coconuts at crown
        ctx.fillStyle = "rgba(12, 6, 2, 0.92)";
        for (let c = 0; c < 4; c++) {
          const a = (c / 4) * Math.PI - Math.PI / 2;
          const offX = Math.cos(a) * scale * 0.05;
          const offY = Math.sin(a) * scale * 0.03 + scale * 0.045;
          ctx.beginPath();
          ctx.arc(crownX + offX, crownY + offY, scale * 0.04, 0, Math.PI * 2);
          ctx.fill();
        }

        // moonlight rim on upper-left fronds
        ctx.strokeStyle = "rgba(195, 220, 245, 0.32)";
        ctx.lineWidth = 0.9;
        for (let f = 0; f < 3; f++) {
          const angle = Math.PI + (f / (numFronds - 1)) * Math.PI;
          const length = scale * 0.55;
          ctx.beginPath();
          ctx.moveTo(crownX, crownY);
          ctx.quadraticCurveTo(
            crownX + Math.cos(angle) * length * 0.5,
            crownY + Math.sin(angle) * length * 0.4,
            crownX + Math.cos(angle) * length,
            crownY + Math.sin(angle) * length + length * Math.abs(Math.cos(angle)) * 0.2
          );
          ctx.stroke();
        }
      };

      // Tree 2: Broadleaf tree — stocky trunk with a cloud-shaped canopy
      const drawBroadTree = (cx, baseY, scale, swayPhase) => {
        const trunkH = scale * 0.45;
        const canopyR = scale * 0.55;
        const canopyY = baseY - trunkH - canopyR * 0.5;
        const sway = Math.sin(time * 0.4 + swayPhase) * (scale * 0.02);

        // trunk
        ctx.fillStyle = "rgba(32, 20, 11, 0.94)";
        ctx.beginPath();
        ctx.moveTo(cx - scale * 0.08, baseY);
        ctx.quadraticCurveTo(cx - scale * 0.045, baseY - trunkH * 0.5, cx - scale * 0.035, baseY - trunkH);
        ctx.lineTo(cx + scale * 0.035, baseY - trunkH);
        ctx.quadraticCurveTo(cx + scale * 0.045, baseY - trunkH * 0.5, cx + scale * 0.08, baseY);
        ctx.closePath();
        ctx.fill();

        // bark line
        ctx.strokeStyle = "rgba(15, 8, 4, 0.6)";
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(cx - scale * 0.02, baseY);
        ctx.quadraticCurveTo(cx, baseY - trunkH * 0.6, cx + scale * 0.01, baseY - trunkH);
        ctx.stroke();

        // canopy — cluster of overlapping puffs (cloud-shape silhouette)
        const puffs = [
          { dx: -0.38, dy: 0.12, r: 0.42 },
          { dx: 0.36, dy: 0.08, r: 0.46 },
          { dx: 0, dy: -0.32, r: 0.5 },
          { dx: -0.18, dy: -0.18, r: 0.38 },
          { dx: 0.22, dy: -0.22, r: 0.42 },
          { dx: -0.05, dy: 0.05, r: 0.4 },
        ];
        ctx.fillStyle = "rgba(30, 58, 34, 0.95)";
        ctx.beginPath();
        puffs.forEach(p => {
          const px = cx + p.dx * scale + sway;
          const py = canopyY + p.dy * scale;
          ctx.moveTo(px + p.r * scale, py);
          ctx.arc(px, py, p.r * scale, 0, Math.PI * 2);
        });
        ctx.fill();

        // moonlight highlight on top-left of canopy
        ctx.fillStyle = "rgba(195, 220, 245, 0.22)";
        ctx.beginPath();
        ctx.arc(cx - scale * 0.18 + sway, canopyY - scale * 0.32, scale * 0.22, 0, Math.PI * 2);
        ctx.arc(cx - scale * 0.36 + sway, canopyY - scale * 0.05, scale * 0.16, 0, Math.PI * 2);
        ctx.fill();

        // a few hint-of-leaf flecks on silhouette edge
        ctx.fillStyle = "rgba(58, 95, 52, 0.78)";
        for (let lf = 0; lf < 8; lf++) {
          const a = (lf / 8) * Math.PI * 2 + swayPhase;
          const r = scale * (0.55 + Math.sin(lf * 3.7) * 0.05);
          const lx = cx + Math.cos(a) * r + sway;
          const ly = canopyY + Math.sin(a) * r * 0.8;
          ctx.beginPath();
          ctx.ellipse(lx, ly, scale * 0.022, scale * 0.03, a, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      // Tree 3: Bo tree (Bodhi) — sacred Buddhist tree, big spreading canopy with aerial roots
      const drawBoTree = (cx, baseY, scale, swayPhase) => {
        const trunkH = scale * 0.8;
        const trunkW = scale * 0.13;
        const sway = Math.sin(time * 0.35 + swayPhase) * (scale * 0.02);

        // stout trunk
        ctx.fillStyle = "rgba(38, 24, 14, 0.95)";
        ctx.beginPath();
        ctx.moveTo(cx - trunkW * 0.75, baseY);
        ctx.quadraticCurveTo(cx - trunkW * 0.4, baseY - trunkH * 0.5, cx - trunkW * 0.32, baseY - trunkH);
        ctx.lineTo(cx + trunkW * 0.32, baseY - trunkH);
        ctx.quadraticCurveTo(cx + trunkW * 0.5, baseY - trunkH * 0.5, cx + trunkW * 0.75, baseY);
        ctx.closePath();
        ctx.fill();

        // bark texture lines
        ctx.strokeStyle = "rgba(70, 45, 25, 0.5)";
        ctx.lineWidth = 0.5;
        for (let b = 0; b < 3; b++) {
          const x0 = cx - trunkW * 0.5 + b * trunkW * 0.5;
          ctx.beginPath();
          ctx.moveTo(x0, baseY);
          ctx.quadraticCurveTo(x0 + (b - 1) * trunkW * 0.18, baseY - trunkH * 0.5, x0, baseY - trunkH);
          ctx.stroke();
        }

        // branches reaching up and out
        const branchTopY = baseY - trunkH;
        const branches = [
          { ang: -1.45, len: 0.32 },
          { ang: -0.85, len: 0.42 },
          { ang: -0.32, len: 0.38 },
          { ang: 0.32, len: 0.42 },
          { ang: 0.85, len: 0.38 },
          { ang: 1.45, len: 0.32 },
        ];
        ctx.strokeStyle = "rgba(38, 24, 14, 0.88)";
        ctx.lineCap = "round";
        branches.forEach(br => {
          const bx = cx + Math.cos(br.ang) * scale * br.len;
          const by = branchTopY + Math.sin(br.ang) * scale * br.len;
          ctx.lineWidth = scale * 0.038;
          ctx.beginPath();
          ctx.moveTo(cx, branchTopY);
          ctx.quadraticCurveTo(
            cx + Math.cos(br.ang) * scale * br.len * 0.55,
            branchTopY + Math.sin(br.ang) * scale * br.len * 0.55,
            bx, by
          );
          ctx.stroke();
        });

        // massive spreading canopy — dense cluster of cloud puffs
        const canopyY = branchTopY - scale * 0.2;
        const canopyPuffs = [
          { dx: -0.62, dy: 0.15, r: 0.4 },
          { dx: -0.42, dy: -0.25, r: 0.48 },
          { dx: -0.16, dy: -0.5, r: 0.46 },
          { dx: 0.16, dy: -0.5, r: 0.46 },
          { dx: 0.42, dy: -0.25, r: 0.48 },
          { dx: 0.62, dy: 0.15, r: 0.4 },
          { dx: -0.3, dy: 0.18, r: 0.38 },
          { dx: 0.3, dy: 0.18, r: 0.38 },
          { dx: 0, dy: -0.18, r: 0.5 },
        ];

        // outer dark layer
        ctx.fillStyle = "rgba(26, 54, 30, 0.95)";
        ctx.beginPath();
        canopyPuffs.forEach(p => {
          const px = cx + p.dx * scale + sway;
          const py = canopyY + p.dy * scale;
          ctx.moveTo(px + p.r * scale, py);
          ctx.arc(px, py, p.r * scale, 0, Math.PI * 2);
        });
        ctx.fill();

        // heart-shaped leaf flecks on the silhouette edge (Bo leaf signature)
        ctx.fillStyle = "rgba(70, 110, 65, 0.88)";
        for (let leaf = 0; leaf < 18; leaf++) {
          const a = (leaf / 18) * Math.PI * 2;
          const r = scale * (0.65 + Math.sin(leaf * 3.7) * 0.08);
          const lx = cx + Math.cos(a) * r + sway;
          const ly = canopyY + Math.sin(a) * r * 0.75;
          // heart-shape: 2 small circles + a triangle
          ctx.beginPath();
          ctx.arc(lx - scale * 0.012, ly - scale * 0.005, scale * 0.014, 0, Math.PI * 2);
          ctx.arc(lx + scale * 0.012, ly - scale * 0.005, scale * 0.014, 0, Math.PI * 2);
          ctx.moveTo(lx - scale * 0.022, ly);
          ctx.lineTo(lx + scale * 0.022, ly);
          ctx.lineTo(lx, ly + scale * 0.035);
          ctx.closePath();
          ctx.fill();
        }

        // moonlight highlight on top-left of canopy
        ctx.fillStyle = "rgba(200, 225, 250, 0.25)";
        ctx.beginPath();
        ctx.arc(cx - scale * 0.25 + sway, canopyY - scale * 0.4, scale * 0.3, 0, Math.PI * 2);
        ctx.arc(cx - scale * 0.5 + sway, canopyY - scale * 0.15, scale * 0.2, 0, Math.PI * 2);
        ctx.fill();

        // hanging aerial roots/vines (characteristic of Bo trees)
        ctx.strokeStyle = "rgba(40, 25, 14, 0.75)";
        ctx.lineWidth = 0.7;
        for (let v = 0; v < 5; v++) {
          const vx = cx + (v - 2) * scale * 0.22 + Math.sin(v * 1.7) * scale * 0.06;
          const vyStart = canopyY + scale * 0.32;
          const vyEnd = baseY - trunkH * (0.15 + (v % 2) * 0.35);
          const vWiggle = Math.sin(time * 0.6 + v + swayPhase) * 1.5;
          ctx.beginPath();
          ctx.moveTo(vx, vyStart);
          ctx.quadraticCurveTo(vx + vWiggle, (vyStart + vyEnd) / 2, vx + vWiggle * 0.4, vyEnd);
          ctx.stroke();
        }
      };

      // ── Tree placements (replacing where reeds used to be) ──
      // Trees drawn before houses so taller ones peek above rooflines naturally
      const hs = Math.min(w, h) * 0.04;
      const treeBase = treeBaseY + 1;

      // LEFT edge cluster
      drawCoconutPalm(w * -0.005, treeBase, hs * 1.6, 0.4);
      drawBroadTree(  w * 0.025,  treeBase, hs * 1.2, 1.1);
      drawCoconutPalm(w * 0.075,  treeBase, hs * 1.8, 2.3);
      drawBroadTree(  w * 0.125,  treeBase, hs * 1.0, 0.7);
      drawCoconutPalm(w * 0.185,  treeBase, hs * 1.5, 3.1);

      // Between left cluster and lotus (filler)
      drawBroadTree(  w * 0.38,   treeBase, hs * 1.1, 2.8);

      // RIGHT side — frame the dagoba and right cluster
      drawCoconutPalm(w * 0.555,  treeBase, hs * 1.4, 1.6);
      drawCoconutPalm(w * 0.66,   treeBase, hs * 1.5, 4.0);
      // Big Bo tree right beside the dagoba (sacred Buddhist association)
      drawBoTree(     w * 0.78,   treeBase, hs * 2.0, 1.3);
      drawCoconutPalm(w * 0.875,  treeBase, hs * 1.6, 0.9);
      drawBroadTree(  w * 0.97,   treeBase, hs * 1.2, 3.7);

      // ════════════════ VILLAGE ON MOUNTAIN ════════════════
      // Main house position (also anchor point for the main Vesak kuduwa below)
      const houseX = w * 0.155;
      const houseY = treeBaseY - h * 0.026;

      // ════════════════ Shared painting helpers ════════════════
      const computeWPulse = (phase) =>
        0.85 + Math.sin(time * 1.4 + phase) * 0.1 + Math.sin(time * 3.3 + phase * 1.3) * 0.04;

      const paintWallGlow = (cx, cy, s) => {
        const wallGlow = ctx.createRadialGradient(cx, cy - s * 0.25, 0, cx, cy + s * 0.1, s * 1.7);
        wallGlow.addColorStop(0, "rgba(255,170,80,0.25)");
        wallGlow.addColorStop(0.5, "rgba(255,140,60,0.1)");
        wallGlow.addColorStop(1, "rgba(255,120,50,0)");
        ctx.fillStyle = wallGlow;
        ctx.fillRect(cx - s * 0.85, cy - s * 0.15, s * 1.7, s * 0.9);
      };

      const paintWindow = (wx, wy, ww, wh, s, wPulse) => {
        const wGlow = ctx.createRadialGradient(wx, wy, 0, wx, wy, s * 1.1);
        wGlow.addColorStop(0, `rgba(255,210,120,${0.4 * wPulse})`);
        wGlow.addColorStop(0.4, `rgba(255,160,70,${0.18 * wPulse})`);
        wGlow.addColorStop(1, "rgba(255,130,50,0)");
        ctx.fillStyle = wGlow;
        ctx.beginPath();
        ctx.arc(wx, wy, s * 1.1, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#140702";
        ctx.fillRect(wx - ww / 2 - 1, wy - wh / 2 - 1, ww + 2, wh + 2);
        ctx.fillStyle = `rgba(255,235,160,${0.95 * wPulse})`;
        ctx.fillRect(wx - ww / 2, wy - wh / 2, ww, wh);
        ctx.strokeStyle = "rgba(40,20,10,0.9)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(wx, wy - wh / 2);
        ctx.lineTo(wx, wy + wh / 2);
        ctx.moveTo(wx - ww / 2, wy);
        ctx.lineTo(wx + ww / 2, wy);
        ctx.stroke();
      };

      const paintSmoke = (originX, originY, s, count, phase) => {
        for (let sm = 0; sm < count; sm++) {
          const sy = originY - s * 0.08 - sm * s * 0.18;
          const sx = originX + Math.sin(time * 0.4 + sm * 0.8 + phase) * (2.5 + sm * 2);
          const sr = s * (0.08 + sm * 0.05);
          const sAlpha = 0.22 - sm * 0.035;
          const smGrad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
          smGrad.addColorStop(0, `rgba(180,180,190,${sAlpha})`);
          smGrad.addColorStop(1, "rgba(180,180,190,0)");
          ctx.fillStyle = smGrad;
          ctx.beginPath();
          ctx.arc(sx, sy, sr, 0, Math.PI * 2);
          ctx.fill();
        }
      };

      const paintDoor = (cx, cy, s, wPulse) => {
        ctx.fillStyle = "#0c0502";
        ctx.fillRect(cx - s * 0.12, cy + s * 0.15, s * 0.24, s * 0.33);
        ctx.fillStyle = `rgba(255,180,80,${0.65 * wPulse})`;
        ctx.fillRect(cx - s * 0.11, cy + s * 0.46, s * 0.22, s * 0.02);
        ctx.fillRect(cx - s * 0.11, cy + s * 0.18, s * 0.015, s * 0.28);
      };

      // ════════════════ STYLE 1: Curved-roof traditional (Sri Lankan vernacular) ════════════════
      const drawHouse = (cx, cy, s, opts = {}) => {
        const {
          numWindows = 2, hasChimney = true, hasDoor = true,
          roofPitch = 0.58, roofOverhang = 0.85,
          phase = 0, smokeAmount = 5,
        } = opts;
        const wPulse = computeWPulse(phase);

        // ground shadow
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.beginPath();
        ctx.ellipse(cx, cy + s * 0.58, s * 1.15, s * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();

        // pila (verandah platform)
        ctx.fillStyle = "#1c120c";
        ctx.fillRect(cx - s * 0.68, cy + s * 0.48, s * 1.36, s * 0.1);
        ctx.fillStyle = "rgba(255,180,80,0.08)";
        ctx.fillRect(cx - s * 0.68, cy + s * 0.48, s * 1.36, s * 0.02);

        // clay wall
        ctx.fillStyle = "#38251a";
        ctx.fillRect(cx - s * 0.62, cy - s * 0.05, s * 1.24, s * 0.53);

        paintWallGlow(cx, cy, s);

        // wooden pillars
        ctx.fillStyle = "#140904";
        ctx.fillRect(cx - s * 0.62, cy - s * 0.05, s * 0.06, s * 0.53);
        ctx.fillRect(cx + s * 0.56, cy - s * 0.05, s * 0.06, s * 0.53);
        if (s > Math.min(w, h) * 0.025) {
          ctx.fillRect(cx - s * 0.25, cy - s * 0.05, s * 0.04, s * 0.53);
          ctx.fillRect(cx + s * 0.21, cy - s * 0.05, s * 0.04, s * 0.53);
        }

        // curved sweeping roof
        ctx.fillStyle = "#261005";
        ctx.beginPath();
        ctx.moveTo(cx - s * roofOverhang, cy - s * 0.02);
        ctx.quadraticCurveTo(cx - s * 0.4, cy - s * (roofPitch * 0.65), cx, cy - s * roofPitch);
        ctx.quadraticCurveTo(cx + s * 0.4, cy - s * (roofPitch * 0.65), cx + s * roofOverhang, cy - s * 0.02);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(230,130,60,0.6)";
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(cx - s * (roofOverhang + 0.02), cy - s * 0.02);
        ctx.quadraticCurveTo(cx - s * 0.4, cy - s * (roofPitch * 0.65), cx, cy - s * roofPitch);
        ctx.quadraticCurveTo(cx + s * 0.4, cy - s * (roofPitch * 0.65), cx + s * (roofOverhang + 0.02), cy - s * 0.02);
        ctx.stroke();

        // ridge cap
        ctx.fillStyle = "rgba(180, 80, 30, 0.4)";
        ctx.beginPath();
        ctx.arc(cx, cy - s * roofPitch, s * 0.06, Math.PI, 0);
        ctx.fill();

        // chimney + smoke
        if (hasChimney) {
          const cmyTop = cy - s * (roofPitch - 0.03);
          ctx.fillStyle = "#1a0f0a";
          ctx.fillRect(cx + s * 0.26, cmyTop, s * 0.14, s * 0.25);
          ctx.fillStyle = "#29170e";
          ctx.fillRect(cx + s * 0.24, cmyTop - s * 0.04, s * 0.18, s * 0.04);
          ctx.strokeStyle = "rgba(220,110,40,0.25)";
          ctx.lineWidth = 0.5;
          ctx.strokeRect(cx + s * 0.26, cmyTop, s * 0.14, s * 0.25);
          paintSmoke(cx + s * 0.33, cmyTop, s, smokeAmount, phase);
        }

        // windows
        if (numWindows >= 2) {
          paintWindow(cx - s * 0.38, cy + s * 0.15, s * 0.2, s * 0.28, s, wPulse);
          paintWindow(cx + s * 0.38, cy + s * 0.15, s * 0.2, s * 0.28, s, wPulse);
        } else if (numWindows === 1) {
          paintWindow(cx, cy + s * 0.15, s * 0.26, s * 0.3, s, wPulse);
        }

        if (hasDoor && s > Math.min(w, h) * 0.025) paintDoor(cx, cy, s, wPulse);
      };

      // ════════════════ STYLE 2: Steep thatched hut (small rural cottage) ════════════════
      const drawHouseSteep = (cx, cy, s, opts = {}) => {
        const { numWindows = 1, hasDoor = false, phase = 0 } = opts;
        const wPulse = computeWPulse(phase);

        // ground shadow
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.beginPath();
        ctx.ellipse(cx, cy + s * 0.58, s * 1.0, s * 0.14, 0, 0, Math.PI * 2);
        ctx.fill();

        // small pila
        ctx.fillStyle = "#1c120c";
        ctx.fillRect(cx - s * 0.55, cy + s * 0.48, s * 1.1, s * 0.1);

        // narrower, shorter wall
        ctx.fillStyle = "#3a2618";
        ctx.fillRect(cx - s * 0.45, cy + s * 0.13, s * 0.9, s * 0.35);

        // wall glow (smaller)
        const wallGlow = ctx.createRadialGradient(cx, cy + s * 0.22, 0, cx, cy + s * 0.22, s * 1.2);
        wallGlow.addColorStop(0, "rgba(255,170,80,0.22)");
        wallGlow.addColorStop(0.5, "rgba(255,140,60,0.09)");
        wallGlow.addColorStop(1, "rgba(255,120,50,0)");
        ctx.fillStyle = wallGlow;
        ctx.fillRect(cx - s * 0.65, cy, s * 1.3, s * 0.65);

        // corner posts
        ctx.fillStyle = "#140904";
        ctx.fillRect(cx - s * 0.45, cy + s * 0.13, s * 0.05, s * 0.35);
        ctx.fillRect(cx + s * 0.4, cy + s * 0.13, s * 0.05, s * 0.35);

        // very steep thatched roof — tall sharp triangle
        const peakY = cy - s * 0.78;
        ctx.fillStyle = "#3a2010";
        ctx.beginPath();
        ctx.moveTo(cx - s * 0.62, cy + s * 0.15);
        ctx.lineTo(cx, peakY);
        ctx.lineTo(cx + s * 0.62, cy + s * 0.15);
        ctx.closePath();
        ctx.fill();

        // radial thatch lines from peak to eaves
        ctx.strokeStyle = "rgba(140,80,40,0.55)";
        ctx.lineWidth = 0.4;
        for (let r = 1; r < 9; r++) {
          const xt = -s * 0.62 + (s * 1.24 * r / 9);
          ctx.beginPath();
          ctx.moveTo(cx, peakY);
          ctx.lineTo(cx + xt, cy + s * 0.15);
          ctx.stroke();
        }

        // horizontal thatch course lines
        ctx.strokeStyle = "rgba(100,60,25,0.65)";
        ctx.lineWidth = 0.55;
        for (let r = 0; r < 4; r++) {
          const tt = (r + 1) / 5;
          const yPos = (cy + s * 0.15) - (cy + s * 0.15 - peakY) * tt;
          const xRange = s * 0.62 * (1 - tt);
          ctx.beginPath();
          ctx.moveTo(cx - xRange, yPos);
          ctx.lineTo(cx + xRange, yPos);
          ctx.stroke();
        }

        // roof edge highlight
        ctx.strokeStyle = "rgba(220,120,55,0.5)";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(cx - s * 0.62, cy + s * 0.15);
        ctx.lineTo(cx, peakY);
        ctx.lineTo(cx + s * 0.62, cy + s * 0.15);
        ctx.stroke();

        // window (centered, single glow is what makes these little huts charming)
        if (numWindows >= 2) {
          paintWindow(cx - s * 0.22, cy + s * 0.27, s * 0.16, s * 0.18, s, wPulse);
          paintWindow(cx + s * 0.22, cy + s * 0.27, s * 0.16, s * 0.18, s, wPulse);
        } else {
          paintWindow(cx, cy + s * 0.27, s * 0.22, s * 0.22, s, wPulse);
        }

        if (hasDoor && s > Math.min(w, h) * 0.025) paintDoor(cx, cy, s, wPulse);
      };

      // ════════════════ STYLE 3: Two-story merchant house ════════════════
      const drawHouseTwoStory = (cx, cy, s, opts = {}) => {
        const { hasChimney = true, hasDoor = true, phase = 0, smokeAmount = 4 } = opts;
        const wPulse = computeWPulse(phase);

        // ground shadow (wider)
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.beginPath();
        ctx.ellipse(cx, cy + s * 0.58, s * 1.2, s * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();

        // pila
        ctx.fillStyle = "#1c120c";
        ctx.fillRect(cx - s * 0.62, cy + s * 0.48, s * 1.24, s * 0.1);

        // ground floor wall
        ctx.fillStyle = "#38251a";
        ctx.fillRect(cx - s * 0.56, cy + s * 0.05, s * 1.12, s * 0.43);

        // floor divider beam (visible separation between stories)
        ctx.fillStyle = "#0e0703";
        ctx.fillRect(cx - s * 0.58, cy + s * 0.02, s * 1.16, s * 0.05);

        // upper floor wall (slightly inset, lighter tone)
        ctx.fillStyle = "#3d281c";
        ctx.fillRect(cx - s * 0.52, cy - s * 0.5, s * 1.04, s * 0.55);

        // big wall glow covering both floors
        const wallGlow = ctx.createRadialGradient(cx, cy - s * 0.15, 0, cx, cy + s * 0.1, s * 2.1);
        wallGlow.addColorStop(0, "rgba(255,170,80,0.22)");
        wallGlow.addColorStop(0.5, "rgba(255,140,60,0.1)");
        wallGlow.addColorStop(1, "rgba(255,120,50,0)");
        ctx.fillStyle = wallGlow;
        ctx.fillRect(cx - s * 0.78, cy - s * 0.6, s * 1.56, s * 1.2);

        // pillars on both floors
        ctx.fillStyle = "#140904";
        ctx.fillRect(cx - s * 0.56, cy + s * 0.05, s * 0.05, s * 0.43);
        ctx.fillRect(cx + s * 0.51, cy + s * 0.05, s * 0.05, s * 0.43);
        ctx.fillRect(cx - s * 0.52, cy - s * 0.5, s * 0.04, s * 0.55);
        ctx.fillRect(cx + s * 0.48, cy - s * 0.5, s * 0.04, s * 0.55);

        // balcony railing on upper floor
        ctx.fillStyle = "#140904";
        ctx.fillRect(cx - s * 0.5, cy + s * 0.005, s * 1.0, s * 0.02);
        for (let bp = 0; bp <= 6; bp++) {
          ctx.fillRect(cx - s * 0.5 + (s * 1.0 * bp / 6) - s * 0.008, cy - s * 0.025, s * 0.016, s * 0.04);
        }

        // curved roof
        const roofBase = cy - s * 0.47;
        const roofPeakY = cy - s * 0.78;
        ctx.fillStyle = "#261005";
        ctx.beginPath();
        ctx.moveTo(cx - s * 0.72, roofBase);
        ctx.quadraticCurveTo(cx - s * 0.36, (roofPeakY * 0.7 + roofBase * 0.3), cx, roofPeakY);
        ctx.quadraticCurveTo(cx + s * 0.36, (roofPeakY * 0.7 + roofBase * 0.3), cx + s * 0.72, roofBase);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(230,130,60,0.6)";
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(cx - s * 0.74, roofBase);
        ctx.quadraticCurveTo(cx - s * 0.36, (roofPeakY * 0.7 + roofBase * 0.3), cx, roofPeakY);
        ctx.quadraticCurveTo(cx + s * 0.36, (roofPeakY * 0.7 + roofBase * 0.3), cx + s * 0.74, roofBase);
        ctx.stroke();
        ctx.fillStyle = "rgba(180, 80, 30, 0.4)";
        ctx.beginPath();
        ctx.arc(cx, roofPeakY, s * 0.06, Math.PI, 0);
        ctx.fill();

        // chimney
        if (hasChimney) {
          const cmyTop = cy - s * 0.62;
          ctx.fillStyle = "#1a0f0a";
          ctx.fillRect(cx + s * 0.22, cmyTop, s * 0.13, s * 0.22);
          ctx.fillStyle = "#29170e";
          ctx.fillRect(cx + s * 0.2, cmyTop - s * 0.03, s * 0.17, s * 0.04);
          paintSmoke(cx + s * 0.285, cmyTop, s, smokeAmount, phase);
        }

        // windows — upper row + lower row (4 total)
        paintWindow(cx - s * 0.28, cy - s * 0.24, s * 0.18, s * 0.26, s, wPulse);
        paintWindow(cx + s * 0.28, cy - s * 0.24, s * 0.18, s * 0.26, s, wPulse);
        paintWindow(cx - s * 0.36, cy + s * 0.25, s * 0.17, s * 0.22, s, wPulse);
        paintWindow(cx + s * 0.36, cy + s * 0.25, s * 0.17, s * 0.22, s, wPulse);

        // door (ground floor center)
        if (hasDoor) {
          ctx.fillStyle = "#0c0502";
          ctx.fillRect(cx - s * 0.1, cy + s * 0.18, s * 0.2, s * 0.3);
          ctx.fillStyle = `rgba(255,180,80,${0.65 * wPulse})`;
          ctx.fillRect(cx - s * 0.09, cy + s * 0.46, s * 0.18, s * 0.02);
          ctx.fillRect(cx - s * 0.09, cy + s * 0.2, s * 0.015, s * 0.26);
        }
      };

      // ════════════════ STYLE 4: L-shaped house with side wing ════════════════
      const drawHouseLShape = (cx, cy, s, opts = {}) => {
        const { hasChimney = true, hasDoor = true, phase = 0, smokeAmount = 4 } = opts;
        const wPulse = computeWPulse(phase);

        // ── Side wing (drawn first, behind main body, on the LEFT) ──
        const wingX = cx - s * 0.8;
        const wingY = cy + s * 0.12;
        const wingS = s * 0.55;

        // wing ground shadow
        ctx.fillStyle = "rgba(0,0,0,0.45)";
        ctx.beginPath();
        ctx.ellipse(wingX, wingY + wingS * 0.58, wingS * 1.05, wingS * 0.13, 0, 0, Math.PI * 2);
        ctx.fill();

        // wing pila
        ctx.fillStyle = "#1c120c";
        ctx.fillRect(wingX - wingS * 0.6, wingY + wingS * 0.48, wingS * 1.2, wingS * 0.09);

        // wing wall
        ctx.fillStyle = "#38251a";
        ctx.fillRect(wingX - wingS * 0.55, wingY - wingS * 0.05, wingS * 1.1, wingS * 0.53);

        // wing pillars
        ctx.fillStyle = "#140904";
        ctx.fillRect(wingX - wingS * 0.55, wingY - wingS * 0.05, wingS * 0.05, wingS * 0.53);
        ctx.fillRect(wingX + wingS * 0.5, wingY - wingS * 0.05, wingS * 0.05, wingS * 0.53);

        // wing curved roof
        ctx.fillStyle = "#261005";
        ctx.beginPath();
        ctx.moveTo(wingX - wingS * 0.75, wingY - wingS * 0.02);
        ctx.quadraticCurveTo(wingX - wingS * 0.35, wingY - wingS * 0.4, wingX, wingY - wingS * 0.5);
        ctx.quadraticCurveTo(wingX + wingS * 0.35, wingY - wingS * 0.4, wingX + wingS * 0.75, wingY - wingS * 0.02);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(230,130,60,0.55)";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(wingX - wingS * 0.77, wingY - wingS * 0.02);
        ctx.quadraticCurveTo(wingX - wingS * 0.35, wingY - wingS * 0.4, wingX, wingY - wingS * 0.5);
        ctx.quadraticCurveTo(wingX + wingS * 0.35, wingY - wingS * 0.4, wingX + wingS * 0.77, wingY - wingS * 0.02);
        ctx.stroke();

        // wing window
        paintWindow(wingX, wingY + wingS * 0.15, wingS * 0.24, wingS * 0.28, wingS, wPulse);

        // ── Main body (front, taller, anchored at cx, cy) ──
        // ground shadow
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.beginPath();
        ctx.ellipse(cx, cy + s * 0.58, s * 1.18, s * 0.15, 0, 0, Math.PI * 2);
        ctx.fill();

        // pila
        ctx.fillStyle = "#1c120c";
        ctx.fillRect(cx - s * 0.68, cy + s * 0.48, s * 1.36, s * 0.1);
        ctx.fillStyle = "rgba(255,180,80,0.08)";
        ctx.fillRect(cx - s * 0.68, cy + s * 0.48, s * 1.36, s * 0.02);

        // main wall
        ctx.fillStyle = "#38251a";
        ctx.fillRect(cx - s * 0.62, cy - s * 0.05, s * 1.24, s * 0.53);

        paintWallGlow(cx, cy, s);

        // pillars
        ctx.fillStyle = "#140904";
        ctx.fillRect(cx - s * 0.62, cy - s * 0.05, s * 0.06, s * 0.53);
        ctx.fillRect(cx + s * 0.56, cy - s * 0.05, s * 0.06, s * 0.53);
        ctx.fillRect(cx - s * 0.25, cy - s * 0.05, s * 0.04, s * 0.53);
        ctx.fillRect(cx + s * 0.21, cy - s * 0.05, s * 0.04, s * 0.53);

        // curved main roof
        const roofPitch = 0.62;
        const roofOverhang = 0.88;
        ctx.fillStyle = "#261005";
        ctx.beginPath();
        ctx.moveTo(cx - s * roofOverhang, cy - s * 0.02);
        ctx.quadraticCurveTo(cx - s * 0.4, cy - s * (roofPitch * 0.65), cx, cy - s * roofPitch);
        ctx.quadraticCurveTo(cx + s * 0.4, cy - s * (roofPitch * 0.65), cx + s * roofOverhang, cy - s * 0.02);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "rgba(230,130,60,0.6)";
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(cx - s * (roofOverhang + 0.02), cy - s * 0.02);
        ctx.quadraticCurveTo(cx - s * 0.4, cy - s * (roofPitch * 0.65), cx, cy - s * roofPitch);
        ctx.quadraticCurveTo(cx + s * 0.4, cy - s * (roofPitch * 0.65), cx + s * (roofOverhang + 0.02), cy - s * 0.02);
        ctx.stroke();
        ctx.fillStyle = "rgba(180, 80, 30, 0.4)";
        ctx.beginPath();
        ctx.arc(cx, cy - s * roofPitch, s * 0.06, Math.PI, 0);
        ctx.fill();

        // chimney on right side of main roof
        if (hasChimney) {
          const cmyTop = cy - s * (roofPitch - 0.03);
          ctx.fillStyle = "#1a0f0a";
          ctx.fillRect(cx + s * 0.26, cmyTop, s * 0.14, s * 0.25);
          ctx.fillStyle = "#29170e";
          ctx.fillRect(cx + s * 0.24, cmyTop - s * 0.04, s * 0.18, s * 0.04);
          paintSmoke(cx + s * 0.33, cmyTop, s, smokeAmount, phase);
        }

        // main body has 2 windows + door
        paintWindow(cx - s * 0.38, cy + s * 0.15, s * 0.2, s * 0.28, s, wPulse);
        paintWindow(cx + s * 0.38, cy + s * 0.15, s * 0.2, s * 0.28, s, wPulse);

        if (hasDoor) paintDoor(cx, cy, s, wPulse);
      };

      // ── Village houses — 4 distinct styles mixed across 8 homes ──
      // Left cluster
      drawHouseSteep(    w * 0.045, treeBaseY - h * 0.025, hs * 0.55, { numWindows: 1, phase: 0.6 });
      drawHouse(         w * 0.095, treeBaseY - h * 0.029, hs * 0.72, { numWindows: 2, hasChimney: true,  phase: 1.8, smokeAmount: 4, roofPitch: 0.55 });
      // Main house — anchor for the main Vesak kuduwa (stays curved style)
      drawHouse(         houseX,    houseY,                 hs,        { numWindows: 2, hasChimney: true,  phase: 0,   roofPitch: 0.58 });
      drawHouseTwoStory( w * 0.235, treeBaseY - h * 0.029, hs * 0.82, { hasChimney: true, phase: 2.4, smokeAmount: 4 });
      drawHouseSteep(    w * 0.32,  treeBaseY - h * 0.025, hs * 0.52, { numWindows: 1, phase: 3.1 });

      // Right cluster
      drawHouseLShape(   w * 0.6,   treeBaseY - h * 0.027, hs * 0.78, { hasChimney: true, phase: 1.2, smokeAmount: 4 });
      drawHouse(         w * 0.815, treeBaseY - h * 0.034, hs * 0.55, { numWindows: 1, hasChimney: false, phase: 4.2, roofPitch: 0.5 });
      drawHouseTwoStory( w * 0.93,  treeBaseY - h * 0.029, hs * 0.7,  { hasChimney: true, phase: 2.7, smokeAmount: 4 });

      // ════════════════ DAGOBA / STUPA (white Buddhist monument under the moon) ════════════════
      const drawDagoba = (cx, cy, s) => {
        // soft moonlight halo behind dagoba (it sits directly under the moon)
        const haloGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, s * 3.6);
        haloGrad.addColorStop(0, "rgba(230,240,255,0.32)");
        haloGrad.addColorStop(0.35, "rgba(210,225,250,0.14)");
        haloGrad.addColorStop(0.7, "rgba(190,215,250,0.05)");
        haloGrad.addColorStop(1, "rgba(180,210,250,0)");
        ctx.fillStyle = haloGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, s * 3.6, 0, Math.PI * 2);
        ctx.fill();

        // ground shadow
        ctx.fillStyle = "rgba(0,0,0,0.55)";
        ctx.beginPath();
        ctx.ellipse(cx, cy + s * 0.97, s * 1.35, s * 0.17, 0, 0, Math.PI * 2);
        ctx.fill();

        // stepped square base (kotuwa) — 3 tiers
        ctx.fillStyle = "#3a342a";
        ctx.fillRect(cx - s * 1.2, cy + s * 0.85, s * 2.4, s * 0.12);
        ctx.fillStyle = "#a8a298";
        ctx.fillRect(cx - s * 1.1, cy + s * 0.75, s * 2.2, s * 0.1);
        ctx.fillStyle = "#c0bbb0";
        ctx.fillRect(cx - s * 1.0, cy + s * 0.66, s * 2.0, s * 0.09);

        // red ring band at base of dome (traditional Sri Lankan stripe)
        ctx.fillStyle = "#b32d2d";
        ctx.fillRect(cx - s * 1.0, cy + s * 0.55, s * 2.0, s * 0.11);
        // thin gold trim
        ctx.fillStyle = "#d4a040";
        ctx.fillRect(cx - s * 1.0, cy + s * 0.64, s * 2.0, s * 0.018);

        // MAIN DOME (bell-shaped, white, moonlit)
        const domeGrad = ctx.createRadialGradient(cx - s * 0.4, cy - s * 0.2, 0, cx, cy + s * 0.25, s * 1.35);
        domeGrad.addColorStop(0, "#ffffff");
        domeGrad.addColorStop(0.3, "#f5f2ea");
        domeGrad.addColorStop(0.7, "#c4bfb4");
        domeGrad.addColorStop(1, "#807a70");
        ctx.fillStyle = domeGrad;
        ctx.beginPath();
        ctx.moveTo(cx - s * 1.0, cy + s * 0.55);
        ctx.bezierCurveTo(
          cx - s * 1.0, cy - s * 0.4,
          cx + s * 1.0, cy - s * 0.4,
          cx + s * 1.0, cy + s * 0.55
        );
        ctx.closePath();
        ctx.fill();
        // moon-rim highlight on dome
        ctx.strokeStyle = "rgba(255,255,255,0.55)";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.moveTo(cx - s * 0.95, cy + s * 0.5);
        ctx.bezierCurveTo(
          cx - s * 0.95, cy - s * 0.38,
          cx + s * 0.95, cy - s * 0.38,
          cx + s * 0.95, cy + s * 0.5
        );
        ctx.stroke();

        // Neck / transition cylinder from dome peak to harmika
        const domePeakY = cy - s * 0.24;
        ctx.fillStyle = "#b8b2a6";
        ctx.fillRect(cx - s * 0.20, domePeakY, s * 0.40, s * 0.06);
        ctx.fillStyle = "#a8a298";
        ctx.fillRect(cx - s * 0.16, domePeakY - s * 0.04, s * 0.32, s * 0.06);

        // HARMIKA (square chamber on top of dome)
        const harmikaY = domePeakY - s * 0.10;
        ctx.fillStyle = "#d4cfc4";
        ctx.fillRect(cx - s * 0.22, harmikaY, s * 0.44, s * 0.22);
        // top trim
        ctx.fillStyle = "#807a70";
        ctx.fillRect(cx - s * 0.24, harmikaY - s * 0.03, s * 0.48, s * 0.04);
        // bottom trim
        ctx.fillStyle = "#a8a298";
        ctx.fillRect(cx - s * 0.24, harmikaY + s * 0.19, s * 0.48, s * 0.04);
        // small golden dharmachakra detail
        ctx.fillStyle = "rgba(200,150,60,0.75)";
        ctx.beginPath();
        ctx.arc(cx, harmikaY + s * 0.11, s * 0.065, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "rgba(150,100,40,0.9)";
        ctx.beginPath();
        ctx.arc(cx, harmikaY + s * 0.11, s * 0.03, 0, Math.PI * 2);
        ctx.fill();

        // CHUDA MANIKYA (spire) — stacked stepped rings
        let spireY = harmikaY - s * 0.03;
        const numRings = 7;
        for (let r = 0; r < numRings; r++) {
          const t = r / numRings;
          const ringW = s * (0.34 - t * 0.28);
          const ringH = s * 0.04;
          spireY -= ringH * 0.85;
          const ringGrad = ctx.createLinearGradient(cx - ringW / 2, 0, cx + ringW / 2, 0);
          ringGrad.addColorStop(0, "#b8b2a6");
          ringGrad.addColorStop(0.5, "#ffffff");
          ringGrad.addColorStop(1, "#807a70");
          ctx.fillStyle = ringGrad;
          ctx.fillRect(cx - ringW / 2, spireY, ringW, ringH);
          ctx.strokeStyle = "rgba(60,55,45,0.4)";
          ctx.lineWidth = 0.3;
          ctx.strokeRect(cx - ringW / 2, spireY, ringW, ringH);
        }

        // top golden spike
        ctx.fillStyle = "#d4a040";
        ctx.beginPath();
        ctx.moveTo(cx - s * 0.025, spireY);
        ctx.lineTo(cx + s * 0.025, spireY);
        ctx.lineTo(cx, spireY - s * 0.28);
        ctx.closePath();
        ctx.fill();

        // golden crystal (chuda) with halo at the very top — pulsing
        const crystalPulse = 0.85 + Math.sin(time * 2) * 0.15;
        const cGlow = ctx.createRadialGradient(cx, spireY - s * 0.3, 0, cx, spireY - s * 0.3, s * 0.4);
        cGlow.addColorStop(0, `rgba(255,235,140,${0.95 * crystalPulse})`);
        cGlow.addColorStop(0.3, `rgba(255,210,90,${0.5 * crystalPulse})`);
        cGlow.addColorStop(0.7, `rgba(255,190,70,${0.18 * crystalPulse})`);
        cGlow.addColorStop(1, "rgba(255,180,60,0)");
        ctx.fillStyle = cGlow;
        ctx.beginPath();
        ctx.arc(cx, spireY - s * 0.3, s * 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff4b0";
        ctx.beginPath();
        ctx.arc(cx, spireY - s * 0.3, s * 0.06, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#ffd700";
        ctx.beginPath();
        ctx.arc(cx, spireY - s * 0.3, s * 0.035, 0, Math.PI * 2);
        ctx.fill();

        // small glowing oil lamps along the base steps (4 lamps)
        const lampPositions = [-0.85, -0.3, 0.3, 0.85];
        const lampY = cy + s * 0.78;
        lampPositions.forEach((lp, i) => {
          const lx = cx + lp * s;
          const lampPulse = 0.8 + Math.sin(time * 1.8 + i * 1.3) * 0.15 + Math.sin(time * 4.1 + i) * 0.05;
          // outer warm bloom
          const lGlow = ctx.createRadialGradient(lx, lampY, 0, lx, lampY, s * 0.35);
          lGlow.addColorStop(0, `rgba(255,200,110,${0.55 * lampPulse})`);
          lGlow.addColorStop(0.4, `rgba(255,160,70,${0.22 * lampPulse})`);
          lGlow.addColorStop(1, "rgba(255,140,60,0)");
          ctx.fillStyle = lGlow;
          ctx.beginPath();
          ctx.arc(lx, lampY, s * 0.35, 0, Math.PI * 2);
          ctx.fill();
          // little clay lamp base
          ctx.fillStyle = "#4a2818";
          ctx.beginPath();
          ctx.ellipse(lx, lampY + s * 0.025, s * 0.045, s * 0.015, 0, 0, Math.PI * 2);
          ctx.fill();
          // bright flame
          ctx.fillStyle = `rgba(255,235,160,${0.95 * lampPulse})`;
          ctx.beginPath();
          ctx.ellipse(lx, lampY - s * 0.005, s * 0.012, s * 0.025, 0, 0, Math.PI * 2);
          ctx.fill();
          // hot core
          ctx.fillStyle = `rgba(255,255,220,${0.9 * lampPulse})`;
          ctx.beginPath();
          ctx.ellipse(lx, lampY - s * 0.002, s * 0.006, s * 0.012, 0, 0, Math.PI * 2);
          ctx.fill();
        });
      };

      // Place dagoba directly below the moon, on the mountain
      drawDagoba(w * 0.715, treeBaseY - hs * 1.5 * 0.97, hs * 1.5);

      // ════════════════ VESAK KUDUWA DRAWING FUNCTION ════════════════
      const drawVesakKuduwa = (cx, cy, size, sw, gph) => {
        const sway = Math.sin(time * 0.55 + sw) * (size * 0.12);
        const rot = Math.sin(time * 0.4 + sw) * 0.06;
        const glow = 0.78 + Math.sin(time * 1.2 + gph) * 0.18 + Math.sin(time * 2.9 + gph) * 0.05;

        ctx.save();
        ctx.translate(cx + sway, cy);
        ctx.rotate(rot);

        // outer warm halo bloom
        const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 3.6);
        halo.addColorStop(0, `rgba(255,215,150,${0.24 * glow})`);
        halo.addColorStop(0.3, `rgba(255,170,90,${0.13 * glow})`);
        halo.addColorStop(0.7, `rgba(255,140,70,${0.04 * glow})`);
        halo.addColorStop(1, "rgba(255,120,60,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(0, 0, size * 3.6, 0, Math.PI * 2);
        ctx.fill();

        // top finial cap (wooden top knob)
        ctx.fillStyle = "#5d4037";
        ctx.beginPath();
        ctx.arc(0, -size * 1.04, Math.max(0.8, size * 0.09), 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "rgba(50,30,15,0.7)";
        ctx.lineWidth = 0.4;
        ctx.beginPath();
        ctx.moveTo(0, -size * 0.97);
        ctx.lineTo(0, -size);
        ctx.stroke();

        // panel geometry — hexagonal bipyramid (atapattam style)
        const eqW = size * 0.8;
        const eqInner = eqW * 0.34;
        const eqLeft = -eqW;
        const eqRight = eqW;
        const eqIL = -eqInner;
        const eqIR = eqInner;

        const topColors = [
          [231, 76, 90],    // crimson
          [255, 196, 60],   // golden yellow
          [110, 200, 240],  // sky blue
        ];
        const botColors = [
          [255, 130, 60],   // orange
          [110, 220, 130],  // emerald
          [200, 110, 220],  // violet
        ];

        const paintPanel = (p1, p2, p3, c, isUpper) => {
          const grad = ctx.createLinearGradient(0, isUpper ? -size : size, 0, 0);
          grad.addColorStop(0, `rgba(${Math.min(c[0]+70,255)},${Math.min(c[1]+70,255)},${Math.min(c[2]+70,255)},${0.95 * glow})`);
          grad.addColorStop(0.55, `rgba(${c[0]},${c[1]},${c[2]},${0.88 * glow})`);
          grad.addColorStop(1, `rgba(${Math.max(c[0]-40,0)},${Math.max(c[1]-40,0)},${Math.max(c[2]-40,0)},${0.78 * glow})`);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
          ctx.lineTo(p3[0], p3[1]);
          ctx.closePath();
          ctx.fill();
          // panel edge — bamboo frame outline
          ctx.strokeStyle = `rgba(50,28,14,${0.55 * glow + 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        };

        // top 3 panels (front view of bipyramid)
        paintPanel([eqLeft, 0], [eqIL, 0], [0, -size], topColors[0], true);
        paintPanel([eqIL, 0], [eqIR, 0], [0, -size], topColors[1], true);
        paintPanel([eqIR, 0], [eqRight, 0], [0, -size], topColors[2], true);
        // bottom 3 panels
        paintPanel([eqLeft, 0], [eqIL, 0], [0, size], botColors[0], false);
        paintPanel([eqIL, 0], [eqIR, 0], [0, size], botColors[1], false);
        paintPanel([eqIR, 0], [eqRight, 0], [0, size], botColors[2], false);

        // inner candle glow (light source inside)
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        const innerLight = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.95);
        innerLight.addColorStop(0, `rgba(255,250,220,${0.78 * glow})`);
        innerLight.addColorStop(0.5, `rgba(255,220,140,${0.35 * glow})`);
        innerLight.addColorStop(1, "rgba(255,200,100,0)");
        ctx.fillStyle = innerLight;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.95, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // bamboo frame — equator + spokes to corners
        ctx.strokeStyle = `rgba(60,32,15,0.65)`;
        ctx.lineWidth = 0.55;
        ctx.beginPath();
        ctx.moveTo(eqLeft, 0);
        ctx.lineTo(eqRight, 0);
        // spokes from top point
        ctx.moveTo(0, -size); ctx.lineTo(eqLeft, 0);
        ctx.moveTo(0, -size); ctx.lineTo(eqIL, 0);
        ctx.moveTo(0, -size); ctx.lineTo(eqIR, 0);
        ctx.moveTo(0, -size); ctx.lineTo(eqRight, 0);
        // spokes to bottom point
        ctx.moveTo(0, size); ctx.lineTo(eqLeft, 0);
        ctx.moveTo(0, size); ctx.lineTo(eqIL, 0);
        ctx.moveTo(0, size); ctx.lineTo(eqIR, 0);
        ctx.moveTo(0, size); ctx.lineTo(eqRight, 0);
        ctx.stroke();

        // specular highlight on a panel (tissue paper catching light)
        ctx.fillStyle = `rgba(255,255,255,${0.22 * glow})`;
        ctx.beginPath();
        ctx.moveTo(-eqW * 0.56, -size * 0.04);
        ctx.lineTo(-eqW * 0.36, -size * 0.16);
        ctx.lineTo(-eqW * 0.25, -size * 0.55);
        ctx.lineTo(-eqW * 0.45, -size * 0.3);
        ctx.closePath();
        ctx.fill();

        // colorful paper tassels hanging from the bottom point
        const tasselColors = [
          "#ff5252", "#ffd54f", "#66bb6a", "#42a5f5",
          "#ab47bc", "#ff7043", "#26c6da", "#ec407a",
        ];
        const tasselCount = Math.max(5, Math.round(size * 0.55));
        for (let ti = 0; ti < tasselCount; ti++) {
          const spread = size * 0.6;
          const tStartX = -spread / 2 + (ti / Math.max(1, tasselCount - 1)) * spread;
          const tStartY = size * 0.95;
          const tLen = size * (0.55 + ((ti * 7) % 5) * 0.13);
          const tWig = Math.sin(time * 1.6 + ti * 0.9 + sw * 1.3) * (1.2 + size * 0.05);
          const tEndX = tStartX + tWig;
          const tEndY = tStartY + tLen;

          ctx.strokeStyle = tasselColors[ti % tasselColors.length];
          ctx.lineWidth = Math.max(0.8, size * 0.08);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(tStartX, tStartY);
          ctx.quadraticCurveTo(tStartX + tWig * 0.4, tStartY + tLen * 0.55, tEndX, tEndY);
          ctx.stroke();

          // bright tip dot
          ctx.fillStyle = tasselColors[ti % tasselColors.length];
          ctx.beginPath();
          ctx.arc(tEndX, tEndY, Math.max(0.5, size * 0.05), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      };

      // ════════════════ VESAK KUDUWA STYLE 2: 6-pointed star (atapattam) ════════════════
      const drawVesakKuduStar = (cx, cy, size, sw, gph) => {
        const sway = Math.sin(time * 0.55 + sw) * (size * 0.12);
        const rot = Math.sin(time * 0.4 + sw) * 0.07;
        const glow = 0.78 + Math.sin(time * 1.2 + gph) * 0.18 + Math.sin(time * 2.9 + gph) * 0.05;

        ctx.save();
        ctx.translate(cx + sway, cy);
        ctx.rotate(rot);

        // outer halo
        const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 3.8);
        halo.addColorStop(0, `rgba(255,215,150,${0.25 * glow})`);
        halo.addColorStop(0.3, `rgba(255,170,90,${0.13 * glow})`);
        halo.addColorStop(0.7, `rgba(255,140,70,${0.04 * glow})`);
        halo.addColorStop(1, "rgba(255,120,60,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(0, 0, size * 3.8, 0, Math.PI * 2);
        ctx.fill();

        // hanging string + knob
        ctx.strokeStyle = "rgba(180,160,130,0.5)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -size * 1.6);
        ctx.lineTo(0, -size * 1.02);
        ctx.stroke();
        ctx.fillStyle = "#5d4037";
        ctx.beginPath();
        ctx.arc(0, -size * 1.04, Math.max(0.7, size * 0.08), 0, Math.PI * 2);
        ctx.fill();

        // 6 colored star points radiating from a hexagonal hub
        const starColors = [
          [231, 76, 90],   [255, 196, 60],  [110, 200, 240],
          [255, 130, 60],  [110, 220, 130], [200, 110, 220],
        ];
        const outerR = size;
        const innerR = size * 0.42;

        // points
        for (let i = 0; i < 6; i++) {
          const c = starColors[i];
          const aTip = (i * Math.PI) / 3 - Math.PI / 2;
          const aL = ((i - 0.5) * Math.PI) / 3 - Math.PI / 2;
          const aR = ((i + 0.5) * Math.PI) / 3 - Math.PI / 2;
          const xTip = Math.cos(aTip) * outerR;
          const yTip = Math.sin(aTip) * outerR;
          const xL = Math.cos(aL) * innerR;
          const yL = Math.sin(aL) * innerR;
          const xR = Math.cos(aR) * innerR;
          const yR = Math.sin(aR) * innerR;

          const pointGrad = ctx.createRadialGradient(0, 0, 0, xTip, yTip, outerR);
          pointGrad.addColorStop(0, `rgba(${Math.min(c[0]+70,255)},${Math.min(c[1]+70,255)},${Math.min(c[2]+70,255)},${0.95 * glow})`);
          pointGrad.addColorStop(0.6, `rgba(${c[0]},${c[1]},${c[2]},${0.88 * glow})`);
          pointGrad.addColorStop(1, `rgba(${Math.max(c[0]-40,0)},${Math.max(c[1]-40,0)},${Math.max(c[2]-40,0)},${0.72 * glow})`);
          ctx.fillStyle = pointGrad;
          ctx.beginPath();
          ctx.moveTo(xL, yL);
          ctx.lineTo(xTip, yTip);
          ctx.lineTo(xR, yR);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = `rgba(50,28,14,${0.5 * glow + 0.25})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }

        // hexagonal hub in the center (glowing)
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        const hubGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, innerR);
        hubGrad.addColorStop(0, `rgba(255,255,230,${0.8 * glow})`);
        hubGrad.addColorStop(0.6, `rgba(255,220,140,${0.4 * glow})`);
        hubGrad.addColorStop(1, "rgba(255,200,100,0)");
        ctx.fillStyle = hubGrad;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = ((i + 0.5) * Math.PI) / 3 - Math.PI / 2;
          const xv = Math.cos(a) * innerR;
          const yv = Math.sin(a) * innerR;
          if (i === 0) ctx.moveTo(xv, yv);
          else ctx.lineTo(xv, yv);
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // hub outline
        ctx.strokeStyle = `rgba(60,32,15,0.55)`;
        ctx.lineWidth = 0.55;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const a = ((i + 0.5) * Math.PI) / 3 - Math.PI / 2;
          const xv = Math.cos(a) * innerR;
          const yv = Math.sin(a) * innerR;
          if (i === 0) ctx.moveTo(xv, yv);
          else ctx.lineTo(xv, yv);
        }
        ctx.closePath();
        ctx.stroke();

        // bright center spark
        ctx.fillStyle = `rgba(255,250,210,${0.5 * glow})`;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.12, 0, Math.PI * 2);
        ctx.fill();

        // small tassels at the bottom
        const tasselColors = ["#ff5252", "#ffd54f", "#66bb6a", "#42a5f5", "#ab47bc", "#ff7043"];
        const tasselCount = Math.max(4, Math.round(size * 0.45));
        for (let ti = 0; ti < tasselCount; ti++) {
          const spread = size * 0.55;
          const tStartX = -spread / 2 + (ti / Math.max(1, tasselCount - 1)) * spread;
          const tStartY = size * 0.75;
          const tLen = size * (0.4 + ((ti * 7) % 5) * 0.12);
          const tWig = Math.sin(time * 1.6 + ti * 0.9 + sw * 1.3) * (1.2 + size * 0.05);
          const tEndX = tStartX + tWig;
          const tEndY = tStartY + tLen;
          ctx.strokeStyle = tasselColors[ti % tasselColors.length];
          ctx.lineWidth = Math.max(0.7, size * 0.07);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(tStartX, tStartY);
          ctx.quadraticCurveTo(tStartX + tWig * 0.4, tStartY + tLen * 0.55, tEndX, tEndY);
          ctx.stroke();
          ctx.fillStyle = tasselColors[ti % tasselColors.length];
          ctx.beginPath();
          ctx.arc(tEndX, tEndY, Math.max(0.5, size * 0.05), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      };

      // ════════════════ VESAK KUDUWA STYLE 3: round paper-ball lantern ════════════════
      const drawVesakKuduSphere = (cx, cy, size, sw, gph) => {
        const sway = Math.sin(time * 0.55 + sw) * (size * 0.12);
        const rot = Math.sin(time * 0.4 + sw) * 0.05;
        const glow = 0.78 + Math.sin(time * 1.2 + gph) * 0.18 + Math.sin(time * 2.9 + gph) * 0.05;

        ctx.save();
        ctx.translate(cx + sway, cy);
        ctx.rotate(rot);

        // outer halo
        const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 3.6);
        halo.addColorStop(0, `rgba(255,215,150,${0.24 * glow})`);
        halo.addColorStop(0.3, `rgba(255,170,90,${0.13 * glow})`);
        halo.addColorStop(0.7, `rgba(255,140,70,${0.04 * glow})`);
        halo.addColorStop(1, "rgba(255,120,60,0)");
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(0, 0, size * 3.6, 0, Math.PI * 2);
        ctx.fill();

        // hanging string + top cap
        ctx.strokeStyle = "rgba(180,160,130,0.5)";
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, -size * 1.5);
        ctx.lineTo(0, -size * 0.92);
        ctx.stroke();
        ctx.fillStyle = "#5d4037";
        ctx.beginPath();
        ctx.ellipse(0, -size * 0.9, size * 0.13, size * 0.07, 0, 0, Math.PI * 2);
        ctx.fill();

        // sphere body — clip to circle then paint vertical color stripes
        ctx.save();
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.88, 0, Math.PI * 2);
        ctx.clip();

        const stripeColors = [
          [231, 76, 90],   [255, 130, 60],  [255, 196, 60],
          [110, 220, 130], [110, 200, 240], [200, 110, 220],
        ];
        const numStripes = 6;
        const stripeW = (size * 1.76) / numStripes;
        for (let i = 0; i < numStripes; i++) {
          const c = stripeColors[i];
          const x1 = -size * 0.88 + stripeW * i;
          // vertical gradient adds rounded 3D feel
          const sgrad = ctx.createLinearGradient(0, -size, 0, size);
          sgrad.addColorStop(0, `rgba(${Math.max(c[0]-40,0)},${Math.max(c[1]-40,0)},${Math.max(c[2]-40,0)},${0.85 * glow})`);
          sgrad.addColorStop(0.5, `rgba(${Math.min(c[0]+40,255)},${Math.min(c[1]+40,255)},${Math.min(c[2]+40,255)},${0.95 * glow})`);
          sgrad.addColorStop(1, `rgba(${Math.max(c[0]-40,0)},${Math.max(c[1]-40,0)},${Math.max(c[2]-40,0)},${0.85 * glow})`);
          ctx.fillStyle = sgrad;
          ctx.fillRect(x1, -size, stripeW, size * 2);
          // paper-segment divider line
          ctx.strokeStyle = `rgba(50,30,15,${0.45 * glow + 0.2})`;
          ctx.lineWidth = 0.4;
          ctx.beginPath();
          ctx.moveTo(x1 + stripeW, -size);
          ctx.lineTo(x1 + stripeW, size);
          ctx.stroke();
        }
        ctx.restore();

        // inner candle glow
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        const innerLight = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.75);
        innerLight.addColorStop(0, `rgba(255,250,220,${0.55 * glow})`);
        innerLight.addColorStop(0.6, `rgba(255,220,140,${0.22 * glow})`);
        innerLight.addColorStop(1, "rgba(255,200,100,0)");
        ctx.fillStyle = innerLight;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.75, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // sphere outline edge
        ctx.strokeStyle = "rgba(50,30,15,0.7)";
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.88, 0, Math.PI * 2);
        ctx.stroke();

        // upper-left specular highlight
        ctx.fillStyle = `rgba(255,255,255,${0.22 * glow})`;
        ctx.beginPath();
        ctx.ellipse(-size * 0.32, -size * 0.35, size * 0.18, size * 0.22, -0.5, 0, Math.PI * 2);
        ctx.fill();

        // bottom cap (small dark ellipse where tassels attach)
        ctx.fillStyle = "#5d4037";
        ctx.beginPath();
        ctx.ellipse(0, size * 0.9, size * 0.13, size * 0.07, 0, 0, Math.PI * 2);
        ctx.fill();

        // tassels
        const tasselColors = ["#ff5252", "#ffd54f", "#66bb6a", "#42a5f5", "#ab47bc", "#ff7043", "#26c6da"];
        const tasselCount = Math.max(5, Math.round(size * 0.5));
        for (let ti = 0; ti < tasselCount; ti++) {
          const spread = size * 0.5;
          const tStartX = -spread / 2 + (ti / Math.max(1, tasselCount - 1)) * spread;
          const tStartY = size * 0.96;
          const tLen = size * (0.5 + ((ti * 7) % 5) * 0.13);
          const tWig = Math.sin(time * 1.6 + ti * 0.9 + sw * 1.3) * (1.2 + size * 0.05);
          const tEndX = tStartX + tWig;
          const tEndY = tStartY + tLen;
          ctx.strokeStyle = tasselColors[ti % tasselColors.length];
          ctx.lineWidth = Math.max(0.7, size * 0.07);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(tStartX, tStartY);
          ctx.quadraticCurveTo(tStartX + tWig * 0.4, tStartY + tLen * 0.55, tEndX, tEndY);
          ctx.stroke();
          ctx.fillStyle = tasselColors[ti % tasselColors.length];
          ctx.beginPath();
          ctx.arc(tEndX, tEndY, Math.max(0.5, size * 0.05), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      };

      // ════════════════ VESAK KUDUWA GARLAND STRING ════════════════
      // Sagging string across the sky between two points
      const garlandLeftX = w * 0.27;
      const garlandRightX = w * 0.7;
      const garlandTopY = h * 0.31;
      const garlandSag = h * 0.04;
      ctx.strokeStyle = "rgba(190,170,130,0.45)";
      ctx.lineWidth = 0.55;
      ctx.beginPath();
      ctx.moveTo(garlandLeftX, garlandTopY);
      ctx.quadraticCurveTo(
        (garlandLeftX + garlandRightX) / 2,
        garlandTopY + garlandSag,
        garlandRightX,
        garlandTopY
      );
      ctx.stroke();
      // little colored twinkle dots between kudus
      for (let g = 0; g < 14; g++) {
        const tt = g / 13;
        const gx = garlandLeftX * (1 - tt) + garlandRightX * tt;
        const gy = garlandTopY + 4 * garlandSag * tt * (1 - tt);
        const gPulse = Math.sin(time * 3 + g * 0.7) * 0.5 + 0.5;
        const hue = (g * 55) % 360;
        ctx.fillStyle = `hsla(${hue}, 90%, 70%, ${0.5 + gPulse * 0.4})`;
        ctx.beginPath();
        ctx.arc(gx, gy, 0.9 + gPulse * 0.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // ════════════════ DRAW ALL VESAK KUDUS ════════════════
      // String from house eaves down to the main kuduwa
      ctx.strokeStyle = "rgba(180,160,130,0.6)";
      ctx.lineWidth = 0.55;
      ctx.beginPath();
      ctx.moveTo(houseX + hs * 0.62, houseY - hs * 0.18);
      ctx.lineTo(houseX + hs * 0.92, houseY + hs * 0.12);
      ctx.stroke();

      // 1) Main kuduwa hanging from house eaves
      drawVesakKuduwa(houseX + hs * 1.05, houseY + hs * 0.6, hs * 0.55, 0.5, 1.2);

      // 2) Garland of small kudus along the sag curve — alternating styles for variety
      const garlandKudus = 5;
      const kuduStyles = [drawVesakKuduwa, drawVesakKuduStar, drawVesakKuduSphere, drawVesakKuduwa, drawVesakKuduStar];
      for (let g = 0; g < garlandKudus; g++) {
        const tt = (g + 1) / (garlandKudus + 1);
        const gx = garlandLeftX * (1 - tt) + garlandRightX * tt;
        const gy = garlandTopY + 4 * garlandSag * tt * (1 - tt) + h * 0.02;
        kuduStyles[g](gx, gy, h * 0.014, g * 1.1 + 0.4, g * 0.8 + 0.5);
      }

      // 3) Right-side standalone kuduwa hanging from a peak — sphere style
      const rkX = w * 0.86;
      const rkY = treeBaseY - h * 0.038;
      ctx.strokeStyle = "rgba(180,160,130,0.5)";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(rkX, treeBaseY - h * 0.075);
      ctx.lineTo(rkX, rkY - h * 0.022);
      ctx.stroke();
      drawVesakKuduSphere(rkX, rkY, h * 0.024, 4.0, 3.5);

      // 4) Pair of small kudus flanking the dagoba (star + sphere on either side)
      const dagobaCx = w * 0.715;
      const dagobaTop = treeBaseY - hs * 1.5 * 0.97 - hs * 1.5 * 1.0;
      drawVesakKuduStar(dagobaCx - hs * 1.85, dagobaTop + hs * 0.7, h * 0.02, 1.7, 2.2);
      drawVesakKuduSphere(dagobaCx + hs * 1.85, dagobaTop + hs * 0.7, h * 0.02, 2.9, 1.4);

      // ════════════════ WATER ════════════════
      const waterTop = h * HORIZON + 4;
      const waterGrad = ctx.createLinearGradient(0, waterTop, 0, h);
      waterGrad.addColorStop(0, "#12202e");
      waterGrad.addColorStop(0.1, "#0f1c28");
      waterGrad.addColorStop(0.3, "#0b1722");
      waterGrad.addColorStop(0.55, "#09131c");
      waterGrad.addColorStop(0.8, "#070f17");
      waterGrad.addColorStop(1, "#050c13");
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, waterTop, w, h - waterTop);

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, waterTop, w, h - waterTop);
      ctx.clip();

      // ── Mountain/treeline reflection ──
      ctx.save();
      ctx.globalAlpha = 0.08;
      ctx.translate(0, waterTop * 2);
      ctx.scale(1, -1);
      // Simplified reflected treeline
      ctx.fillStyle = "rgba(6, 12, 22, 1)";
      ctx.beginPath();
      ctx.moveTo(0, treeBaseY);
      for (let x = 0; x <= w; x += 4) {
        const nx = x / w;
        const noise = Math.sin(nx * 45) * 3 + Math.sin(nx * 28 + 2.5) * 4;
        const baseH = 14 + Math.sin(nx * Math.PI * 2.2 + 0.5) * 7;
        ctx.lineTo(x, treeBaseY - (baseH + noise) * (h / 650));
      }
      ctx.lineTo(w, treeBaseY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // ── Star reflections in water ──
      stars.forEach((s) => {
        if (s.r < 0.7) return;
        const flicker = Math.sin(t * s.speed + s.phase + 1) * 0.5 + 0.5;
        const alpha = (0.05 + flicker * 0.12);
        const sx = s.x * w;
        const reflY = waterTop + (s.y * h * 0.4) + Math.sin(time * 2 + s.x * 10) * 3;
        const stretch = 1 + Math.sin(time + s.x * 5) * 0.5;
        ctx.fillStyle = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${alpha})`;
        ctx.beginPath();
        ctx.ellipse(sx, reflY, s.r * 0.8, s.r * 2 * stretch, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // ── Moon reflection (enhanced) ──
      const reflX = moonX;
      const reflStartY = waterTop + 8;
      const reflLen = (h - waterTop) * 0.8;

      // Broad shimmer column
      const moonReflGlow = ctx.createRadialGradient(reflX, reflStartY + reflLen * 0.3, 0, reflX, reflStartY + reflLen * 0.3, w * 0.08);
      moonReflGlow.addColorStop(0, "rgba(180, 200, 235, 0.04)");
      moonReflGlow.addColorStop(1, "rgba(160, 185, 225, 0)");
      ctx.fillStyle = moonReflGlow;
      ctx.fillRect(0, waterTop, w, h - waterTop);

      // Shimmering broken segments
      for (let i = 0; i < 55; i++) {
        const progress = i / 55;
        const y = reflStartY + progress * reflLen;
        const waveX = Math.sin(time * 2.2 + progress * 7) * (4 + progress * 22);
        const waveX2 = Math.cos(time * 1.5 + progress * 5) * (3 + progress * 12);
        const waveX3 = Math.sin(time * 3.5 + progress * 12) * (1 + progress * 6);
        const segW = (4 + progress * 30) * (1 + Math.sin(time * 1.2 + progress * 9) * 0.35);
        const alpha = (1 - progress) * 0.14 * (0.6 + Math.sin(time * 3.5 + progress * 11) * 0.4);

        // Warm + cool reflection
        ctx.fillStyle = `rgba(210, 220, 245, ${alpha})`;
        ctx.fillRect(reflX + waveX + waveX2 + waveX3 - segW / 2, y, segW, reflLen / 55 + 1);
        ctx.fillStyle = `rgba(255, 245, 220, ${alpha * 0.3})`;
        ctx.fillRect(reflX + waveX + waveX2 - segW * 0.3, y, segW * 0.6, reflLen / 55 + 1);
      }

      // Bright spot near horizon
      const brightRefl = ctx.createRadialGradient(reflX, reflStartY + 12, 0, reflX, reflStartY + 12, moonR * 4);
      brightRefl.addColorStop(0, "rgba(230, 235, 250, 0.15)");
      brightRefl.addColorStop(0.4, "rgba(210, 220, 240, 0.06)");
      brightRefl.addColorStop(1, "rgba(190, 205, 230, 0)");
      ctx.fillStyle = brightRefl;
      ctx.beginPath();
      ctx.arc(reflX, reflStartY + 12, moonR * 4, 0, Math.PI * 2);
      ctx.fill();

      // ── Water wave lines ──
      for (let i = 0; i < 28; i++) {
        const progress = i / 28;
        const y = waterTop + 12 + progress * (h - waterTop - 15);
        const alpha = (0.02 + Math.sin(time * 0.7 + i * 0.6) * 0.01) * (1 - progress * 0.3);
        const waveScale = 1 + progress * 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x <= w; x += 6) {
          const wave1 = Math.sin(x * 0.003 + time * 0.7 + i * 0.45) * 2.2 * waveScale;
          const wave2 = Math.sin(x * 0.008 + time * 1.1 + i * 0.8) * 1.2 * waveScale;
          const wave3 = Math.cos(x * 0.0018 + time * 0.45 + i * 0.25) * 1.8 * waveScale;
          ctx.lineTo(x, y + wave1 + wave2 + wave3);
        }
        ctx.strokeStyle = `rgba(90, 155, 210, ${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      // ── Lily pads ──
      lilyPads.forEach((lp) => {
        lp.x += lp.drift;
        lp.sway += 0.005;
        if (lp.x < -0.05) lp.x = 1.05;
        if (lp.x > 1.05) lp.x = -0.05;
        const px = lp.x * w;
        const py = lp.y * h + Math.sin(time * 1.2 + lp.sway) * 1.5;
        const bob = Math.sin(time * 0.8 + lp.sway) * 3;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate((lp.rot * Math.PI) / 180);
        ctx.scale(1, 0.4);
        ctx.globalAlpha = lp.opacity;

        // Pad shape with notch
        ctx.beginPath();
        const notchRad = (lp.notch * Math.PI) / 180;
        const notchW = 0.25;
        ctx.arc(0, 0, lp.size, notchRad + notchW, notchRad + Math.PI * 2 - notchW);
        ctx.lineTo(0, 0);
        ctx.closePath();

        const padGrad = ctx.createRadialGradient(-lp.size * 0.2, -lp.size * 0.2, 0, 0, 0, lp.size);
        padGrad.addColorStop(0, "rgba(60, 120, 60, 0.8)");
        padGrad.addColorStop(0.5, "rgba(40, 100, 50, 0.7)");
        padGrad.addColorStop(1, "rgba(25, 75, 35, 0.6)");
        ctx.fillStyle = padGrad;
        ctx.fill();
        ctx.strokeStyle = "rgba(20, 60, 30, 0.4)";
        ctx.lineWidth = 0.6;
        ctx.stroke();

        // Veins
        for (let v = 0; v < 5; v++) {
          const va = notchRad + notchW + (v / 5) * (Math.PI * 2 - notchW * 2);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(va) * lp.size * 0.85, Math.sin(va) * lp.size * 0.85);
          ctx.strokeStyle = "rgba(30, 70, 35, 0.3)";
          ctx.lineWidth = 0.4;
          ctx.stroke();
        }

        ctx.globalAlpha = 1;
        ctx.restore();
      });

      // ── Ripples ──
      rippleTimer++;
      if (rippleTimer > 80 + Math.random() * 140) {
        ripples.push({
          x: w * 0.08 + Math.random() * w * 0.84,
          y: waterTop + 25 + Math.random() * (h - waterTop - 50),
          r: 0,
          maxR: 35 + Math.random() * 90,
          alpha: 0.08 + Math.random() * 0.08,
          speed: 0.2 + Math.random() * 0.35,
        });
        rippleTimer = 0;
      }
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rp = ripples[i];
        rp.r += rp.speed;
        const life = 1 - rp.r / rp.maxR;
        if (life <= 0) { ripples.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.ellipse(rp.x, rp.y, rp.r, rp.r * 0.22, 0, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(120, 175, 215, ${rp.alpha * life})`;
        ctx.lineWidth = 0.9 * life;
        ctx.stroke();
        if (rp.r > 12) {
          ctx.beginPath();
          ctx.ellipse(rp.x, rp.y, rp.r * 0.6, rp.r * 0.14, 0, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(120, 175, 215, ${rp.alpha * life * 0.35})`;
          ctx.lineWidth = 0.6 * life;
          ctx.stroke();
        }
      }

      // ── Fish jump splashes ──
      fishTimer++;
      if (fishTimer > 400 + Math.random() * 700) {
        const fx = w * 0.15 + Math.random() * w * 0.7;
        const fy = waterTop + 40 + Math.random() * (h - waterTop - 100);
        fishSplashes.push({ x: fx, y: fy, t: 0, maxT: 60 });
        // Add ripples from fish
        for (let r = 0; r < 3; r++) {
          ripples.push({
            x: fx, y: fy, r: r * 5, maxR: 50 + r * 25,
            alpha: 0.12 - r * 0.03, speed: 0.4 + r * 0.1,
          });
        }
        fishTimer = 0;
      }
      for (let i = fishSplashes.length - 1; i >= 0; i--) {
        const fs = fishSplashes[i];
        fs.t++;
        if (fs.t > fs.maxT) { fishSplashes.splice(i, 1); continue; }
        const progress = fs.t / fs.maxT;
        const alpha = (1 - progress) * 0.6;
        // Splash droplets
        for (let d = 0; d < 5; d++) {
          const angle = -Math.PI * 0.2 + (d / 4) * Math.PI * 0.4 - Math.PI / 2;
          const dist = progress * 20 * (1 + d * 0.3);
          const dropX = fs.x + Math.cos(angle) * dist;
          const dropY = fs.y + Math.sin(angle) * dist + progress * progress * 15;
          const dropR = (1.2 - progress * 0.8) * (0.6 + d * 0.15);
          ctx.beginPath();
          ctx.arc(dropX, dropY, dropR, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(150, 200, 235, ${alpha * 0.5})`;
          ctx.fill();
        }
      }

      // ── Floating petals ──
      petals.forEach((p) => {
        p.x += p.drift + Math.sin(time + p.sway) * 0.000025;
        p.sway += 0.007;
        if (p.x < -0.03) p.x = 1.03;
        if (p.x > 1.03) p.x = -0.03;
        const px = p.x * w;
        const py = p.y * h + Math.sin(time * 1.4 + p.sway) * 2;
        const bobRot = Math.sin(time * 0.9 + p.sway) * 18;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate((bobRot * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.75, -p.size * 0.35, p.size * 0.55, p.size * 0.55, 0, p.size * 0.65);
        ctx.bezierCurveTo(-p.size * 0.55, p.size * 0.55, -p.size * 0.75, -p.size * 0.35, 0, -p.size);
        ctx.fillStyle = `hsla(${p.hue}, 55%, 70%, 0.75)`;
        ctx.fill();
        // Petal highlight
        ctx.beginPath();
        ctx.ellipse(-p.size * 0.15, -p.size * 0.3, p.size * 0.25, p.size * 0.15, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, 0.2)`;
        ctx.fill();
        // Water reflection
        ctx.globalAlpha = p.opacity * 0.25;
        ctx.beginPath();
        ctx.ellipse(0, p.size * 1.1, p.size * 0.55, p.size * 0.12, 0, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 35%, 60%, 0.5)`;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
      });

      ctx.restore(); // End water clip

      // ════════════════ FIREFLIES ════════════════
      fireflies.forEach((f) => {
        f.x += f.dx + Math.sin(t * 0.006 + f.phase) * 0.0001;
        f.y += f.dy + Math.cos(t * 0.004 + f.phase) * 0.00006;
        f.phase += f.speed;
        if (f.x < -0.04) f.x = 1.04;
        if (f.x > 1.04) f.x = -0.04;
        if (f.y < 0.33) f.dy = Math.abs(f.dy);
        if (f.y > 0.68) f.dy = -Math.abs(f.dy);

        const pulse = Math.sin(f.phase) * 0.5 + 0.5;
        const fx = f.x * w;
        const fy = f.y * h;
        const glowR = f.r * (5 + pulse * 7);

        const fGrad = ctx.createRadialGradient(fx, fy, 0, fx, fy, glowR);
        const alpha = 0.08 + pulse * 0.35;
        fGrad.addColorStop(0, `hsla(${f.hue}, 80%, 72%, ${alpha})`);
        fGrad.addColorStop(0.35, `hsla(${f.hue}, 70%, 60%, ${alpha * 0.3})`);
        fGrad.addColorStop(1, `hsla(${f.hue}, 60%, 50%, 0)`);
        ctx.fillStyle = fGrad;
        ctx.beginPath();
        ctx.arc(fx, fy, glowR, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(fx, fy, f.r * (0.45 + pulse * 0.55), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${f.hue}, 90%, 85%, ${0.35 + pulse * 0.65})`;
        ctx.fill();

        // Firefly reflection on water
        if (f.y > HORIZON - 0.05 && f.y < HORIZON + 0.12) {
          const reflFY = waterTop + (fy - waterTop) * 0.3 + 10;
          const reflAlpha = alpha * 0.2 * pulse;
          ctx.beginPath();
          ctx.ellipse(fx, reflFY, f.r * 2, f.r * 0.5, 0, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${f.hue}, 70%, 65%, ${reflAlpha})`;
          ctx.fill();
        }
      });

      // ════════════════ AMBIENT PARTICLES ════════════════
      particles.forEach((p) => {
        p.x += p.dx + Math.sin(t * 0.003 + p.phase) * 0.00003;
        p.y += p.dy;
        p.phase += 0.005;
        if (p.y > 0.65) { p.y = -0.02; p.x = Math.random(); }
        if (p.x < -0.02) p.x = 1.02;
        if (p.x > 1.02) p.x = -0.02;

        const px = p.x * w;
        const py = p.y * h;
        const twinkle = Math.sin(t * 0.02 + p.phase) * 0.5 + 0.5;

        ctx.beginPath();
        ctx.arc(px, py, p.r * (0.8 + twinkle * 0.2), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 215, 235, ${p.opacity * (0.5 + twinkle * 0.5)})`;
        ctx.fill();
      });

      // ════════════════ MIST LAYERS ════════════════
      for (let i = 0; i < 5; i++) {
        const mistY = waterTop - 15 + i * 14;
        const mistShift = Math.sin(time * 0.35 + i * 1.8) * 40;
        const mistShift2 = Math.cos(time * 0.2 + i * 0.7) * 20;
        const mistGrad = ctx.createLinearGradient(0, mistY - 20, 0, mistY + 30);
        const mistAlpha = (0.035 - i * 0.005) * (0.8 + Math.sin(time * 0.4 + i) * 0.2);
        mistGrad.addColorStop(0, "rgba(25, 40, 60, 0)");
        mistGrad.addColorStop(0.35, `rgba(35, 55, 80, ${mistAlpha})`);
        mistGrad.addColorStop(0.55, `rgba(40, 60, 85, ${mistAlpha * 1.3})`);
        mistGrad.addColorStop(0.75, `rgba(35, 55, 80, ${mistAlpha})`);
        mistGrad.addColorStop(1, "rgba(25, 40, 60, 0)");
        ctx.save();
        ctx.translate(mistShift + mistShift2, 0);
        ctx.fillStyle = mistGrad;
        ctx.fillRect(-60, mistY - 20, w + 120, 50);
        ctx.restore();
      }

      // Low-lying fog on water
      for (let i = 0; i < 3; i++) {
        const fogY = waterTop + 20 + i * 40;
        const fogShift = Math.sin(time * 0.25 + i * 2.5) * 50;
        const fogGrad = ctx.createLinearGradient(0, fogY - 12, 0, fogY + 12);
        fogGrad.addColorStop(0, "rgba(20, 35, 55, 0)");
        fogGrad.addColorStop(0.5, `rgba(30, 48, 68, ${0.025 - i * 0.006})`);
        fogGrad.addColorStop(1, "rgba(20, 35, 55, 0)");
        ctx.save();
        ctx.translate(fogShift, 0);
        ctx.fillStyle = fogGrad;
        ctx.fillRect(-80, fogY - 12, w + 160, 24);
        ctx.restore();
      }

      // ════════════════ VIGNETTE ════════════════
      const vigR = ctx.createRadialGradient(w * 0.5, h * 0.45, w * 0.2, w * 0.5, h * 0.45, w * 0.85);
      vigR.addColorStop(0, "rgba(0, 0, 0, 0)");
      vigR.addColorStop(0.6, "rgba(0, 0, 0, 0)");
      vigR.addColorStop(0.85, "rgba(2, 4, 10, 0.25)");
      vigR.addColorStop(1, "rgba(2, 4, 10, 0.55)");
      ctx.fillStyle = vigR;
      ctx.fillRect(0, 0, w, h);

      // ════════════════ PROJECT LINK (right side, highly visible) ════════════════
      const linkText = "mehara-vesak.netlify.app";
      const linkFontSize = Math.max(14, Math.min(w, h) * 0.022);
      ctx.font = `bold ${linkFontSize}px sans-serif`;
      const linkMetrics = ctx.measureText(linkText);
      const linkPadX = linkFontSize * 0.7;
      const linkPadY = linkFontSize * 0.5;
      const linkW = linkMetrics.width + linkPadX * 2;
      const linkH = linkFontSize + linkPadY * 2;
      const linkX = w - linkW - Math.min(w, h) * 0.03;
      const linkY = h * 0.88;
      const linkR = linkH / 2;

      // soft glow behind badge
      const badgeGlow = ctx.createRadialGradient(linkX + linkW / 2, linkY + linkH / 2, 0, linkX + linkW / 2, linkY + linkH / 2, linkW * 0.7);
      badgeGlow.addColorStop(0, "rgba(255, 255, 255, 0.35)");
      badgeGlow.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = badgeGlow;
      ctx.beginPath();
      ctx.arc(linkX + linkW / 2, linkY + linkH / 2, linkW * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // bright white pill background
      ctx.fillStyle = "rgba(255, 255, 255, 0.98)";
      ctx.beginPath();
      ctx.roundRect(linkX, linkY, linkW, linkH, linkR);
      ctx.fill();

      // stronger border
      ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // dark bold text
      ctx.fillStyle = "#0a0a0a";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(linkText, linkX + linkW / 2, linkY + linkH / 2);

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    onReady?.();

    return () => {
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = canvas.parentElement;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = rect.width * dpr;
    tempCanvas.height = rect.height * dpr;
    const tctx = tempCanvas.getContext("2d");
    if (!tctx) return;

    // Draw canvas background layer (full scene, scaled to container)
    tctx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);

    // Find and composite SVG lotus layer on top
    const svgElement = container.querySelector("svg");
    if (svgElement) {
      const svgRect = svgElement.getBoundingClientRect();
      const svgX = (svgRect.left - rect.left) * dpr;
      const svgY = (svgRect.top - rect.top) * dpr;
      const svgW = svgRect.width * dpr;
      const svgH = svgRect.height * dpr;

      const clone = svgElement.cloneNode(true);
      if (!clone.getAttribute("xmlns")) {
        clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      }

      const svgData = new XMLSerializer().serializeToString(clone);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = url;
      });

      tctx.drawImage(img, svgX, svgY, svgW, svgH);
      URL.revokeObjectURL(url);
    }

    const link = document.createElement("a");
    link.download = "vesak-verse-26.png";
    link.href = tempCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "#000",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}>
      <div style={{
        position: "relative",
        width: "min(100vw, 100vh)",
        height: "min(100vw, 100vh)",
        overflow: "hidden",
        background: "#0a0f1c",
      }}>
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
          }}
        />
        <div style={{ position: "absolute", inset: 0, zIndex: 1 }}>
          {children}
        </div>

      </div>
    </div>
  );
}

export default function LotusFlower() {
  const [showTech, setShowTech] = useState(false);
  const [ready, setReady] = useState(false);

  return (
    <>
      {!ready && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'linear-gradient(180deg, #03060f 0%, #0d1830 50%, #1d3050 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          textAlign: 'center',
          color: '#e2e8f0',
          fontFamily: 'var(--font-geist-sans), Arial, sans-serif',
          transition: 'opacity 0.6s ease',
        }}>
          <div style={{ fontSize: 56, marginBottom: 20, animation: 'pulse 2s infinite' }}>🪷</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#fbbf24', marginBottom: 10 }}>
            Vesak Verse 26
          </h1>
          <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 24 }}>
            Preparing your experience…
          </p>
          <div style={{
            width: 120,
            height: 3,
            background: 'rgba(255,255,255,0.1)',
            borderRadius: 2,
            overflow: 'hidden',
          }}>
            <div style={{
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, #fbbf24, #f472b6)',
              animation: 'loadSlide 1.2s ease-in-out infinite',
              transformOrigin: 'left',
            }} />
          </div>
          <style>{`
            @keyframes pulse {
              0%, 100% { transform: scale(1); opacity: 1; }
              50% { transform: scale(1.1); opacity: 0.8; }
            }
            @keyframes loadSlide {
              0% { transform: scaleX(0); }
              50% { transform: scaleX(1); }
              100% { transform: scaleX(0); transform-origin: right; }
            }
          `}</style>
        </div>
      )}
      <LotusBackground onReady={() => setReady(true)}>
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="75%" height="75%" viewBox="0 0 700 800" preserveAspectRatio="xMidYMid meet" style={{ filter: 'drop-shadow(0 25px 70px rgba(180, 80, 130, 0.3)) drop-shadow(0 8px 20px rgba(200, 100, 150, 0.15))' }}>
          <defs>
            {/* ====== PETAL GRADIENTS — richer color stops ====== */}

            <radialGradient id="lotus-outerPetal" cx="28%" cy="12%">
              <stop offset="0%" stopColor="#fce4ec" />
              <stop offset="10%" stopColor="#f8bbd0" />
              <stop offset="22%" stopColor="#f48fb1" />
              <stop offset="35%" stopColor="#ec407a" />
              <stop offset="48%" stopColor="#e91e63" />
              <stop offset="60%" stopColor="#d81b60" />
              <stop offset="72%" stopColor="#c2185b" />
              <stop offset="84%" stopColor="#ad1457" />
              <stop offset="100%" stopColor="#880e4f" />
            </radialGradient>

            <radialGradient id="lotus-midPetal" cx="32%" cy="15%">
              <stop offset="0%" stopColor="#fff0f5" />
              <stop offset="12%" stopColor="#ffd6e4" />
              <stop offset="26%" stopColor="#ffb3c6" />
              <stop offset="40%" stopColor="#ff80ab" />
              <stop offset="55%" stopColor="#f06292" />
              <stop offset="70%" stopColor="#ec407a" />
              <stop offset="85%" stopColor="#e91e63" />
              <stop offset="100%" stopColor="#c2185b" />
            </radialGradient>

            <radialGradient id="lotus-innerPetal" cx="38%" cy="18%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="15%" stopColor="#fff5f8" />
              <stop offset="30%" stopColor="#ffeef3" />
              <stop offset="48%" stopColor="#ffcdd9" />
              <stop offset="65%" stopColor="#f8a4bb" />
              <stop offset="82%" stopColor="#f06292" />
              <stop offset="100%" stopColor="#e91e63" />
            </radialGradient>

            <radialGradient id="lotus-corePetal" cx="42%" cy="22%">
              <stop offset="0%" stopColor="#fffbfc" />
              <stop offset="18%" stopColor="#fff3f6" />
              <stop offset="38%" stopColor="#ffe8ee" />
              <stop offset="58%" stopColor="#ffd0dd" />
              <stop offset="78%" stopColor="#ffb0c8" />
              <stop offset="100%" stopColor="#f48fb1" />
            </radialGradient>

            <radialGradient id="lotus-seedPod" cx="42%" cy="38%">
              <stop offset="0%" stopColor="#fffde7" />
              <stop offset="15%" stopColor="#fff9c4" />
              <stop offset="30%" stopColor="#f0e68c" />
              <stop offset="48%" stopColor="#dce775" />
              <stop offset="65%" stopColor="#cddc39" />
              <stop offset="80%" stopColor="#c0ca33" />
              <stop offset="100%" stopColor="#9e9d24" />
            </radialGradient>

            <radialGradient id="lotus-seedPodRim" cx="50%" cy="20%">
              <stop offset="0%" stopColor="#f9fbe7" />
              <stop offset="50%" stopColor="#e6ee9c" />
              <stop offset="100%" stopColor="#c0ca33" />
            </radialGradient>

            <radialGradient id="lotus-seedHole" cx="32%" cy="28%">
              <stop offset="0%" stopColor="#9e9d24" />
              <stop offset="30%" stopColor="#827717" />
              <stop offset="60%" stopColor="#558b2f" />
              <stop offset="100%" stopColor="#33691e" />
            </radialGradient>

            <radialGradient id="lotus-seedDepth" cx="50%" cy="50%">
              <stop offset="0%" stopColor="#1b5e20" />
              <stop offset="100%" stopColor="#0d3010" />
            </radialGradient>

            <radialGradient id="lotus-stamenTip" cx="45%" cy="30%">
              <stop offset="0%" stopColor="#fff8e1" />
              <stop offset="25%" stopColor="#ffecb3" />
              <stop offset="55%" stopColor="#ffb300" />
              <stop offset="100%" stopColor="#ff8f00" />
            </radialGradient>

            <linearGradient id="lotus-stem" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#66bb6a" />
              <stop offset="25%" stopColor="#81c784" />
              <stop offset="50%" stopColor="#a5d6a7" />
              <stop offset="75%" stopColor="#81c784" />
              <stop offset="100%" stopColor="#4caf50" />
            </linearGradient>

            <linearGradient id="lotus-stemDark" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2e7d32" />
              <stop offset="50%" stopColor="#388e3c" />
              <stop offset="100%" stopColor="#2e7d32" />
            </linearGradient>

            <radialGradient id="lotus-leafPad" cx="38%" cy="32%">
              <stop offset="0%" stopColor="#c8e6c9" />
              <stop offset="18%" stopColor="#a5d6a7" />
              <stop offset="36%" stopColor="#81c784" />
              <stop offset="54%" stopColor="#66bb6a" />
              <stop offset="72%" stopColor="#4caf50" />
              <stop offset="100%" stopColor="#2e7d32" />
            </radialGradient>

            <linearGradient id="lotus-iridescent" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 200, 240, 0.1)" />
              <stop offset="25%" stopColor="rgba(200, 230, 255, 0.08)" />
              <stop offset="50%" stopColor="rgba(255, 240, 200, 0.1)" />
              <stop offset="75%" stopColor="rgba(220, 200, 255, 0.08)" />
              <stop offset="100%" stopColor="rgba(255, 210, 230, 0.1)" />
            </linearGradient>

            <linearGradient id="lotus-vein" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(136, 14, 79, 0.04)" />
              <stop offset="30%" stopColor="rgba(136, 14, 79, 0.16)" />
              <stop offset="50%" stopColor="rgba(136, 14, 79, 0.2)" />
              <stop offset="70%" stopColor="rgba(136, 14, 79, 0.16)" />
              <stop offset="100%" stopColor="rgba(136, 14, 79, 0.04)" />
            </linearGradient>

            <linearGradient id="lotus-veinFine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(136, 14, 79, 0.02)" />
              <stop offset="50%" stopColor="rgba(136, 14, 79, 0.1)" />
              <stop offset="100%" stopColor="rgba(136, 14, 79, 0.02)" />
            </linearGradient>

            <linearGradient id="lotus-highlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.75)" />
              <stop offset="30%" stopColor="rgba(255, 255, 255, 0.3)" />
              <stop offset="60%" stopColor="rgba(255, 255, 255, 0.08)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </linearGradient>

            <linearGradient id="lotus-highlightWarm" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(255, 240, 220, 0.4)" />
              <stop offset="50%" stopColor="rgba(255, 230, 210, 0.12)" />
              <stop offset="100%" stopColor="rgba(255, 220, 200, 0)" />
            </linearGradient>

            <radialGradient id="lotus-dew" cx="25%" cy="25%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.98)" />
              <stop offset="20%" stopColor="rgba(230,245,255,0.8)" />
              <stop offset="40%" stopColor="rgba(200,230,255,0.55)" />
              <stop offset="60%" stopColor="rgba(180,220,250,0.3)" />
              <stop offset="80%" stopColor="rgba(160,210,240,0.12)" />
              <stop offset="100%" stopColor="rgba(140,200,230,0.02)" />
            </radialGradient>

            <linearGradient id="lotus-dewRainbow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(255,180,180,0.25)" />
              <stop offset="25%" stopColor="rgba(255,255,180,0.2)" />
              <stop offset="50%" stopColor="rgba(180,255,200,0.2)" />
              <stop offset="75%" stopColor="rgba(180,200,255,0.25)" />
              <stop offset="100%" stopColor="rgba(220,180,255,0.2)" />
            </linearGradient>

            <radialGradient id="lotus-dewReflect" cx="70%" cy="72%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0)" />
              <stop offset="85%" stopColor="rgba(255,255,255,0.3)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.45)" />
            </radialGradient>

            {/* ====== FILTERS ====== */}
            <filter id="lotus-petalGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="4.5" result="coloredBlur"/>
              <feColorMatrix in="coloredBlur" type="matrix"
                values="1.12 0.06 0.1 0 0  0.06 0.96 0.06 0 0  0.1 0.06 1.08 0 0  0 0 0 1.2 0"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="lotus-deepShadow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="10"/>
              <feOffset dx="5" dy="12" result="offsetblur"/>
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5"/>
              </feComponentTransfer>
              <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="lotus-centerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur"/>
              <feColorMatrix in="blur" type="matrix"
                values="1.35 0.12 0 0 0  0.12 1.35 0.12 0 0  0 0.12 1.05 0 0  0 0 0 2.2 0"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="lotus-dewGlow" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="2" result="blur"/>
              <feColorMatrix in="blur" type="matrix"
                values="1.25 0 0 0 0.2  0 1.25 0 0 0.2  0 0 1.35 0 0.3  0 0 0 2.5 0"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* ====== WATER / LILY PAD BASE ====== */}
          <g opacity="0.65">
            {[0, 1, 2, 3].map((i) => (
              <ellipse key={`ripple-${i}`} cx="350" cy="685"
                rx={170 + i * 55} ry={25 + i * 9}
                fill="none"
                stroke={`rgba(100,181,246,${0.14 - i * 0.025})`}
                strokeWidth={1.8 - i * 0.3} />
            ))}

            {/* Lily pad LEFT */}
            <g transform="translate(-40, 10)">
              <ellipse cx="243" cy="692" rx="98" ry="37" fill="rgba(0,40,20,0.12)" transform="rotate(-12 243 692)" />
              <ellipse cx="240" cy="685" rx="98" ry="37" fill="url(#lotus-leafPad)" stroke="#2e7d32" strokeWidth="1.8" opacity="0.75" transform="rotate(-12 240 685)" />
              <ellipse cx="240" cy="685" rx="98" ry="37" fill="none" stroke="rgba(27,94,32,0.3)" strokeWidth="4" opacity="0.4" transform="rotate(-12 240 685)" />
              <path d="M240,685 L192,668 L240,648" fill="rgba(100,181,246,0.18)" stroke="rgba(46,125,50,0.3)" strokeWidth="0.8" transform="rotate(-12 240 685)" />
              {[0,1,2,3,4,5,6,7].map((v) => {
                const va = -70 + v * 20;
                const ex = 240 + Math.cos((va * Math.PI) / 180) * 85;
                const ey = 685 + Math.sin((va * Math.PI) / 180) * 30;
                return (
                  <path key={`lv-l-${v}`}
                    d={`M240,685 Q${240 + Math.cos((va * Math.PI) / 180) * 45},${685 + Math.sin((va * Math.PI) / 180) * 16} ${ex},${ey}`}
                    stroke={`rgba(0,60,0,${0.18 + (v % 3) * 0.06})`}
                    strokeWidth={v % 2 === 0 ? 1.2 : 0.8}
                    fill="none" transform="rotate(-12 240 685)" />
                );
              })}
              <ellipse cx="225" cy="678" rx="55" ry="20" fill="rgba(255,255,255,0.14)" transform="rotate(-12 225 678)" />
            </g>

            {/* Lily pad RIGHT */}
            <g transform="translate(50, 5)">
              <ellipse cx="473" cy="697" rx="88" ry="32" fill="rgba(0,40,20,0.1)" transform="rotate(8 473 697)" />
              <ellipse cx="470" cy="690" rx="88" ry="32" fill="url(#lotus-leafPad)" stroke="#2e7d32" strokeWidth="1.5" opacity="0.65" transform="rotate(8 470 690)" />
              <path d="M470,690 L428,676 L470,665" fill="rgba(100,181,246,0.16)" stroke="rgba(46,125,50,0.25)" strokeWidth="0.7" transform="rotate(8 470 690)" />
              {[0,1,2,3,4,5,6].map((v) => {
                const va = -65 + v * 20;
                const ex = 470 + Math.cos((va * Math.PI) / 180) * 78;
                const ey = 690 + Math.sin((va * Math.PI) / 180) * 26;
                return (
                  <path key={`lv-r-${v}`}
                    d={`M470,690 Q${470 + Math.cos((va * Math.PI) / 180) * 40},${690 + Math.sin((va * Math.PI) / 180) * 14} ${ex},${ey}`}
                    stroke={`rgba(0,60,0,${0.16 + (v % 3) * 0.05})`}
                    strokeWidth={v % 2 === 0 ? 1.1 : 0.7}
                    fill="none" transform="rotate(8 470 690)" />
                );
              })}
              <ellipse cx="478" cy="686" rx="48" ry="17" fill="rgba(255,255,255,0.11)" transform="rotate(8 478 686)" />
            </g>

            {/* Small lily pad behind stem */}
            <g transform="translate(10, -5)">
              <ellipse cx="365" cy="705" rx="50" ry="18" fill="url(#lotus-leafPad)" stroke="#2e7d32" strokeWidth="1.2" opacity="0.4" transform="rotate(3 365 705)" />
              <path d="M365,705 L345,698 L365,693" fill="rgba(100,181,246,0.12)" stroke="none" transform="rotate(3 365 705)" />
              {[0,1,2,3,4].map((v) => (
                <path key={`lv-s-${v}`}
                  d={`M365,705 Q${365 + Math.cos(((-50 + v * 25) * Math.PI) / 180) * 25},${705 + Math.sin(((-50 + v * 25) * Math.PI) / 180) * 10} ${365 + Math.cos(((-50 + v * 25) * Math.PI) / 180) * 44},${705 + Math.sin(((-50 + v * 25) * Math.PI) / 180) * 16}`}
                  stroke="rgba(0,60,0,0.15)" strokeWidth="0.7" fill="none" transform="rotate(3 365 705)" />
              ))}
            </g>
          </g>

          {/* ====== STEM ====== */}
          <g filter="url(#lotus-deepShadow)">
            <path d="M354,535 Q349,595 352,645 Q356,685 354,725"
              fill="none" stroke="rgba(0,50,0,0.15)" strokeWidth="22" strokeLinecap="round" />
            <path d="M350,530 Q345,590 348,640 Q352,680 350,720"
              fill="none" stroke="url(#lotus-stemDark)" strokeWidth="20" strokeLinecap="round" />
            <path d="M350,530 Q345,590 348,640 Q352,680 350,720"
              fill="none" stroke="url(#lotus-stem)" strokeWidth="17" strokeLinecap="round" />
            <path d="M344,538 Q339,595 342,642 Q346,682 344,718"
              fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M342,545 Q337,598 340,645 Q344,682 342,712"
              fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />
            {[0,1,2,3,4].map((i) => {
              const sy = 555 + i * 35;
              const side = i % 2 === 0 ? 10 : -10;
              return (
                <ellipse key={`bump-${i}`}
                  cx={347 + side} cy={sy}
                  rx="2.5" ry="1.5"
                  fill="rgba(102,187,106,0.5)"
                  stroke="rgba(46,125,50,0.3)" strokeWidth="0.5"
                  transform={`rotate(${side > 0 ? 20 : -20} ${347 + side} ${sy})`} />
              );
            })}
          </g>

          {/* ====== FLOWER HEAD ====== */}

          {/* Ambient underglow */}
          <ellipse cx="350" cy="410" rx="115" ry="48" fill="rgba(233,30,99,0.08)" />
          <ellipse cx="350" cy="405" rx="85" ry="32" fill="rgba(244,143,177,0.06)" />

          {/* LAYER 1 — 9 outermost petals */}
          <g filter="url(#lotus-petalGlow)">
            {[...Array(9)].map((_, i) => {
              const angle = (360 / 9) * i;
              const w = Math.sin(i * 1.1) * 6;
              return (
                <g key={`o-${i}`} transform={`rotate(${angle} 350 400)`}>
                  <path d={`M350,${198 + w} C308,252 288,334 316,412 Q334,396 350,364 Q366,396 384,412 C412,334 392,252 350,${198 + w} Z`}
                    fill="rgba(100,0,30,0.08)" transform="translate(3, 5)" />
                  <path d={`M350,${195 + w} C310,250 288,332 315,410 Q335,394 350,362 Q365,394 385,410 C412,332 390,250 350,${195 + w} Z`}
                    fill="url(#lotus-outerPetal)" stroke="#ad1457" strokeWidth="1.2" opacity="0.96" />
                  <path d={`M350,${195 + w} C310,250 288,332 315,410 Q335,394 350,362 Q365,394 385,410 C412,332 390,250 350,${195 + w} Z`}
                    fill="url(#lotus-iridescent)" opacity="0.45" />
                  <path d={`M350,${195 + w} C310,250 288,332 315,410`}
                    fill="none" stroke="rgba(255,225,245,0.5)" strokeWidth="2" opacity="0.6" />
                  <path d={`M350,${195 + w} C390,250 412,332 385,410`}
                    fill="none" stroke="rgba(255,200,220,0.25)" strokeWidth="1.5" opacity="0.4" />
                  <path d={`M350,${212 + w} Q348,295 349,398`}
                    stroke="url(#lotus-vein)" strokeWidth="2" fill="none" opacity="0.7" />
                  <path d={`M350,${228 + w} Q336,292 332,375`}
                    stroke="url(#lotus-vein)" strokeWidth="1.1" fill="none" opacity="0.35" />
                  <path d={`M350,${228 + w} Q364,292 368,375`}
                    stroke="url(#lotus-vein)" strokeWidth="1.1" fill="none" opacity="0.35" />
                  <path d={`M350,${248 + w} Q328,315 322,385`}
                    stroke="url(#lotus-veinFine)" strokeWidth="0.85" fill="none" opacity="0.28" />
                  <path d={`M350,${248 + w} Q372,315 378,385`}
                    stroke="url(#lotus-veinFine)" strokeWidth="0.85" fill="none" opacity="0.28" />
                  <path d={`M350,${265 + w} Q320,340 316,395`}
                    stroke="url(#lotus-veinFine)" strokeWidth="0.6" fill="none" opacity="0.18" />
                  <path d={`M350,${265 + w} Q380,340 384,395`}
                    stroke="url(#lotus-veinFine)" strokeWidth="0.6" fill="none" opacity="0.18" />
                  <ellipse cx="328" cy={`${258 + w}`} rx="30" ry="54"
                    fill="url(#lotus-highlight)" opacity="0.72" />
                  <ellipse cx="322" cy={`${240 + w}`} rx="13" ry="24"
                    fill="rgba(255,255,255,0.38)" opacity="0.55" />
                  <ellipse cx="372" cy={`${280 + w}`} rx="15" ry="35"
                    fill="url(#lotus-highlightWarm)" opacity="0.3" />
                </g>
              );
            })}
          </g>

          {/* LAYER 2 — 8 petals */}
          <g filter="url(#lotus-petalGlow)">
            {[...Array(8)].map((_, i) => {
              const angle = (360 / 8) * i + 22;
              return (
                <g key={`m-${i}`} transform={`rotate(${angle} 350 400)`}>
                  <path d="M350,222 C316,266 302,342 320,406 Q337,392 350,367 Q363,392 380,406 C398,342 384,266 350,222 Z"
                    fill="url(#lotus-midPetal)" stroke="#c2185b" strokeWidth="1" opacity="0.96" />
                  <path d="M350,222 C316,266 302,342 320,406 Q337,392 350,367 Q363,392 380,406 C398,342 384,266 350,222 Z"
                    fill="url(#lotus-iridescent)" opacity="0.4" />
                  <path d="M350,222 C316,266 302,342 320,406"
                    fill="none" stroke="rgba(255,230,245,0.4)" strokeWidth="1.6" opacity="0.5" />
                  <path d="M350,236 Q348,312 349,396"
                    stroke="url(#lotus-vein)" strokeWidth="1.6" fill="none" opacity="0.6" />
                  <path d="M350,255 Q338,315 336,385"
                    stroke="url(#lotus-vein)" strokeWidth="0.9" fill="none" opacity="0.3" />
                  <path d="M350,255 Q362,315 364,385"
                    stroke="url(#lotus-vein)" strokeWidth="0.9" fill="none" opacity="0.3" />
                  <path d="M350,272 Q330,335 326,392"
                    stroke="url(#lotus-veinFine)" strokeWidth="0.65" fill="none" opacity="0.2" />
                  <path d="M350,272 Q370,335 374,392"
                    stroke="url(#lotus-veinFine)" strokeWidth="0.65" fill="none" opacity="0.2" />
                  <ellipse cx="330" cy="278" rx="24" ry="44"
                    fill="url(#lotus-highlight)" opacity="0.65" />
                  <ellipse cx="326" cy="265" rx="10" ry="18"
                    fill="rgba(255,255,255,0.3)" opacity="0.5" />
                </g>
              );
            })}
          </g>

          {/* LAYER 3 — 7 petals */}
          <g filter="url(#lotus-petalGlow)">
            {[...Array(7)].map((_, i) => {
              const angle = (360 / 7) * i + 12;
              return (
                <g key={`n-${i}`} transform={`rotate(${angle} 350 400)`}>
                  <path d="M350,258 C324,294 316,352 329,402 Q341,391 350,375 Q359,391 371,402 C384,352 376,294 350,258 Z"
                    fill="url(#lotus-innerPetal)" stroke="#e91e63" strokeWidth="0.85" opacity="0.96" />
                  <path d="M350,258 C324,294 316,352 329,402 Q341,391 350,375 Q359,391 371,402 C384,352 376,294 350,258 Z"
                    fill="url(#lotus-iridescent)" opacity="0.35" />
                  <path d="M350,258 C324,294 316,352 329,402"
                    fill="none" stroke="rgba(255,235,245,0.35)" strokeWidth="1.3" opacity="0.45" />
                  <path d="M350,270 Q349,332 349,394"
                    stroke="url(#lotus-vein)" strokeWidth="1.3" fill="none" opacity="0.5" />
                  <path d="M350,285 Q340,332 338,388"
                    stroke="url(#lotus-veinFine)" strokeWidth="0.7" fill="none" opacity="0.25" />
                  <path d="M350,285 Q360,332 362,388"
                    stroke="url(#lotus-veinFine)" strokeWidth="0.7" fill="none" opacity="0.25" />
                  <ellipse cx="335" cy="308" rx="18" ry="34"
                    fill="url(#lotus-highlight)" opacity="0.6" />
                </g>
              );
            })}
          </g>

          {/* LAYER 4 — 6 core petals */}
          <g filter="url(#lotus-petalGlow)">
            {[...Array(6)].map((_, i) => {
              const angle = (360 / 6) * i + 30;
              return (
                <g key={`c-${i}`} transform={`rotate(${angle} 350 400)`}>
                  <path d="M350,298 C332,322 326,358 336,396 Q344,388 350,377 Q356,388 364,396 C374,358 368,322 350,298 Z"
                    fill="url(#lotus-corePetal)" stroke="#f06292" strokeWidth="0.7" opacity="0.96" />
                  <path d="M350,298 C332,322 326,358 336,396"
                    fill="none" stroke="rgba(255,240,248,0.3)" strokeWidth="1" opacity="0.4" />
                  <path d="M350,310 Q349,350 349,390"
                    stroke="url(#lotus-veinFine)" strokeWidth="1" fill="none" opacity="0.4" />
                  <ellipse cx="339" cy="338" rx="11" ry="24"
                    fill="url(#lotus-highlight)" opacity="0.55" />
                </g>
              );
            })}
          </g>

          {/* LAYER 5 — 5 innermost tiny petals */}
          <g>
            {[...Array(5)].map((_, i) => {
              const angle = (360 / 5) * i + 54;
              return (
                <g key={`t-${i}`} transform={`rotate(${angle} 350 385)`}>
                  <path d="M350,338 C342,352 340,368 345,385 Q348,382 350,378 Q352,382 355,385 C360,368 358,352 350,338 Z"
                    fill="url(#lotus-corePetal)" stroke="#f8bbd0" strokeWidth="0.5" opacity="0.8" />
                </g>
              );
            })}
          </g>

          {/* ====== STAMENS — 24 with pollen dust ====== */}
          <g filter="url(#lotus-centerGlow)">
            {[...Array(24)].map((_, i) => {
              const angle = (360 / 24) * i;
              const len = 32 + (i % 4) * 7;
              const tipX = 350 + Math.sin((angle * Math.PI) / 180) * len;
              const tipY = 376 - Math.cos((angle * Math.PI) / 180) * len;
              const midX = 350 + Math.sin((angle * Math.PI) / 180) * (len * 0.55);
              const midY = 376 - Math.cos((angle * Math.PI) / 180) * (len * 0.55);
              const curve = i % 2 === 0 ? 4 : -4;
              return (
                <g key={`s-${i}`}>
                  <path d={`M350,376 Q${midX + curve},${midY} ${tipX},${tipY}`}
                    stroke={i % 3 === 0 ? '#fbc02d' : i % 3 === 1 ? '#f9a825' : '#f57f17'}
                    strokeWidth={1.2 + (i % 2) * 0.4} fill="none" opacity="0.88" strokeLinecap="round" />
                  <path d={`M350,376 Q${midX + curve + 1},${midY - 1} ${tipX},${tipY}`}
                    stroke="rgba(255,255,230,0.25)" strokeWidth="0.6" fill="none" strokeLinecap="round" />
                  <ellipse cx={tipX} cy={tipY}
                    rx={3.8 + (i % 2)} ry={2.5 + (i % 2) * 0.3}
                    fill="url(#lotus-stamenTip)" stroke="#e65100" strokeWidth="0.5"
                    transform={`rotate(${angle} ${tipX} ${tipY})`} opacity="0.92" />
                  <ellipse cx={tipX - 0.8} cy={tipY - 0.6}
                    rx="1.5" ry="1"
                    fill="rgba(255,255,240,0.5)"
                    transform={`rotate(${angle} ${tipX} ${tipY})`} />
                </g>
              );
            })}
            {[...Array(20)].map((_, i) => {
              const a = (360 / 20) * i + 9;
              const r = 28 + (i % 5) * 10;
              const px = 350 + Math.sin((a * Math.PI) / 180) * r;
              const py = 376 - Math.cos((a * Math.PI) / 180) * r;
              return (
                <circle key={`pd-${i}`} cx={px} cy={py}
                  r={0.6 + (i % 3) * 0.4}
                  fill={i % 2 === 0 ? '#fff9c4' : '#ffecb3'}
                  opacity={0.4 + (i % 4) * 0.1} />
              );
            })}
          </g>

          {/* ====== SEED POD ====== */}
          <g filter="url(#lotus-centerGlow)">
            <ellipse cx="352" cy="382" rx="30" ry="26" fill="rgba(50,50,0,0.12)" />
            <ellipse cx="350" cy="380" rx="30" ry="26"
              fill="url(#lotus-seedPod)" stroke="#827717" strokeWidth="1.5" />
            <ellipse cx="350" cy="376" rx="27" ry="22"
              fill="url(#lotus-seedPodRim)" stroke="#9e9d24" strokeWidth="0.8" />
            <ellipse cx="350" cy="376" rx="27" ry="22"
              fill="none" stroke="rgba(255,255,240,0.25)" strokeWidth="1.5" />
            <ellipse cx="340" cy="370" rx="14" ry="10" fill="rgba(255,255,255,0.38)" />
            <ellipse cx="335" cy="367" rx="7" ry="5" fill="rgba(255,255,255,0.2)" />

            {/* Center seed */}
            <circle cx="350" cy="376" r="3.5" fill="url(#lotus-seedHole)" stroke="#558b2f" strokeWidth="0.6" />
            <circle cx="349" cy="375" r="1.8" fill="url(#lotus-seedDepth)" opacity="0.6" />
            <circle cx="348.5" cy="374.5" r="0.8" fill="rgba(255,255,200,0.3)" />

            {/* Inner ring — 6 */}
            {[...Array(6)].map((_, i) => {
              const a = (360 / 6) * i + 30;
              const sx = 350 + Math.sin((a * Math.PI) / 180) * 9.5;
              const sy = 376 - Math.cos((a * Math.PI) / 180) * 8;
              return (
                <g key={`si-${i}`}>
                  <circle cx={sx} cy={sy} r="3" fill="url(#lotus-seedHole)" stroke="#558b2f" strokeWidth="0.45" />
                  <circle cx={sx - 0.5} cy={sy - 0.5} r="1.4" fill="url(#lotus-seedDepth)" opacity="0.55" />
                  <circle cx={sx - 0.8} cy={sy - 0.8} r="0.6" fill="rgba(255,255,200,0.25)" />
                </g>
              );
            })}

            {/* Outer ring — 11 */}
            {[...Array(11)].map((_, i) => {
              const a = (360 / 11) * i + 16;
              const sx = 350 + Math.sin((a * Math.PI) / 180) * 19;
              const sy = 376 - Math.cos((a * Math.PI) / 180) * 16;
              return (
                <g key={`so-${i}`}>
                  <circle cx={sx} cy={sy} r="2.5" fill="url(#lotus-seedHole)" stroke="#558b2f" strokeWidth="0.35" />
                  <circle cx={sx - 0.4} cy={sy - 0.4} r="1.1" fill="url(#lotus-seedDepth)" opacity="0.45" />
                  <circle cx={sx - 0.6} cy={sy - 0.6} r="0.5" fill="rgba(255,255,200,0.2)" />
                </g>
              );
            })}

            {/* Surface texture dots */}
            {[...Array(15)].map((_, i) => {
              const a = (360 / 15) * i + 5;
              const r = 5 + (i % 3) * 6.5;
              return (
                <circle key={`tx-${i}`}
                  cx={350 + Math.sin((a * Math.PI) / 180) * r}
                  cy={376 - Math.cos((a * Math.PI) / 180) * r * 0.85}
                  r="0.4" fill="rgba(130,119,23,0.3)" />
              );
            })}
          </g>

          {/* ====== DEW DROPS — with rainbow caustics ====== */}
          <g filter="url(#lotus-dewGlow)">
            <g>
              <ellipse cx="310" cy="310" rx="7" ry="6" fill="url(#lotus-dew)" opacity="0.88" />
              <ellipse cx="310" cy="310" rx="7" ry="6" fill="url(#lotus-dewRainbow)" opacity="0.35" />
              <ellipse cx="310" cy="310" rx="7" ry="6" fill="url(#lotus-dewReflect)" opacity="0.4" />
              <ellipse cx="306.5" cy="307.5" rx="2.5" ry="2" fill="rgba(255,255,255,0.92)" />
              <ellipse cx="313" cy="313.5" rx="1.2" ry="0.9" fill="rgba(255,255,255,0.5)" />
            </g>
            <g>
              <ellipse cx="408" cy="278" rx="5.5" ry="5" fill="url(#lotus-dew)" opacity="0.82" />
              <ellipse cx="408" cy="278" rx="5.5" ry="5" fill="url(#lotus-dewRainbow)" opacity="0.3" />
              <ellipse cx="408" cy="278" rx="5.5" ry="5" fill="url(#lotus-dewReflect)" opacity="0.35" />
              <ellipse cx="405" cy="276" rx="2" ry="1.6" fill="rgba(255,255,255,0.9)" />
            </g>
            <g>
              <circle cx="358" cy="235" r="4" fill="url(#lotus-dew)" opacity="0.78" />
              <circle cx="358" cy="235" r="4" fill="url(#lotus-dewRainbow)" opacity="0.25" />
              <circle cx="356" cy="233" r="1.5" fill="rgba(255,255,255,0.88)" />
              <circle cx="365" cy="240" r="2.5" fill="url(#lotus-dew)" opacity="0.65" />
              <circle cx="363.5" cy="238.5" r="1" fill="rgba(255,255,255,0.8)" />
            </g>
            <g>
              <circle cx="290" cy="365" r="3.5" fill="url(#lotus-dew)" opacity="0.72" />
              <circle cx="290" cy="365" r="3.5" fill="url(#lotus-dewRainbow)" opacity="0.22" />
              <circle cx="288.5" cy="363.5" r="1.3" fill="rgba(255,255,255,0.85)" />
            </g>
            <g>
              <ellipse cx="422" cy="340" rx="4" ry="3.5" fill="url(#lotus-dew)" opacity="0.7" />
              <ellipse cx="420" cy="338.5" rx="1.5" ry="1.2" fill="rgba(255,255,255,0.85)" />
            </g>
            <g>
              <circle cx="332" cy="310" r="2.2" fill="url(#lotus-dew)" opacity="0.6" />
              <circle cx="331" cy="309" r="0.9" fill="rgba(255,255,255,0.8)" />
            </g>
            <g>
              <circle cx="278" cy="290" r="3" fill="url(#lotus-dew)" opacity="0.58" />
              <circle cx="278" cy="290" r="3" fill="url(#lotus-dewRainbow)" opacity="0.2" />
              <circle cx="276.5" cy="288.5" r="1.1" fill="rgba(255,255,255,0.82)" />
            </g>
            {/* Lily pad dew */}
            <g>
              <ellipse cx="210" cy="680" rx="5.5" ry="4" fill="url(#lotus-dew)" opacity="0.62" />
              <ellipse cx="210" cy="680" rx="5.5" ry="4" fill="url(#lotus-dewRainbow)" opacity="0.2" />
              <ellipse cx="207.5" cy="678" rx="2" ry="1.4" fill="rgba(255,255,255,0.82)" />
            </g>
            <g>
              <circle cx="228" cy="675" r="3" fill="url(#lotus-dew)" opacity="0.55" />
              <circle cx="226.5" cy="673.5" r="1.2" fill="rgba(255,255,255,0.75)" />
            </g>
            <g>
              <circle cx="248" cy="682" r="2" fill="url(#lotus-dew)" opacity="0.45" />
              <circle cx="247" cy="681" r="0.8" fill="rgba(255,255,255,0.7)" />
            </g>
            <g>
              <ellipse cx="500" cy="688" rx="4" ry="3" fill="url(#lotus-dew)" opacity="0.5" />
              <ellipse cx="498" cy="686.5" rx="1.5" ry="1.1" fill="rgba(255,255,255,0.75)" />
            </g>
            <g>
              <circle cx="515" cy="692" r="2.5" fill="url(#lotus-dew)" opacity="0.42" />
              <circle cx="514" cy="691" r="1" fill="rgba(255,255,255,0.65)" />
            </g>
          </g>

          {/* ====== POLLEN & SPARKLE PARTICLES ====== */}
          {[...Array(18)].map((_, i) => {
            const cx = 265 + (i * 31) % 170;
            const cy = 250 + (i * 29) % 195;
            return (
              <circle key={`pl-${i}`} cx={cx} cy={cy}
                r={0.8 + (i % 3) * 0.5}
                fill={i % 4 === 0 ? '#fff9c4' : i % 4 === 1 ? '#ffecb3' : i % 4 === 2 ? '#fff' : '#ffe0b2'}
                opacity={0.4 + (i % 5) * 0.08} />
            );
          })}
          {[...Array(10)].map((_, i) => {
            const sx = 278 + (i * 37) % 145;
            const sy = 248 + (i * 23) % 140;
            const size = 5 + (i % 3) * 2;
            return (
              <svg key={`sp-${i}`} x={sx} y={sy} width={size} height={size} viewBox="0 0 24 24"
                opacity={0.25 + (i % 4) * 0.1}>
                <path d="M12 0 L13.5 9 L24 12 L13.5 15 L12 24 L10.5 15 L0 12 L10.5 9 Z"
                  fill={i % 3 === 0 ? '#fff9c4' : i % 3 === 1 ? '#fff' : '#ffe8ec'} />
              </svg>
            );
          })}

          {/* ====== CREATURES ====== */}

          {/* ====== DRAGONFLY — hovering top-right ====== */}
          <g transform="translate(480, 170) rotate(-15)">
            <defs>
              <linearGradient id="df-wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(200,230,255,0.55)" />
                <stop offset="40%" stopColor="rgba(180,220,250,0.35)" />
                <stop offset="100%" stopColor="rgba(160,210,245,0.15)" />
              </linearGradient>
              <linearGradient id="df-wingVein" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(100,150,200,0.4)" />
                <stop offset="100%" stopColor="rgba(100,150,200,0.1)" />
              </linearGradient>
              <radialGradient id="df-eye" cx="35%" cy="35%">
                <stop offset="0%" stopColor="#e0f7fa" />
                <stop offset="40%" stopColor="#00acc1" />
                <stop offset="75%" stopColor="#006064" />
                <stop offset="100%" stopColor="#004d40" />
              </radialGradient>
              <linearGradient id="df-body" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#26c6da" />
                <stop offset="30%" stopColor="#00acc1" />
                <stop offset="60%" stopColor="#00838f" />
                <stop offset="100%" stopColor="#006064" />
              </linearGradient>
              <linearGradient id="df-tail" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00838f" />
                <stop offset="50%" stopColor="#00695c" />
                <stop offset="100%" stopColor="#004d40" />
              </linearGradient>
            </defs>
            {/* Upper-left wing */}
            <ellipse cx="-18" cy="-8" rx="28" ry="9" fill="url(#df-wingGrad)" stroke="rgba(100,180,220,0.45)" strokeWidth="0.6" transform="rotate(-20 -18 -8)" />
            <path d="M-4,-6 Q-18,-12 -38,-10" stroke="url(#df-wingVein)" strokeWidth="0.5" fill="none" />
            <path d="M-4,-4 Q-20,-6 -40,-5" stroke="url(#df-wingVein)" strokeWidth="0.4" fill="none" />
            <path d="M-6,-8 Q-15,-15 -30,-16" stroke="url(#df-wingVein)" strokeWidth="0.35" fill="none" />
            <ellipse cx="-20" cy="-10" rx="8" ry="3" fill="rgba(255,255,255,0.25)" transform="rotate(-20 -20 -10)" />
            {/* Upper-right wing */}
            <ellipse cx="18" cy="-8" rx="28" ry="9" fill="url(#df-wingGrad)" stroke="rgba(100,180,220,0.45)" strokeWidth="0.6" transform="rotate(20 18 -8)" />
            <path d="M4,-6 Q18,-12 38,-10" stroke="url(#df-wingVein)" strokeWidth="0.5" fill="none" />
            <path d="M4,-4 Q20,-6 40,-5" stroke="url(#df-wingVein)" strokeWidth="0.4" fill="none" />
            <path d="M6,-8 Q15,-15 30,-16" stroke="url(#df-wingVein)" strokeWidth="0.35" fill="none" />
            <ellipse cx="20" cy="-10" rx="8" ry="3" fill="rgba(255,255,255,0.25)" transform="rotate(20 20 -10)" />
            {/* Lower-left wing */}
            <ellipse cx="-14" cy="4" rx="22" ry="7" fill="url(#df-wingGrad)" stroke="rgba(100,180,220,0.35)" strokeWidth="0.5" transform="rotate(-8 -14 4)" />
            <path d="M-3,3 Q-14,0 -30,2" stroke="url(#df-wingVein)" strokeWidth="0.35" fill="none" />
            {/* Lower-right wing */}
            <ellipse cx="14" cy="4" rx="22" ry="7" fill="url(#df-wingGrad)" stroke="rgba(100,180,220,0.35)" strokeWidth="0.5" transform="rotate(8 14 4)" />
            <path d="M3,3 Q14,0 30,2" stroke="url(#df-wingVein)" strokeWidth="0.35" fill="none" />
            {/* Thorax */}
            <ellipse cx="0" cy="0" rx="4.5" ry="7" fill="url(#df-body)" stroke="#004d40" strokeWidth="0.5" />
            <ellipse cx="-1" cy="-2" rx="2" ry="3.5" fill="rgba(255,255,255,0.15)" />
            {/* Abdomen / tail — long segmented */}
            <path d="M0,7 Q2,20 4,35 Q5,48 3,62 Q1,72 0,78" stroke="url(#df-tail)" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            <path d="M0,7 Q2,20 4,35 Q5,48 3,62 Q1,72 0,78" stroke="rgba(0,105,92,0.6)" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Tail segments */}
            {[12, 20, 28, 36, 44, 52, 60, 68].map((y, si) => {
              const tx = si < 4 ? 1 + si * 0.5 : 4.5 - (si - 4) * 0.5;
              return <line key={`seg-${si}`} x1={tx - 2.5} y1={y} x2={tx + 2.5} y2={y} stroke="rgba(0,77,64,0.3)" strokeWidth="0.5" />;
            })}
            {/* Tail highlight */}
            <path d="M-0.5,8 Q1.5,20 3,35 Q4,46 2.5,58" stroke="rgba(178,235,242,0.3)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            {/* Tail tip */}
            <ellipse cx="0" cy="79" rx="2" ry="3" fill="#004d40" />
            {/* Head */}
            <ellipse cx="0" cy="-9" rx="6" ry="5" fill="url(#df-body)" stroke="#004d40" strokeWidth="0.5" />
            {/* Eyes — large compound eyes */}
            <circle cx="-4.5" cy="-10.5" r="3.5" fill="url(#df-eye)" stroke="#004d40" strokeWidth="0.4" />
            <circle cx="4.5" cy="-10.5" r="3.5" fill="url(#df-eye)" stroke="#004d40" strokeWidth="0.4" />
            <circle cx="-5.5" cy="-11.5" r="1.2" fill="rgba(255,255,255,0.7)" />
            <circle cx="3.5" cy="-11.5" r="1.2" fill="rgba(255,255,255,0.7)" />
            <circle cx="-4" cy="-10" r="0.8" fill="#001a14" />
            <circle cx="5" cy="-10" r="0.8" fill="#001a14" />
            {/* Tiny mandibles */}
            <path d="M-1.5,-13.5 Q-2,-15 -1,-16" stroke="#004d40" strokeWidth="0.6" fill="none" strokeLinecap="round" />
            <path d="M1.5,-13.5 Q2,-15 1,-16" stroke="#004d40" strokeWidth="0.6" fill="none" strokeLinecap="round" />
            {/* Legs — 6 tiny legs tucked under */}
            {[-3, 0, 3].map((ly, li) => (
              <g key={`dleg-${li}`}>
                <path d={`M-4,${ly} Q-7,${ly + 3} -9,${ly + 5}`} stroke="#00695c" strokeWidth="0.6" fill="none" />
                <path d={`M4,${ly} Q7,${ly + 3} 9,${ly + 5}`} stroke="#00695c" strokeWidth="0.6" fill="none" />
              </g>
            ))}
          </g>

          {/* ====== LADYBUG — sitting on outer petal ====== */}
          <g transform="translate(280, 290) rotate(25)">
            <defs>
              <radialGradient id="lb-shell" cx="35%" cy="30%">
                <stop offset="0%" stopColor="#ff5252" />
                <stop offset="25%" stopColor="#f44336" />
                <stop offset="50%" stopColor="#e53935" />
                <stop offset="75%" stopColor="#c62828" />
                <stop offset="100%" stopColor="#b71c1c" />
              </radialGradient>
              <radialGradient id="lb-head" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#424242" />
                <stop offset="50%" stopColor="#212121" />
                <stop offset="100%" stopColor="#0a0a0a" />
              </radialGradient>
            </defs>
            {/* Shadow */}
            <ellipse cx="1" cy="12" rx="9" ry="4" fill="rgba(0,0,0,0.12)" />
            {/* Body shell */}
            <ellipse cx="0" cy="0" rx="9" ry="11" fill="url(#lb-shell)" stroke="#b71c1c" strokeWidth="0.8" />
            {/* Shell highlight */}
            <ellipse cx="-3" cy="-4" rx="4" ry="5" fill="rgba(255,255,255,0.22)" />
            <ellipse cx="-2" cy="-5" rx="2" ry="2.5" fill="rgba(255,255,255,0.15)" />
            {/* Center line */}
            <line x1="0" y1="-10" x2="0" y2="11" stroke="#1a1a1a" strokeWidth="1.2" />
            {/* Spots */}
            <circle cx="-4" cy="-4" r="2.2" fill="#1a1a1a" />
            <circle cx="4" cy="-4" r="2.2" fill="#1a1a1a" />
            <circle cx="-5" cy="3" r="2" fill="#1a1a1a" />
            <circle cx="5" cy="3" r="2" fill="#1a1a1a" />
            <circle cx="-3" cy="8" r="1.5" fill="#1a1a1a" />
            <circle cx="3" cy="8" r="1.5" fill="#1a1a1a" />
            <circle cx="0" cy="6" r="1.3" fill="#1a1a1a" />
            {/* Head */}
            <ellipse cx="0" cy="-12" rx="6" ry="5" fill="url(#lb-head)" stroke="#0a0a0a" strokeWidth="0.5" />
            {/* Head highlight */}
            <ellipse cx="-1.5" cy="-13.5" rx="2.2" ry="1.8" fill="rgba(255,255,255,0.18)" />
            {/* White face markings */}
            <circle cx="-2.5" cy="-11.5" r="1" fill="rgba(255,255,255,0.35)" />
            <circle cx="2.5" cy="-11.5" r="1" fill="rgba(255,255,255,0.35)" />
            {/* Eyes */}
            <circle cx="-3" cy="-12" r="1.3" fill="#212121" stroke="#111" strokeWidth="0.3" />
            <circle cx="3" cy="-12" r="1.3" fill="#212121" stroke="#111" strokeWidth="0.3" />
            <circle cx="-3.3" cy="-12.4" r="0.5" fill="rgba(255,255,255,0.6)" />
            <circle cx="2.7" cy="-12.4" r="0.5" fill="rgba(255,255,255,0.6)" />
            {/* Antennae */}
            <path d="M-2,-16 Q-5,-21 -7,-23" stroke="#1a1a1a" strokeWidth="0.8" fill="none" strokeLinecap="round" />
            <path d="M2,-16 Q5,-21 7,-23" stroke="#1a1a1a" strokeWidth="0.8" fill="none" strokeLinecap="round" />
            <circle cx="-7" cy="-23" r="1" fill="#1a1a1a" />
            <circle cx="7" cy="-23" r="1" fill="#1a1a1a" />
            {/* Legs — 6 tiny legs */}
            <path d="M-8,-2 Q-12,-1 -14,1" stroke="#1a1a1a" strokeWidth="0.7" fill="none" />
            <path d="M8,-2 Q12,-1 14,1" stroke="#1a1a1a" strokeWidth="0.7" fill="none" />
            <path d="M-9,3 Q-13,4 -15,6" stroke="#1a1a1a" strokeWidth="0.7" fill="none" />
            <path d="M9,3 Q13,4 15,6" stroke="#1a1a1a" strokeWidth="0.7" fill="none" />
            <path d="M-7,8 Q-11,10 -12,13" stroke="#1a1a1a" strokeWidth="0.7" fill="none" />
            <path d="M7,8 Q11,10 12,13" stroke="#1a1a1a" strokeWidth="0.7" fill="none" />
          </g>

          {/* ====== HONEYBEE — flying near left side ====== */}
          <g transform="translate(185, 340) rotate(-30)">
            <defs>
              <radialGradient id="bee-body" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#fff176" />
                <stop offset="30%" stopColor="#fdd835" />
                <stop offset="60%" stopColor="#f9a825" />
                <stop offset="100%" stopColor="#f57f17" />
              </radialGradient>
              <linearGradient id="bee-wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                <stop offset="50%" stopColor="rgba(220,240,255,0.4)" />
                <stop offset="100%" stopColor="rgba(200,225,245,0.2)" />
              </linearGradient>
            </defs>
            {/* Wings */}
            <ellipse cx="-8" cy="-10" rx="14" ry="6" fill="url(#bee-wingGrad)" stroke="rgba(150,200,240,0.4)" strokeWidth="0.5" transform="rotate(-15 -8 -10)" />
            <ellipse cx="8" cy="-10" rx="14" ry="6" fill="url(#bee-wingGrad)" stroke="rgba(150,200,240,0.4)" strokeWidth="0.5" transform="rotate(15 8 -10)" />
            {/* Wing veins */}
            <path d="M0,-8 Q-10,-14 -18,-12" stroke="rgba(150,190,220,0.25)" strokeWidth="0.4" fill="none" />
            <path d="M0,-8 Q10,-14 18,-12" stroke="rgba(150,190,220,0.25)" strokeWidth="0.4" fill="none" />
            {/* Wing highlights */}
            <ellipse cx="-10" cy="-12" rx="5" ry="2.5" fill="rgba(255,255,255,0.3)" transform="rotate(-15 -10 -12)" />
            <ellipse cx="10" cy="-12" rx="5" ry="2.5" fill="rgba(255,255,255,0.3)" transform="rotate(15 10 -12)" />
            {/* Abdomen */}
            <ellipse cx="0" cy="5" rx="7" ry="10" fill="url(#bee-body)" stroke="#e65100" strokeWidth="0.6" />
            {/* Black stripes */}
            <path d="M-6.5,0 Q0,-1 6.5,0" stroke="#1a1a1a" strokeWidth="2.8" fill="none" />
            <path d="M-7,4 Q0,3.5 7,4" stroke="#1a1a1a" strokeWidth="2.8" fill="none" />
            <path d="M-6,8 Q0,7.5 6,8" stroke="#1a1a1a" strokeWidth="2.5" fill="none" />
            <path d="M-4,12 Q0,11.5 4,12" stroke="#1a1a1a" strokeWidth="2" fill="none" />
            {/* Abdomen highlight */}
            <ellipse cx="-2" cy="2" rx="3" ry="5" fill="rgba(255,255,255,0.18)" />
            {/* Thorax */}
            <ellipse cx="0" cy="-6" rx="6" ry="5.5" fill="#f57f17" stroke="#e65100" strokeWidth="0.5" />
            {/* Fuzzy thorax texture — tiny hairs */}
            <ellipse cx="0" cy="-6" rx="5.5" ry="5" fill="rgba(255,248,225,0.3)" />
            {[[-3,-8],[-1,-9],[1,-9],[3,-8],[-4,-5],[4,-5],[-2,-4],[2,-4]].map(([hx,hy], hi) => (
              <line key={`hair-${hi}`} x1={hx} y1={hy} x2={hx + (hx > 0 ? 1 : -1)} y2={hy - 1}
                stroke="rgba(245,127,23,0.5)" strokeWidth="0.4" />
            ))}
            {/* Head */}
            <circle cx="0" cy="-12.5" r="4.5" fill="#f57f17" stroke="#e65100" strokeWidth="0.4" />
            <ellipse cx="-0.5" cy="-13.5" rx="2" ry="2" fill="rgba(255,255,255,0.12)" />
            {/* Eyes */}
            <ellipse cx="-2.5" cy="-13" rx="2" ry="2.2" fill="#1a1a1a" stroke="#111" strokeWidth="0.3" />
            <ellipse cx="2.5" cy="-13" rx="2" ry="2.2" fill="#1a1a1a" stroke="#111" strokeWidth="0.3" />
            <circle cx="-3" cy="-13.8" r="0.7" fill="rgba(255,255,255,0.55)" />
            <circle cx="2" cy="-13.8" r="0.7" fill="rgba(255,255,255,0.55)" />
            {/* Antennae */}
            <path d="M-1.5,-16.5 Q-3,-20 -5,-22" stroke="#4e342e" strokeWidth="0.7" fill="none" strokeLinecap="round" />
            <path d="M1.5,-16.5 Q3,-20 5,-22" stroke="#4e342e" strokeWidth="0.7" fill="none" strokeLinecap="round" />
            <circle cx="-5" cy="-22" r="0.8" fill="#4e342e" />
            <circle cx="5" cy="-22" r="0.8" fill="#4e342e" />
            {/* Stinger */}
            <path d="M0,15 L0,18" stroke="#4e342e" strokeWidth="0.8" strokeLinecap="round" />
            {/* Legs */}
            <path d="M-6,-4 Q-9,-2 -11,1" stroke="#4e342e" strokeWidth="0.6" fill="none" />
            <path d="M6,-4 Q9,-2 11,1" stroke="#4e342e" strokeWidth="0.6" fill="none" />
            <path d="M-6,0 Q-10,2 -12,5" stroke="#4e342e" strokeWidth="0.6" fill="none" />
            <path d="M6,0 Q10,2 12,5" stroke="#4e342e" strokeWidth="0.6" fill="none" />
            <path d="M-5,6 Q-8,9 -10,12" stroke="#4e342e" strokeWidth="0.6" fill="none" />
            <path d="M5,6 Q8,9 10,12" stroke="#4e342e" strokeWidth="0.6" fill="none" />
          </g>

          {/* ====== TINY FROG — sitting on left lily pad ====== */}
          <g transform="translate(210, 660)">
            <defs>
              <radialGradient id="frog-body" cx="40%" cy="30%">
                <stop offset="0%" stopColor="#a5d6a7" />
                <stop offset="30%" stopColor="#81c784" />
                <stop offset="60%" stopColor="#66bb6a" />
                <stop offset="85%" stopColor="#4caf50" />
                <stop offset="100%" stopColor="#388e3c" />
              </radialGradient>
              <radialGradient id="frog-belly" cx="50%" cy="40%">
                <stop offset="0%" stopColor="#e8f5e9" />
                <stop offset="50%" stopColor="#c8e6c9" />
                <stop offset="100%" stopColor="#a5d6a7" />
              </radialGradient>
              <radialGradient id="frog-eye" cx="35%" cy="30%">
                <stop offset="0%" stopColor="#fff9c4" />
                <stop offset="30%" stopColor="#fdd835" />
                <stop offset="60%" stopColor="#f9a825" />
                <stop offset="100%" stopColor="#f57f17" />
              </radialGradient>
            </defs>
            {/* Shadow */}
            <ellipse cx="0" cy="14" rx="14" ry="4" fill="rgba(0,0,0,0.1)" />
            {/* Back legs — folded */}
            <path d="M-8,8 Q-18,6 -20,12 Q-18,16 -12,14 Q-10,10 -8,8" fill="#4caf50" stroke="#2e7d32" strokeWidth="0.5" />
            <path d="M8,8 Q18,6 20,12 Q18,16 12,14 Q10,10 8,8" fill="#4caf50" stroke="#2e7d32" strokeWidth="0.5" />
            {/* Back feet — webbed toes */}
            <path d="M-20,12 L-24,10 M-20,12 L-25,13 M-20,12 L-23,15" stroke="#388e3c" strokeWidth="0.8" fill="none" strokeLinecap="round" />
            <path d="M20,12 L24,10 M20,12 L25,13 M20,12 L23,15" stroke="#388e3c" strokeWidth="0.8" fill="none" strokeLinecap="round" />
            {/* Body */}
            <ellipse cx="0" cy="4" rx="12" ry="9" fill="url(#frog-body)" stroke="#2e7d32" strokeWidth="0.7" />
            {/* Belly */}
            <ellipse cx="0" cy="7" rx="8" ry="5" fill="url(#frog-belly)" opacity="0.5" />
            {/* Body spots */}
            <circle cx="-5" cy="2" r="1.5" fill="rgba(46,125,50,0.3)" />
            <circle cx="4" cy="0" r="1.2" fill="rgba(46,125,50,0.25)" />
            <circle cx="1" cy="6" r="1" fill="rgba(46,125,50,0.2)" />
            {/* Body highlight */}
            <ellipse cx="-3" cy="0" rx="5" ry="4" fill="rgba(255,255,255,0.15)" />
            {/* Front legs */}
            <path d="M-10,6 Q-14,10 -13,13" stroke="#388e3c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            <path d="M10,6 Q14,10 13,13" stroke="#388e3c" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Front feet — tiny toes */}
            <path d="M-13,13 L-16,13 M-13,13 L-15,15 M-13,13 L-13,16" stroke="#388e3c" strokeWidth="0.7" fill="none" strokeLinecap="round" />
            <path d="M13,13 L16,13 M13,13 L15,15 M13,13 L13,16" stroke="#388e3c" strokeWidth="0.7" fill="none" strokeLinecap="round" />
            {/* Head */}
            <ellipse cx="0" cy="-5" rx="10" ry="7" fill="url(#frog-body)" stroke="#2e7d32" strokeWidth="0.6" />
            {/* Head highlight */}
            <ellipse cx="-2" cy="-7" rx="4" ry="3" fill="rgba(255,255,255,0.15)" />
            {/* Nostrils */}
            <circle cx="-2" cy="-2" r="0.6" fill="#2e7d32" />
            <circle cx="2" cy="-2" r="0.6" fill="#2e7d32" />
            {/* Mouth line — subtle smile */}
            <path d="M-6,-1 Q0,2 6,-1" stroke="#2e7d32" strokeWidth="0.6" fill="none" />
            {/* Eye bumps */}
            <ellipse cx="-5" cy="-9" rx="5" ry="4.5" fill="url(#frog-body)" stroke="#2e7d32" strokeWidth="0.5" />
            <ellipse cx="5" cy="-9" rx="5" ry="4.5" fill="url(#frog-body)" stroke="#2e7d32" strokeWidth="0.5" />
            {/* Eyes */}
            <circle cx="-5" cy="-10" r="3.5" fill="url(#frog-eye)" stroke="#e65100" strokeWidth="0.4" />
            <circle cx="5" cy="-10" r="3.5" fill="url(#frog-eye)" stroke="#e65100" strokeWidth="0.4" />
            {/* Pupils — horizontal slit */}
            <ellipse cx="-5" cy="-10" rx="2" ry="1.2" fill="#1a1a1a" />
            <ellipse cx="5" cy="-10" rx="2" ry="1.2" fill="#1a1a1a" />
            {/* Eye highlights */}
            <circle cx="-6" cy="-11.2" r="1" fill="rgba(255,255,255,0.65)" />
            <circle cx="4" cy="-11.2" r="1" fill="rgba(255,255,255,0.65)" />
            <circle cx="-4" cy="-9" r="0.5" fill="rgba(255,255,255,0.35)" />
            <circle cx="6" cy="-9" r="0.5" fill="rgba(255,255,255,0.35)" />
          </g>

          {/* ====== SNAIL — on the stem ====== */}
          <g transform="translate(370, 615) rotate(-5)">
            <defs>
              <radialGradient id="snail-shell" cx="45%" cy="40%">
                <stop offset="0%" stopColor="#ffe0b2" />
                <stop offset="20%" stopColor="#ffcc80" />
                <stop offset="40%" stopColor="#ffb74d" />
                <stop offset="60%" stopColor="#ffa726" />
                <stop offset="80%" stopColor="#fb8c00" />
                <stop offset="100%" stopColor="#e65100" />
              </radialGradient>
              <radialGradient id="snail-body" cx="40%" cy="30%">
                <stop offset="0%" stopColor="#d7ccc8" />
                <stop offset="40%" stopColor="#bcaaa4" />
                <stop offset="70%" stopColor="#a1887f" />
                <stop offset="100%" stopColor="#8d6e63" />
              </radialGradient>
            </defs>
            {/* Shadow */}
            <ellipse cx="-2" cy="12" rx="16" ry="3" fill="rgba(0,0,0,0.08)" />
            {/* Body / foot */}
            <path d="M-18,8 Q-20,6 -18,3 Q-14,-1 -4,-1 Q4,0 10,2 Q14,5 12,8 Q8,11 0,11 Q-10,11 -18,8 Z"
              fill="url(#snail-body)" stroke="#6d4c41" strokeWidth="0.6" />
            {/* Body highlight */}
            <ellipse cx="-6" cy="3" rx="8" ry="4" fill="rgba(255,255,255,0.12)" />
            {/* Slime trail hint */}
            <path d="M-18,8 Q-22,8 -28,9" stroke="rgba(188,170,164,0.25)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Shell */}
            <ellipse cx="4" cy="-2" rx="11" ry="10" fill="url(#snail-shell)" stroke="#bf360c" strokeWidth="0.7" />
            {/* Shell spiral */}
            <path d="M4,-2 Q8,-6 10,-2 Q10,2 6,3 Q2,2 2,0 Q3,-2 5,-1" stroke="#bf360c" strokeWidth="0.7" fill="none" opacity="0.5" />
            <path d="M4,-2 Q6,-4 8,-2 Q8,0 5,1" stroke="#bf360c" strokeWidth="0.5" fill="none" opacity="0.4" />
            <circle cx="5" cy="-1" r="2" fill="rgba(191,54,12,0.15)" />
            {/* Shell highlight */}
            <ellipse cx="0" cy="-6" rx="5" ry="4" fill="rgba(255,255,255,0.22)" />
            <ellipse cx="-1" cy="-7" rx="2.5" ry="2" fill="rgba(255,255,255,0.12)" />
            {/* Shell growth lines */}
            <path d="M-5,4 Q-4,-4 2,-9" stroke="rgba(191,54,12,0.18)" strokeWidth="0.5" fill="none" />
            <path d="M-3,6 Q-1,-2 6,-7" stroke="rgba(191,54,12,0.15)" strokeWidth="0.5" fill="none" />
            <path d="M1,7 Q3,0 9,-4" stroke="rgba(191,54,12,0.12)" strokeWidth="0.5" fill="none" />
            {/* Head */}
            <ellipse cx="-14" cy="2" rx="5" ry="4" fill="url(#snail-body)" stroke="#6d4c41" strokeWidth="0.4" />
            {/* Eye stalks */}
            <path d="M-16,-1 Q-18,-6 -20,-9" stroke="#8d6e63" strokeWidth="1" fill="none" strokeLinecap="round" />
            <path d="M-12,-1 Q-13,-6 -14,-9" stroke="#8d6e63" strokeWidth="1" fill="none" strokeLinecap="round" />
            {/* Eyes on stalks */}
            <circle cx="-20" cy="-9" r="1.8" fill="#5d4037" stroke="#4e342e" strokeWidth="0.3" />
            <circle cx="-14" cy="-9" r="1.8" fill="#5d4037" stroke="#4e342e" strokeWidth="0.3" />
            <circle cx="-20.5" cy="-9.8" r="0.7" fill="rgba(255,255,255,0.5)" />
            <circle cx="-14.5" cy="-9.8" r="0.7" fill="rgba(255,255,255,0.5)" />
            {/* Lower tentacles */}
            <path d="M-17,3 Q-19,4 -20,3" stroke="#8d6e63" strokeWidth="0.6" fill="none" />
            <path d="M-15,4 Q-17,5 -18,4" stroke="#8d6e63" strokeWidth="0.6" fill="none" />
          </g>

          {/* ====== TINY BUTTERFLY — small, resting on right lily pad ====== */}
          <g transform="translate(530, 678) rotate(-10)">
            <defs>
              <radialGradient id="bf-wing" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#ce93d8" />
                <stop offset="35%" stopColor="#ab47bc" />
                <stop offset="70%" stopColor="#8e24aa" />
                <stop offset="100%" stopColor="#6a1b9a" />
              </radialGradient>
            </defs>
            {/* Wings — folded upward (resting) */}
            {/* Left wing */}
            <path d="M0,0 Q-10,-14 -6,-22 Q-2,-26 2,-20 Q4,-12 0,0" fill="url(#bf-wing)" stroke="#4a148c" strokeWidth="0.5" opacity="0.85" />
            <ellipse cx="-3" cy="-14" rx="2" ry="3" fill="rgba(255,255,255,0.3)" />
            <circle cx="-4" cy="-18" r="1" fill="rgba(255,255,255,0.25)" />
            <circle cx="-2" cy="-10" r="1.2" fill="rgba(78,21,148,0.3)" />
            {/* Right wing */}
            <path d="M0,0 Q10,-14 6,-22 Q2,-26 -2,-20 Q-4,-12 0,0" fill="url(#bf-wing)" stroke="#4a148c" strokeWidth="0.5" opacity="0.85" />
            <ellipse cx="3" cy="-14" rx="2" ry="3" fill="rgba(255,255,255,0.3)" />
            <circle cx="4" cy="-18" r="1" fill="rgba(255,255,255,0.25)" />
            <circle cx="2" cy="-10" r="1.2" fill="rgba(78,21,148,0.3)" />
            {/* Lower wings */}
            <path d="M0,0 Q-7,-4 -8,-10 Q-6,-12 -2,-8 Q0,-4 0,0" fill="url(#bf-wing)" stroke="#4a148c" strokeWidth="0.4" opacity="0.7" />
            <path d="M0,0 Q7,-4 8,-10 Q6,-12 2,-8 Q0,-4 0,0" fill="url(#bf-wing)" stroke="#4a148c" strokeWidth="0.4" opacity="0.7" />
            {/* Body */}
            <ellipse cx="0" cy="-1" rx="1.2" ry="5" fill="#1a1a1a" />
            <ellipse cx="-0.3" cy="-2" rx="0.6" ry="3" fill="rgba(100,100,100,0.3)" />
            {/* Head */}
            <circle cx="0" cy="-6.5" r="1.5" fill="#1a1a1a" />
            {/* Antennae */}
            <path d="M-0.5,-8 Q-3,-12 -4,-14" stroke="#1a1a1a" strokeWidth="0.4" fill="none" strokeLinecap="round" />
            <path d="M0.5,-8 Q3,-12 4,-14" stroke="#1a1a1a" strokeWidth="0.4" fill="none" strokeLinecap="round" />
            <circle cx="-4" cy="-14" r="0.6" fill="#1a1a1a" />
            <circle cx="4" cy="-14" r="0.6" fill="#1a1a1a" />
          </g>
        </svg>
      </div>
    </div>
      {/* Technical Info Button */}
      <button
        onClick={() => setShowTech(!showTech)}
        style={{
          position: "absolute",
          bottom: "max(12px, 2vh)",
          left: "max(12px, 2vh)",
          zIndex: 20,
          background: "rgba(255,255,255,0.15)",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 8,
          padding: "8px 14px",
          fontSize: "clamp(12px, 3.5vw, 14px)",
          fontWeight: 600,
          cursor: "pointer",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          minHeight: 36,
        }}
      >
        {showTech ? "Close" : "ℹ️ Tech"}
      </button>

      {/* Technical Info Panel */}
      {showTech && (
        <div
          onClick={() => setShowTech(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 19,
            background: "rgba(0,0,0,0.7)",
            padding: "max(16px, 4vw)",
            overflowY: "auto",
            WebkitOverflowScrolling: "touch",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "rgba(10, 15, 28, 0.95)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14,
              padding: "max(20px, 5vw)",
              maxWidth: 520,
              width: "100%",
              margin: "0 auto",
              marginTop: "max(20px, 5vh)",
              marginBottom: "max(20px, 5vh)",
              color: "#e2e8f0",
              fontSize: "clamp(15px, 4.5vw, 17px)",
              lineHeight: 1.65,
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <h2 style={{ margin: "0 0 14px", fontSize: "clamp(20px, 6vw, 24px)", color: "#fbbf24", fontWeight: 700 }}>
              How It Was Built
            </h2>
            <p style={{ margin: "0 0 16px", opacity: 0.9 }}>
              A two-layer digital art piece: procedural canvas animation + hand-coded SVG illustration.
            </p>

            <h3 style={{ margin: "16px 0 8px", fontSize: "clamp(16px, 5vw, 18px)", color: "#60a5fa", fontWeight: 600 }}>🎨 Canvas Layer</h3>
            <ul style={{ margin: 0, paddingLeft: "max(20px, 6vw)", opacity: 0.9 }}>
              <li>120 stars with individual twinkle phases</li>
              <li>Procedural moon with craters & god rays</li>
              <li>Sine-wave mountain terrain (multi-octave)</li>
              <li>8 village houses with animated smoke & windows</li>
              <li>Reflective water with moon shimmer & ripples</li>
              <li>4 Vesak lantern styles: Atapattam, Tharuka, Nelum, Cyber</li>
              <li>Dagoba with bell-curve dome & pulsing chuda</li>
            </ul>

            <h3 style={{ margin: "16px 0 8px", fontSize: "clamp(16px, 5vw, 18px)", color: "#f472b6", fontWeight: 600 }}>🪷 SVG Layer</h3>
            <ul style={{ margin: 0, paddingLeft: "max(20px, 6vw)", opacity: 0.9 }}>
              <li>5 layers of petals (9+8+7+6+5) with gradients</li>
              <li>24 stamens with pollen particles</li>
              <li>Seed pod with 18 seeds in concentric rings</li>
              <li>6 creatures: dragonfly, ladybug, bee, frog, snail, butterfly</li>
              <li>Dew drops with rainbow caustics</li>
            </ul>

            <h3 style={{ margin: "16px 0 8px", fontSize: "clamp(16px, 5vw, 18px)", color: "#34d399", fontWeight: 600 }}>⚙️ Tech Stack</h3>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Next.js 16 · React 19 · TypeScript · HTML5 Canvas 2D · SVG · Tailwind CSS v4
            </p>

            <p style={{ margin: "16px 0 0", fontSize: "clamp(12px, 3.5vw, 14px)", opacity: 0.6, textAlign: "center" }}>
              IEEE Vesak Verse 26 — Where Tradition Meets the Glow of Innovation
            </p>
          </div>
        </div>
      )}
    </LotusBackground>
    </>
  );
}
