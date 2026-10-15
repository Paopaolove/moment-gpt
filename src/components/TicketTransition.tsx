import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
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
};
const Context = createContext<{
  open: (m: Moment, node: View | null) => void;
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
  const originId = useRef('');
  const detail = useRef<Rect | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const rootY = useRef(0);
  useEffect(() => {
    if(!flight?.to)
      return;
    progress.setValue(0);
    const animation = Animated.timing(progress, { toValue: 1, duration: reduced ? 180 : 460, useNativeDriver: true });
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
  const open = (m: Moment, node: View | null) => {
    if(!node || flight)
      return;
    node.measureInWindow((x, y, width, height) => {
      const rect = { x, y: y - rootY.current, width, height };
      origin.current = rect;
      originId.current = m.id;
      setFlight({ m, from: rect, returning: false });
      journey.setId(m.id);
      journey.go('detail');
    });
  };
  const back = () => {
    if(origin.current && detail.current && originId.current === journey.id)
      setFlight({ m: journey.m, from: detail.current, to: origin.current, returning: true });
    journey.go('list');
  };
  const from = flight?.from;
  const to = flight?.to ?? from;
  return <Context.Provider value={{ open, measure, back }}>
    <View ref={root} collapsable={false} style={{ flex: 1 }} onLayout={() => root.current?.measureInWindow((_x, y) => { rootY.current = y; })}>
      <View style={{ flex: 1, opacity: flight && !reduced ? 0 : 1 }}>{children}</View>
      {flight && from && to && <Animated.View pointerEvents="none" accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[s.overlay, {
        left: from.x, top: from.y, width: from.width, opacity: reduced ? progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 0.35, 0] }) : 1, transform: reduced ? [] : [
          { translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [0, to.x - from.x + (to.width - from.width) / 2] }) },
          { translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [0, to.y - from.y + (to.height - from.height) / 2] }) },
          { scaleX: progress.interpolate({ inputRange: [0, 1], outputRange: [1, to.width / from.width] }) },
          { scaleY: progress.interpolate({ inputRange: [0, 1], outputRange: [1, to.height / from.height] }) },
          { rotate: progress.interpolate({ inputRange: [0, 1], outputRange: flight.returning ? ['0deg', '-1deg'] : ['-1deg', '0deg'] }) }
        ]
      }]}><Ticket m={flight.m} /></Animated.View>}
    </View>
  </Context.Provider>;
}
export function MovingTicket({ m, detail = false, taken = 0, index = 0 }: {
  m: Moment;
  detail?: boolean;
  index?: number;
  taken?: number;
}) {
  const node = useRef<View>(null);
  const transition = useContext(Context);
  return <View ref={node} collapsable={false} onLayout={() => {
    if(detail)
      transition?.measure(node.current);
  }}><Ticket m={m} index={index} taken={taken} onPress={detail ? undefined : () => transition?.open(m, node.current)} /></View>;
}
export function TicketBack() {
  const transition = useContext(Context);
  return <TextBack label="← Les places" onPress={() => transition?.back()} />;
}
const s = StyleSheet.create({ overlay: { position: 'absolute', zIndex: 20 } });
