import React, { useState } from 'react';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { Button, Fade } from '../components/UI';
import { colors, styles as s, serif } from '../theme';
const slides = [
  { number: '01', title: 'Paris est mieux\nà plusieurs.', text: 'Une table libre. Un verre qui se prolonge. Des personnes à découvrir, pour de vrai.', caption: 'Des invitations IRL. Aucune visée amoureuse.', art: 'à table' },
  { number: '02', title: 'Une invitation.\nUn vrai rendez-vous.', text: 'Resto ou bar, de 1 à 3 places. Choisissez une envie, demandez une place. L’hôte vous accueille.', caption: 'Paris intramuros · invitations jusqu’à 50 €', art: 'ensemble' },
  { number: '03', title: 'On compte\nsur vous.', text: 'Après acceptation, 10 minutes pour confirmer avec une caution de 20 €. Votre présence la libère.', caption: 'Un imprévu ? Un Joker par mois. Tout est simulé ici.', art: 'à bientôt' },
];
export function Onboarding({ done }: { done: () => void }) {
  const [index, setIndex] = useState(0); const slide = slides[index]!; const { height } = useWindowDimensions();
  return <ScrollView style={s.page} contentContainerStyle={{ flexGrow: 1 }}><View style={[s.page, { width: '100%', maxWidth: 680, alignSelf: 'center', padding: 28, gap: 30, justifyContent: 'space-between' }]}><View style={s.row}><Text style={[s.heading, { fontSize: 32 }]}>moment<Text style={{ color: colors.accent }}>.</Text></Text><Text style={s.eyebrow}>LE GOÛT D’ÊTRE LÀ</Text></View><Fade key={index}><View style={{ alignItems: 'center', justifyContent: 'center', height: Math.min(height * .24, 210) }}><View style={{ width: 160, height: 160, borderWidth: 1, borderColor: colors.line, borderRadius: 80, alignItems: 'center', justifyContent: 'center' }}><Text style={{ fontFamily: serif, fontStyle: 'italic', fontSize: 32, color: colors.accent }}>{slide.art}</Text></View></View><Text style={s.eyebrow}>L’ESPRIT MOMENT / {slide.number}</Text><Text style={s.title}>{slide.title}</Text><Text style={s.text}>{slide.text}</Text><Text style={s.muted}>{slide.caption}</Text></Fade><View style={{ gap: 20, paddingBottom: 12 }}><View style={s.wrap}>{slides.map((_, n) => <View key={n} style={{ width: n === index ? 28 : 7, height: 4, borderRadius: 4, backgroundColor: n === index ? colors.accent : colors.line }} />)}</View><Button primary title={index === 2 ? 'Découvrir les invitations  ↗' : 'Continuer  →'} onPress={() => index === 2 ? done() : setIndex(index + 1)} /></View></View></ScrollView>;
}
