import { Pressable } from 'react-native';
import { T } from '../components/T';
import { colors as c } from '../theme/tokens';
export function Button({ title, onPress, variant = 'primary', disabled = false }: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'text';
  disabled?: boolean;
}) {
  return <Pressable
    accessibilityRole="button"
    accessibilityState={{ disabled }}
    disabled={disabled}
    onPress={onPress}
    style={({ pressed }) => ({
      minHeight: 48,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: variant === 'primary' ? c.accent : variant === 'secondary' ? c.surface : 'transparent',
      opacity: disabled ? .4 : pressed ? .7 : 1
    })}>
    <T
      style={{
        fontFamily: 'InterTight_600SemiBold',
        color: variant === 'primary' ? 'white' : c.text,
        textAlign: 'center'
      }}>
      {title}
    </T>
  </Pressable>;
}
