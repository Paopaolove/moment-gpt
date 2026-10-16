import { View } from 'react-native';
import { Icon } from '../components/Icon';
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
        {onboarding.slide === 0 ? <View style={{ width: 240, height: 145, justifyContent: 'center' }}>
          <View style={{ position: 'absolute', left: 10, right: 2, top: 12, bottom: 0, borderRadius: 14, backgroundColor: '#E3E5DD', transform: [{ rotate: '-5deg' }] }} />
          <View style={{ padding: 16, gap: 7, borderRadius: 14, borderWidth: 1, borderColor: c.border, backgroundColor: 'white' }}>
            <T style={{ fontSize: 11, color: '#9A5839', letterSpacing: 2 }}>TABLE · CE SOIR</T>
            <T style={s.h}>Une place à table</T>
            <T style={{ fontSize: 13, color: c.secondary }}>Aligre · Paris 12e</T>
            <T style={{ fontSize: 13 }}>Invitation · 20 €</T>
          </View>
        </View> : onboarding.slide === 1 ? <View style={{ width: 230, padding: 20, gap: 12, borderRadius: 16, backgroundColor: 'white', borderWidth: 1, borderColor: c.border }}>
          <View style={s.between}><T style={{ fontSize: 36, fontFamily: 'InterTight_600SemiBold' }}>10:00</T><View style={{ padding: 8, borderRadius: 24, backgroundColor: '#E7F3E9' }}><Icon name="check" color={c.success} /></View></View>
          <View style={{ height: 6, borderRadius: 3, backgroundColor: c.border }}><View style={{ width: '80%', height: 6, borderRadius: 3, backgroundColor: c.success }} /></View>
          <T style={{ fontSize: 12, color: c.secondary }}>Votre place vous attend</T>
        </View> : <View style={{ width: 250, height: 155, borderRadius: 16, overflow: 'hidden', backgroundColor: '#E8EDDF', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          {[25, 80, 135].map(top => <View key={top} style={{ position: 'absolute', top, width: 300, height: 8, backgroundColor: 'white', transform: [{ rotate: '-20deg' }] }} />)}
          {[55, 175].map(left => <View key={left} style={{ position: 'absolute', left, width: 7, height: 200, backgroundColor: 'white', transform: [{ rotate: '15deg' }] }} />)}
          <View style={{ padding: 10, backgroundColor: c.accent, borderRadius: 24 }}><Icon name="pin" color="white" /></View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'white', padding: 8, borderRadius: 10 }}><Icon name="lock" /><T style={{ fontSize: 12 }}>adresse après le oui</T></View>
        </View>}

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
