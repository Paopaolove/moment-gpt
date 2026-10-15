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
  flyingId?: string;
  featured: boolean;
  now: number;
  measure: (node: View | null) => void;
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
  const [flight, setFlight] = useState<Flight | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const rootY = useRef(0);
  useEffect(() => {
    if(!flight?.to)
      return;
    progress.setValue(0);
    const animation = Animated.timing(progress, { toValue: 1, duration: reduced ? 0 : 400, easing: Easing.out(Easing.cubic), useNativeDriver: true });
    animation.start(({ finished }) => {
      if(finished)
        setFlight(null);
    });
    return () => animation.stop();
  }, [flight, reduced, progress]);
  const measure = (node: View | null) => node?.measureInWindow((x, y, width, height) => {
    if(!width || !height)
      return;
    const rect = { x, y: y - rootY.current, width, height };
    detail.current = rect;
    setFlight(current => current && !current.returning && !current.to ? { ...current, to: rect } : current);
  });
  const open = (m: Moment, node: View | null, index: number, featured: boolean) => {
    if(!node || flight)
      return;
    node.measureInWindow((x, y, width, height) => {
      const rect = { x, y: y - rootY.current, width, height };
      origin.current = rect;
      originId.current = m.id;
      originIndex.current = index;
      progress.setValue(0);
      setFlight({ m, from: rect, returning: false, index, featured });
      selectedFeatured.current = featured;
      journey.setId(m.id);
      journey.go('detail');
    });
  };
  const back = () => {
    progress.setValue(0);
    if(origin.current && detail.current && originId.current === journey.id)
      setFlight({ m: journey.m, from: detail.current, to: origin.current, returning: true, index: originIndex.current, featured: selectedFeatured.current });
    journey.go('list');
  };
  const from = flight?.from;
  const to = flight?.to ?? from;
  return <Context.Provider value={{ open, measure, back, hidden: !!flight, flyingId: flight?.m.id, featured: originId.current === journey.id && selectedFeatured.current, now: journey.store.now }}>
    <View ref={root} collapsable={false} style={{ flex: 1 }} onLayout={() => root.current?.measureInWindow((_x, y) => { rootY.current = y; })}>
      <View style={{ flex: 1, opacity: 1 }}>{children}</View>
      {flight && from && to && <Animated.View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[s.overlay, {
        left: to.x, top: to.y, width: to.width, opacity: reduced ? progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.35, 0] }) : 1, transform: reduced ? [] : [
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
    if(detail)
      transition?.measure(node.current);
  }}><Ticket m={m} now={now ?? transition?.now} featured={detail ? transition?.featured : featured} index={index} taken={taken} onPress={detail ? undefined : () => transition?.open(m, node.current, index, featured)} /></View>;
}
export function TicketBack() {
  const transition = useContext(Context);
  return <TextBack label="← Les places" onPress={() => transition?.back()} />;
}
const s = StyleSheet.create({ overlay: { position: 'absolute', zIndex: 20 } });
