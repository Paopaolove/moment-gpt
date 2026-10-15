import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * The system preference is read once at startup and cached, so components
 * mounted later know it on their first render. Without the cache, every mount
 * started "still", then replayed its animation once the async answer came in,
 * which made stamps flash in their final state before striking.
 */
let cached: boolean | null = null;
const listeners = new Set<(value: boolean) => void>();
const publish = (value: boolean) => {
  cached = value;
  listeners.forEach(listener => listener(value));
};
AccessibilityInfo.isReduceMotionEnabled().then(publish).catch(() => publish(false));
AccessibilityInfo.addEventListener('reduceMotionChanged', publish);

export function useReducedMotion() {
  // Until the very first answer arrives, default to stillness.
  const [reduced, setReduced] = useState(cached ?? true);
  useEffect(() => {
    listeners.add(setReduced);
    if (cached !== null) setReduced(cached);
    return () => {
      listeners.delete(setReduced);
    };
  }, []);
  return reduced;
}
