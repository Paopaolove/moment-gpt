import { StyleSheet, Text, View } from 'react-native';
import { colors, serif } from '../theme';

type StatePanelProps = {
  title: string;
  body: string;
  detail?: string;
  tone?: 'quiet' | 'attention' | 'success';
};

/** A non-actionable state: the screen keeps ownership of its single primary CTA. */
export function StatePanel({ title, body, detail, tone = 'quiet' }: StatePanelProps) {
  return (
    <View style={[local.panel, tone === 'attention' && local.attention]}>
      <Text style={[local.symbol, tone === 'success' && local.success]}>
        {tone === 'attention' ? '↗' : tone === 'success' ? '✓' : '◌'}
      </Text>
      <Text
        accessibilityRole="header"
        style={local.title}
      >
        {title}
      </Text>
      <Text
        accessibilityLiveRegion="polite"
        style={local.body}
      >
        {body}
      </Text>
      {detail && <Text style={local.detail}>{detail}</Text>}
    </View>
  );
}

const local = StyleSheet.create({
  panel: {
    padding: 28,
    borderRadius: 24,
    backgroundColor: colors.card,
    gap: 16,
  },
  attention: {
    borderWidth: 1,
    borderColor: colors.accent,
  },
  symbol: {
    color: colors.accent,
    fontSize: 35,
  },
  success: {
    color: colors.olive,
  },
  title: {
    fontFamily: serif,
    color: colors.ink,
    fontSize: 28,
    lineHeight: 34,
  },
  body: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 25,
  },
  detail: {
    borderTopWidth: 1,
    borderColor: colors.line,
    paddingTop: 16,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 21,
  },
});
