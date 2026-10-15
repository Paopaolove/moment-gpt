import { useRef, useState } from 'react';
import { Animated, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Button, TableArt } from '../components';
import { useFlow } from '../navigation/context';
import { colors, styles as s } from '../theme';
const slides = [
    { title: 'Les belles soirées\nne se scrollent pas.', body: 'Un resto, un verre, des conversations qui prennent leur temps. Paris se vit à plusieurs.', art: 'la ville nous rapproche', label: '01 / Retrouver le vrai' },
    { title: 'Une table.\nDes horizons.', body: 'Resto ou bar : rejoignez une table de 1 à 3 invités à Paris intramuros. Des rencontres amicales, sans visée amoureuse.', art: 'votre prochaine conversation', label: '02 / Faire une place' },
    { title: 'On se dit oui.\nEt on y est.', body: 'Après l’accord de l’hôte, 10 minutes pour confirmer. Une caution de 20 € libérée à votre présence. Un Joker par mois pour l’imprévu.', art: 'le plaisir de compter sur vous', label: '03 / Tenir parole' },
];
export function Onboarding() {
    const { width } = useWindowDimensions();
    const { go } = useFlow();
    const [index, setIndex] = useState(0);
    const x = useRef(new Animated.Value(0)).current;
    const scroll = useRef<ScrollView>(null);
    return <View style={s.page}>
    <View style={{ paddingHorizontal: 28, paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
    <Text style={s.heading}>moment<Text style={{ color: colors.accent }}>.</Text>
    </Text>
    <Text style={s.eyebrow}>Paris, ensemble</Text>
    </View>
    <Animated.ScrollView ref={scroll} horizontal pagingEnabled showsHorizontalScrollIndicator={false} scrollEventThrottle={16} onScroll={Animated.event([{ nativeEvent: { contentOffset: { x } } }], { useNativeDriver: true })} onMomentumScrollEnd={e => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))} style={{ flex: 1 }}>{slides.map((slide, i) => <ScrollView key={slide.label} style={{ width }} contentContainerStyle={{ flexGrow: 1, padding: 28, justifyContent: 'center', gap: 24 }}>
        <Animated.View style={{ opacity: x.interpolate({ inputRange: [(i - 1) * width, i * width, (i + 1) * width], outputRange: [.25, 1, .25], extrapolate: 'clamp' }), transform: [{ translateY: x.interpolate({ inputRange: [(i - 1) * width, i * width, (i + 1) * width], outputRange: [22, 0, 22], extrapolate: 'clamp' }) }] }}>
        <TableArt label={slide.art} compact/>
        </Animated.View>
        <Text style={[s.eyebrow, { color: colors.accent }]}>{slide.label}</Text>
        <Text style={[s.title, { fontSize: width < 380 ? 38 : 45, lineHeight: 49 }]}>{slide.title}</Text>
        <Text style={s.muted}>{slide.body}</Text>
        </ScrollView>)}</Animated.ScrollView>
    <View style={{ padding: 28, gap: 22 }}>
    <View accessibilityLabel={`Page ${index + 1} sur 3`} style={{ flexDirection: 'row', gap: 14, justifyContent: 'center' }}>{slides.map((_, i) => <View key={i} style={{ width: 22, height: 4, backgroundColor: colors.line, borderRadius: 4 }}>
        <Animated.View style={{ width: 22, height: 4, borderRadius: 4, backgroundColor: colors.accent, opacity: x.interpolate({ inputRange: [(i - 1) * width, i * width, (i + 1) * width], outputRange: [.1, 1, .1], extrapolate: 'clamp' }), transform: [{ scaleX: x.interpolate({ inputRange: [(i - 1) * width, i * width, (i + 1) * width], outputRange: [.3, 1, .3], extrapolate: 'clamp' }) }] }}/>
        </View>)}</View>
    <Button primary title={index === 2 ? 'Trouver mon prochain moment  ↗' : 'La suite  →'} onPress={() => { if (index === 2)
        go('Fil');
    else {
        scroll.current?.scrollTo({ x: (index + 1) * width, animated: true });
        setIndex(index + 1);
    } }}/>
    <Text style={[s.eyebrow, { textAlign: 'center', fontSize: 9 }]}>Prototype · aucun paiement réel</Text>
    </View>
    </View>;
}
