import { StyleSheet, Text, View } from 'react-native';
import { Avatar, Button, Header, Notice, Page, Section, TableArt } from '../components';
import { RULES, dateLabel, euros } from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { styles as s } from '../theme';
export function Detail() {
  const { route, go } = useFlow();
  const { moments, bookings, now, woman, act } = useStore();
  const m = moments.find((m) => m.id === route.id);
  if (!m)
    return (
      <Page>
        <Header
          title="Cette table a changé de page."
          subtitle="L’invitation est introuvable dans cette session."
        />
        <Notice>Découvrez les autres tables parisiennes ouvertes.</Notice>
        <Button
          primary
          title="Retrouver le fil"
          onPress={() => go('Fil')}
        />
      </Page>
    );
  const b = bookings.find((b) => b.momentId === m.id);
  const closed = now > m.startsAt + RULES.urgentAfterMinutes * 60000;
  const blocked = m.womenOnly && !woman;
  return (
    <Page>
      <Header
        eyebrow={`${m.category} · Paris ${m.district}e`}
        title={m.title}
      />
      <TableArt
        label={
          m.category === 'Bar'
            ? 'on prend le temps d’un verre'
            : 'les meilleures choses se partagent'
        }
      />
      <View style={s.row}>
        <View
          style={{
            flexDirection: 'row',
            gap: 14,
            alignItems: 'center',
          }}
        >
          <Avatar name={m.host} />
          <View>
            <Text style={s.text}>{`À la table de ${m.host}`}</Text>
            <Text style={s.muted}>Hôte de votre soirée</Text>
          </View>
        </View>
        <Text style={s.heading}>{euros(m.price)}</Text>
      </View>
      <Text style={s.text}>{m.description}</Text>
      <Section
        label="Le rendez-vous"
        value={dateLabel(m.startsAt)}
      />
      <Section
        label="La tablée"
        value={`${m.seats} place${m.seats > 1 ? 's' : ''}${m.womenOnly ? ' · entre femmes' : ''}`}
      />
      <Button
        title={`${m.address}  ↗`}
        onPress={() => go('Lieu', m.id)}
      />
      <Notice>{`L’invitation et la caution de ${euros(RULES.deposit)} sont distinctes. Après acceptation, vous disposez de ${RULES.confirmationMinutes} minutes pour confirmer.`}</Notice>
      {closed && (
        <Notice>
          Le créneau H+30 est dépassé. Cette invitation n’accepte plus de nouvelles
          demandes.
        </Notice>
      )}
      {blocked && (
        <Notice>
          Cette table est réservée aux femmes. Votre déclaration de profil permet de
          vérifier l’accès.
        </Notice>
      )}
      {blocked && (
        <Button
          title="Renseigner mon profil"
          onPress={() => go('Profil')}
        />
      )}
      <View style={local.editorial}>
        <Text
          accessibilityRole="header"
          style={local.sectionTitle}
        >
          Ce qui nous rassemble.
        </Text>
        <Text style={local.intro}>
          Une petite table, de la place pour les différences.
        </Text>
        <View style={local.detailRow}>
          <Text style={local.number}>01</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>L’esprit de la soirée</Text>
            <Text style={local.body}>
              On vient pour écouter autant que raconter. Aucun programme à réussir,
              aucune obligation de prolonger la soirée.
            </Text>
          </View>
        </View>
        <View style={local.detailRow}>
          <Text style={local.number}>02</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Chacun son rythme</Text>
            <Text style={local.body}>
              Un premier verre, une assiette, puis on voit. Prévenez votre hôte si vous
              avez une contrainte alimentaire ou horaire.
            </Text>
          </View>
        </View>
        <View style={local.footnote}>
          <Text style={local.detailTitle}>Avant de vous dire oui.</Text>
          <Text style={local.body}>
            La disponibilité peut évoluer. Si le moment est terminé, retrouvez les
            prochaines invitations dans le fil.
          </Text>
        </View>
      </View>
      {m.own ? (
        <Button
          primary
          title="Voir mes demandes"
          onPress={() => go('Demandes')}
        />
      ) : b ? (
        <Button
          primary
          title="Retrouver ma demande  →"
          onPress={() =>
            go(
              b.status === 'accepted'
                ? 'Confirmation'
                : b.status === 'confirmed' || b.status === 'present'
                  ? 'Chat'
                  : 'Demandes',
              m.id,
            )
          }
        />
      ) : (
        <Button
          primary
          disabled={blocked || closed}
          title={closed ? 'Ce moment est terminé' : 'Demander une place  ↗'}
          onPress={() => {
            act(m.id, 'request');
            go('Demandes', m.id);
          }}
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
