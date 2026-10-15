import { InterTight_400Regular } from '@expo-google-fonts/inter-tight/400Regular';
import { useFonts } from 'expo-font';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Journey } from './src/Journey';
import { Provider } from './src/store';
import { c } from './src/theme/tokens';
export default function App() {
  const [loaded, error] = useFonts({ FrauncesDisplay: require('./assets/fonts/FrauncesDisplay-Regular.ttf'), InterTight_400Regular });
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
