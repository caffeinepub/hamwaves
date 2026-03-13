import { useEffect, useRef } from "react";

export default function RadioWavesBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Draw horizontal sine waves
      for (let i = 0; i < 6; i++) {
        const yBase = (h / 7) * (i + 1);
        const amp = 12 + i * 4;
        const freq = 0.006 + i * 0.0008;
        const speed = 0.4 + i * 0.1;
        const alpha = 0.04 + (i % 2 === 0 ? 0.02 : 0);

        ctx.beginPath();
        ctx.moveTo(0, yBase);
        for (let x = 0; x < w; x += 2) {
          const y = yBase + Math.sin(x * freq + t * speed) * amp;
          ctx.lineTo(x, y);
        }
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, "rgba(0,240,255,0)");
        grad.addColorStop(0.3, `rgba(0,240,255,${alpha})`);
        grad.addColorStop(0.7, `rgba(168,85,247,${alpha})`);
        grad.addColorStop(1, "rgba(168,85,247,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw concentric arcs from center-bottom
      const cx = w * 0.5;
      const cy = h * 1.1;
      for (let r = 100; r < w * 0.8; r += 80) {
        const progress = (r % 320) / 320;
        const alpha = Math.max(0, 0.08 - progress * 0.08);
        ctx.beginPath();
        ctx.arc(cx, cy, r + ((t * 30) % 80), Math.PI * 1.1, Math.PI * 1.9);
        ctx.strokeStyle = `rgba(0,240,255,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      t += 0.015;
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
