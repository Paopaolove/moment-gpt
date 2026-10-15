import { Pressable, StyleSheet, Text } from 'react-native';
import { c, sans } from '../theme/tokens';
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
    fontFamily: sans,
    fontSize: 14,
    lineHeight: 21,
    textDecorationLine: 'underline'
  }
});
