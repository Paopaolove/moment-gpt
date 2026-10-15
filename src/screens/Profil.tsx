import { useState } from 'react';
import { Text, View } from 'react-native';
import { Avatar, Button, Card, Header, Page, Pill, Section } from '../components';
import { RULES, dateLabel, euros } from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { styles as s } from '../theme';
export function Profil() {
    const { go } = useFlow();
    const { woman, setWoman, jokerUsed, now, advance, credits, momentCredits } = useStore();
    const [demo, setDemo] = useState(false);
    return <Page>
    <View style={s.row}>
    <Avatar name="Vous" size={84}/>
    <Text style={s.eyebrow}>Membre de démonstration</Text>
    </View>
    <Header eyebrow="Votre place dans la ville" title={'Paris commence\navec vous.'} subtitle="Un profil simple. Des moments qui vous ressemblent."/>
    <Card>
    <Text style={s.heading}>Un peu de vous.</Text>
    <Text style={s.muted}>Paris · aime les grandes conversations et les petites tables.</Text>
    <Pill title="Je suis une femme" selected={woman} onPress={() => setWoman(!woman)}/>
    <Text style={s.muted}>Cette déclaration permet de rejoindre les invitations réservées aux femmes.</Text>
    </Card>
    <Section label="Joker ce mois-ci" value={jokerUsed ? 'Déjà utilisé' : '1 disponible'}/>
    <Button title="Le droit à l’imprévu  ↗" onPress={() => go('Joker')}/>
    <Button title="Les formules Moment  ↗" onPress={() => go('Abonnements')}/>
    <Button title="Mes avis  ↗" onPress={() => go('Avis')}/>
    <Button primary title="Ouvrir ma table  ↗" onPress={() => go('Publier')}/>
    <Button title={demo ? 'Fermer l’atelier démo' : 'Ouvrir l’atelier démo'} onPress={() => setDemo(!demo)}/>{demo && <Card>
        <Text style={s.eyebrow}>Horloge de simulation</Text>
        <Text style={s.muted}>{dateLabel(now)} · {RULES.timezone}</Text>{[10, 45, 31 * 1440].map(n => <Button key={n} title={n > 100 ? 'Avancer de 31 jours' : `Avancer de ${n} minutes`} onPress={() => advance(n)}/>)}<Text style={s.muted}>Crédits fictifs : Moment {euros(momentCredits)} · hôtes {euros(Object.values(credits).reduce((a, b) => a + b, 0))}</Text>
        </Card>}<Text style={s.muted}>Tout reste en mémoire pendant cette session. Les paiements, les conversations et les profils sont des simulations.</Text>
    </Page>;
}
