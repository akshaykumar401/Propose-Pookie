import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { ShieldAlert, KeyRound, ArrowRight, X } from 'lucide-react';
import { RomanticIntroLoader } from './components/RomanticIntroLoader';
import { HeartCursorTrail } from './components/HeartCursorTrail';
import { RosePetalsOverlay } from './components/RosePetalsOverlay';
import { BotanicalAmbience } from './components/BotanicalAmbience';
import { RomanticAudioPlayer, romanticAudio } from './components/RomanticAudioPlayer';

import { LoveLetterHero } from './pages/LoveLetterHero';
import { RomanticJourneyMap } from './pages/RomanticJourneyMap';
import { MemoryScrapbook } from './pages/MemoryScrapbook';
import { RomanticCinema } from './pages/RomanticCinema';
import { LoveCapsules } from './pages/LoveCapsules';
import { SecretLanguage } from './pages/SecretLanguage';
import { FutureVisionBoard } from './pages/FutureVisionBoard';
import { HeartbeatHarmony } from './pages/HeartbeatHarmony';
import { EternalPromises } from './pages/EternalPromises';
import { TheGrandProposal } from './pages/TheGrandProposal';
import { PROPOSAL_DATA } from './data';

const CHAPTER_TITLES = [
  'Chapter I: Sealed Love Letter 💌',
  'Chapter II: The Map of Our Journey 🗺️',
  'Chapter III: The Polaroid Scrapbook 📸',
  'Chapter IV: Cinema of Love 🎬',
  'Chapter V: 100 Reasons Why It\'s You 🍃',
  'Chapter VI: Our Secret World & Quirks 🧸',
  'Chapter VII: Future Dreams & Vision 🏡',
  'Chapter VIII: Heartbeat & Senses 💓',
  'Chapter IX: Sacred Vows of My Soul 📜',
  'Chapter X: The Forever Question 💍',
];

