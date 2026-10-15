import React from 'react';
import { ScrollView, Text, TextInput, View, type TextInputProps } from 'react-native';
import { colors, styles as s } from '../theme';
import { AnimatedEntry } from './AnimatedEntry';
export function Page({ children }: {
    children: React.ReactNode;
}) { return <ScrollView style={s.page} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">{React.Children.toArray(children).map((child, i) => <AnimatedEntry key={i} index={Math.min(i, 5)}>{child}</AnimatedEntry>)}</ScrollView>; }
export function Field({ label, ...props }: TextInputProps & {
    label: string;
}) {
    return <View style={{ gap: 5 }}>
    <Text style={s.eyebrow}>{label}</Text>
    <TextInput {...props} accessibilityLabel={label} placeholderTextColor={colors.muted} style={[s.input, props.style]}/>
    </View>;
}
export function Notice({ children }: {
    children: React.ReactNode;
}) {
    return <View style={{ borderLeftWidth: 2, borderColor: colors.accent, paddingLeft: 16 }}>
    <Text accessibilityLiveRegion="polite" style={s.muted}>{children}</Text>
    </View>;
}
export function Section({ label, value }: {
    label: string;
    value: string;
}) {
    return <View style={[s.row, s.divider]}>
    <Text style={s.muted}>{label}</Text>
    <Text style={s.text}>{value}</Text>
    </View>;
}
