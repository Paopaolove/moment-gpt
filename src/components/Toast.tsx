import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { T } from './T';
import { colors as c } from '../theme/tokens';
export function Toast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  const opacity = useRef(new Animated.Value(1)).current;
  const dismiss = useRef(onDismiss);
  dismiss.current = onDismiss;
  useEffect(() => {
    opacity.setValue(1);
    const timer = setTimeout(() => Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }).start(({ finished }) => { if (finished) dismiss.current(); }), 3600);
    return () => { clearTimeout(timer); opacity.stopAnimation(); };
  }, [message, opacity]);
  return <Animated.View accessibilityRole="alert" accessibilityLiveRegion="polite" pointerEvents="none" style={{ position: 'absolute', bottom: 90, left: 20, right: 20, padding: 16, borderRadius: 14, backgroundColor: c.accent, opacity }}><T style={{ color: 'white', fontSize: 14 }}>{message}</T></Animated.View>;
}
