import React, { useContext } from 'react';
import { StyleSheet, Text } from 'react-native';
import { c, typography } from '../theme/tokens';
import { PaperContext } from './PaperContext';
export function Copy({ children, small = false }: {
  children: React.ReactNode;
  small?: boolean;
}) {
  const paper = useContext(PaperContext);
  return <Text style={[s.copy, small && s.small, {
    color: paper ? c.ink : c.light
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
    fontSize: 13,
    lineHeight: 21
  }
});
