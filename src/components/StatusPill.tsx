import { View } from 'react-native';
import { T } from '../components/T';
import { colors as c } from '../theme/tokens';
export function StatusPill({ title, tone = 'neutral' }: {
  title: string;
  tone?: 'neutral' | 'success' | 'warning' | 'error';
}) {
  return <View
    style={{
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 8,
      backgroundColor: c.surface
    }}>
    <T
      style={{
        fontSize: 12,
        lineHeight: 18,
        fontFamily: 'InterTight_600SemiBold',
        color: tone === 'neutral' ? c.secondary : c[tone]
      }}>
      {title}
    </T>
  </View>;
}
