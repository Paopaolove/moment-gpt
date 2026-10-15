import { StyleSheet } from 'react-native';
export const colors = { paper: '#F7F1EA', card: '#FBF8F4', line: '#E7DFD6', accent: '#E37A55', ink: '#1C1917', muted: '#6F675E' };
export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper }, content: { padding: 24, paddingBottom: 40, gap: 20, width: '100%', maxWidth: 720, alignSelf: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }, wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  title: { fontFamily: 'serif', fontSize: 38, lineHeight: 44, color: colors.ink, fontWeight: '400' }, heading: { fontFamily: 'serif', fontSize: 25, color: colors.ink },
  text: { color: colors.ink, fontSize: 16, lineHeight: 24 }, muted: { color: colors.muted, fontSize: 14, lineHeight: 21 }, eyebrow: { color: colors.muted, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' },
  card: { backgroundColor: colors.card, borderColor: colors.line, borderWidth: 1, borderRadius: 16, padding: 20, gap: 12 },
  button: { minHeight: 50, borderWidth: 1, borderColor: colors.line, borderRadius: 12, paddingHorizontal: 18, paddingVertical: 12, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: colors.accent, borderColor: colors.accent }, buttonText: { color: colors.ink, fontSize: 15, fontWeight: '600' },
  chip: { borderWidth: 1, borderColor: colors.line, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 24 }, selected: { borderColor: colors.accent },
  input: { borderWidth: 1, borderColor: colors.line, borderRadius: 12, padding: 14, color: colors.ink, backgroundColor: colors.card, fontSize: 16, minHeight: 50 },
  divider: { borderTopWidth: 1, borderColor: colors.line, paddingTop: 16 }, notice: { borderLeftWidth: 2, borderLeftColor: colors.accent, paddingLeft: 14, gap: 6 }
});
