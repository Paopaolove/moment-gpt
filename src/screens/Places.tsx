import React from 'react';
import { Pressable, View, Text, Switch, StyleSheet } from 'react-native';
import { c, serif } from '../theme/tokens';
import { Copy, Link, Pills } from '../components/Primitives';
import { Ticket } from '../components/Ticket';
import { isUrgent } from '../domain/rules';
import { Journey } from '../useJourney';
export function Places({
  journey
}: {
  journey: Journey;
}) {
  const {
    store,
    setId,
    filter,
    setFilter,
    urgent,
    setUrgent,
    go
  } = journey;
  return <View style={s.screen}>
    <View>
      <Text style={s.label}>01 / LES PLACES</Text>
      <Text style={s.hero}>Il reste une place.</Text>
      <Copy>Paris se partage, un siège à la fois.</Copy>
    </View>
    <Pills items={['Tout', 'Table', 'Sport', 'Culture']} value={filter} onChange={setFilter} />
    <View style={s.row}>
      <View>
        <Text style={s.body}>Maintenant</Text>
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
    {store.moments.filter(x => (filter === 'Tout' || x.category === filter) && (!urgent || isUrgent(x.startsAt, store.now)) && store.now <= x.startsAt + 30 * 60000).map((x, index) => <Ticket key={x.id} m={x} index={index} onPress={() => {
      setId(x.id);
      go('detail');
    }} />)}
    {!store.moments.some(x => (filter === 'Tout' || x.category === filter) && (!urgent || isUrgent(x.startsAt, store.now)) && store.now <= x.startsAt + 30 * 60000) && <Copy>Aucune place pour ce filtre. Essayez une autre catégorie.</Copy>}
    <Copy small>Des invitations fictives, inspirées de lieux parisiens. Aucune réservation réelle.</Copy>
  </View>;
}
const s = StyleSheet.create({
  screen: {
    gap: 22
  },
  label: {
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
