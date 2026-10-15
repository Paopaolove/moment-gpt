import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { c, serif } from '../theme/tokens';
import { Copy, Action, Link, Tear } from '../components/Primitives';
import { Ticket, TicketShell } from '../components/Ticket';
import { Stamp } from '../components/Stamp';
import { euros } from '../domain/rules';
import { Journey } from '../useJourney';
export function PrendrePlace({
  journey
}: {
  journey: Journey;
}) {
  const {
    store,
    id,
    m,
    go,
    remaining,
    expired
  } = journey;
  if (journey.booking?.status === 'requested') return <View style={s.screen}>
    <Text style={s.label}>03 / DEMANDE ENVOYÉE</Text>
    <Text style={s.hero}>L’hôte vous répond.</Text>
    <Ticket m={m}><Stamp label="EN ATTENTE" /></Ticket>
    <Copy>Votre demande a été envoyée à {m.host}. Le délai de confirmation commencera après son acceptation.</Copy>
    <Link label="Démo · simuler l’acceptation de l’hôte" onPress={() => store.act(id, 'accept', true)} />
  </View>;
  return <View style={s.screen}>
    <Text style={s.label}>03 / PRENDRE LA PLACE</Text>
    <Text style={s.hero}>
      {expired ? 'Le temps a filé.' : 'Une place, à votre nom.'}
    </Text>
    <Copy>{m.title} · {m.host}</Copy>
    <TicketShell>
      {!expired && <Stamp />}
      <Text style={[s.label, {
        color: c.muted
      }]}>
        {expired ? 'BILLET EXPIRÉ' : 'L’HÔTE A ACCEPTÉ · SIMULATION'}
      </Text>
      <Text accessibilityRole="timer" numberOfLines={1} adjustsFontSizeToFit style={s.clock}>{String(Math.floor(remaining / 60)).padStart(2, '0')}:{String(remaining % 60).padStart(2, '0')}</Text>
      <View accessibilityLabel={`${remaining} secondes restantes sur 600`} style={s.track}>
        <View style={{
          height: 5,
          width: `${remaining / 6}%`,
          backgroundColor: c.ink
        }} />
      </View>
      <Copy small>
        {expired ? 'Votre place n’est plus retenue. Aucune caution réservée.' : 'Vous avez 10 minutes pour confirmer. Après, la place est libérée.'}
      </Copy>
      <Tear />
      <Text style={s.amount}>20 € de caution</Text>
      <Copy>Rendue si présent ;
 sinon 6,90 € pour Moment et 13,10 € pour l’hôte.</Copy>
      <Copy small>L’invitation de {euros(m.price)} est offerte par l’hôte. La caution est distincte.</Copy>
    </TicketShell>
    <Action label={expired ? 'Trouver une autre place' : 'Confirmer · caution 20 €'} onPress={() => {
      if (expired) go('list');else {
        store.act(id, 'confirm');
        go('confirmed');
      }
    }} />
    <Copy small>Simulation uniquement. Aucun paiement ni prélèvement.</Copy>
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
  amount: {
    fontFamily: serif,
    fontSize: 27,
    color: c.ink
  },
  clock: {
    fontSize: 104,
    fontFamily: serif,
    letterSpacing: -4,
    color: c.ink,
    fontVariant: ['tabular-nums'],
    marginVertical: 18
  },
  track: {
    height: 5,
    backgroundColor: c.line,
    marginBottom: 18
  }
});
