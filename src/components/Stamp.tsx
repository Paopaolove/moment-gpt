import { useContext, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { TicketImpact } from './TicketImpact';
import { c, medium } from '../theme/tokens';
import { feedback } from './haptics';
import { useReducedMotion } from './useReducedMotion';
export function Stamp({ label = 'RÉSERVÉ' }: {
  label?: string;
}) {
  const strike = useContext(TicketImpact);
  const reduced = useReducedMotion();
  const hit = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if(label === 'ACCEPTÉ' || label === 'RÉSERVÉ')
      void feedback('stamp');
    hit.setValue(0);
    const animation = reduced ? Animated.timing(hit, { toValue: 1, duration: 350, useNativeDriver: true }) : Animated.spring(hit, {
      toValue: 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true
    });
    animation.start();
    const impactTimer = setTimeout(strike, reduced ? 0 : 95);
    return () => { clearTimeout(impactTimer); animation.stop(); };
  }, [hit, reduced, label]);
  return <Animated.View style={[s.stamp, {
    opacity: hit,
    transform: reduced ? [] : [{
      scale: hit.interpolate({
        inputRange: [0, 1],
        outputRange: [1.6, 1]
      })
    }, {
      rotate: hit.interpolate({
        inputRange: [0, 1],
        outputRange: ['-22deg', '-8deg']
      })
    }]
  }]}>
    {Array.from({length: 12}, (_, i) => <View key={i} pointerEvents="none" style={{position:'absolute',width: 3 + i % 4,height: 5 + i % 5,borderRadius: 10,backgroundColor:c.accent,left: `${i * 29 % 100}%`,top: i % 2 ? -10 - i : 40 + i,transform:[{rotate:`${i * 31}deg`}]}} />)}
    <Text style={s.text}>{label}</Text>
  </Animated.View>;
}
const s = StyleSheet.create({
  stamp: {
    alignSelf: 'flex-end',
    borderWidth: 3,
    borderColor: c.ink,
    backgroundColor: c.yellow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginVertical: 8
  },
  text: {
    fontFamily: medium,
    fontSize: 23,
    letterSpacing: 3,
    fontWeight: '800',
    color: c.ink
  }
});
