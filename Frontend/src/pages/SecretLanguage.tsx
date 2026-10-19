import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ArrowLeft, ArrowRight, MessageCircleHeart } from 'lucide-react';
import { romanticAudio } from '../components/RomanticAudioPlayer';
import { PROPOSAL_DATA } from '../data';

const QUIRKS = PROPOSAL_DATA.secretWorld.quirks;

interface Props {
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function SecretLanguage({ onPrevPage, onNextPage }: Props) {
  const [activeQuirk, setActiveQuirk] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
    }
  }, []);

  const selectQuirk = (idx: number) => {
    if (idx === activeQuirk) return;
    romanticAudio.playChime('click');
    setActiveQuirk(idx);

    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
      );
    }
  };

  const current = QUIRKS[activeQuirk];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-between px-3 sm:px-6 py-2 overflow-y-auto select-none"
    >
      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl pt-1 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#0f2442]/85 border border-[#38bdf8]/50 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.25em] text-[#ffd700] uppercase mb-1 shadow-md backdrop-blur-md max-w-[90vw]">
          <MessageCircleHeart className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
          <span className="truncate">{PROPOSAL_DATA.secretWorld.badge}</span>
          <MessageCircleHeart className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
        </div>

        <h2 className="font-playfair text-xl sm:text-4xl font-bold rose-gradient-text drop-shadow-[0_4px_25px_rgba(0,0,0,0.8)] mb-0.5 max-w-full px-1">
          {PROPOSAL_DATA.secretWorld.title}
        </h2>

        <p className="font-serif italic text-xs sm:text-sm text-[#bae6fd]">
          {PROPOSAL_DATA.secretWorld.subtitle}
        </p>
      </div>

      {/* Main Interactive Stage */}
      <div className="relative z-10 w-full max-w-4xl flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 items-center my-auto py-1">
        {/* Left: Quirk Selector List */}
        <div className="md:col-span-5 flex flex-col space-y-2.5">
          {QUIRKS.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => selectQuirk(idx)}
              className={`p-3 rounded-2xl text-left transition-all border cursor-pointer flex items-center gap-3 ${
                activeQuirk === idx
                  ? 'bg-gradient-to-r from-[#0284c7]/30 to-[#ec4899]/30 border-[#f472b6] shadow-[0_0_20px_rgba(56,189,248,0.4)] scale-[1.02]'
                  : 'bg-[#0c203b]/80 border-[#38bdf8]/30 hover:border-[#f472b6]/60'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-[#08182b] border border-[#38bdf8]/40 flex items-center justify-center text-xl shrink-0">
                {q.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-playfair text-sm font-bold text-[#f0f9ff] truncate">{q.title}</p>
                <p className="font-serif text-[11px] text-[#bae6fd]/80 truncate">{q.sweetRemark}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Right: Detailed Card Reveal */}
        <div className="md:col-span-7 flex flex-col justify-center">
          <div
            ref={cardRef}
            className="botanical-glass p-6 sm:p-7 rounded-3xl border-2 border-[#38bdf8]/40 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-center flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#38bdf8] to-[#f472b6] flex items-center justify-center text-3xl shadow-[0_0_25px_#f472b6] mb-3 animate-heart-pulse">
              {current.emoji}
            </div>

            <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#f0f9ff] mb-2">
              {current.title}
            </h3>

            <p className="font-serif text-sm sm:text-base text-[#e0f2fe] leading-relaxed max-w-md mb-4">
              "{current.description}"
            </p>

            <div className="w-full p-3.5 rounded-2xl bg-[#0c2445]/90 border border-[#f472b6]/40 text-xs font-serif italic text-[#bae6fd] leading-relaxed">
              <span className="text-[#f472b6] font-bold not-italic">Buggu to Pookie: </span>
              "{current.sweetRemark}" ❤️
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav Controls */}
      <div className="relative z-10 pt-2 pb-1 w-full max-w-4xl flex items-center justify-between gap-2">
        <button
          onClick={onPrevPage}
          className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0c2445] hover:bg-[#12335e] border border-[#38bdf8]/40 text-xs font-serif text-[#bae6fd] flex items-center gap-1.5 transition-all cursor-pointer shadow"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Chapter V: 100 Reasons</span>
          <span className="sm:hidden">Prev 🌸</span>
        </button>

        <button
          onClick={onNextPage}
          className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#0284c7] via-[#ec4899] to-[#db2777] hover:from-[#0369a1] hover:to-[#be185d] text-white text-xs sm:text-sm font-serif font-bold tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span className="hidden sm:inline">Chapter VII: Future Dreams 🏡</span>
          <span className="sm:hidden">Next 🏡</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
        </button>
      </div>
    </div>
  );
}
