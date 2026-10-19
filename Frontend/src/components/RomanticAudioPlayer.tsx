import { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  Volume1,
  VolumeX,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  ChevronDown,
  ChevronUp,
  Music,
  Disc,
  Repeat,
  Repeat1,
  Shuffle,
  Sparkles,
  RotateCcw,
  RotateCw,
  ListMusic,
} from 'lucide-react';
import { PROPOSAL_DATA } from '../data';

// Import local mp3 audio files
import saathiyaTrack from '../assets/music/Saathiya - Darshan Raval Anmol Daniel Official Music Video.mp3';
import barsaatTrack from '../assets/music/Barsaat Lagdi Ae (Music Video) - Darshan Raval Simran Choudhary Aditi S. Youngveer Mir Desai.mp3';
import naalNaalTrack from '../assets/music/Naal Naal Ve (Lyrical Video) - Darshan Raval Suvarna Tiwari Youngveer Mir D. The Everafter.mp3';

export interface AudioTrack {
  id: number;
  name: string;
  artist: string;
  src: string;
  symbol: string;
  mood: string;
  estimatedDuration: string;
}

export const ROMANTIC_PLAYLIST: AudioTrack[] = [
  {
    id: 0,
    name: 'Saathiya',
    artist: 'Darshan Raval & Anmol Daniel',
    src: saathiyaTrack,
    symbol: '💍',
    mood: 'Soulful & Romantic Forever',
    estimatedDuration: '3:00',
  },
  {
    id: 1,
    name: 'Barsaat Lagdi Ae',
    artist: 'Darshan Raval & Simran Choudhary',
    src: barsaatTrack,
    symbol: '🌧️',
    mood: 'Monsoon Love & Longing',
    estimatedDuration: '0:56',
  },
  {
    id: 2,
    name: 'Naal Naal Ve',
    artist: 'Darshan Raval & Suvarna Tiwari',
    src: naalNaalTrack,
    symbol: '✨',
    mood: 'Everafter Bond & Sweet Whispers',
    estimatedDuration: '2:56',
  },
];

