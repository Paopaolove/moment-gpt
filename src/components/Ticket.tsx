import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Moment, dateLabel, euros } from '../domain/rules';
import { c, serif } from '../theme/tokens';
import { useReducedMotion } from './useReducedMotion';
import { Perforation } from './Perforation';
import { PaperContext, Seats, Tear } from './Primitives';
export function TicketShell({
  children,
  index = 0,
  onPress,
  accessibilityLabel
}: {
  children: React.ReactNode;
  index?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const reduced = useReducedMotion();
  const arrival = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    arrival.setValue(reduced ? 1 : 0);
    const animation = Animated.timing(arrival, {
      toValue: 1,
      duration: reduced ? 0 : 580,
      delay: reduced ? 0 : Math.min(index, 5) * 85,
      useNativeDriver: true
    });
    animation.start();
    return () => animation.stop();
  }, [reduced, index, arrival]);
  const press = (value: number) => Animated.spring(lift, {
    toValue: reduced ? 1 : value,
    useNativeDriver: true,
    friction: 7
  }).start();
  return <PaperContext.Provider value>
    <Pressable accessible={!!onPress} accessibilityRole={onPress ? "button" : undefined} accessibilityLabel={accessibilityLabel} onPress={onPress} onPressIn={() => press(1.018)} onPressOut={() => press(1)}>
      <Animated.View style={[s.paper, {
        opacity: arrival,
        transform: [{
          translateY: arrival.interpolate({
            inputRange: [0, 1],
            outputRange: [32, 0]
          })
        }, {
          rotate: arrival.interpolate({
            inputRange: [0, 1],
            outputRange: ['-3deg', index % 2 ? '1deg' : '-1deg']
          })
        }, {
          scale: lift
        }]
      }]}>
        <Perforation />
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          {Array.from({
            length: 60
          }, (_, i) => <View key={i} style={[s.grain, {
            left: `${i * 37 % 100}%`,
            top: `${i * 23 % 100}%`
          }]} />)}
        </View>
        {children}
      </Animated.View>
    </Pressable>
  </PaperContext.Provider>;
}
export function Ticket({
  m,
  children,
  filled = false,
  index = 0,
  onPress
}: {
  m: Moment;
  children?: React.ReactNode;
  filled?: boolean;
  index?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const time = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    hour: '2-digit',
    minute: '2-digit'
  }).format(m.startsAt);
  return <TicketShell index={index} onPress={onPress} accessibilityLabel={`Voir le billet : ${m.title}`}>
    <View style={s.row}>
      <Text style={s.label}>{m.category} / {m.subtype}</Text>
      <Text style={s.label}>P / {String(m.district).padStart(2, '0')}</Text>
    </View>
    <View style={s.face}>
      <Text accessibilityElementsHidden style={s.district}>{m.district}e</Text>
      <Text style={s.title}>
        {m.title}
      </Text>
      <Text style={s.time} adjustsFontSizeToFit numberOfLines={1}>
        {time}
      </Text>
    </View>
    <Text style={s.body}>{dateLabel(m.startsAt)} · avec {m.host}</Text>
    <Tear />
    <Seats count={m.seats} filled={filled} />
    <View style={s.row}>
      <Text style={s.body}>Invitation de l’hôte</Text>
      <Text style={s.amount}>
        {euros(m.price)}
      </Text>
    </View>
    {m.womenOnly && <Text style={s.label}>Femmes uniquement</Text>}
    <View style={s.serial}>
      <Text style={s.label}>N° {m.id.replace('place-', '000')} / PARIS</Text>
      <View style={s.punch} />
    </View>
    {children}
  </TicketShell>;
}
const s = StyleSheet.create({
  paper: {
    backgroundColor: c.card,
    padding: 22,
    gap: 16,
    overflow: 'hidden',
    marginVertical: 5
  },
  grain: {
    position: 'absolute',
    width: 2,
    height: 1,
    backgroundColor: c.muted,
    opacity: 0.12
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10
  },
  label: {
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: c.muted
  },
  face: {
    position: 'relative'
  },
  district: {
    position: 'absolute',
    right: -9,
    top: -15,
    fontFamily: serif,
    fontSize: 138,
    color: '#D9CBB7',
    letterSpacing: -10
  },
  title: {
    fontFamily: serif,
    fontSize: 34,
    lineHeight: 38,
    color: c.ink,
    maxWidth: 245,
    marginTop: 12
  },
  time: {
    fontFamily: serif,
    fontSize: 100,
    lineHeight: 116,
    letterSpacing: -6,
    color: c.ink,
    fontVariant: ['tabular-nums']
  },
  body: {
    fontSize: 13,
    lineHeight: 21,
    color: c.muted
  },
  amount: {
    fontFamily: serif,
    fontSize: 30,
    color: c.ink
  },
  serial: {
    borderTopWidth: 1,
    borderColor: c.line,
    paddingTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  punch: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: c.paper
  }
});
