import React, { useEffect, useRef } from 'react';
import { AccessibilityInfo, Animated, Pressable, ScrollView, Text, TextInput, View, type TextInputProps } from 'react-native';
import { styles as s, colors } from '../theme';
export function Fade({ children }: { children: React.ReactNode }) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => { let live = true; AccessibilityInfo.isReduceMotionEnabled().then(reduced => { if (live) Animated.timing(opacity, { toValue: 1, duration: reduced ? 0 : 380, useNativeDriver: true }).start(); }); return () => { live = false; opacity.stopAnimation(); }; }, [opacity]);
  return <Animated.View style={{ opacity, gap: 26 }}>{children}</Animated.View>;
}
export function Page({ children }: { children: React.ReactNode }) { return <ScrollView style={s.page} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled"><Fade>{children}</Fade></ScrollView>; }
export function Button({ title, onPress, primary = false, disabled = false }: { title: string; onPress: () => void; primary?: boolean; disabled?: boolean }) { return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, primary && s.primary, { opacity: disabled ? .4 : pressed ? .72 : 1, transform: [{ scale: pressed ? .985 : 1 }] }]}><Text style={[s.buttonText, primary && { color: colors.paper }]}>{title}</Text></Pressable>; }
export function Chip({ title, selected, onPress }: { title: string; selected?: boolean; onPress: () => void }) { return <Pressable accessibilityRole="button" accessibilityState={{ selected: !!selected }} onPress={onPress} style={({ pressed }) => [s.chip, selected && s.selected, { opacity: pressed ? .55 : 1 }]}><Text style={{ color: selected ? colors.ink : colors.muted, fontSize: 13 }}>{title}</Text></Pressable>; }
export function Field({ label, ...props }: TextInputProps & { label: string }) { return <View style={{ gap: 4 }}><Text style={s.eyebrow}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor={colors.muted} {...props} style={[s.input, props.style]} /></View>; }
export function Notice({ children }: { children: React.ReactNode }) { return <View style={s.notice}><Text accessibilityLiveRegion="polite" style={s.muted}>{children}</Text></View>; }
export function Header({ title, subtitle, eyebrow = 'Paris, à taille humaine' }: { title: string; subtitle: string; eyebrow?: string }) { return <View style={{ gap: 16 }}><Text style={s.eyebrow}>{eyebrow}</Text><Text accessibilityRole="header" style={s.title}>{title}</Text><Text style={[s.muted, { maxWidth: 390 }]}>{subtitle}</Text></View>; }
