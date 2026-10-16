import { View } from 'react-native';
import { Banner, Button, EmptyState, ListRow, T, s } from '../components/UI';
import { canMarkPresence } from '../domain/selectors';
import { canReportNoShow } from '../domain/rules';
import { RequestCard } from './RequestCard';
import type { JourneyContext } from '../useJourney';
export function MyMoments({ ctx }: {
  ctx: JourneyContext;
}) {
  const { state, user, now, act, setTab, setSheet, ownRequests, activeHost } = ctx;
  const sections = ['À venir', 'Demandes', 'Passés'].map(title => ({
    title,
    rows: ownRequests.filter(r => {
      const closed = state.moments.find(m => m.id === r.momentId)?.status === 'closed';
      if (closed || ['cancelled', 'expired', 'declined'].includes(r.status)) return title === 'Passés';
      return title === 'À venir' ? ['accepted', 'confirmed'].includes(r.status) : title === 'Demandes' && r.status === 'requested';
    }).sort((a, b) => Number(b.status === 'accepted') - Number(a.status === 'accepted'))
  }));
  return <>
    {!user && <Banner>
      Explorez librement. Créez un compte pour retrouver vos demandes.
    </Banner>}
    {sections.filter(section => section.rows.length > 0).map(({ title, rows }) => <View key={title} style={s.section}>
      <T style={s.title}>{title}</T>
      {rows.map((r, index) => <RequestCard key={r.id} ctx={ctx} r={r} hero={title === 'À venir' && index === 0} />)}
    </View>)}
    {!ownRequests.length && !activeHost && <EmptyState
      onAction={() => setTab('Découvrir')}
      title="Votre prochain moment est à trouver"
      detail="Une place vous attend dans Découvrir." />}
    {activeHost && <View style={s.card}>
      <T style={s.h}>{"Vous accueillez"}</T>
      <T>
        {activeHost.title}
      </T>
      <Button
        title="Je suis arrivé · hôte"
        disabled={!canMarkPresence(activeHost, now) || activeHost.hostPresentAt !== undefined}
        onPress={() => act({ type: 'markPresence', momentId: activeHost.id })} />
      {state.requests.filter(r => r.momentId === activeHost.id).map(r => <View key={r.id}>
        <ListRow
          title={state.users.find(u => u.id === r.guestId)?.name ?? 'Invité'}
          detail={r.presentAt ? 'Arrivé' : r.deposit === 'forfeited' ? 'Signalé « Pas venu »' : r.status}
          onPress={r.status === 'requested' ? () => act({ type: 'accept', requestId: r.id }) : undefined} />
        {r.status === 'confirmed' && r.deposit === 'held' && canReportNoShow(activeHost.startsAt, now, r.presentAt) && <Button
          variant="secondary"
          title="Pas venu"
          onPress={() => act({ type: 'noShow', requestId: r.id })} />}
      </View>)}
      <T style={s.muted}>{'« Pas venu » uniquement si la place est vraiment vide, à partir de l’heure du moment. Sans signalement, la caution est rendue le lendemain.'}</T>
    </View>}
  </>;
}
