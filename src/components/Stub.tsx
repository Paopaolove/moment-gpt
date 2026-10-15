import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
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
      duration: reduced ? 0 : 750,
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
          outputRange: [-35, 8]
        })
      }, {
        translateX: tear.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 5]
        })
      }, {
        rotate: tear.interpolate({
          inputRange: [0, 1],
          outputRange: ['-1deg', '1.5deg']
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
