import { Pressable, ScrollView, View } from 'react-native';
import { Chip, EmptyState, ErrorState, MomentCard, SegmentedControl, Skeleton, T, s } from '../components/UI';
import { isUrgent } from '../domain/selectors';
import type { Category } from '../domain/types';
import { colors as c } from '../theme/tokens';
import { ParisMap } from './DiscoverMap';
const categories: Category[] = ['Table', 'Verre', 'Sport', 'Culture'];
import type { JourneyContext } from '../useJourney';
export function Discover({ ctx }: {
  ctx: JourneyContext;
}) {
  const {
    state,
    now,
    category,
    setCategory,
    urgent,
    setUrgent,
    mode,
    setMode,
    loading,
    setLoading,
    error,
    setError,
    select,
    feed
  } = ctx;
  const urgentCount = state.moments.filter(m => m.status === 'active' && now <= m.startsAt + 30 * 60000 && isUrgent(m, now)).length;
  return <>
    {urgentCount > 0 && <Pressable accessibilityRole="button" accessibilityLabel={`${urgentCount} moments urgents ce soir. Filtrer les urgents`} onPress={() => { setCategory('Tout'); setUrgent(true); }}
      style={{
        padding: 16, borderRadius: 14, backgroundColor: "#FFF0ED", flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
      }}>
      <T style={{ color: c.error, fontFamily: "InterTight_600SemiBold" }}>{urgentCount} {urgentCount === 1 ? 'moment urgent' : 'moments urgents'} · ce soir</T><View style={{ transform: [{ rotate: '-45deg' }], width: 8, height: 8, borderRightWidth: 1.5, borderBottomWidth: 1.5, borderColor: c.error }} />
    </Pressable>}
    <SegmentedControl value={mode} onChange={setMode} />
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingVertical: 4 }}>
      {['Tout', ...categories].map(v => <Chip key={v} title={v} selected={category === v} onPress={() => setCategory(v)} />)}
      <Chip title="Urgent" selected={urgent} onPress={() => setUrgent(!urgent)} />
    </ScrollView>
    {loading ? <>
      <Skeleton />
      <Skeleton />
    </> : error ? <ErrorState
      retry={() => {
        setError(false);
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
      }} /> : feed.length === 0 ? <EmptyState
        onAction={() => {
          setCategory("Tout");
          setUrgent(false);
        }}
        title="Aucun moment pour ce filtre"
        detail="Essayez une autre catégorie. Une place se libère toujours." /> : mode === 'Carte' ? <ParisMap moments={feed} onSelect={select} /> : <>
          <View style={s.between}>
            <T style={s.h}>{"Une place pour vous"}</T>
            <T style={[s.muted, { fontSize: 13 }]}>
              {feed.length}{" moments"}</T>
          </View>
          {feed.map(m => <MomentCard
            key={m.id}
            moment={m}
            now={now}
            onPress={() => select(m.id)}
            offer={m.partnerId ? state.partners.find(p => p.id === m.partnerId)?.gesture : undefined} />)}
        </>}
  </>;
}
