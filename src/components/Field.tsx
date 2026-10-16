import React from 'react';
import { TextInput, View } from 'react-native';
import { s } from '../components/styles';
import { T } from '../components/T';
import { colors as c } from '../theme/tokens';
export function Field({ label, ...props }: React.ComponentProps<typeof TextInput> & {
  label: string;
}) {
  return <View style={{ gap: 8 }}>
    <T style={[s.h, { fontSize: 14 }]}>
      {label}
    </T>
    <TextInput
      accessibilityLabel={label}
      placeholderTextColor={c.secondary}
      {...props}
      style={[s.input, props.style]} />
  </View>;
}
