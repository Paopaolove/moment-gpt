import { Pressable, StyleSheet, Text } from 'react-native';
import { c, medium, sans } from '../theme/tokens';
export function Action({ label, onPress, disabled = false }: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return <Pressable accessibilityRole="button" disabled={disabled} accessibilityState={{
    disabled
  }} onPress={onPress} style={[s.action, disabled && s.disabled]}>
    <Text style={s.actionText}>{label} ↗</Text>
  </Pressable>;
}
const s = StyleSheet.create({
  action: {
    backgroundColor: c.yellow,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: c.ink,
    minHeight: 58,
    padding: 18,
    justifyContent: 'center'
  },
  disabled: {
    backgroundColor: c.line
  },
  actionText: {
    color: c.ink,
    fontWeight: '700',
    fontFamily: medium,
    fontSize: 16,
    textAlign: 'center'
  }
});
