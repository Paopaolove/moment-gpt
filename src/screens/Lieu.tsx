import {
  StatePanel,
  Button,
  Card,
  Header,
  Notice,
  Page,
  Section,
  TableArt,
} from '../components';
import { StyleSheet, Text, View } from 'react-native';

import { dateLabel } from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { styles as s } from '../theme';
export function Lieu() {
  const { route, go } = useFlow();
  const { moments } = useStore();
  const m = moments.find((m) => m.id === route.id);
  if (!m)
    return (
      <Page>
        <Header title={'Une adresse\nà découvrir.'} />
        <StatePanel
          title="L’adresse n’est pas disponible."
          body="Cette invitation est introuvable dans la session. Choisissez une table sur la carte pour retrouver son lieu et son horaire."
          detail="Les lieux présentés sont des repères de démonstration, sans réservation réelle."
        />
        <Button
          primary
          title="Explorer la carte"
          onPress={() => go('Carte')}
        />
      </Page>
    );
  return (
    <Page>
      <Header
        eyebrow={`${m.category} · Paris ${m.district}e`}
        title={'La bonne\nadresse.'}
        subtitle="Le point de départ de votre prochaine conversation."
      />
      <TableArt
        label={
          m.category === 'Resto'
            ? 'une table dans le quartier'
            : 'un verre, et tout commence'
        }
      />
      <Card>
        <Text style={s.eyebrow}>{`Le lieu proposé par ${m.host}`}</Text>
        <Text style={s.heading}>{m.address}</Text>
        <Text style={s.muted}>
          Adresse déclarée par l’hôte. Les horaires et la disponibilité du lieu sont à
          vérifier auprès de lui.
        </Text>
      </Card>
      <Section
        label="Votre moment"
        value={dateLabel(m.startsAt)}
      />
      <Section
        label="À la table de"
        value={m.host}
      />
      <Notice>
        Repère indicatif sur notre carte stylisée de Paris. Aucun itinéraire ni
        géolocalisation en direct.
      </Notice>
      <View style={local.editorial}>
        <Text
          accessibilityRole="header"
          style={local.sectionTitle}
        >
          L’art de se retrouver.
        </Text>
        <Text style={local.intro}>Une bonne adresse. Un repère partagé.</Text>
        <View style={local.detailRow}>
          <Text style={local.number}>01</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Avant de partir</Text>
            <Text style={local.body}>
              Vérifiez l’adresse avec votre hôte dans la conversation. Une réservation
              ou une terrasse peut changer au dernier moment.
            </Text>
          </View>
        </View>
        <View style={local.detailRow}>
          <Text style={local.number}>02</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>À la porte</Text>
            <Text style={local.body}>
              Un message court suffit : « Je suis devant, où êtes-vous ? » Puis signalez
              votre présence dès H−15.
            </Text>
          </View>
        </View>
        <View style={local.footnote}>
          <Text style={local.detailTitle}>Le quartier vous attend.</Text>
          <Text style={local.body}>
            La carte est un schéma par arrondissement. Les horaires d’ouverture,
            itinéraires et disponibilités du lieu ne sont pas connectés.
          </Text>
        </View>
      </View>
      <Button
        primary
        title="Situer sur la carte  ↗"
        onPress={() => go('Carte', m.id)}
      />
      <Button
        title="Retrouver l’invitation"
        onPress={() => go('Detail', m.id)}
      />
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
