import { Text, View } from 'react-native';
import { colors, styles as s } from '../theme';
export function Header({ title, subtitle, eyebrow = 'Paris, à portée de table' }: {
    title: string;
    subtitle?: string;
    eyebrow?: string;
}) {
    return <View style={{ gap: 18 }}>
    <Text style={[s.eyebrow, { color: colors.accent }]}>{eyebrow}</Text>
    <Text accessibilityRole="header" style={s.title}>{title}</Text>{subtitle && <Text style={[s.muted, { maxWidth: 440 }]}>{subtitle}</Text>}</View>;
}
