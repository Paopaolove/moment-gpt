import { View } from 'react-native';
import { Banner, Button, EmptyState, ListRow, T, s } from '../components/UI';
import { canMarkPresence } from '../domain/selectors';
import { RequestCard } from './RequestCard';
import type { JourneyContext } from '../useJourney';
export function MyMoments({ ctx }: {
  ctx: JourneyContext;
}) {
  const { state, user, now, act, setTab, setSheet, ownRequests, activeHost } = ctx;
  return <>
    <Button title="Démo" variant="text" onPress={() => setSheet("demo")} />
    {!user && <Banner>
      Explorez librement. Créez un compte pour retrouver vos demandes.
    </Banner>}
    {['Demandes', 'À venir', 'Passés'].map((section) => {
      const rows = ownRequests.filter(r => {
        const closed = state.moments.find(m => m.id === r.momentId)?.status === 'closed';
        return section === 'À venir' ? r.status === 'confirmed' && !closed : section === 'Demandes' ? ['requested', 'accepted'].includes(r.status) : closed || ['cancelled', 'expired', 'declined'].includes(r.status);
      });
      return <View key={section} style={s.section}>
        <T style={s.title}>
          {section}
        </T>
        {rows.length ? [...rows].sort((a, b) => Number(b.status === 'accepted') - Number(a.status === 'accepted')).map(r => <RequestCard key={r.id} ctx={ctx} r={r} />) : <EmptyState
          onAction={() => setTab("Découvrir")}
          title={section === 'À venir' ? 'Votre prochain moment est à trouver' : section === 'Demandes' ? 'Aucune demande en cours' : 'Tout commence par un premier moment'}
          detail={section === 'À venir' ? 'Une place vous attend dans Découvrir.' : 'Vos moments apparaîtront ici.'} />}
      </View>;
    })}
    {activeHost && <View style={s.card}>
      <T style={s.h}>{"Vous accueillez"}</T>
      <T>
        {activeHost.title}
      </T>
      <Button
        title="Je suis là · hôte"
        disabled={!canMarkPresence(activeHost, now) || activeHost.hostPresentAt !== undefined}
        onPress={() => act({ type: 'markPresence', momentId: activeHost.id })} />
      {state.requests.filter(r => r.momentId === activeHost.id).map(r => <ListRow
        key={r.id}
        title={state.users.find(u => u.id === r.guestId)?.name ?? 'Invité'}
        detail={r.status}
        onPress={r.status === 'requested' ? () => act({ type: 'accept', requestId: r.id }) : undefined} />)}
    </View>}
  </>;
}
