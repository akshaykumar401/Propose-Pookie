import { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProposeScene } from '../components/ProposeScene';

gsap.registerPlugin(ScrollTrigger);

/* ── Proposal ─────────────────────────────────────────── */
export function Proposal() {
  const [accepted, setAccepted] = useState(false);

  const noButtonRef  = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const ringEmojiRef = useRef<HTMLDivElement>(null);
  const titleRef     = useRef<HTMLHeadingElement>(null);

  const handleYes = () => {
    const colors = ['#ffb6c1', '#fce7f3', '#f9a8d4', '#f43f5e', '#c77dff', '#d4af37', '#ffffff'];

    // Animate ring emoji flying up, then switch to accepted state
    if (ringEmojiRef.current) {
      gsap.to(ringEmojiRef.current, {
        y: -180, scale: 2.2, opacity: 0,
        duration: 0.7, ease: 'power3.out',
        onComplete: () => setAccepted(true),
      });
    } else {
      setAccepted(true);
    }

    // Big initial burst
    confetti({ particleCount: 220, spread: 140, origin: { y: 0.5 }, colors });
    confetti({ particleCount: 60,  spread: 180, origin: { y: 0.3 }, shapes: ['circle'], scalar: 1.6, colors: ['#ff6b9d','#d4af37','#c77dff'] });

    // Side cannons for 5.5 s
    const end = Date.now() + 5500;
    const sides = () => {
      confetti({ particleCount: 8, angle: 60,  spread: 60, origin: { x: 0 }, colors });
      confetti({ particleCount: 8, angle: 120, spread: 60, origin: { x: 1 }, colors });
    };
    const frame = () => { sides(); if (Date.now() < end) requestAnimationFrame(frame); };
    setTimeout(frame, 500);
  };

  const moveNoButton = () => {
    gsap.to(noButtonRef.current, {
      x: (Math.random() - 0.5) * 320,
      y: (Math.random() - 0.5) * 200,
      duration: 0.4,
      ease: 'back.out(2.5)',
    });
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1.8, ease: 'power4.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 75%' } }
      );
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.6, ease: 'power3.out', delay: 0.5,
          scrollTrigger: { trigger: titleRef.current, start: 'top 80%' } }
      );
    });
    // Clean up all GSAP animations and ScrollTriggers on unmount
    // so stale refs don't error when the accepted screen mounts
    return () => ctx.revert();
  }, []);

  return (
    <section id="proposal-section"
      className="relative w-full min-h-screen flex flex-col items-center justify-center py-24 px-6 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 110%, #2d0040 0%, #0d0010 60%)' }}>

      {/* Ambient blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/5 w-[500px] h-[500px] rounded-full blur-[150px]"
          style={{ background: 'radial-gradient(circle, rgba(199,125,255,0.14) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgba(249,168,212,0.14) 0%, transparent 70%)' }} />
      </div>

      {!accepted && (
        /* ── Question screen ── */
        <div ref={containerRef} style={{ opacity: 0 }}
          className="relative z-10 w-full max-w-2xl mx-auto text-center">

          <div ref={ringEmojiRef}
            className="text-8xl mb-6 select-none"
            style={{ filter: 'drop-shadow(0 0 24px #d4af37) drop-shadow(0 0 60px rgba(199,125,255,0.5))' }}>
            💍
          </div>

          <h2 ref={titleRef}
            className="font-script mb-6"
            style={{
              opacity: 0,
              fontSize: 'clamp(3rem, 8vw, 5.5rem)',
              color: '#fce7f3',
              filter: 'drop-shadow(0 0 35px rgba(249,168,212,0.55))',
            }}>
            Will you marry me?
          </h2>

          <p className="font-serif text-xl md:text-2xl italic mb-3 leading-relaxed"
            style={{ color: '#f9a8d4' }}>
            You are every reason, every hope, and every dream I've ever had.
          </p>
          <p className="font-serif text-base mb-14 opacity-50 italic"
            style={{ color: '#fce7f3' }}>
            I want to spend every sunrise and every sunset with you — forever.
          </p>

          <div className="h-px w-36 mx-auto mb-12"
            style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />

          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-8 min-h-[140px]">
            <button onClick={handleYes}
              className="relative px-14 py-5 rounded-full font-serif text-white text-2xl tracking-wide z-20 overflow-hidden group cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #f43f5e 0%, #c77dff 60%, #d4af37 100%)',
                boxShadow: '0 0 40px rgba(244,63,94,0.5), 0 0 80px rgba(199,125,255,0.2)',
              }}>
              <span className="relative z-10">Yes! I'll Marry You! 💕</span>
              <span className="absolute inset-0 bg-white/15 -translate-x-full group-hover:translate-x-full transition-transform duration-700 skew-x-[-20deg]" />
            </button>

            <button ref={noButtonRef}
              onMouseEnter={moveNoButton} onClick={moveNoButton}
              className="px-10 py-4 rounded-full font-serif text-lg z-10 cursor-pointer"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(249,168,212,0.2)',
                color: '#f9a8d4',
              }}>
              Let me think... 🤔
            </button>
          </div>
        </div>
      )}

      {/* ── Accepted screen ── pre-mounted so react-use-measure gets a real size
           before the user clicks Yes. Hidden via visibility+pointer-events so it
           doesn't interfere with the question UI. */}
      <div
        className="relative z-10 w-full max-w-5xl mx-auto text-center"
        style={{
          visibility: accepted ? 'visible' : 'hidden',
          pointerEvents: accepted ? 'auto' : 'none',
          position: accepted ? 'relative' : 'absolute',
          top: accepted ? 'auto' : 0,
          left: accepted ? 'auto' : 0,
          right: accepted ? 'auto' : 0,
        }}
      >
        {/* 3D Propose scene */}
        <div
          className="w-full mb-6 relative border"
          style={{
            height: '420px',
            borderColor: 'rgba(249,168,212,0.15)',
            background: 'linear-gradient(180deg, #0d0010 0%, #1a0028 100%)',
            borderRadius: '1.5rem',
            clipPath: 'inset(0 round 1.5rem)',
          }}>
          <Canvas
            camera={{ position: [0, 0.8, 5.5], fov: 50 }}
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <ProposeScene />
            </Suspense>
          </Canvas>

          {/* Floor glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-8 blur-2xl pointer-events-none"
            style={{ background: 'rgba(212,175,55,0.4)' }} />
        </div>

        {/* Text */}
        <h2 className="font-script mb-4"
          style={{
            fontSize: 'clamp(3rem, 10vw, 6.5rem)',
            color: '#fce7f3',
            filter: 'drop-shadow(0 0 50px rgba(249,168,212,0.8))',
          }}>
          She said Yes! 🥂
        </h2>

        <p className="font-serif text-2xl md:text-3xl italic leading-relaxed mb-4"
          style={{ color: '#f9a8d4' }}>
          You've made me the luckiest person alive.
        </p>
        <p className="font-serif text-lg italic opacity-70 mb-8"
          style={{ color: '#fce7f3' }}>
          I promise to love, cherish, and choose you every single day. 🌹
        </p>

        <div className="h-px w-40 mx-auto"
          style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />
        <p className="mt-5 text-xs font-sans tracking-[0.25em] uppercase"
          style={{ color: 'rgba(212,175,55,0.6)' }}>
          ✦ &nbsp; Forever &amp; Always &nbsp; ✦
        </p>
      </div>
    </section>
  );
}
