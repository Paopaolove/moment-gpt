import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import {
  Button,
  Card,
  Header,
  Notice,
  Page,
  Pill,
  Section,
  PressableScale,
} from '../components';
import { RULES, euros } from '../domain/rules';
import { colors, styles as s } from '../theme';
export function Abonnements() {
  const [selected, setSelected] = useState('Découverte');
  const [preview, setPreview] = useState(false);
  return (
    <Page>
      <Header
        eyebrow="Plus de tables, plus de possibles"
        title={'Sortez de\nl’ordinaire.'}
        subtitle="Moment fait une place aux liens qui se créent dans la vraie vie."
      />
      <Card>
        <Text
          style={[
            s.eyebrow,
            {
              color: colors.accent,
            },
          ]}
        >
          Pour les hôtes
        </Text>
        <Text style={s.title}>Toujours gratuit.</Text>
        <Text style={s.text}>
          Ouvrir une table ne nécessite aucun abonnement. Le plaisir d’accueillir
          suffit.
        </Text>
        <Text
          style={s.muted}
        >{`${euros(RULES.hostSubscription)} d’abonnement hôte`}</Text>
      </Card>
      <View style={local.plans}>
        {[
          {
            name: 'Découverte',
            label: 'Le premier pas',
            description:
              'Pour suivre une envie et découvrir une nouvelle table, à votre rythme.',
            features: 'Les invitations · La conversation · Les avis après présence',
          },
          {
            name: 'Les habitués',
            label: 'Le plaisir de revenir',
            description:
              'Pour celles et ceux qui aiment faire une place aux sorties dans leur semaine.',
            features: 'Même esprit, mêmes engagements · Conditions invités à venir',
          },
        ].map((plan) => (
          <PressableScale
            key={plan.name}
            accessibilityRole="radio"
            accessibilityState={{
              checked: selected === plan.name,
            }}
            onPress={() => {
              setSelected(plan.name);
              setPreview(false);
            }}
            style={[local.plan, selected === plan.name && local.planSelected]}
          >
            <View style={s.row}>
              <Text style={s.eyebrow}>{plan.label}</Text>
              <Text style={local.planMark}>{selected === plan.name ? '◉' : '○'}</Text>
            </View>
            <Text style={s.heading}>{plan.name}</Text>
            <Text style={s.muted}>{plan.description}</Text>
            <Text style={local.planFeatures}>{plan.features}</Text>
            <Text style={s.eyebrow}>Tarif invité à venir</Text>
          </PressableScale>
        ))}
      </View>
      <Text style={s.heading}>
        {selected === 'Découverte'
          ? 'Commencer par une rencontre.'
          : 'Faire des sorties une habitude.'}
      </Text>
      <Section
        label="Invitations à Paris"
        value="Resto & Bar"
      />
      <Section
        label="Le droit à l’imprévu"
        value={`${RULES.jokerPerMonth} Joker / mois`}
      />
      <Section
        label="Caution par confirmation"
        value={euros(RULES.deposit)}
      />
      <Notice>
        Les offres et tarifs invités ne sont pas commercialisés dans ce prototype. Cette
        page permet de découvrir le principe, sans souscription.
      </Notice>
      <View style={local.editorial}>
        <Text
          accessibilityRole="header"
          style={local.sectionTitle}
        >
          Le lien avant la formule.
        </Text>
        <Text style={local.intro}>
          Des principes simples, quelle que soit votre façon de sortir.
        </Text>
        <View style={local.detailRow}>
          <Text style={local.number}>01</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Accueillir reste gratuit</Text>
            <Text style={local.body}>
              L’hôte ne paie aucun abonnement pour ouvrir sa table. Une bonne adresse et
              l’envie de partager suffisent.
            </Text>
          </View>
        </View>
        <View style={local.detailRow}>
          <Text style={local.number}>02</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Les mêmes engagements</Text>
            <Text style={local.body}>
              Une caution de 20 €, 10 minutes pour confirmer et un Joker par mois.
              Aucune formule ne dispense de tenir parole.
            </Text>
          </View>
        </View>
        <View style={local.detailRow}>
          <Text style={local.number}>03</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Une ville, pour commencer</Text>
            <Text style={local.body}>
              Des restos et des bars à Paris intramuros. Des petites tablées, dans la
              vraie vie, sans visée amoureuse.
            </Text>
          </View>
        </View>
        <View style={local.footnote}>
          <Text style={local.detailTitle}>Sans mauvaise surprise.</Text>
          <Text style={local.body}>
            Les tarifs invités restent à définir. Aucune offre payante ne peut être
            activée ici ; votre sélection est un aperçu local.
          </Text>
        </View>
      </View>
      <Button
        primary
        title="Découvrir cette formule"
        onPress={() => setPreview(true)}
      />
      {preview && (
        <Notice>{`Vous avez choisi « ${selected} ». Aucun abonnement activé, aucun paiement effectué.`}</Notice>
      )}
    </Page>
  );
}
const local = StyleSheet.create({
  plans: {
    gap: 16,
  },
  plan: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 24,
    padding: 24,
    gap: 18,
  },
  planSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.white,
  },
  planMark: {
    fontSize: 22,
    color: colors.accent,
  },
  planFeatures: {
    fontSize: 12,
    lineHeight: 21,
    color: colors.olive,
    borderTopWidth: 1,
    borderColor: colors.line,
    paddingTop: 18,
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