export function App() {
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Private Chapters 2-4 Vault Protection State
  const [unlockedPrivateChapters, setUnlockedPrivateChapters] = useState(false);
  const [showVaultModal, setShowVaultModal] = useState(false);
  const [pendingTargetPage, setPendingTargetPage] = useState<number>(1);
  const [vaultDigits, setVaultDigits] = useState<string[]>(['', '', '', '', '', '', '', '']);
  const [vaultError, setVaultError] = useState<string | null>(null);

  const mainRef = useRef<HTMLDivElement>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const vaultModalBoxRef = useRef<HTMLDivElement>(null);
  const vaultInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Navigation controller with Chapter 2-4 lock check
  const goToPage = (pageIndex: number, bypassLock = false) => {
    // Chapters 1, 2, 3 correspond to Chapter II, Chapter III, Chapter IV
    if (!bypassLock && !unlockedPrivateChapters && pageIndex >= 1 && pageIndex <= 3) {
      setPendingTargetPage(pageIndex);
      setVaultDigits(['', '', '', '', '', '', '', '']);
      setVaultError(null);
      setShowVaultModal(true);
      setTimeout(() => {
        vaultInputsRef.current[0]?.focus();
      }, 250);
      return;
    }

    if (pageIndex === currentPage) return;
    romanticAudio.playChime('sparkle');

    if (mainRef.current) {
      // Smooth GSAP slide transition with power3 easing
      gsap.to(mainRef.current, {
        opacity: 0,
        y: pageIndex > currentPage ? -16 : 16,
        scale: 0.98,
        duration: 0.22,
        ease: 'power3.in',
        onComplete: () => {
          setCurrentPage(pageIndex);
          gsap.fromTo(
            mainRef.current,
            { opacity: 0, y: pageIndex > currentPage ? 16 : -16, scale: 0.98 },
            { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
          );
        },
      });
    } else {
      setCurrentPage(pageIndex);
    }

    // Scroll active dot into view on mobile
    if (navScrollRef.current) {
      const activeBtn = navScrollRef.current.children[pageIndex] as HTMLElement;
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  };

  // Vault Password Handling for Chapters 2-4
  const handleVaultDigitChange = (index: number, value: string) => {
    const char = value.slice(-1);
    if (char && !/^\d$/.test(char)) return;

    setVaultError(null);
    const newDigits = [...vaultDigits];
    newDigits[index] = char;
    setVaultDigits(newDigits);

    if (char && index < 7) {
      vaultInputsRef.current[index + 1]?.focus();
    }

    const fullCode = newDigits.join('');
    if (fullCode.length === 8 && !newDigits.includes('')) {
      verifyVaultPasscode(fullCode);
    }
  };

  const handleVaultKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!vaultDigits[index] && index > 0) {
        vaultInputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      vaultInputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 7) {
      vaultInputsRef.current[index + 1]?.focus();
    } else if (e.key === 'Enter') {
      verifyVaultPasscode(vaultDigits.join(''));
    }
  };

  const handleVaultPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '');
    if (!pastedData) return;

    const newDigits = [...vaultDigits];
    for (let i = 0; i < 8; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setVaultDigits(newDigits);

    const focusIdx = Math.min(pastedData.length, 7);
    vaultInputsRef.current[focusIdx]?.focus();

    if (newDigits.join('').length === 8 && !newDigits.includes('')) {
      verifyVaultPasscode(newDigits.join(''));
    }
  };

  const verifyVaultPasscode = (code: string) => {
    const targetPasscode = PROPOSAL_DATA.vaultProtection.passcode || '16052005';
    if (code === targetPasscode) {
      setVaultError(null);
      setUnlockedPrivateChapters(true);
      setShowVaultModal(false);
      romanticAudio.playChime('sparkle');

      confetti({
        particleCount: 65,
        spread: 80,
        origin: { y: 0.5 },
        colors: ['#52b788', '#ffd700', '#74c69d', '#ffffff'],
      });

      goToPage(pendingTargetPage, true);
    } else {
      romanticAudio.playChime('click');
      setVaultError(
        PROPOSAL_DATA.vaultProtection.errorText || 'Access Denied! Incorrect key for private vault 🚫🍃'
      );
      if (vaultModalBoxRef.current) {
        gsap.fromTo(
          vaultModalBoxRef.current,
          { x: -12 },
          {
            x: 12,
            repeat: 5,
            yoyo: true,
            duration: 0.06,
            ease: 'power2.inOut',
            onComplete: () => {
              gsap.set(vaultModalBoxRef.current, { x: 0 });
            },
          }
        );
      }
    }
  };

  // Redirect to Chapter 5 if user cannot/does not want to give password
  const handleSkipToChapter5 = () => {
    setShowVaultModal(false);
    romanticAudio.playChime('click');
    goToPage(4, true); // Chapter V: 100 Reasons Why It's You 🍃 (index 4)
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showVaultModal) return; // Prevent background keys during modal
      if (e.key === 'ArrowRight' && currentPage < CHAPTER_TITLES.length - 1) {
        goToPage(currentPage + 1);
      } else if (e.key === 'ArrowLeft' && currentPage > 0) {
        goToPage(currentPage - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, showVaultModal, unlockedPrivateChapters]);

  return (
    <div className="relative w-full h-[100dvh] bg-[#07140e] text-[#f0fdf4] overflow-x-hidden overflow-y-auto select-none">
      {/* 1. Intro Screen: Emerald Heart Locket Unlock */}
      {loading && (
        <RomanticIntroLoader onComplete={() => setLoading(false)} />
      )}


      {/* 3. Floating Light Green Mint Leaves & Petals Overlay */}
      <RosePetalsOverlay />

      {/* 4. 2D Botanical Romantic Atmosphere */}
      <BotanicalAmbience />

      {/* 5. Romantic Synthesizer Audio Player */}
      <RomanticAudioPlayer />

      {/* 6. Active Romantic Chapter View Container with Mobile Safe Padding (Zero Overlap with Top Player) */}
      <div className="relative z-10 w-full min-h-full pt-16 sm:pt-4 pb-20 sm:pb-8 flex flex-col justify-between overflow-x-hidden">
        <div ref={mainRef} className="w-full flex-1 flex flex-col justify-between">
          {currentPage === 0 && (
            <LoveLetterHero onNextPage={() => goToPage(1)} />
          )}

          {currentPage === 1 && (
            <RomanticJourneyMap
              onPrevPage={() => goToPage(0)}
              onNextPage={() => goToPage(2)}
            />
          )}

          {currentPage === 2 && (
            <MemoryScrapbook
              onPrevPage={() => goToPage(1)}
              onNextPage={() => goToPage(3)}
            />
          )}

          {currentPage === 3 && (
            <RomanticCinema
              onPrevPage={() => goToPage(2)}
              onNextPage={() => goToPage(4)}
            />
          )}

          {currentPage === 4 && (
            <LoveCapsules
              onPrevPage={() => goToPage(3)}
              onNextPage={() => goToPage(5)}
            />
          )}

          {currentPage === 5 && (
            <SecretLanguage
              onPrevPage={() => goToPage(4)}
              onNextPage={() => goToPage(6)}
            />
          )}

          {currentPage === 6 && (
            <FutureVisionBoard
              onPrevPage={() => goToPage(5)}
              onNextPage={() => goToPage(7)}
            />
          )}

          {currentPage === 7 && (
            <HeartbeatHarmony
              onPrevPage={() => goToPage(6)}
              onNextPage={() => goToPage(8)}
            />
          )}

          {currentPage === 8 && (
            <EternalPromises
              onPrevPage={() => goToPage(7)}
              onNextPage={() => goToPage(9)}
            />
          )}

          {currentPage === 9 && (
            <TheGrandProposal onPrevPage={() => goToPage(8)} />
          )}
        </div>

        {/* Mobile-Responsive Botanical Sage & Gold Bottom Chapter Indicator */}
        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-30 max-w-[96vw] sm:max-w-none">
          <div
            ref={navScrollRef}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#0d261b]/95 border border-[#52b788]/50 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.7)] overflow-x-auto no-scrollbar"
          >
            {CHAPTER_TITLES.map((title, i) => {
              const isLockedChapter = !unlockedPrivateChapters && i >= 1 && i <= 3;
              return (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  title={isLockedChapter ? `${title} (🔒 Protected)` : title}
                  className={`transition-all duration-300 cursor-pointer shrink-0 relative flex items-center justify-center ${
                    currentPage === i
                      ? 'w-5 sm:w-6 h-2 rounded-full bg-gradient-to-r from-[#52b788] via-[#ffd700] to-[#74c69d] shadow-[0_0_12px_#52b788]'
                      : 'w-2 h-2 rounded-full bg-[#52b788]/30 hover:bg-[#52b788]'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* ── CHAPTER 2-4 PRIVATE MEMORY VAULT MODAL ── */}
      {showVaultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn select-none">
          <div
            ref={vaultModalBoxRef}
            className="relative w-full max-w-sm sm:max-w-md botanical-glass p-4 sm:p-7 rounded-2xl sm:rounded-3xl border-2 border-[#52b788]/70 shadow-[0_25px_70px_rgba(0,0,0,0.95)] flex flex-col items-center text-center"
          >
            {/* Close Button defaults back to safe page */}
            <button
              onClick={() => setShowVaultModal(false)}
              className="absolute top-3.5 right-3.5 text-[#a3d9b8] hover:text-[#ffd700] p-1.5 rounded-full bg-[#081a12]/80 border border-[#52b788]/30 cursor-pointer transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Warning: Protected for Pookie Only */}
            <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#3b1219]/95 border border-[#ff6b8b]/70 text-[10px] sm:text-xs text-[#ffd7e2] font-serif mb-2 sm:mb-3 shadow-md max-w-full">
              <ShieldAlert className="w-3.5 h-3.5 text-[#ff8fa3] shrink-0" />
              <span className="font-bold tracking-wide truncate">
                {PROPOSAL_DATA.vaultProtection.warning}
              </span>
            </div>

            <h3 className="font-playfair text-lg sm:text-2xl font-bold text-[#f0fdf4] mb-1">
              {PROPOSAL_DATA.vaultProtection.title}
            </h3>

            <p className="font-serif italic text-xs sm:text-sm text-[#d8f3dc] mb-3 sm:mb-4 max-w-xs">
              {PROPOSAL_DATA.vaultProtection.prompt}
            </p>

            {/* 8-DIGIT PIN INPUT BOXES (Responsive for 320px screens) */}
            <div
              data-interactive="true"
              onPaste={handleVaultPaste}
              className="flex items-center justify-center gap-1 sm:gap-1.5 mb-3 w-full"
            >
              {vaultDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    vaultInputsRef.current[idx] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleVaultDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleVaultKeyDown(idx, e)}
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
            {vaultError && (
              <p className="font-serif italic text-[11px] text-[#ff8fa3] mb-3 bg-[#2d0a12]/90 px-3 py-1 rounded-full border border-[#ff8fa3]/40 animate-pulse">
                {vaultError}
              </p>
            )}

            {/* Dual Action Buttons: Unlock with Code OR Skip to Chapter 5 */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5 w-full mt-1">
              <button
                onClick={() => verifyVaultPasscode(vaultDigits.join(''))}
                className="w-full sm:flex-1 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#2d6a4f] to-[#52b788] hover:from-[#40916c] hover:to-[#74c69d] text-white font-serif text-xs sm:text-sm font-bold tracking-wider shadow-[0_0_20px_rgba(82,183,136,0.5)] border border-[#ffd700]/70 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#ffd700]" />
                <span>{PROPOSAL_DATA.vaultProtection.unlockButtonText}</span>
              </button>

              <button
                onClick={handleSkipToChapter5}
                className="w-full sm:flex-1 py-2 sm:py-2.5 rounded-full bg-[#133324] hover:bg-[#1b4332] text-[#ffd700] font-serif text-xs sm:text-sm font-bold border border-[#52b788]/50 shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <span>{PROPOSAL_DATA.vaultProtection.skipButtonText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Top-Level Botanical Romantic Custom Cursor (Guaranteed Above All Modals & Views) */}
      <HeartCursorTrail />
    </div>
  );
}

export default App;