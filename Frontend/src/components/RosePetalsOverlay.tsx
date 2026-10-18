import { useEffect, useRef } from 'react';

interface FallingFlora {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  isLeaf: boolean;
}

const FLORA_COLORS = [
  '#a3d9b8', // light sage
  '#74c69d', // fresh mint
  '#52b788', // emerald leaf
  '#b7e4c7', // pale mint
  '#ffb4c2', // blush petal
  '#f7d070', // gold sparkle
];

export function RosePetalsOverlay() {
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

    const count = Math.min(36, Math.floor(width / 38));
    const items: FallingFlora[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 10 + Math.random() * 14,
      speedY: 0.5 + Math.random() * 1.1,
      speedX: (Math.random() - 0.5) * 0.7,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.025,
      opacity: 0.35 + Math.random() * 0.45,
      color: FLORA_COLORS[Math.floor(Math.random() * FLORA_COLORS.length)],
      isLeaf: Math.random() > 0.45,
    }));

    const drawLeaf = (f: FallingFlora) => {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rotation);
      ctx.globalAlpha = f.opacity;
      ctx.fillStyle = f.color;

      ctx.beginPath();
      ctx.moveTo(0, -f.size);
      ctx.quadraticCurveTo(f.size * 0.6, 0, 0, f.size);
      ctx.quadraticCurveTo(-f.size * 0.6, 0, 0, -f.size);
      ctx.fill();

      // Leaf center rib
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -f.size * 0.8);
      ctx.lineTo(0, f.size * 0.8);
      ctx.stroke();

      ctx.restore();
    };

    let wind = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      wind += 0.007;

      items.forEach((f) => {
        f.y += f.speedY;
        f.x += f.speedX + Math.sin(wind + f.y * 0.006) * 0.7;
        f.rotation += f.rotationSpeed;

        if (f.y > height + 25) {
          f.y = -25;
          f.x = Math.random() * width;
        }
        if (f.x > width + 25) f.x = -25;
        if (f.x < -25) f.x = width + 25;

        drawLeaf(f);
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
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20"
      style={{ opacity: 0.88 }}
    />
  );
}
