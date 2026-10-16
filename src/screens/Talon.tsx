import { FlyingStub } from '../components/Funky';
import { StyleSheet, Text, View } from 'react-native';
import { Carnet } from '../components/Carnet';
import { Action, Copy, Link } from '../components/Primitives';
import { Stamp } from '../components/Stamp';
import { Stub } from '../components/Stub';
import { serialOf, Ticket } from '../components/Ticket';
import { formatDelay } from '../domain/presentation';
import { canAttend } from '../domain/rules';
import { c, medium, sans, serif } from '../theme/tokens';
import { Journey } from '../useJourney';
export function Talon({ journey }: {
  journey: Journey;
}) {
  const { store, id, m, booking, go } = journey;
  const { remaining, total, presences } = store.jokers;
  const toBonus = Math.max(0, 3 - presences);
  return <View style={s.screen}>
    <Text style={s.label}>04 / VOTRE TALON</Text>
    <Text style={s.hero}>
      {booking?.status === 'cancelled' ? 'La place est rendue.' : booking?.status === 'present' ? 'Vous êtes là.' : 'C’est votre place.'}
    </Text>
    <FlyingStub><View style={{ gap: 0, marginBottom: 16 }}><Ticket compact now={store.now} m={m} taken={booking && ['confirmed', 'present'].includes(booking.status) ? 1 : 0}>
      {booking?.status === 'confirmed' && <Stamp />}
    </Ticket>
    <Stub category={m.category}>
      <Text style={[s.label, {
        color: m.category === 'Nuit' ? c.light : c.ink
      }, { fontSize: 13, letterSpacing: 1 }]}>TALON N° {serialOf(id)} · FUNKY</Text>
      <Text style={{fontFamily: sans, color: m.category === 'Nuit' ? c.light : c.ink, fontSize:16, lineHeight:25}}>{m.address}</Text>
      <Text style={{fontFamily: sans, color: m.category === 'Nuit' ? c.light : c.ink, fontSize:14, lineHeight:21}}>
        {booking?.deposit === 'split' ? 'Caution répartie : 6,90 € Moment, 13,10 € hôte.' : booking?.deposit === 'released' ? 'Caution de 20 € rendue (simulation).' : 'Caution de 20 € réservée (simulation).'}
      </Text>
    </Stub></View></FlyingStub>
    {booking?.status === 'confirmed' ? <>
      {canAttend(m.startsAt, store.now) ? <Action label="Je suis là · rendre ma caution" onPress={() => store.act(id, 'present')} /> : <View style={s.locked}>
        <View accessibilityElementsHidden style={{ width: 16, height: 22, alignItems: 'center' }}><View style={{ width: 10, height: 10, borderWidth: 1.5, borderColor: c.light, borderTopLeftRadius: 6, borderTopRightRadius: 6 }} /><View style={{ width: 16, height: 12, borderWidth: 1.5, borderColor: c.light, marginTop: -2 }} /></View>
        <Text style={{ color: c.light, fontFamily: sans, fontSize: 14, flex: 1, minWidth: 0 }}>Ouvre à {new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' }).format(m.startsAt - 15 * 60000)} · {formatDelay(m.startsAt - 15 * 60000, store.now)}</Text>
      </View>}
      <View style={s.note}>
        <Text style={s.label}>UN IMPRÉVU ?</Text>
        <View style={s.gauge}>
          <Text style={s.balance}>{remaining} joker{remaining > 1 ? 's' : ''} disponible{remaining > 1 ? 's' : ''}</Text>
          <View style={s.jokers}>
            {[0, 1].map(i => {
              const available = i < remaining;
              const locked = i >= total;
              return <View key={i} accessibilityLabel={`Joker ${i + 1} : ${available ? 'disponible' : locked ? 'verrouillé' : 'utilisé'}`} style={[s.joker, { backgroundColor: available ? c.yellow : 'transparent', borderStyle: locked ? 'dashed' : 'solid' }]}>
                <Text style={{ fontFamily: serif, fontSize: 24, color: available ? c.ink : c.line }}>{available ? '✦' : locked ? '+' : '✓'}</Text>
                <Text style={{ fontFamily: medium, fontSize: 12, color: available ? c.ink : c.light }}>{available ? 'DISPONIBLE' : locked ? 'VERROUILLÉ' : 'UTILISÉ'}</Text>
              </View>;
            })}
          </View>
          <View accessibilityLabel={`${Math.min(presences, 3)} présences sur 3 vers le deuxième joker`} style={s.stars}>
            {[0, 1, 2].map(i => <Text key={i} style={{ fontSize: 26, color: presences > i ? c.yellow : c.line }}>{presences > i ? '★' : '☆'}</Text>)}
            <Text style={{ fontFamily: medium, color: c.yellow, fontSize: 14 }}>→ 2e joker</Text>
          </View>
          <Copy small>{toBonus > 0 ? `Encore ${toBonus} présence${toBonus > 1 ? 's' : ''} ce mois pour gagner un 2e joker` : '2e joker gagné ce mois. Bravo pour vos présences !'}</Copy>
        </View>
        <Copy>Votre joker du mois rend la place sans frais : la caution de 20 € vous est entièrement libérée. Sans joker, une annulation répartit la caution : 6,90 € Moment, 13,10 € hôte.</Copy>
        {store.jokerUsed ? <Copy small>Aucun joker disponible. Le bonus arrive à la troisième présence du mois.</Copy> : <Link label="Utiliser mon joker · rendre la place" onPress={() => {
          store.act(id, 'joker');
        }} />}
        <Link label="Annuler sans joker · 6,90 € Moment, 13,10 € hôte" onPress={() => store.act(id, 'cancel')} />
      </View>
    </> : <Action label="Retrouver les places" onPress={() => go('list')} />}
    <Carnet journey={journey} />
  </View>;
}
const s = StyleSheet.create({
  gauge: { gap: 12, paddingVertical: 10 },
  balance: { fontFamily: serif, fontSize: 23, color: c.light },
  jokers: { flexDirection: 'row', gap: 10 },
  joker: { flex: 1, minWidth: 0, minHeight: 82, borderWidth: 2, borderColor: c.yellow, borderRadius: 6, alignItems: 'center', justifyContent: 'center', gap: 4 },
  stars: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 },
  locked: { borderTopWidth: 1, borderStyle: 'dashed', borderColor: c.line, paddingVertical: 20, flexDirection: 'row', alignItems: 'center', gap: 12 },
  screen: {
    gap: 22
  },
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
    fontSize: 42,
    lineHeight: 48,
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
