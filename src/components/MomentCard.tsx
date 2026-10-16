import { Pressable, View } from 'react-native';
import { Avatar } from '../components/Avatar';
import { hostLabel } from '../components/hostLabel';
import { Icon } from '../components/Icon';
import { StatusPill } from '../components/StatusPill';
import { s } from '../components/styles';
import { T } from '../components/T';
import { formatDelay } from '../domain/presentation';
import { isUrgent, reliable } from '../domain/selectors';
import type { Moment } from '../domain/types';
import { useStore } from '../store';
import { colors as c, categoryColors } from '../theme/tokens';
export function MomentCard({ moment: m, now, onPress, offer }: {
  moment: Moment;
  now: number;
  onPress?: () => void;
  offer?: string;
}) {
  const { state } = useStore();
  const host = state.users.find(u => u.id === m.hostId);
  return <Pressable
    accessibilityRole={onPress ? "button" : undefined}
    disabled={!onPress}
    accessibilityLabel={m.title + ', ' + m.neighborhood}
    onPress={onPress}
    style={({ pressed }) => [s.card, { opacity: pressed ? .7 : 1, gap: 14 }]}>
    <View style={s.between}>
      <T
        style={{
          fontSize: 12,
          color: categoryColors[m.category],
          fontFamily: 'InterTight_600SemiBold'
        }}>
        {m.category}
      </T>
      {isUrgent(m, now) ? <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 3,
          borderRadius: 6,
          backgroundColor: '#FFF0ED'
        }}>
        <T style={{ fontSize: 12, color: c.error }}>{"Urgent"}</T>
      </View> : <T style={{ fontSize: 12, color: c.secondary }}>
        {formatDelay(m.startsAt, now)}
      </T>}
    </View>
    <T
      style={{
        fontFamily: 'InterTight_600SemiBold',
        fontSize: 20,
        lineHeight: 26
      }}>
      {m.title}
    </T>
    <View style={[s.row, { gap: 6 }]}>
      <Icon name="pin" />
      <T style={{ fontSize: 14, color: c.secondary }}>
        {m.neighborhood}{" · Paris "}{m.district}{"e"}</T>
    </View>
    <View style={{ height: 1, backgroundColor: c.border }} />
    <View style={s.between}>
      <View style={[s.row, { gap: 8 }]}>
        <Avatar name={hostLabel(m.hostId, host?.name)} />
        <View>
          <T style={{ fontSize: 14 }}>
            {hostLabel(m.hostId, host?.name)}
          </T>
          {host && reliable(host) && <StatusPill title="Fiable" tone="success" />}
          <View accessibilityLabel={m.seats + ' places'} style={{ flexDirection: 'row' }}>
            {Array.from({ length: m.seats }, (_, i) => <Icon key={i} name="seats" />)}
          </View>
        </View>
      </View>
      <T style={[s.h, { maxWidth: '40%', textAlign: 'right' }]}>
        {offer ?? m.invitationCents / 100 + ' €'}
      </T>
    </View>
    {m.femmesUniquement && <StatusPill title="Femmes uniquement" />}
  </Pressable>;
}
