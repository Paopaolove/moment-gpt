import { Text } from 'react-native';
import { Button, Card, Header, Notice, Page, Section, TableArt } from '../components';
import { dateLabel } from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { styles as s } from '../theme';
export function Lieu() {
    const { route, go } = useFlow();
    const { moments } = useStore();
    const m = moments.find(m => m.id === route.id);
    if (!m)
        return <Page>
        <Header title={'Une adresse\nà découvrir.'}/>
        <Button primary title="Explorer la carte" onPress={() => go('Carte')}/>
        </Page>;
    return <Page>
    <Header eyebrow={`${m.category} · Paris ${m.district}e`} title={'La bonne\nadresse.'} subtitle="Le point de départ de votre prochaine conversation."/>
    <TableArt label={m.category === 'Resto' ? 'une table dans le quartier' : 'un verre, et tout commence'}/>
    <Card>
    <Text style={s.eyebrow}>Le lieu proposé par {m.host}</Text>
    <Text style={s.heading}>{m.address}</Text>
    <Text style={s.muted}>Adresse déclarée par l’hôte. Les horaires et la disponibilité du lieu sont à vérifier auprès de lui.</Text>
    </Card>
    <Section label="Votre moment" value={dateLabel(m.startsAt)}/>
    <Section label="À la table de" value={m.host}/>
    <Notice>Repère indicatif sur notre carte stylisée de Paris. Aucun itinéraire ni géolocalisation en direct.</Notice>
    <Button primary title="Situer sur la carte  ↗" onPress={() => go('Carte', m.id)}/>
    <Button title="Retrouver l’invitation" onPress={() => go('Detail', m.id)}/>
    </Page>;
}
