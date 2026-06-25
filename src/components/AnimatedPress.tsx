import { useCallback, useRef, useState, type ReactNode, type MouseEvent } from 'react';

interface AnimatedPressProps {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
  as?: 'div' | 'span';
  disabled?: boolean;
}

/**
 * Wraps any element with a satisfying click animation:
 *   1. Quick scale-down on press (0.93)
 *   2. Teal ripple circle expands from click point
 *   3. Smooth bounce back to 1.0
 */
export default function AnimatedPress({
  children,
  className = '',
  onClick,
  as: Tag = 'div',
  disabled = false,
}: AnimatedPressProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [pressed, setPressed] = useState(false);
  const idCounter = useRef(0);

  const handleClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (disabled) return;

      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2.5;

      const id = ++idCounter.current;
      setRipples((prev) => [...prev, { id, x, y, size }]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 600);

      // Scale press
      setPressed(true);
      setTimeout(() => setPressed(false), 180);

      onClick?.(e);
    },
    [onClick, disabled]
  );

  return (
    <Tag
      ref={containerRef as React.Ref<HTMLDivElement>}
      className={`relative overflow-hidden cursor-pointer select-none ${className}`}
      onClick={handleClick}
      style={{
        transform: pressed ? 'scale(0.93)' : 'scale(1)',
        transition: pressed
          ? 'transform 0.1s cubic-bezier(0.4, 0, 0.2, 1)'
          : 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="pointer-events-none absolute rounded-full"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            background: 'radial-gradient(circle, rgba(20,184,166,0.25) 0%, rgba(20,184,166,0.05) 60%, transparent 100%)',
            animation: 'rippleExpand 0.55s ease-out forwards',
          }}
        />
      ))}
    </Tag>
  );
}
