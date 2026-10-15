import { StyleSheet, Text, View } from 'react-native';
import { colors, serif } from '../theme';
export function Header({
  title,
  subtitle,
  eyebrow = 'Paris, à portée de table',
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
}) {
  return (
    <View style={local.header}>
      <View style={local.kicker}>
        <View style={local.rule} />
        <Text style={local.eyebrow}>{eyebrow}</Text>
      </View>
      <Text
        accessibilityRole="header"
        style={local.title}
      >
        {title}
      </Text>
      {subtitle && <Text style={local.subtitle}>{subtitle}</Text>}
    </View>
  );
}
const local = StyleSheet.create({
  header: {
    gap: 22,
    paddingVertical: 8,
  },
  kicker: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rule: {
    width: 20,
    height: 1,
    backgroundColor: colors.accent,
  },
  eyebrow: {
    fontSize: 9,
    lineHeight: 17,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: colors.accent,
    flexShrink: 1,
  },
  title: {
    fontFamily: serif,
    fontSize: 44,
    lineHeight: 50,
    letterSpacing: -1.7,
    color: colors.ink,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 27,
    color: colors.muted,
    maxWidth: 480,
  },
});
