import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

interface TransitionState {
  active: boolean;
  phase: 'enter' | 'show' | 'exit' | 'idle';
  pendingPath: string | null;
  pendingState: unknown;
}

interface TransitionContextType {
  transition: TransitionState;
  navigateWithSplash: (path: string, state?: unknown) => void;
  /** call from the component that listens for the route change */
  finishTransition: () => void;
}

const TransitionContext = createContext<TransitionContextType | undefined>(undefined);

export function TransitionProvider({ children }: { children: ReactNode }) {
  const [transition, setTransition] = useState<TransitionState>({
    active: false,
    phase: 'idle',
    pendingPath: null,
    pendingState: undefined,
  });

  const navigateWithSplash = useCallback((path: string, state?: unknown) => {
    setTransition({
      active: true,
      phase: 'enter',
      pendingPath: path,
      pendingState: state,
    });
  }, []);

  const finishTransition = useCallback(() => {
    setTransition({ active: false, phase: 'idle', pendingPath: null, pendingState: undefined });
  }, []);

  return (
    <TransitionContext.Provider value={{ transition, navigateWithSplash, finishTransition }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('useTransition must be used within TransitionProvider');
  return ctx;
}
