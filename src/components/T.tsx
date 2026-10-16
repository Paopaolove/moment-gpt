import React from 'react';
import { Text } from 'react-native';
import { s } from '../components/styles';
export function T({ children, style, ...rest }: React.ComponentProps<typeof Text>) {
  return <Text {...rest} maxFontSizeMultiplier={1.7} style={[s.text, style]}>
    {children}
  </Text>;
}
