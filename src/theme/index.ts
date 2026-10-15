import { Platform, StyleSheet } from 'react-native';
export const colors = { paper: '#F5F1E9', card: '#F5F1E9', line: '#DCD5C9', accent: '#A43D2D', ink: '#252821', muted: '#686B61' };
export const serif = Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia, serif' });
export const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.paper }, content: { padding: 26, paddingTop: 30, paddingBottom: 48, gap: 26, width: '100%', maxWidth: 680, alignSelf: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }, wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  title: { fontFamily: serif, fontSize: 49, lineHeight: 53, letterSpacing: -2, color: colors.ink }, heading: { fontFamily: serif, fontSize: 29, lineHeight: 35, letterSpacing: -.6, color: colors.ink },
  text: { color: colors.ink, fontSize: 16, lineHeight: 25 }, muted: { color: colors.muted, fontSize: 14, lineHeight: 22 }, eyebrow: { color: colors.muted, fontSize: 10, lineHeight: 16, letterSpacing: 2, textTransform: 'uppercase', fontWeight: '600' },
  card: { borderTopColor: colors.line, borderTopWidth: 1, paddingVertical: 24, gap: 14 },
  button: { minHeight: 54, borderWidth: 1, borderColor: colors.line, borderRadius: 4, paddingHorizontal: 20, paddingVertical: 15, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: colors.accent, borderColor: colors.accent }, buttonText: { color: colors.ink, fontSize: 14, fontWeight: '600', letterSpacing: .3 },
  chip: { borderWidth: 1, borderColor: colors.line, paddingHorizontal: 17, paddingVertical: 11, borderRadius: 30 }, selected: { borderColor: colors.ink },
  input: { borderBottomWidth: 1, borderColor: colors.line, borderRadius: 0, paddingVertical: 14, color: colors.ink, fontSize: 17, minHeight: 52 },
  divider: { borderTopWidth: 1, borderColor: colors.line, paddingTop: 18 }, notice: { borderLeftWidth: 1, borderLeftColor: colors.accent, paddingLeft: 16, gap: 6 },
});
