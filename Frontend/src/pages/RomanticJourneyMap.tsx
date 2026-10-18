import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { Compass, Footprints, MapPin, ArrowLeft, ArrowRight, Play, Pause, Calendar, Eye } from 'lucide-react';
import { romanticAudio } from '../components/RomanticAudioPlayer';
import { PROPOSAL_DATA } from '../data';

const MAP_STOPS = PROPOSAL_DATA.journeyMap.stops;

interface Props {
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function RomanticJourneyMap({ onPrevPage, onNextPage }: Props) {
  const [activeStop, setActiveStop] = useState(0);
  const [isAutoWalking, setIsAutoWalking] = useState(false);
  const [showWhisper, setShowWhisper] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const travelerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
    }
  }, []);

  const selectStop = useCallback((idx: number) => {
    if (idx === activeStop) return;
    romanticAudio.playChime('sparkle');
    setShowWhisper(false);

    if (cardRef.current) {
      gsap.to(cardRef.current, {
        opacity: 0,
        y: 10,
        duration: 0.18,
        onComplete: () => {
          setActiveStop(idx);
          gsap.fromTo(
            cardRef.current,
            { opacity: 0, y: -10 },
            { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
          );
        },
      });
    } else {
      setActiveStop(idx);
    }
  }, [activeStop]);

  // Auto walk across map
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isAutoWalking) {
      timer = setTimeout(() => {
        const next = (activeStop + 1) % MAP_STOPS.length;
        selectStop(next);
        if (next === MAP_STOPS.length - 1) {
          setIsAutoWalking(false);
        }
      }, 4500);
    }
    return () => clearTimeout(timer);
  }, [isAutoWalking, activeStop, selectStop]);

  const current = MAP_STOPS[activeStop];

  // SVG path calculation between waypoints
  const pathD = MAP_STOPS.reduce((acc: string, stop: any, i: number) => {
    if (i === 0) return `M ${stop.coords.x} ${stop.coords.y}`;
    const prev = MAP_STOPS[i - 1];
    const midX = (prev.coords.x + stop.coords.x) / 2;
    return `${acc} Q ${midX} ${prev.coords.y}, ${stop.coords.x} ${stop.coords.y}`;
  }, '');

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-between px-3 sm:px-6 py-2 overflow-y-auto select-none"
    >
      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl pt-1 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#133324]/85 border border-[#52b788]/50 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.25em] text-[#ffd700] uppercase mb-1 shadow-md backdrop-blur-md max-w-[90vw]">
          <Compass className="w-3.5 h-3.5 text-[#ffd700] animate-spin duration-10000 shrink-0" />
          <span className="truncate">Chapter II • The Map of Our Journey</span>
          <Compass className="w-3.5 h-3.5 text-[#ffd700] animate-spin duration-10000 shrink-0" />
        </div>

        <h2 className="font-playfair text-xl sm:text-4xl font-bold mint-gradient-text drop-shadow-[0_4px_25px_rgba(82,183,136,0.6)] mb-0.5 max-w-full px-1">
          The Trail That Led to You
        </h2>

        <p className="font-serif italic text-xs sm:text-sm text-[#d8f3dc]">
          "Every step, every street, every turn was gently guiding my heart to yours."
        </p>
      </div>

      {/* ── THE INTERACTIVE BOTANICAL MAP CANVAS ── */}
      <div className="relative z-10 w-full max-w-4xl bg-gradient-to-b from-[#132f22]/95 via-[#183d2c]/95 to-[#0e241a]/95 rounded-3xl p-3 sm:p-5 border-2 border-[#52b788]/50 shadow-[0_20px_60px_rgba(0,0,0,0.85)] my-auto flex flex-col justify-between">
        {/* Top Map Bar with Auto-Walk Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-[#52b788]/30">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-serif text-[#ffd700]">
            <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#74c69d] shrink-0" />
            <span className="font-bold tracking-wider uppercase truncate">
              Stop {activeStop + 1}/{MAP_STOPS.length}: {current.title}
            </span>
          </div>

          <button
            onClick={() => setIsAutoWalking(!isAutoWalking)}
            className={`self-start sm:self-auto px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-serif font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
              isAutoWalking
                ? 'bg-[#2d6a4f] text-white border-[#ffd700] shadow-[0_0_15px_rgba(82,183,136,0.8)] animate-pulse'
                : 'bg-[#0f281e] text-[#ffd700] border-[#ffd700]/50 hover:bg-[#1b4332]'
            }`}
          >
            {isAutoWalking ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-[#ffd700]" />}
            <span className="hidden sm:inline">{isAutoWalking ? 'Traveling Trail...' : 'Auto-Tour Journey'}</span>
            <span className="sm:hidden">{isAutoWalking ? 'Traveling...' : 'Auto-Tour'}</span>
          </button>
        </div>

        {/* ── VINTAGE BOTANICAL MAP SURFACE ── */}
        <div className="relative w-full h-[160px] sm:h-[220px] my-2 rounded-2xl overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d4734] via-[#133324] to-[#0b1c14] border border-[#52b788]/40">
          {/* Topo grid */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#a3d9b8_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Compass watermark */}
          <div className="absolute top-2 right-4 pointer-events-none opacity-20 text-[#ffd700]">
            <Compass className="w-20 h-20 animate-spin duration-30000" />
          </div>

          {/* SVG Trail */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Emerald glow line */}
            <path
              d={pathD}
              fill="none"
              stroke="#52b788"
              strokeWidth="1.8"
              strokeDasharray="2, 2"
              className="opacity-75"
            />
            {/* Pulsing Gold Layer */}
            <path
              d={pathD}
              fill="none"
              stroke="#ffd700"
              strokeWidth="0.9"
              strokeDasharray="1.5, 1.5"
            />
          </svg>

          {/* Moving Heart Traveler Avatar on active stop */}
          <div
            ref={travelerRef}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out pointer-events-none"
            style={{
              left: `${current.coords.x}%`,
              top: `${current.coords.y}%`,
            }}
          >
            <div className="relative flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#52b788] to-[#ffd700] flex items-center justify-center text-sm shadow-[0_0_20px_#52b788] animate-bounce border-2 border-white">
                <Footprints className="w-4 h-4 text-[#081c15]" />
              </div>
              <span className="absolute -top-5 px-2 py-0.5 rounded-full bg-[#081c15]/90 text-[9px] font-serif text-[#ffd700] whitespace-nowrap border border-[#ffd700]/40">
                Pookie & Buggu
              </span>
            </div>
          </div>

          {/* Map Pins on Trail */}
          {MAP_STOPS.map((stop: any, idx: number) => {
            const isActive = idx === activeStop;
            const isVisited = idx <= activeStop;

            return (
              <button
                key={stop.id}
                onClick={() => selectStop(idx)}
                style={{
                  left: `${stop.coords.x}%`,
                  top: `${stop.coords.y}%`,
                }}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none"
                title={stop.title}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs transition-all duration-300 ${
                    isActive
                      ? 'scale-125 bg-gradient-to-tr from-[#52b788] to-[#ffd700] border-2 border-white shadow-[0_0_20px_#52b788]'
                      : isVisited
                      ? 'bg-[#2d6a4f] text-white border border-[#ffd700]'
                      : 'bg-[#10261c] text-[#ffd700]/70 border border-[#52b788]/40 hover:border-[#ffd700] hover:scale-110'
                  }`}
                >
                  <span>{stop.icon}</span>
                </div>
                <span
                  className={`hidden sm:block absolute top-7 left-1/2 -translate-x-1/2 text-[9px] font-serif font-bold whitespace-nowrap px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-[#2d6a4f] text-[#ffd700] border border-[#ffd700]'
                      : 'text-[#d8f3dc]/70 bg-black/60'
                  }`}
                >
                  {stop.title.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── ACTIVE STOP POSTCARD ── */}
        <div
          ref={cardRef}
          className="w-full bg-[#0d2118]/90 rounded-2xl p-4 sm:p-5 border border-[#52b788]/40 grid grid-cols-1 md:grid-cols-12 gap-4 items-center"
        >
          {/* Postcard Photo */}
          <div className="md:col-span-4 flex justify-center">
            <div className="p-2 bg-white/95 rounded-xl shadow-xl rotate-[-2deg] hover:rotate-0 transition-transform duration-300 w-full max-w-[210px]">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#0d2118]">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pt-1.5 text-center">
                <p className="font-script text-sm font-bold text-[#1b4332]">
                  {current.title}
                </p>
                <p className="font-serif text-[10px] text-[#40916c]">
                  {current.date}
                </p>
              </div>
            </div>
          </div>

          {/* Narrative Content */}
          <div className="md:col-span-8 flex flex-col justify-between text-left space-y-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#52b788]/20 border border-[#52b788]/50 text-[11px] text-[#ffd700] uppercase tracking-wider mb-1">
                <MapPin className="w-3 h-3 text-[#74c69d]" />
                <span>{current.locationName}</span>
              </div>
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#f0fdf4]">
                {current.title}
              </h3>
              <div className="flex items-center gap-1 text-xs text-[#ffd700] font-serif">
                <Calendar className="w-3.5 h-3.5" />
                <span>{current.date}</span>
              </div>
            </div>

            <p className="font-serif text-xs sm:text-sm text-[#d8f3dc] leading-relaxed">
              "{current.story}"
            </p>

            {/* Secret Whisper Note */}
            <div>
              {!showWhisper ? (
                <button
                  onClick={() => {
                    setShowWhisper(true);
                    romanticAudio.playChime('heart');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#52b788]/20 hover:bg-[#52b788]/35 border border-[#74c69d]/50 text-xs font-serif text-[#ffd700] cursor-pointer transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-[#74c69d]" />
                  <span>Tap to reveal Buggu's secret whisper...</span>
                </button>
              ) : (
                <div className="p-2.5 rounded-xl bg-[#091a13]/90 border border-[#ffd700]/50 text-xs font-serif italic text-[#fef08a] animate-fadeIn">
                  <span className="text-[#ffd700] font-bold not-italic">Buggu's Whisper: </span>
                  "{current.secretWhisper}"
                </div>
              )}
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
          <span className="hidden sm:inline">Chapter I: Love Letter</span>
          <span className="sm:hidden">Prev 💌</span>
        </button>

        <button
          onClick={onNextPage}
          className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#2d6a4f] via-[#52b788] to-[#40916c] hover:from-[#40916c] hover:to-[#52b788] text-white text-xs sm:text-sm font-serif font-bold tracking-wider shadow-[0_0_20px_rgba(82,183,136,0.5)] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span className="hidden sm:inline">Chapter III: Scrapbook Moments</span>
          <span className="sm:hidden">Next 📸</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
        </button>
      </div>
    </div>
  );
}
