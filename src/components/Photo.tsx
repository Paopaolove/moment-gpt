import { Image } from 'react-native';
import { colors as c } from '../theme/tokens';
export function Photo({ uri }: {
  uri: string;
}) {
  return <Image
    accessibilityLabel="Photo partagée avec accord"
    source={{ uri }}
    style={{
      height: 180, borderRadius: 12, backgroundColor: c.surface
    }}
    resizeMode="cover" />;
}
