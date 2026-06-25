interface HeartLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  animate?: boolean;
}

const sizeMap = {
  xs: 'w-5 h-5', sm: 'w-7 h-7', md: 'w-9 h-9',
  lg: 'w-12 h-12', xl: 'w-20 h-20', '2xl': 'w-28 h-28',
};

export default function HeartLogo({ size = 'md', className = '', animate = false }: HeartLogoProps) {
  return (
    <div
      className={`${sizeMap[size]} relative flex-shrink-0 ${animate ? 'animate-heartbeat' : ''} ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 100 92" fill="none" xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 3px 10px rgba(13,148,136,0.22))' }}
      >
        <defs>
          <linearGradient id="hp-heart-body" x1="15" y1="8" x2="70" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="22%" stopColor="#14b8a6" />
            <stop offset="58%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
          <linearGradient id="hp-heart-shine" x1="20" y1="10" x2="58" y2="46" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="white" stopOpacity="0.74" />
            <stop offset="45%" stopColor="white" stopOpacity="0.18" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hp-heart-rim" x1="8" y1="25" x2="32" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5eead4" stopOpacity="0.48" />
            <stop offset="100%" stopColor="#5eead4" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="hp-heart-glow" cx="50%" cy="28%" r="52%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#5eead4" stopOpacity="0.30" />
            <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <path d="M50 85 C 26 66, 5 50, 5 29 C 5 15.5, 16.2 6.5, 29.8 6.5 C 39.2 6.5, 47.1 11.1, 50 18.3 C 52.9 11.1, 60.8 6.5, 70.2 6.5 C 83.8 6.5, 95 15.5, 95 29 C 95 50, 74 66, 50 85 Z" fill="url(#hp-heart-body)" />
        <path d="M50 18.3 C 47.1 11.1, 39.2 6.5, 29.8 6.5 C 19.5 6.5, 10.8 12.8, 7.8 21.8 C 14.2 16.2, 21.5 14.9, 29 18.9 C 37.8 23.6, 43.5 29.8, 48.2 38.5 C 49.5 30.4, 50.6 23.9, 50 18.3 Z" fill="url(#hp-heart-shine)" />
        <path d="M50 85 C 26 66, 5 50, 5 29 C 5 25.2, 5.8 21.7, 7.2 18.6 C 7 27.8, 11.2 37.5, 19.5 46.8 C 30.8 59.5, 41.6 71.2, 50 79.5 L 50 85 Z" fill="url(#hp-heart-rim)" />
        <path d="M50 85 C 26 66, 5 50, 5 29 C 5 15.5, 16.2 6.5, 29.8 6.5 C 39.2 6.5, 47.1 11.1, 50 18.3 C 52.9 11.1, 60.8 6.5, 70.2 6.5 C 83.8 6.5, 95 15.5, 95 29 C 95 50, 74 66, 50 85 Z" fill="url(#hp-heart-glow)" style={{ mixBlendMode: 'screen' }} />
      </svg>
    </div>
  );
}
