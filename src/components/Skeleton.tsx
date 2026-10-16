import { View } from 'react-native';
import { s } from '../components/styles';
import { colors as c } from '../theme/tokens';
export function Skeleton() {
  return <View accessibilityLabel="Chargement des moments" style={s.card}>
    {[80, 100, 55].map((w, i) => <View
      key={i}
      style={{
        height: i === 1 ? 28 : 14,
        width: `${w}%`,
        borderRadius: 6,
        backgroundColor: c.border
      }} />)}
  </View>;
}
