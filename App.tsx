import { StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from './src/store';
import { PlaceLibre } from './src/PlaceLibre';
export default function App(){return <SafeAreaProvider><Provider><StatusBar barStyle="dark-content" backgroundColor="#F7F1EA"/><SafeAreaView style={{flex:1,backgroundColor:'#F7F1EA'}}><PlaceLibre/></SafeAreaView></Provider></SafeAreaProvider>}
