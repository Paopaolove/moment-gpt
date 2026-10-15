import { StyleSheet, Text, View } from 'react-native';
import { dateLabel } from '../domain/rules';
import { c, medium, sans, serif } from '../theme/tokens';
import { Journey } from '../useJourney';
import { Copy } from './Copy';
import { serialOf } from './Ticket';
export function Carnet({ journey }: {
  journey: Journey;
}) {
  const entries = journey.store.bookings.filter(b => ['confirmed', 'present', 'cancelled'].includes(b.status)).map(b => ({ booking: b, moment: journey.store.moments.find(m => m.id === b.momentId)! })).sort((a, b) => a.moment.startsAt - b.moment.startsAt);
  const visited = new Set(entries.filter(e => e.booking.status === 'present').map(e => e.moment.district)).size;
  return <View style={s.carnet}>
    <Text style={s.label}>LE CARNET / PARIS AU FIL DES PLACES</Text>
    <Text style={s.title}>Les moments restent.</Text>
    <Copy small>{visited} arrondissement{visited > 1 ? 's' : ''} découvert{visited > 1 ? 's' : ''}</Copy>
    {entries.map(({ booking, moment }) => <View key={moment.id} style={s.stub}>
      <View style={{ flex: 1, gap: 6 }}><Text style={s.label}>N° {serialOf(moment.id)} / {moment.district}e</Text><Text style={s.body}>{moment.title}</Text><Text style={s.label}>{dateLabel(moment.startsAt)}</Text></View>
      <Text style={s.stamp}>{booking.status === 'present' ? 'PRÉSENT' : booking.status === 'cancelled' ? 'RENDU' : moment.startsAt < journey.store.now ? 'PASSÉ' : 'À VENIR'}</Text>
    </View>)}
  </View>;
}
const s = StyleSheet.create({
  carnet: { gap: 16, borderTopWidth: 1, borderColor: c.line, paddingTop: 26 },
  label: { fontFamily: medium, fontSize: 13, lineHeight: 20, letterSpacing: 1, color: c.light },
  title: { fontFamily: serif, fontSize: 32, color: c.light },
  body: { fontFamily: serif, fontSize: 23, color: c.light },
  stub: { borderBottomWidth: 1, borderStyle: 'dashed', borderColor: c.line, paddingVertical: 18, flexDirection: 'row', gap: 12, alignItems: 'center' },
  stamp: { fontFamily: sans, fontSize: 13, color: c.light, borderWidth: 1, borderColor: c.line, padding: 5, transform: [{ rotate: '-8deg' }] }
});
