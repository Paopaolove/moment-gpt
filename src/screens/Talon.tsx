import { serialOf } from '../components/Ticket';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { c, serif } from '../theme/tokens';
import { Copy, Action, Link } from '../components/Primitives';
import { Ticket } from '../components/Ticket';
import { Stub } from '../components/Stub';
import { canAttend } from '../domain/rules';
import { Journey } from '../useJourney';
export function Talon({
  journey
}: {
  journey: Journey;
}) {
  const {
    store,
    id,
    m,
    booking,
    go
  } = journey;
  return <View style={s.screen}>
    <Text style={s.label}>04 / VOTRE TALON</Text>
    <Text style={s.hero}>
      {booking?.status === 'cancelled' ? 'La place est rendue.' : booking?.status === 'present' ? 'Vous êtes là.' : 'C’est votre place.'}
    </Text>
    <Ticket m={m} filled={booking?.status !== 'cancelled'} />
    <Stub>
      <Text style={[s.label, {
        color: c.muted
      }]}>TALON N° {serialOf(id)} · MOMENT GPT 2</Text>
      <Copy>
        {m.address}
      </Copy>
      <Copy small>
        {booking?.deposit === 'released' ? 'Caution de 20 € rendue (simulation).' : 'Caution de 20 € réservée (simulation).'}
      </Copy>
    </Stub>
    {booking?.status === 'confirmed' ? <>
    <View style={s.note}>
      <Text style={s.label}>LA PRÉSENCE</Text>
      <Copy>
        {canAttend(m.startsAt, store.now) ? 'Vous pouvez signaler votre présence.' : `Votre présence sera visible dès ${new Intl.DateTimeFormat('fr-FR', {
            timeZone: 'Europe/Paris',
            hour: '2-digit',
            minute: '2-digit'
          }).format(m.startsAt - 15 * 60000)} (H−15).`}
      </Copy>
    </View>
    <Action label={canAttend(m.startsAt, store.now) ? 'Je suis là · rendre ma caution' : 'Présence disponible à H−15'} disabled={!canAttend(m.startsAt, store.now)} onPress={() => store.act(id, 'present')} />
        <View style={s.note}>
      <Text style={s.label}>UN IMPRÉVU ?</Text>
      <Copy>Un joker par mois pour rendre la place et récupérer votre caution.</Copy>
      {store.jokerUsed ? <Copy small>Votre joker du mois a déjà été utilisé.</Copy> : <Link label="Utiliser mon joker · rendre la place" onPress={() => {
          store.act(id, 'joker');
        }} />}
    </View>
    </> : <Action label="Retrouver les places" onPress={() => go('list')} />}
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
  note: {
    padding: 20,
    borderWidth: 1,
    borderColor: c.line,
    gap: 9
  }
});
