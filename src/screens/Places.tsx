import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Pulse } from '../components/MotionDetails';
import { Copy, Link, Pills } from '../components/Primitives';
import { MovingTicket } from '../components/TicketTransition';
import { isUrgent } from '../domain/rules';
import { c, sans, serif } from '../theme/tokens';
import { Journey } from '../useJourney';
export function Places({ journey }: {
  journey: Journey;
}) {
  const { store, setId, filter, setFilter, urgent, setUrgent, go } = journey;
  const tonight = store.moments.filter(x => !x.own && isUrgent(x.startsAt, store.now) && !store.bookings.some(b => b.momentId === x.id && ['confirmed', 'present', 'accepted'].includes(b.status))).sort((a, b) => a.startsAt - b.startsAt)[0];
  const until = tonight ? Math.max(0, Math.ceil((tonight.startsAt - store.now) / 1000)) : 0;
  return <View style={s.screen}>
    <View>
      <Text style={s.label}>01 / LES PLACES</Text>
      <Text style={s.hero}>Il reste une place.</Text>
      <Copy>Paris se partage, un siège à la fois.</Copy>
    </View>
    {tonight && <Pressable accessibilityRole="button" onPress={() => { setId(tonight.id); go('detail'); }} style={[s.note, { borderColor: c.accent }]}>
      <Text style={s.label}>CE SOIR, 1 PLACE</Text><Text style={[s.hero, { fontSize: 30, lineHeight: 36 }]}>{tonight.title}</Text>
      <Copy>{tonight.district}e · avec {tonight.host}</Copy><Text accessibilityRole="timer" style={[s.body, { fontVariant: ['tabular-nums'] }]}>{until ? `Dans ${String(Math.floor(until / 60)).padStart(2, '0')}:${String(until % 60).padStart(2, '0')}` : 'Le moment commence · encore une place'}</Text>
    </Pressable>}
    <Pills items={['Tout', 'Table', 'Sport', 'Culture']} value={filter} onChange={setFilter} />
    <View style={s.row}>
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><Pulse /><Text style={s.body}>Maintenant</Text></View>
        <Copy small>De 90 min avant à 30 min après le début</Copy>
      </View>
      <Switch accessibilityLabel="Places maintenant" value={urgent} onValueChange={setUrgent} trackColor={{
        false: c.line,
        true: c.muted
      }} thumbColor={c.card} />
    </View>
    {store.bookings.some(b => ['accepted', 'confirmed', 'present'].includes(b.status)) && <View style={s.note}>
      <Text style={s.label}>VOS BILLETS</Text>
      {store.bookings.filter(b => ['accepted', 'confirmed', 'present'].includes(b.status)).map(b => <Link key={b.momentId} label={store.moments.find(x => x.id === b.momentId)!.title} onPress={() => {
        setId(b.momentId);
        go(b.status === 'accepted' ? 'take' : 'confirmed');
      }} />)}
    </View>}
    {store.moments.filter(x => (filter === 'Tout' || x.category === filter) && (!urgent || isUrgent(x.startsAt, store.now)) && store.now <= x.startsAt + 30 * 60000).map(x => <MovingTicket key={x.id} m={x} taken={store.bookings.some(b => b.momentId === x.id && ['confirmed', 'present'].includes(b.status)) ? 1 : 0} />)}
    {!store.moments.some(x => (filter === 'Tout' || x.category === filter) && (!urgent || isUrgent(x.startsAt, store.now)) && store.now <= x.startsAt + 30 * 60000) && <Copy>Aucune place pour ce filtre. Essayez une autre catégorie.</Copy>}
    <Copy small>Des invitations fictives, inspirées de lieux parisiens. Aucune réservation réelle.</Copy>
  </View>;
}
const s = StyleSheet.create({
  screen: {
    gap: 22
  },
  label: {
    fontFamily: sans,
    fontSize: 13,
    letterSpacing: 1.8,
    lineHeight: 18,
    color: c.light,
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  hero: {
    fontFamily: serif,
    fontSize: 52,
    lineHeight: 56,
    letterSpacing: -1.8,
    color: c.light
  },
  body: {
    fontFamily: sans,
    fontSize: 16,
    lineHeight: 25,
    color: c.light
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap'
  },
  note: {
    padding: 20,
    borderWidth: 1,
    borderColor: c.line,
    gap: 9
  }
});
