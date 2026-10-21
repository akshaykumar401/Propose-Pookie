import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { Compass, MapPin, ArrowLeft, ArrowRight, Play, Pause, Calendar, Eye, Heart, Map, Sparkles, Volume2 } from 'lucide-react';
import { romanticAudio } from '../components/RomanticAudioPlayer';
import { PROPOSAL_DATA } from '../data';

const MAP_STOPS = PROPOSAL_DATA.journeyMap.stops;

// Alternate whimsical adventure quest coordinates for the 10 stops
const ADVENTURE_COORDS = [
  { x: 12, y: 78 }, // 0: First Glance Cafe Harbor
  { x: 26, y: 56 }, // 1: Moonlight River Crossing
  { x: 18, y: 32 }, // 2: Rainy Lantern Alley
  { x: 36, y: 22 }, // 3: Emerald Mountain Pass
  { x: 52, y: 38 }, // 4: Golden Hour Sunset Ridge
  { x: 40, y: 68 }, // 5: Midnight Kitchen Grove
  { x: 60, y: 80 }, // 6: Whispering Tide Cove
  { x: 76, y: 62 }, // 7: Stargazer Rooftop Dune
  { x: 88, y: 40 }, // 8: Sunlit Sunday Plateau
  { x: 72, y: 20 }, // 9: Celestial Citadel of Forever
];

