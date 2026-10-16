import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
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
export function Countdown({ seconds, color = c.ink }: {
  seconds: number;
  color?: string;
}) {
  const reduced = useReducedMotion();
  const beat = useRef(new Animated.Value(1)).current;
  const fast = seconds <= 60;
  useEffect(() => {
    beat.setValue(1);
    if (reduced || seconds <= 0) return;
    const duration = fast ? 165 : 250;
    const loop = Animated.loop(Animated.sequence([Animated.timing(beat, {toValue: 1.035, duration, useNativeDriver: true}), Animated.timing(beat, {toValue: 1, duration, useNativeDriver: true})]));
    loop.start(); return () => loop.stop();
  }, [beat, reduced, fast, seconds <= 0]);
  const value = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  return <View accessibilityRole="timer" accessibilityLabel={`${Math.floor(seconds / 60)} min ${seconds % 60} s`} style={{ alignItems: 'center', marginVertical: 18 }}>
    <Animated.View pointerEvents="none" style={{position:'absolute',width:250,height:130,borderRadius:100,borderWidth:4,borderColor:c.pink,opacity:0.5,transform:[{scale:beat}]}} />
    <Animated.View style={{ flexDirection: 'row', justifyContent: 'center', transform: [{scale: beat}] }}>{value.split('').map((digit, i) => <CountdownDigit key={i} digit={digit} color={color} />)}</Animated.View>
    <View style={{ flexDirection: 'row', width: 240, justifyContent: 'space-around' }}><Text style={{ color }}>min</Text><Text style={{ color }}>s</Text></View>
  </View>;
}
function CountdownDigit({ digit, color }: { digit: string; color: string }) {
  const reduced = useReducedMotion();
  const flip = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    flip.setValue(reduced ? 1 : 0);
    const animation = Animated.timing(flip, { toValue: 1, duration: reduced ? 0 : 220, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [digit, reduced, flip]);
  return <Animated.Text style={{ width: digit === ':' ? 20 : 48, textAlign: 'center', fontFamily: display, fontSize: 96, lineHeight: 112, color, fontVariant: ['tabular-nums'], transform: reduced ? [] : [{ perspective: 500 }, { rotateX: flip.interpolate({ inputRange: [0, 1], outputRange: [digit === ':' ? '0deg' : '-75deg', '0deg'] }) }] }}>{digit}</Animated.Text>;
}

export function FuseBar({ seconds, total = 600, color = c.ink }: { seconds: number; total?: number; color?: string }) {
  const reduced = useReducedMotion();
  const left = useRef(new Animated.Value(seconds)).current;
  useEffect(() => {
    const animation = Animated.timing(left, { toValue: seconds, duration: reduced ? 0 : 800, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [seconds, reduced, left]);
  return <View accessibilityLabel={`${seconds} secondes restantes sur ${total}`} style={{ height: 5, backgroundColor: c.line, marginBottom: 18 }}>
    <Animated.View style={{ height: 5, width: '100%', transformOrigin: 'left center', transform: [{ scaleX: left.interpolate({ inputRange: [0, total], outputRange: [0, 1], extrapolate: 'clamp' }) }], backgroundColor: color }} />
  </View>;
}
