import { StyleSheet, Text, TextInput, View } from 'react-native';
import { c, sans } from '../theme/tokens';
export function Input({ label, value, set, keyboardType = 'default' }: {
  label: string;
  value: string;
  set: (value: string) => void;
  keyboardType?: 'default' | 'numeric';
}) {
  return <View style={s.field}>
    <Text style={s.label}>
      {label}
    </Text>
    <TextInput accessibilityLabel={label} value={value} onChangeText={set} keyboardType={keyboardType} style={s.input} />
  </View>;
}
const s = StyleSheet.create({
  field: {
    gap: 8
  },
  label: {
    color: c.light,
    fontFamily: sans,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 1
  },
  input: {
    backgroundColor: c.card,
    color: c.ink,
    padding: 16,
    fontFamily: sans,
    fontSize: 16,
    borderWidth: 1,
    borderColor: c.line
  }
});
