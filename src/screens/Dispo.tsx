import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Button, Card, Header, MomentCard, Notice, Page, Pill } from '../components';
import { RULES, isUrgent } from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { colors, styles as s } from '../theme';
export function Dispo() {
  const { go } = useFlow();
  const { moments, now } = useStore();
  const [when, setWhen] = useState('Maintenant');
  const [kind, setKind] = useState('Peu importe');
  const [searched, setSearched] = useState(false);
  const list = moments.filter(
    (m) =>
      !m.own &&
      (kind === 'Peu importe' || m.category === kind) &&
      (when === 'Maintenant'
        ? isUrgent(m.startsAt, now)
        : when === 'Ce soir'
          ? m.startsAt >= now && m.startsAt <= now + 12 * 3600000
          : m.startsAt >= now + 12 * 3600000 && m.startsAt <= now + 36 * 3600000),
  );
  return (
    <Page>
      <Header
        eyebrow="Une envie de sortir"
        title={'Du temps libre.\nEt si on sortait ?'}
        subtitle="Pas besoin d’un grand plan pour passer une belle soirée."
      />
      <Card>
        <Text
          style={[
            s.title,
            {
              color: colors.accent,
              fontSize: 76,
              lineHeight: 86,
            },
          ]}
        >
          ↗
        </Text>
        <Text style={s.heading}>Votre seule mission : être là.</Text>
        <Text style={s.muted}>
          Choisissez votre tempo, nous vous montrons les tables qui vont avec.
        </Text>
      </Card>
      <Text style={s.eyebrow}>Quand ?</Text>
      <View style={s.wrap}>
        {['Maintenant', 'Ce soir', 'Demain'].map((v) => (
          <Pill
            key={v}
            title={v}
            selected={when === v}
            onPress={() => {
              setWhen(v);
              setSearched(false);
            }}
          />
        ))}
      </View>
      <Text style={s.eyebrow}>Une préférence ?</Text>
      <View style={s.wrap}>
        {['Peu importe', ...RULES.categories].map((v) => (
          <Pill
            key={v}
            title={v}
            selected={kind === v}
            onPress={() => {
              setKind(v);
              setSearched(false);
            }}
          />
        ))}
      </View>
      <Notice>
        {when === 'Maintenant'
          ? 'À l’improviste : de 90 minutes avant à 30 minutes après le début.'
          : when === 'Ce soir'
            ? 'Les tables à venir dans les 12 prochaines heures.'
            : 'Les tables entre 12 et 36 heures à partir de maintenant.'}
        Tous les horaires sont affichés à l’heure de Paris.
      </Notice>
      <View style={local.editorial}>
        <Text
          accessibilityRole="header"
          style={local.sectionTitle}
        >
          Suivez votre tempo.
        </Text>
        <Text style={local.intro}>
          Les meilleurs plans commencent parfois par une heure libre.
        </Text>
        <View style={local.detailRow}>
          <Text style={local.number}>01</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Un verre en passant</Text>
            <Text style={local.body}>
              Pour se retrouver sans bloquer toute la soirée. Avec ou sans alcool, la
              conversation reste la même.
            </Text>
          </View>
        </View>
        <View style={local.detailRow}>
          <Text style={local.number}>02</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Le temps d’un dîner</Text>
            <Text style={local.body}>
              Une vraie pause autour d’une table de quartier. Prévoyez le temps du
              trajet et celui de faire connaissance.
            </Text>
          </View>
        </View>
        <View style={local.footnote}>
          <Text style={local.detailTitle}>Rien pour le moment ?</Text>
          <Text style={local.body}>
            Changez de créneau ou de catégorie. Les invitations se renouvellent au fil
            des envies des hôtes.
          </Text>
        </View>
      </View>
      <Button
        primary
        title="Voir les tables pour moi  →"
        onPress={() => setSearched(true)}
      />
      {searched && (
        <View>
          {list.map((m, i) => (
            <MomentCard
              key={m.id}
              moment={m}
              index={i}
              onPress={() => go('Detail', m.id)}
            />
          ))}
          {!list.length && (
            <Notice>Aucune table sur ce créneau. Essayez une autre envie.</Notice>
          )}
        </View>
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
