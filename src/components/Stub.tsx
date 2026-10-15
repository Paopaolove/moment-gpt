import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { c } from '../theme/tokens';
import { Perforation } from './Perforation';
import { PaperContext } from './Primitives';
import { useReducedMotion } from './useReducedMotion';
export function Stub({ children }: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const tear = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    tear.setValue(reduced ? 1 : 0);
    const animation = Animated.timing(tear, {
      toValue: 1,
      duration: reduced ? 0 : 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    });
    animation.start();
    return () => animation.stop();
  }, [tear, reduced]);
  return <PaperContext.Provider value>
    <Animated.View style={[s.stub, {
      transform: [{
        translateY: tear.interpolate({
          inputRange: [0, 1],
          outputRange: [-35, 0]
        })
      }, {
        translateX: tear.interpolate({
          inputRange: [0, 1],
          outputRange: [-8, 0]
        })
      }, {
        rotate: tear.interpolate({
          inputRange: [0, 1],
          outputRange: ['-3deg', '0deg']
        })
      }]
    }]}>
      <Perforation />
      {children}
    </Animated.View>
  </PaperContext.Provider>;
}
const s = StyleSheet.create({
  stub: {
    backgroundColor: c.card,
    padding: 22,
    gap: 10,
    marginBottom: 12
  }
});
