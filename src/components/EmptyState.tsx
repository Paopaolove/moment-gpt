import { View } from 'react-native';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { s } from '../components/styles';
import { T } from '../components/T';
import { colors as c } from '../theme/tokens';
export function EmptyState({ title, detail, onAction }: {
  title: string;
  detail: string;
  onAction?: () => void;
}) {
  return <View style={{
    paddingVertical: 40, gap: 12, alignItems: 'center'
  }}>
    <View style={{
      padding: 24, borderRadius: 48, backgroundColor: c.surface
    }}>
      <Icon name="compass" />
    </View>
    <T style={s.h}>
      {title}
    </T>
    <T style={[s.muted, { textAlign: 'center' }]}>
      {detail}
    </T>
    {onAction && <Button title="Découvrir les moments" variant="secondary" onPress={onAction} />}
  </View>;
}
