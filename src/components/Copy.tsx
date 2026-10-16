import React, { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import { c, typography } from '../theme/tokens';
import { PaperContext } from './PaperContext';
export function Copy({ children, small = false, color }: {
  children: React.ReactNode;
  small?: boolean;
  color?: string;
}) {
  const paper = useContext(PaperContext);
  return <Text style={[s.copy, small && s.small, {
    color: color ?? (paper ? c.ink : c.light)
  }]}>
    {children}
  </Text>;
}
const s = StyleSheet.create({
  copy: {
    ...typography.body,
    fontSize: 16,
    lineHeight: 25
  },
  small: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 21
  }
});
