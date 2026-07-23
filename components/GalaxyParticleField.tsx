"use client";

import { useEffect, useRef } from "react";

type Particle = {
  galaxy: 0 | 1 | 2;
  angle: number;
  radius: number;
  depth: number;
  speed: number;
  phase: number;
  size: number;
  hue: number;
};

function seededRandom(seed: number) {
  const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

export function GalaxyParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const particles: Particle[] = Array.from({ length: 1950 }, (_, index) => {
      const galaxy = (index % 3) as 0 | 1 | 2;
      const baseHue = galaxy === 0 ? 205 : galaxy === 1 ? 325 : 24;
      return {
        galaxy,
        angle: seededRandom(index + 1) * Math.PI * 2,
        radius: Math.pow(seededRandom(index + 17), 0.58),
        depth: seededRandom(index + 31),
        speed: 0.000025 + seededRandom(index + 43) * 0.000055,
        phase: seededRandom(index + 59) * Math.PI * 2,
        size: 0.35 + seededRandom(index + 71) * 1.25,
        hue: baseHue + seededRandom(index + 83) * (galaxy === 2 ? 28 : 30),
      };
    });

    let width = 0;
    let height = 0;
    let frame = 0;
    let animationId = 0;
    let lastTime = performance.now();
    const pointer = { x: -1000, y: -1000, tx: -1000, ty: -1000 };
    const camera = { x: 0, y: 0, tx: 0, ty: 0 };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.6);
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.tx = event.clientX;
      pointer.ty = event.clientY;
      camera.tx = (event.clientX / width - 0.5) * 15;
      camera.ty = (event.clientY / height - 0.5) * 10;
    };

    const onPointerLeave = () => {
      pointer.tx = -1000;
      pointer.ty = -1000;
      camera.tx = 0;
      camera.ty = 0;
    };

    const draw = (time: number) => {
      const delta = Math.min(time - lastTime, 32);
      lastTime = time;
      frame += delta;
      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      camera.x += (camera.tx - camera.x) * 0.035;
      camera.y += (camera.ty - camera.y) * 0.035;
      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = "lighter";

      for (const particle of particles) {
        const systemAngle = -Math.PI / 2 + (frame / 180000) * Math.PI * 2 + particle.galaxy * (Math.PI * 2 / 3);
        const stageHeight = Math.max(420, height - 215);
        const centerX = width * (0.5 + Math.cos(systemAngle) * 0.27) + camera.x * (0.5 + particle.depth);
        const centerY = 160 + stageHeight * (0.515 + Math.sin(systemAngle) * 0.215) + camera.y * (0.5 + particle.depth);
        const maxRadiusX = width * 0.148;
        const maxRadiusY = height * 0.205;
        const spiral = particle.angle + frame * particle.speed + particle.radius * 4.2;
        const breath = 1 + Math.sin(frame * 0.00023 + particle.phase) * 0.035;
        const wave = Math.sin(spiral * 2.7 + particle.phase) * 0.11;
        let x = centerX + Math.cos(spiral) * maxRadiusX * particle.radius * breath;
        let y = centerY + Math.sin(spiral) * maxRadiusY * particle.radius * (0.52 + particle.depth * 0.34) + wave * maxRadiusY;
        x += Math.sin(frame * 0.00012 + particle.phase) * 7 * particle.depth;

        const dx = x - pointer.x;
        const dy = y - pointer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - distance / 125);
        if (influence > 0 && distance > 1) {
          x += (dx / distance) * influence * 10;
          y += (dy / distance) * influence * 10;
        }

        const coreGlow = Math.max(0, 1 - particle.radius) * 0.48;
        const alpha = 0.1 + particle.depth * 0.42 + coreGlow + influence * 0.48;
        const size = particle.size * (0.65 + particle.depth * 0.75) + influence * 1.5;
        context.beginPath();
        context.arc(x, y, size, 0, Math.PI * 2);
        context.fillStyle = `hsla(${particle.hue}, 92%, ${61 + particle.depth * 22}%, ${Math.min(alpha, 0.92)})`;
        context.fill();

        if (influence > 0.38) {
          context.beginPath();
          context.moveTo(x, y);
          context.lineTo(x - dx * 0.055, y - dy * 0.055);
          context.strokeStyle = `hsla(${particle.hue}, 100%, 78%, ${influence * 0.24})`;
          context.lineWidth = 0.5;
          context.stroke();
        }
      }

      context.globalCompositeOperation = "source-over";
      animationId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    document.documentElement.addEventListener("mouseleave", onPointerLeave);
    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
    };
  }, []);

  return <canvas className="galaxy-particle-field" ref={canvasRef} aria-hidden="true" />;
}
