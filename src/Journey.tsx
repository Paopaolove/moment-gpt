import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Brand } from './components/Brand';
import { TicketTransitions, TicketScreenEntrance } from './components/TicketTransition';
import { useReducedMotion } from './components/useReducedMotion';
import { Billet } from './screens/Billet';
import { Manifeste } from './screens/Manifeste';
import { Offrir } from './screens/Offrir';
import { Places } from './screens/Places';
import { PrendrePlace } from './screens/PrendrePlace';
import { Talon } from './screens/Talon';
import { c, sans } from './theme/tokens';
import { useJourney } from './useJourney';
const screens = {
  home: Manifeste,
  list: Places,
  detail: Billet,
  take: PrendrePlace,
  confirmed: Talon,
  offer: Offrir
};
export function Journey() {
  const journey = useJourney();
  const Screen = screens[journey.page];
  const reduced = useReducedMotion();
  const [navWidth, setNavWidth] = useState(0);
  const active = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(active, { toValue: journey.page === 'offer' ? 1 : 0, duration: reduced ? 0 : 260, useNativeDriver: true }).start(); }, [journey.page, reduced, active]);
  const listOffset = useRef(0);
  return <TicketTransitions journey={journey}><View style={s.root}>
    <View style={s.header}>
      {journey.page !== 'home' && <Pressable accessibilityRole="button" accessibilityLabel="Accueil Moment GPT Funky" onPress={() => {
        journey.setStep(0);
        journey.go('home');
      }}>
        <Brand />
      </Pressable>}
      <Text style={s.label}>Paris</Text>
    </View>
    <ScrollView onScroll={event => {
      if(journey.page === 'list')
        listOffset.current = event.nativeEvent.contentOffset.y;
    }} scrollEventThrottle={16} contentOffset={{ x: 0, y: journey.page === 'list' ? listOffset.current : 0 }} key={`${journey.page}-${journey.page === 'offer' ? journey.offerStep : ''}`} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      {journey.page === 'detail' || journey.page === 'list' ? <TicketScreenEntrance><Screen journey={journey} /></TicketScreenEntrance> : <Screen journey={journey} />}
    </ScrollView>
    {journey.page !== 'home' && <View style={s.nav} onLayout={e => setNavWidth(e.nativeEvent.layout.width)}>
      <Animated.View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, width: navWidth / 2, height: 2, backgroundColor: c.accent, transform: [{ translateX: active.interpolate({ inputRange: [0, 1], outputRange: [0, navWidth / 2] }) }] }} />
      {(['list', 'offer'] as const).map((page, i) => <Pressable key={page} accessibilityRole="tab" accessibilityState={{
        selected: (page === 'offer' ? journey.page === 'offer' : journey.page !== 'offer')
      }} onPress={() => journey.go(page)} style={s.tab}>
        <Text style={[s.navText, (page === 'offer' ? journey.page === 'offer' : journey.page !== 'offer') && s.navTextActive]}>
          {i === 0 ? 'Les places' : 'Offrir une place'}
        </Text>
      </Pressable>)}
    </View>}
  </View></TicketTransitions>;
}
const s = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: c.paper
  },
  header: {
    paddingHorizontal: 22,
    height: 54,
    borderBottomWidth: 1,
    borderColor: c.pink,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8
  },
  label: {
    color: c.light,
    fontFamily: sans,
    fontSize: 13,
    letterSpacing: 1
  },
  content: {
    width: '100%',
    maxWidth: 540,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 48
  },
  nav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: c.pink
  },
  tab: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: 'transparent'
  },
  navTextActive: { color: c.light },
  navText: {
    color: '#C0B4A5',
    fontFamily: sans,
    fontSize: 14
  }
});
