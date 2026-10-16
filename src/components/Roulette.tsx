import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Modal, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Moment } from '../domain/rules';
import { c, medium, serif } from '../theme/tokens';
import { feedback } from './haptics';
import { Confetti, Sticker } from './Funky';
import { Ticket } from './Ticket';
import { useReducedMotion } from './useReducedMotion';

const time = (m: Moment) => new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' }).format(m.startsAt);
const values = (m: Moment) => [m.category, `${m.district}e`, time(m)];
const CELL = 112;
function Reel({ moments, target, index, stopped }: { moments: Moment[]; target: Moment; index: number; stopped: boolean }) {
  const reduced = useReducedMotion();
  const offset = useRef(new Animated.Value(0)).current;
  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    offset.setValue(0);
    if (reduced || stopped) return;
    const loop = Animated.loop(Animated.timing(offset, { toValue: -moments.length * CELL, duration: Math.max(240, moments.length * 65), easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [offset, moments, stopped, reduced]);
  useEffect(() => {
    if (!stopped || reduced) return;
    bounce.setValue(-22);
    const animation = Animated.spring(bounce, { toValue: 0, friction: 4, tension: 190, useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [stopped, bounce, reduced]);
  return <View style={{ flex: index === 0 ? 1.45 : index === 1 ? 0.7 : 1.1, minWidth: 0, height: CELL, overflow: 'hidden', backgroundColor: c.card, borderRadius: 6 }}>
    <Animated.View style={{ opacity: stopped || reduced ? 1 : 0.48, transform: [{ translateY: stopped ? bounce : offset }] }}>
      {(stopped || reduced ? [target] : [...moments, ...moments]).map((m, i) => <View key={`${m.id}-${i}`} style={{ height: CELL, justifyContent: 'center' }}><Text style={{ textAlign: 'center', fontFamily: serif, fontSize: 34, lineHeight: 38, letterSpacing: -1.5, color: c.ink }}>{values(m)[index]}</Text></View>)}
    </Animated.View>
  </View>;
}
export function Roulette({ moments, onOpen }: { moments: Moment[]; onOpen: (m: Moment) => void }) {
  const [target, setTarget] = useState<Moment | null>(null);
  const [draw, setDraw] = useState(0);
  const [stops, setStops] = useState(0);
  const reduced = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const sun = useRef(new Animated.Value(0)).current;
  const lights = useRef(new Animated.Value(0)).current;
  const reveal = useRef(new Animated.Value(0)).current;
  const spin = () => { setStops(0); setTarget(moments[Math.floor(Math.random() * moments.length)] ?? null); setDraw(n => n + 1); };
  useEffect(() => {
    if (!target) return;
    reveal.setValue(0);
    sun.setValue(0);
    lights.setValue(0);
    const rotation = Animated.loop(Animated.timing(sun, { toValue: 1, duration: 22000, easing: Easing.linear, useNativeDriver: true }));
    const blink = Animated.loop(Animated.sequence([Animated.timing(lights, { toValue: 1, duration: 380, useNativeDriver: true }), Animated.timing(lights, { toValue: 0, duration: 380, useNativeDriver: true })]));
    if (!reduced) { rotation.start(); blink.start(); }
    const timers = [900, 1400, 1900].map((delay, i) => setTimeout(() => {
      setStops(i + 1);
      void feedback('selection');
      if (i === 2) {
        if (reduced) reveal.setValue(1);
        else Animated.spring(reveal, { toValue: 1, friction: 9, tension: 65, useNativeDriver: false }).start();
      }
    }, reduced ? 0 : delay));
    return () => { timers.forEach(clearTimeout); rotation.stop(); blink.stop(); reveal.stopAnimation(); };
  }, [draw, target, reduced, sun, lights, reveal]);
  return <>
    <Pressable accessibilityRole="button" disabled={!moments.length} accessibilityLabel="Surprends-moi, choisir une place au hasard" onPress={spin}>
      <Sticker spin shape="star" size={120}><Text style={{ fontFamily: serif, fontSize: 36, lineHeight: 38, color: c.ink }}>?</Text><Text style={{ fontFamily: serif, fontSize: 17, lineHeight: 18, color: c.ink, textAlign: 'center' }}>Surprends-moi</Text></Sticker>
    </Pressable>
    <Modal visible={!!target} animationType={reduced ? 'none' : 'fade'} onRequestClose={() => setTarget(null)}>
      <View accessibilityViewIsModal style={{ flex: 1, backgroundColor: c.blue, overflow: 'hidden' }}>
        <Animated.View pointerEvents="none" style={{ position: 'absolute', left: width / 2 - height, top: -height / 2, width: height * 2, height: height * 2, transform: [{ rotate: sun.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
          {Array.from({ length: 14 }, (_, i) => <View key={i} style={{ position: 'absolute', left: height - 36, top: 0, width: 72, height: height * 2, backgroundColor: c.yellow, opacity: 0.13, transform: [{ rotate: `${i * 180 / 14}deg` }] }} />)}
        </Animated.View>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-start', padding: 16, paddingTop: 48, paddingBottom: 36, gap: 18, width: '100%', maxWidth: 500, alignSelf: 'center' }}>
          <Animated.View style={{ gap: 18, marginTop: reveal.interpolate({ inputRange: [0, 1], outputRange: [Math.max(0, (height - 420) / 2), 0], extrapolate: 'clamp' }), transform: [{ scale: reveal.interpolate({ inputRange: [0, 1], outputRange: [1, 0.82] }) }] }}>
          <Text adjustsFontSizeToFit style={{ fontFamily: serif, fontSize: Math.min(35, (width - 48) / 10.8), color: c.light, textAlign: 'center' }}>LE GRAND TIRAGE</Text>
          <Text style={{ fontFamily: medium, color: c.light, textAlign: 'center' }}>{stops === 3 ? 'Paris vous garde une place.' : 'Trois rouleaux. Une soirée à saisir.'}</Text>
          <View style={{ padding: 18, paddingVertical: 24, backgroundColor: c.ink, borderRadius: 20, borderWidth: 6, borderColor: c.yellow, gap: 10 }}>
            {Array.from({ length: 20 }, (_, i) => <Animated.View key={i} style={{ position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: i % 2 ? c.pink : c.yellow, left: i < 10 ? `${3 + i * 10}%` : undefined, right: i >= 10 ? `${3 + (i - 10) * 10}%` : undefined, top: i < 10 ? 4 : undefined, bottom: i >= 10 ? 4 : undefined, opacity: reduced ? 1 : lights.interpolate({ inputRange: [0, 1], outputRange: i % 2 ? [0.35, 1] : [1, 0.35] }) }} />)}
            {(['left', 'right'] as const).map(side => <View key={side} pointerEvents="none" style={{ position: 'absolute', [side]: 3, top: 24, bottom: 24, justifyContent: 'space-around' }}>{[0, 1, 2].map(i => <Animated.View key={i} style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: c.yellow, opacity: reduced ? 1 : lights.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }} />)}</View>)}
            <View style={{ flexDirection: 'row', gap: 6 }}>{target && [0, 1, 2].map(i => <Reel key={`${draw}-${i}`} moments={moments} target={target} index={i} stopped={stops > i} />)}</View>
            <Text style={{ fontFamily: medium, fontSize: 10, color: c.light, textAlign: 'center' }}>CATÉGORIE · ARRONDISSEMENT · HEURE</Text>
          </View>
          </Animated.View>
          {stops === 3 && target && <Animated.View accessibilityLiveRegion="polite" style={{ opacity: reveal, transform: reduced ? [] : [{ translateY: reveal.interpolate({ inputRange: [0, 1], outputRange: [height, 0] }) }] }}>
            <Ticket compact m={target} />
            <Pressable accessibilityRole="button" onPress={() => { const current = moments.find(m => m.id === target.id); if (current) onOpen(current); setTarget(null); }} style={{ backgroundColor: c.yellow, padding: 18, marginTop: 12 }}><Text style={{ fontFamily: medium, color: c.ink, textAlign: 'center', fontSize: 18 }}>C’est mon billet ↗</Text></Pressable>
            <Pressable accessibilityRole="button" disabled={!moments.length} onPress={spin} style={{ padding: 16 }}><Text style={{ fontFamily: medium, color: c.light, textAlign: 'center', fontSize: 18 }}>Relancer</Text></Pressable>
          </Animated.View>}
          <Pressable accessibilityRole="button" onPress={() => setTarget(null)} style={{ padding: 10 }}><Text style={{ fontFamily: medium, color: c.light, textAlign: 'center' }}>Fermer le tirage</Text></Pressable>
        </ScrollView>
        {stops === 3 && target && <Confetti key={draw} category={target.category} />}
      </View>
    </Modal>
  </>;
}
