import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { Category } from '../domain/rules';
import { categoryColor, c } from '../theme/tokens';
import { Perforation } from './Perforation';
import { PaperContext } from './Primitives';
import { useReducedMotion } from './useReducedMotion';
export function Stub({ children, category }: {
  children: React.ReactNode;
  category?: Category;
}) {
  const reduced = useReducedMotion();
  const tear = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    tear.setValue(0);
    const animation = Animated.timing(tear, {
      toValue: 1,
      duration: reduced ? 350 : 420,
      delay: reduced ? 0 : 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    });
    animation.start();
    return () => animation.stop();
  }, [tear, reduced]);
  return <PaperContext.Provider value>
    <Animated.View style={[s.stub, category && { backgroundColor: categoryColor[category] }, {
      opacity: tear,
      transform: reduced ? [] : [{
        translateY: tear.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 16]
        })
      }, {
        translateX: tear.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 2]
        })
      }, {
        rotate: tear.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '2.5deg']
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
    padding: 16,
    gap: 10,
    marginBottom: 12
  }
});
