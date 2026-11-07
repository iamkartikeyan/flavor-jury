"use client";

/**
 * MoleculeField — the living canvas.
 * A pseudo-3D network of compound nodes drifting in space, projected with
 * perspective, reacting to the pointer. Used behind the hero, the processing
 * overlay and as ambient decoration. Pure canvas — no heavy 3D deps.
 */

import { useEffect, useRef } from "react";

interface Node {
  x: number; y: number; z: number;
  r: number; hue: number;
  vx: number; vy: number; vz: number;
}

interface Pulse {
  a: number; b: number; t: number; speed: number;
}

export default function MoleculeField({
  density = 64,
  className = "",
  interactive = true,
  speed = 1,
  opacity = 1,
}: {
  density?: number;
  className?: string;
  interactive?: boolean;
  speed?: number;
  opacity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let w = 0, h = 0, dpr = Math.min(2, window.devicePixelRatio || 1);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* seed nodes in a flattened ellipsoid volume */
    const nodes: Node[] = [];
    for (let i = 0; i < density; i++) {
      const golden = i * 2.399963;
      const rad = 0.72 * Math.sqrt((i + 0.5) / density);
      nodes.push({
        x: Math.cos(golden) * rad * 1.35,
        y: Math.sin(golden * 1.7) * rad * 0.9,
        z: Math.sin(golden) * rad * 1.1,
        r: 1.2 + Math.random() * 2.1,
        hue: Math.random() < 0.12 ? 38 : 158 + Math.random() * 14,
        vx: (Math.random() - 0.5) * 0.0011,
        vy: (Math.random() - 0.5) * 0.0011,
        vz: (Math.random() - 0.5) * 0.0011,
      });
    }

    const pulses: Pulse[] = [];
    let lastPulse = 0;
    let rotY = 0, rotX = -0.12;
    let t0 = performance.now();

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.current.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouse.current.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    if (interactive) window.addEventListener("pointermove", onMove, { passive: true });

    const project = (n: Node) => {
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      let x = n.x * cosY - n.z * sinY;
      let z = n.x * sinY + n.z * cosY;
      let y = n.y * cosX - z * sinX;
      z = n.y * sinX + z * cosX;
      const persp = Math.max(0.05, 2.6 / Math.max(0.05, 2.6 + z));
      return { sx: w / 2 + x * persp * (h / 2.1), sy: h / 2 + y * persp * (h / 2.1), persp, z };
    };

    const frame = (now: number) => {
      const dt = Math.min(50, now - t0); t0 = now;
      if (!reduced) {
        rotY += 0.00016 * dt * speed;
        mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.035;
        mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.035;
        rotY += mouse.current.x * 0.00035 * dt * speed;
        rotX = -0.12 + mouse.current.y * 0.14;
        for (const n of nodes) {
          n.x += n.vx * dt * speed; n.y += n.vy * dt * speed; n.z += n.vz * dt * speed;
          /* soft containment — reflect at the ellipsoid boundary so the cloud
             never drifts into the perspective singularity (z ≤ -2.6) */
          if (n.x > 1.35) { n.x = 1.35; n.vx = -Math.abs(n.vx); }
          else if (n.x < -1.35) { n.x = -1.35; n.vx = Math.abs(n.vx); }
          if (n.y > 0.9) { n.y = 0.9; n.vy = -Math.abs(n.vy); }
          else if (n.y < -0.9) { n.y = -0.9; n.vy = Math.abs(n.vy); }
          if (n.z > 1.1) { n.z = 1.1; n.vz = -Math.abs(n.vz); }
          else if (n.z < -1.1) { n.z = -1.1; n.vz = Math.abs(n.vz); }
        }
      }

      ctx.clearRect(0, 0, w, h);
      const pts = nodes.map(project);

      /* bonds */
      const bonds: [number, number, number][] = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, dz = nodes[i].z - nodes[j].z;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d < 0.42) {
            bonds.push([i, j, d]);
            const a = (1 - d / 0.42) * 0.38 * Math.min(pts[i].persp, pts[j].persp);
            ctx.strokeStyle = `hsla(155, 52%, 34%, ${a * opacity})`;
            ctx.lineWidth = Math.min(pts[i].persp, pts[j].persp) * 0.9;
            ctx.beginPath();
            ctx.moveTo(pts[i].sx, pts[i].sy);
            ctx.lineTo(pts[j].sx, pts[j].sy);
            ctx.stroke();
          }
        }
      }

      /* signal pulses travelling along bonds */
      if (!reduced && now - lastPulse > 260 && bonds.length > 0) {
        lastPulse = now;
        const [a, b] = bonds[Math.floor(Math.random() * bonds.length)];
        pulses.push({ a, b, t: 0, speed: 0.0016 + Math.random() * 0.0016 });
        if (pulses.length > 14) pulses.shift();
      }
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += p.speed * dt;
        if (p.t >= 1) { pulses.splice(i, 1); continue; }
        const x = pts[p.a].sx + (pts[p.b].sx - pts[p.a].sx) * p.t;
        const y = pts[p.a].sy + (pts[p.b].sy - pts[p.a].sy) * p.t;
        const fade = Math.sin(p.t * Math.PI);
        ctx.fillStyle = `hsla(152, 72%, 26%, ${0.95 * fade * opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `hsla(152, 72%, 26%, ${0.16 * fade * opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, 5.5, 0, Math.PI * 2);
        ctx.fill();
      }

      /* atoms */
      nodes.forEach((n, i) => {
        const p = pts[i];
        const rr = Math.max(0.2, n.r * p.persp);
        ctx.fillStyle = `hsla(${n.hue}, ${n.hue < 100 ? 80 : 48}%, ${n.hue < 100 ? 52 : 38}%, ${0.14 * opacity})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, rr * 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `hsla(${n.hue}, ${n.hue < 100 ? 86 : 52}%, ${n.hue < 100 ? 46 : 36}%, ${0.9 * opacity})`;
        ctx.beginPath();
        ctx.arc(p.sx, p.sy, rr, 0, Math.PI * 2);
        ctx.fill();
      });

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (interactive) window.removeEventListener("pointermove", onMove);
    };
  }, [density, interactive, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`h-full w-full ${className}`}
    />
  );
}
