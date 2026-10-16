import { Pressable, View } from 'react-native';
import { Icon } from '../components/Icon';
import { s } from '../components/styles';
import { T } from '../components/T';
import { colors as c } from '../theme/tokens';
export function ListRow({ title, detail, onPress }: {
  title: string;
  detail?: string;
  onPress?: () => void;
}) {
  return <Pressable
    disabled={!onPress}
    onPress={onPress}
    accessibilityRole={onPress ? 'button' : undefined}
    style={{
      minHeight: 60,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderColor: c.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }}>
    <View style={{ flex: 1 }}>
      <T style={s.h}>
        {title}
      </T>
      {detail && <T style={[s.muted, { fontSize: 14 }]}>
        {detail}
      </T>}
    </View>
    {onPress && <Icon name="arrow" />}
  </Pressable>;
}
