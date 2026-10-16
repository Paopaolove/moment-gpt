import { View } from 'react-native';
import { Icon, IconName } from './Icon';
import { T } from './T';
import { s } from './styles';
export function InfoRow({ icon, title, detail }: {
  icon: IconName;
  title: string;
  detail?: string;
}) {
  return <View style={[s.row, { minHeight: 48 }]}>
    <Icon name={icon} />
    <View style={{ flex: 1 }}>
      <T style={s.h}>
        {title}
      </T>
      {detail && <T style={[s.muted, { fontSize: 13 }]}>
        {detail}
      </T>}
    </View>
  </View>;
}
