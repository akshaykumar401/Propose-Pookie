import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { Heart, ArrowRight, Clock, Flame, Leaf, RotateCcw, KeyRound, ShieldAlert, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { romanticAudio } from '../components/RomanticAudioPlayer';
import { PROPOSAL_DATA } from '../data';

interface Props {
  onNextPage: () => void;
}

export function LoveLetterHero({ onNextPage }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPasscodeVerified, setIsPasscodeVerified] = useState(false);
  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  // 8-digit passcode state
  const [passcodeDigits, setPasscodeDigits] = useState<string[]>(['', '', '', '', '', '', '', '']);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const envelopeRef = useRef<HTMLDivElement>(null);
  const flapRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLButtonElement>(null);
  const letterPaperRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Live timer since anniversary date
  useEffect(() => {
    const startDate = new Date(PROPOSAL_DATA.relationshipStartDate);
    const updateCounter = () => {
      const now = new Date();
      const diff = Math.max(0, now.getTime() - startDate.getTime());
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / 1000 / 60) % 60);
      const secs = Math.floor((diff / 1000) % 60);
      setTimeTogether({ days, hours, mins, secs });
    };

    updateCounter();
    const timer = setInterval(updateCounter, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initial container entrance
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );
    }
  }, []);

  // Handle single digit input with auto-advance
  const handleDigitChange = (index: number, value: string) => {
    const char = value.slice(-1);
    if (char && !/^\d$/.test(char)) return;

    setPasscodeError(null);
    const newDigits = [...passcodeDigits];
    newDigits[index] = char;
    setPasscodeDigits(newDigits);

    // Auto-focus next input field
    if (char && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 8 digits are entered
    const fullCode = newDigits.join('');
    if (fullCode.length === 8 && !newDigits.includes('')) {
      validateAndUnlock(fullCode);
    }
  };

  // Backspace & navigation keyboard handling
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!passcodeDigits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 7) {
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      const fullCode = passcodeDigits.join('');
      validateAndUnlock(fullCode);
    }
  };

  // Handle paste of full 8-digit code
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (!pastedData) return;

    const newDigits = [...passcodeDigits];
    for (let i = 0; i < 8; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setPasscodeDigits(newDigits);

    const focusIdx = Math.min(pastedData.length, 7);
    inputRefs.current[focusIdx]?.focus();

    if (newDigits.join('').length === 8 && !newDigits.includes('')) {
      validateAndUnlock(newDigits.join(''));
    }
  };

  // Validate 8-digit code to unblur letter
  const validateAndUnlock = (code: string) => {
    const targetPasscode = PROPOSAL_DATA.loveLetter.passcode || '16052005';
    if (code === targetPasscode) {
      setPasscodeError(null);
      setIsPasscodeVerified(true);
      romanticAudio.playChime('sparkle');

      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.5 },
        colors: ['#74c69d', '#ffd700', '#52b788', '#ffffff'],
      });

      // Smooth unblur transition
      if (textContentRef.current) {
        gsap.fromTo(
          textContentRef.current,
          { filter: 'blur(10px)', opacity: 0.6 },
          { filter: 'blur(0px)', opacity: 1, duration: 0.85, ease: 'power2.out' }
        );
      }
    } else {
      romanticAudio.playChime('click');
      setPasscodeError(
        PROPOSAL_DATA.loveLetter.passcodeErrorText || "Access Denied! This letter is strictly for Pookie's eyes only 🍃"
      );
      if (pinContainerRef.current) {
        gsap.fromTo(
          pinContainerRef.current,
          { x: -12 },
          {
            x: 12,
            repeat: 5,
            yoyo: true,
            duration: 0.06,
            ease: 'power2.inOut',
            onComplete: () => {
              gsap.set(pinContainerRef.current, { x: 0 });
            },
          }
        );
      }
    }
  };

  // Multi-stage GSAP Envelope Opening Animation (Opens freely and smoothly!)
  const handleOpenLetter = () => {
    if (isOpen || isAnimating) return;
    setIsAnimating(true);
    romanticAudio.playChime('envelope');

    confetti({
      particleCount: 45,
      spread: 75,
      origin: { y: 0.55 },
      colors: ['#74c69d', '#ffd700', '#52b788', '#ffffff'],
    });

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(true);
        setIsAnimating(false);
        // Auto focus first PIN input if letter is still blurred
        if (!isPasscodeVerified) {
          setTimeout(() => {
            inputRefs.current[0]?.focus();
          }, 300);
        }
      },
    });

    // 1. Seal bursts open
    if (sealRef.current) {
      tl.to(sealRef.current, {
        scale: 1.45,
        opacity: 0,
        rotate: 15,
        duration: 0.35,
        ease: 'power2.in',
      });
    }

    // 2. Top flap folds backwards with 3D rotate
    if (flapRef.current) {
      tl.to(flapRef.current, {
        rotateX: 180,
        duration: 0.6,
        ease: 'power2.inOut',
      });
      tl.set(flapRef.current, { zIndex: 5 });
    }

    // 3. Letter slides up out of envelope pocket
    if (letterPaperRef.current) {
      tl.set(letterPaperRef.current, { visibility: 'visible', opacity: 1, zIndex: 30, pointerEvents: 'auto' })
        .to(letterPaperRef.current, {
          y: -140,
          scale: 0.95,
          duration: 0.65,
          ease: 'power2.out',
        })
        // 4. Letter moves to center stage and unfolds to full view
        .to(letterPaperRef.current, {
          y: 0,
          scale: 1,
          zIndex: 40,
          duration: 0.7,
          ease: 'back.out(1.2)',
        });
    }
  };

  // Fold back animation
  const handleCloseLetter = () => {
    if (!isOpen || isAnimating) return;
    setIsAnimating(true);
    romanticAudio.playChime('click');

    const tl = gsap.timeline({
      onComplete: () => {
        setIsOpen(false);
        setIsAnimating(false);
        if (letterPaperRef.current) {
          gsap.set(letterPaperRef.current, { pointerEvents: 'none', visibility: 'hidden', zIndex: -10 });
        }
      },
    });

    if (letterPaperRef.current) {
      tl.to(letterPaperRef.current, {
        y: -140,
        scale: 0.9,
        duration: 0.5,
        ease: 'power2.in',
      }).to(letterPaperRef.current, {
        y: 0,
        scale: 0.85,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      });
    }

    if (flapRef.current) {
      tl.set(flapRef.current, { zIndex: 20 }).to(flapRef.current, {
        rotateX: 0,
        duration: 0.55,
        ease: 'power2.inOut',
      });
    }

    if (sealRef.current) {
      tl.to(sealRef.current, {
        scale: 1,
        opacity: 1,
        rotate: 0,
        duration: 0.35,
        ease: 'back.out(1.5)',
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-between px-3 sm:px-6 py-2 overflow-y-auto select-none"
    >
      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl pt-1 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#133324]/85 border border-[#52b788]/50 text-[10px] sm:text-xs tracking-[0.12em] sm:tracking-[0.25em] text-[#ffd700] uppercase mb-1 shadow-md backdrop-blur-md max-w-full">
          <Leaf className="w-3.5 h-3.5 text-[#74c69d] shrink-0" />
          <span className="truncate">{PROPOSAL_DATA.loveLetter.badge}</span>
          <Leaf className="w-3.5 h-3.5 text-[#74c69d] shrink-0" />
        </div>

        <h1 className="font-vibes text-3xl sm:text-5xl md:text-6xl mint-gradient-text drop-shadow-[0_4px_30px_rgba(82,183,136,0.6)] leading-tight sm:leading-snug py-1 px-2 mb-0.5 max-w-full text-center">
          {PROPOSAL_DATA.loveLetter.title}
        </h1>

        <p className="font-serif italic text-xs sm:text-sm md:text-base text-[#d8f3dc] max-w-md px-2 leading-relaxed">
          {PROPOSAL_DATA.loveLetter.subtitle}
        </p>

        {/* Live Love Timer Pill */}
        <div className="mt-1.5 sm:mt-2 inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#0d261b]/90 border border-[#52b788]/40 shadow-md backdrop-blur-sm max-w-full">
          <Clock className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
          <span className="text-[10px] sm:text-xs font-sans text-[#d8f3dc] tracking-wide truncate">
            Loving You For:{' '}
            <strong className="text-[#ffd700] font-mono">{timeTogether.days}</strong>d{' '}
            <strong className="text-[#ffd700] font-mono">{timeTogether.hours}</strong>h{' '}
            <strong className="text-[#ffd700] font-mono">{timeTogether.mins}</strong>m{' '}
            <strong className="text-[#ffd700] font-mono">{timeTogether.secs}</strong>s
          </span>
        </div>
      </div>

      {/* ── INTERACTIVE PHYSICAL GSAP ENVELOPE STAGE ── */}
      <div className="relative z-10 w-full max-w-2xl flex-1 flex flex-col items-center justify-center my-auto py-2">
        <div
          ref={envelopeRef}
          style={{ perspective: 1200 }}
          className="relative w-full max-w-md h-[300px] sm:h-[330px] flex items-center justify-center"
        >
          {/* THE ENVELOPE BODY */}
          <div
            onClick={!isOpen ? handleOpenLetter : undefined}
            className={`absolute inset-0 rounded-2xl bg-gradient-to-b from-[#1b4332] via-[#143527] to-[#0c2118] border-2 border-[#52b788]/60 shadow-[0_25px_60px_rgba(0,0,0,0.85)] overflow-hidden transition-transform duration-300 ${
              !isOpen ? 'cursor-pointer hover:scale-[1.02]' : 'pointer-events-none'
            }`}
          >
            {/* Diagonal envelope crease styling */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(45deg,_transparent_48%,_#74c69d_49%,_#74c69d_51%,_transparent_52%)]" />

            {/* Front Pocket Triangle Flap */}
            <div
              onClick={!isOpen ? handleOpenLetter : undefined}
              className={`absolute bottom-0 left-0 w-full h-[65%] bg-gradient-to-t from-[#163829] via-[#1a4330] to-[#1e4e38] border-t border-[#52b788]/40 rounded-b-2xl z-20 flex flex-col items-center justify-center text-center p-4 ${
                !isOpen ? 'cursor-pointer' : 'pointer-events-none'
              }`}
            >
              {!isOpen && (
                <div
                  onClick={handleOpenLetter}
                  className="animate-leaf-sway flex flex-col items-center cursor-pointer"
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#081a12]/90 border border-[#ffd700]/50 text-xs text-[#ffd700] font-serif mb-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-[#ffd700]" />
                    <span>A Sealed Letter for Pookie</span>
                  </div>
                  <p className="font-playfair text-base sm:text-lg font-bold text-[#f0fdf4]">
                    Tap the Wax Seal to Open 💌
                  </p>
                  <p className="font-serif italic text-xs text-[#a3d9b8] mt-1">
                    "Only true love holds the key to unlock its words..."
                  </p>
                </div>
              )}
            </div>

            {/* TOP FOLDING FLAP WITH 3D GSAP ROTATE */}
            <div
              ref={flapRef}
              onClick={!isOpen ? handleOpenLetter : undefined}
              style={{
                transformOrigin: 'top center',
                transformStyle: 'preserve-3d',
              }}
              className={`absolute top-0 left-0 w-full h-[50%] bg-gradient-to-b from-[#2d6a4f] to-[#1b4332] border-b-2 border-[#52b788] z-20 rounded-t-2xl shadow-md flex items-center justify-center ${
                !isOpen ? 'cursor-pointer' : 'pointer-events-none'
              }`}
            >
              {/* Flap Triangle Point */}
              <div className="w-0 h-0 border-l-[180px] border-l-transparent border-r-[180px] border-r-transparent border-t-[95px] border-t-[#245741] absolute top-0 pointer-events-none" />

              {/* WAX SEAL (Centered on the bottom tip of top flap) */}
              <button
                ref={sealRef}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenLetter();
                }}
                className={`absolute -bottom-7 w-16 h-16 rounded-full bg-gradient-to-br from-[#52b788] via-[#2d6a4f] to-[#081c15] border-3 border-[#ffd700] shadow-[0_0_25px_rgba(82,183,136,0.85)] flex items-center justify-center z-30 transition-transform ${
                  !isOpen ? 'cursor-pointer group hover:scale-110 active:scale-95' : 'pointer-events-none'
                }`}
                title="Click to unseal love letter"
              >
                <Heart className="w-8 h-8 text-[#ffd700] fill-[#ffd700] animate-pulse" />
                <div className="absolute -bottom-1 -right-1 bg-[#ffd700] text-[#081c15] rounded-full p-0.5 shadow pointer-events-none">
                  <Flame className="w-3 h-3" />
                </div>
              </button>
            </div>
          </div>

          {/* ── THE UNFOLDED CALLIGRAPHY LETTER (PULLED OUT VIA GSAP) ── */}
          <div
            ref={letterPaperRef}
            style={{
              opacity: 0,
              transform: 'scale(0.85)',
              visibility: isOpen || isAnimating ? 'visible' : 'hidden',
              pointerEvents: isOpen ? 'auto' : 'none',
            }}
            className={`absolute top-[-25px] sm:top-[-45px] w-[95%] sm:w-[104%] max-h-[400px] sm:max-h-[440px] overflow-y-auto botanical-parchment p-5 sm:p-7 rounded-3xl border-3 border-[#a3d9b8] shadow-[0_25px_70px_rgba(0,0,0,0.95)] text-[#0e2a1c] relative ${
              isOpen ? 'pointer-events-auto z-40' : 'pointer-events-none -z-10'
            }`}
          >
            {/* Header Stamp */}
            <div className="flex items-center justify-between border-b border-[#74c69d]/40 pb-2 mb-3">
              <div className="flex items-center gap-1.5 text-[#2d6a4f]">
                <Leaf className="w-4 h-4 fill-[#2d6a4f]" />
                <span className="font-serif italic text-xs tracking-widest uppercase font-bold">
                  The Sanctuary of Eternal Love
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs font-serif font-bold">
                {isPasscodeVerified ? (
                  <span className="flex items-center gap-1 text-[#2d6a4f]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2d6a4f]" />
                    <span>Unlocked for Pookie</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[#b91c1c]">
                    <Lock className="w-3.5 h-3.5 text-[#b91c1c]" />
                    <span>Encrypted & Blurred</span>
                  </span>
                )}
              </div>
            </div>

            {/* Letter Content (Blurred until 8-digit passcode is entered) */}
            <div
              ref={textContentRef}
              className={`font-serif text-xs sm:text-sm leading-relaxed space-y-2.5 transition-all duration-700 ${
                !isPasscodeVerified ? 'filter blur-[7px] opacity-40 select-none pointer-events-none' : ''
              }`}
            >
              <h3 className="font-vibes text-2xl sm:text-3xl text-[#1b4332] mb-0.5">
                {PROPOSAL_DATA.loveLetter.salutation}
              </h3>
              {PROPOSAL_DATA.loveLetter.paragraphs.map((paragraph, idx) => (
                <p
                  key={idx}
                  className={idx === PROPOSAL_DATA.loveLetter.paragraphs.length - 1 ? 'font-semibold text-[#1b4332]' : ''}
                >
                  {paragraph}
                </p>
              ))}
              <p className="font-brush text-xl sm:text-2xl text-[#2d6a4f] text-right pt-0.5">
                {PROPOSAL_DATA.loveLetter.signOff}
              </p>
            </div>

            {/* ── SECURITY DECRYPTION OVERLAY OVER BLURRED LETTER ── */}
            {!isPasscodeVerified && (
              <div className="absolute inset-0 z-50 rounded-3xl flex flex-col items-center justify-center p-2.5 sm:p-6 bg-[#081811]/75 backdrop-blur-[2px]">
                <div
                  ref={pinContainerRef}
                  className="w-full max-w-sm botanical-glass p-3.5 sm:p-5 rounded-2xl border-2 border-[#52b788]/70 shadow-[0_15px_45px_rgba(0,0,0,0.85)] flex flex-col items-center text-center"
                >
                  {/* Warning: Protected for Pookie Only */}
                  <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#3b1219]/95 border border-[#ff6b8b]/70 text-[10px] sm:text-xs text-[#ffd7e2] font-serif mb-2 shadow-md max-w-full">
                    <ShieldAlert className="w-3.5 h-3.5 text-[#ff8fa3] shrink-0" />
                    <span className="font-bold tracking-wide truncate">
                      {PROPOSAL_DATA.loveLetter.passcodeWarning || '⚠️ Warning: This letter is protected for Pookie only!'}
                    </span>
                  </div>

                  <p className="font-serif italic text-[11px] sm:text-xs text-[#d8f3dc] mb-2.5">
                    Enter the 8-digit secret key to unblur and reveal the letter:
                  </p>

                  {/* 8-DIGIT PIN INPUT BOXES (Mobile-Responsive) */}
                  <div
                    data-interactive="true"
                    onPaste={handlePaste}
                    className="flex items-center justify-center gap-1 sm:gap-1.5 mb-2.5 w-full"
                  >
                    {passcodeDigits.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          inputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className={`w-6 sm:w-8 h-8 sm:h-10 text-center rounded-lg font-mono text-xs sm:text-base font-black outline-none transition-all cursor-text ${
                          digit
                            ? 'bg-[#0f2d1e] text-[#ffd700] border-2 border-[#ffd700] shadow-[0_0_10px_rgba(255,215,0,0.5)]'
                            : 'bg-[#081a12]/90 text-[#f0fdf4] border border-[#52b788]/60 hover:border-[#74c69d] focus:border-[#ffd700] focus:shadow-[0_0_8px_#52b788]'
                        }`}
                        placeholder="•"
                      />
                    ))}
                  </div>

                  {/* Error Message */}
                  {passcodeError && (
                    <p className="font-serif italic text-[11px] text-[#ff8fa3] mb-2 bg-[#2d0a12]/90 px-3 py-0.5 rounded-full border border-[#ff8fa3]/40 animate-pulse">
                      {passcodeError}
                    </p>
                  )}

                  {/* Action Button: Reveal Letter */}
                  <button
                    onClick={() => validateAndUnlock(passcodeDigits.join(''))}
                    className="px-5 sm:px-6 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#2d6a4f] to-[#52b788] hover:from-[#40916c] hover:to-[#74c69d] text-white font-serif text-xs sm:text-sm font-bold tracking-wider shadow-[0_0_20px_rgba(82,183,136,0.5)] border border-[#ffd700]/70 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-[#ffd700]" />
                    <span>Reveal Letter 💌</span>
                  </button>
                </div>
              </div>
            )}

            {/* Fold back control (only active when verified) */}
            <div className="pt-3 border-t border-[#74c69d]/30 flex items-center justify-between mt-3">
              <span className="text-[11px] font-serif italic text-[#2d6a4f]/80">
                {PROPOSAL_DATA.loveLetter.postScript}
              </span>
              <button
                onClick={handleCloseLetter}
                className="text-xs font-serif text-[#2d6a4f] hover:text-[#1b4332] underline cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Fold Back Into Envelope</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Forward Button to Chapter II */}
      <div className="relative z-10 pt-2 pb-1 flex flex-col items-center max-w-full">
        <button
          onClick={onNextPage}
          className="group max-w-[94vw] sm:max-w-none px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] hover:from-[#2d6a4f] hover:to-[#52b788] border border-[#74c69d]/50 text-xs sm:text-sm font-serif font-bold text-[#ffd700] shadow-[0_0_25px_rgba(82,183,136,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffd700] fill-[#ffd700] shrink-0" />
          <span className="truncate">Chapter II: The Map of Our Journey 🗺️</span>
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffd700] group-hover:translate-x-1 transition-transform shrink-0" />
        </button>
      </div>
    </div>
  );
}

export default LoveLetterHero;
