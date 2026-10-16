import { View } from 'react-native';
import { Brand } from '../components/Brand';
import { Button, Motion, T, s } from '../components/UI';
import { colors as c } from '../theme/tokens';
import type { JourneyContext } from '../useJourney';
export function Onboarding({ ctx }: {
  ctx: JourneyContext;
}) {
  const { now, onboarding, next } = ctx;
  const slides = [['Une place libre.\nUn vrai moment.', 'Une table, un verre, une sortie. Retrouvez des gens autour d’un moment, à Paris.', '01 / 03'], ['On se dit oui.\nPuis on s’engage.', 'L’hôte accepte. Vous avez 10 minutes pour confirmer. Une caution de 20 € est rendue si vous êtes présent.', '02 / 03'], ['Moins de profils.\nPlus de moments.', 'Le quartier d’abord, l’adresse après le oui. À vous de choisir ce que vous partagerez.', '03 / 03']][onboarding.slide]!;
  return <View
    style={{
      flex: 1,
      maxWidth: 560,
      width: '100%',
      alignSelf: 'center',
      padding: 28,
      justifyContent: 'space-between'
    }}>
    <Brand />
    <Motion key={onboarding.slide}>
      <View
        style={{
          height: 180,
          backgroundColor: c.surface,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 32
        }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {[0, 1, 2].map(i => <View
            key={i}
            style={{
              width: 52,
              height: 70,
              borderRadius: 26,
              borderWidth: 1,
              borderColor: i === onboarding.slide ? c.accent : c.border,
              backgroundColor: i === onboarding.slide ? 'white' : c.surface,
              transform: [{ rotate: `${(i - 1) * 12}deg` }]
            }} />)}
        </View>
      </View>
      <T
        style={[s.muted, {
          fontSize: 12, letterSpacing: 2, marginBottom: 16
        }]}>
        {slides[2]}
      </T>
      <T style={s.large}>
        {slides[0]}
      </T>
      <T style={[s.muted, { marginTop: 20 }]}>
        {slides[1]}
      </T>
    </Motion>
    <View style={{ gap: 8 }}>
      <Button title="Continuer" onPress={() => next({ type: 'next', now })} />
      <Button
        title="Explorer sans compte"
        variant="text"
        onPress={() => {
          next({ type: 'next', now });
          next({ type: 'next', now });
          next({ type: 'next', now });
        }} />
    </View>
  </View>;
}
