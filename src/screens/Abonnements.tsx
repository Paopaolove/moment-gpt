import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Card, Header, Notice, Page, Pill, Section } from '../components';
import { RULES, euros } from '../domain/rules';
import { colors, styles as s } from '../theme';
export function Abonnements() {
    const [selected, setSelected] = useState('Découverte');
    const [preview, setPreview] = useState(false);
    return <Page>
    <Header eyebrow="Plus de tables, plus de possibles" title={'Sortez de\nl’ordinaire.'} subtitle="Moment fait une place aux liens qui se créent dans la vraie vie."/>
    <Card>
    <Text style={[s.eyebrow, { color: colors.accent }]}>Pour les hôtes</Text>
    <Text style={s.title}>Toujours gratuit.</Text>
    <Text style={s.text}>Ouvrir une table ne nécessite aucun abonnement. Le plaisir d’accueillir suffit.</Text>
    <Text style={s.muted}>{euros(RULES.hostSubscription)} d’abonnement hôte</Text>
    </Card>
    <View style={s.wrap}>{['Découverte', 'Les habitués'].map(p => <Pill key={p} title={p} selected={selected === p} onPress={() => { setSelected(p); setPreview(false); }}/>)}</View>
    <Text style={s.heading}>{selected === 'Découverte' ? 'Commencer par une rencontre.' : 'Faire des sorties une habitude.'}</Text>
    <Section label="Invitations à Paris" value="Resto & Bar"/>
    <Section label="Le droit à l’imprévu" value={`${RULES.jokerPerMonth} Joker / mois`}/>
    <Section label="Caution par confirmation" value={euros(RULES.deposit)}/>
    <Notice>Les offres et tarifs invités ne sont pas commercialisés dans ce prototype. Cette page permet de découvrir le principe, sans souscription.</Notice>
    <Button primary title="Découvrir cette formule" onPress={() => setPreview(true)}/>{preview && <Notice>Vous avez choisi « {selected} ». Aucun abonnement activé, aucun paiement effectué.</Notice>}</Page>;
}
