import { StyleSheet, Switch, Text, View } from 'react-native';
import { Action, Copy } from '../components/Primitives';
import { MovingTicket, TicketBack } from '../components/TicketTransition';
import { euros } from '../legacy/rules';
import { c, medium, sans } from '../theme/tokens';
import { Journey } from '../useJourney';
export function Billet({ journey }: {
  journey: Journey;
}) {
  const { store, m, booking, go, reserve } = journey;
  return <View style={s.screen}>
    <TicketBack />
    <Text style={s.label}>02 / LE BILLET</Text>
    <MovingTicket detail m={m} taken={booking && ['confirmed', 'present'].includes(booking.status) ? 1 : 0} />
    <Copy>
      {m.description}
    </Copy>
    <View style={s.note}>
      <Text style={s.label}>LE RENDEZ-VOUS</Text>
      <Copy>
        {m.address}
      </Copy>
      <Copy small>{m.host} · {m.own ? 'Votre invitation' : '4,9 / 5 · note de démonstration'}</Copy>
      <Copy small>L’hôte offre {euros(m.price)} par place. Le supplément éventuel reste à votre charge.</Copy>
    </View>
    {m.womenOnly && !m.own && <View style={s.row}>
      <Copy>Je suis une femme</Copy>
      <Switch accessibilityLabel="Je suis une femme" value={store.woman} onValueChange={store.setWoman} trackColor={{
        false: c.line,
        true: c.muted
      }} thumbColor={c.card} />
    </View>}
    {m.own ? <>
      <Copy>Votre place est publiée. L’accueil d’invités est gratuit, sans abonnement.</Copy>
      <Action label="Retrouver les places" onPress={() => go('list')} />
    </> : booking ? <>
      <Copy>
        {booking.status === 'cancelled' ? 'Cette place a été rendue.' : booking.status === 'expired' ? 'Le délai de confirmation est écoulé.' : 'Votre billet vous attend.'}
      </Copy>
      <Action label={['confirmed', 'present'].includes(booking.status) ? 'Voir mon talon' : booking.status === 'requested' ? 'Voir ma demande' : booking.status === 'accepted' ? 'Confirmer ma place' : 'Voir les autres places'} onPress={() => go(['confirmed', 'present'].includes(booking.status) ? 'confirmed' : ['requested', 'accepted'].includes(booking.status) ? 'take' : 'list')} />
    </> : <Action label="Prendre la place" disabled={m.womenOnly && !store.woman || store.now > m.startsAt + 30 * 60000} onPress={reserve} />}
    <Copy small>Prototype local · acceptation de l’hôte simulée à l’étape suivante.</Copy>
  </View>;
}
const s = StyleSheet.create({
  screen: {
    gap: 22
  },
  label: {
    fontFamily: medium,
    fontSize: 13,
    letterSpacing: 1.8,
    lineHeight: 18,
    color: c.light,
    fontWeight: '600',
    textTransform: 'uppercase'
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
