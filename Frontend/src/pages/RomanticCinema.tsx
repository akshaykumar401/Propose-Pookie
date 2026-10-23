import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import {
  Film,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Heart,
} from 'lucide-react';
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const cinemaScreenRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const clipsNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }
      );
    }
  }, []);

  // When leaving the page, restore background music if it was paused for video sound
  useEffect(() => {
    return () => {
      if (!isMuted) {
        romanticAudio.startMelodyLoop();
      }
    };
  }, [isMuted]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const togglePlay = () => {
    romanticAudio.playChime('click');
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => {});
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    romanticAudio.playChime('click');
    const newMuted = !isMuted;
    setIsMuted(newMuted);

    // If unmuting video, pause background music so Pookie's video sound is crystal clear
    if (!newMuted) {
      romanticAudio.stopMelodyLoop();
    } else {
      romanticAudio.startMelodyLoop();
    }

    if (videoRef.current) {
      videoRef.current.muted = newMuted;
    }
  };

  const toggleFullscreen = () => {
    romanticAudio.playChime('sparkle');
    if (!cinemaScreenRef.current) return;

    if (!document.fullscreenElement) {
      cinemaScreenRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const selectClip = (idx: number) => {
    if (idx === activeClipIndex) return;
    setActiveClipIndex(idx);
    setIsPlaying(true);
    romanticAudio.playChime('sparkle');

    if (cinemaScreenRef.current) {
      gsap.fromTo(
        cinemaScreenRef.current,
        { opacity: 0.8, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
      );
    }

    // Scroll active clip button into view smoothly
    if (clipsNavRef.current) {
      const targetBtn = clipsNavRef.current.children[idx] as HTMLElement;
      if (targetBtn) {
        targetBtn.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  };

  const handlePrevClip = () => {
    const nextIdx = (activeClipIndex - 1 + CINEMA_CLIPS.length) % CINEMA_CLIPS.length;
    selectClip(nextIdx);
  };

  const handleNextClip = () => {
    const nextIdx = (activeClipIndex + 1) % CINEMA_CLIPS.length;
    selectClip(nextIdx);
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
          {/* Top Film Strip Perforations & Clip Info */}
          <div className="w-full flex items-center justify-between px-2 pb-2 border-b border-[#38bdf8]/20">
            <div className="flex items-center gap-1.5 text-xs text-[#ffd700] font-serif truncate">
              <Sparkles className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
              <span className="font-bold truncate">
                Now Playing ({activeClipIndex + 1}/{CINEMA_CLIPS.length}): {currentClip.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block text-[10px] text-[#7dd3fc] font-mono px-2 py-0.5 rounded-full bg-[#08182b] border border-[#38bdf8]/30">
                1080p • 7 Video Memories
              </span>
              <button
                onClick={toggleFullscreen}
                className="p-1 rounded-md text-[#7dd3fc] hover:text-[#ffd700] hover:bg-[#38bdf8]/20 transition-colors"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Video Viewport / Cinema Screen */}
          <div className="relative w-full aspect-[16/9] max-h-[280px] sm:max-h-[360px] rounded-2xl overflow-hidden bg-black my-2 border border-[#38bdf8]/30 flex items-center justify-center group shadow-[0_0_30px_rgba(0,0,0,0.9)]">
            {/* Ambient Blurred Video Glow in Background for Portrait Videos */}
            {currentClip.videoUrl && (
              <video
                key={`bg-${currentClip.videoUrl}`}
                src={currentClip.videoUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-35 scale-110 pointer-events-none select-none"
              />
            )}

            {/* Main Video */}
            {currentClip.videoUrl ? (
              <video
                key={currentClip.videoUrl}
                ref={videoRef}
                src={currentClip.videoUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                preload="auto"
                className="relative z-10 w-full h-full object-contain"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            ) : (
              <div className="relative z-10 w-full h-full flex items-center justify-center">
                <img
                  src={currentClip.poster}
                  alt={currentClip.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Center Big Play/Pause Overlay Button */}
            <button
              onClick={togglePlay}
              className="absolute z-20 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#0369a1]/85 hover:bg-[#0284c7] text-[#f472b6] border-2 border-[#f472b6] flex items-center justify-center shadow-[0_0_25px_rgba(244,114,182,0.7)] transition-all cursor-pointer hover:scale-110 active:scale-95 group-hover:opacity-100 opacity-90 sm:opacity-0 focus:opacity-100 backdrop-blur-sm"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 sm:w-7 sm:h-7" />
              ) : (
                <Play className="w-6 h-6 sm:w-7 sm:h-7 ml-1 fill-[#f472b6]" />
              )}
            </button>

            {/* Previous Clip Arrow on Left of Video */}
            <button
              onClick={handlePrevClip}
              className="absolute left-2 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 border border-[#38bdf8]/40 text-[#bae6fd] hover:text-[#ffd700] hover:scale-110 transition-all cursor-pointer opacity-80 sm:opacity-0 group-hover:opacity-100"
              title="Previous Memory"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Next Clip Arrow on Right of Video */}
            <button
              onClick={handleNextClip}
              className="absolute right-2 z-20 p-2 rounded-full bg-black/60 hover:bg-black/90 border border-[#38bdf8]/40 text-[#bae6fd] hover:text-[#ffd700] hover:scale-110 transition-all cursor-pointer opacity-80 sm:opacity-0 group-hover:opacity-100"
              title="Next Memory"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Sound Mute/Unmute Button in Top Right */}
            <button
              onClick={toggleMute}
              className="absolute top-2 right-2 z-20 px-2 py-1 rounded-full bg-black/75 border border-[#38bdf8]/50 text-[#f472b6] hover:scale-105 transition-transform cursor-pointer flex items-center gap-1.5 backdrop-blur-sm shadow-md"
              title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
            >
              {isMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-[#f472b6]" />
                  <span className="text-[10px] text-[#bae6fd] font-sans font-medium hidden sm:inline">
                    Muted
                  </span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#38bdf8] animate-pulse" />
                  <span className="text-[10px] text-[#ffd700] font-sans font-medium hidden sm:inline">
                    Sound ON
                  </span>
                </>
              )}
            </button>

            {/* Bottom Subtitle / Sweet Note Overlay */}
            <div className="absolute bottom-2 left-3 right-3 text-center z-20 pointer-events-none">
              <p className="font-serif italic text-[11px] sm:text-xs text-[#fef08a] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] bg-black/70 border border-[#38bdf8]/20 px-3 py-1 rounded-full inline-flex items-center gap-1.5 backdrop-blur-md max-w-[92%] truncate">
                <Heart className="w-3 h-3 text-[#f472b6] fill-[#f472b6] shrink-0" />
                <span className="truncate">"{currentClip.subtitle}"</span>
              </p>
            </div>
          </div>

          {/* Bottom All 7 Video Memories Switcher Bar */}
          <div className="w-full pt-1.5 border-t border-[#38bdf8]/20 flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] sm:text-xs font-serif text-[#ffd700] flex items-center gap-1 font-semibold">
                <Film className="w-3 h-3 text-[#38bdf8]" />
                Select Video Memory ({activeClipIndex + 1} of {CINEMA_CLIPS.length})
              </span>
              <span className="text-[9px] sm:text-[10px] text-[#7dd3fc]/80 font-mono">
                Click any clip to watch 🎬
              </span>
            </div>

            {/* Scrollable list of 7 clips */}
            <div
              ref={clipsNavRef}
              className="flex items-center gap-1.5 overflow-x-auto no-scrollbar max-w-full pb-1 py-0.5"
            >
              {CINEMA_CLIPS.map((clip, idx) => (
                <button
                  key={clip.id}
                  onClick={() => selectClip(idx)}
                  className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl text-[10px] sm:text-xs font-serif transition-all cursor-pointer whitespace-nowrap border flex items-center gap-1.5 shrink-0 ${
                    activeClipIndex === idx
                      ? 'bg-gradient-to-r from-[#0284c7] to-[#ec4899] text-white font-bold border-[#ffd700] shadow-[0_0_15px_rgba(56,189,248,0.7)] scale-102'
                      : 'bg-[#0a1e36]/90 text-[#bae6fd] border-[#38bdf8]/30 hover:border-[#f472b6] hover:bg-[#0f2a4a]'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-black/40 text-[9px] flex items-center justify-center font-mono font-bold text-[#ffd700]">
                    {idx + 1}
                  </span>
                  <span>{clip.title}</span>
                </button>
              ))}
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
