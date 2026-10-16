import { Fraunces_500Medium } from '@expo-google-fonts/fraunces/500Medium';
import { InterTight_400Regular } from '@expo-google-fonts/inter-tight/400Regular';
import { InterTight_500Medium } from '@expo-google-fonts/inter-tight/500Medium';
import { InterTight_600SemiBold } from '@expo-google-fonts/inter-tight/600SemiBold';
import { InterTight_700Bold } from '@expo-google-fonts/inter-tight/700Bold';
import { useFonts } from 'expo-font';
import { ActivityIndicator, StatusBar, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Journey } from './src/Journey';
import { Provider } from './src/store';
export default function App() {
  const [loaded, error] = useFonts({
    InterTight_400Regular,
    InterTight_500Medium,
    InterTight_600SemiBold,
    InterTight_700Bold,
    Fraunces_500Medium
  });
  if(!loaded && !error)
    return <View
      style={{
        flex: 1, backgroundColor: 'white', justifyContent: 'center'
      }}>
      <ActivityIndicator accessibilityLabel="Chargement de Moment" color="#1F2937" />
    </View>;
  return <SafeAreaProvider>
    <Provider>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Journey />
      </SafeAreaView>
    </Provider>
  </SafeAreaProvider>;
}