// Helper to format seconds to mm:ss
function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Romantic Audio Engine: Manages real MP3 playback, shuffle/repeat, seeking & Web Audio sound effects
class RomanticAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private audio: HTMLAudioElement | null = null;

  public isPlaying = false;
  public currentTrack = 0;
  public volume = 0.6;
  public currentTime = 0;
  public duration = 0;
  public repeatMode: 'all' | 'one' | 'off' = 'all';
  public isShuffle = false;
  public trackList = ROMANTIC_PLAYLIST;

  private onStateChange: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudioElement();
    }
  }

  private initAudioElement() {
    if (this.audio) return;
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.audio.volume = this.volume;
    this.audio.src = this.trackList[this.currentTrack].src;

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        this.currentTime = this.audio.currentTime;
        this.notify();
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio) {
        this.duration = this.audio.duration;
        this.notify();
      }
    });

    this.audio.addEventListener('ended', () => {
      if (this.repeatMode === 'one') {
        if (this.audio) {
          this.audio.currentTime = 0;
          this.audio.play().catch(() => {});
        }
      } else if (this.repeatMode === 'all') {
        this.nextTrack();
      } else {
        // Off mode: stop if last track
        if (this.currentTrack < this.trackList.length - 1) {
          this.nextTrack();
        } else {
          this.isPlaying = false;
          this.notify();
        }
      }
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.notify();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notify();
    });
  }

  setOnStateChange(cb: () => void) {
    this.onStateChange = cb;
  }

  private notify() {
    if (this.onStateChange) this.onStateChange();
  }

  // Web Audio Context for tactile chimes & heartbeats
  private initWebAudio() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.volume * 0.35, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume * 0.35, this.ctx.currentTime);
    }
    this.notify();
  }

  // Playback control
  startMelodyLoop() {
    this.initAudioElement();
    this.initWebAudio();
    if (this.audio) {
      this.audio.play().catch((err) => {
        console.warn('Autoplay blocked by browser policy until interaction:', err);
      });
    }
  }

  stopMelodyLoop() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  togglePlay() {
    if (this.isPlaying) {
      this.stopMelodyLoop();
    } else {
      this.startMelodyLoop();
    }
  }

  switchTrack(index: number) {
    this.initAudioElement();
    this.currentTrack = (index + this.trackList.length) % this.trackList.length;
    if (this.audio) {
      this.audio.src = this.trackList[this.currentTrack].src;
      this.audio.currentTime = 0;
      this.currentTime = 0;
      this.audio.play().catch(() => {});
    }
    this.notify();
  }

  nextTrack() {
    if (this.isShuffle && this.trackList.length > 1) {
      let randIdx = Math.floor(Math.random() * this.trackList.length);
      while (randIdx === this.currentTrack) {
        randIdx = Math.floor(Math.random() * this.trackList.length);
      }
      this.switchTrack(randIdx);
    } else {
      this.switchTrack(this.currentTrack + 1);
    }
  }

  prevTrack() {
    if (this.audio && this.audio.currentTime > 3) {
      // If played more than 3 seconds, restart current track
      this.audio.currentTime = 0;
      this.currentTime = 0;
      this.notify();
      return;
    }
    this.switchTrack(this.currentTrack - 1);
  }

  seek(seconds: number) {
    if (this.audio && Number.isFinite(seconds)) {
      this.audio.currentTime = Math.max(0, Math.min(this.duration || 100, seconds));
      this.currentTime = this.audio.currentTime;
      this.notify();
    }
  }

  skip(seconds: number) {
    if (this.audio) {
      const target = Math.max(0, Math.min(this.duration || 100, this.audio.currentTime + seconds));
      this.seek(target);
    }
  }

  toggleRepeat() {
    if (this.repeatMode === 'all') this.repeatMode = 'one';
    else if (this.repeatMode === 'one') this.repeatMode = 'off';
    else this.repeatMode = 'all';
    this.notify();
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    this.notify();
  }

  // Tactile sound effect: synthesized romantic tone
  playRomanticTone(frequency: number, duration: number) {
    this.initWebAudio();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(frequency, now);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(frequency * 2, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 1.0);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 1.1);
    osc2.stop(now + duration + 1.1);
  }

  // Tactile sound effect: Realistic heartbeat thump
  playHeartbeat() {
    this.initWebAudio();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const playThump = (timeOffset: number, freq: number, gainVal: number) => {
      if (!this.ctx || !this.masterGain) return;
      const t = now + timeOffset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(35, t + 0.16);

      gain.gain.setValueAtTime(gainVal, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.2);
    };

    playThump(0, 95, 0.45);
    playThump(0.18, 75, 0.35);
  }

  // Interactive micro-chimes for sparkle/clicks/envelopes
  playChime(type: 'sparkle' | 'heart' | 'envelope' | 'yes' | 'click') {
    this.initWebAudio();
    if (!this.ctx || !this.masterGain) return;

    if (type === 'yes') {
      const chord = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];
      chord.forEach((freq, idx) => {
        setTimeout(() => this.playRomanticTone(freq, 2.0), idx * 80);
      });
    } else if (type === 'heart' || type === 'sparkle') {
      this.playRomanticTone(880, 0.7);
      setTimeout(() => this.playRomanticTone(1174.66, 0.9), 90);
    } else if (type === 'envelope') {
      this.playRomanticTone(587.33, 0.6);
      setTimeout(() => this.playRomanticTone(783.99, 0.8), 110);
      setTimeout(() => this.playRomanticTone(1046.5, 1.1), 220);
    } else {
      this.playRomanticTone(659.25, 0.3);
    }
  }
}

export const romanticAudio = new RomanticAudioEngine();

