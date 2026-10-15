import { Text, View } from 'react-native';
import { Moment, dateLabel, euros, isUrgent } from '../domain/rules';
import { useStore } from '../store';
import { colors, styles as s } from '../theme';
import { AnimatedEntry } from './AnimatedEntry';
import { Avatar } from './Avatar';
import { PressableScale } from './PressableScale';
export function MomentCard({ moment: m, index = 0, onPress }: {
    moment: Moment;
    index?: number;
    onPress: () => void;
}) {
    const { now } = useStore();
    return <AnimatedEntry index={index}>
    <PressableScale onPress={onPress} accessibilityLabel={`Voir ${m.title}`} style={{ paddingVertical: 26, gap: 18, borderTopWidth: 1, borderColor: colors.line }}>
    <View style={s.row}>
    <Text style={s.eyebrow}>{m.category} · Paris {m.district}e</Text>
    <Text style={[s.eyebrow, { color: colors.accent }]}>{isUrgent(m.startsAt, now) ? 'À l’improviste' : 'À venir'}</Text>
    </View>
    <Text style={[s.heading, { fontSize: 32, lineHeight: 37 }]}>{m.title}</Text>
    <Text style={s.muted}>{dateLabel(m.startsAt)}{m.womenOnly ? ' · Femmes uniquement' : ''}</Text>
    <View style={s.row}>
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
    <Avatar name={m.host}/>
    <View>
    <Text style={s.text}>{m.host}</Text>
    <Text style={s.muted}>{m.seats} place{m.seats > 1 ? 's' : ''} à sa table</Text>
    </View>
    </View>
    <Text style={s.heading}>{euros(m.price)} ↗</Text>
    </View>
    </PressableScale>
    </AnimatedEntry>;
}
