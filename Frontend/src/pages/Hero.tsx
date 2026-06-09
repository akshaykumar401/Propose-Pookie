import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, Stars, Trail } from '@react-three/drei';
import { Heart } from '../components/Heart';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

/* ─── Fireflies ─────────────────────────────────────────── */
function Fireflies({ count = 100 }: { count?: number }) {
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 22;
      p[i * 3 + 1] = (Math.random() - 0.5) * 14;
      p[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    return p;
  }, [count]);

  const ref = useRef<THREE.Points>(null!);
  const phases = useMemo(() => Float32Array.from({ length: count }, () => Math.random() * Math.PI * 2), [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3] += Math.cos(state.clock.elapsedTime * 0.5 + phases[i]) * 0.004;
      arr[i * 3 + 1] += Math.sin(state.clock.elapsedTime * 0.7 + phases[i]) * 0.004;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    (ref.current.material as THREE.PointsMaterial).opacity =
      0.55 + Math.sin(state.clock.elapsedTime * 2) * 0.35;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.10} color="#f9a8d4" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ─── Orbiting mini hearts ──────────────────────────────── */
function OrbitingOrbs() {
  const orbs = [
    { radius: 3.2, speed: 0.6, phase: 0, color: '#ff6b9d', size: 0.15 },
    { radius: 3.8, speed: 0.45, phase: Math.PI, color: '#c77dff', size: 0.12 },
    { radius: 4.4, speed: 0.35, phase: Math.PI / 2, color: '#fda4af', size: 0.10 },
    { radius: 2.8, speed: 0.8, phase: Math.PI * 1.5, color: '#f9a8d4', size: 0.08 },
  ];

  const refs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    orbs.forEach((orb, i) => {
      const mesh = refs.current[i];
      if (!mesh) return;
      const t = state.clock.elapsedTime * orb.speed + orb.phase;
      mesh.position.x = Math.cos(t) * orb.radius;
      mesh.position.y = Math.sin(t * 0.5) * 0.8;
      mesh.position.z = Math.sin(t) * orb.radius * 0.4;
      mesh.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 3 + i) * 0.25);
    });
  });

  return (
    <>
      {orbs.map((orb, i) => (
        <mesh key={i} ref={el => { if (el) refs.current[i] = el; }}>
          <sphereGeometry args={[orb.size, 16, 16]} />
          <meshBasicMaterial color={orb.color} transparent opacity={0.8} />
        </mesh>
      ))}
    </>
  );
}


/* ─── Shooting star ─────────────────────────────────────── */
function ShootingStar() {
  const ref = useRef<THREE.Mesh>(null!);
  const reset = () => {
    ref.current.position.set(-10 + Math.random() * 20, 6, -5 + Math.random() * 5);
    (ref.current as any)._vx = (Math.random() + 0.5) * 0.08;
    (ref.current as any)._vy = -(Math.random() + 0.3) * 0.06;
  };

  useEffect(() => { setTimeout(reset, 2000); }, []);

  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.x += (ref.current as any)._vx || 0;
    ref.current.position.y += (ref.current as any)._vy || 0;
    if (ref.current.position.y < -8) reset();
  });

  return (
    <Trail width={1} length={12} color="#fce7f3" attenuation={t => t * t}>
      <mesh ref={ref} position={[-12, 4, -4]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </Trail>
  );
}

