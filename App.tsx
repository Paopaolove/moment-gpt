import React from 'react';
import { StatusBar, Text } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from './src/store';
import { Create, Discover, MyMoments, Profile } from './src/screens/Screens';
import { colors } from './src/theme';
type Tabs = { Découvrir: undefined; 'Mes moments': undefined; Proposer: undefined; Profil: undefined };
const Tab = createBottomTabNavigator<Tabs>();
const icons: Record<keyof Tabs, string> = { Découvrir: '◌', 'Mes moments': '▤', Proposer: '＋', Profil: '○' };
export default function App() {
  return <SafeAreaProvider><Provider><StatusBar barStyle="dark-content" backgroundColor={colors.paper} /><SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: colors.paper }}><NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: colors.accent, background: colors.paper, card: colors.paper, text: colors.ink, border: colors.line } }}><Tab.Navigator screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: colors.accent, tabBarInactiveTintColor: colors.muted, tabBarStyle: { backgroundColor: colors.paper, borderTopColor: colors.line, elevation: 0, shadowOpacity: 0 }, tabBarLabelStyle: { fontSize: 10 }, tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 25 }}>{icons[route.name]}</Text> })}><Tab.Screen name="Découvrir" component={Discover} /><Tab.Screen name="Mes moments" component={MyMoments} /><Tab.Screen name="Proposer" component={Create} /><Tab.Screen name="Profil" component={Profile} /></Tab.Navigator></NavigationContainer></SafeAreaView></Provider></SafeAreaProvider>;
}
