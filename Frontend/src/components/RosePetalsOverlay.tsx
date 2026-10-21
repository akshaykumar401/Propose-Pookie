import { useEffect, useRef } from 'react';

interface FallingPetal {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  swaySpeed: number;
  swayPhase: number;
  opacity: number;
  color: string;
  isHeart: boolean;
}

const PETAL_COLORS = [
  '#f472b6', // soft rose pink
  '#fb7185', // coral rose
  '#ec4899', // vivid romantic pink
  '#fda4af', // delicate blush
  '#ffd700', // golden stardust
  '#fbcfe8', // pastel pink
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

    const count = Math.min(28, Math.floor(width / 45));
    const petals: FallingPetal[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 8 + Math.random() * 10,
      speedY: 0.6 + Math.random() * 0.9,
      speedX: (Math.random() - 0.5) * 0.4,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      swaySpeed: 0.015 + Math.random() * 0.02,
      swayPhase: Math.random() * Math.PI * 2,
      opacity: 0.25 + Math.random() * 0.4,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
      isHeart: Math.random() > 0.65,
    }));

    const drawPetal = (p: FallingPetal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;

      if (p.isHeart) {
        // Floating mini heart mote
        const s = p.size * 0.55;
        ctx.beginPath();
        ctx.moveTo(0, s * 0.3);
        ctx.bezierCurveTo(-s, -s * 0.6, -s * 1.3, s * 0.6, 0, s * 1.3);
        ctx.bezierCurveTo(s * 1.3, s * 0.6, s, -s * 0.6, 0, s * 0.3);
        ctx.fill();
      } else {
        // Natural curved rose petal
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.3, p.size * 0.6, p.size * 0.7, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.7, -p.size * 0.7, -p.size * 0.3, 0, -p.size);
        ctx.fill();

        // Subtle soft highlight
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.6);
        ctx.lineTo(0, p.size * 0.6);
        ctx.stroke();
      }

      ctx.restore();
    };

    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      petals.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(time * 1.2 + p.swayPhase) * 0.7;
        p.rotation += p.rotationSpeed;

        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
        }
        if (p.x > width + 20) p.x = -20;
        if (p.x < -20) p.x = width + 20;

        drawPetal(p);
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
      className="pointer-events-none fixed inset-0 z-[2]"
      style={{ opacity: 0.75 }}
    />
  );
}
