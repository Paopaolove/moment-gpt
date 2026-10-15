import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import { RULES, confirmationRemaining } from '../domain/rules';
import { colors, styles as s } from '../theme';
export function Countdown({ acceptedAt, now }: {
    acceptedAt: number;
    now: number;
}) {
    const seconds = confirmationRemaining(acceptedAt, now);
    const pulse = useRef(new Animated.Value(1)).current;
    const progress = useRef(new Animated.Value(seconds / (RULES.confirmationMinutes * 60))).current;
    useEffect(() => { Animated.sequence([Animated.timing(pulse, { toValue: .94, duration: 160, useNativeDriver: true }), Animated.spring(pulse, { toValue: 1, useNativeDriver: true })]).start(); Animated.timing(progress, { toValue: seconds / (RULES.confirmationMinutes * 60), duration: 700, useNativeDriver: true }).start(); }, [seconds, pulse, progress]);
    return <View style={{ gap: 20, alignItems: 'center', paddingVertical: 24 }}>
    <Text style={s.eyebrow}>Votre place vous attend</Text>
    <Animated.Text accessibilityLabel={`${Math.floor(seconds / 60)} minutes ${seconds % 60} secondes restantes`} style={[s.title, { fontSize: 76, lineHeight: 90, fontVariant: ['tabular-nums'], transform: [{ scale: pulse }] }]}>{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</Animated.Text>
    <View style={{ height: 4, width: '100%', backgroundColor: colors.line, overflow: 'hidden' }}>
    <Animated.View style={{ height: 4, backgroundColor: colors.accent, transform: [{ scaleX: progress }] }}/>
    </View>
    </View>;
}
