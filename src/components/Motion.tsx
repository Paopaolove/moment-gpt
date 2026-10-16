import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleProp, ViewStyle } from 'react-native';
export function Motion({ children, style, accessibilityViewIsModal }: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  accessibilityViewIsModal?: boolean;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    let mounted = true;
    let animation: Animated.CompositeAnimation | undefined;
    const finish = () => {
      animation?.stop();
      opacity.setValue(1);
    };
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', reduced => {
      if(reduced)
        finish();
    });
    void AccessibilityInfo.isReduceMotionEnabled().then(reduced => {
      if(!mounted)
        return;
      if(reduced) {
        finish();
        return;
      }
      animation = Animated.timing(opacity, {
        toValue: 1,
        duration: 240,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true
      });
      animation.start();
    });
    return () => {
      mounted = false;
      animation?.stop();
      subscription.remove();
    };
  }, [opacity]);
  return <Animated.View
    accessibilityViewIsModal={accessibilityViewIsModal}
    style={[
      style,
      { opacity, transform: [{ translateY: opacity.interpolate({ inputRange: [0, 1], outputRange: [8, 0] }) }] }
    ]}>{children}</Animated.View>;
}
