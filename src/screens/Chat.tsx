import {
  StatePanel,
  Pill,
  Avatar,
  Button,
  Card,
  Field,
  Header,
  Notice,
  Page,
} from '../components';

import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';

import { RULES, canAttend, dateLabel, euros } from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { colors, styles as s } from '../theme';
export function Chat() {
  const { route, go } = useFlow();
  const { moments, bookings, chatMessages, sendMessage, now, act } = useStore();
  const m = moments.find((m) => m.id === route.id);
  const b = bookings.find((b) => b.momentId === route.id);
  const [draft, setDraft] = useState('');
  const messages = chatMessages.filter((message) => message.momentId === route.id);
  if (!m || !b || !['confirmed', 'present'].includes(b.status))
    return (
      <Page>
        <Header
          title={
            b && ['expired', 'cancelled'].includes(b.status)
              ? 'La soirée a changé.'
              : 'La conversation\ncommence bientôt.'
          }
          subtitle="Confirmez une place pour retrouver votre table."
        />
        <StatePanel
          title={
            b?.status === 'expired'
              ? 'Confirmation expirée.'
              : b?.status === 'cancelled'
                ? 'Place annulée.'
                : 'Votre table, bientôt ici.'
          }
          body="La conversation est accessible après confirmation. Les détails du rendez-vous et le bouton de présence vous y attendent."
          detail="Vos messages restent locaux dans cette démonstration."
        />
        <Button
          primary
          title="Voir mes demandes"
          onPress={() => go('Demandes')}
        />
      </Page>
    );
  return (
    <Page>
      <View style={s.row}>
        <Avatar name={m.host} />
        <View
          style={{
            flex: 1,
          }}
        >
          <Text style={s.heading}>{`${m.host} & vous`}</Text>
          <Text style={s.muted}>Conversation de démonstration</Text>
        </View>
      </View>
      <Header
        eyebrow="Votre prochain moment"
        title={'À tout\nà l’heure.'}
        subtitle={m.title}
      />
      <Card>
        <Text style={s.eyebrow}>Message d’accueil · exemple</Text>
        <Text
          style={s.text}
        >{`Bienvenue ! Je vous attends à la table près de la fenêtre. Demandez ${m.host} en arrivant. Avec ou sans alcool, venez comme vous êtes.`}</Text>
        <Text style={s.muted}>{dateLabel(m.startsAt)}</Text>
      </Card>
      {!messages.length && (
        <Notice>
          Votre premier message peut être tout simple : « À tout à l’heure ! » Aucun
          message envoyé pour le moment.
        </Notice>
      )}
      {messages.map((text, i) => (
        <View
          key={i}
          style={{
            backgroundColor: colors.ink,
            borderRadius: 22,
            borderBottomRightRadius: 4,
            padding: 20,
            marginLeft: 35,
          }}
        >
          <Text
            style={[
              s.text,
              {
                color: colors.paper,
              },
            ]}
          >
            {text.text}
          </Text>
          <Text
            style={{
              color: colors.line,
              marginTop: 8,
              fontSize: 11,
            }}
          >
            {`Vous · ${new Intl.DateTimeFormat('fr-FR', {
              timeZone: RULES.timezone,
              hour: '2-digit',
              minute: '2-digit',
            }).format(text.sentAt)} · local`}
          </Text>
        </View>
      ))}
      <View style={s.wrap}>
        {[
          'À tout à l’heure !',
          'Je suis devant le lieu.',
          'Où se trouve la table ?',
        ].map((reply) => (
          <Pill
            key={reply}
            title={reply}
            onPress={() => setDraft(reply)}
          />
        ))}
      </View>
      <Field
        label="Votre message"
        placeholder="Un petit mot avant de se retrouver…"
        value={draft}
        onChangeText={setDraft}
        multiline
        maxLength={1000}
      />
      <Button
        disabled={!draft.trim()}
        title="Envoyer mon message  ↑"
        onPress={() => {
          sendMessage(m.id, draft.trim());
          setDraft('');
        }}
      />
      <Button
        title="Retrouver l’adresse  ↗"
        onPress={() => go('Lieu', m.id)}
      />
      <View style={local.editorial}>
        <Text
          accessibilityRole="header"
          style={local.sectionTitle}
        >
          Le rendez-vous se précise.
        </Text>
        <Text style={local.intro}>
          Quelques mots utiles, puis place à la vraie vie.
        </Text>
        <View style={local.detailRow}>
          <Text style={local.number}>01</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Un repère facile</Text>
            <Text style={local.body}>
              Demandez à votre hôte où se trouve la table : en terrasse, près de la
              fenêtre ou au fond de la salle.
            </Text>
          </View>
        </View>
        <View style={local.detailRow}>
          <Text style={local.number}>02</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Un léger retard ?</Text>
            <Text style={local.body}>
              Prévenez ici avec votre heure d’arrivée. La présence se signale sur place,
              à partir de H−15.
            </Text>
          </View>
        </View>
        <View style={local.footnote}>
          <Text style={local.detailTitle}>Une conversation locale.</Text>
          <Text style={local.body}>
            Les messages de ce prototype restent dans cette session. Si votre place est
            annulée, retrouvez son statut dans Mes moments.
          </Text>
        </View>
      </View>
      {b.status === 'confirmed' && (
        <Button
          primary
          disabled={!canAttend(m.startsAt, now)}
          title={
            canAttend(m.startsAt, now)
              ? 'Je suis sur place  ✓'
              : 'Présence disponible dès H−15'
          }
          onPress={() => act(m.id, 'present')}
        />
      )}
      {b.status === 'confirmed' && !canAttend(m.startsAt, now) && (
        <Notice>{`Le bouton de présence s’activera dès H−${RULES.presenceBeforeMinutes}, à ${dateLabel(m.startsAt - RULES.presenceBeforeMinutes * 60000)}.`}</Notice>
      )}
      {b.status === 'present' && (
        <>
          <Notice>{`Présence enregistrée. Votre caution fictive de ${euros(RULES.deposit)} est libérée.`}</Notice>
          <Button
            primary
            title="Raconter ce moment"
            onPress={() => go('Avis', m.id)}
          />
        </>
      )}
      {b.status === 'confirmed' && (
        <Button
          title="Un imprévu ?"
          onPress={() => go('Joker', m.id)}
        />
      )}
    </Page>
  );
}
const local = StyleSheet.create({
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
