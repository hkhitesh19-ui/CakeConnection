// ============================================
// Custom Hooks — Cake Connection
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook to detect mobile viewport
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Hook to detect scroll position
 */
export function useScrollPosition(): { y: number; direction: 'up' | 'down' } {
  const [scrollData, setScrollData] = useState<{ y: number; direction: 'up' | 'down' }>({ y: 0, direction: 'down' });
  const lastY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const direction = y > lastY.current ? 'down' : 'up';
      lastY.current = y;
      setScrollData({ y, direction: direction as 'up' | 'down' });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollData;
}

/**
 * Hook for intersection observer (lazy loading / animations)
 */
export function useInView(
  options: IntersectionObserverInit = {}
): [React.RefCallback<Element>, boolean] {
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const ref = useCallback(
    (node: Element | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (node) {
        observerRef.current = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setIsInView(true);
              observerRef.current?.disconnect();
            }
          },
          { threshold: 0.1, ...options }
        );
        observerRef.current.observe(node);
      }
    },
    [options]
  );

  return [ref, isInView];
}

/**
 * Hook for local storage with SSR safety
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn(`Failed to set localStorage key "${key}"`);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook for media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

/**
 * Hook for click outside detection
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void
): void {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback]);
}
