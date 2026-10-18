import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { romanticAudio } from '../components/RomanticAudioPlayer';
import { PROPOSAL_DATA } from '../data';

const VISIONS = PROPOSAL_DATA.futureVision.visions;

interface Props {
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function FutureVisionBoard({ onPrevPage, onNextPage }: Props) {
  const [activeVision, setActiveVision] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
    }
  }, []);

  const selectVision = (idx: number) => {
    if (idx === activeVision) return;
    romanticAudio.playChime('sparkle');
    setActiveVision(idx);

    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.95, y: 15 },
        { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' }
      );
    }
  };

  const current = VISIONS[activeVision];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-between px-3 sm:px-6 py-2 overflow-y-auto select-none"
    >
      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl pt-1 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#133324]/85 border border-[#52b788]/50 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.25em] text-[#ffd700] uppercase mb-1 shadow-md backdrop-blur-md max-w-[90vw]">
          <Sparkles className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
          <span className="truncate">{PROPOSAL_DATA.futureVision.badge}</span>
          <Sparkles className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
        </div>

        <h2 className="font-playfair text-xl sm:text-4xl font-bold mint-gradient-text drop-shadow-[0_4px_25px_rgba(82,183,136,0.6)] mb-0.5 max-w-full px-1">
          {PROPOSAL_DATA.futureVision.title}
        </h2>

        <p className="font-serif italic text-xs sm:text-sm text-[#d8f3dc]">
          {PROPOSAL_DATA.futureVision.subtitle}
        </p>
      </div>

      {/* Main Vision Stage */}
      <div className="relative z-10 w-full max-w-4xl flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 items-center my-auto py-1">
        {/* Left: Interactive Dream Cards List */}
        <div className="md:col-span-5 flex flex-col space-y-2.5">
          {VISIONS.map((v, idx) => (
            <button
              key={v.id}
              onClick={() => selectVision(idx)}
              className={`p-3 rounded-2xl text-left transition-all border cursor-pointer flex items-center gap-3 ${
                activeVision === idx
                  ? 'bg-gradient-to-r from-[#2d6a4f]/50 to-[#52b788]/30 border-[#ffd700] shadow-[0_0_20px_rgba(82,183,136,0.5)] scale-[1.02]'
                  : 'bg-[#0f281e]/80 border-[#52b788]/20 hover:border-[#74c69d]/60'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#1b4332] border border-[#74c69d]/50 flex items-center justify-center text-xl shrink-0">
                {v.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-playfair text-sm font-bold text-[#f0fdf4] truncate">{v.title}</p>
                <p className="font-serif text-[11px] text-[#a3d9b8] truncate">{v.timeframe}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Right: Focused Dream Postcard */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <div
            ref={cardRef}
            className="botanical-glass p-6 sm:p-7 rounded-3xl border-2 border-[#74c69d]/40 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-center flex flex-col items-center"
          >
            {/* Top Badge */}
            <span className="px-3 py-1 rounded-full bg-[#52b788]/20 border border-[#74c69d]/40 text-xs text-[#ffd700] uppercase font-bold tracking-wider mb-2">
              {current.badge}
            </span>

            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#52b788] to-[#ffd700] flex items-center justify-center text-3xl shadow-[0_0_25px_#52b788] mb-3 animate-leaf-sway">
              {current.icon}
            </div>

            <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#f0fdf4] mb-1">
              {current.title}
            </h3>
            <p className="font-serif italic text-xs text-[#ffd700] mb-3">
              {current.timeframe}
            </p>

            <p className="font-serif text-sm sm:text-base text-[#d8f3dc] leading-relaxed max-w-md mb-4">
              "{current.story}"
            </p>

            <div className="w-full p-3.5 rounded-2xl bg-[#0b2118]/90 border border-[#ffd700]/50 text-xs font-serif italic text-[#fef08a] leading-relaxed">
              <span className="text-[#ffd700] font-bold not-italic">Buggu's Promise: </span>
              "{current.sweetPromise}" 💖
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav Controls */}
      <div className="relative z-10 pt-2 pb-1 w-full max-w-4xl flex items-center justify-between gap-2">
        <button
          onClick={onPrevPage}
          className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#133324] hover:bg-[#1b4332] border border-[#52b788]/40 text-xs font-serif text-[#d8f3dc] flex items-center gap-1.5 transition-all cursor-pointer shadow"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Chapter VI: Our Secret World</span>
          <span className="sm:hidden">Prev 🧸</span>
        </button>

        <button
          onClick={onNextPage}
          className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#2d6a4f] via-[#52b788] to-[#40916c] hover:from-[#40916c] hover:to-[#52b788] text-white text-xs sm:text-sm font-serif font-bold tracking-wider shadow-[0_0_20px_rgba(82,183,136,0.5)] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span className="hidden sm:inline">Chapter VIII: Heartbeat & Senses</span>
          <span className="sm:hidden">Next 💓</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
        </button>
      </div>
    </div>
  );
}
