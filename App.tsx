import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from './src/store';
import { Navigation } from './src/navigation';
import { Onboarding } from './src/screens/Onboarding';
import { colors } from './src/theme';
export default function App() {
  const [ready, setReady] = useState(false);
  return <SafeAreaProvider><Provider><StatusBar barStyle="dark-content" backgroundColor={colors.paper} /><SafeAreaView edges={ready ? ['top', 'left', 'right'] : ['top', 'bottom', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.paper }}>{ready ? <Navigation /> : <Onboarding done={() => setReady(true)} />}</SafeAreaView></Provider></SafeAreaProvider>;
}
