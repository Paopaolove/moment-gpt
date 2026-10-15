import { View, StyleSheet, Text } from 'react-native';
import { Button, Card, Header, MomentCard, Notice, Page } from '../components';
import { dateLabel } from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { colors, styles as s } from '../theme';
const labels = {
  requested: 'En attente de l’hôte',
  accepted: 'Une place vous attend',
  confirmed: 'C’est confirmé',
  present: 'Vous y êtes',
  cancelled: 'Annulé',
  expired: 'Délai écoulé',
};
export function Demandes() {
  const { moments, bookings, act, message, now } = useStore();
  const { go } = useFlow();
  return (
    <Page>
      <Header
        eyebrow="Votre carnet de sorties"
        title={'De belles choses\nse préparent.'}
        subtitle="Vos demandes et vos invitations, au même endroit."
      />
      <View style={local.agenda}>
        <View style={local.agendaItem}>
          <Text style={local.agendaNumber}>
            {bookings
              .filter((b) => ['accepted', 'confirmed'].includes(b.status))
              .length.toString()
              .padStart(2, '0')}
          </Text>
          <Text style={s.muted}>à préparer</Text>
        </View>
        <View style={local.agendaItem}>
          <Text style={local.agendaNumber}>
            {moments
              .filter((m) => m.own)
              .length.toString()
              .padStart(2, '0')}
          </Text>
          <Text style={s.muted}>tables ouvertes</Text>
        </View>
      </View>
      <Text style={s.eyebrow}>Vous rejoignez une table</Text>
      {!bookings.length && (
        <Card>
          <Text style={s.heading}>Le premier pas, c’est une envie.</Text>
          <Text style={s.muted}>
            Demandez une place dans le fil. L’hôte pourra ensuite vous accueillir.
          </Text>
        </Card>
      )}
      {bookings.map((b) => {
        const m = moments.find((m) => m.id === b.momentId);
        if (!m) return null;
        return (
          <Card key={m.id}>
            <Text
              style={[
                s.eyebrow,
                {
                  color: colors.accent,
                },
              ]}
            >
              {labels[b.status]}
            </Text>
            <Text style={s.heading}>{m.title}</Text>
            <Text style={s.muted}>{`${dateLabel(m.startsAt)} · avec ${m.host}`}</Text>
            {b.status === 'requested' && (
              <>
                <Notice>
                  Démo : essayez l’acceptation de l’hôte pour découvrir la suite du
                  parcours.
                </Notice>
                <Button
                  title="Simuler l’accord de l’hôte"
                  onPress={() => {
                    act(m.id, 'accept', true);
                    go('Confirmation', m.id);
                  }}
                />
                <Button
                  title="Retirer ma demande"
                  onPress={() => act(m.id, 'cancel')}
                />
              </>
            )}
            {b.status === 'accepted' && (
              <Button
                title="Confirmer dans les 10 minutes  →"
                onPress={() => go('Confirmation', m.id)}
              />
            )}
            {(b.status === 'confirmed' || b.status === 'present') && (
              <Button
                title="Ouvrir la conversation  →"
                onPress={() => go('Chat', m.id)}
              />
            )}
            {b.status === 'expired' && (
              <Notice>
                Aucune caution réservée. Le délai de confirmation est écoulé.
              </Notice>
            )}
            <Button
              title="Voir l’invitation"
              onPress={() => go('Detail', m.id)}
            />
          </Card>
        );
      })}
      <Text style={s.eyebrow}>Vous ouvrez votre table</Text>
      {moments
        .filter((m) => m.own)
        .map((m) => (
          <MomentCard
            key={m.id}
            moment={m}
            onPress={() => go('Detail', m.id)}
          />
        ))}
      {!moments.some((m) => m.own) && (
        <Text style={s.muted}>
          Votre prochaine table commence peut-être ici. L’hôte ne paie pas d’abonnement.
        </Text>
      )}
      {!bookings.length && moments.some((m) => !m.own && m.startsAt > now) && (
        <View style={local.footnote}>
          <Text style={s.eyebrow}>Une idée pour commencer</Text>
          <Text style={s.heading}>
            {moments.find((m) => !m.own && m.startsAt > now)?.title}
          </Text>
          <Text style={s.muted}>
            Une invitation de démonstration vous attend dans le fil. Choisissez votre
            table pour vivre le parcours complet.
          </Text>
        </View>
      )}
      {!!message && <Notice>{message}</Notice>}
      <View style={local.editorial}>
        <Text
          accessibilityRole="header"
          style={local.sectionTitle}
        >
          Du premier oui au rendez-vous.
        </Text>
        <Text style={local.intro}>
          Chaque étape a sa place. Vous savez toujours où vous en êtes.
        </Text>
        <View style={local.detailRow}>
          <Text style={local.number}>01</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Demande envoyée</Text>
            <Text style={local.body}>
              Votre hôte prend le temps de vous répondre. Vous pouvez retirer votre
              demande tant que vous n’avez pas confirmé.
            </Text>
          </View>
        </View>
        <View style={local.detailRow}>
          <Text style={local.number}>02</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Invitation acceptée</Text>
            <Text style={local.body}>
              Votre place vous attend pendant 10 minutes. Passé ce délai, la demande
              expire sans réserver de caution.
            </Text>
          </View>
        </View>
        <View style={local.detailRow}>
          <Text style={local.number}>03</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Rendez-vous confirmé</Text>
            <Text style={local.body}>
              La conversation s’ouvre. Dès H−15, signalez votre présence pour libérer la
              caution de 20 €.
            </Text>
          </View>
        </View>
        <View style={local.footnote}>
          <Text style={local.detailTitle}>Un changement de programme ?</Text>
          <Text style={local.body}>
            Une place confirmée peut être annulée avec votre Joker mensuel. Si l’hôte
            annule, votre caution est libérée sans utiliser de Joker.
          </Text>
        </View>
      </View>
      <Button
        primary
        title="Découvrir les invitations  ↗"
        onPress={() => go('Fil')}
      />
    </Page>
  );
}
const local = StyleSheet.create({
  agenda: {
    flexDirection: 'row',
    gap: 28,
    borderBottomWidth: 1,
    borderColor: colors.line,
    paddingBottom: 28,
  },
  agendaItem: {
    flex: 1,
    gap: 8,
  },
  agendaNumber: {
    fontSize: 44,
    color: colors.accent,
    fontVariant: ['tabular-nums'],
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
