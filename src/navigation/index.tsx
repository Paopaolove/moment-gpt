import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, BackHandler, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PressableScale } from '../components/PressableScale';
import { Abonnements } from '../screens/Abonnements';
import { Avis } from '../screens/Avis';
import { Carte } from '../screens/Carte';
import { Chat } from '../screens/Chat';
import { Confirmation } from '../screens/Confirmation';
import { Demandes } from '../screens/Demandes';
import { Detail } from '../screens/Detail';
import { Dispo } from '../screens/Dispo';
import { Fil } from '../screens/Fil';
import { Joker } from '../screens/Joker';
import { Lieu } from '../screens/Lieu';
import { Onboarding } from '../screens/Onboarding';
import { Profil } from '../screens/Profil';
import { Publier } from '../screens/Publier';
import { colors } from '../theme';
import { FlowContext, type Location, type Route } from './context';
const screens: Record<Route, React.ComponentType> = { Onboarding, Fil, Detail, Dispo, Publier, Demandes, Confirmation, Chat, Joker, Abonnements, Profil, Avis, Lieu, Carte };
const tabs: {
    name: Route;
    label: string;
    icon: string;
}[] = [{ name: 'Fil', label: 'Explorer', icon: '◌' }, { name: 'Demandes', label: 'Mes moments', icon: '≡' }, { name: 'Publier', label: 'Proposer', icon: '＋' }, { name: 'Profil', label: 'Moi', icon: '○' }];
export function Navigation() {
    const [history, setHistory] = useState<Location[]>([{ name: 'Onboarding' }]);
    const route = history[history.length - 1]!;
    const insets = useSafeAreaInsets();
    const go = useCallback((name: Route, id?: string) => setHistory(h => name === 'Fil' || h[h.length - 1]?.name === 'Onboarding' ? [{ name, id }] : [...h.slice(-24), { name, id }]), []);
    const back = useCallback(() => setHistory(h => h.length > 1 ? h.slice(0, -1) : [{ name: 'Fil' }]), []);
    useEffect(() => { const sub = BackHandler.addEventListener('hardwareBackPress', () => { if (history.length > 1) {
        back();
        return true;
    } return false; }); return () => sub.remove(); }, [history.length, back]);
    const progress = useRef(new Animated.Value(0)).current;
    useEffect(() => { let live = true; progress.setValue(0); AccessibilityInfo.isReduceMotionEnabled().then(reduce => { if (live)
        Animated.timing(progress, { toValue: 1, duration: reduce ? 0 : 350, useNativeDriver: true }).start(); }); return () => { live = false; progress.stopAnimation(); }; }, [route, progress]);
    const Screen = screens[route.name];
    const onboarding = route.name === 'Onboarding';
    const root = tabs.some(t => t.name === route.name);
    return <FlowContext.Provider value={{ route, go, back }}>
    <View style={{ flex: 1, backgroundColor: colors.paper }}>{!onboarding && !root && <View style={{ paddingHorizontal: 24, paddingTop: 5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <PressableScale accessibilityLabel="Revenir à l’écran précédent" onPress={back} style={{ paddingRight: 24 }}>
        <Text style={{ fontSize: 24, color: colors.ink }}>←</Text>
        </PressableScale>
        <Text style={{ fontSize: 12, letterSpacing: 2, color: colors.muted }}>MOMENT · PARIS</Text>
        </View>}<Animated.View style={{ flex: 1, opacity: progress, transform: [{ translateX: progress.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }] }}>
    <Screen key={`${route.name}-${route.id ?? ''}`}/>
    </Animated.View>{!onboarding && <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10, paddingBottom: Math.max(insets.bottom, 12), borderTopWidth: 1, borderColor: colors.line, backgroundColor: colors.paper }}>{tabs.map(tab => <PressableScale key={tab.name} onPress={() => go(tab.name)} accessibilityRole="tab" accessibilityState={{ selected: route.name === tab.name }} accessibilityLabel={tab.label} style={{ alignItems: 'center', paddingHorizontal: 8, gap: 3 }}>
            <Text style={{ fontSize: 25, color: route.name === tab.name ? colors.accent : colors.muted }}>{tab.icon}</Text>
            <Text style={{ fontSize: 10, color: route.name === tab.name ? colors.accent : colors.muted }}>{tab.label}</Text>
            </PressableScale>)}</View>}</View>
    </FlowContext.Provider>;
}
