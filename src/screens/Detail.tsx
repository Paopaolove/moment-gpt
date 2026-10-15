import { Text, View } from 'react-native';
import { Avatar, Button, Header, Notice, Page, Section, TableArt } from '../components';
import { RULES, dateLabel, euros } from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { styles as s } from '../theme';
export function Detail() {
    const { route, go } = useFlow();
    const { moments, bookings, now, woman, act } = useStore();
    const m = moments.find(m => m.id === route.id);
    if (!m)
        return <Page>
        <Notice>Cette invitation n’est plus disponible.</Notice>
        </Page>;
    const b = bookings.find(b => b.momentId === m.id);
    const closed = now > m.startsAt + RULES.urgentAfterMinutes * 60000;
    const blocked = m.womenOnly && !woman;
    return <Page>
    <Header eyebrow={`${m.category} · Paris ${m.district}e`} title={m.title}/>
    <TableArt label={m.category === 'Bar' ? 'on prend le temps d’un verre' : 'les meilleures choses se partagent'}/>
    <View style={s.row}>
    <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
    <Avatar name={m.host}/>
    <View>
    <Text style={s.text}>À la table de {m.host}</Text>
    <Text style={s.muted}>Hôte de votre soirée</Text>
    </View>
    </View>
    <Text style={s.heading}>{euros(m.price)}</Text>
    </View>
    <Text style={s.text}>{m.description}</Text>
    <Section label="Le rendez-vous" value={dateLabel(m.startsAt)}/>
    <Section label="La tablée" value={`${m.seats} place${m.seats > 1 ? 's' : ''}${m.womenOnly ? ' · entre femmes' : ''}`}/>
    <Button title={`${m.address}  ↗`} onPress={() => go('Lieu', m.id)}/>
    <Notice>L’invitation et la caution de {euros(RULES.deposit)} sont distinctes. Après acceptation, vous disposez de {RULES.confirmationMinutes} minutes pour confirmer.</Notice>{blocked && <Button title="Renseigner mon profil" onPress={() => go('Profil')}/>}{m.own ? <Button primary title="Voir mes demandes" onPress={() => go('Demandes')}/> : b ? <Button primary title="Retrouver ma demande  →" onPress={() => go(b.status === 'accepted' ? 'Confirmation' : b.status === 'confirmed' || b.status === 'present' ? 'Chat' : 'Demandes', m.id)}/> : <Button primary disabled={blocked || closed} title={closed ? 'Ce moment est terminé' : 'Demander une place  ↗'} onPress={() => { act(m.id, 'request'); go('Demandes', m.id); }}/>}</Page>;
}
