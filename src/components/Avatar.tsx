import { Text, View } from 'react-native';
import { colors, serif } from '../theme';
export function Avatar({ name, size = 48 }: { name: string; size?: number }) {
  return (
    <View
      accessibilityLabel={name}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.line,
      }}
    >
      <Text
        style={{
          fontFamily: serif,
          fontSize: size * 0.43,
          color: colors.accent,
        }}
      >
        {name.charAt(0)}
      </Text>
    </View>
  );
}
