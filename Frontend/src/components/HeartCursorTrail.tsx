import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

export function HeartCursorTrail() {
  const [isDesktop, setIsDesktop] = useState(false);
  const outerRingRef = useRef<HTMLDivElement | null>(null);
  const hoverBadgeRef = useRef<HTMLDivElement | null>(null);
  const rippleRingRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only enable on desktop pointer devices with hover capability
    const checkIsDesktop = () => {
      const finePointer =
        typeof window !== 'undefined' &&
        window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      setIsDesktop(finePointer);
    };

    checkIsDesktop();
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    mediaQuery.addEventListener('change', checkIsDesktop);

    return () => mediaQuery.removeEventListener('change', checkIsDesktop);
  }, []);

  useEffect(() => {
    if (!isDesktop) return;

    const outerRing = outerRingRef.current;
    const hoverBadge = hoverBadgeRef.current;
    const rippleRing = rippleRingRef.current;
    const canvas = canvasRef.current;
    if (!outerRing || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Initial position off-screen
    gsap.set([outerRing, rippleRing], {
      xPercent: -50,
      yPercent: -50,
      x: -100,
      y: -100,
      opacity: 0,
    });

    // Snappy, silky smooth trailing follower physics
    const xRingTo = gsap.quickTo(outerRing, 'x', { duration: 0.14, ease: 'power2.out' });
    const yRingTo = gsap.quickTo(outerRing, 'y', { duration: 0.14, ease: 'power2.out' });

    // Particle system for floating leaves, glowing hearts, and diamond sparkles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      decay: number;
      rotation: number;
      vRot: number;
      type: 'diamond' | 'heart' | 'leaf' | 'ember';
    }

    const particles: Particle[] = [];
    const colors = ['#ffd700', '#74c69d', '#52b788', '#ff9ebb', '#ffffff', '#ff4d6d', '#f7d070'];

    const createSparkle = (x: number, y: number, count = 1, isBurst = false) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = isBurst ? Math.random() * 4.2 + 1.5 : Math.random() * 1.2 + 0.3;
        const rand = Math.random();
        const type: Particle['type'] = rand > 0.7 ? 'heart' : rand > 0.4 ? 'diamond' : rand > 0.2 ? 'leaf' : 'ember';

        particles.push({
          x: x + (Math.random() - 0.5) * 8,
          y: y + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed + (isBurst ? -0.5 : 0.15),
          size: isBurst ? Math.random() * 4.5 + 2.5 : Math.random() * 2.8 + 1.2,
          color: type === 'heart' ? (Math.random() > 0.5 ? '#ff4d6d' : '#ff9ebb') : colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: isBurst ? Math.random() * 0.02 + 0.012 : Math.random() * 0.028 + 0.018,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.08,
          type,
        });
      }
    };

    let isHovered = false;
    let hasMoved = false;
    let lastX = -100;
    let lastY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;

      if (!hasMoved) {
        hasMoved = true;
        gsap.to(outerRing, { opacity: 1, duration: 0.25 });
        lastX = x;
        lastY = y;
      }

      xRingTo(x);
      yRingTo(y);

      // Interpolate stardust particles between fast movements for unbroken fairy dust trails
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);

      if (dist > 4) {
        const steps = Math.min(5, Math.floor(dist / 12));
        for (let i = 1; i <= steps; i++) {
          const interpX = lastX + (dx * i) / steps;
          const interpY = lastY + (dy * i) / steps;
          if (Math.random() > 0.35) {
            createSparkle(interpX, interpY, 1, false);
          }
        }
      }

      lastX = x;
      lastY = y;

      // Check if hovering over interactive elements
      const target = e.target as HTMLElement | null;
      const interactive = !!target?.closest(
        'button, a, input, select, textarea, [role="button"], .cursor-pointer, [data-interactive="true"], [onclick], label'
      );

      if (interactive !== isHovered) {
        isHovered = interactive;
        if (isHovered) {
          gsap.to(outerRing, {
            scale: 1.6,
            borderColor: '#ffd700',
            backgroundColor: 'rgba(45, 106, 79, 0.35)',
            boxShadow: '0 0 25px rgba(255, 215, 0, 0.85), 0 0 40px rgba(82, 183, 136, 0.6)',
            duration: 0.22,
            ease: 'back.out(1.6)',
          });
          if (hoverBadge) {
            gsap.to(hoverBadge, {
              scale: 1,
              opacity: 1,
              duration: 0.2,
              ease: 'back.out(2)',
            });
          }
        } else {
          gsap.to(outerRing, {
            scale: 1,
            borderColor: 'rgba(116, 198, 157, 0.85)',
            backgroundColor: 'rgba(19, 51, 36, 0.2)',
            boxShadow: '0 0 14px rgba(82, 183, 136, 0.45)',
            duration: 0.22,
            ease: 'power2.out',
          });
          if (hoverBadge) {
            gsap.to(hoverBadge, {
              scale: 0.2,
              opacity: 0,
              duration: 0.15,
            });
          }
        }
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      gsap.to(outerRing, { scale: isHovered ? 1.3 : 0.75, duration: 0.1 });

      // Trigger radiating shockwave ripple ring
      if (rippleRing) {
        gsap.killTweensOf(rippleRing);
        gsap.set(rippleRing, {
          x: e.clientX,
          y: e.clientY,
          scale: 0.5,
          opacity: 0.9,
          borderColor: '#ffd700',
        });
        gsap.to(rippleRing, {
          scale: 2.2,
          opacity: 0,
          duration: 0.45,
          ease: 'power2.out',
        });
      }
    };

    const handleMouseUp = () => {
      gsap.to(outerRing, { scale: isHovered ? 1.6 : 1, duration: 0.2, ease: 'back.out(1.6)' });
    };

    const handleClick = (e: MouseEvent) => {
      createSparkle(e.clientX, e.clientY, 16, true);
    };

    const handleMouseEnter = () => {
      gsap.to(outerRing, { opacity: 1, duration: 0.2 });
    };

    const handleMouseLeave = () => {
      gsap.to(outerRing, { opacity: 0, duration: 0.2 });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', handleClick);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Continuous 60fps/120fps hardware canvas animation for sparkles, hearts, and leaves
    const ticker = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.type === 'heart') {
          // Romantic Glowing Mini Heart
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          const s = p.size * 0.9;
          ctx.moveTo(0, s * 0.35);
          ctx.bezierCurveTo(-s, -s * 0.5, -s * 1.3, s * 0.5, 0, s * 1.3);
          ctx.bezierCurveTo(s * 1.3, s * 0.5, s, -s * 0.5, 0, s * 0.35);
          ctx.fill();
        } else if (p.type === 'leaf') {
          // Gentle Botanical Mint Leaf
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.6, p.size * 0.8, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'ember') {
          // Soft Golden Glowing Orb
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 6;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.8, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Radiant 4-Point Starlight Diamond
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.5, 0);
          ctx.lineTo(0, p.size);
          ctx.lineTo(-p.size * 0.5, 0);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      }
    };

    gsap.ticker.add(ticker);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleClick);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      gsap.ticker.remove(ticker);
    };
  }, [isDesktop]);

  // Completely unmounted on mobile/touch screens
  if (!isDesktop) return null;

  return (
    <>
      {/* 1. Hardware-Accelerated Sparkling Fairy Dust Canvas */}
      <canvas
        ref={canvasRef}
        className="hidden md:block pointer-events-none fixed inset-0 z-[999997] select-none"
      />

      {/* 2. Expanding Click Shockwave Ripple Ring */}
      <div
        ref={rippleRingRef}
        className="hidden md:block pointer-events-none fixed top-0 left-0 z-[999998] w-8 h-8 rounded-full border-2 border-[#ffd700] select-none will-change-transform"
      />

      {/* 3. Celestial Botanical Follower Halo */}
      <div
        ref={outerRingRef}
        className="hidden md:block pointer-events-none fixed top-0 left-0 z-[999999] w-9 h-9 rounded-full border-2 border-[#74c69d]/85 bg-[#133324]/20 shadow-[0_0_14px_rgba(82,183,136,0.45)] flex items-center justify-center select-none will-change-transform backdrop-blur-[1px]"
      >
        {/* Revolving Orbital Star Dust Ring with 4 Cardinal Stars */}
        <div className="w-full h-full rounded-full border border-dashed border-[#ffd700]/50 animate-spin duration-6000 pointer-events-none relative flex items-center justify-center">
          <span className="absolute -top-1 w-1 h-1 rounded-full bg-[#ffd700] shadow-[0_0_6px_#ffd700]" />
          <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-[#74c69d] shadow-[0_0_6px_#74c69d]" />
          <span className="absolute -left-1 w-1 h-1 rounded-full bg-[#ffd700] shadow-[0_0_6px_#ffd700]" />
          <span className="absolute -right-1 w-1 h-1 rounded-full bg-[#74c69d] shadow-[0_0_6px_#74c69d]" />
        </div>

        {/* Central Beating Emerald Gem Dot */}
        <div className="absolute w-2 h-2 rounded-full bg-gradient-to-tr from-[#52b788] via-[#ffd700] to-[#74c69d] shadow-[0_0_8px_#52b788] pointer-events-none" />

        {/* Floating Romantic Heart Badge on Interactive Hover */}
        <div
          ref={hoverBadgeRef}
          className="absolute -top-4 -right-3 px-1.5 py-0.5 rounded-full bg-[#1b4332]/95 border border-[#ffd700]/80 shadow-[0_0_10px_rgba(255,215,0,0.6)] text-[10px] text-[#ffd700] pointer-events-none opacity-0 scale-0 select-none flex items-center gap-0.5 font-bold"
        >
          <span>💖</span>
        </div>
      </div>
    </>
  );
}

export default HeartCursorTrail;
