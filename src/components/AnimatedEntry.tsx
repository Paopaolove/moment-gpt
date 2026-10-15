import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated } from 'react-native';
export function AnimatedEntry({ children, index = 0 }: {
    children: React.ReactNode;
    index?: number;
}) {
    const progress = useRef(new Animated.Value(0)).current;
    useEffect(() => { let active = true; AccessibilityInfo.isReduceMotionEnabled().then(reduce => { if (active)
        Animated.timing(progress, { toValue: 1, duration: reduce ? 0 : 520, delay: reduce ? 0 : index * 95, useNativeDriver: true }).start(); }); return () => { active = false; progress.stopAnimation(); }; }, [progress, index]);
    return <Animated.View style={{ opacity: progress, transform: [{ translateY: progress.interpolate({ inputRange: [0, 1], outputRange: [24, 0] }) }] }}>{children}</Animated.View>;
}
