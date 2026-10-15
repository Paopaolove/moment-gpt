import { Pressable, StyleSheet, Text } from 'react-native';
import { c, medium, sans } from '../theme/tokens';
export function Link({ label, onPress }: {
  label: string;
  onPress: () => void;
}) {
  return <Pressable accessibilityRole="button" onPress={onPress} style={s.link}>
    <Text style={s.linkText}>
      {label}
    </Text>
  </Pressable>;
}
const s = StyleSheet.create({
  link: {
    paddingVertical: 12
  },
  linkText: {
    color: c.light,
    fontFamily: medium,
    fontSize: 14,
    lineHeight: 21,
    textDecorationLine: 'underline'
  }
});
