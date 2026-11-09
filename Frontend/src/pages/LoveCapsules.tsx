import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowLeft, ArrowRight, Gift, Shuffle, Plus, MessageCircleHeart } from 'lucide-react';
import { romanticAudio } from '../components/RomanticAudioPlayer';
import { PROPOSAL_DATA } from '../data';

interface LoveReason {
  id: number;
  category: string;
  emoji: string;
  note: string;
}

const DEFAULT_REASONS: LoveReason[] = PROPOSAL_DATA.reasonsWhy.reasons;
const RAW_CATEGORIES: string[] = PROPOSAL_DATA.reasonsWhy.categories;
const CATEGORIES: string[] = [
  'All',
  ...RAW_CATEGORIES.filter((c) => c.toLowerCase() !== 'all'),
];

interface Props {
  onPrevPage: () => void;
  onNextPage: () => void;
}

export function LoveCapsules({ onPrevPage, onNextPage }: Props) {
  const [reasons, setReasons] = useState<LoveReason[]>(DEFAULT_REASONS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentReason, setCurrentReason] = useState<LoveReason>(
    DEFAULT_REASONS[0] || {
      id: 1,
      category: 'Love',
      emoji: '💖',
      note: 'You are the most precious person in my life.',
    }
  );
  const [customNote, setCustomNote] = useState('');
  const [modalCategory, setModalCategory] = useState(
    RAW_CATEGORIES.find((c) => c.toLowerCase() !== 'all') || 'Aapka Smile'
  );
  const [showAddModal, setShowAddModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
    }
  }, []);

  const animateToReason = (newReason: LoveReason) => {
    if (capsuleRef.current) {
      gsap.to(capsuleRef.current, {
        scale: 0.88,
        opacity: 0,
        rotate: -5,
        duration: 0.2,
        onComplete: () => {
          setCurrentReason(newReason);
          gsap.fromTo(
            capsuleRef.current,
            { scale: 0.88, opacity: 0, rotate: 5 },
            { scale: 1, opacity: 1, rotate: 0, duration: 0.45, ease: 'back.out(1.8)' }
          );
        },
      });
    } else {
      setCurrentReason(newReason);
    }
  };

  const handleSelectCategory = (cat: string) => {
    setActiveCategory(cat);
    romanticAudio.playChime('click');

    const filtered =
      cat === 'All'
        ? reasons
        : reasons.filter((r) => r.category === cat);

    if (filtered.length === 0) return;

    // Pick a reason matching the chosen category
    let nextReason: LoveReason;
    if (cat !== 'All' && currentReason.category === cat && filtered.length > 1) {
      const remaining = filtered.filter((r) => r.id !== currentReason.id);
      nextReason = remaining[Math.floor(Math.random() * remaining.length)] || filtered[0];
    } else if (cat !== 'All') {
      nextReason = filtered[0];
    } else {
      const remaining = filtered.filter((r) => r.id !== currentReason.id);
      nextReason =
        remaining.length > 0
          ? remaining[Math.floor(Math.random() * remaining.length)]
          : filtered[0];
    }

    animateToReason(nextReason);
  };

  const drawRandomCapsule = () => {
    romanticAudio.playChime('heart');
    const filtered =
      activeCategory === 'All'
        ? reasons
        : reasons.filter((r) => r.category === activeCategory);

    if (filtered.length === 0) return;

    const remaining = filtered.filter((r) => r.id !== currentReason.id);
    const random =
      remaining.length > 0
        ? remaining[Math.floor(Math.random() * remaining.length)]
        : filtered[0];

    animateToReason(random);

    confetti({
      particleCount: 30,
      spread: 65,
      origin: { y: 0.55 },
      colors: ['#38bdf8', '#f472b6', '#ffd700', '#ec4899', '#ffffff'],
    });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customNote.trim()) return;

    const chosenCat =
      modalCategory ||
      (activeCategory !== 'All'
        ? activeCategory
        : RAW_CATEGORIES.find((c) => c.toLowerCase() !== 'all') || 'Aapka Smile');

    const newEntry: LoveReason = {
      id: Date.now(),
      category: chosenCat,
      emoji: '💌',
      note: customNote.trim(),
    };

    setReasons((prev) => [newEntry, ...prev]);
    setActiveCategory(chosenCat);
    animateToReason(newEntry);
    setCustomNote('');
    setShowAddModal(false);
    romanticAudio.playChime('envelope');
  };

  const openAddModal = () => {
    const defaultCat =
      activeCategory !== 'All'
        ? activeCategory
        : RAW_CATEGORIES.find((c) => c.toLowerCase() !== 'all') || 'Aapka Smile';
    setModalCategory(defaultCat);
    setShowAddModal(true);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-between px-3 sm:px-6 py-2 overflow-y-auto select-none"
    >
      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl pt-1 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#0f2442]/85 border border-[#38bdf8]/50 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.25em] text-[#ffd700] uppercase mb-1 shadow-md backdrop-blur-md max-w-[90vw]">
          <Gift className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
          <span className="truncate">{PROPOSAL_DATA.reasonsWhy.badge}</span>
          <Gift className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
        </div>

        <h2 className="font-playfair text-xl sm:text-4xl font-bold mint-gradient-text drop-shadow-[0_4px_25px_rgba(56,189,248,0.6)] mb-0.5 max-w-full px-1">
          {PROPOSAL_DATA.reasonsWhy.title}
        </h2>

        <p className="font-serif italic text-xs sm:text-sm text-[#bae6fd]">
          {PROPOSAL_DATA.reasonsWhy.subtitle}
        </p>
      </div>

      {/* Category Pills */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 my-1 max-w-xl">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => handleSelectCategory(cat)}
            className={`px-3 py-1 rounded-full text-xs font-serif transition-all cursor-pointer ${
              activeCategory === cat
                ? 'bg-[#f472b6] text-white font-bold shadow-[0_0_15px_rgba(244,114,182,0.7)] scale-105'
                : 'bg-[#0c2445]/80 border border-[#38bdf8]/30 text-[#bae6fd] hover:border-[#f472b6]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* The Glowing Sky Blue & Pink Love Capsule Stage */}
      <div className="relative z-10 w-full max-w-2xl flex-1 flex flex-col items-center justify-center my-auto py-1">
        <div
          ref={capsuleRef}
          className="w-full botanical-glass p-6 sm:p-8 rounded-3xl border-2 border-[#38bdf8]/50 shadow-[0_20px_60px_rgba(0,0,0,0.85)] flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Glowing Top Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#38bdf8]/20 border border-[#38bdf8]/50 text-xs text-[#f472b6] uppercase tracking-wider mb-3">
            <Sparkles className="w-3 h-3 text-[#f472b6]" />
            <span>{currentReason.category}</span>
          </div>

          {/* Capsule Emoji Seal */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#38bdf8] to-[#f472b6] flex items-center justify-center text-3xl shadow-[0_0_30px_rgba(244,114,182,0.7)] mb-4 animate-leaf-sway">
            <span>{currentReason.emoji}</span>
          </div>

          {/* Reason Quote Body */}
          <div className="max-w-md mx-auto min-h-[90px] flex items-center justify-center">
            <p className="font-playfair text-lg sm:text-2xl text-[#f0f9ff] font-medium leading-relaxed italic">
              "{currentReason.note}"
            </p>
          </div>

          <div className="h-[1px] w-28 bg-gradient-to-r from-transparent via-[#f472b6]/60 to-transparent my-3" />

          <p className="font-brush text-2xl text-[#7dd3fc]">
            — Always loving you, Buggu ❤️
          </p>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 mt-4 w-full">
            <button
              onClick={drawRandomCapsule}
              className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#0284c7] to-[#ec4899] hover:from-[#0369a1] hover:to-[#db2777] text-white font-serif text-xs sm:text-sm font-bold tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.6)] flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <Shuffle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffd700]" />
              <span>Unfold Another Capsule ✨</span>
            </button>

            <button
              onClick={openAddModal}
              className="w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-full bg-[#0c2445]/80 hover:bg-[#12335e] border border-[#38bdf8]/50 text-[#f472b6] font-serif text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer transition-all"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Add Your Own Note</span>
            </button>
          </div>
        </div>

        {/* Modal for adding love note */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-3.5 sm:p-4">
            <div className="w-full max-w-sm sm:max-w-md botanical-glass p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#38bdf8] shadow-2xl">
              <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#f0f9ff] mb-2 flex items-center gap-2">
                <MessageCircleHeart className="w-4 h-4 sm:w-5 sm:h-5 text-[#f472b6]" />
                <span>Whisper A Love Note Into The Jar</span>
              </h3>
              <p className="font-serif italic text-xs text-[#bae6fd] mb-3">
                Leave a sweet memory or reason for our jar...
              </p>
              <form onSubmit={handleAddNote} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-serif text-[#bae6fd] mb-1">
                    Select Category
                  </label>
                  <select
                    value={modalCategory}
                    onChange={(e) => setModalCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#08182b] border border-[#38bdf8]/40 text-xs sm:text-sm text-[#f0f9ff] focus:outline-none focus:border-[#f472b6]"
                  >
                    {RAW_CATEGORIES.filter((c) => c.toLowerCase() !== 'all').map((c) => (
                      <option key={c} value={c} className="bg-[#08182b] text-[#f0f9ff]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="e.g., That time we shared an umbrella in the rain..."
                  rows={3}
                  className="w-full p-3 rounded-2xl bg-[#08182b] border border-[#38bdf8]/40 text-xs sm:text-sm text-[#f0f9ff] placeholder-[#7dd3fc]/40 focus:outline-none focus:border-[#f472b6]"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3.5 py-1.5 rounded-full text-xs font-serif text-[#bae6fd] hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-full bg-[#ec4899] text-white text-xs font-serif font-bold cursor-pointer hover:bg-[#db2777]"
                  >
                    Add Note 💖
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Nav Controls */}
      <div className="relative z-10 pt-2 pb-1 w-full max-w-2xl flex items-center justify-between gap-2">
        <button
          onClick={onPrevPage}
          className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0c2445] hover:bg-[#12335e] border border-[#38bdf8]/40 text-xs font-serif text-[#bae6fd] flex items-center gap-1.5 transition-all cursor-pointer shadow"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Chapter VI: Scratch Card</span>
          <span className="sm:hidden">Prev 🪄</span>
        </button>

        <button
          onClick={onNextPage}
          className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#0284c7] via-[#ec4899] to-[#db2777] hover:from-[#0369a1] hover:to-[#be185d] text-white text-xs sm:text-sm font-serif font-bold tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span className="hidden sm:inline">Chapter VIII: Our Secret World</span>
          <span className="sm:hidden">Next 🧸</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
        </button>
      </div>
    </div>
  );
}
