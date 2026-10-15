import React from 'react';
import { Text } from 'react-native';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Create, Discover, MyMoments, Profile } from '../screens/Screens';
import { colors } from '../theme';
type Tabs = { Invitations: undefined; 'Mes moments': undefined; Proposer: undefined; Profil: undefined };
const Tab = createBottomTabNavigator<Tabs>();
const icons = { Invitations: '◌', 'Mes moments': '≡', Proposer: '＋', Profil: '○' };
export function Navigation() {
  return <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, primary: colors.accent, background: colors.paper, card: colors.paper, text: colors.ink, border: colors.line } }}><Tab.Navigator screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: colors.accent, tabBarInactiveTintColor: colors.muted, tabBarStyle: { backgroundColor: colors.paper, borderTopColor: colors.line, elevation: 0, shadowOpacity: 0 }, tabBarLabelStyle: { fontSize: 10, fontWeight: '500' }, tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 26 }}>{icons[route.name]}</Text> })}><Tab.Screen name="Invitations" component={Discover} /><Tab.Screen name="Mes moments" component={MyMoments} /><Tab.Screen name="Proposer" component={Create} /><Tab.Screen name="Profil" component={Profile} /></Tab.Navigator></NavigationContainer>;
}
