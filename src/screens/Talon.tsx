import { StyleSheet, Text, View } from 'react-native';
import { Carnet } from '../components/Carnet';
import { Action, Copy, Link } from '../components/Primitives';
import { Stamp } from '../components/Stamp';
import { Stub } from '../components/Stub';
import { serialOf, Ticket } from '../components/Ticket';
import { canAttend } from '../domain/rules';
import { c, sans, serif } from '../theme/tokens';
import { Journey } from '../useJourney';
export function Talon({ journey }: {
  journey: Journey;
}) {
  const { store, id, m, booking, go } = journey;
  return <View style={s.screen}>
    <Text style={s.label}>04 / VOTRE TALON</Text>
    <Text style={s.hero}>
      {booking?.status === 'cancelled' ? 'La place est rendue.' : booking?.status === 'present' ? 'Vous êtes là.' : 'C’est votre place.'}
    </Text>
    <Ticket m={m} taken={booking && ['confirmed', 'present'].includes(booking.status) ? 1 : 0}>
      {booking?.status === 'confirmed' && <Stamp />}
    </Ticket>
    <Stub>
      <Text style={[s.label, {
        color: c.muted
      }]}>TALON N° {serialOf(id)} · MOMENT GPT 3</Text>
      <Copy>
        {m.address}
      </Copy>
      <Copy small>
        {booking?.deposit === 'split' ? 'Caution répartie : 6,90 € Moment, 13,10 € hôte.' : booking?.deposit === 'released' ? 'Caution de 20 € rendue (simulation).' : 'Caution de 20 € réservée (simulation).'}
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
        <Copy>Un imprévu ? Votre joker du mois rend la place sans frais : la caution de 20 € vous est entièrement libérée. Sans joker, une annulation répartit la caution : 6,90 € Moment, 13,10 € hôte.</Copy>
        {store.jokerUsed ? <Copy small>Votre joker du mois a déjà été utilisé.</Copy> : <Link label="Utiliser mon joker · rendre la place" onPress={() => {
          store.act(id, 'joker');
        }} />}
        <Link label="Annuler sans joker · 6,90 € Moment, 13,10 € hôte" onPress={() => store.act(id, 'cancel')} />
      </View>
    </> : <Action label="Retrouver les places" onPress={() => go('list')} />}
    <Carnet journey={journey} />
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
  note: {
    padding: 20,
    borderWidth: 1,
    borderColor: c.line,
    gap: 9
  }
});
