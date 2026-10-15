import { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';
import { c, display } from '../theme/tokens';
import { useReducedMotion } from './useReducedMotion';
export function Pulse({ dots = false }: {
  dots?: boolean;
}) {
  const reduced = useReducedMotion();
  const phase = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if(reduced)
      return;
    const loop = Animated.loop(Animated.sequence([Animated.timing(phase, { toValue: 0.3, duration: 650, useNativeDriver: true }), Animated.timing(phase, { toValue: 1, duration: 650, useNativeDriver: true })]));
    loop.start();
    return () => loop.stop();
  }, [reduced, phase]);
  return <Animated.View accessibilityLabel={dots ? 'Lecture en cours' : undefined} style={{ opacity: phase, flexDirection: 'row', gap: 5 }}>{Array.from({ length: dots ? 3 : 1 }, (_, i) => <View key={i} style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: c.accent }} />)}</Animated.View>;
}
export function Countdown({ seconds }: {
  seconds: number;
}) {
  const reduced = useReducedMotion();
  const flip = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    flip.setValue(reduced ? 1 : 0);
    Animated.timing(flip, { toValue: 1, duration: 180, useNativeDriver: true }).start();
  }, [seconds, reduced, flip]);
  const value = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return <View accessibilityRole="timer" accessibilityLabel={value} style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 18 }}>
    {value.split('').map((digit, i) => <Animated.Text key={`${i}-${digit}`} style={{ fontFamily: display, fontSize: 96, lineHeight: 112, color: c.ink, fontVariant: ['tabular-nums'], transform: [{ rotateX: flip.interpolate({ inputRange: [0, 1], outputRange: ['55deg', '0deg'] }) }] }}>{digit}</Animated.Text>)}
  </View>;
}

export function FuseBar({ seconds }: { seconds: number }) {
  const reduced = useReducedMotion();
  const left = useRef(new Animated.Value(seconds)).current;
  useEffect(() => {
    const animation = Animated.timing(left, { toValue: seconds, duration: reduced ? 0 : 800, useNativeDriver: false });
    animation.start();
    return () => animation.stop();
  }, [seconds, reduced, left]);
  return <View accessibilityLabel={`${seconds} secondes restantes sur 600`} style={{ height: 5, backgroundColor: c.line, marginBottom: 18 }}>
    <Animated.View style={{ height: 5, width: left.interpolate({ inputRange: [0, 600], outputRange: ['0%', '100%'], extrapolate: 'clamp' }), backgroundColor: left.interpolate({ inputRange: [0, 60, 600], outputRange: [c.accent, c.ink, c.ink], extrapolate: 'clamp' }) }} />
  </View>;
}
