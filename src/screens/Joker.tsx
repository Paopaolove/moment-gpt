import { useState } from 'react';
import { Text } from 'react-native';
import { Button, Card, Header, Notice, Page } from '../components';
import { RULES, euros } from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { colors, styles as s } from '../theme';
export function Joker() {
    const { route, go } = useFlow();
    const { jokerUsed, act, bookings } = useStore();
    const [done, setDone] = useState(false);
    const [confirmCancel, setConfirmCancel] = useState(false);
    const b = bookings.find(b => b.momentId === route.id);
    const eligible = b?.status === 'confirmed';
    return <Page>
    <Header eyebrow="La vie arrive" title={'Le droit\nà l’imprévu.'} subtitle="Un empêchement, ça arrive. Prévenez votre table avec la même attention que vous auriez aimé recevoir."/>
    <Card style={{ alignItems: 'center', paddingVertical: 38 }}>
    <Text style={[s.title, { fontSize: 100, lineHeight: 112, color: colors.accent }]}>{jokerUsed ? '0' : RULES.jokerPerMonth}</Text>
    <Text style={s.eyebrow}>Joker disponible ce mois-ci</Text>
    <Text style={[s.muted, { textAlign: 'center' }]}>Un par mois civil, renouvelé le premier du mois à l’heure de Paris.</Text>
    </Card>
    <Text style={s.heading}>Votre caution respire aussi.</Text>
    <Text style={s.muted}>Le Joker annule votre place confirmée et libère les {euros(RULES.deposit)} de caution. Si l’hôte annule, votre caution est également libérée sans consommer votre Joker.</Text>{done ? <>
        <Notice>Votre annulation a été enregistrée en simulation.</Notice>
        <Button primary title="Retrouver mes demandes" onPress={() => go('Demandes')}/>
        </> : <>
        <Button primary disabled={jokerUsed || !eligible} title={jokerUsed ? 'Joker déjà utilisé ce mois-ci' : eligible ? 'Utiliser mon Joker' : 'Choisissez une place confirmée'} onPress={() => { if (route.id) {
            act(route.id, 'joker');
            setDone(true);
        } }}/>{eligible && <Button title={confirmCancel ? `Confirmer l’annulation · ${euros(RULES.deposit)}` : 'Annuler sans Joker'} onPress={() => { if (!confirmCancel)
            setConfirmCancel(true);
        else if (route.id) {
            act(route.id, 'cancel');
            setDone(true);
        } }}/>}{confirmCancel && <Notice>Sans Joker, la caution est répartie : {euros(RULES.momentShare)} pour Moment et {euros(RULES.hostShare)} pour l’hôte. Crédits fictifs.</Notice>}</>}<Text style={s.eyebrow}>Aucun débit réel · prototype</Text>
    </Page>;
}
