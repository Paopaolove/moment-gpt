import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Card, Header, Notice, Page, PressableScale } from '../components';
import { PARIS_DISTRICTS, RULES, dateLabel, euros } from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { colors, styles as s } from '../theme';
export function Carte() {
    const { moments, now } = useStore();
    const { route, go } = useFlow();
    const [selected, setSelected] = useState(route.id ?? '');
    const list = moments.filter(m => now <= m.startsAt + RULES.urgentAfterMinutes * 60000);
    const m = list.find(m => m.id === selected);
    return <Page>
    <Header eyebrow="Paris intramuros, seulement" title={'Tout près.\nTout un monde.'} subtitle="Une carte sensible de la ville. Choisissez une table, changez de perspective."/>
    <View style={{ height: 350, backgroundColor: colors.card, borderRadius: 30, overflow: 'hidden', borderWidth: 1, borderColor: colors.line }}>
    <View style={{ position: 'absolute', width: '88%', height: '86%', top: '7%', left: '6%', borderWidth: 2, borderColor: colors.line, borderRadius: 120, transform: [{ rotate: '-12deg' }] }}/>
    <View style={{ position: 'absolute', left: '-15%', top: '48%', width: '135%', height: 28, backgroundColor: '#C2CFCC', transform: [{ rotate: '22deg' }] }}/>
    <Text style={[s.eyebrow, { position: 'absolute', left: '14%', top: '52%', color: '#536D69', transform: [{ rotate: '22deg' }] }]}>La Seine</Text>{PARIS_DISTRICTS.map(d => <Text key={d.id} style={{ position: 'absolute', left: `${d.x}%`, top: `${d.y}%`, color: colors.muted, fontSize: 11 }}>{d.id}</Text>)}{list.map(item => {
            const point = PARIS_DISTRICTS.find(d => d.id === item.district)!;
            return <View key={item.id} style={{ position: 'absolute', left: `${point.x - 3}%`, top: `${point.y - 4}%` }}>
            <PressableScale accessibilityLabel={`Table de ${item.host}, Paris ${item.district}e`} accessibilityState={{ selected: selected === item.id }} onPress={() => setSelected(item.id)} style={{ minWidth: 46, minHeight: 46, padding: 10, borderRadius: 30, alignItems: 'center', backgroundColor: selected === item.id ? colors.accent : colors.ink }}>
            <Text style={{ color: colors.paper, fontSize: 12 }}>{euros(item.price)}</Text>
            </PressableScale>
            </View>;
        })}<Text style={[s.eyebrow, { position: 'absolute', bottom: 18, left: 20, fontSize: 8 }]}>Repères par arrondissement · positions indicatives</Text>
    </View>{m ? <Card>
        <View style={s.row}>
        <Text style={s.eyebrow}>Paris {m.district}e · {m.category}</Text>
        <Text style={s.heading}>{euros(m.price)}</Text>
        </View>
        <Text style={s.heading}>{m.title}</Text>
        <Text style={s.muted}>{dateLabel(m.startsAt)} · {m.host}</Text>
        <Button primary title="Découvrir cette table  ↗" onPress={() => go('Detail', m.id)}/>
        </Card> : <>
        <Notice>Touchez une invitation sur la carte pour découvrir la table. Les repères représentent les arrondissements, pas les adresses exactes.</Notice>
        <Button primary title="Voir toutes les invitations" onPress={() => go('Fil')}/>
        </>}<Text style={s.muted}>Du 1er au 20e. Les tables proposées hors de Paris intramuros ne sont pas acceptées.</Text>
    </Page>;
}
