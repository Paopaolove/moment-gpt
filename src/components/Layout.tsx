import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { colors } from '../theme';
import { AnimatedEntry } from './AnimatedEntry';
export function Page({ children }: { children: React.ReactNode }) {
  return (
    <ScrollView
      style={local.page}
      contentContainerStyle={local.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {React.Children.toArray(children).map((child, i) => (
        <AnimatedEntry
          key={i}
          index={Math.min(i, 4)}
        >
          {child}
        </AnimatedEntry>
      ))}
      <View style={local.signature}>
        <View style={local.signatureLine} />
        <Text style={local.signatureText}>MOMENT · LA VIE, AUTOUR D’UNE TABLE</Text>
      </View>
    </ScrollView>
  );
}
export function Field({
  label,
  style,
  ...props
}: TextInputProps & {
  label: string;
}) {
  return (
    <View style={local.field}>
      <Text style={local.label}>{label}</Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        style={[local.input, props.multiline && local.multiline, style]}
      />
    </View>
  );
}
export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <View style={local.notice}>
      <Text
        accessibilityLiveRegion="polite"
        style={local.noticeText}
      >
        {children}
      </Text>
    </View>
  );
}
export function Section({ label, value }: { label: string; value: string }) {
  return (
    <View style={local.section}>
      <Text style={local.sectionLabel}>{label}</Text>
      <Text style={local.sectionValue}>{value}</Text>
    </View>
  );
}
const local = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  content: {
    padding: 28,
    paddingTop: 32,
    paddingBottom: 48,
    gap: 28,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  field: {
    gap: 12,
  },
  label: {
    fontSize: 10,
    lineHeight: 17,
    letterSpacing: 1.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: colors.muted,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    backgroundColor: colors.white,
    padding: 18,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
    minHeight: 58,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  notice: {
    borderLeftWidth: 2,
    borderColor: colors.accent,
    paddingLeft: 18,
    paddingVertical: 6,
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 23,
    color: colors.muted,
  },
  section: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
    borderTopWidth: 1,
    borderColor: colors.line,
    paddingTop: 20,
  },
  sectionLabel: {
    fontSize: 13,
    lineHeight: 22,
    color: colors.muted,
    flexShrink: 1,
  },
  sectionValue: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.ink,
    flexShrink: 1,
  },
  signature: {
    paddingTop: 18,
    gap: 18,
    alignItems: 'center',
  },
  signatureLine: {
    width: 28,
    height: 1,
    backgroundColor: colors.accent,
  },
  signatureText: {
    fontSize: 8,
    lineHeight: 16,
    letterSpacing: 1.8,
    color: colors.muted,
    textAlign: 'center',
  },
});
