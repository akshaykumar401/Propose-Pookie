import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Sparkles, ArrowLeft, ArrowRight, Camera, Maximize2, Minimize2 } from 'lucide-react';
import { romanticAudio } from '../components/RomanticAudioPlayer';
import { PROPOSAL_DATA } from '../data';

const PHOTOS = PROPOSAL_DATA.scrapbook.photos;

interface Props {
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function MemoryScrapbook({ onPrevPage, onNextPage }: Props) {
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
    }
  }, []);

  const switchPhoto = (idx: number) => {
    if (idx === selectedPhoto) return;
    romanticAudio.playChime('sparkle');

    if (photoRef.current) {
      gsap.to(photoRef.current, {
        scale: 0.9,
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          setSelectedPhoto(idx);
          gsap.fromTo(
            photoRef.current,
            { scale: 0.9, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.5)' }
          );
        },
      });
    } else {
      setSelectedPhoto(idx);
    }
  };

  const current = PHOTOS[selectedPhoto];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-between px-3 sm:px-6 py-2 overflow-y-auto select-none"
    >
      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl pt-1 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#0f2442]/85 border border-[#38bdf8]/50 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.25em] text-[#ffd700] uppercase mb-1 shadow-md backdrop-blur-md max-w-[90vw]">
          <Camera className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
          <span className="truncate">{PROPOSAL_DATA.scrapbook.badge}</span>
          <Camera className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
        </div>

        <h2 className="font-playfair text-xl sm:text-4xl font-bold mint-gradient-text drop-shadow-[0_4px_25px_rgba(56,189,248,0.6)] mb-0.5 max-w-full px-1">
          {PROPOSAL_DATA.scrapbook.title}
        </h2>

        <p className="font-serif italic text-xs sm:text-sm text-[#bae6fd]">
          {PROPOSAL_DATA.scrapbook.subtitle}
        </p>
      </div>

      {/* Main Scrapbook Stage */}
      <div className="relative z-10 w-full max-w-4xl flex-1 flex flex-col md:flex-row items-center justify-center gap-6 my-auto py-1">
        {/* Large Focused Polaroid Display */}
        <div ref={photoRef} className="w-full max-w-sm flex flex-col items-center">
          <div className={`p-4 bg-[#ffffff] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-[#7dd3fc] ${current.rotation} transition-transform duration-300 relative w-full`}>
            {/* Romantic Pink Washi Tape at top */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-[#f472b6]/80 backdrop-blur-sm rounded rotate-[-1deg] border border-white/60 shadow-sm flex items-center justify-center">
              <span className="text-[10px] font-sans font-bold text-white tracking-widest uppercase">
                {selectedPhoto + 1} of {PHOTOS.length}
              </span>
            </div>

            <div className="w-full aspect-[3/4] sm:aspect-[4/5] max-h-[390px] sm:max-h-[430px] rounded-xl overflow-hidden bg-gradient-to-br from-[#fff0f3] via-[#fdf2f8] to-[#fce7f3] border border-pink-200/70 mt-1 mb-3 relative group flex items-center justify-center shadow-inner">
              {/* Romantic glowing ambient bokeh backdrop - completely eliminates black bars */}
              {current.imgUrl && !(/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(current.imgUrl) || current.imgUrl.includes('/moments/')) && (
                <img
                  src={current.imgUrl}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-85 scale-125 brightness-105 pointer-events-none select-none"
                />
              )}

              {/* Gentle soft-light overlay for fairytale atmosphere */}
              <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] pointer-events-none" />

              {current.imgUrl && (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(current.imgUrl) || current.imgUrl.includes('/moments/')) ? (
                <video
                  key={current.imgUrl}
                  src={current.imgUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  ref={(el) => {
                    if (el) {
                      el.muted = true;
                      el.play().catch(() => {});
                    }
                  }}
                  className={`relative z-10 max-h-full max-w-full ${fitMode === 'contain' ? 'object-contain rounded-lg shadow-md' : 'object-cover w-full h-full'}`}
                />
              ) : (
                <img
                  src={current.imgUrl}
                  alt={current.title}
                  className={`relative z-10 max-h-full max-w-full ${
                    fitMode === 'contain'
                      ? 'object-contain rounded-lg shadow-[0_6px_20px_rgba(236,72,153,0.2)]'
                      : 'object-cover w-full h-full'
                  } transition-transform duration-500 hover:scale-[1.02]`}
                />
              )}

              {/* Fit / Fill toggle button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFitMode(prev => prev === 'contain' ? 'cover' : 'contain');
                }}
                title={fitMode === 'contain' ? 'Switch to Fill Frame' : 'Switch to Fit Entire Photo (No crop)'}
                className="absolute top-2 right-2 z-20 px-2.5 py-1 rounded-full bg-white/90 hover:bg-white text-[#be185d] text-[10px] font-sans font-bold flex items-center gap-1 backdrop-blur-md border border-pink-200 shadow-[0_2px_8px_rgba(236,72,153,0.2)] transition-all cursor-pointer"
              >
                {fitMode === 'contain' ? (
                  <>
                    <Maximize2 className="w-3 h-3 text-[#ec4899]" />
                    <span>Fit</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-3 h-3 text-[#ec4899]" />
                    <span>Fill</span>
                  </>
                )}
              </button>

              {/* Prev / Next photo overlay buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  switchPhoto((selectedPhoto - 1 + PHOTOS.length) % PHOTOS.length);
                }}
                title="Previous photo"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-[#ec4899] hover:text-[#be185d] flex items-center justify-center backdrop-blur-md transition-all border border-pink-200 shadow-[0_4px_12px_rgba(236,72,153,0.3)] hover:scale-110 cursor-pointer text-lg font-bold"
              >
                ‹
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  switchPhoto((selectedPhoto + 1) % PHOTOS.length);
                }}
                title="Next photo"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-white text-[#ec4899] hover:text-[#be185d] flex items-center justify-center backdrop-blur-md transition-all border border-pink-200 shadow-[0_4px_12px_rgba(236,72,153,0.3)] hover:scale-110 cursor-pointer text-lg font-bold"
              >
                ›
              </button>
            </div>

            {/* Handwritten note beneath */}
            <div className="text-center px-1">
              <div className="flex items-center justify-between text-xs text-[#0369a1] mb-1 font-serif">
                <span className="font-bold">{current.date}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#38bdf8]/20 text-[10px] text-[#0284c7] font-bold">
                  {current.sticker}
                </span>
              </div>
              <h3 className="font-vibes text-2xl sm:text-3xl text-[#0369a1] font-bold mb-1">
                {current.title}
              </h3>
              <p className="font-serif italic text-xs sm:text-sm text-[#0c4a6e] leading-relaxed">
                "{current.caption}"
              </p>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector & Sweet Sticky Notes */}
        <div className="w-full max-w-md flex flex-col space-y-3">
          <div className="botanical-glass p-3.5 rounded-2xl border border-[#38bdf8]/40 text-left">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-playfair text-sm sm:text-base font-bold text-[#ffd700] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#f472b6]" />
                <span>Our 10 Moments ({selectedPhoto + 1}/{PHOTOS.length})</span>
              </h4>
              <span className="text-[10px] text-[#bae6fd] font-serif">Click any to view</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 sm:max-h-56 overflow-y-auto pr-1">
              {PHOTOS.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => switchPhoto(idx)}
                  className={`p-1.5 rounded-xl text-left transition-all cursor-pointer border flex items-center gap-2 ${
                    selectedPhoto === idx
                      ? 'bg-[#38bdf8]/30 border-[#f472b6] text-white shadow-[0_0_15px_rgba(56,189,248,0.6)]'
                      : 'bg-[#08182d]/80 border-[#38bdf8]/20 text-[#bae6fd] hover:border-[#f472b6]'
                  }`}
                >
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                    selectedPhoto === idx ? 'bg-[#f472b6] text-white' : 'bg-[#38bdf8]/20 text-[#38bdf8]'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-xs font-bold truncate">{p.title}</p>
                    <p className="text-[9px] text-[#ffd700]/80 font-sans truncate">{p.date}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sticky Love Note from Proposer in Soft Pale Gold */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#fef08a] to-[#fde047] text-[#1e1b4b] shadow-xl border-2 border-[#eab308] rotate-[1.5deg] relative">
            <div className="absolute -top-2.5 right-4 w-6 h-6 rounded-full bg-[#ec4899] border-2 border-white shadow flex items-center justify-center text-[10px] text-white">
              💖
            </div>
            <p className="font-script text-xl sm:text-2xl font-bold leading-snug">
              "{PROPOSAL_DATA.scrapbook.stickyNoteText}"
            </p>
            <p className="font-brush text-xl text-right mt-1 font-bold text-[#be185d]">
              — Love, {PROPOSAL_DATA.proposerNickname} ❤️
            </p>
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
          <span className="hidden sm:inline">Chapter II: Journey Map</span>
          <span className="sm:hidden">Prev 🗺️</span>
        </button>

        <button
          onClick={onNextPage}
          className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#0284c7] via-[#ec4899] to-[#db2777] hover:from-[#0369a1] hover:to-[#be185d] text-white text-xs sm:text-sm font-serif font-bold tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span className="hidden sm:inline">Chapter IV: Cinema of Love 🎬</span>
          <span className="sm:hidden">Next 🎬</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
        </button>
      </div>
    </div>
  );
}
