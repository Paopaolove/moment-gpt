import { View } from 'react-native';
import { Button } from '../components/Button';
import { s } from '../components/styles';
import { T } from '../components/T';
export function ErrorState({ retry }: {
  retry: () => void;
}) {
  return <View style={s.card}>
    <T style={s.h}>{"Impossible de charger les moments"}</T>
    <T style={s.muted}>{"La connexion a fait une pause. Réessayons."}</T>
    <Button title="Réessayer" onPress={retry} />
  </View>;
}
