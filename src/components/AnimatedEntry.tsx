import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useReducedMotion } from './useReducedMotion';
export function AnimatedEntry({
  children,
  index = 0,
}: {
  children: React.ReactNode;
  index?: number;
}) {
  const progress = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      progress.setValue(1);
      return;
    }
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 420,
      delay: Math.min(index, 4) * 65,
      useNativeDriver: true,
    }).start();
    return () => progress.stopAnimation();
  }, [progress, index, reduced]);
  return (
    <Animated.View
      style={{
        opacity: progress,
        transform: [
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 0],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}
