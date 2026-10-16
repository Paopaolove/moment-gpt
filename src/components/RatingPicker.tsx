import { View } from 'react-native';
import { Chip } from '../components/Chip';
import { s } from '../components/styles';
import { T } from '../components/T';
import type { Level } from '../domain/types';
export function RatingPicker({ label, value, onChange }: {
  label: string;
  value: Level;
  onChange: (v: Level) => void;
}) {
  return <View style={s.stack}>
    <T style={s.h}>
      {label}
    </T>
    <View style={{
      flexDirection: 'row', gap: 8, flexWrap: 'wrap'
    }}>
      {(['À revoir', 'Bien', 'Excellent'] as const).map((t, i) => <Chip
        key={t}
        title={t}
        selected={value === [1, 3, 5][i]}
        onPress={() => onChange([1, 3, 5][i] as Level)} />)}
    </View>
  </View>;
}
