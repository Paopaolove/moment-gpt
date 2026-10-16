import { Pressable, View } from 'react-native';
import { Icon } from '../components/Icon';
import { s } from '../components/styles';
import { T } from '../components/T';
import { colors as c } from '../theme/tokens';
export function SegmentedControl({ value, onChange }: {
  value: string;
  onChange: (v: string) => void;
}) {
  return <View
    style={{
      flexDirection: 'row',
      backgroundColor: c.surface,
      padding: 4,
      borderRadius: 14
    }}>
    {['Liste', 'Carte'].map(v => <Pressable
      key={v}
      accessibilityLabel={`Afficher les moments en ${v.toLowerCase()}`}
      accessibilityRole="tab"
      accessibilityState={{ selected: v === value }}
      onPress={() => onChange(v)}
      style={{
        flex: 1,
        minHeight: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: v === value ? 'white' : 'transparent',
        borderWidth: v === value ? 1 : 0,
        borderColor: c.border
      }}>
      <View style={s.row}>
        <Icon name={v === 'Liste' ? 'list' : 'map'} />
        <T style={s.h}>
          {v}
        </T>
      </View>
    </Pressable>)}
  </View>;
}
