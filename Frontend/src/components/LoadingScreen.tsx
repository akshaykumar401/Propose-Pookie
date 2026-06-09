import { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';
import gsap from 'gsap';

interface HeartBubble {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  delay: number;
  emoji: string;
}

const ROMANTIC_QUOTES = [
  "Every love story is beautiful, but ours is my favorite. 💖",
  "You are my today and all of my tomorrows. 🌹",
  "In all the world, there is no heart for me like yours. 💞",
  "To the world you may be one person, but to me you are the world. ✨",
  "Every heartbeat of mine is a promise of forever. 💍",
  "From the moment we met, my heart knew it found its home. 🏠💕"
];

const HEART_EMOJIS = ['💖', '💕', '💓', '💗', '💘', '💝', '🌸', '🌹'];

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const { progress } = useProgress();
  const [percent, setPercent] = useState(0);
  const [sparks, setSparks] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [bubbles, setBubbles] = useState<HeartBubble[]>([]);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [fadeQuote, setFadeQuote] = useState(true);

  // Generate interactive floating heart bubbles
  useEffect(() => {
    const initialBubbles = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90, // % from left
      y: 100 + Math.random() * 20, // % from top (start off-screen)
      size: 24 + Math.random() * 28, // px
      speed: 1.2 + Math.random() * 2.2, // floating speed
      delay: Math.random() * 6, // stagger start
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
    }));
    setBubbles(initialBubbles);
  }, []);

  // Smooth progress calculation
  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsLoaded(true);
          return 100;
        }
        const diff = (100 - prev) * 0.08;
        return prev + Math.max(diff, 0.8);
      });
    }, 35);

    return () => clearInterval(interval);
  }, [progress]);

  // Rotate quotes every 4 seconds with fade in/out transition
  useEffect(() => {
    const quoteTimer = setInterval(() => {
      setFadeQuote(false);
      setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % ROMANTIC_QUOTES.length);
        setFadeQuote(true);
      }, 500); // Wait for fade out to complete before changing text
    }, 4500);

    return () => clearInterval(quoteTimer);
  }, []);

  // Pop a heart bubble
  const popBubble = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSparks((prev) => prev + 1);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    createSparkles(x, y);

    // Replace the bubble
    setBubbles((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              x: 5 + Math.random() * 90,
              y: 110,
              size: 24 + Math.random() * 28,
              speed: 1.2 + Math.random() * 2.2,
              emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
            }
          : b
      )
    );
  };

  const createSparkles = (x: number, y: number) => {
    const particles = ['✨', '💖', '🌸', '💕', '🌟', '🌷'];
    for (let i = 0; i < 10; i++) {
      const el = document.createElement('div');
      el.className = 'absolute pointer-events-none text-sm select-none z-[10000]';
      el.innerText = particles[Math.floor(Math.random() * particles.length)];
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      document.body.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 50;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      gsap.to(el, {
        x: tx,
        y: ty,
        opacity: 0,
        scale: 0.4,
        rotation: Math.random() * 360,
        duration: 0.9 + Math.random() * 0.5,
        ease: 'power3.out',
        onComplete: () => el.remove(),
      });
    }
  };

  const handleEnter = () => {
    gsap.to('#loading-container', {
      opacity: 0,
      scale: 1.05,
      duration: 1.5,
      ease: 'power4.inOut',
      onComplete: onComplete,
    });
  };

  return (
    <div
      id="loading-container"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none overflow-hidden"
      style={{
        background: 'radial-gradient(circle at center, #23001a 0%, #080012 100%)',
      }}
    >
      {/* ── Background Aurora Glows ── */}
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-rose-600/15 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '6s' }} />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-pink-600/15 rounded-full blur-[140px] animate-pulse" style={{ animationDuration: '8s' }} />
      </div>

      {/* ── Soft Floating Rose Petals Background ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-rose-400 text-lg animate-petal"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${12 + Math.random() * 10}s`,
            }}
          >
            🌸
          </div>
        ))}
      </div>

      {/* ── Interactive Heart Bubble Layer ── */}
      <div className="absolute inset-0 pointer-events-auto">
        {bubbles.map((b) => (
          <button
            key={b.id}
            onClick={(e) => popBubble(b.id, e)}
            className="absolute flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-90"
            style={{
              left: `${b.x}%`,
              width: `${b.size}px`,
              height: `${b.size}px`,
              animation: `floatUp ${12 / b.speed}s linear infinite`,
              animationDelay: `${b.delay}s`,
            }}
          >
            <span
              className="select-none filter drop-shadow-[0_0_10px_rgba(244,63,94,0.4)] opacity-50 hover:opacity-90 active:opacity-100 transition-opacity duration-200"
              style={{ fontSize: `${b.size}px` }}
            >
              {b.emoji}
            </span>
          </button>
        ))}
      </div>

      {/* ── Glassmorphism Loading Panel ── */}
      <div className="relative z-10 flex flex-col items-center max-w-lg w-full px-8 py-10 text-center rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_40px_rgba(244,63,94,0.08)]">
        
        {/* Pulsating Heart Logo */}
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center animate-heartbeat">
          <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-2xl animate-ping" style={{ animationDuration: '3s' }} />
          <span className="text-6xl filter drop-shadow-[0_0_20px_rgba(244,63,94,0.75)]">💝</span>
        </div>

        {/* Title & Subtitle */}
        <h2 className="font-script text-4xl md:text-5xl text-pink-100 mb-2 filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
          Loading Our Story...
        </h2>
        <p className="text-pink-300/80 text-sm font-sans tracking-wide mb-8">
          Tap the floating hearts to fill our love vault! 💕
        </p>

        {/* Score Counter */}
        {sparks > 0 && (
          <div className="mb-6 bg-pink-500/10 border border-pink-500/25 px-5 py-2 rounded-full text-xs font-semibold text-pink-200 tracking-wider uppercase shadow-[0_0_15px_rgba(244,63,94,0.15)] animate-fade-in">
            ✨ vault level: {sparks * 10}% loaded ({sparks} sparks) ✨
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full bg-white/5 border border-white/10 rounded-full h-3.5 mb-4 overflow-hidden relative backdrop-blur-md">
          <div
            className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-rose-500 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(244,63,94,0.95)]"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Percent & Status */}
        <div className="flex justify-between w-full text-[10px] font-mono text-pink-200/50 mb-8 tracking-widest">
          <span>{isLoaded ? 'HEARTBEAT DETECTED' : 'LOADING SWEET MEMORIES...'}</span>
          <span>{Math.floor(percent)}%</span>
        </div>

        {/* Enter Button with smooth entrance */}
        <div className="h-16 flex items-center justify-center w-full">
          {isLoaded && (
            <button
              onClick={handleEnter}
              className="px-10 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white font-semibold rounded-full shadow-[0_0_30px_rgba(244,63,94,0.6)] hover:shadow-[0_0_45px_rgba(244,63,94,0.9)] border border-pink-300/35 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-widest text-xs"
            >
              Enter Our Story ✨
            </button>
          )}
        </div>
      </div>

      {/* ── Romantic Quote Ticker ── */}
      <div className="absolute bottom-12 left-6 right-6 text-center h-8 flex items-center justify-center pointer-events-none z-10">
        <p
          className={`font-serif text-sm md:text-base italic text-pink-200/75 tracking-wide transition-opacity duration-500 ${
            fadeQuote ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
        >
          {ROMANTIC_QUOTES[quoteIndex]}
        </p>
      </div>

      {/* ── Custom Romantic CSS Animations ── */}
      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(110vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-20vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.1);
          }
          40% {
            transform: scale(1.03);
          }
          60% {
            transform: scale(1.15);
          }
        }
        .animate-heartbeat {
          animation: heartbeat 2s infinite ease-in-out;
        }
        @keyframes fallPetal {
          0% {
            transform: translateY(-50px) translateX(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(105vh) translateX(100px) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-petal {
          animation: fallPetal 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
