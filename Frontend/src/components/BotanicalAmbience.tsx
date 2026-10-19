import { useEffect, useRef } from 'react';

interface Firefly {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  fadeSpeed: number;
  color: string;
}

const FIREFLY_COLORS = ['#38bdf8', '#7dd3fc', '#f472b6', '#f9a8d4', '#ffd700', '#bae6fd', '#fbcfe8'];

export function BotanicalAmbience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Glowing sky blue & pink celestial fireflies & floating light orbs
    const count = Math.min(45, Math.floor(width / 30));
    const fireflies: Firefly[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 2 + Math.random() * 3.5,
      speedX: (Math.random() - 0.5) * 0.45,
      speedY: -0.2 - Math.random() * 0.4,
      opacity: 0.2 + Math.random() * 0.7,
      fadeSpeed: (Math.random() - 0.5) * 0.015,
      color: FIREFLY_COLORS[Math.floor(Math.random() * FIREFLY_COLORS.length)],
    }));

    // Twinkling stars background points
    const starCount = 80;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.6,
      twinkleSpeed: 0.01 + Math.random() * 0.02,
    }));

    let t = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.02;

      // Draw subtle stars
      stars.forEach((s) => {
        const flicker = Math.sin(t * 2 + s.x) * 0.3;
        ctx.fillStyle = `rgba(224, 242, 254, ${Math.max(0.1, s.alpha + flicker)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw floating glowing fireflies
      fireflies.forEach((f) => {
        f.x += f.speedX + Math.sin(t + f.y * 0.01) * 0.3;
        f.y += f.speedY;
        f.opacity += f.fadeSpeed;

        if (f.opacity <= 0.15 || f.opacity >= 0.9) {
          f.fadeSpeed = -f.fadeSpeed;
        }

        if (f.y < -10) {
          f.y = height + 10;
          f.x = Math.random() * width;
        }
        if (f.x < -10) f.x = width + 10;
        if (f.x > width + 10) f.x = -10;

        // Firefly outer glow
        ctx.save();
        ctx.globalAlpha = f.opacity * 0.4;
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Firefly core
        ctx.globalAlpha = f.opacity;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Deep sky twilight romantic gradient with soft pink glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#172554]/60 via-[#1e1b4b]/40 to-[#060e1e]" />
      {/* Canvas for stars and fireflies */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
