import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Card, Field, Header, Page, Pill, TableArt } from '../components';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { colors, styles as s } from '../theme';
export function Avis() {
    const { route, go } = useFlow();
    const { bookings, reviews, addReview } = useStore();
    const [rating, setRating] = useState(5);
    const [text, setText] = useState('');
    const [sent, setSent] = useState(false);
    const eligible = bookings.some(b => b.momentId === route.id && b.status === 'present');
    const existing = reviews.find(r => r.momentId === route.id);
    return <Page>
    <Header eyebrow="Les petits mots restent" title={'C’était comment,\npour vous ?'} subtitle="Un avis sur l’accueil et le moment partagé. Quelques mots qui donnent envie de recommencer."/>{eligible && !sent && !existing ? <>
        <TableArt compact label="merci pour cette parenthèse"/>
        <Text style={s.eyebrow}>Votre expérience</Text>
        <View style={s.wrap}>{[1, 2, 3, 4, 5].map(n => <Pill key={n} title={`${n} ★`} selected={rating === n} onPress={() => setRating(n)}/>)}</View>
        <Field label="Votre petit mot" placeholder="Un accueil chaleureux, une belle découverte…" multiline value={text} onChangeText={setText} maxLength={500}/>
        <Button primary disabled={!text.trim()} title="Partager mon avis" onPress={() => { if (route.id) {
            addReview(route.id, rating, text.trim());
            setSent(true);
        } }}/>
        </> : <>
        <Card>
        <Text style={[s.title, { color: colors.accent }]}>Merci.</Text>
        <Text style={s.muted}>{sent || existing ? 'Votre avis a été enregistré localement. Ces petits mots font les grandes tablées.' : 'Vos avis apparaîtront ici après votre présence à un moment.'}</Text>
        </Card>{reviews.map(r => <Card key={r.momentId}>
            <Text style={s.heading}>{r.rating} / 5</Text>
            <Text style={s.text}>{r.text}</Text>
            <Text style={s.eyebrow}>Avis local · démonstration</Text>
            </Card>)}<Button primary title="Trouver un autre moment  ↗" onPress={() => go('Fil')}/>
        </>}</Page>;
}
