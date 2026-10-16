import { Marquee } from '../components/Funky';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Countdown, FuseBar, Pulse } from '../components/MotionDetails';
import { Action, Copy, Tear } from '../components/Primitives';
import { Stamp } from '../components/Stamp';
import { Ticket, TicketShell } from '../components/Ticket';
import { euros } from '../domain/rules';
import { c, medium, sans, serif } from '../theme/tokens';
import { Journey } from '../useJourney';
export function PrendrePlace({ journey }: {
  journey: Journey;
}) {
  const { store, id, m, go, remaining, expired } = journey;
  const accept = useRef(store.act);
  accept.current = store.act;
  useEffect(() => {
    if(journey.booking?.status !== 'requested')
      return;
    const timer = setTimeout(() => accept.current(id, 'accept', true), 2500);
    return () => clearTimeout(timer);
  }, [id, journey.booking?.status]);
  if(journey.booking?.status === 'requested')
    return <View style={s.screen}>
      <Text style={s.label}>03 / DEMANDE ENVOYÉE</Text>
      <Text style={s.hero}>Votre invitation entre en scène.</Text><Pulse dots /><Copy small>Démo : l’hôte accepte automatiquement</Copy>
      <Ticket m={m}><Stamp label="EN ATTENTE" /></Ticket>
      <Copy>Votre demande a été envoyée à {m.host}. Le délai de confirmation commencera après son acceptation.</Copy>

    </View>;
  return <View style={s.screen}>
    <Text style={s.label}>03 / PRENDRE LA PLACE</Text><Marquee text="ACCEPTÉ · À VOUS DE JOUER · " />
    <Text style={s.hero}>
      {expired ? 'Le temps a filé.' : 'Le grand oui !'}
    </Text>
    <Copy>{m.title} · {m.host}</Copy>
    <TicketShell>
      {!expired && <Stamp label="ACCEPTÉ" />}
      <Text style={[s.label, {
        color: c.muted
      }]}>
        {expired ? 'BILLET EXPIRÉ' : 'L’HÔTE A ACCEPTÉ · SIMULATION'}
      </Text>
      <Countdown seconds={remaining} />
      <FuseBar seconds={remaining} total={(journey.booking?.confirmationMinutes ?? 10) * 60} />
      <Copy small>
        {expired ? 'Votre place n’est plus retenue. Aucune caution réservée.' : `Vous avez ${journey.booking?.confirmationMinutes ?? 10} min pour confirmer. Après, la place est libérée.`}
      </Copy>
      <Tear />
      <Text style={s.amount}>20 € de caution</Text>
      <Copy>Rendue si présent ;
        sinon 6,90 € pour Moment et 13,10 € pour l’hôte.</Copy>
      <Copy small>L’invitation de {euros(m.price)} est offerte par l’hôte. La caution est distincte.</Copy>
    </TicketShell>
    <Action label={expired ? 'Trouver une autre place' : 'Confirmer · caution 20 €'} onPress={() => {
      if(expired)
        go('list');
      else {
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
    fontSize: 52,
    lineHeight: 62,
    letterSpacing: -1.8,
    color: c.light
  },
  amount: {
    fontFamily: serif,
    fontSize: 27,
    color: c.ink
  },

});
