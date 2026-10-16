import React from 'react';
import { View } from 'react-native';
import { T } from '../components/T';
import { colors as c } from '../theme/tokens';
export function Banner({ children }: {
  children: React.ReactNode;
}) {
  return <View style={{
    padding: 16, backgroundColor: c.surface, borderRadius: 12
  }}>
    <T style={{ fontSize: 14, lineHeight: 21 }}>
      {children}
    </T>
  </View>;
}
