import { KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Navigation } from './src/navigation';
import { Provider } from './src/store';
import { colors } from './src/theme';
export default function App() {
    return <SafeAreaProvider>
    <Provider>
    <StatusBar barStyle="dark-content" backgroundColor={colors.paper}/>
    <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.paper }}>
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
    <Navigation />
    </KeyboardAvoidingView>
    </SafeAreaView>
    </Provider>
    </SafeAreaProvider>;
}
