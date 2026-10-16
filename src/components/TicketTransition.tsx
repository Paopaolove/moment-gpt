import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { Moment } from '../domain/rules';
import { Journey } from '../useJourney';
import { Link as TextBack } from './Link';
import { Ticket } from './Ticket';
import { useReducedMotion } from './useReducedMotion';
type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};
type Flight = {
  m: Moment;
  from: Rect;
  to?: Rect;
  returning: boolean;
  index: number;
  featured: boolean;
};
const Context = createContext<{
  open: (m: Moment, node: View | null, index: number, featured: boolean) => void;
  hidden: boolean;
  fallback: boolean;
  flyingId?: string;
  featured: boolean;
  now: number;
  measure: (node: View | null, detail: boolean, id: string) => void;
  back: () => void;
} | null>(null);
export function TicketTransitions({ journey, children }: {
  journey: Journey;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  const root = useRef<View>(null);
  const origin = useRef<Rect | null>(null);
  const selectedFeatured = useRef(false);
  const originIndex = useRef(0);
  const originId = useRef('');
  const detail = useRef<Rect | null>(null);
  const [fallback, setFallback] = useState(false);
  const [flight, setFlight] = useState<Flight | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const rootY = useRef(0);
  const rootX = useRef(0);
  const rootHeight = useRef(0);
  const valid = (rect: Rect) => [rect.x, rect.y, rect.width, rect.height].every(Number.isFinite) && rect.width > 0 && rect.height > 0 && rect.y >= 54 && rect.y < rootHeight.current - 60;
  useEffect(() => {
    if (!flight || flight.to) return;
    // A missing onLayout/measurement must never leave an invisible ticket behind.
    const timeout = setTimeout(() => { setFallback(true); setFlight(null); }, 250);
    return () => clearTimeout(timeout);
  }, [flight]);
  useEffect(() => {
    if (journey.page !== 'detail' && journey.page !== 'list') setFlight(null);
  }, [journey.page]);
  useEffect(() => {
    if(!flight?.to)
      return;
    progress.setValue(0);
    const animation = Animated.timing(progress, { toValue: 1, duration: reduced ? 250 : 400, easing: Easing.out(Easing.cubic), useNativeDriver: true });
    animation.start(({ finished }) => {
      if(finished)
        setFlight(null);
    });
    return () => animation.stop();
  }, [flight, reduced, progress]);
  const measure = (node: View | null, isDetail: boolean, id: string) => {
    // onLayout may fire before the ScrollView has applied its new content offset.
    requestAnimationFrame(() => requestAnimationFrame(() => node?.measureInWindow((x, y, width, height) => {
      const rect = { x: x - rootX.current, y: y - rootY.current, width, height };
      if (isDetail) detail.current = rect;
      setFlight(current => {
        if (!current || current.to || current.m.id !== id || current.returning === isDetail) return current;
        if (valid(rect)) return { ...current, to: rect };
        return current; // The timeout below provides the fade/slide fallback.
      });
    })));
  };
  const open = (m: Moment, node: View | null, index: number, featured: boolean) => {
    if (flight) return;
    const navigate = (rect?: Rect) => {
      setFallback(!rect || !valid(rect));
      origin.current = rect ?? null;
      detail.current = null;
      originId.current = m.id;
      originIndex.current = index;
      selectedFeatured.current = featured;
      progress.setValue(0);
      setFlight(rect && valid(rect) ? { m, from: rect, returning: false, index, featured } : null);
      journey.setId(m.id);
      journey.go('detail');
    };
    if (!node) { navigate(); return; }
    let measured = false;
    const timeout = setTimeout(() => { if (!measured) { measured = true; navigate(); } }, 150);
    node.measureInWindow((x, y, width, height) => {
      if (measured) return;
      measured = true;
      clearTimeout(timeout);
      navigate({ x: x - rootX.current, y: y - rootY.current, width, height });
    });
  };
  const back = () => {
    setFallback(!origin.current || !detail.current || !valid(detail.current));
    progress.setValue(0);
    if (origin.current && detail.current && valid(detail.current) && originId.current === journey.id)
      setFlight({ m: journey.m, from: detail.current, returning: true, index: originIndex.current, featured: selectedFeatured.current });
    journey.go('list');
  };
  const from = flight?.from;
  const to = flight?.to ?? from;
  return <Context.Provider value={{ open, measure, back, fallback, hidden: !!flight, flyingId: flight?.m.id, featured: originId.current === journey.id && selectedFeatured.current, now: journey.store.now }}>
    <View ref={root} collapsable={false} style={{ flex: 1 }} onLayout={() => root.current?.measureInWindow((x, y, _width, height) => { rootX.current = x; rootY.current = y; rootHeight.current = height; })}>
      <View style={{ flex: 1, opacity: 1 }}>{children}</View>
      {flight && from && to && <Animated.View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[s.overlay, {
        left: to.x, top: to.y, width: to.width, height: to.height, opacity: reduced ? progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.35, 0] }) : 1, transform: reduced ? [] : [
          { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [from.x - to.x + (from.width - to.width) / 2, 0] }) },
          { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [from.y - to.y + (from.height - to.height) / 2, 0] }) },
          { scaleX: progress.interpolate({ inputRange: [0, 1], outputRange: [from.width / to.width, 1] }) },
          { scaleY: progress.interpolate({ inputRange: [0, 1], outputRange: [from.height / to.height, 1] }) },
          { rotate: progress.interpolate({ inputRange: [0, 1], outputRange: flight.returning ? ['0deg', flight.index % 2 === 0 ? '-1.2deg' : '0.8deg'] : [flight.index % 2 === 0 ? '-1.2deg' : '0.8deg', '0deg'] }) }
        ]
      }]}><Ticket taken={journey.store.bookings.filter(b => b.momentId === flight.m.id && ['confirmed', 'present'].includes(b.status)).length} m={flight.m} now={journey.store.now} featured={flight.featured} /></Animated.View>}
    </View>
  </Context.Provider>;
}
export function MovingTicket({ m, detail = false, taken = 0, index = 0, now, featured = false }: {
  m: Moment;
  now?: number;
  featured?: boolean;
  detail?: boolean;
  index?: number;
  taken?: number;
}) {
  const node = useRef<View>(null);
  const transition = useContext(Context);
  return <View style={{ opacity: transition?.hidden && transition.flyingId === m.id ? 0 : 1 }} ref={node} collapsable={false} onLayout={() => {
    transition?.measure(node.current, detail, m.id);
  }}><Ticket m={m} now={now ?? transition?.now} featured={detail ? transition?.featured : featured} index={index} taken={taken} onPress={detail ? undefined : () => transition?.open(m, node.current, index, featured)} /></View>;
}
export function TicketBack() {
  const transition = useContext(Context);
  return <TextBack label="← Les places" onPress={() => transition?.back()} />;
}
const s = StyleSheet.create({ overlay: { position: 'absolute', zIndex: 20 } });

export function TicketScreenEntrance({ children }: { children: ReactNode }) {
  const transition = useContext(Context);
  const reduced = useReducedMotion();
  const slide = useRef(!transition?.hidden).current || transition?.fallback;
  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    enter.setValue(0);
    const animation = Animated.timing(enter, { toValue: 1, duration: reduced ? 250 : 400, easing: Easing.out(Easing.cubic), useNativeDriver: true });
    animation.start();
    return () => animation.stop();
  }, [enter, reduced, transition?.fallback]);
  return <Animated.View style={{ opacity: enter, transform: [{ translateY: slide && !reduced ? enter.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) : 0 }] }}>{children}</Animated.View>;
}
