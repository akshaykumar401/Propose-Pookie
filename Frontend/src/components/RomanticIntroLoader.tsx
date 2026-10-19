import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { Heart, Key, Lock, ArrowRight } from 'lucide-react';
import { romanticAudio } from './RomanticAudioPlayer';
import { PROPOSAL_DATA } from '../data';

interface Props {
  onComplete: () => void;
}

const LOVE_WHISPERS = PROPOSAL_DATA.intro.whispers;

export function RomanticIntroLoader({ onComplete }: Props) {
  const [unlocked, setUnlocked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const locketRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (locketRef.current) {
      gsap.to(locketRef.current, {
        scale: 1.08,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }

    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % LOVE_WHISPERS.length);
    }, 2800);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 32);

    return () => {
      clearInterval(quoteInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const handleUnlock = () => {
    setUnlocked(true);
    romanticAudio.playChime('heart');
    romanticAudio.startMelodyLoop();

    confetti({
      particleCount: 85,
      spread: 110,
      origin: { y: 0.6 },
      colors: ['#38bdf8', '#7dd3fc', '#f472b6', '#f9a8d4', '#ffd700', '#ffffff'],
    });

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        opacity: 0,
        scale: 1.05,
        duration: 0.75,
        ease: 'power2.inOut',
        onComplete: onComplete,
      });
    } else {
      setTimeout(onComplete, 750);
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#060e1e] via-[#0f1d38] to-[#040813] text-[#f0f9ff] px-4 overflow-hidden select-none"
    >
      {/* Ambient background glow */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#38bdf8]/20 via-[#f472b6]/20 to-[#ffd700]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-lg w-full flex flex-col items-center text-center">
        {/* Glowing Sky Blue & Pink Locket with GSAP Pulse */}
        <div ref={locketRef} className="relative mb-6 cursor-pointer group" onClick={handleUnlock}>
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#0284c7] via-[#ec4899] to-[#be185d] flex items-center justify-center border-2 border-[#ffd700] shadow-[0_0_40px_rgba(236,72,153,0.7)] group-hover:scale-110 transition-transform duration-300">
            {unlocked ? (
              <Heart className="w-12 h-12 text-[#ffd700] fill-[#ffd700] animate-bounce" />
            ) : (
              <Lock className="w-10 h-10 text-[#bae6fd] group-hover:text-[#ffd700] transition-colors" />
            )}
          </div>

          {/* Pulsing Pink Ring */}
          <div className="absolute inset-[-8px] rounded-full border border-[#f472b6]/50 animate-ping duration-1500 pointer-events-none" />
        </div>

        {/* Romantic Title Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 rounded-full bg-[#0f2442]/85 border border-[#38bdf8]/50 text-[10px] sm:text-xs tracking-[0.12em] sm:tracking-[0.25em] text-[#ffd700] uppercase mb-2 sm:mb-3 shadow-md max-w-full">
          <Heart className="w-3.5 h-3.5 text-[#f472b6] fill-[#f472b6] shrink-0" />
          <span className="truncate">Strictly For Pookie's Eyes Only</span>
          <Heart className="w-3.5 h-3.5 text-[#f472b6] fill-[#f472b6] shrink-0" />
        </div>

        <h1 className="font-vibes text-4xl sm:text-6xl md:text-7xl mint-gradient-text drop-shadow-[0_4px_30px_rgba(56,189,248,0.6)] mb-1 sm:mb-2 max-w-full leading-snug px-1">
          Sanctuary of Us
        </h1>

        <p className="font-serif italic text-sm sm:text-base md:text-lg text-[#bae6fd] min-h-[44px] transition-all duration-500 max-w-md px-2 leading-relaxed">
          "{LOVE_WHISPERS[quoteIndex]}"
        </p>

        {/* Progress or Unlock Button */}
        <div className="mt-4 sm:mt-6 w-full max-w-xs flex flex-col items-center">
          {progress < 100 ? (
            <div className="w-full">
              <div className="w-full bg-[#08182b] h-2.5 rounded-full overflow-hidden border border-[#38bdf8]/30">
                <div
                  className="bg-gradient-to-r from-[#38bdf8] via-[#f472b6] to-[#ffd700] h-full transition-all duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-[11px] font-sans text-[#7dd3fc]/80 mt-2 tracking-wider uppercase">
                Cultivating Our Memories... {progress}%
              </p>
            </div>
          ) : (
            <button
              onClick={handleUnlock}
              className="w-full sm:w-auto px-5 sm:px-8 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-[#0284c7] via-[#ec4899] to-[#db2777] text-[#ffffff] font-serif text-sm sm:text-base tracking-wider border-2 border-[#ffd700]/70 shadow-[0_0_30px_rgba(236,72,153,0.7)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 font-bold cursor-pointer"
            >
              <Key className="w-4 h-4 text-[#ffd700] shrink-0" />
              <span className="truncate">Unlock My Heart, Pookie</span>
              <ArrowRight className="w-4 h-4 text-[#ffd700] shrink-0" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
