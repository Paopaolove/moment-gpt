import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Brand } from './components/Brand';
import { Manifeste } from './screens/Manifeste';
import { Places } from './screens/Places';
import { Billet } from './screens/Billet';
import { PrendrePlace } from './screens/PrendrePlace';
import { Talon } from './screens/Talon';
import { Offrir } from './screens/Offrir';
import { useJourney } from './useJourney';
import { c } from './theme/tokens';
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
  return <View style={s.root}>
    <View style={s.header}>
      {journey.page !== 'home' && <Pressable accessibilityRole="button" accessibilityLabel="Accueil Moment GPT 2" onPress={() => {
        journey.setStep(0);
        journey.go('home');
      }}>
        <Brand />
      </Pressable>}
      <Text style={s.label}>PARIS / LA PLACE LIBRE</Text>
    </View>
    <ScrollView key={journey.page} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      <Screen journey={journey} />
    </ScrollView>
    {journey.page !== 'home' && <View style={s.nav}>
      {(['list', 'offer'] as const).map((page, i) => <Pressable key={page} accessibilityRole="tab" accessibilityState={{
        selected: (page === 'offer' ? journey.page === 'offer' : journey.page !== 'offer')
      }} onPress={() => journey.go(page)} style={[s.tab, (page === 'offer' ? journey.page === 'offer' : journey.page !== 'offer') && s.active]}>
        <Text style={[s.navText, (page === 'offer' ? journey.page === 'offer' : journey.page !== 'offer') && s.navTextActive]}>
          {i === 0 ? 'Les places' : 'Offrir une place'}
        </Text>
      </Pressable>)}
    </View>}
  </View>;
}
const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: c.paper
  },
  header: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#504336',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8
  },
  label: {
    color: c.light,
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
    borderColor: '#504336'
  },
  tab: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 2,
    borderTopColor: 'transparent'
  },
  active: {
    borderTopColor: c.accent
  },
  navTextActive: { color: c.light },
  navText: {
    color: 'rgba(243,234,219,0.55)',
    fontSize: 14
  }
});
