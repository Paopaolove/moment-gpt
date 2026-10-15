import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Button, Card, Field, Header, Page, Pill, TableArt } from '../components';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { colors, styles as s } from '../theme';
export function Avis() {
  const { route, go } = useFlow();
  const { bookings, reviews, addReview } = useStore();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);
  const eligible = bookings.some(
    (b) => b.momentId === route.id && b.status === 'present',
  );
  const existing = reviews.find((r) => r.momentId === route.id);
  return (
    <Page>
      <Header
        eyebrow="Les petits mots restent"
        title={'C’était comment,\npour vous ?'}
        subtitle="Un avis sur l’accueil et le moment partagé. Quelques mots qui donnent envie de recommencer."
      />
      {eligible && !sent && !existing ? (
        <>
          <TableArt
            compact
            label="merci pour cette parenthèse"
          />
          <Text style={s.eyebrow}>Votre expérience</Text>
          <View style={s.wrap}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Pill
                key={n}
                title={`${n} ★`}
                selected={rating === n}
                onPress={() => setRating(n)}
              />
            ))}
          </View>
          <Field
            label="Votre petit mot"
            placeholder="Un accueil chaleureux, une belle découverte…"
            multiline
            value={text}
            onChangeText={setText}
            maxLength={500}
          />
          <Button
            primary
            disabled={!text.trim()}
            title="Partager mon avis"
            onPress={() => {
              if (route.id) {
                addReview(route.id, rating, text.trim());
                setSent(true);
              }
            }}
          />
        </>
      ) : (
        <>
          <Card>
            <Text
              style={[
                s.title,
                {
                  color: colors.accent,
                },
              ]}
            >
              {sent || existing ? 'Merci.' : 'À écrire.'}
            </Text>
            <Text style={s.muted}>
              {sent || existing
                ? 'Votre avis a été enregistré localement. Ces petits mots font les grandes tablées.'
                : 'Vos avis apparaîtront ici après votre présence à un moment.'}
            </Text>
          </Card>
          {reviews.map((r) => (
            <Card key={r.momentId}>
              <Text style={s.heading}>{`${r.rating} / 5`}</Text>
              <Text style={s.text}>{r.text}</Text>
              <Text style={s.eyebrow}>Avis local · démonstration</Text>
            </Card>
          ))}
          <Button
            primary
            title="Trouver un autre moment  ↗"
            onPress={() => go('Fil')}
          />
        </>
      )}
      <View style={local.editorial}>
        <Text
          accessibilityRole="header"
          style={local.sectionTitle}
        >
          Les mots qui font du bien.
        </Text>
        <Text style={local.intro}>Un retour concret aide les prochaines tablées.</Text>
        <View style={local.detailRow}>
          <Text style={local.number}>01</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Parlez du moment</Text>
            <Text style={local.body}>
              L’accueil, l’ambiance, la facilité à se retrouver : racontez ce que vous
              avez vécu, avec attention.
            </Text>
          </View>
        </View>
        <View style={local.detailRow}>
          <Text style={local.number}>02</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Un avis après la présence</Text>
            <Text style={local.body}>
              Seuls les moments auxquels vous avez signalé votre présence peuvent
              recevoir votre avis. Un seul avis par moment.
            </Text>
          </View>
        </View>
        <View style={local.footnote}>
          <Text style={local.detailTitle}>Une expérience, une voix.</Text>
          <Text style={local.body}>
            Vos retours restent locaux dans ce prototype. Aucun commentaire n’est publié
            sur un service externe.
          </Text>
        </View>
      </View>
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
