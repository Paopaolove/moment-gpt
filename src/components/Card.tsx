import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { styles } from '../theme';
export function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}
