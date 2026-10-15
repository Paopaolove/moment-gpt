import { useState } from 'react';
import { Text, View } from 'react-native';
import { Avatar, Button, Card, Field, Header, Notice, Page } from '../components';
import { RULES, canAttend, dateLabel, euros } from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { colors, styles as s } from '../theme';
export function Chat() {
    const { route, go } = useFlow();
    const { moments, bookings, chatMessages, sendMessage, now, act } = useStore();
    const m = moments.find(m => m.id === route.id);
    const b = bookings.find(b => b.momentId === route.id);
    const [draft, setDraft] = useState('');
    const messages = chatMessages.filter(message => message.momentId === route.id);
    if (!m || !b || !['confirmed', 'present'].includes(b.status))
        return <Page>
        <Header title={'La conversation\ncommence bientôt.'} subtitle="Confirmez une place pour retrouver votre table."/>
        <Button primary title="Voir mes demandes" onPress={() => go('Demandes')}/>
        </Page>;
    return <Page>
    <View style={s.row}>
    <Avatar name={m.host}/>
    <View style={{ flex: 1 }}>
    <Text style={s.heading}>{m.host} & vous</Text>
    <Text style={s.muted}>Conversation de démonstration</Text>
    </View>
    </View>
    <Header eyebrow="Votre prochain moment" title={'À tout\nà l’heure.'} subtitle={m.title}/>
    <Card>
    <Text style={s.eyebrow}>Message d’accueil · exemple</Text>
    <Text style={s.text}>Bienvenue à ma table ! On se retrouve à l’adresse indiquée. Hâte de faire connaissance.</Text>
    <Text style={s.muted}>{dateLabel(m.startsAt)}</Text>
    </Card>{messages.map((text, i) => <View key={i} style={{ backgroundColor: colors.ink, borderRadius: 22, borderBottomRightRadius: 4, padding: 20, marginLeft: 35 }}>
        <Text style={[s.text, { color: colors.paper }]}>{text.text}</Text>
        <Text style={{ color: colors.line, marginTop: 8, fontSize: 11 }}>Vous · message local</Text>
        </View>)}<Field label="Votre message" placeholder="Un petit mot avant de se retrouver…" value={draft} onChangeText={setDraft} multiline maxLength={1000}/>
    <Button disabled={!draft.trim()} title="Envoyer mon message  ↑" onPress={() => { sendMessage(m.id, draft.trim()); setDraft(''); }}/>
    <Button title="Le lieu et l’itinéraire  ↗" onPress={() => go('Lieu', m.id)}/>{b.status === 'confirmed' && canAttend(m.startsAt, now) && <Button primary title="Je suis sur place  ✓" onPress={() => act(m.id, 'present')}/>}{b.status === 'confirmed' && !canAttend(m.startsAt, now) && <Notice>Le bouton de présence apparaîtra dès H−{RULES.presenceBeforeMinutes}, à {dateLabel(m.startsAt - RULES.presenceBeforeMinutes * 60000)}.</Notice>}{b.status === 'present' && <>
        <Notice>Présence enregistrée. Votre caution fictive de {euros(RULES.deposit)} est libérée.</Notice>
        <Button primary title="Raconter ce moment" onPress={() => go('Avis', m.id)}/>
        </>}{b.status === 'confirmed' && <Button title="Un imprévu ?" onPress={() => go('Joker', m.id)}/>}</Page>;
}
