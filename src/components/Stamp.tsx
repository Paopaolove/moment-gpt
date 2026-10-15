import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { c } from '../theme/tokens';
import { useReducedMotion } from './useReducedMotion';
export function Stamp() {
  const reduced = useReducedMotion();
  const hit = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    hit.setValue(reduced ? 1 : 0);
    const animation = Animated.spring(hit, {
      toValue: 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true
    });
    animation.start();
    return () => animation.stop();
  }, [hit, reduced]);
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
    <Text style={s.text}>RÉSERVÉ</Text>
  </Animated.View>;
}
const s = StyleSheet.create({
  stamp: {
    alignSelf: 'flex-end',
    borderWidth: 3,
    borderColor: c.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 8
  },
  text: {
    fontSize: 23,
    letterSpacing: 3,
    fontWeight: '800',
    color: '#A63215'
  }
});
