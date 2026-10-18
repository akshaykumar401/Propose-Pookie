import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Film, Play, Pause, Volume2, VolumeX, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { romanticAudio } from '../components/RomanticAudioPlayer';
import { PROPOSAL_DATA } from '../data';

interface Props {
  onPrevPage: () => void;
  onNextPage: () => void;
}

const CINEMA_CLIPS = PROPOSAL_DATA.cinema.clips;

export function RomanticCinema({ onPrevPage, onNextPage }: Props) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [activeClipIndex, setActiveClipIndex] = useState(0);
  const [customVideoUrl, setCustomVideoUrl] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cinemaScreenRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
    }
  }, []);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    romanticAudio.playChime('click');
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  };

  const selectClip = (idx: number) => {
    if (idx === activeClipIndex && !isCustomMode) return;
    setIsCustomMode(false);
    setActiveClipIndex(idx);
    setIsPlaying(true);
    romanticAudio.playChime('sparkle');

    if (cinemaScreenRef.current) {
      gsap.fromTo(
        cinemaScreenRef.current,
        { opacity: 0.7, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
      );
    }
  };

  const currentClip = CINEMA_CLIPS[activeClipIndex];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-between px-3 sm:px-6 py-2 overflow-y-auto select-none"
    >
      {/* Header */}
      <div className="relative z-10 text-center max-w-2xl pt-1 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#133324]/85 border border-[#52b788]/50 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.25em] text-[#ffd700] uppercase mb-1 shadow-md backdrop-blur-md max-w-[90vw]">
          <Film className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
          <span className="truncate">{PROPOSAL_DATA.cinema.badge}</span>
          <Film className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
        </div>

        <h2 className="font-playfair text-xl sm:text-4xl font-bold mint-gradient-text drop-shadow-[0_4px_25px_rgba(82,183,136,0.6)] mb-0.5 max-w-full px-1">
          {PROPOSAL_DATA.cinema.title}
        </h2>

        <p className="font-serif italic text-xs sm:text-sm text-[#d8f3dc]">
          {PROPOSAL_DATA.cinema.subtitle}
        </p>
      </div>

      {/* Main Cinema Screen Stage */}
      <div className="relative z-10 w-full max-w-4xl flex-1 flex flex-col items-center justify-center my-auto py-1">
        {/* Cinema Frame */}
        <div
          ref={cinemaScreenRef}
          className="relative w-full max-w-3xl rounded-3xl overflow-hidden border-2 border-[#52b788]/60 bg-gradient-to-b from-[#0e241b] via-[#081811] to-[#040e0a] shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-2 sm:p-4 flex flex-col items-center"
        >
          {/* Top Film Strip Perforations */}
          <div className="w-full flex items-center justify-between px-2 pb-2 border-b border-[#52b788]/20">
            <div className="flex items-center gap-1.5 text-xs text-[#ffd700] font-serif">
              <Sparkles className="w-3.5 h-3.5 text-[#74c69d]" />
              <span className="font-bold">Now Playing: {isCustomMode ? 'Custom Video' : currentClip.title}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-[#a3d9b8] font-mono">
              <span>HD 1080p • STEREO SOUND</span>
            </div>
          </div>

          {/* Video Viewport / Cinema Screen */}
          <div className="relative w-full aspect-[16/9] max-h-[260px] sm:max-h-[320px] rounded-2xl overflow-hidden bg-black my-2 border border-[#52b788]/30 flex items-center justify-center group">
            {isCustomMode && customVideoUrl ? (
              <video
                ref={videoRef}
                src={customVideoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              /* Cinematic Romantic Montage Player with Animated Pan & Subtitles */
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <img
                  src={currentClip.poster}
                  alt={currentClip.title}
                  className={`w-full h-full object-cover transition-transform duration-10000 ease-out ${
                    isPlaying ? 'scale-110 filter brightness-95' : 'scale-100 filter brightness-75'
                  }`}
                />
                {/* Vintage Vignette and Green Lens Flare Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Subtitle Bar at bottom of screen */}
                <div className="absolute bottom-3 left-4 right-4 text-center z-10 pointer-events-none">
                  <p className="font-serif italic text-xs sm:text-sm text-[#fef08a] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] bg-black/60 px-3 py-1 rounded-full inline-block">
                    "{currentClip.subtitle}"
                  </p>
                </div>
              </div>
            )}

            {/* Big Play/Pause Button on Screen */}
            <button
              onClick={togglePlay}
              className="absolute z-20 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#1b4332]/80 hover:bg-[#2d6a4f] text-[#ffd700] border-2 border-[#ffd700] flex items-center justify-center shadow-[0_0_25px_rgba(255,215,0,0.6)] transition-all cursor-pointer hover:scale-110 active:scale-95"
            >
              {isPlaying ? <Pause className="w-6 h-6 sm:w-7 sm:h-7" /> : <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1 fill-[#ffd700]" />}
            </button>

            {/* Mute Button in Corner */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-black/70 border border-[#52b788]/40 text-[#ffd700] hover:scale-110 transition-transform cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Bottom Clip Switcher & Custom Video URL Input */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 border-t border-[#52b788]/20">
            {/* Preset Clip Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full pb-1 sm:pb-0">
              {CINEMA_CLIPS.map((clip, idx) => (
                <button
                  key={clip.id}
                  onClick={() => selectClip(idx)}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-serif transition-all cursor-pointer whitespace-nowrap border ${
                    activeClipIndex === idx && !isCustomMode
                      ? 'bg-[#52b788] text-[#081c15] font-bold border-[#ffd700] shadow-[0_0_12px_rgba(82,183,136,0.6)]'
                      : 'bg-[#133324] text-[#d8f3dc] border-[#52b788]/30 hover:border-[#ffd700]'
                  }`}
                >
                  <span>{clip.title}</span>
                </button>
              ))}
            </div>

            {/* Quick Custom Video Link Option */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Or paste video MP4 link..."
                value={customVideoUrl}
                onChange={(e) => {
                  setCustomVideoUrl(e.target.value);
                  if (e.target.value.trim()) setIsCustomMode(true);
                }}
                className="w-full sm:w-44 px-2 py-0.5 rounded-lg bg-[#081811] border border-[#52b788]/40 text-[10px] sm:text-xs text-[#f0fdf4] placeholder-[#a3d9b8]/50 focus:outline-none focus:border-[#ffd700]"
              />
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
          <span className="hidden sm:inline">Chapter III: Scrapbook</span>
          <span className="sm:hidden">Prev 📸</span>
        </button>

        <button
          onClick={onNextPage}
          className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#2d6a4f] via-[#52b788] to-[#40916c] hover:from-[#40916c] hover:to-[#52b788] text-white text-xs sm:text-sm font-serif font-bold tracking-wider shadow-[0_0_20px_rgba(82,183,136,0.5)] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span className="hidden sm:inline">Chapter V: 100 Reasons Why</span>
          <span className="sm:hidden">Next 🍃</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
        </button>
      </div>
    </div>
  );
}
