import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Avatar, Button, Card, Header, Page, Pill, Section } from '../components';
import { RULES, dateLabel, euros } from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { styles as s } from '../theme';
export function Profil() {
  const { go } = useFlow();
  const {
    bookings,
    reviews,
    woman,
    setWoman,
    jokerUsed,
    now,
    advance,
    credits,
    momentCredits,
  } = useStore();
  const [demo, setDemo] = useState(false);
  return (
    <Page>
      <View style={s.row}>
        <Avatar
          name="Vous"
          size={84}
        />
        <Text style={s.eyebrow}>Membre de démonstration</Text>
      </View>
      <Header
        eyebrow="Votre place dans la ville"
        title={'Paris commence\navec vous.'}
        subtitle="Un profil simple. Des moments qui vous ressemblent."
      />
      <View style={local.metrics}>
        <View style={local.metric}>
          <Text style={local.metricValue}>
            {bookings
              .filter((b) => b.status === 'present')
              .length.toString()
              .padStart(2, '0')}
          </Text>
          <Text style={local.body}>moments vécus</Text>
        </View>
        <View style={local.metric}>
          <Text style={local.metricValue}>
            {reviews.length.toString().padStart(2, '0')}
          </Text>
          <Text style={local.body}>avis partagés</Text>
        </View>
      </View>
      <Card>
        <Text style={s.heading}>Un peu de vous.</Text>
        <Text style={s.muted}>
          Paris · aime les grandes conversations et les petites tables.
        </Text>
        <Pill
          title="Je suis une femme"
          selected={woman}
          onPress={() => setWoman(!woman)}
        />
        <Text style={s.muted}>
          Cette déclaration permet de rejoindre les invitations réservées aux femmes.
        </Text>
      </Card>
      <Section
        label="Joker ce mois-ci"
        value={jokerUsed ? 'Déjà utilisé' : '1 disponible'}
      />
      <Button
        title="Le droit à l’imprévu  ↗"
        onPress={() => go('Joker')}
      />
      <Button
        title="Les formules Moment  ↗"
        onPress={() => go('Abonnements')}
      />
      <Button
        title="Mes avis  ↗"
        onPress={() => go('Avis')}
      />
      <View style={local.editorial}>
        <Text
          accessibilityRole="header"
          style={local.sectionTitle}
        >
          Votre façon d’être à table.
        </Text>
        <Text style={local.intro}>Quelques détails suffisent pour se retrouver.</Text>
        <View style={local.detailRow}>
          <Text style={local.number}>01</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Vos quartiers de cœur</Text>
            <Text style={local.body}>
              Le canal Saint-Martin pour un verre, le 11e pour les bistrots, le Marais
              pour une soirée qui se prolonge. Exemple de profil.
            </Text>
          </View>
        </View>
        <View style={local.detailRow}>
          <Text style={local.number}>02</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Vos envies</Text>
            <Text style={local.body}>
              Cuisine de saison, terrasses et conversations curieuses. Vous pourrez en
              parler à votre hôte après confirmation.
            </Text>
          </View>
        </View>
        <View style={local.footnote}>
          <Text style={local.detailTitle}>Votre confiance, au quotidien.</Text>
          <Text style={local.body}>
            Les avis suivent une présence enregistrée. Aucun avis n’est encore
            disponible ? Votre premier moment est un beau point de départ.
          </Text>
        </View>
      </View>
      <Button
        primary
        title="Ouvrir ma table  ↗"
        onPress={() => go('Publier')}
      />
      <Button
        title={demo ? 'Fermer l’atelier démo' : 'Ouvrir l’atelier démo'}
        onPress={() => setDemo(!demo)}
      />
      {demo && (
        <Card>
          <Text style={s.eyebrow}>Horloge de simulation</Text>
          <Text style={s.muted}>{`${dateLabel(now)} · ${RULES.timezone}`}</Text>
          {[10, 45, 31 * 1440].map((n) => (
            <Button
              key={n}
              title={n > 100 ? 'Avancer de 31 jours' : `Avancer de ${n} minutes`}
              onPress={() => advance(n)}
            />
          ))}
          <Text
            style={s.muted}
          >{`Crédits fictifs : Moment ${euros(momentCredits)} · hôtes ${euros(Object.values(credits).reduce((a, b) => a + b, 0))}`}</Text>
        </Card>
      )}
      <Text style={s.muted}>
        Tout reste en mémoire pendant cette session. Les paiements, les conversations et
        les profils sont des simulations.
      </Text>
    </Page>
  );
}
const local = StyleSheet.create({
  metrics: {
    flexDirection: 'row',
    gap: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#DCD1C1',
    paddingVertical: 24,
  },
  metric: {
    flex: 1,
    gap: 8,
  },
  metricValue: {
    fontSize: 40,
    color: '#A44832',
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
