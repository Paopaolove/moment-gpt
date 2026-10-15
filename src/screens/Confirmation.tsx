import { Text, View } from 'react-native';
import { Button, Card, Countdown, Header, Notice, Page, Section } from '../components';
import { RULES, euros } from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { styles as s } from '../theme';
export function Confirmation() {
    const { route, go } = useFlow();
    const { bookings, moments, now, act } = useStore();
    const b = bookings.find(b => b.momentId === route.id);
    const m = moments.find(m => m.id === route.id);
    if (!m || !b)
        return <Page>
        <Header title="Une place à choisir."/>
        <Button primary title="Voir les invitations" onPress={() => go('Fil')}/>
        </Page>;
    const accepted = b.status === 'accepted';
    return <Page>
    <Header eyebrow="Le petit oui qui change la soirée" title={accepted ? 'Cette place,\nelle est pour vous.' : b.status === 'expired' ? 'Une prochaine fois.' : 'C’est dans l’agenda.'} subtitle={`${m.host} vous attend · ${m.title}`}/>{accepted && b.acceptedAt !== undefined && <Countdown acceptedAt={b.acceptedAt} now={now}/>}<Card>
    <View style={s.row}>
    <Text style={s.heading}>Une promesse de présence.</Text>
    <Text style={s.heading}>{euros(RULES.deposit)}</Text>
    </View>
    <Text style={s.muted}>La caution est réservée à la confirmation, puis libérée lorsque vous signalez votre présence, dès H−{RULES.presenceBeforeMinutes}.</Text>
    <Section label="Annulation sans Joker" value={euros(RULES.deposit)}/>
    <Section label="Part Moment" value={euros(RULES.momentShare)}/>
    <Section label="Part de l’hôte" value={euros(RULES.hostShare)}/>
    </Card>
    <Notice>Simulation uniquement : aucun moyen de paiement demandé, aucun débit. L’invitation de {euros(m.price)} est distincte de la caution.</Notice>{accepted ? <Button primary title={`Confirmer · caution fictive ${euros(RULES.deposit)}`} onPress={() => { act(m.id, 'confirm'); go('Chat', m.id); }}/> : <>
        <Text style={s.muted}>{b.status === 'expired' ? 'Les 10 minutes sont écoulées. Aucune caution n’a été réservée.' : 'Retrouvez le statut de votre place dans vos demandes.'}</Text>
        <Button primary title="Retrouver mes demandes" onPress={() => go('Demandes')}/>
        </>}</Page>;
}
