import { Text } from 'react-native';
import { colors } from '../theme';
import { PressableScale } from './PressableScale';
export function Button({
  title,
  onPress,
  primary = false,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  primary?: boolean;
  disabled?: boolean;
}) {
  return (
    <PressableScale
      disabled={disabled}
      onPress={onPress}
      style={{
        minHeight: 58,
        padding: 18,
        paddingHorizontal: 22,
        borderRadius: 18,
        backgroundColor: primary ? colors.ink : 'transparent',
        borderWidth: primary ? 0 : 1,
        borderColor: colors.line,
      }}
    >
      <Text
        style={{
          color: primary ? colors.paper : colors.ink,
          fontSize: 14,
          fontWeight: '600',
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
    </PressableScale>
  );
}
