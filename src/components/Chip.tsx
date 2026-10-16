import { Pressable } from 'react-native';
import { T } from '../components/T';
import { colors as c } from '../theme/tokens';
export function Chip({ title, selected, onPress }: {
  title: string;
  selected?: boolean;
  onPress: () => void;
}) {
  return <Pressable
    accessibilityRole="button"
    accessibilityState={{ selected: !!selected }}
    onPress={onPress}
    style={{
      minHeight: 44,
      paddingHorizontal: 16,
      justifyContent: 'center',
      borderRadius: 24,
      backgroundColor: selected ? c.accent : c.surface,
      borderWidth: 1,
      borderColor: selected ? c.accent : c.border
    }}>
    <T style={{ fontSize: 14, color: selected ? 'white' : c.text }}>
      {title}
    </T>
  </Pressable>;
}
