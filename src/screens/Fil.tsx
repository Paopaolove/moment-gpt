import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import {
  Button,
  Header,
  MomentCard,
  Notice,
  Page,
  Pill,
  TableArt,
} from '../components';
import { RULES, isUrgent } from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { colors, styles as s } from '../theme';
export function Fil() {
  const { moments, now } = useStore();
  const { go } = useFlow();
  const [category, setCategory] = useState('Tout');
  const [urgent, setUrgent] = useState(false);
  const list = moments.filter(
    (m) =>
      now <= m.startsAt + RULES.urgentAfterMinutes * 60000 &&
      (category === 'Tout' || m.category === category) &&
      (!urgent || isUrgent(m.startsAt, now)),
  );
  return (
    <Page>
      <View style={s.row}>
        <Text
          style={[
            s.heading,
            {
              fontSize: 36,
            },
          ]}
        >
          moment
          <Text
            style={{
              color: colors.accent,
            }}
          >
            .
          </Text>
        </Text>
        <Pill
          title="La carte ↗"
          onPress={() => go('Carte')}
        />
      </View>
      <Header
        eyebrow="Moins d’écran. Plus de vrai."
        title={'Ce soir,\non se retrouve.'}
        subtitle="Des tables ouvertes, des histoires à découvrir. Une autre façon d’habiter Paris."
      />
      <TableArt
        compact
        label="il suffit d’une place"
      />
      <View style={s.wrap}>
        {['Tout', ...RULES.categories].map((c) => (
          <Pill
            key={c}
            title={c}
            selected={category === c}
            onPress={() => setCategory(c)}
          />
        ))}
        <Pill
          title="À l’improviste"
          selected={urgent}
          onPress={() => setUrgent(!urgent)}
        />
      </View>
      {urgent && (
        <Notice>Les invitations entre H−90 et H+30, à l’heure de Paris.</Notice>
      )}
      <View style={s.row}>
        <Text style={s.eyebrow}>Les invitations</Text>
        <Text
          style={s.eyebrow}
        >{`${String(list.length).padStart(2, '0')} tables ouvertes`}</Text>
      </View>
      <View>
        {list.map((m, i) => (
          <MomentCard
            key={m.id}
            moment={m}
            index={i}
            onPress={() => go('Detail', m.id)}
          />
        ))}
      </View>
      {!list.length && (
        <Notice>
          Une petite accalmie. Changez de filtre ou ouvrez votre propre table.
        </Notice>
      )}
      <View style={local.editorial}>
        <Text
          accessibilityRole="header"
          style={local.sectionTitle}
        >
          Le goût du quartier.
        </Text>
        <Text style={local.intro}>Une ville immense. Des tables à taille humaine.</Text>
        <View style={local.detailRow}>
          <Text style={local.number}>01</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Belleville à Bastille</Text>
            <Text style={local.body}>
              Des bistrots vivants, des bars de quartier et des hôtes qui connaissent
              leur coin de Paris.
            </Text>
          </View>
        </View>
        <View style={local.detailRow}>
          <Text style={local.number}>02</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Une invitation, pas un profil</Text>
            <Text style={local.body}>
              Choisissez une ambiance et une conversation. Ici, on se retrouve dans la
              vraie vie, sans visée amoureuse.
            </Text>
          </View>
        </View>
        <View style={local.footnote}>
          <Text style={local.detailTitle}>Votre soirée, simplement.</Text>
          <Text style={local.body}>
            Demandez une place. Attendez le oui de l’hôte. Confirmez en 10 minutes, puis
            laissez le téléphone dans votre poche.
          </Text>
        </View>
      </View>
      <Button
        primary
        title="Je suis dispo, trouvons une table  ↗"
        onPress={() => go('Dispo')}
      />
      <Text style={s.muted}>
        Des invitations dans la vraie vie. Sans visée amoureuse.
      </Text>
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
