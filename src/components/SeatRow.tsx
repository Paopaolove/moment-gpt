import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { c } from '../theme/tokens';
import { useReducedMotion } from './useReducedMotion';
function Seat({
  filled,
  index
}: {
  filled: boolean;
  index: number;
}) {
  const reduced = useReducedMotion();
  const fill = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const animation = Animated.timing(fill, {
      toValue: filled ? 1 : 0,
      duration: reduced ? 0 : 300,
      delay: reduced ? 0 : index * 180,
      useNativeDriver: true
    });
    animation.start();
    return () => animation.stop();
  }, [filled, index, reduced, fill]);
  return <View style={s.seat}>
    <View style={s.back}>
      <Animated.View style={[s.fill, {
        opacity: fill
      }]} />
    </View>
    <View style={s.cushion} />
    <View style={s.legs}>
      <View style={s.leg} />
      <View style={s.leg} />
    </View>
  </View>;
}
export function Seats({
  count,
  filled = false
}: {
  count: number;
  filled?: boolean;
}) {
  return <View accessibilityLabel={`${count} places ${filled ? 'réservées' : 'libres'}`} style={s.seats}>
    {Array.from({
      length: count
    }, (_, i) => <Seat key={i} filled={filled} index={i} />)}
    <Text style={s.seatLabel}>
      {filled ? 'Votre siège est gardé' : `${count} place${count > 1 ? 's' : ''} libre${count > 1 ? 's' : ''}`}
    </Text>
  </View>;
}
const s = StyleSheet.create({
  seats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'center'
  },
  seat: {
    width: 25,
    height: 34
  },
  back: {
    height: 21,
    borderWidth: 1,
    borderColor: c.ink,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    overflow: 'hidden'
  },
  fill: {
    flex: 1,
    backgroundColor: c.ink
  },
  cushion: {
    height: 4,
    borderWidth: 1,
    borderColor: c.ink,
    marginTop: 3
  },
  legs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 3
  },
  leg: {
    height: 6,
    width: 2,
    backgroundColor: c.ink
  },
  seatLabel: {
    fontSize: 13,
    color: c.muted,
    flexShrink: 1
  }
});
