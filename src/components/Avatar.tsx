import { View } from 'react-native';
import { s } from '../components/styles';
import { T } from '../components/T';
import { colors as c } from '../theme/tokens';
export function Avatar({ name }: {
  name: string;
}) {
  return <View
    style={{
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.surface
    }}>
    <T style={s.h}>
      {name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase()}
    </T>
  </View>;
}
