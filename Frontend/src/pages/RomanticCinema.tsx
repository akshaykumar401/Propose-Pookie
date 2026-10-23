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
  const [isMuted, setIsMuted] = useState(true);
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
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#0f2442]/85 border border-[#38bdf8]/50 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.25em] text-[#ffd700] uppercase mb-1 shadow-md backdrop-blur-md max-w-[90vw]">
          <Film className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
          <span className="truncate">{PROPOSAL_DATA.cinema.badge}</span>
          <Film className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
        </div>

        <h2 className="font-playfair text-xl sm:text-4xl font-bold mint-gradient-text drop-shadow-[0_4px_25px_rgba(56,189,248,0.6)] mb-0.5 max-w-full px-1">
          {PROPOSAL_DATA.cinema.title}
        </h2>

        <p className="font-serif italic text-xs sm:text-sm text-[#bae6fd]">
          {PROPOSAL_DATA.cinema.subtitle}
        </p>
      </div>

      {/* Main Cinema Screen Stage */}
      <div className="relative z-10 w-full max-w-4xl flex-1 flex flex-col items-center justify-center my-auto py-1">
        {/* Cinema Frame */}
        <div
          ref={cinemaScreenRef}
          className="relative w-full max-w-3xl rounded-3xl overflow-hidden border-2 border-[#38bdf8]/60 bg-gradient-to-b from-[#0c2445] via-[#091a32] to-[#040c1a] shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-2 sm:p-4 flex flex-col items-center"
        >
          {/* Top Film Strip Perforations */}
          <div className="w-full flex items-center justify-between px-2 pb-2 border-b border-[#38bdf8]/20">
            <div className="flex items-center gap-1.5 text-xs text-[#ffd700] font-serif">
              <Sparkles className="w-3.5 h-3.5 text-[#f472b6]" />
              <span className="font-bold">Now Playing: {isCustomMode ? 'Custom Video' : currentClip.title}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-[#7dd3fc] font-mono">
              <span>HD 1080p • STEREO SOUND</span>
            </div>
          </div>

          {/* Video Viewport / Cinema Screen */}
          <div className="relative w-full aspect-[16/9] max-h-[260px] sm:max-h-[320px] rounded-2xl overflow-hidden bg-black my-2 border border-[#38bdf8]/30 flex items-center justify-center group">
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
            ) : currentClip.videoUrl ? (
              <video
                key={currentClip.videoUrl}
                ref={videoRef}
                src={currentClip.videoUrl}
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
                {/* Vintage Vignette and Lens Flare Overlay */}
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
              className="absolute z-20 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#0369a1]/80 hover:bg-[#0284c7] text-[#f472b6] border-2 border-[#f472b6] flex items-center justify-center shadow-[0_0_25px_rgba(244,114,182,0.6)] transition-all cursor-pointer hover:scale-110 active:scale-95"
            >
              {isPlaying ? <Pause className="w-6 h-6 sm:w-7 sm:h-7" /> : <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1 fill-[#f472b6]" />}
            </button>

            {/* Mute Button in Corner */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute top-2 right-2 z-20 p-1.5 rounded-full bg-black/70 border border-[#38bdf8]/40 text-[#f472b6] hover:scale-110 transition-transform cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Bottom Clip Switcher & Custom Video URL Input */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-2 pt-1 border-t border-[#38bdf8]/20">
            {/* Preset Clip Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full pb-1 sm:pb-0">
              {CINEMA_CLIPS.map((clip, idx) => (
                <button
                  key={clip.id}
                  onClick={() => selectClip(idx)}
                  className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-serif transition-all cursor-pointer whitespace-nowrap border ${
                    activeClipIndex === idx && !isCustomMode
                      ? 'bg-[#38bdf8] text-[#040c1a] font-bold border-[#f472b6] shadow-[0_0_12px_rgba(56,189,248,0.6)]'
                      : 'bg-[#0a1e36] text-[#bae6fd] border-[#38bdf8]/30 hover:border-[#f472b6]'
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
                className="w-full sm:w-44 px-2 py-0.5 rounded-lg bg-[#08182b] border border-[#38bdf8]/40 text-[10px] sm:text-xs text-[#f0f9ff] placeholder-[#7dd3fc]/50 focus:outline-none focus:border-[#f472b6]"
              />
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
          <span className="hidden sm:inline">Chapter III: Scrapbook</span>
          <span className="sm:hidden">Prev 📸</span>
        </button>

        <button
          onClick={onNextPage}
          className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#0284c7] via-[#ec4899] to-[#db2777] hover:from-[#0369a1] hover:to-[#be185d] text-white text-xs sm:text-sm font-serif font-bold tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span className="hidden sm:inline">Chapter V: Voice Album 🎙️</span>
          <span className="sm:hidden">Next 🎙️</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
        </button>
      </div>
    </div>
  );
}
