import { useEffect, useState } from 'react';
import HeartLogo from './HeartLogo';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter');

  useEffect(() => {
    const enterTimer = setTimeout(() => setPhase('show'), 100);
    const exitTimer = setTimeout(() => setPhase('exit'), 2800);
    const finishTimer = setTimeout(() => onFinish(), 3500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center transition-opacity duration-700 ${
        phase === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{
        background: 'linear-gradient(135deg, #0f766e 0%, #0d9488 40%, #14b8a6 70%, #5eead4 100%)',
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-white/5 blur-xl" />
        <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-white/5 blur-lg" />

        {/* Floating crosses/plus signs */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/10 font-bold animate-float"
            style={{
              fontSize: `${20 + Math.random() * 30}px`,
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            ✚
          </div>
        ))}
      </div>

      <div
        className={`relative flex flex-col items-center transition-all duration-700 ${
          phase === 'enter' ? 'scale-75 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Heart icon with pulse */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-150" />
          <div
            className={`relative ${phase === 'show' ? 'animate-heartbeat' : ''}`}
            style={{ filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.3))' }}
          >
            <HeartLogo size="2xl" />
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-2">
          Heart{' '}
          <span className="relative">
            Pharma
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-white/40 rounded-full" />
          </span>
        </h1>

        {/* Tagline */}
        <p
          className="text-teal-100 text-lg sm:text-xl font-medium mt-3 tracking-wide"
          style={{
            opacity: phase === 'show' ? 1 : 0,
            transition: 'opacity 0.8s ease 0.3s',
          }}
        >
          Your Health, Our Heartbeat
        </p>

        {/* Loading bar */}
        <div className="mt-10 w-48 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all ease-linear"
            style={{
              width: phase === 'enter' ? '0%' : phase === 'show' ? '80%' : '100%',
              transitionDuration: phase === 'show' ? '2.5s' : '0.5s',
            }}
          />
        </div>
      </div>
    </div>
  );
}
