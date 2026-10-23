import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Heart, ArrowLeft, ArrowRight, Music2 } from 'lucide-react';
import { romanticAudio } from '../components/RomanticAudioPlayer';
import { PROPOSAL_DATA } from '../data';

const SENSES = PROPOSAL_DATA.senses.sensesList;

interface Props {
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function HeartbeatHarmony({ onPrevPage, onNextPage }: Props) {
  const [holdingHeart, setHoldingHeart] = useState(false);
  const [syncPercentage, setSyncPercentage] = useState(60);
  const [unlockedSync, setUnlockedSync] = useState(false);
  const [activeSense, setActiveSense] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const heartIntervalRef = useRef<number | null>(null);
  const sensorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
    }
  }, []);

  const startHold = () => {
    setHoldingHeart(true);
    romanticAudio.playHeartbeat();

    if (sensorRef.current) {
      gsap.to(sensorRef.current, {
        scale: 1.15,
        duration: 0.25,
        ease: 'power2.out',
      });
    }

    heartIntervalRef.current = window.setInterval(() => {
      romanticAudio.playHeartbeat();
      setSyncPercentage((prev) => {
        if (prev >= 100) {
          setUnlockedSync(true);
          romanticAudio.playChime('heart');
          if (heartIntervalRef.current) clearInterval(heartIntervalRef.current);
          return 100;
        }
        return prev + 8;
      });
    }, 450);
  };

  const endHold = () => {
    setHoldingHeart(false);
    if (sensorRef.current) {
      gsap.to(sensorRef.current, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
    if (heartIntervalRef.current) {
      clearInterval(heartIntervalRef.current);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-between px-3 sm:px-6 py-2 overflow-y-auto select-none"
    >
      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl pt-1 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#0c2445]/85 border border-[#38bdf8]/50 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.25em] text-[#ffd700] uppercase mb-1 shadow-md backdrop-blur-md max-w-[90vw]">
          <Music2 className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
          <span className="truncate">{PROPOSAL_DATA.senses.badge}</span>
          <Music2 className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
        </div>

        <h2 className="font-playfair text-xl sm:text-4xl font-bold mint-gradient-text drop-shadow-[0_4px_25px_rgba(56,189,248,0.6)] mb-0.5 max-w-full px-1">
          {PROPOSAL_DATA.senses.title}
        </h2>

        <p className="font-serif italic text-xs sm:text-sm text-[#bae6fd]">
          {PROPOSAL_DATA.senses.subtitle}
        </p>
      </div>

      {/* Main Interactive Grid */}
      <div className="relative z-10 w-full max-w-4xl flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 items-center my-auto py-1">
        {/* LEFT: INTERACTIVE EMERALD HEARTBEAT SENSOR */}
        <div className="md:col-span-6 w-full botanical-glass p-5 sm:p-6 rounded-3xl border border-[#38bdf8]/40 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col items-center text-center">
          <span className="font-serif italic text-xs tracking-widest text-[#f472b6] uppercase mb-1">
            Biometric Love Resonance
          </span>
          <h3 className="font-playfair text-xl font-bold text-white mb-2">
            Synchronize Our Hearts
          </h3>

          {/* Sensor button with GSAP pulse */}
          <div
            ref={sensorRef}
            onMouseDown={startHold}
            onMouseUp={endHold}
            onTouchStart={startHold}
            onTouchEnd={endHold}
            className="relative my-4 cursor-pointer select-none"
          >
            <div
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center border-3 transition-colors ${
                holdingHeart
                  ? 'bg-gradient-to-tr from-[#0284c7] via-[#ec4899] to-[#f472b6] border-[#ffd700] shadow-[0_0_40px_rgba(244,114,182,0.8)]'
                  : 'bg-[#0c2445]/80 border-[#38bdf8]/50 hover:border-[#f472b6]'
              }`}
            >
              <Heart
                className={`w-12 h-12 text-[#ffd700] fill-[#ffd700] ${
                  holdingHeart ? 'animate-heart-pulse' : ''
                }`}
              />
              <span className="text-[10px] font-sans text-[#ffd700] mt-1 font-bold">
                {holdingHeart ? `${syncPercentage}% SYNCED` : 'PRESS & HOLD'}
              </span>
            </div>

            {/* Ripple rings while holding */}
            {holdingHeart && (
              <div className="absolute inset-[-12px] rounded-full border-2 border-[#f472b6] animate-ping duration-1000 pointer-events-none" />
            )}
          </div>

          <p className="font-serif italic text-xs text-[#bae6fd] max-w-xs mb-3">
            {!unlockedSync
              ? 'Press and hold the heart sensor to feel our heartbeats sync into pure harmony...'
              : '✨ 100% Synchronized! Our hearts beat to the exact same melody.'}
          </p>

          {unlockedSync && (
            <div className="w-full p-3 rounded-2xl bg-[#0c2445]/90 border border-[#f472b6]/50 text-xs font-serif italic text-[#fce7f3] animate-fadeIn">
              "Science says when lovers hold hands, their heart rates naturally synchronize. With you, my heart found its forever rhythm." ❤️
            </div>
          )}
        </div>

        {/* RIGHT: THE 4 SENSES */}
        <div className="md:col-span-6 w-full flex flex-col space-y-2.5">
          {SENSES.map((sense, idx) => {
            const isSelected = idx === activeSense;
            return (
              <div
                key={sense.title}
                onClick={() => {
                  setActiveSense(idx);
                  romanticAudio.playChime('click');
                }}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'botanical-glass border-[#f472b6] shadow-[0_0_20px_rgba(244,114,182,0.4)] scale-[1.02]'
                    : 'bg-[#0c2445]/60 border-[#38bdf8]/20 hover:border-[#38bdf8]/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{sense.icon}</span>
                  <div className="flex-1 text-left">
                    <h4 className="font-playfair text-sm sm:text-base font-bold text-white">
                      {sense.title}
                    </h4>
                    <p className="font-serif text-xs text-[#bae6fd]/80 mt-0.5 leading-relaxed">
                      {sense.desc}
                    </p>
                    {isSelected && (
                      <p className="font-serif italic text-[11px] text-[#f472b6] mt-1.5 animate-fadeIn font-semibold">
                        💫 {sense.sweetDetail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Nav Controls */}
      <div className="relative z-10 pt-2 pb-1 w-full max-w-4xl flex items-center justify-between gap-2">
        <button
          onClick={onPrevPage}
          className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0c2445] hover:bg-[#12335e] border border-[#38bdf8]/40 text-xs font-serif text-[#bae6fd] flex items-center gap-1.5 transition-all cursor-pointer shadow"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Chapter IX: Future Dreams</span>
          <span className="sm:hidden">Prev 🏡</span>
        </button>

        <button
          onClick={onNextPage}
          className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#0284c7] via-[#ec4899] to-[#db2777] hover:from-[#0369a1] hover:to-[#be185d] text-white text-xs sm:text-sm font-serif font-bold tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span className="hidden sm:inline">Chapter XI: Sacred Vows 📜</span>
          <span className="sm:hidden">Next 📜</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
        </button>
      </div>
    </div>
  );
}