export function RomanticAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(romanticAudio.isPlaying);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(romanticAudio.currentTrack);
  const [volume, setVolume] = useState(romanticAudio.volume);
  const [currentTime, setCurrentTime] = useState(romanticAudio.currentTime);
  const [duration, setDuration] = useState(romanticAudio.duration);
  const [repeatMode, setRepeatMode] = useState(romanticAudio.repeatMode);
  const [isShuffle, setIsShuffle] = useState(romanticAudio.isShuffle);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(true);

  const prevVolumeRef = useRef(volume);

  useEffect(() => {
    romanticAudio.setOnStateChange(() => {
      setIsPlaying(romanticAudio.isPlaying);
      setCurrentTrackIdx(romanticAudio.currentTrack);
      setVolume(romanticAudio.volume);
      setCurrentTime(romanticAudio.currentTime);
      setDuration(romanticAudio.duration);
      setRepeatMode(romanticAudio.repeatMode);
      setIsShuffle(romanticAudio.isShuffle);
    });

    return () => {
      romanticAudio.setOnStateChange(() => {});
    };
  }, []);

  const toggleMusic = () => {
    romanticAudio.togglePlay();
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    romanticAudio.nextTrack();
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    romanticAudio.prevTrack();
  };

  const handleSelectTrack = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    romanticAudio.switchTrack(idx);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    romanticAudio.seek(val);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    romanticAudio.setVolume(val);
    if (val > 0) setIsMuted(false);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMuted) {
      const restored = prevVolumeRef.current || 0.6;
      setVolume(restored);
      romanticAudio.setVolume(restored);
      setIsMuted(false);
    } else {
      prevVolumeRef.current = volume;
      setVolume(0);
      romanticAudio.setVolume(0);
      setIsMuted(true);
    }
  };

  const currentTrack = romanticAudio.trackList[currentTrackIdx];
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Mobile Backdrop Overlay when Music Player is Expanded */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-30 sm:hidden animate-fadeIn"
        />
      )}

      <div className="fixed top-2.5 right-2.5 sm:top-4 sm:right-6 z-40 flex flex-col items-end select-none">
        {/* ── 1. COMPACT PILL BAR (Always Visible in Top Right) ── */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative flex items-center gap-1.5 sm:gap-2.5 px-2.5 py-1.5 sm:px-3.5 sm:py-2 rounded-full botanical-glass border border-[#38bdf8]/60 shadow-[0_4px_25px_rgba(0,0,0,0.7),0_0_15px_rgba(56,189,248,0.3)] backdrop-blur-xl hover:border-[#f472b6]/70 transition-all duration-300 cursor-pointer"
          title={isExpanded ? 'Minimize Music Player' : 'Open Music Player'}
        >
          {/* Animated Vinyl Record Badge */}
          <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-[#081e3a] via-[#162d4e] to-[#081e3a] border border-[#f472b6]/70 flex items-center justify-center shrink-0 shadow-md">
            {/* Spinning vinyl lines */}
            <div
              className={`w-full h-full rounded-full border border-dashed border-[#38bdf8]/60 flex items-center justify-center ${
                isPlaying ? 'animate-spin duration-3000' : ''
              }`}
            >
              <Music className={`w-3 h-3 ${isPlaying ? 'text-[#f472b6]' : 'text-[#7dd3fc]/80'}`} />
            </div>

            {/* Glowing pink center point */}
            <div className="absolute w-1.5 h-1.5 rounded-full bg-[#f472b6] shadow-[0_0_6px_#f472b6]" />
          </div>

          {/* Dynamic Equalizer Wave Bars (Bouncing when playing) */}
          <div className="flex items-end gap-0.5 h-3.5 sm:h-4 w-3.5 sm:w-5 justify-center shrink-0">
            {[0.6, 1.0, 0.4, 0.8].map((mult, idx) => (
              <span
                key={idx}
                className={`w-0.5 rounded-full bg-gradient-to-t from-[#38bdf8] to-[#f472b6] transition-all duration-300 ${
                  isPlaying ? 'animate-pulse' : 'h-1 opacity-50'
                }`}
                style={{
                  height: isPlaying ? `${Math.min(14, 4 + mult * 10)}px` : '3px',
                  animationDuration: `${0.4 + idx * 0.15}s`,
                  animationDelay: `${idx * 0.1}s`,
                }}
              />
            ))}
          </div>

          {/* Track Title Display (Hidden on mobile phones to prevent overlap with chapter titles) */}
          <div className="hidden md:flex flex-col text-left">
            <span className="text-[9px] font-sans text-[#7dd3fc] uppercase tracking-wider font-semibold flex items-center gap-1">
              <span>{isPlaying ? 'Now Playing' : 'Sanctuary Audio'}</span>
              {isPlaying && <span className="w-1 h-1 rounded-full bg-[#f472b6] animate-ping" />}
            </span>
            <span className="text-xs font-serif font-bold text-[#f0f9ff] group-hover:text-[#f472b6] transition-colors truncate max-w-[120px] sm:max-w-[150px]">
              {currentTrack.name}
            </span>
          </div>

          {/* Play/Pause Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleMusic();
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#0369a1] hover:bg-[#0284c7] text-[#ffffff] border border-[#38bdf8]/60 flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer ml-0.5"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            )}
          </button>

          {/* Quick Next Track Button on compact bar */}
          <button
            onClick={handleNext}
            className="hidden sm:flex w-6 h-6 rounded-full bg-[#0a1e36] hover:bg-[#16355d] text-[#bae6fd] hover:text-[#f472b6] border border-[#38bdf8]/40 items-center justify-center transition-all cursor-pointer"
            title="Next Track"
          >
            <SkipForward className="w-3 h-3" />
          </button>

          {/* Expand / Minimize Arrow */}
          <div className="text-[#7dd3fc] group-hover:text-[#f472b6] transition-colors pl-0.5">
            {isExpanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
          </div>
        </div>

        {/* ── 2. EXPANDED ROMANTIC MUSIC PLAYER CARD ── */}
        {isExpanded && (
          <div className="mt-2 w-[92vw] sm:w-88 max-w-sm botanical-glass p-4 sm:p-5 rounded-3xl border-2 border-[#38bdf8]/70 shadow-[0_25px_70px_rgba(0,0,0,0.92),0_0_35px_rgba(56,189,248,0.35)] backdrop-blur-2xl animate-fadeIn">
          {/* Header Row: Title & Partner Nicknames */}
          <div className="flex items-center justify-between border-b border-[#38bdf8]/30 pb-2.5 mb-3.5">
            <div className="flex items-center gap-1.5">
              <Disc className={`w-4 h-4 text-[#f472b6] ${isPlaying ? 'animate-spin duration-3000' : ''}`} />
              <span className="font-serif italic text-xs tracking-wider text-[#bae6fd] font-bold">
                Sanctuary Soundtrack
              </span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#08182b]/90 border border-[#f472b6]/40 text-[10px] text-[#f472b6] font-serif shadow-sm">
              <Heart className="w-2.5 h-2.5 fill-[#f472b6]" />
              <span>For {PROPOSAL_DATA.partnerNickname || 'Pookie'} & {PROPOSAL_DATA.proposerNickname || 'Buggu'}</span>
            </div>
          </div>

          {/* Turntable Artwork & Reactive Tonearm Graphic */}
          <div className="relative flex items-center gap-3.5 mb-3.5 p-3 rounded-2xl bg-[#081a2e]/85 border border-[#38bdf8]/35 shadow-inner overflow-hidden">
            {/* Spinning Sky & Pink LP Vinyl with Tonearm */}
            <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#0c2445] via-[#08172c] to-[#12315c] border-2 border-[#f472b6] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(56,189,248,0.4)]">
              {/* Concentric vinyl groove rings */}
              <div
                className={`w-full h-full rounded-full border border-dashed border-[#7dd3fc]/40 flex items-center justify-center ${
                  isPlaying ? 'animate-spin duration-4000' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full border border-dashed border-[#38bdf8]/30 flex items-center justify-center">
                  <span className="text-lg">{currentTrack.symbol}</span>
                </div>
              </div>

              {/* Glowing Center Spindle */}
              <div className="absolute w-2.5 h-2.5 rounded-full bg-[#f472b6] shadow-[0_0_8px_#f472b6]" />

              {/* Realistic Turntable Tonearm that pivots onto the vinyl when playing */}
              <div
                style={{
                  transformOrigin: 'top right',
                  transform: isPlaying ? 'rotate(18deg)' : 'rotate(-10deg)',
                  transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
                className="absolute -top-1 -right-1 w-6 h-8 pointer-events-none"
              >
                <div className="w-0.5 h-6 bg-gradient-to-b from-[#f472b6] to-[#38bdf8] rounded-full mx-auto" />
                <div className="w-1.5 h-1.5 bg-[#f472b6] rounded-sm mx-auto shadow-sm" />
              </div>
            </div>

            {/* Title, Artist & Mood */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="px-1.5 py-0.5 rounded-md bg-[#0c2342] border border-[#38bdf8]/40 text-[9px] font-mono text-[#f472b6] font-bold">
                  TRACK {currentTrackIdx + 1}/{romanticAudio.trackList.length}
                </span>
                <span className="text-[10px] text-[#7dd3fc] font-serif italic truncate">
                  {currentTrack.mood}
                </span>
              </div>
              <p className="font-playfair text-base font-bold text-[#f0f9ff] truncate">
                {currentTrack.name}
              </p>
              <p className="font-serif italic text-xs text-[#bae6fd] truncate">
                {currentTrack.artist}
              </p>
            </div>
          </div>

          {/* 16-Bar Animated Reactive Soundwave Equalizer */}
          <div className="flex items-end justify-center gap-1 h-5 mb-3 px-2 py-0.5 rounded-xl bg-[#081a2e]/50 border border-[#38bdf8]/20">
            {[0.5, 0.9, 0.3, 0.7, 1.0, 0.4, 0.8, 0.6, 0.9, 0.5, 0.8, 0.4, 1.0, 0.6, 0.3, 0.7].map(
              (mult, idx) => (
                <span
                  key={idx}
                  className={`flex-1 rounded-full bg-gradient-to-t from-[#38bdf8] via-[#7dd3fc] to-[#f472b6] transition-all duration-200 ${
                    isPlaying ? 'animate-pulse' : 'h-1 opacity-40'
                  }`}
                  style={{
                    height: isPlaying ? `${Math.min(16, 4 + mult * 12)}px` : '3px',
                    animationDuration: `${0.35 + idx * 0.08}s`,
                    animationDelay: `${idx * 0.04}s`,
                  }}
                />
              )
            )}
          </div>

          {/* Interactive Audio Progress Bar & Live Timers */}
          <div className="mb-3 px-1">
            <div className="relative flex items-center w-full">
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.5"
                value={currentTime}
                onChange={handleSeek}
                style={{
                  background: `linear-gradient(to right, #f472b6 ${progressPercent}%, #0c203b ${progressPercent}%)`,
                }}
                className="w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-[#f472b6]"
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-[#7dd3fc] mt-1.5">
              <span className="flex items-center gap-1">
                <span>{formatTime(currentTime)}</span>
              </span>
              <span className="text-[#f472b6]/90">
                {duration > 0 ? formatTime(duration) : currentTrack.estimatedDuration}
              </span>
            </div>
          </div>

          {/* Main Playback Controls: Shuffle | Rewind 10s | Prev | Play/Pause | Next | Forward 10s | Repeat */}
          <div className="flex items-center justify-between gap-1 mb-3.5 px-1">
            {/* Shuffle Mode Toggle */}
            <button
              onClick={() => romanticAudio.toggleShuffle()}
              className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                isShuffle
                  ? 'bg-[#0c2545] text-[#f472b6] border-[#f472b6]/70 shadow-[0_0_8px_#f472b6]'
                  : 'bg-[#08182b]/70 text-[#7dd3fc]/70 border-[#38bdf8]/25 hover:text-[#f0f9ff]'
              }`}
              title={isShuffle ? 'Shuffle: ON' : 'Shuffle: OFF'}
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            {/* Quick 10s Rewind */}
            <button
              onClick={() => romanticAudio.skip(-10)}
              className="p-1.5 rounded-full bg-[#08182b]/70 text-[#7dd3fc] hover:text-[#f472b6] border border-[#38bdf8]/25 transition-all cursor-pointer"
              title="Rewind 10 seconds"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Previous Track */}
            <button
              onClick={handlePrev}
              className="p-2 rounded-full bg-[#0a1e36] hover:bg-[#16355d] text-[#e0f2fe] hover:text-[#f472b6] border border-[#38bdf8]/40 shadow hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="Previous Track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play/Pause Button (Grand Sky Blue & Pink Button) */}
            <button
              onClick={toggleMusic}
              className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0284c7] via-[#ec4899] to-[#db2777] hover:from-[#0369a1] hover:to-[#be185d] text-white flex items-center justify-center shadow-[0_0_25px_rgba(236,72,153,0.7)] border-2 border-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white ml-0.5" />
              )}
            </button>

            {/* Next Track */}
            <button
              onClick={handleNext}
              className="p-2 rounded-full bg-[#0a1e36] hover:bg-[#16355d] text-[#e0f2fe] hover:text-[#f472b6] border border-[#38bdf8]/40 shadow hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="Next Track"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Quick 10s Forward */}
            <button
              onClick={() => romanticAudio.skip(10)}
              className="p-1.5 rounded-full bg-[#08182b]/70 text-[#7dd3fc] hover:text-[#f472b6] border border-[#38bdf8]/25 transition-all cursor-pointer"
              title="Forward 10 seconds"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            {/* Repeat Mode Toggle (All -> One -> Off) */}
            <button
              onClick={() => romanticAudio.toggleRepeat()}
              className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                repeatMode !== 'off'
                  ? 'bg-[#0c2545] text-[#f472b6] border-[#f472b6]/70 shadow-[0_0_8px_#f472b6]'
                  : 'bg-[#08182b]/70 text-[#7dd3fc]/70 border-[#38bdf8]/25 hover:text-[#f0f9ff]'
              }`}
              title={
                repeatMode === 'one'
                  ? 'Repeat: Current Track'
                  : repeatMode === 'all'
                  ? 'Repeat: All Playlist'
                  : 'Repeat: OFF'
              }
            >
              {repeatMode === 'one' ? (
                <Repeat1 className="w-3.5 h-3.5" />
              ) : (
                <Repeat className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Volume Slider Bar */}
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[#08182b]/70 border border-[#38bdf8]/25 mb-3">
            <button
              onClick={toggleMute}
              className="text-[#7dd3fc] hover:text-[#f472b6] transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-[#ff8fa3]" />
              ) : volume < 0.5 ? (
                <Volume1 className="w-4 h-4 text-[#38bdf8]" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#38bdf8]" />
              )}
            </button>

            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-[#0a1e36] rounded-lg appearance-none cursor-pointer accent-[#f472b6]"
              title={`Volume: ${Math.round(volume * 100)}%`}
            />

            <span className="text-[10px] font-mono text-[#7dd3fc] w-7 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>

          {/* Interactive Playlist Accordion Header */}
          <div className="border-t border-[#38bdf8]/25 pt-2.5">
            <div
              onClick={() => setShowPlaylist(!showPlaylist)}
              className="flex items-center justify-between mb-1.5 px-1 cursor-pointer group"
            >
              <div className="flex items-center gap-1.5">
                <ListMusic className="w-3.5 h-3.5 text-[#f472b6]" />
                <span className="text-[10px] font-sans uppercase tracking-wider text-[#7dd3fc] font-bold group-hover:text-[#f472b6] transition-colors">
                  Playlist ({romanticAudio.trackList.length} Tracks)
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-serif italic text-[#f472b6]">
                <span>{isPlaying ? '♪ Playing' : 'Paused'}</span>
                {showPlaylist ? (
                  <ChevronUp className="w-3.5 h-3.5 text-[#7dd3fc]" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-[#7dd3fc]" />
                )}
              </div>
            </div>

            {/* Song Cards */}
            {showPlaylist && (
              <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-0.5 no-scrollbar">
                {romanticAudio.trackList.map((track, i) => (
                  <button
                    key={track.id}
                    onClick={(e) => handleSelectTrack(i, e)}
                    className={`px-3 py-2 rounded-xl text-[11px] font-serif text-left transition-all flex items-center justify-between border cursor-pointer ${
                      currentTrackIdx === i
                        ? 'bg-[#0c2545] text-[#f472b6] border-[#f472b6]/70 shadow-[0_0_14px_rgba(56,189,248,0.5)] font-bold'
                        : 'bg-[#08182b]/60 text-[#e0f2fe] border-[#38bdf8]/30 hover:bg-[#0f2442] hover:border-[#f472b6]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="text-base">{track.symbol}</span>
                      <div className="truncate text-left">
                        <p className="truncate leading-tight font-medium">
                          {i + 1}. {track.name}
                        </p>
                        <p className="text-[9px] text-[#7dd3fc] truncate leading-tight mt-0.5">
                          {track.artist}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className="text-[10px] font-mono opacity-70">
                        {track.estimatedDuration}
                      </span>
                      {currentTrackIdx === i && isPlaying && (
                        <span className="flex items-end gap-0.5 h-3">
                          <span className="w-0.5 h-3 bg-[#f472b6] animate-pulse" />
                          <span className="w-0.5 h-2 bg-[#f472b6] animate-pulse delay-75" />
                          <span className="w-0.5 h-3 bg-[#f472b6] animate-pulse delay-150" />
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Bottom Romantic Tagline */}
          <div className="mt-3 pt-2 border-t border-[#38bdf8]/20 flex items-center justify-center gap-1.5 text-[10px] text-[#7dd3fc]/80 font-serif italic text-center">
            <Sparkles className="w-2.5 h-2.5 text-[#f472b6]" />
            <span>Dedicated with eternal love to Pookie 💖</span>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

export default RomanticAudioPlayer;
