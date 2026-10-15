import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Header, MomentCard, Notice, Page, Pill, TableArt } from '../components';
import { RULES, isUrgent } from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { colors, styles as s } from '../theme';
export function Fil() {
    const { moments, now } = useStore();
    const { go } = useFlow();
    const [category, setCategory] = useState('Tout');
    const [urgent, setUrgent] = useState(false);
    const list = moments.filter(m => now <= m.startsAt + RULES.urgentAfterMinutes * 60000 && (category === 'Tout' || m.category === category) && (!urgent || isUrgent(m.startsAt, now)));
    return <Page>
    <View style={s.row}>
    <Text style={[s.heading, { fontSize: 36 }]}>moment<Text style={{ color: colors.accent }}>.</Text>
    </Text>
    <Pill title="La carte ↗" onPress={() => go('Carte')}/>
    </View>
    <Header eyebrow="Moins d’écran. Plus de vrai." title={'Ce soir,\non se retrouve.'} subtitle="Des tables ouvertes, des histoires à découvrir. Une autre façon d’habiter Paris."/>
    <TableArt compact label="il suffit d’une place"/>
    <View style={s.wrap}>{['Tout', ...RULES.categories].map(c => <Pill key={c} title={c} selected={category === c} onPress={() => setCategory(c)}/>)}<Pill title="À l’improviste" selected={urgent} onPress={() => setUrgent(!urgent)}/>
    </View>{urgent && <Notice>Les invitations entre H−90 et H+30, à l’heure de Paris.</Notice>}<View style={s.row}>
    <Text style={s.eyebrow}>Les invitations</Text>
    <Text style={s.eyebrow}>{String(list.length).padStart(2, '0')} tables ouvertes</Text>
    </View>
    <View>{list.map((m, i) => <MomentCard key={m.id} moment={m} index={i} onPress={() => go('Detail', m.id)}/>)}</View>{!list.length && <Notice>Une petite accalmie. Changez de filtre ou ouvrez votre propre table.</Notice>}<Button primary title="Je suis dispo, trouvons une table  ↗" onPress={() => go('Dispo')}/>
    <Text style={s.muted}>Des invitations dans la vraie vie. Sans visée amoureuse.</Text>
    </Page>;
}
