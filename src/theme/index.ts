import { Platform, StyleSheet } from 'react-native';
export const colors = {
  paper: '#F6F1E8',
  card: '#EEE6D9',
  line: '#DCD1C1',
  accent: '#A44832',
  ink: '#292F29',
  muted: '#696B60',
  white: '#FFFBF5',
  olive: '#697254',
};
export const space = {
  xs: 6,
  sm: 12,
  md: 20,
  lg: 28,
  xl: 40,
  xxl: 64,
};
export const serif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia',
});
export const type = {
  display: 52,
  title: 34,
  heading: 24,
  body: 16,
  caption: 12,
};
export const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    padding: space.lg,
    paddingBottom: 48,
    gap: 28,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  title: {
    fontFamily: serif,
    fontSize: type.display,
    lineHeight: 56,
    letterSpacing: -2,
    color: colors.ink,
  },
  heading: {
    fontFamily: serif,
    fontSize: type.heading,
    lineHeight: 31,
    color: colors.ink,
  },
  text: {
    fontSize: type.body,
    lineHeight: 25,
    color: colors.ink,
  },
  muted: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.muted,
  },
  eyebrow: {
    fontSize: 10,
    lineHeight: 16,
    letterSpacing: 2,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: colors.muted,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    gap: 18,
    backgroundColor: colors.card,
  },
  divider: {
    borderTopWidth: 1,
    borderColor: colors.line,
    paddingTop: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: colors.line,
    paddingVertical: 14,
    fontSize: 17,
    color: colors.ink,
    minHeight: 52,
  },
});
