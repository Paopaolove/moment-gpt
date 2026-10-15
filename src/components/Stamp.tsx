import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { c, sans } from '../theme/tokens';
import { feedback } from './haptics';
import { useReducedMotion } from './useReducedMotion';
export function Stamp({ label = 'RÉSERVÉ' }: {
  label?: string;
}) {
  const reduced = useReducedMotion();
  const hit = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if(label === 'ACCEPTÉ' || label === 'RÉSERVÉ')
      void feedback('stamp');
    hit.setValue(reduced ? 1 : 0);
    const animation = Animated.spring(hit, {
      toValue: 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true
    });
    animation.start();
    return () => animation.stop();
  }, [hit, reduced, label]);
  return <Animated.View style={[s.stamp, {
    opacity: hit,
    transform: [{
      scale: hit.interpolate({
        inputRange: [0, 1],
        outputRange: [1.6, 1]
      })
    }, {
      rotate: hit.interpolate({
        inputRange: [0, 1],
        outputRange: ['-22deg', '-8deg']
      })
    }]
  }]}>
    <Text style={s.text}>{label}</Text>
  </Animated.View>;
}
const s = StyleSheet.create({
  stamp: {
    alignSelf: 'flex-end',
    borderWidth: 3,
    borderColor: c.muted,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 8
  },
  text: {
    fontFamily: sans,
    fontSize: 23,
    letterSpacing: 3,
    fontWeight: '800',
    color: c.muted
  }
});
