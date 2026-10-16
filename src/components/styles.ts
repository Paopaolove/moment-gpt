import { StyleSheet } from 'react-native';
import { colors as c } from '../theme/tokens';
export const s = StyleSheet.create({
  text: {
    fontFamily: 'InterTight_400Regular',
    fontSize: 17,
    lineHeight: 25,
    color: c.text
  },
  muted: { color: c.secondary },
  title: {
    fontFamily: 'InterTight_600SemiBold',
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: -.6
  },
  large: {
    fontFamily: 'InterTight_700Bold',
    fontSize: 34,
    lineHeight: 41,
    letterSpacing: -1
  },
  h: {
    fontFamily: 'InterTight_600SemiBold', fontSize: 17, lineHeight: 24
  },
  card: {
    padding: 20,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 20,
    backgroundColor: c.background,
    gap: 12
  },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12
  },
  between: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12
  },
  input: {
    fontFamily: 'InterTight_400Regular',
    fontSize: 17,
    color: c.text,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 12,
    minHeight: 48,
    padding: 12,
    backgroundColor: c.background
  },
  stack: { gap: 16 },
  section: { gap: 12, marginTop: 12 }
});
