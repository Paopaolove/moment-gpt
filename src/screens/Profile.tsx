import { View } from 'react-native';
import { Avatar, Banner, Button, ListRow, StatusPill, T, s } from '../components/UI';
import { monthKey } from '../domain/rules';
import { reliable } from '../domain/selectors';
import type { JourneyContext } from '../useJourney';
export function Profile({ ctx }: {
  ctx: JourneyContext;
}) {
  const { user, now, act, setSheet, requireAccount } = ctx;
  return <>
    <View style={[s.row, { paddingVertical: 12 }]}>
      <Avatar name={user?.name ?? 'Visiteur'} />
      <View style={{ flex: 1 }}>
        <T style={s.title}>
          {user?.name ?? 'Bienvenue'}
        </T>
        <T style={s.muted}>
          {user ? `Fiable · ${Math.min(5, user.honoredMoments)}/5 moments` : 'Explorez à votre rythme'}
        </T>
      </View>
      {user && reliable(user) && <StatusPill title="Fiable" tone="success" />}
    </View>
    {!user && <Button title="Créer un compte" onPress={() => setSheet('auth')} />}
    <View style={s.card}>
      <ListRow
        title="Fiabilité"
        detail={user && reliable(user) ? 'Badge obtenu' : 'Après 5 moments honorés et une moyenne ≥ 4/5'} />
      <ListRow
        title={`${user?.absences ?? 0} absence · ${user?.hostWarnings ?? 0} avertissement hôte`}
        detail={user?.accountStatus === 'closed' ? 'Compte fermé' : user?.priority === false ? 'Priorité perdue' : 'Compte en règle · priorité conservée'} />
      <Banner>
        2 absences : perte de priorité. 3 : compte fermé. Hôte absent : un avertissement, puis fermeture à la seconde absence.
      </Banner>
    </View>
    <View style={s.card}>
      <ListRow
        title="Joker du mois"
        detail={user?.jokerMonths.includes(monthKey(now)) ? 'Déjà utilisé ce mois-ci' : '1 disponible · caution rendue même en cas de refus'} />
    </View>
    <View style={s.card}>
      <ListRow title="Crédits" detail="Avoirs fictifs, consommables une seule fois" />
      {user?.credits.map(cr => <Button
        key={cr.id}
        variant="secondary"
        disabled={cr.consumed}
        title={cr.consumed ? 'Crédit utilisé' : `Utiliser ${cr.cents / 100} €`}
        onPress={() => act({ type: 'consumeCredit', creditId: cr.id })} />)}
      {!user?.credits.length && <T style={s.muted}>{"Aucun crédit pour le moment."}</T>}
    </View>
    <View style={s.card}>
      <ListRow
        title="Moment+ · abonnement invité"
        detail="Non activé · simulation, aucun paiement"
        onPress={() => setSheet('subscription')} />
      <Banner>
        La caution de 20 € est distincte de l’abonnement et du montant du moment. Publier est gratuit.
      </Banner>
      {user && <View style={s.between}>
        <T>{"Je suis une femme"}</T>
        <T style={s.muted}>
          {user.woman ? 'Oui' : 'Non'}
        </T>
      </View>}
    </View>
    <View style={s.card}>
      <ListRow
        title="Partenaire"
        detail="Un espace dédié aux partenaires"
        onPress={() => requireAccount(() => setSheet('partner'))} />
      <Button title="Démo" variant="text" onPress={() => setSheet('demo')} />
    </View>
  </>;
}