/* ─── Hero ──────────────────────────────────────────────── */
export function Hero() {
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const auroraRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    // Aurora pulse
    gsap.to(auroraRef.current, {
      opacity: 0.7,
      scale: 1.15,
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Text entrance
    const tl = gsap.timeline({ delay: 0.5 });

    tl.fromTo(taglineRef.current,
      { opacity: 0, letterSpacing: '0.5em' },
      { opacity: 1, letterSpacing: '0.3em', duration: 1.4, ease: 'power2.out' })
      .fromTo(line1Ref.current,
        { opacity: 0, y: 50, skewY: 4 },
        { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: 'power4.out' }, '-=0.6')
      .fromTo(line2Ref.current,
        { opacity: 0, y: 40, skewY: 3 },
        { opacity: 1, y: 0, skewY: 0, duration: 1.2, ease: 'power4.out' }, '-=0.9')
      .fromTo(badgeRef.current,
        { opacity: 0, scale: 0.7 },
        { opacity: 1, scale: 1, duration: 0.9, ease: 'back.out(2)' }, '-=0.5');

    // Arrow bounce
    gsap.to(arrowRef.current, { y: 14, repeat: -1, yoyo: true, duration: 2, ease: 'sine.inOut' });
  }, []);

  const scrollNext = () =>
    document.getElementById('reasons-section')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative w-full h-screen flex overflow-hidden"
      style={{ background: '#070010' }}>

      {/* ── Aurora gradient blobs ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-left purple bloom */}
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full blur-[180px]"
          style={{ background: 'radial-gradient(circle, rgba(120,40,200,0.55) 0%, transparent 70%)' }} />
        {/* Bottom-right rose bloom */}
        <div className="absolute -bottom-40 -right-20 w-[600px] h-[600px] rounded-full blur-[160px]"
          style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.45) 0%, transparent 70%)' }} />
        {/* Center pulsing aurora */}
        <div ref={auroraRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-[200px] opacity-40"
          style={{ background: 'conic-gradient(from 0deg, #c77dff22, #f43f5e33, #c77dff22, #3d0d4e33, #c77dff22)' }} />
      </div>

      {/* ── LEFT: Text panel ── */}
      <div className="relative z-10 flex flex-col justify-center w-full md:w-1/2 px-10 md:px-20 pt-20 md:pt-0">

        {/* Tagline */}
        <p ref={taglineRef} style={{ opacity: 0, color: '#c77dff', letterSpacing: '0.3em' }}
          className="text-xs md:text-sm font-sans uppercase mb-6 tracking-[0.3em]">
          ✦ &nbsp; A Message From My Heart &nbsp; ✦
        </p>

        {/* Main headline — two lines */}
        <div ref={line1Ref} style={{ opacity: 0 }}>
          <h1 className="font-script leading-none mb-1"
            style={{
              fontSize: 'clamp(3.5rem, 9vw, 7rem)',
              color: '#fce7f3',
              filter: 'drop-shadow(0 0 40px rgba(244,63,94,0.5))',
            }}>
            You are my
          </h1>
        </div>
        <div ref={line2Ref} style={{ opacity: 0 }}>
          <h1 className="font-script leading-none"
            style={{
              fontSize: 'clamp(3.8rem, 10vw, 8rem)',
              background: 'linear-gradient(135deg, #f9a8d4 0%, #c77dff 60%, #f43f5e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 35px rgba(199,125,255,0.45))',
            }}>
            everything.
          </h1>
        </div>

        {/* Badge / quote pill */}
        <div ref={badgeRef}
          className="mt-8 inline-flex items-start gap-4 max-w-md p-5 rounded-2xl border"
          style={{
            opacity: 0,
            background: 'rgba(255,255,255,0.04)',
            borderColor: 'rgba(249,168,212,0.2)',
            backdropFilter: 'blur(12px)',
          }}>
          <span className="text-2xl mt-1 shrink-0">💌</span>
          <p className="font-serif text-base md:text-lg italic leading-relaxed"
            style={{ color: 'rgba(252,231,243,0.85)' }}>
            "From the moment I met you, every heartbeat has been for you — and every day I fall deeper in love."
          </p>
        </div>

        {/* Stats row */}
        <div className="mt-10 flex gap-10">
          {[['∞', 'Days to love you'], ['💕', 'Reasons I chose you'], ['🌹', 'Promises I keep']].map(([v, l]) => (
            <div key={l as string}>
              <div className="font-script text-3xl" style={{ color: '#f9a8d4' }}>{v}</div>
              <div className="text-xs font-sans mt-1 opacity-50" style={{ color: '#fce7f3' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: 3D scene ── */}
      <div className="absolute inset-0 md:left-1/2 z-0 md:z-10">
        <Canvas camera={{ position: [0, 0, 9], fov: 50 }}>
          <Stars radius={90} depth={60} count={4000} factor={3} saturation={0.4} fade speed={0.5} />

          <ambientLight intensity={0.25} />
          <pointLight position={[2, 3, 4]} intensity={12} color="#ff6b9d" />
          <pointLight position={[-3, -2, 3]} intensity={6} color="#c77dff" />
          <pointLight position={[0, -4, 2]} intensity={4} color="#7c3aed" />

          <Float speed={3} rotationIntensity={1.5} floatIntensity={2.5}>
            <Heart position={[0, 0, 0]} />
          </Float>
          <OrbitingOrbs />
          <ShootingStar />

          <Sparkles count={80} scale={14} size={2} speed={0.5} opacity={0.7} color="#f9a8d4" />
          <Fireflies count={120} />
        </Canvas>
      </div>

      {/* ── Scroll arrow ── */}
      <div ref={arrowRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 cursor-pointer pointer-events-auto"
        style={{ color: 'rgba(249,168,212,0.7)' }}
        onClick={scrollNext}>
        <ChevronDown size={44} strokeWidth={1} />
      </div>
    </section>
  );
}
