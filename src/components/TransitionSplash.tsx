import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTransition } from '../context/TransitionContext';
import HeartLogo from './HeartLogo';

export default function TransitionSplash() {
  const { transition, finishTransition } = useTransition();
  const navigate = useNavigate();
  const [phase, setPhase] = useState<'idle' | 'enter' | 'show' | 'exit'>('idle');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => {
    if (transition.active && transition.phase === 'enter') {
      clearTimers();
      setPhase('enter');

      // Phase 1 → animate in (100ms)
      timers.current.push(setTimeout(() => setPhase('show'), 80));

      // Phase 2 → navigate at peak (900ms)
      timers.current.push(
        setTimeout(() => {
          if (transition.pendingPath) {
            navigate(transition.pendingPath, {
              state: transition.pendingState as Record<string, unknown> | undefined,
            });
          }
        }, 900)
      );

      // Phase 3 → start exit (1200ms)
      timers.current.push(setTimeout(() => setPhase('exit'), 1200));

      // Phase 4 → fully done (1700ms)
      timers.current.push(
        setTimeout(() => {
          setPhase('idle');
          finishTransition();
        }, 1700)
      );
    }

    return clearTimers;
  }, [transition.active, transition.phase, transition.pendingPath, transition.pendingState, navigate, finishTransition]);

  if (phase === 'idle') return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto"
      style={{
        background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 40%, #14b8a6 70%, #5eead4 100%)',
        opacity: phase === 'enter' ? 0 : phase === 'exit' ? 0 : 1,
        transition: phase === 'enter' ? 'opacity 0.15s ease-out' : 'opacity 0.45s ease-in',
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-xl" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/5 blur-xl" />
      </div>

      {/* Content */}
      <div
        className="relative flex flex-col items-center"
        style={{
          opacity: phase === 'show' ? 1 : 0,
          transform: phase === 'show' ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(12px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}
      >
        {/* Heart beat */}
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-150" />
          <div
            className="relative animate-heartbeat"
            style={{ filter: 'drop-shadow(0 0 18px rgba(255,255,255,0.3))' }}
          >
            <HeartLogo size="xl" />
          </div>
        </div>

        {/* Brand */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Heart{' '}
          <span className="relative">
            Pharma
            <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-white/40 rounded-full" />
          </span>
        </h1>

        {/* Loading dots */}
        <div className="flex items-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2.5 h-2.5 rounded-full bg-white"
              style={{
                animation: 'dotBounce 1.2s ease-in-out infinite',
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
