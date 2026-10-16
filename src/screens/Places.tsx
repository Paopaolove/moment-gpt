import { Entrance, Marquee } from '../components/Funky';
import { Roulette } from '../components/Roulette';
import { categoryColor } from '../theme/tokens';
import { ScrollView, Pressable, StyleSheet, Text, View } from 'react-native';
import { Pulse } from '../components/MotionDetails';
import { Copy, Link } from '../components/Primitives';
import { MovingTicket } from '../components/TicketTransition';
import { isUrgent } from '../domain/rules';
import { c, medium, sans, serif } from '../theme/tokens';
import { Journey } from '../useJourney';
export function Places({ journey }: {
  journey: Journey;
}) {
  const { store, setId, filter, setFilter, urgent, setUrgent, go } = journey;
  const available = store.moments.filter(x => store.now <= x.startsAt + 30 * 60000).map(x => ({ ...x, seats: x.seats - store.bookings.filter(b => b.momentId === x.id && ['confirmed', 'present'].includes(b.status)).length })).filter(x => x.seats > 0);
  const visible = available.filter(x => (filter === 'Tout' || x.category === filter) && (!urgent || isUrgent(x.startsAt, store.now)));
  const tonight = visible.filter(x => !x.own && isUrgent(x.startsAt, store.now)).sort((a, b) => a.startsAt - b.startsAt)[0];
  const ordered = tonight ? [tonight, ...visible.filter(x => x.id !== tonight.id)] : visible;
  const date = new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'long', day: 'numeric' }).format(store.now);
  const count = available.reduce((n, x) => n + x.seats, 0);
  return <View style={s.screen}>
    <View style={{ gap: 6 }}>
      <Text style={s.hero}>{'CE SOIR\nÀ PARIS'}</Text>
      <Copy>{date} · {count} place{count > 1 ? 's' : ''} libre{count > 1 ? 's' : ''} à Paris</Copy>
    </View>
    <Marquee /><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filters}>
      {['Tout', 'Table', 'Sport', 'Culture', 'Nuit', 'Maintenant'].map(label => {
        const active = label === 'Maintenant' ? urgent : filter === label;
        return <Pressable key={label} accessibilityRole="button" accessibilityState={{ selected: active }} onPress={() => label === 'Maintenant' ? setUrgent(!urgent) : setFilter(label)} style={[s.filter, { backgroundColor: label in categoryColor ? categoryColor[label as keyof typeof categoryColor] : c.yellow, transform: [{ rotate: active ? '-6deg' : '2deg' }, {scale: active ? 1.06 : 1}] }]}>
          {label === 'Maintenant' && <Pulse />}<Text style={[s.filterText, { color: label === 'Nuit' ? c.light : c.ink }]}>{label === 'Maintenant' ? '● Maintenant' : label}</Text>
        </Pressable>;
      })}
    </ScrollView>
    {ordered.map((x, index) => <Entrance key={x.id} index={index}><View>
      <MovingTicket index={index} m={store.moments.find(m => m.id === x.id)!} taken={store.bookings.filter(b => b.momentId === x.id && ['confirmed', 'present'].includes(b.status)).length} now={store.now} featured={x.id === tonight?.id} />
      {index === 0 && <View style={{ position: 'absolute', zIndex: 4, right: -22, top: 0 }}><Roulette moments={available.filter(m => !m.own)} onOpen={m => { setId(m.id); go('detail'); }} /></View>}
    </View></Entrance>)}
    {store.bookings.some(b => ['accepted', 'confirmed', 'present'].includes(b.status) && !b.momentId.startsWith('demo-past-')) && <View style={s.note}>
      <Text style={s.label}>VOS BILLETS</Text>
      {store.bookings.filter(b => ['accepted', 'confirmed', 'present'].includes(b.status) && !b.momentId.startsWith('demo-past-')).map(b => <Link key={b.momentId} label={store.moments.find(x => x.id === b.momentId)!.title} onPress={() => {
        setId(b.momentId);
        go(b.status === 'accepted' ? 'take' : 'confirmed');
      }} />)}
    </View>}
    {!visible.length && <Copy>Aucune place pour ce filtre. Essayez une autre catégorie.</Copy>}
    <Copy small>Des invitations fictives, inspirées de lieux parisiens. Aucune réservation réelle.</Copy>
  </View>;
}
const s = StyleSheet.create({
  screen: {
    gap: 12
  },
  filters: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 6 },
  filter: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 12, paddingHorizontal: 14, borderRadius: 40, borderBottomWidth: 1, borderBottomColor: 'transparent' },
  filterText: { fontFamily: sans, fontSize: 14, color: c.ink },
  label: {
    fontFamily: medium,
    fontSize: 14,
    letterSpacing: 1.8,
    lineHeight: 18,
    color: c.light,
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  hero: {
    fontFamily: serif,
    fontSize: 64,
    lineHeight: 66,
    letterSpacing: -1.8,
    color: c.light
  },
  body: {
    fontFamily: sans,
    fontSize: 16,
    lineHeight: 25,
    color: c.light
  },
  note: {
    padding: 20,
    borderWidth: 1,
    borderColor: c.line,
    gap: 9
  }
});
