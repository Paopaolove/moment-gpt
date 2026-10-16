import { InterTight_900Black } from '@expo-google-fonts/inter-tight/900Black';
import { InterTight_700Bold } from '@expo-google-fonts/inter-tight/700Bold';
import { useFonts } from '@expo-google-fonts/inter-tight/useFonts';
import { Fraunces_900Black } from '@expo-google-fonts/fraunces/900Black';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Journey } from './src/Journey';
import { Provider } from './src/store';
import { c } from './src/theme/tokens';
export default function App() {
  const [loaded, error] = useFonts({ Fraunces_900Black, InterTight_900Black, InterTight_700Bold });
  if(!loaded && !error)
    return <View style={[s.safe, { justifyContent: 'center' }]}><ActivityIndicator color={c.light} accessibilityLabel="Chargement de Moment" /></View>;
  return <SafeAreaProvider>
    <Provider>
      <StatusBar barStyle="light-content" backgroundColor={c.paper} />
      <SafeAreaView style={s.safe}>
        <Journey />
      </SafeAreaView>
    </Provider>
  </SafeAreaProvider>;
}
const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: c.paper
  }
});
