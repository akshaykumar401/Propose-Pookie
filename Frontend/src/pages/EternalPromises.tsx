import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, Heart, CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { romanticAudio } from '../components/RomanticAudioPlayer';
import { PROPOSAL_DATA } from '../data';

const PROMISES = PROPOSAL_DATA.sacredVows.vowsList;

interface Props {
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function EternalPromises({ onPrevPage, onNextPage }: Props) {
  const [sealed, setSealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const sealButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
    }

    if (listRef.current) {
      gsap.fromTo(
        listRef.current.children,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' }
      );
    }
  }, []);

  const handleSealVows = () => {
    setSealed(true);
    romanticAudio.playChime('heart');

    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.7 },
      colors: ['#38bdf8', '#f472b6', '#ffd700', '#ffffff', '#ec4899'],
    });

    if (sealButtonRef.current) {
      gsap.fromTo(
        sealButtonRef.current,
        { scale: 0.9 },
        { scale: 1.05, duration: 0.4, ease: 'back.out(2)' }
      );
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
          <ShieldCheck className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
          <span className="truncate">{PROPOSAL_DATA.sacredVows.badge}</span>
          <ShieldCheck className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
        </div>

        <h2 className="font-playfair text-xl sm:text-4xl font-bold mint-gradient-text drop-shadow-[0_4px_25px_rgba(56,189,248,0.6)] mb-0.5 max-w-full px-1">
          {PROPOSAL_DATA.sacredVows.title}
        </h2>

        <p className="font-serif italic text-xs sm:text-sm text-[#bae6fd]">
          {PROPOSAL_DATA.sacredVows.subtitle}
        </p>
      </div>

      {/* Main Promises Stage */}
      <div className="relative z-10 w-full max-w-3xl flex-1 flex flex-col justify-center my-auto py-1">
        <div
          ref={listRef}
          className="w-full grid grid-cols-1 gap-2.5 max-h-[380px] overflow-y-auto pr-1"
        >
          {PROMISES.map((p) => (
            <div
              key={p.id}
              className="p-3 sm:p-3.5 rounded-2xl botanical-glass border border-[#38bdf8]/30 flex items-start gap-3 text-left transition-all hover:border-[#f472b6]/70 hover:scale-[1.01]"
            >
              <div className="w-9 h-9 rounded-full bg-[#0c2445] border border-[#38bdf8]/40 flex items-center justify-center text-lg shrink-0 mt-0.5">
                {p.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-playfair text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <span>{p.text}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
                </h4>
                <p className="font-serif text-xs text-[#bae6fd]/80 mt-0.5 leading-relaxed">
                  "{p.subtext}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Seal Button Action */}
        <div className="mt-3 flex justify-center">
          <button
            ref={sealButtonRef}
            onClick={handleSealVows}
            className={`px-6 py-2 rounded-full text-xs font-serif font-bold tracking-wider uppercase border-2 flex items-center gap-2 cursor-pointer transition-all ${
              sealed
                ? 'bg-[#0c2445] border-[#f472b6] text-[#f472b6] shadow-[0_0_20px_rgba(244,114,182,0.5)]'
                : 'bg-gradient-to-r from-[#0284c7] via-[#ec4899] to-[#db2777] text-white border-[#ffd700]/60 hover:scale-105 shadow-[0_0_20px_rgba(236,72,153,0.6)]'
            }`}
          >
            <Award className="w-4 h-4 text-[#ffd700]" />
            <span>{sealed ? "✨ Sealed in the Stars Forever" : "Seal These Vows With My Heart"}</span>
          </button>
        </div>
      </div>

      {/* Bottom Nav Controls */}
      <div className="relative z-10 pt-2 pb-1 w-full max-w-3xl flex items-center justify-between gap-2">
        <button
          onClick={onPrevPage}
          className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0c2445] hover:bg-[#12335e] border border-[#38bdf8]/40 text-xs font-serif text-[#bae6fd] flex items-center gap-1.5 transition-all cursor-pointer shadow"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Chapter VIII: Heartbeat & Senses</span>
          <span className="sm:hidden">Prev 💓</span>
        </button>

        <button
          onClick={onNextPage}
          className="px-4 sm:px-6 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#0284c7] via-[#ec4899] to-[#db2777] hover:from-[#0369a1] hover:to-[#be185d] text-white text-xs sm:text-sm font-serif font-black tracking-wider shadow-[0_0_25px_rgba(236,72,153,0.7)] flex items-center gap-1.5 sm:gap-2 transition-all cursor-pointer hover:scale-105 active:scale-95"
        >
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffd700] fill-[#ffd700] shrink-0" />
          <span className="hidden sm:inline">Chapter X: The Grand Proposal 💍</span>
          <span className="sm:hidden">The Proposal 💍</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
        </button>
      </div>
    </div>
  );
}
