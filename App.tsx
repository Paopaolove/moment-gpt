import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from './src/store';
import { Journey } from './src/Journey';
import { c } from './src/theme/tokens';
export default function App() {
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
