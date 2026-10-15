import {
  StatePanel,
  Button,
  Card,
  Countdown,
  Header,
  Notice,
  Page,
  Section,
} from '../components';
import { StyleSheet, Text, View } from 'react-native';

import { RULES, euros } from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { styles as s } from '../theme';
export function Confirmation() {
  const { route, go } = useFlow();
  const { bookings, moments, now, act } = useStore();
  const b = bookings.find((b) => b.momentId === route.id);
  const m = moments.find((m) => m.id === route.id);
  if (!m || !b)
    return (
      <Page>
        <Header
          title="Une place à choisir."
          subtitle="Votre prochain rendez-vous commence par une invitation."
        />
        <StatePanel
          title="Pas encore de place réservée."
          body="Demandez une place dans le fil. Après l’accord de l’hôte, vous retrouverez ici les 10 minutes pour confirmer."
          detail="Aucune caution réservée à ce stade."
        />
        <Button
          primary
          title="Voir les invitations"
          onPress={() => go('Fil')}
        />
      </Page>
    );
  const accepted = b.status === 'accepted';
  return (
    <Page>
      <Header
        eyebrow="Le petit oui qui change la soirée"
        title={
          accepted
            ? 'Cette place,\nelle est pour vous.'
            : b.status === 'expired'
              ? 'Une prochaine fois.'
              : ['confirmed', 'present'].includes(b.status)
                ? 'C’est dans l’agenda.'
                : 'Chaque soirée a sa suite.'
        }
        subtitle={`${m.title} · avec ${m.host}`}
      />
      {(accepted || b.status === 'expired') && b.acceptedAt !== undefined && (
        <Countdown
          acceptedAt={b.acceptedAt}
          now={now}
        />
      )}
      {b.status === 'expired' && (
        <StatePanel
          tone="attention"
          title="Le délai est écoulé."
          body="Les 10 minutes sont passées. Cette place n’a pas été confirmée et aucune caution n’a été réservée."
          detail="Une prochaine table vous attend dans le fil."
        />
      )}
      {b.status === 'cancelled' && (
        <StatePanel
          title="Cette place a été annulée."
          body="Retrouvez le détail de votre réservation dans Mes moments avant de choisir une nouvelle invitation."
        />
      )}
      <Card>
        <View style={local.depositHeading}>
          <Text style={s.heading}>Une promesse de présence.</Text>
          <Text style={s.heading}>{euros(RULES.deposit)}</Text>
        </View>
        <Text
          style={s.muted}
        >{`La caution est réservée à la confirmation, puis libérée lorsque vous signalez votre présence, dès H−${RULES.presenceBeforeMinutes}.`}</Text>
        <Section
          label="Annulation sans Joker"
          value={euros(RULES.deposit)}
        />
        <Section
          label="Part Moment"
          value={euros(RULES.momentShare)}
        />
        <Section
          label="Part de l’hôte"
          value={euros(RULES.hostShare)}
        />
      </Card>
      <Notice>{`Simulation uniquement : aucun moyen de paiement demandé, aucun débit. L’invitation de ${euros(m.price)} est distincte de la caution.`}</Notice>
      <View style={local.editorial}>
        <Text
          accessibilityRole="header"
          style={local.sectionTitle}
        >
          Un engagement tout simple.
        </Text>
        <Text style={local.intro}>On réserve une place. On tient parole.</Text>
        <View style={local.detailRow}>
          <Text style={local.number}>01</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>À votre arrivée</Text>
            <Text style={local.body}>
              Dès 15 minutes avant le rendez-vous, le bouton de présence devient
              disponible dans la conversation. Les 20 € sont alors rendus.
            </Text>
          </View>
        </View>
        <View style={local.detailRow}>
          <Text style={local.number}>02</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>En cas d’imprévu</Text>
            <Text style={local.body}>
              Un Joker par mois civil permet d’annuler une place confirmée et de
              récupérer la caution. Une annulation par l’hôte la libère aussi.
            </Text>
          </View>
        </View>
        <View style={local.footnote}>
          <Text style={local.detailTitle}>Pourquoi cette caution ?</Text>
          <Text style={local.body}>
            Une chaise vide change une petite tablée. Sans Joker, une annulation après
            confirmation répartit 6,90 € à Moment et 13,10 € à l’hôte. L’invitation
            reste distincte.
          </Text>
        </View>
      </View>
      {accepted ? (
        <Button
          primary
          title={`Confirmer · caution fictive ${euros(RULES.deposit)}`}
          onPress={() => {
            act(m.id, 'confirm');
            go('Chat', m.id);
          }}
        />
      ) : (
        <>
          <Text style={s.muted}>
            {b.status === 'expired'
              ? 'Les 10 minutes sont écoulées. Aucune caution n’a été réservée.'
              : 'Retrouvez le statut de votre place dans vos demandes.'}
          </Text>
          <Button
            primary
            title="Retrouver mes demandes"
            onPress={() => go('Demandes')}
          />
        </>
      )}
    </Page>
  );
}
const local = StyleSheet.create({
  depositHeading: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  editorial: {
    paddingTop: 32,
    gap: 24,
    borderTopWidth: 1,
    borderTopColor: '#DCD1C1',
  },
  sectionTitle: {
    fontSize: 29,
    lineHeight: 36,
    letterSpacing: -0.8,
    color: '#292F29',
    fontWeight: '500',
  },
  intro: {
    fontSize: 17,
    lineHeight: 27,
    color: '#696B60',
    maxWidth: 440,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 18,
    paddingVertical: 12,
  },
  number: {
    color: '#A44832',
    fontSize: 12,
    letterSpacing: 1,
    paddingTop: 4,
  },
  detailCopy: {
    flex: 1,
    gap: 10,
  },
  detailTitle: {
    color: '#292F29',
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '600',
  },
  body: {
    color: '#696B60',
    fontSize: 15,
    lineHeight: 25,
  },
  footnote: {
    backgroundColor: '#EEE6D9',
    borderRadius: 22,
    padding: 24,
    gap: 12,
  },
});
