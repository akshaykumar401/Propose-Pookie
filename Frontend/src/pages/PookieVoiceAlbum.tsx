import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Repeat1,
  Sparkles,
  Heart,
  Music2,
  Mic,
  Disc3,
  ArrowLeft,
  ArrowRight,
  Radio,
} from 'lucide-react';
import { romanticAudio } from '../components/RomanticAudioPlayer';
import { PROPOSAL_DATA } from '../data';

interface Props {
  onPrevPage: () => void;
  onNextPage: () => void;
}

const ALBUM_DATA = PROPOSAL_DATA.voiceAlbum;
const TRACKS = ALBUM_DATA.tracks;

function formatSeconds(secs: number): string {
  if (isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export function PookieVoiceAlbum({ onPrevPage, onNextPage }: Props) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [volume, setVolume] = useState<number>(0.9);
  const [isMuted, setIsMuted] = useState(false);
  const [likedTracks, setLikedTracks] = useState<Record<number, boolean>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const vinylRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  // GSAP Entrance
  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
      );
    }
  }, []);

  // Initialize and switch audio src
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    audio.src = currentTrack.src;
    audio.loop = isLooping;
    audio.playbackRate = playbackRate;
    audio.volume = isMuted ? 0 : volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      if (!isLooping) {
        if (currentTrackIndex < TRACKS.length - 1) {
          playTrack(currentTrackIndex + 1);
        } else {
          setIsPlaying(false);
          setCurrentTime(0);
          // Resume background music when voice notes finish playing
          romanticAudio.startMelodyLoop();
        }
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    if (isPlaying) {
      // Pause global background music so it doesn't clash with Pookie's voice
      romanticAudio.stopMelodyLoop();
      audio.play().catch(() => {});
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [currentTrackIndex]);

  // Handle loop changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.loop = isLooping;
    }
  }, [isLooping]);

  // Handle speed changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      // Resume background music when leaving the page
      romanticAudio.startMelodyLoop();
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;
    romanticAudio.playChime('click');

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      // Resume background music when user pauses voice note
      romanticAudio.startMelodyLoop();
    } else {
      // Pause global background music while voice note is playing
      romanticAudio.stopMelodyLoop();
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTrackClick = (idx: number) => {
    if (idx === currentTrackIndex) {
      togglePlay();
    } else {
      playTrack(idx);
    }
  };

  const playTrack = (index: number) => {
    romanticAudio.playChime('sparkle');
    // Pause background melody
    romanticAudio.stopMelodyLoop();
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const nextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % TRACKS.length;
    playTrack(nextIdx);
  };

  const prevTrack = () => {
    const prevIdx = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    playTrack(prevIdx);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const cycleSpeed = () => {
    romanticAudio.playChime('click');
    if (playbackRate === 1) setPlaybackRate(1.25);
    else if (playbackRate === 1.25) setPlaybackRate(0.8);
    else setPlaybackRate(1);
  };

  const toggleLike = (trackId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    romanticAudio.playChime('sparkle');
    const newState = !likedTracks[trackId];
    setLikedTracks((prev) => ({ ...prev, [trackId]: newState }));

    if (newState) {
      confetti({
        particleCount: 25,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#f472b6', '#fb7185', '#ffd700', '#38bdf8'],
      });
    }
  };

  const triggerHeartReaction = () => {
    romanticAudio.playChime('sparkle');
    confetti({
      particleCount: 45,
      spread: 70,
      origin: { y: 0.5 },
      shapes: ['star'],
      colors: ['#ff69b4', '#38bdf8', '#ffd700', '#ff1493', '#ffffff'],
    });
  };

  const handlePrev = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    romanticAudio.startMelodyLoop();
    onPrevPage();
  };

  const handleNext = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    romanticAudio.startMelodyLoop();
    onNextPage();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex flex-col items-center justify-between px-3 sm:px-6 py-2 overflow-y-auto select-none"
    >
      {/* ── 1. HEADER ── */}
      <div className="relative z-10 text-center max-w-2xl pt-1 flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-0.5 sm:py-1 rounded-full bg-[#0f2442]/85 border border-[#38bdf8]/50 text-[10px] sm:text-xs tracking-[0.1em] sm:tracking-[0.25em] text-[#ffd700] uppercase mb-1 shadow-md backdrop-blur-md max-w-[90vw]">
          <Mic className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
          <span className="truncate">{ALBUM_DATA.badge}</span>
          <Mic className="w-3.5 h-3.5 text-[#f472b6] shrink-0" />
        </div>

        <h2 className="font-playfair text-xl sm:text-4xl font-bold mint-gradient-text drop-shadow-[0_4px_25px_rgba(56,189,248,0.6)] mb-0.5 max-w-full px-1">
          {ALBUM_DATA.title}
        </h2>

        <p className="font-serif italic text-xs sm:text-sm text-[#bae6fd]">
          {ALBUM_DATA.subtitle}
        </p>

        {/* Author / Artist Credit Pill */}
        <div className="mt-1.5 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#ec4899]/20 via-[#38bdf8]/20 to-[#a855f7]/20 border border-[#f472b6]/40 shadow-sm">
          <span className="text-[11px] sm:text-xs text-[#f9a8d4] font-medium flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-[#38bdf8] animate-pulse" />
            <span>Author & Vocals:</span>
            <strong className="text-[#ffd700] font-serif text-xs sm:text-sm tracking-wide">
              {ALBUM_DATA.author}
            </strong>
          </span>
          <span className="text-[#38bdf8]/50 text-xs">•</span>
          <span className="text-[10px] sm:text-xs text-[#7dd3fc] font-serif">
            {ALBUM_DATA.authorSubtitle}
          </span>
        </div>
      </div>

      {/* ── 2. MAIN ALBUM STAGE: VINYL + TRACKLIST ── */}
      <div className="relative z-10 w-full max-w-5xl flex-1 flex flex-col lg:flex-row items-center justify-center gap-4 lg:gap-8 my-auto py-2">
        {/* LEFT COLUMN: THE VINYL RECORD PLAYER & CURRENT CONTROLS */}
        <div className="w-full lg:w-[48%] flex flex-col items-center">
          <div className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#0c2445]/90 via-[#0a1b33]/90 to-[#050e1c]/95 border-2 border-[#38bdf8]/50 shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-4 sm:p-6 backdrop-blur-md flex flex-col items-center">
            {/* Spinning Vinyl Record Stage */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-4">
              {/* Turntable Base Glow */}
              <div
                className={`absolute inset-0 rounded-full bg-gradient-to-tr from-[#38bdf8]/30 via-[#f472b6]/30 to-[#ffd700]/20 blur-xl transition-opacity duration-700 ${
                  isPlaying ? 'opacity-100 scale-105' : 'opacity-30 scale-95'
                }`}
              />

              {/* Realistic Vinyl Disc */}
              <div
                ref={vinylRef}
                className={`relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-[#111115] border-4 border-[#24242e] shadow-[0_10px_35px_rgba(0,0,0,0.95)] flex items-center justify-center transition-transform ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{
                  animationDuration: '6s',
                  animationTimingFunction: 'linear',
                  animationIterationCount: 'infinite',
                }}
              >
                {/* Vinyl Grooves Texture */}
                <div className="absolute inset-3 rounded-full border border-white/5 pointer-events-none" />
                <div className="absolute inset-6 rounded-full border border-white/10 pointer-events-none" />
                <div className="absolute inset-9 rounded-full border border-white/5 pointer-events-none" />
                <div className="absolute inset-12 rounded-full border border-white/10 pointer-events-none" />

                {/* Shimmering Vinyl Light Reflection Angle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />

                {/* Center Label (Photo 9 of Ayushi) */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#ffd700] shadow-inner flex items-center justify-center bg-black">
                  <img
                    src={ALBUM_DATA.coverPhoto}
                    alt={ALBUM_DATA.author}
                    className="w-full h-full object-cover"
                  />
                  {/* Center Spindle Hole */}
                  <div className="absolute w-3 h-3 rounded-full bg-[#060e1e] border-2 border-[#ffd700]/80 shadow" />
                </div>
              </div>

              {/* Disc Badge */}
              <div className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full bg-[#0c1e38]/90 border border-[#f472b6]/70 shadow-md text-[10px] text-[#ffd700] font-mono flex items-center gap-1">
                <Disc3 className={`w-3 h-3 text-[#f472b6] ${isPlaying ? 'animate-spin' : ''}`} />
                <span>33 RPM</span>
              </div>
            </div>

            {/* Currently Playing Track Info */}
            <div className="w-full text-center flex flex-col items-center">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#38bdf8]/15 border border-[#38bdf8]/30 text-[10px] text-[#7dd3fc] font-serif mb-1">
                <Sparkles className="w-3 h-3 text-[#ffd700]" />
                <span>Track {currentTrackIndex + 1} of {TRACKS.length}</span>
                <span>•</span>
                <span className="text-[#f9a8d4] font-medium">{currentTrack.tag}</span>
              </div>

              <h3 className="font-playfair text-lg sm:text-xl font-bold text-white flex items-center justify-center gap-2">
                <span>{currentTrack.title}</span>
                <button
                  onClick={(e) => toggleLike(currentTrack.id, e)}
                  title="Heart this voice note"
                  className="cursor-pointer transition-transform hover:scale-125"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      likedTracks[currentTrack.id]
                        ? 'fill-[#f472b6] text-[#f472b6]'
                        : 'text-[#bae6fd]/40 hover:text-[#f472b6]'
                    }`}
                  />
                </button>
              </h3>

              <p className="font-serif italic text-xs text-[#93c5fd] max-w-sm mt-0.5 min-h-[32px] line-clamp-2">
                "{currentTrack.subtitle}"
              </p>

              {/* Dynamic Equalizer Visualizer Bars */}
              <div className="flex items-center gap-1 h-5 my-2">
                {[18, 28, 14, 24, 32, 20, 16, 30, 22, 12, 26].map((h, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      isPlaying
                        ? 'bg-gradient-to-t from-[#38bdf8] via-[#f472b6] to-[#ffd700]'
                        : 'bg-[#38bdf8]/20 h-1.5'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(6, (h * (i % 2 === 0 ? 1 : 0.7)))}px` : '4px',
                      animation: isPlaying
                        ? `pulse 0.8s ease-in-out infinite alternate ${i * 0.08}s`
                        : 'none',
                    }}
                  />
                ))}
              </div>

              {/* Scrub Bar */}
              <div className="w-full flex flex-col gap-1 px-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 1}
                  step="0.05"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 rounded-full appearance-none bg-[#1e3a5f] accent-[#f472b6] cursor-pointer"
                />
                <div className="w-full flex items-center justify-between text-[10px] font-mono text-[#7dd3fc]">
                  <span>{formatSeconds(currentTime)}</span>
                  <span>{formatSeconds(duration)}</span>
                </div>
              </div>

              {/* Audio Controls */}
              <div className="w-full flex items-center justify-between mt-3 px-2">
                {/* Loop Button */}
                <button
                  onClick={() => setIsLooping(!isLooping)}
                  title={isLooping ? 'Looping enabled' : 'Loop disabled'}
                  className={`p-2 rounded-full border transition-all cursor-pointer ${
                    isLooping
                      ? 'bg-[#ec4899]/30 border-[#f472b6] text-[#f472b6]'
                      : 'bg-[#0f2442]/60 border-[#38bdf8]/20 text-[#7dd3fc] hover:text-white'
                  }`}
                >
                  {isLooping ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                </button>

                {/* Prev Track */}
                <button
                  onClick={prevTrack}
                  className="p-2.5 rounded-full bg-[#0f2442] hover:bg-[#15345b] border border-[#38bdf8]/30 text-[#bae6fd] hover:text-white cursor-pointer transition-transform hover:scale-110 shadow"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                {/* Primary Play/Pause Button */}
                <button
                  onClick={togglePlay}
                  className="w-13 h-13 rounded-full bg-gradient-to-r from-[#0284c7] via-[#ec4899] to-[#db2777] hover:scale-105 active:scale-95 text-white shadow-[0_0_25px_rgba(236,72,153,0.6)] flex items-center justify-center cursor-pointer transition-all border border-white/20"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 fill-white" />
                  ) : (
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  )}
                </button>

                {/* Next Track */}
                <button
                  onClick={nextTrack}
                  className="p-2.5 rounded-full bg-[#0f2442] hover:bg-[#15345b] border border-[#38bdf8]/30 text-[#bae6fd] hover:text-white cursor-pointer transition-transform hover:scale-110 shadow"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                {/* Playback Speed Button */}
                <button
                  onClick={cycleSpeed}
                  title="Playback Speed"
                  className="px-2 py-1.5 rounded-full bg-[#0f2442]/60 border border-[#38bdf8]/20 text-[#7dd3fc] hover:text-[#ffd700] text-[10px] font-mono cursor-pointer transition-colors"
                >
                  {playbackRate}x
                </button>
              </div>

              {/* Volume & Reaction Secondary Bar */}
              <div className="w-full flex items-center justify-between gap-3 mt-3 pt-3 border-t border-[#38bdf8]/15 px-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-[#7dd3fc] hover:text-white cursor-pointer"
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-3.5 h-3.5" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={(e) => {
                      setVolume(parseFloat(e.target.value));
                      setIsMuted(false);
                    }}
                    className="w-16 h-1 rounded-full appearance-none bg-[#1e3a5f] accent-[#38bdf8] cursor-pointer"
                  />
                </div>

                <button
                  onClick={triggerHeartReaction}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#ec4899]/20 to-[#38bdf8]/20 border border-[#f472b6]/40 hover:border-[#f472b6] text-[10px] font-serif text-[#ffd7e2] cursor-pointer transition-all hover:scale-105 shadow-sm"
                >
                  <Heart className="w-3 h-3 text-[#f472b6] fill-[#f472b6]" />
                  <span>Send Love to Ayushi</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: SCROLLABLE PLAYLIST OF 11 VOICE NOTES */}
        <div className="w-full lg:w-[52%] flex flex-col max-h-[380px] sm:max-h-[460px] rounded-3xl bg-gradient-to-b from-[#0c2445]/80 via-[#091b32]/85 to-[#040e1b]/95 border-2 border-[#38bdf8]/40 shadow-2xl backdrop-blur-md p-3 sm:p-4">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#38bdf8]/20 px-1">
            <div className="flex items-center gap-2">
              <Music2 className="w-4 h-4 text-[#f472b6]" />
              <span className="font-playfair text-sm sm:text-base font-bold text-white">
                Ayushi's Voice Notes Collection
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#7dd3fc] bg-[#38bdf8]/10 px-2 py-0.5 rounded-full border border-[#38bdf8]/20">
              {TRACKS.length} Tracks
            </span>
          </div>

          {/* Track List Items */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
            {TRACKS.map((track, idx) => {
              const isCurrent = idx === currentTrackIndex;
              const isLiked = likedTracks[track.id];

              return (
                <div
                  key={track.id}
                  onClick={() => handleTrackClick(idx)}
                  className={`w-full p-2 sm:p-2.5 rounded-2xl flex items-center justify-between gap-2.5 transition-all cursor-pointer border ${
                    isCurrent
                      ? 'bg-gradient-to-r from-[#38bdf8]/25 via-[#ec4899]/25 to-[#a855f7]/20 border-[#f472b6] shadow-[0_0_15px_rgba(244,114,182,0.3)] scale-[1.01]'
                      : 'bg-[#0f2442]/40 hover:bg-[#133054]/70 border-[#38bdf8]/15 hover:border-[#38bdf8]/40'
                  }`}
                >
                  {/* Left: Index / Play status */}
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 border ${
                        isCurrent
                          ? 'bg-[#ec4899] text-white border-white/40 shadow-sm'
                          : 'bg-[#08182b] text-[#7dd3fc] border-[#38bdf8]/30'
                      }`}
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-white" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </div>

                    {/* Titles */}
                    <div className="min-w-0 text-left">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span
                          className={`font-serif text-xs sm:text-sm font-semibold truncate ${
                            isCurrent ? 'text-white' : 'text-[#f0f9ff]'
                          }`}
                        >
                          {track.title}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#f472b6]/15 border border-[#f472b6]/30 text-[#f9a8d4] font-mono">
                          {track.tag}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-[11px] text-[#93c5fd] font-serif italic truncate max-w-[220px] sm:max-w-xs">
                        {track.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Right: duration & heart */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-[#7dd3fc]/80">
                      {track.duration}
                    </span>
                    <button
                      onClick={(e) => toggleLike(track.id, e)}
                      className="p-1 text-[#f472b6] hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isLiked ? 'fill-[#f472b6]' : 'text-[#bae6fd]/30 hover:text-[#f472b6]'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── 3. BOTTOM NAVIGATION CONTROLS ── */}
      <div className="relative z-10 pt-2 pb-1 w-full max-w-4xl flex items-center justify-between gap-2">
        <button
          onClick={handlePrev}
          className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0c2445] hover:bg-[#12335e] border border-[#38bdf8]/40 text-xs font-serif text-[#bae6fd] flex items-center gap-1.5 transition-all cursor-pointer shadow"
        >
          <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="hidden sm:inline">Chapter IV: Cinema of Love 🎬</span>
          <span className="sm:hidden">Prev 🎬</span>
        </button>

        <button
          onClick={handleNext}
          className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-[#0284c7] via-[#ec4899] to-[#db2777] hover:from-[#0369a1] hover:to-[#be185d] text-white text-xs sm:text-sm font-serif font-bold tracking-wider shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <span className="hidden sm:inline">Chapter VI: Divine Life Partner 🪄</span>
          <span className="sm:hidden">Next 🪄</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#ffd700] shrink-0" />
        </button>
      </div>
    </div>
  );
}
