import { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';
import { colors } from '../theme';
import { PressableScale } from './PressableScale';
export function Pill({ title, selected = false, onPress }: {
    title: string;
    selected?: boolean;
    onPress: () => void;
}) {
    const p = useRef(new Animated.Value(selected ? 1 : 0)).current;
    useEffect(() => { Animated.spring(p, { toValue: selected ? 1 : 0, useNativeDriver: true }).start(); }, [selected, p]);
    return <PressableScale onPress={onPress} accessibilityState={{ selected }} style={{ borderRadius: 30, borderWidth: 1, borderColor: selected ? colors.ink : colors.line, overflow: 'hidden', paddingHorizontal: 18, paddingVertical: 13 }}>
    <Animated.View pointerEvents="none" style={{ position: 'absolute', inset: 0, backgroundColor: colors.ink, opacity: p }}/>
    <Text style={{ fontSize: 13, color: selected ? colors.paper : colors.muted }}>{title}</Text>
    </PressableScale>;
}
