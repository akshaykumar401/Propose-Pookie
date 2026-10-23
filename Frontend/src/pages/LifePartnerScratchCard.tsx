import { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowLeft, ArrowRight, Wand2, RotateCcw } from 'lucide-react';
import { romanticAudio } from '../components/RomanticAudioPlayer';
import { PROPOSAL_DATA } from '../data';

interface Props {
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function LifePartnerScratchCard({ onPrevPage, onNextPage }: Props) {
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardStageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealedDetailsRef = useRef<HTMLDivElement>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Entrance animation
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
    }
  }, []);

  // Initialize the scratch canvas foil
  const drawFoil = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);

    // Set transform so all drawing coordinates map directly to logical CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = rect.width;
    const h = rect.height;

    // Reset composite operation
    ctx.globalCompositeOperation = 'source-over';

    // 1. Shimmering Rose-Gold Gradient Base
    const gradient = ctx.createLinearGradient(0, 0, w, h);
    gradient.addColorStop(0, '#f472b6');   // Pink
    gradient.addColorStop(0.25, '#fb7185'); // Rose
    gradient.addColorStop(0.5, '#ffd700');  // Gold
    gradient.addColorStop(0.75, '#f43f5e'); // Crimson Rose
    gradient.addColorStop(1, '#ec4899');    // Vibrant Pink

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // 2. Decorative sparkling dust & soft gold specks
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 0; i < 40; i++) {
      const sx = (Math.sin(i * 99) * 0.5 + 0.5) * w;
      const sy = (Math.cos(i * 33) * 0.5 + 0.5) * h;
      const radius = ((i % 4) + 1.5);
      ctx.beginPath();
      ctx.arc(sx, sy, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Heart & Star Motifs in Foil
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.font = 'bold 20px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ 💖 ✨', w / 2, h * 0.28);

    // 4. Headline Banner on Foil
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px "Playfair Display", Georgia, serif';
    ctx.fillText('🪄 SCRATCH HERE 🪄', w / 2, h * 0.44);

    // 5. Question on Foil
    ctx.fillStyle = '#fef08a';
    ctx.font = 'bold 12px "Great Vibes", cursive, sans-serif';
    ctx.fillText('Do you want to see my life partner?', w / 2, h * 0.52);

    // 6. Subtext instruction
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'italic 11px Georgia, serif';
    ctx.fillText('Touch or drag to reveal God’s gift ✨', w / 2, h * 0.60);

    // 7. Golden decorative border inside foil
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.65)';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Reset state
    setIsRevealed(false);
    setScratchPercent(0);
    if (canvas) canvas.style.opacity = '1';
  }, []);

  // Initialize foil on mount and window resize
  useEffect(() => {
    drawFoil();
    window.addEventListener('resize', drawFoil);
    return () => window.removeEventListener('resize', drawFoil);
  }, [drawFoil]);

  // Check how much has been scratched off
  const checkScratchProgress = () => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width;
    const h = canvas.height;

    // Sample pixels across a grid (step of 20px for high performance)
    const step = Math.floor(20 * dpr);
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    let totalPoints = 0;
    let clearPoints = 0;

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        totalPoints++;
        const alphaIndex = (y * w + x) * 4 + 3;
        if (data[alphaIndex] < 128) {
          clearPoints++;
        }
      }
    }

    const percent = Math.round((clearPoints / totalPoints) * 100);
    setScratchPercent(percent);

    // Once > 38% is scratched, automatically reveal with celebration!
    if (percent >= 38) {
      completeReveal();
    }
  };

  // Complete the reveal with confetti & fanfare
  const completeReveal = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    setScratchPercent(100);
    romanticAudio.playChime('sparkle');

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#f472b6', '#ffd700', '#38bdf8', '#ec4899', '#ffffff'],
    });

    const canvas = canvasRef.current;
    if (canvas) {
      gsap.to(canvas, {
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
        onComplete: () => {
          if (revealedDetailsRef.current) {
            gsap.fromTo(
              revealedDetailsRef.current,
              { opacity: 0, scale: 0.95, y: 15 },
              { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.5)' }
            );
          }
        },
      });
    }
  };

  // Scratch drawing mechanics with 100% exact pixel-level precision
  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    // Keep context scale locked to DPR so logical coordinates match 1:1 with CSS pixels
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Exact CSS pixel position relative to the canvas
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 42; // Diameter in CSS pixels

    ctx.beginPath();
    if (lastPointRef.current) {
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.arc(x, y, 21, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPointRef.current = { x, y };
  };

  const updateCursorPos = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setCursorPos({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
  };

  // Modern Unified Pointer Handlers (Works on Mouse, Touch & Pen)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isRevealed) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    setIsDrawing(true);
    lastPointRef.current = null;
    scratch(e.clientX, e.clientY);
    updateCursorPos(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    updateCursorPos(e.clientX, e.clientY);
    if (!isDrawing) return;
    scratch(e.clientX, e.clientY);
    checkScratchProgress();
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }
    } catch {}
    setIsDrawing(false);
    lastPointRef.current = null;
    checkScratchProgress();
  };

  const handlePointerLeave = () => {
    setCursorPos(null);
    if (isDrawing) {
      setIsDrawing(false);
      lastPointRef.current = null;
      checkScratchProgress();
    }
  };

  const data = PROPOSAL_DATA.scratchCard;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-between px-3 sm:px-6 py-2 overflow-y-auto select-none"
    >
      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl pt-1 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#0f2442]/85 border border-[#38bdf8]/50 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.25em] text-[#ffd700] uppercase mb-1 shadow-md backdrop-blur-md max-w-[90vw]">
          <Wand2 className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
          <span className="truncate">{data.badge}</span>
          <Wand2 className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
        </div>

        <h2 className="font-playfair text-lg sm:text-3xl font-bold mint-gradient-text drop-shadow-[0_4px_25px_rgba(56,189,248,0.6)] mb-0.5 max-w-full px-1">
          {data.question}
        </h2>

        <p className="font-serif italic text-xs sm:text-sm text-[#bae6fd] max-w-xl">
          {data.subtitle}
        </p>
      </div>

      {/* Main Scratch Card Stage */}
      <div
        ref={cardStageRef}
        className="relative z-10 w-full max-w-md flex flex-col items-center justify-center my-auto py-1"
      >
        {/* Polaroid Card Frame with Washi Tape */}
        <div className="p-3.5 sm:p-4 bg-white/95 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-2 border-[#f472b6]/70 relative w-full max-w-[320px] sm:max-w-[340px] flex flex-col items-center transition-transform duration-300">
          {/* Romantic Pink Washi Tape with Gold Shimmer */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-0.5 bg-gradient-to-r from-[#f472b6] via-[#ec4899] to-[#db2777] rounded rotate-[-1deg] border border-white/60 shadow-md flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#ffd700]" />
            <span className="text-[10px] sm:text-xs font-sans font-bold text-white tracking-widest uppercase">
              {isRevealed ? "God's Masterpiece" : "Scratch To Unveil"}
            </span>
            <Sparkles className="w-3 h-3 text-[#ffd700]" />
          </div>

          {/* Image & Canvas Container matching 9:16 portrait */}
          <div className="w-full aspect-[9/16] max-h-[380px] sm:max-h-[420px] rounded-2xl overflow-hidden bg-gradient-to-br from-[#fff0f3] via-[#fdf2f8] to-[#fce7f3] border border-pink-200 mt-2 mb-2 relative group flex items-center justify-center shadow-inner">
            {/* Ambient Blurred Backdrop for soft glowing edges */}
            <img
              src={data.image}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-85 scale-125 brightness-105 pointer-events-none select-none"
            />
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[1px] pointer-events-none" />

            {/* Sharp Life Partner Photo Underneath */}
            <img
              src={data.image}
              alt="My Life Partner"
              className="relative z-10 max-h-full max-w-full object-contain rounded-xl shadow-[0_8px_25px_rgba(236,72,153,0.3)] transition-transform duration-500"
            />

            {/* Interactive Scratch Canvas on Top with Precise Pointer Handlers */}
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              className={`absolute inset-0 z-20 w-full h-full cursor-crosshair touch-none transition-opacity duration-500 ${
                isRevealed ? 'pointer-events-none' : ''
              }`}
            />

            {/* Precision Scratch Coin Cursor Ring */}
            {cursorPos && !isRevealed && (
              <div
                className="pointer-events-none absolute z-30 w-[42px] h-[42px] -ml-[21px] -mt-[21px] rounded-full border-2 border-[#ffd700] bg-gradient-to-tr from-[#ffd700]/30 via-[#f472b6]/25 to-white/30 shadow-[0_0_15px_rgba(255,215,0,0.85)] flex items-center justify-center transition-transform duration-75 select-none"
                style={{
                  left: cursorPos.x,
                  top: cursorPos.y,
                  transform: isDrawing ? 'scale(0.92)' : 'scale(1)',
                }}
              >
                <div className="w-2 h-2 rounded-full bg-[#ffd700] shadow-[0_0_6px_#ffd700]" />
              </div>
            )}
          </div>

          {/* Card Note Underneath Photo */}
          {!isRevealed ? (
            <div className="w-full text-center px-2 py-1">
              <div className="flex items-center justify-between text-xs text-[#be185d] mb-1 font-serif">
                <span className="font-bold flex items-center gap-1">
                  <Wand2 className="w-3 h-3 text-[#ec4899]" />
                  <span>Scratch: {scratchPercent}%</span>
                </span>
                <button
                  onClick={completeReveal}
                  className="px-2.5 py-0.5 rounded-full bg-[#f472b6]/20 hover:bg-[#f472b6]/35 text-[#be185d] text-[10px] font-bold border border-[#f472b6]/40 transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                >
                  <Sparkles className="w-2.5 h-2.5 text-[#ec4899]" />
                  <span>Instant Reveal</span>
                </button>
              </div>
              <p className="font-serif italic text-[11px] text-[#0c4a6e] leading-snug">
                "Use your finger or mouse to gently scrape away the golden foil..."
              </p>
            </div>
          ) : (
            <div ref={revealedDetailsRef} className="w-full text-center px-1 py-1">
              {/* Sticker pills */}
              <div className="flex flex-wrap items-center justify-center gap-1 mb-1.5">
                {data.stickers.map((stk, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-full bg-[#fce7f3] text-[#be185d] text-[9px] font-bold border border-pink-300 shadow-sm"
                  >
                    {stk}
                  </span>
                ))}
              </div>

              <h3 className="font-vibes text-2xl sm:text-3xl text-[#be185d] font-bold mb-0.5 leading-tight">
                {data.revealedTitle}
              </h3>

              <p className="font-serif italic text-xs text-[#0369a1] leading-relaxed mb-2 px-1">
                "{data.revealedLoveNote}"
              </p>

              {/* Reset Button */}
              <button
                onClick={drawFoil}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#0c2445] hover:bg-[#12335e] text-white text-[10px] font-serif border border-[#38bdf8]/40 transition-all cursor-pointer shadow"
              >
                <RotateCcw className="w-3 h-3 text-[#38bdf8]" />
                <span>Scratch Again 🪄</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav Controls */}
      <div className="relative z-10 pt-2 pb-1 w-full max-w-4xl flex items-center justify-between gap-2">
        <button
          onClick={onPrevPage}
          className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0c2445] hover:bg-[#12335e] border border-[#38bdf8]/40 text-xs font-serif text-[#bae6fd] flex items-center gap-1.5 transition-all cursor-pointer shadow"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Chapter V: Voice Album 🎙️</span>
          <span className="sm:hidden">Prev 🎙️</span>
        </button>

        <button
          onClick={onNextPage}
          className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#0284c7] via-[#ec4899] to-[#db2777] hover:from-[#0369a1] hover:to-[#be185d] text-white text-xs sm:text-sm font-serif font-bold tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span className="hidden sm:inline">Chapter VII: 100 Reasons Why 🌸</span>
          <span className="sm:hidden">Next 🌸</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
        </button>
      </div>
    </div>
  );
}
