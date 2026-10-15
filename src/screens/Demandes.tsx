import { Text } from 'react-native';
import { Button, Card, Header, MomentCard, Notice, Page } from '../components';
import { dateLabel } from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { colors, styles as s } from '../theme';
const labels = { requested: 'En attente de l’hôte', accepted: 'Une place vous attend', confirmed: 'C’est confirmé', present: 'Vous y êtes', cancelled: 'Annulé', expired: 'Délai écoulé' };
export function Demandes() {
    const { moments, bookings, act, message } = useStore();
    const { go } = useFlow();
    return <Page>
    <Header eyebrow="Votre carnet de sorties" title={'De belles choses\nse préparent.'} subtitle="Vos demandes et vos invitations, au même endroit."/>
    <Text style={s.eyebrow}>Vous rejoignez une table</Text>{!bookings.length && <Card>
        <Text style={s.heading}>Le premier pas, c’est une envie.</Text>
        <Text style={s.muted}>Demandez une place dans le fil. L’hôte pourra ensuite vous accueillir.</Text>
        </Card>}{bookings.map(b => {
            const m = moments.find(m => m.id === b.momentId);
            if (!m)
                return null;
            return <Card key={m.id}>
            <Text style={[s.eyebrow, { color: colors.accent }]}>{labels[b.status]}</Text>
            <Text style={s.heading}>{m.title}</Text>
            <Text style={s.muted}>{dateLabel(m.startsAt)} · avec {m.host}</Text>{b.status === 'requested' && <>
                <Notice>Démo : essayez l’acceptation de l’hôte pour découvrir la suite du parcours.</Notice>
                <Button title="Simuler l’accord de l’hôte" onPress={() => { act(m.id, 'accept', true); go('Confirmation', m.id); }}/>
                <Button title="Retirer ma demande" onPress={() => act(m.id, 'cancel')}/>
                </>}{b.status === 'accepted' && <Button title="Confirmer dans les 10 minutes  →" onPress={() => go('Confirmation', m.id)}/>}{(b.status === 'confirmed' || b.status === 'present') && <Button title="Ouvrir la conversation  →" onPress={() => go('Chat', m.id)}/>}{b.status === 'expired' && <Notice>Aucune caution réservée. Le délai de confirmation est écoulé.</Notice>}<Button title="Voir l’invitation" onPress={() => go('Detail', m.id)}/>
            </Card>;
        })}<Text style={s.eyebrow}>Vous ouvrez votre table</Text>{moments.filter(m => m.own).map(m => <MomentCard key={m.id} moment={m} onPress={() => go('Detail', m.id)}/>)}{!moments.some(m => m.own) && <Text style={s.muted}>Votre prochaine table commence peut-être ici. L’hôte ne paie pas d’abonnement.</Text>}{!!message && <Notice>{message}</Notice>}<Button primary title="Découvrir les invitations  ↗" onPress={() => go('Fil')}/>
    </Page>;
}
