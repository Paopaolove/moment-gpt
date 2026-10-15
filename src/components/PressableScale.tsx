import React, { useRef } from 'react';
import { Animated, Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
export function PressableScale({ children, style, disabled, ...props }: Omit<PressableProps, 'style' | 'children'> & {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}) {
    const scale = useRef(new Animated.Value(1)).current;
    const animate = (toValue: number) => Animated.spring(scale, { toValue, speed: 32, bounciness: 5, useNativeDriver: true }).start();
    return <Animated.View style={{ transform: [{ scale }], opacity: disabled ? .4 : 1 }}>
    <Pressable {...props} disabled={disabled} accessibilityRole={props.accessibilityRole ?? 'button'} accessibilityState={{ ...props.accessibilityState, disabled: !!disabled }} onPressIn={() => animate(.96)} onPressOut={() => animate(1)} style={[{ minHeight: 44, justifyContent: 'center' }, style]}>{children}</Pressable>
    </Animated.View>;
}
