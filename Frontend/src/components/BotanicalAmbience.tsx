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

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  opacity: number;
  active: boolean;
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

    // Celestial Fireflies
    const count = Math.min(38, Math.floor(width / 35));
    const fireflies: Firefly[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1.8 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -0.2 - Math.random() * 0.35,
      opacity: 0.2 + Math.random() * 0.65,
      fadeSpeed: (Math.random() - 0.5) * 0.012,
      color: FIREFLY_COLORS[Math.floor(Math.random() * FIREFLY_COLORS.length)],
    }));

    // Twinkling Celestial Stars
    const starCount = 75;
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 0.8 + Math.random() * 1.5,
      alpha: 0.2 + Math.random() * 0.6,
      twinkleSpeed: 0.01 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
    }));

    // Occasional gentle shooting star
    const shootingStar: ShootingStar = {
      x: 0,
      y: 0,
      length: 80,
      speed: 12,
      angle: Math.PI / 4,
      opacity: 0,
      active: false,
    };

    let nextShootingStarTime = Date.now() + 3000;

    let t = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      t += 0.02;

      // Draw subtle stars
      stars.forEach((s) => {
        const flicker = Math.sin(t * 1.8 + s.phase) * 0.3;
        ctx.fillStyle = `rgba(224, 242, 254, ${Math.max(0.1, s.alpha + flicker)})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Handle shooting stars
      const now = Date.now();
      if (!shootingStar.active && now > nextShootingStarTime) {
        shootingStar.active = true;
        shootingStar.x = Math.random() * (width * 0.7);
        shootingStar.y = Math.random() * (height * 0.35);
        shootingStar.opacity = 1;
        shootingStar.speed = 10 + Math.random() * 6;
        nextShootingStarTime = now + 7000 + Math.random() * 8000;
      }

      if (shootingStar.active) {
        ctx.save();
        const grad = ctx.createLinearGradient(
          shootingStar.x,
          shootingStar.y,
          shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
          shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
        );
        grad.addColorStop(0, `rgba(255, 255, 255, ${shootingStar.opacity})`);
        grad.addColorStop(0.3, `rgba(244, 114, 182, ${shootingStar.opacity * 0.8})`);
        grad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(
          shootingStar.x - Math.cos(shootingStar.angle) * shootingStar.length,
          shootingStar.y - Math.sin(shootingStar.angle) * shootingStar.length
        );
        ctx.stroke();
        ctx.restore();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.018;

        if (shootingStar.opacity <= 0) {
          shootingStar.active = false;
        }
      }

      // Draw floating glowing fireflies
      fireflies.forEach((f) => {
        f.x += f.speedX + Math.sin(t + f.y * 0.01) * 0.25;
        f.y += f.speedY;
        f.opacity += f.fadeSpeed;

        if (f.opacity <= 0.15 || f.opacity >= 0.85) {
          f.fadeSpeed = -f.fadeSpeed;
        }

        if (f.y < -10) {
          f.y = height + 10;
          f.x = Math.random() * width;
        }
        if (f.x < -10) f.x = width + 10;
        if (f.x > width + 10) f.x = -10;

        // Outer glow
        ctx.save();
        ctx.globalAlpha = f.opacity * 0.35;
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * 3.2, 0, Math.PI * 2);
        ctx.fill();

        // Core
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
      {/* Deep sky twilight romantic gradient with soft ambient aurora glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0c203f]/75 via-[#0c162d]/60 to-[#040813]" />

      {/* Soft celestial purple & pink aura glow in top corners */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#38bdf8]/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-[#ec4899]/10 blur-[110px] pointer-events-none" />

      {/* Canvas for stars, fireflies, and shooting stars */}
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
