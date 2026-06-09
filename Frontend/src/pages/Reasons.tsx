import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const reasons = [
  { emoji: '✨', title: 'Your Smile', body: 'It lights up every room and every corner of my heart.' },
  { emoji: '🌸', title: 'Your Kindness', body: 'You care so deeply for everyone around you — it\'s breathtaking.' },
  { emoji: '💫', title: 'Your Laughter', body: 'It\'s the most beautiful sound I\'ve ever heard.' },
  { emoji: '🌙', title: 'Your Strength', body: 'You face every storm with grace and come out even more radiant.' },
  { emoji: '🌹', title: 'Your Warmth', body: 'Being near you feels like coming home.' },
  { emoji: '💎', title: 'Just You', body: 'Every single thing about you is perfectly, wonderfully you.' },
];

export function Reasons() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef   = useRef<HTMLDivElement>(null);
  const cardsRef   = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 1.4, ease: 'power3.out',
        scrollTrigger: { trigger: titleRef.current, start: 'top 80%' }
      }
    );

    cardsRef.current.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: { trigger: card, start: 'top 85%' }
        }
      );
    });
  }, []);

  const scrollNext = () => {
    document.getElementById('proposal-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="reasons-section" ref={sectionRef}
      className="relative w-full min-h-screen py-24 px-6 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0d0010 0%, #1a0028 50%, #0d0010 100%)' }}>

      {/* Decorative orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(199,125,255,0.15) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(249,168,212,0.15) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-5xl mx-auto">
        <div ref={titleRef} style={{ opacity: 0 }} className="text-center mb-16">
          <p className="font-sans text-sm uppercase tracking-[0.3em] mb-4" style={{ color: '#c77dff' }}>
            The reasons why
          </p>
          <h2 className="font-script text-5xl md:text-7xl drop-shadow-[0_0_20px_rgba(249,168,212,0.4)]"
            style={{ color: '#fce7f3' }}>
            I Love You
          </h2>
          <div className="mt-4 h-px w-24 mx-auto"
            style={{ background: 'linear-gradient(90deg, transparent, #f9a8d4, transparent)' }} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map((r, i) => (
            <div key={i}
              ref={el => { if (el) cardsRef.current[i] = el; }}
              style={{ opacity: 0, background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(249,168,212,0.15)' }}
              className="rounded-3xl border p-8 text-center backdrop-blur-sm hover:scale-105 transition-transform duration-300 cursor-default"
            >
              <div className="text-5xl mb-4">{r.emoji}</div>
              <h3 className="font-script text-2xl mb-3" style={{ color: '#f9a8d4' }}>{r.title}</h3>
              <p className="font-serif text-base italic leading-relaxed" style={{ color: '#fce7f3', opacity: 0.8 }}>{r.body}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow to next */}
      <div className="flex justify-center mt-16">
        <button onClick={scrollNext}
          className="animate-bounce cursor-pointer transition-colors"
          style={{ color: '#f9a8d4', background: 'none', border: 'none' }}>
          <ChevronDown size={44} strokeWidth={1} />
        </button>
      </div>
    </section>
  );
}
