import { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { Heart, Sparkles, ArrowLeft, Gem, Award, CheckCircle2 } from 'lucide-react';
import { romanticAudio } from '../components/RomanticAudioPlayer';
import { PROPOSAL_DATA } from '../data';

const PLAYFUL_EXCUSES = PROPOSAL_DATA.proposal.playfulExcuses;

interface Props {
  onPrevPage: () => void;
}

export function TheGrandProposal({ onPrevPage }: Props) {
  const [accepted, setAccepted] = useState(false);
  const [dodgeCount, setDodgeCount] = useState(0);
  const [excuseIndex, setExcuseIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const certificateRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }

    if (ringRef.current) {
      gsap.to(ringRef.current, {
        y: -10,
        rotate: 3,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }
  }, []);

  const handleYes = () => {
    setAccepted(true);
    romanticAudio.playChime('yes');

    const colors = ['#52b788', '#74c69d', '#ffd700', '#ffffff', '#a3d9b8', '#ffb4c2'];

    // 1. Grand initial burst
    confetti({
      particleCount: 220,
      spread: 140,
      origin: { y: 0.5 },
      colors,
    });

    // 2. Stars & Leaves
    confetti({
      particleCount: 90,
      spread: 160,
      origin: { y: 0.38 },
      shapes: ['star', 'circle'],
      scalar: 1.4,
      colors: ['#ffd700', '#ffffff', '#52b788'],
    });

    // 3. Continuous celebratory cannons for 7 seconds
    const end = Date.now() + 7000;
    const cannonBlast = () => {
      confetti({ particleCount: 8, angle: 60, spread: 65, origin: { x: 0 }, colors });
      confetti({ particleCount: 8, angle: 120, spread: 65, origin: { x: 1 }, colors });
      if (Date.now() < end) requestAnimationFrame(cannonBlast);
    };
    setTimeout(cannonBlast, 400);

    setTimeout(() => {
      if (certificateRef.current) {
        gsap.fromTo(
          certificateRef.current,
          { scale: 0.85, opacity: 0, rotateY: 15 },
          { scale: 1, opacity: 1, rotateY: 0, duration: 0.8, ease: 'back.out(1.5)' }
        );
      }
    }, 120);
  };

  const moveNoButton = () => {
    setDodgeCount((prev) => prev + 1);
    setExcuseIndex((prev) => (prev + 1) % PLAYFUL_EXCUSES.length);

    if (noButtonRef.current) {
      const isMobile = window.innerWidth < 640;
      const xOffset = (Math.random() - 0.5) * (isMobile ? 120 : 260);
      const yOffset = (Math.random() - 0.5) * (isMobile ? 90 : 160);

      gsap.to(noButtonRef.current, {
        x: xOffset,
        y: yOffset,
        duration: 0.35,
        ease: 'elastic.out(1, 0.4)',
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-between px-3 sm:px-6 py-2 overflow-y-auto select-none"
    >
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center text-center my-auto">
        {!accepted ? (
          /* THE PROPOSAL STAGE (2D BOTANICAL LUXURY ARCHWAY & DIAMOND RING) */
          <div className="w-full flex flex-col items-center">
            {/* Top Romantic Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#133324]/85 border border-[#52b788]/50 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.25em] text-[#ffd700] uppercase mb-2 shadow-[0_0_20px_rgba(82,183,136,0.3)] backdrop-blur-md max-w-[90vw]">
              <Sparkles className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
              <span className="truncate">{PROPOSAL_DATA.proposal.badge}</span>
              <Sparkles className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
            </div>

            {/* 2D ROMANTIC BOTANICAL PROPOSAL STAGE (NO 3D WEBGL) */}
            <div className="relative w-full max-w-2xl h-[200px] sm:h-[280px] rounded-3xl overflow-hidden border-2 border-[#52b788]/60 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_35px_rgba(82,183,136,0.25)] bg-gradient-to-b from-[#0a1e16] via-[#102d21] to-[#06140e] mb-2 sm:mb-3 flex items-center justify-center p-3 sm:p-4">
              {/* Floral Archway Glow Background */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#52b788]/25 via-transparent to-transparent pointer-events-none" />

              {/* Sparkling Diamond Ring Box Stage */}
              <div ref={ringRef} className="relative z-10 flex flex-col items-center">
                {/* Glowing Light Ray Rays */}
                <div className="absolute -top-10 w-36 h-36 rounded-full bg-gradient-to-tr from-[#ffd700]/30 to-[#74c69d]/40 blur-2xl pointer-events-none animate-ping duration-3000" />

                {/* Velvet Jewelry Ring Box */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-br from-[#1b4332] via-[#0d261b] to-[#071710] border-2 border-[#ffd700] shadow-[0_0_40px_rgba(255,215,0,0.6)] flex items-center justify-center">
                  {/* Velvet Pillow Cushion */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#081a12] border border-[#52b788]/40 shadow-inner flex items-center justify-center relative overflow-hidden">
                    {/* Ring Band */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 sm:border-4 border-[#ffd700] shadow-[0_0_15px_#ffd700] flex items-center justify-center relative">
                      {/* Solitaire Diamond Gem */}
                      <div className="absolute -top-3.5 flex items-center justify-center">
                        <Gem className="w-6 h-6 sm:w-8 sm:h-8 text-[#f0fdf4] fill-[#d8f3dc] drop-shadow-[0_0_12px_#ffffff] animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 sm:mt-3 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#081a12]/80 border border-[#ffd700]/50 text-[10px] sm:text-[11px] font-serif text-[#ffd700]">
                  <Sparkles className="w-3 h-3 text-[#ffd700]" />
                  <span>The Solitaire Ring of Forever</span>
                </div>
              </div>
            </div>

            {/* The Big Question */}
            <p className="font-serif italic text-sm sm:text-xl text-[#d8f3dc] tracking-wide mb-1">
              {PROPOSAL_DATA.proposal.quote}
            </p>

            <h2 className="font-playfair text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black mint-gradient-text drop-shadow-[0_4px_35px_rgba(82,183,136,0.7)] leading-tight py-1 px-1 mb-1 sm:mb-2 max-w-full">
              {PROPOSAL_DATA.proposal.question}
            </h2>

            <p className="font-serif text-xs sm:text-base text-[#fef08a] max-w-xl leading-relaxed mb-3 sm:mb-4 px-2">
              {PROPOSAL_DATA.proposal.subQuestion}
            </p>

            {/* Action Buttons: YES and Dodging No */}
            <div className="relative w-full max-w-md flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 min-h-[90px]">
              {/* YES BUTTON */}
              <button
                onClick={handleYes}
                style={{
                  transform: `scale(${1 + Math.min(dodgeCount * 0.05, 0.3)})`,
                }}
                className="group relative px-6 sm:px-11 py-3 sm:py-4 rounded-full bg-gradient-to-r from-[#2d6a4f] via-[#52b788] to-[#40916c] text-[#f0fdf4] font-serif text-sm sm:text-lg font-black tracking-widest uppercase border-2 border-[#ffd700] shadow-[0_0_35px_rgba(82,183,136,0.8),0_10px_25px_rgba(27,67,50,0.8)] hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-2 sm:gap-2.5 cursor-pointer z-10 w-full sm:w-auto"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffd700] fill-[#ffd700] group-hover:animate-ping" />
                <span>{PROPOSAL_DATA.proposal.yesButtonText}</span>
                <Gem className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffd700]" />
              </button>

              {/* DODGING NO BUTTON */}
              <button
                ref={noButtonRef}
                onMouseEnter={moveNoButton}
                onClick={moveNoButton}
                className="relative px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#133324]/85 text-[#ffd700] border border-[#52b788]/40 text-xs sm:text-sm font-serif font-semibold tracking-wider hover:bg-[#1b4332] shadow-md transition-shadow whitespace-nowrap cursor-pointer"
              >
                {dodgeCount > 0 ? (
                  <span className="flex items-center gap-1.5 text-xs text-[#a3d9b8]">
                    <span>🍃</span>
                    {PLAYFUL_EXCUSES[excuseIndex]}
                  </span>
                ) : (
                  <span>{PROPOSAL_DATA.proposal.noButtonText}</span>
                )}
              </button>
            </div>

            {dodgeCount > 0 && (
              <p className="font-serif italic text-xs text-[#ffd700] mt-2 animate-fadeIn">
                ✨ Destiny has already blossomed our answer in the stars!
              </p>
            )}
          </div>
        ) : (
          /* ACCEPTED STATE: THE BOTANICAL CERTIFICATE OF FOREVER */
          <div
            ref={certificateRef}
            className="w-full max-w-2xl botanical-parchment p-4 sm:p-8 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-[#a3d9b8] shadow-[0_30px_80px_rgba(0,0,0,0.9)] text-center my-auto"
          >
            {/* Top Seal */}
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#2d6a4f] to-[#52b788] border-2 sm:border-4 border-[#ffd700] text-2xl sm:text-3xl flex items-center justify-center text-white mx-auto shadow-[0_0_30px_rgba(82,183,136,0.7)] mb-2 animate-bounce">
              💍
            </div>

            <p className="font-serif text-[10px] sm:text-xs font-bold tracking-[0.25em] text-[#1b4332] uppercase">
              {PROPOSAL_DATA.proposal.certificate.header}
            </p>

            <h3 className="font-vibes text-2xl sm:text-5xl font-bold text-[#081c15] mt-1 mb-1">
              {PROPOSAL_DATA.proposal.certificate.title}
            </h3>

            <div className="h-[2px] w-24 sm:w-32 mx-auto bg-gradient-to-r from-transparent via-[#52b788] to-transparent mb-3 sm:mb-4" />

            <div className="font-serif text-xs sm:text-base text-[#0e2a1c] leading-relaxed space-y-2 mb-4 sm:mb-5 max-w-lg mx-auto">
              <p className="font-semibold text-[#1b4332] text-sm sm:text-lg">
                {PROPOSAL_DATA.proposal.certificate.heading}
              </p>
              <p>
                {PROPOSAL_DATA.proposal.certificate.vowBody}
              </p>
              <p className="font-brush text-xl sm:text-3xl text-[#2d6a4f]">
                "{PROPOSAL_DATA.proposal.certificate.coupleSignOff}"
              </p>
            </div>

            {/* Keepsake details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 py-2.5 sm:py-3 border-y border-[#74c69d]/40 text-xs font-serif text-[#1b4332] mb-3 sm:mb-4">
              <div className="flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#2d6a4f]" />
                <span>{PROPOSAL_DATA.proposal.certificate.statusText}</span>
              </div>
              <div className="flex items-center justify-center gap-1.5">
                <Award className="w-4 h-4 text-[#2d6a4f]" />
                <span>{PROPOSAL_DATA.proposal.certificate.bondText}</span>
              </div>
            </div>

            {/* Firework re-trigger button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <button
                onClick={handleYes}
                className="w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] hover:from-[#2d6a4f] hover:to-[#52b788] text-[#ffd700] font-serif text-xs font-bold tracking-widest uppercase border border-[#ffd700]/70 shadow-md flex items-center justify-center gap-2 transition-transform hover:scale-105 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#ffd700]" />
                <span>Launch More Fireworks & Fireflies! 🎉</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Page Navigation Bottom Controls */}
      <div className="relative z-10 pt-2 pb-1 w-full max-w-4xl flex items-center justify-start">
        <button
          onClick={onPrevPage}
          className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#133324] hover:bg-[#1b4332] border border-[#52b788]/40 text-xs font-serif text-[#d8f3dc] flex items-center gap-1.5 transition-all shadow cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Chapter IX: Sacred Vows</span>
          <span className="sm:hidden">Prev 📜</span>
        </button>
      </div>
    </div>
  );
}
