import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { c, categoryColor, medium, serif } from '../theme/tokens';
import { Category } from '../domain/rules';
import { useReducedMotion } from './useReducedMotion';

function usePhase(duration = 8000) {
  const reduced = useReducedMotion();
  const phase = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    phase.setValue(0);
    if (reduced) return;
    const loop = Animated.loop(Animated.timing(phase, { toValue: 1, duration, easing: Easing.linear, useNativeDriver: true }));
    loop.start(); return () => loop.stop();
  }, [reduced, duration, phase]);
  return { phase, reduced };
}
export function Sticker({ children, shape = 'round', color = c.yellow }: { children: React.ReactNode; shape?: 'round' | 'star' | 'scallop'; color?: string }) {
  return <View style={{ alignSelf: 'center', padding: 18, margin: 8, backgroundColor: color, borderRadius: shape === 'round' ? 100 : 24, transform: [{ rotate: '-5deg' }], borderWidth: 2, borderColor: c.ink }}>
    {shape !== 'round' && Array.from({ length: shape === 'star' ? 12 : 20 }, (_, i) => <View pointerEvents="none" key={i} style={{ position: 'absolute', width: 30, height: 30, backgroundColor: color, borderRadius: shape === 'star' ? 2 : 15, left: '50%', top: '50%', transform: [{ rotate: `${i * (shape === 'star' ? 30 : 18)}deg` }, { translateY: -45 }] }} />)}
    <View>{children}</View>
  </View>;
}
export function Marquee({ text = 'PLACE LIBRE · PLACE LIBRE · ON SORT ? · ' }: { text?: string }) {
  const { phase } = usePhase(14000);
  return <View accessibilityLabel={text} style={{ height: 45, backgroundColor: c.yellow, overflow: 'hidden', transform: [{ rotate: '-3deg' }], marginVertical: 12 }}><Animated.Text accessibilityElementsHidden numberOfLines={1} style={{ width: 2000, fontFamily: medium, fontSize: 24, lineHeight: 44, color: c.ink, transform: [{ translateX: phase.interpolate({ inputRange: [0, 1], outputRange: [0, -360] }) }] }}>{text.repeat(12)}</Animated.Text></View>;
}
export function SunsetGradient() {
  const { phase } = usePhase(12000);
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill, { overflow: 'hidden' }]}>{[c.accent, c.pink, c.paper].map((color, i) => <Animated.View key={color} style={{ position: 'absolute', backgroundColor: color, opacity: 0.55, borderRadius: 200, width: '180%', height: 320, left: '-40%', top: i * 130 - 80, transform: [{ translateY: phase.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, 28 * (i + 1), 0] }) }] }} />)}</View>;
}
export function DiscoBall() {
  const { phase } = usePhase(10000);
  return <View accessibilityLabel="Boule à facettes" style={{ height: 125, alignItems: 'center' }}><View style={{ height: 20, width: 2, backgroundColor: c.light }} /><View style={{ width: 92, height: 92, borderRadius: 46, overflow: 'hidden', flexDirection: 'row', flexWrap: 'wrap', backgroundColor: c.blue }}>{Array.from({ length: 64 }, (_, i) => <View key={i} style={{ width: 11.5, height: 11.5, borderWidth: 1, borderColor: c.paper, backgroundColor: [c.light, c.pink, c.blue, c.yellow][(i * 7 + Math.floor(i / 8)) % 4] }} />)}</View><Animated.View pointerEvents="none" style={{ position: 'absolute', top: 60, transform: [{ rotate: phase.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>{[0, 90, 180, 270].map(n => <Text key={n} style={{ position: 'absolute', color: c.yellow, fontSize: 26, transform: [{ rotate: `${n}deg` }, { translateX: 100 }] }}>✦</Text>)}</Animated.View></View>;
}
export function Confetti({ category }: { category: Category }) {
  const reduced = useReducedMotion();
  const fall = useRef(new Animated.Value(0)).current;
  useEffect(() => { if (reduced) return; fall.setValue(0); const a = Animated.timing(fall, { toValue: 1, duration: 2600, useNativeDriver: true }); a.start(); return () => a.stop(); }, [fall, reduced]);
  if (reduced) return null;
  return <View pointerEvents="none" accessibilityElementsHidden style={[StyleSheet.absoluteFill, { overflow: 'hidden', zIndex: 5 }]}>{Array.from({ length: 48 }, (_, i) => <Animated.View key={i} style={{ position: 'absolute', left: `${i * 37 % 100}%`, top: -30 - i * 4, width: 6 + i % 5, height: 12, backgroundColor: [categoryColor[category], c.yellow, c.blue, c.pink][i % 4], opacity: fall.interpolate({ inputRange: [0, 0.75, 1], outputRange: [1, 1, 0] }), transform: [{ translateY: fall.interpolate({ inputRange: [0, 1], outputRange: [0, 800 + i * 7] }) }, { rotate: fall.interpolate({ inputRange: [0, 1], outputRange: ['0deg', `${i % 2 ? 540 : -540}deg`] }) }] }} />)}</View>;
}
export function Entrance({ children, index = 0 }: { children: React.ReactNode; index?: number }) {
 const reduced = useReducedMotion(); const v = useRef(new Animated.Value(0)).current;
 useEffect(() => { const a = Animated.timing(v, { toValue: 1, delay: reduced ? 0 : Math.min(index * 90, 600), duration: 450, useNativeDriver: true }); a.start(); return () => a.stop(); }, [v, reduced, index]);
 return <Animated.View style={{ opacity: v, transform: reduced ? [] : [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [45, 0] }) }, { rotate: v.interpolate({ inputRange: [0, 1], outputRange: [index % 2 ? '4deg' : '-4deg', '0deg'] }) }] }}>{children}</Animated.View>;
}
export function Opening({ children }: { children: React.ReactNode }) {
 const reduced = useReducedMotion(); const v = useRef(new Animated.Value(0)).current;
 useEffect(() => { v.setValue(0); const a = Animated.timing(v, { toValue: 1, duration: reduced ? 350 : 1500, useNativeDriver: true }); a.start(); return () => a.stop(); }, [v, reduced]);
 return <View style={{ overflow: 'hidden' }}><SunsetGradient /><Animated.View style={{ opacity: v, transform: reduced ? [] : [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [-180, 0] }) }] }}><DiscoBall />{children}</Animated.View>{!reduced && <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: c.blue, flexDirection: 'row', transform: [{ translateY: v.interpolate({ inputRange: [0, 1], outputRange: [0, -1500] }) }] }]}>{Array.from({length: 16}, (_, i) => <View key={i} style={{ flex: 1, borderRightWidth: 5, borderColor: '#2422A0', borderBottomLeftRadius: 14, borderBottomRightRadius: 14 }} />)}</Animated.View>}</View>;
}
export function FlyingStub({ children }: { children: React.ReactNode }) {
 const reduced = useReducedMotion(); const v = useRef(new Animated.Value(0)).current;
 useEffect(() => { const a = Animated.timing(v, { toValue: 1, duration: reduced ? 400 : 1200, useNativeDriver: true }); a.start(); return () => a.stop(); }, [reduced, v]);
 return <View style={{ overflow: 'hidden' }}>{children}<Animated.View pointerEvents="none" style={{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: c.yellow, borderTopWidth: 3, borderStyle: 'dashed', padding: 24, opacity: v.interpolate({inputRange:[0,1], outputRange:[1,0]}), transform: reduced ? [] : [{ translateX: v.interpolate({inputRange:[0,1],outputRange:[0,350]}) }, { translateY: v.interpolate({inputRange:[0,1],outputRange:[0,-200]}) }, { rotate: v.interpolate({inputRange:[0,1],outputRange:['0deg','100deg']}) }] }}><Text style={{fontFamily:medium,color:c.ink}}>CRRAC ! C’EST VOTRE PLACE.</Text></Animated.View></View>;
}