// Generates a smooth, organic Catmull-Rom cubic Bezier path through waypoints
function getSmoothPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 >= points.length ? i + 1 : i + 2];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x} ${p2.y}`;
  }
  return d;
}

interface Props {
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function RomanticJourneyMap({ onPrevPage, onNextPage }: Props) {
  const [activeStop, setActiveStop] = useState(0);
  const [isAutoWalking, setIsAutoWalking] = useState(false);
  const [showWhisper, setShowWhisper] = useState(false);
  const [mapMode, setMapMode] = useState<'heart' | 'adventure'>('heart');
  const [isWhistling, setIsWhistling] = useState(false);
  const [trainPos, setTrainPos] = useState<{ x: number; y: number; angle: number }>({
    x: MAP_STOPS[0].coords.x,
    y: MAP_STOPS[0].coords.y,
    angle: 0,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const trackPathRef = useRef<SVGPathElement>(null);
  const animRef = useRef<{ dist: number }>({ dist: 0 });

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
    }
  }, []);

  // Determine current active coordinates based on layout mode
  const currentCoords = MAP_STOPS.map((stop, i) =>
    mapMode === 'heart' ? stop.coords : ADVENTURE_COORDS[i]
  );

  const current = MAP_STOPS[activeStop];

  // Calculate full railway track path & visited track path
  const fullPathD = getSmoothPath(currentCoords);
  const visitedPathD = getSmoothPath(currentCoords.slice(0, activeStop + 1));

  // Compute exact station distance on the SVG path for a given stop
  const getStationDistance = useCallback(
    (stopIdx: number): number => {
      if (!trackPathRef.current) return 0;
      const pathEl = trackPathRef.current;
      const total = pathEl.getTotalLength();
      if (total <= 0) return 0;

      const target = currentCoords[stopIdx];
      const step = total / 240;
      let bestDist = 0;
      let minDist = Infinity;

      for (let d = 0; d <= total; d += step) {
        const pt = pathEl.getPointAtLength(d);
        const dist = Math.hypot(pt.x - target.x, pt.y - target.y);
        if (dist < minDist) {
          minDist = dist;
          bestDist = d;
        }
      }
      return bestDist;
    },
    [currentCoords]
  );

  // Trigger whistle animation & audio
  const triggerWhistle = useCallback(() => {
    setIsWhistling(true);
    romanticAudio.playChime('train');
    setTimeout(() => setIsWhistling(false), 1400);
  }, []);

  // Animate the love train along the railway track to the active stop
  const animateTrainToStop = useCallback(
    (stopIdx: number, playWhistleSound: boolean = true) => {
      if (playWhistleSound) {
        triggerWhistle();
      }

      const pathEl = trackPathRef.current;
      if (!pathEl) {
        const pt = currentCoords[stopIdx];
        setTrainPos({ x: pt.x, y: pt.y, angle: 0 });
        return;
      }

      const targetDist = getStationDistance(stopIdx);
      const total = pathEl.getTotalLength();

      gsap.killTweensOf(animRef.current);
      gsap.to(animRef.current, {
        dist: targetDist,
        duration: 1.45,
        ease: 'power2.inOut',
        onUpdate: () => {
          const d = animRef.current.dist;
          const pt = pathEl.getPointAtLength(d);
          const ptNext = pathEl.getPointAtLength(Math.min(d + 0.8, total));
          const angle = Math.atan2(ptNext.y - pt.y, ptNext.x - pt.x) * (180 / Math.PI);
          setTrainPos({ x: pt.x, y: pt.y, angle });
        },
      });
    },
    [currentCoords, getStationDistance, triggerWhistle]
  );

  // Handle station selection
  const selectStop = useCallback(
    (idx: number) => {
      if (idx === activeStop) {
        triggerWhistle();
        return;
      }
      setShowWhisper(false);

      if (cardRef.current) {
        gsap.to(cardRef.current, {
          opacity: 0,
          y: 10,
          duration: 0.18,
          onComplete: () => {
            setActiveStop(idx);
            animateTrainToStop(idx, true);
            gsap.fromTo(
              cardRef.current,
              { opacity: 0, y: -10 },
              { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
            );
          },
        });
      } else {
        setActiveStop(idx);
        animateTrainToStop(idx, true);
      }
    },
    [activeStop, animateTrainToStop, triggerWhistle]
  );

  // Sync train position when mode changes or on initial mount
  useEffect(() => {
    const timer = setTimeout(() => {
      animateTrainToStop(activeStop, false);
    }, 150);
    return () => clearTimeout(timer);
  }, [mapMode, activeStop, animateTrainToStop]);

  // Auto walk across train stations
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isAutoWalking) {
      timer = setTimeout(() => {
        const next = (activeStop + 1) % MAP_STOPS.length;
        selectStop(next);
        if (next === MAP_STOPS.length - 1) {
          setIsAutoWalking(false);
        }
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isAutoWalking, activeStop, selectStop]);

  // Train orientation: ensure the train stays right-side up even when rounding curves
  const rawAngle = trainPos.angle;
  const isMovingLeft = Math.abs(rawAngle) > 90;
  const trainRotation = isMovingLeft ? rawAngle - 180 : rawAngle;
  const trainFlipScaleX = isMovingLeft ? -1 : 1;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-between px-3 sm:px-6 py-2 overflow-y-auto select-none"
    >
      <style>{`
        @keyframes puffSteam1 {
          0% { transform: translate(0, 0) scale(0.4); opacity: 0; }
          25% { opacity: 0.9; }
          100% { transform: translate(-22px, -36px) scale(1.6); opacity: 0; }
        }
        @keyframes puffSteam2 {
          0% { transform: translate(0, 0) scale(0.3); opacity: 0; }
          30% { opacity: 0.85; }
          100% { transform: translate(-30px, -48px) scale(2.0); opacity: 0; }
        }
        @keyframes puffHeartFloat {
          0% { transform: translate(0, 0) scale(0.5); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translate(-18px, -42px) scale(1.5); opacity: 0; }
        }
        @keyframes pistonDrive {
          0% { transform: translateX(0); }
          50% { transform: translateX(5px); }
          100% { transform: translateX(0); }
        }
        @keyframes wheelSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes chugBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
        }
        @keyframes headlightBeamPulse {
          0%, 100% { opacity: 0.65; }
          50% { opacity: 0.9; }
        }
      `}</style>

      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl pt-1 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#0f2442]/85 border border-[#38bdf8]/50 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.25em] text-[#ffd700] uppercase mb-1 shadow-md backdrop-blur-md max-w-[90vw]">
          <span className="text-sm">🚂</span>
          <span className="truncate">Chapter II • The Pookie & Buggu Love Express</span>
          <span className="text-sm">✨</span>
        </div>

        <h2 className="font-playfair text-xl sm:text-3xl md:text-4xl font-bold mint-gradient-text drop-shadow-[0_4px_25px_rgba(56,189,248,0.6)] mb-0.5 max-w-full px-1">
          The Train That Led to You
        </h2>

        <p className="font-serif italic text-xs sm:text-sm text-[#bae6fd]">
          {mapMode === 'heart'
            ? '"Riding the heart-shaped starlight railway to our forever destination 🚂💨"'
            : '"Every station, every turn was gently guiding our train to your heart."'}
        </p>
      </div>

      {/* ── THE INTERACTIVE ROMANTIC RAILWAY MAP CANVAS ── */}
      <div className="relative z-10 w-full max-w-4xl bg-gradient-to-b from-[#0c2445]/95 via-[#12315a]/95 to-[#091a32]/95 rounded-3xl p-3 sm:p-5 border-2 border-[#38bdf8]/50 shadow-[0_20px_60px_rgba(0,0,0,0.85)] my-auto flex flex-col justify-between">
        {/* Top Map Bar with Train Whistle & Stepper */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#38bdf8]/30">
          <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-serif text-[#ffd700]">
            <span className="text-base">🚉</span>
            <span className="font-bold tracking-wider uppercase truncate">
              Platform {activeStop + 1}/{MAP_STOPS.length}: {current.title}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Whistle Sound Trigger */}
            <button
              onClick={triggerWhistle}
              className={`px-3 py-1 rounded-full text-[11px] font-serif font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95 ${
                isWhistling
                  ? 'bg-[#e11d48] text-white border border-[#ffd700] shadow-[0_0_15px_#f43f5e] animate-bounce'
                  : 'bg-gradient-to-r from-[#881337] to-[#be123c] text-[#fecdd3] hover:text-white border border-[#f43f5e]/60'
              }`}
              title="Blow Love Train Whistle"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#ffd700] animate-pulse" />
              <span>Blow Whistle 🚂💨</span>
            </button>

            {/* Map Mode Switcher */}
            <div className="flex items-center bg-[#071930] p-0.5 rounded-full border border-[#38bdf8]/40 shadow-inner">
              <button
                onClick={() => {
                  setMapMode('heart');
                  triggerWhistle();
                }}
                className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-serif font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  mapMode === 'heart'
                    ? 'bg-gradient-to-r from-[#ec4899] to-[#db2777] text-white shadow-[0_0_10px_rgba(236,72,153,0.6)]'
                    : 'text-[#bae6fd]/70 hover:text-white'
                }`}
                title="Heart Railway Circuit"
              >
                <Heart className="w-2.5 h-2.5 fill-current" />
                <span>Heart Rail</span>
              </button>
              <button
                onClick={() => {
                  setMapMode('adventure');
                  triggerWhistle();
                }}
                className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-serif font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  mapMode === 'adventure'
                    ? 'bg-[#0284c7] text-white shadow-[0_0_10px_rgba(2,132,199,0.6)]'
                    : 'text-[#bae6fd]/70 hover:text-white'
                }`}
                title="Fairytale Valley Railway"
              >
                <Map className="w-2.5 h-2.5" />
                <span>Valley Rail</span>
              </button>
            </div>

            {/* Station Stepper */}
            <div className="flex items-center gap-1 bg-[#0c2445] px-2 py-0.5 rounded-full border border-[#38bdf8]/40 shadow-inner">
              <button
                onClick={() => selectStop((activeStop - 1 + MAP_STOPS.length) % MAP_STOPS.length)}
                className="p-1 text-[#bae6fd] hover:text-white hover:bg-[#38bdf8]/20 rounded-full transition-colors cursor-pointer"
                title="Previous Station"
              >
                <ArrowLeft className="w-3 h-3" />
              </button>
              <span className="text-[11px] font-mono text-[#ffd700] px-1 font-semibold">
                {activeStop + 1}/{MAP_STOPS.length}
              </span>
              <button
                onClick={() => selectStop((activeStop + 1) % MAP_STOPS.length)}
                className="p-1 text-[#bae6fd] hover:text-white hover:bg-[#38bdf8]/20 rounded-full transition-colors cursor-pointer"
                title="Next Station"
              >
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Auto-Ride Train Button */}
            <button
              onClick={() => {
                const nextState = !isAutoWalking;
                setIsAutoWalking(nextState);
                if (nextState) triggerWhistle();
              }}
              className={`px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-serif font-bold flex items-center gap-1.5 transition-all border cursor-pointer ${
                isAutoWalking
                  ? 'bg-[#be123c] text-white border-[#f43f5e] shadow-[0_0_15px_rgba(244,63,94,0.8)] animate-pulse'
                  : 'bg-[#0c2445] text-[#f472b6] border-[#38bdf8]/50 hover:bg-[#12335e]'
              }`}
            >
              {isAutoWalking ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-[#f472b6]" />}
              <span className="hidden sm:inline">{isAutoWalking ? 'Train Cruising...' : 'Express Tour'}</span>
              <span className="sm:hidden">{isAutoWalking ? 'Ride...' : 'Tour'}</span>
            </button>
          </div>
        </div>

        {/* ── RICH RAILWAY MAP CANVAS WITH ATTRACTIVE TRAIN ── */}
        <div className="relative w-full h-[270px] sm:h-[330px] md:h-[360px] my-2 rounded-2xl overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0d2a54] via-[#081f3d] to-[#040e1c] border border-[#38bdf8]/40 shadow-inner">
          {/* Topographic cartography contours & stardust grid */}
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#7dd3fc_1px,transparent_1px)] [background-size:28px_28px]" />

          {/* Celestial compass watermark */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10 text-[#38bdf8]">
            <Compass className="w-72 h-72 animate-spin duration-60000" />
          </div>

          {/* Ethereal Heart Constellation watermark (illuminated in Heart Mode) */}
          {mapMode === 'heart' && (
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-20 transition-opacity duration-700"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M 50 36 C 45 15, 12 12, 12 45 C 12 68, 35 84, 50 94 C 65 84, 88 68, 88 45 C 88 12, 55 15, 50 36 Z"
                fill="none"
                stroke="#f472b6"
                strokeWidth="0.8"
                strokeDasharray="2, 3"
              />
            </svg>
          )}

          {/* Center Sacred Proposal Terminal Pulse (Station 10) */}
          {mapMode === 'heart' && (
            <div className="absolute top-[46%] left-[50%] -translate-x-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#f472b6]/25 to-[#ffd700]/25 animate-ping opacity-40" />
              <div className="absolute w-12 h-12 rounded-full border border-[#ffd700]/50 animate-pulse" />
            </div>
          )}

          {/* ── SVG RAILWAY TRACKS ── */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="trainGoldTrack" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#ffd700" />
              </linearGradient>
              <filter id="railGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Hidden Master Track Path for length/point calculation */}
            <path ref={trackPathRef} d={fullPathD} fill="none" stroke="transparent" />

            {/* ── 1. UNVISITED / FULL RAILWAY TRACK ── */}
            {/* Gravel / Ballast Bed */}
            <path
              d={fullPathD}
              fill="none"
              stroke="#071b34"
              strokeWidth="4.6"
              strokeLinecap="round"
              opacity="0.8"
            />
            {/* Railroad Sleepers (Wooden Cross-Ties) */}
            <path
              d={fullPathD}
              fill="none"
              stroke="#334155"
              strokeWidth="3.4"
              strokeDasharray="1.2, 3.2"
              className="opacity-75"
            />
            {/* Twin Steel Rails */}
            <path
              d={fullPathD}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.8"
              opacity="0.45"
            />
            <path
              d={fullPathD}
              fill="none"
              stroke="#081f3d"
              strokeWidth="1.0"
            />

            {/* ── 2. VISITED GOLDEN GLOWING RAILWAY TRACK ── */}
            {/* Golden glowing cross-ties */}
            <path
              d={visitedPathD}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3.6"
              strokeDasharray="1.2, 3.2"
              filter="url(#railGlow)"
              className="opacity-90"
            />
            {/* Golden twin rails */}
            <path
              d={visitedPathD}
              fill="none"
              stroke="url(#trainGoldTrack)"
              strokeWidth="2.0"
              filter="url(#railGlow)"
              className="transition-all duration-700"
            />
            <path
              d={visitedPathD}
              fill="none"
              stroke="#081f3d"
              strokeWidth="1.0"
            />
          </svg>

          {/* ── 3. ATTRACTIVE & DETAILED LOVE EXPRESS STEAM TRAIN OVERLAY ── */}
          <div
            onClick={triggerWhistle}
            style={{
              left: `${trainPos.x}%`,
              top: `${trainPos.y}%`,
              transform: `translate(-45%, -65%) rotate(${trainRotation}deg) scaleX(${trainFlipScaleX})`,
            }}
            className="absolute z-20 w-[68px] sm:w-[84px] h-[26px] sm:h-[32px] pointer-events-auto cursor-pointer group transition-transform duration-100 ease-linear"
            title="Click to blow Love Express whistle! 🚂💨"
          >
            {/* SVG Illustration of the High-Detail Express Train */}
            <svg
              viewBox="0 0 160 60"
              className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] filter"
            >
              <defs>
                {/* Volumetric Headlight Radiant Cone */}
                <linearGradient id="headlightCone" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                  <stop offset="40%" stopColor="#fef08a" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#fef08a" stopOpacity="0.0" />
                </linearGradient>

                {/* Locomotive Crimson-Ruby Body Gradient */}
                <linearGradient id="locoRed" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#e11d48" />
                  <stop offset="40%" stopColor="#be123c" />
                  <stop offset="100%" stopColor="#881337" />
                </linearGradient>

                {/* Coach Royal Burgundy Gradient */}
                <linearGradient id="coachBurgundy" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#9f1239" />
                  <stop offset="50%" stopColor="#881337" />
                  <stop offset="100%" stopColor="#4c0519" />
                </linearGradient>

                {/* Polished Brass Gold Gradient */}
                <linearGradient id="brassGold" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#fef08a" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#b45309" />
                </linearGradient>
              </defs>

              {/* ── Volumetric Headlight Light Beam projecting forward ── */}
              <polygon
                points="148,32 195,14 195,50 148,38"
                fill="url(#headlightCone)"
                style={{ animation: 'headlightBeamPulse 2s ease-in-out infinite' }}
              />

              {/* ── Steam & Glowing Heart Clouds from Smokestack (x: 132, y: 14) ── */}
              <g transform="translate(132, 14)">
                {/* Heart Puff 1 */}
                <text
                  x="-2"
                  y="-2"
                  fontSize="7"
                  fill="#f472b6"
                  style={{ animation: 'puffHeartFloat 1.8s ease-out infinite' }}
                >
                  💖
                </text>
                {/* Steam Cloud 1 */}
                <circle
                  cx="-6"
                  cy="-8"
                  r="4.5"
                  fill="#ffffff"
                  style={{ animation: 'puffSteam1 2.2s ease-out infinite 0.3s' }}
                />
                {/* Steam Cloud 2 */}
                <circle
                  cx="-12"
                  cy="-14"
                  r="6"
                  fill="#fce7f3"
                  style={{ animation: 'puffSteam2 2.6s ease-out infinite 0.7s' }}
                />
                {/* Sparkle Stardust */}
                <text
                  x="-8"
                  y="-10"
                  fontSize="5.5"
                  fill="#ffd700"
                  style={{ animation: 'puffHeartFloat 2.0s ease-out infinite 0.4s' }}
                >
                  ✨
                </text>
              </g>

              {/* ── CARRIAGE #1: THE POOKIE & BUGGU ROYAL COACH (x: 4 to 56) ── */}
              <g>
                {/* Coach Underframe */}
                <rect x="5" y="44" width="50" height="3" rx="1" fill="#1e293b" />

                {/* Coach Main Body */}
                <rect
                  x="6"
                  y="18"
                  width="48"
                  height="26"
                  rx="3"
                  fill="url(#coachBurgundy)"
                  stroke="#fbbf24"
                  strokeWidth="0.8"
                />

                {/* Coach Elegant Curved Roof */}
                <path
                  d="M 5 19 C 5 15, 12 14, 30 14 C 48 14, 55 15, 55 19 Z"
                  fill="#334155"
                  stroke="#ffd700"
                  strokeWidth="0.5"
                />

                {/* Roof Twinkling Fairy Lights */}
                <circle cx="12" cy="14" r="0.9" fill="#fef08a" className="animate-pulse" />
                <circle cx="20" cy="13.5" r="0.9" fill="#f472b6" className="animate-pulse" />
                <circle cx="28" cy="13.2" r="0.9" fill="#ffd700" className="animate-pulse" />
                <circle cx="36" cy="13.5" r="0.9" fill="#fef08a" className="animate-pulse" />
                <circle cx="44" cy="14" r="0.9" fill="#f472b6" className="animate-pulse" />

                {/* Arched Observation Window 1 (with couple silhouette) */}
                <g>
                  <path
                    d="M 12 36 L 12 26 C 12 21, 24 21, 24 26 L 24 36 Z"
                    fill="#fef08a"
                    stroke="#ffd700"
                    strokeWidth="0.6"
                  />
                  {/* Silhouette of Buggu & Pookie looking out */}
                  <circle cx="16" cy="28" r="2.2" fill="#881337" />
                  <circle cx="20" cy="27.5" r="2.0" fill="#881337" />
                  <path d="M 14 36 C 14 31, 22 31, 22 36 Z" fill="#881337" />
                  {/* Heart between them */}
                  <text x="16.5" y="24" fontSize="3" fill="#e11d48">
                    ❤️
                  </text>
                </g>

                {/* Arched Observation Window 2 */}
                <g>
                  <path
                    d="M 32 36 L 32 26 C 32 21, 44 21, 44 26 L 44 36 Z"
                    fill="#fef08a"
                    stroke="#ffd700"
                    strokeWidth="0.6"
                  />
                  {/* Heart Lantern in Window 2 */}
                  <text x="35.5" y="32" fontSize="5" fill="#e11d48">
                    💖
                  </text>
                </g>

                {/* Gold Nameplate Ribbon */}
                <rect x="12" y="38" width="36" height="4.5" rx="1.5" fill="#1e1b4b" stroke="#ffd700" strokeWidth="0.5" />
                <text
                  x="30"
                  y="41.5"
                  fontSize="2.8"
                  fontWeight="bold"
                  fill="#ffd700"
                  textAnchor="middle"
                  fontFamily="serif"
                  letterSpacing="0.4"
                >
                  POOKIE & BUGGU 💖
                </text>

                {/* Coach Wheels with Brass Spokes */}
                <g transform="translate(16, 47)">
                  <circle cx="0" cy="0" r="4.2" fill="#0f172a" stroke="#ffd700" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="1.5" fill="#f59e0b" />
                </g>
                <g transform="translate(44, 47)">
                  <circle cx="0" cy="0" r="4.2" fill="#0f172a" stroke="#ffd700" strokeWidth="0.8" />
                  <circle cx="0" cy="0" r="1.5" fill="#f59e0b" />
                </g>
              </g>

              {/* ── Magnetic Coupler Link between Coach & Tender (x: 54 to 62) ── */}
              <rect x="54" y="39" width="8" height="2" rx="1" fill="#475569" stroke="#ffd700" strokeWidth="0.4" />

              {/* ── TENDER (HEART FUEL CAR) (x: 62 to 84) ── */}
              <g>
                <rect x="62" y="44" width="22" height="3" rx="1" fill="#1e293b" />
                <path
                  d="M 62 25 L 65 22 L 83 22 L 83 44 L 62 44 Z"
                  fill="url(#coachBurgundy)"
                  stroke="#ffd700"
                  strokeWidth="0.6"
                />
                {/* Glowing Pink Heart Crystals in Tender */}
                <text x="66" y="20" fontSize="5" fill="#f43f5e">
                  💎
                </text>
                <text x="73" y="19" fontSize="6" fill="#ec4899">
                  💖
                </text>

                {/* Tender Wheels */}
                <circle cx="68" cy="47" r="3.8" fill="#0f172a" stroke="#ffd700" strokeWidth="0.7" />
                <circle cx="78" cy="47" r="3.8" fill="#0f172a" stroke="#ffd700" strokeWidth="0.7" />
              </g>

              {/* ── LOCOMOTIVE STEAM ENGINE (x: 84 to 150) ── */}
              <g style={{ animation: 'chugBounce 0.45s ease-in-out infinite' }}>
                {/* Engine Underframe */}
                <rect x="84" y="44" width="64" height="3.5" rx="1" fill="#0f172a" stroke="#ffd700" strokeWidth="0.5" />

                {/* Driver's Cabin (x: 85 to 105) */}
                <rect
                  x="85"
                  y="12"
                  width="20"
                  height="32"
                  rx="2"
                  fill="url(#locoRed)"
                  stroke="#ffd700"
                  strokeWidth="0.8"
                />
                {/* Cabin Overhanging Roof */}
                <path d="M 83 13 C 83 10, 95 9, 107 10 L 107 13 Z" fill="#334155" stroke="#ffd700" strokeWidth="0.6" />
                {/* Cabin Arched Lit Window */}
                <rect x="88" y="16" width="13" height="14" rx="2" fill="#fef08a" stroke="#ffd700" strokeWidth="0.5" />
                {/* Conductor Heart */}
                <text x="91.5" y="26" fontSize="5" fill="#be123c">
                  🥰
                </text>

                {/* Boiler Cylinder (x: 105 to 142) */}
                <rect
                  x="105"
                  y="17"
                  width="37"
                  height="27"
                  rx="3"
                  fill="url(#locoRed)"
                  stroke="#ffd700"
                  strokeWidth="0.8"
                />
                {/* Polished Brass Boiler Rings */}
                <line x1="114" y1="17" x2="114" y2="44" stroke="#ffd700" strokeWidth="1.2" />
                <line x1="126" y1="17" x2="126" y2="44" stroke="#ffd700" strokeWidth="1.2" />
                <line x1="138" y1="17" x2="138" y2="44" stroke="#ffd700" strokeWidth="1.2" />

                {/* Brass Steam Dome */}
                <path d="M 118 17 C 118 10, 124 10, 124 17 Z" fill="url(#brassGold)" stroke="#ffd700" strokeWidth="0.5" />
                {/* Golden Whistle */}
                <rect x="110" y="8" width="1.6" height="5" fill="url(#brassGold)" />
                <ellipse cx="110.8" cy="8" rx="1.5" ry="1" fill="#fef08a" />

                {/* Smokestack / Chimney with Gold Lip */}
                <path d="M 130 17 L 131 9 L 137 9 L 138 17 Z" fill="#1e293b" stroke="#ffd700" strokeWidth="0.6" />
                <ellipse cx="134" cy="9" rx="3.5" ry="1.2" fill="url(#brassGold)" stroke="#ffd700" strokeWidth="0.5" />

                {/* Front Boiler Door / Smoke-box front */}
                <path d="M 142 20 C 147 20, 147 41, 142 41 Z" fill="#1e293b" stroke="#ffd700" strokeWidth="0.8" />
                {/* Front Golden Number 520 / Heart badge */}
                <circle cx="144" cy="30" r="3.2" fill="#ffd700" stroke="#881337" strokeWidth="0.6" />
                <text x="144" y="32" fontSize="2.8" fontWeight="bold" fill="#881337" textAnchor="middle">
                  ❤️
                </text>

                {/* Polished Brass Headlamp */}
                <g>
                  <rect x="145" y="30" width="4" height="6" rx="1" fill="url(#brassGold)" stroke="#ffd700" strokeWidth="0.5" />
                  <circle cx="149" cy="33" r="3" fill="#fef08a" stroke="#ffffff" strokeWidth="0.6" className="animate-pulse" />
                </g>

                {/* Front Cowcatcher / Pilot Grill */}
                <polygon points="144,47 155,47 149,42" fill="url(#brassGold)" stroke="#ffd700" strokeWidth="0.5" />

                {/* Large Driving Wheels with Counterweights & Golden Spokes */}
                <g transform="translate(100, 46)">
                  <circle cx="0" cy="0" r="6" fill="#0f172a" stroke="#ffd700" strokeWidth="1" />
                  <circle cx="0" cy="0" r="2" fill="url(#brassGold)" />
                </g>
                <g transform="translate(118, 46)">
                  <circle cx="0" cy="0" r="6" fill="#0f172a" stroke="#ffd700" strokeWidth="1" />
                  <circle cx="0" cy="0" r="2" fill="url(#brassGold)" />
                </g>
                <g transform="translate(136, 46)">
                  <circle cx="0" cy="0" r="6" fill="#0f172a" stroke="#ffd700" strokeWidth="1" />
                  <circle cx="0" cy="0" r="2" fill="url(#brassGold)" />
                </g>

                {/* Animated Metallic Piston Connecting Rod */}
                <line
                  x1="100"
                  y1="47.5"
                  x2="136"
                  y2="47.5"
                  stroke="url(#brassGold)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  style={{ animation: 'pistonDrive 0.45s ease-in-out infinite' }}
                />
              </g>
            </svg>

            {/* Cute Speech Bubble / Whistle Tooltip on Hover or Click */}
            <div
              className={`absolute -top-5 left-1/2 -translate-x-1/2 px-1.5 py-0.2 rounded-full bg-[#881337]/95 border border-[#ffd700] text-[8px] font-serif text-[#ffd700] whitespace-nowrap shadow-md transition-all duration-300 flex items-center gap-0.5 ${
                isWhistling ? 'scale-110 opacity-100 ring-1 ring-[#ffd700]' : 'opacity-85 group-hover:opacity-100'
              }`}
            >
              <span>🚂</span>
              <span className="font-bold">{isWhistling ? 'TOOT! ❤️' : 'Love Express'}</span>
            </div>
          </div>

          {/* 10 Railway Stations / Stops along the Track */}
          {MAP_STOPS.map((stop: any, idx: number) => {
            const coord = currentCoords[idx];
            const isActive = idx === activeStop;
            const isVisited = idx <= activeStop;
            const isTopHalf = coord.y < 50;

            return (
              <button
                key={stop.id}
                onClick={() => selectStop(idx)}
                style={{
                  left: `${coord.x}%`,
                  top: `${coord.y}%`,
                }}
                className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer focus:outline-none transition-all duration-700"
                title={`Station ${idx + 1}: ${stop.title} (${stop.locationName})`}
              >
                {/* Station Platform Pin */}
                <div
                  className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm transition-all duration-300 ${
                    isActive
                      ? 'scale-125 bg-gradient-to-tr from-[#be123c] via-[#ec4899] to-[#ffd700] border-2 border-white shadow-[0_0_25px_#f43f5e] z-30'
                      : isVisited
                      ? 'bg-gradient-to-tr from-[#0284c7] to-[#881337] text-white border border-[#ffd700]/80 shadow-md'
                      : 'bg-[#081b33]/90 text-[#7dd3fc]/80 border border-[#38bdf8]/40 hover:border-[#f472b6] hover:scale-115'
                  }`}
                >
                  <span>{stop.icon}</span>
                </div>

                {/* Station Signal Indicator Light */}
                <span
                  className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-white ${
                    isActive
                      ? 'bg-[#22c55e] animate-ping'
                      : isVisited
                      ? 'bg-[#38bdf8]'
                      : 'bg-[#64748b]'
                  }`}
                />

                {/* Station Board Label */}
                <span
                  className={`hidden md:block absolute left-1/2 -translate-x-1/2 text-[8.5px] font-serif font-bold whitespace-nowrap px-1.5 py-0.5 rounded-full pointer-events-none transition-all ${
                    isTopHalf ? 'top-9' : '-top-6'
                  } ${
                    isActive
                      ? 'bg-gradient-to-r from-[#881337] to-[#db2777] text-white border border-[#ffd700] shadow-lg z-30 scale-105 opacity-100'
                      : 'text-[#bae6fd]/80 bg-black/75 border border-[#38bdf8]/20 opacity-0 group-hover:opacity-100'
                  }`}
                >
                  {stop.title}
                </span>
              </button>
            );
          })}

          {/* Railway Line Legend / Progress bar at bottom of canvas */}
          <div className="absolute bottom-1.5 left-3 right-3 flex items-center justify-between text-[9px] sm:text-[10px] font-serif text-[#bae6fd]/80 pointer-events-none">
            <span className="flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#ffd700]" />
              {mapMode === 'heart' ? 'Heart Railway Circuit • Station 01-10' : 'Fairytale Express Line'}
            </span>
            <span className="text-[#ffd700] font-mono font-semibold">
              Platform {activeStop + 1} of {MAP_STOPS.length} Reached 🚂
            </span>
          </div>
        </div>

        {/* ── ACTIVE STATION BOARDING PASS / POSTCARD ── */}
        <div
          ref={cardRef}
          className="w-full bg-[#091c33]/90 rounded-2xl p-3 sm:p-5 border border-[#38bdf8]/40 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center"
        >
          {/* Postcard Photo / Ticket */}
          <div className="md:col-span-4 flex justify-center">
            <div className="p-2 bg-white/95 rounded-xl shadow-xl rotate-[-2deg] hover:rotate-0 transition-transform duration-300 w-full max-w-[190px] sm:max-w-[210px] border-2 border-dashed border-[#be123c]/40">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#0c2445] relative">
                <img
                  src={current.image}
                  alt={current.title}
                  className="w-full h-full object-cover"
                />
                {/* Railway stamp */}
                <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-[#881337]/90 text-[8px] font-mono text-[#ffd700] uppercase tracking-widest border border-[#ffd700]/60">
                  Station {activeStop + 1}
                </div>
              </div>
              <div className="pt-1.5 text-center">
                <p className="font-script text-xs sm:text-sm font-bold text-[#0369a1] truncate">
                  {current.title}
                </p>
                <p className="font-serif text-[9px] sm:text-[10px] text-[#db2777]">
                  {current.date}
                </p>
              </div>
            </div>
          </div>

          {/* Station Narrative Content */}
          <div className="md:col-span-8 flex flex-col justify-between text-left space-y-1.5 sm:space-y-2">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#881337]/30 border border-[#f43f5e]/50 text-[11px] text-[#ffd700] uppercase tracking-wider mb-1">
                <MapPin className="w-3 h-3 text-[#f472b6]" />
                <span className="font-bold">{current.locationName}</span>
              </div>
              <h3 className="font-playfair text-base sm:text-xl font-bold text-[#f0f9ff]">
                {current.title}
              </h3>
              <div className="flex items-center gap-1 text-xs text-[#ffd700] font-serif">
                <Calendar className="w-3.5 h-3.5" />
                <span>{current.date}</span>
              </div>
            </div>

            <p className="font-serif text-xs sm:text-sm text-[#bae6fd] leading-relaxed">
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
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f472b6]/20 hover:bg-[#f472b6]/35 border border-[#f472b6]/50 text-xs font-serif text-[#f472b6] cursor-pointer transition-all"
                >
                  <Eye className="w-3.5 h-3.5 text-[#f472b6]" />
                  <span>Tap to reveal Buggu's secret whisper...</span>
                </button>
              ) : (
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#08182d]/90 border border-[#f472b6]/50 text-xs font-serif italic text-[#fce7f3] animate-fadeIn">
                  <span className="text-[#f472b6] font-bold not-italic">Buggu's Whisper: </span>
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
          className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0c2445] hover:bg-[#12335e] border border-[#38bdf8]/40 text-xs font-serif text-[#bae6fd] flex items-center gap-1.5 transition-all cursor-pointer shadow"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Chapter I: Love Letter</span>
          <span className="sm:hidden">Prev 💌</span>
        </button>

        <button
          onClick={onNextPage}
          className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#0284c7] via-[#ec4899] to-[#db2777] hover:from-[#0369a1] hover:to-[#be185d] text-white text-xs sm:text-sm font-serif font-bold tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span className="hidden sm:inline">Chapter III: Scrapbook Moments</span>
          <span className="sm:hidden">Next 📸</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
        </button>
      </div>
    </div>
  );
}
