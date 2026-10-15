import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useReducedMotion } from './useReducedMotion';
export function PressableScale({
  children,
  style,
  disabled,
  onPressIn,
  onPressOut,
  ...props
}: Omit<PressableProps, 'style' | 'children'> & {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  const animate = (toValue: number) => {
    scale.stopAnimation();
    if (reduced) {
      scale.setValue(1);
      return;
    }
    Animated.spring(scale, {
      toValue,
      speed: 32,
      bounciness: 5,
      useNativeDriver: true,
    }).start();
  };
  return (
    <Animated.View
      style={{
        transform: [
          {
            scale,
          },
        ],
        opacity: disabled ? 0.4 : 1,
      }}
    >
      <Pressable
        {...props}
        disabled={disabled}
        accessibilityRole={props.accessibilityRole ?? 'button'}
        accessibilityState={{
          ...props.accessibilityState,
          disabled: !!disabled,
        }}
        onPressIn={(event) => {
          animate(0.97);
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          animate(1);
          onPressOut?.(event);
        }}
        style={[local.target, style]}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
const local = StyleSheet.create({
  target: {
    minHeight: 44,
    justifyContent: 'center',
  },
});
