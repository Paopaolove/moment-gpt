import { arrondissement } from '../domain/rules';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Moment, dateLabel, euros } from '../domain/rules';
import { c, display, medium, sans, serif } from '../theme/tokens';
import { feedback } from './haptics';
import { Perforation } from './Perforation';
import { PaperContext, SeatRow, Tear } from './Primitives';
import { useReducedMotion } from './useReducedMotion';
export function TicketShell({ children, index = 0, onPress, accessibilityLabel }: {
  children: React.ReactNode;
  index?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const reduced = useReducedMotion();
  const arrival = useRef(new Animated.Value(1)).current;
  const lift = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    arrival.setValue(reduced || !onPress ? 1 : 0);
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
    toValue: value,
    ...(reduced ? { overshootClamping: true } : {}),
    useNativeDriver: true,
    friction: 7
  }).start();
  return <PaperContext.Provider value>
    <Pressable accessible={!!onPress} accessibilityRole={onPress ? "button" : undefined} accessibilityLabel={accessibilityLabel} onPress={onPress ? () => { void feedback('selection'); onPress(); } : undefined} onPressIn={() => press(1.018)} onPressOut={() => press(1)}>
      <Animated.View style={[s.paper, {
        opacity: arrival,
        transform: [{
          translateY: arrival.interpolate({
            inputRange: [0, 1],
            outputRange: [32, 0]
          })
        }, {
          rotate: lift.interpolate({
            inputRange: [1, 1.018],
            outputRange: [onPress ? (index % 2 === 0 ? '-1.2deg' : '0.8deg') : '0deg', '0deg'],
            extrapolate: 'clamp'
          })
        }, {
          translateX: lift.interpolate({ inputRange: [1, 1.018], outputRange: [onPress ? (index % 2 === 0 ? -2 : 2) : 0, 0], extrapolate: 'clamp' })
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
export function Ticket({ m, children, taken = 0, index = 0, onPress }: {
  m: Moment;
  children?: React.ReactNode;
  taken?: number;
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

      <Text style={s.title}>
        {m.title}
      </Text>
      <View style={s.timeFace}>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>{Array.from({ length: 12 }, (_, i) => <View key={i} style={{ position: 'absolute', right: 18 - i * 8, top: 24 - i * 8, width: 70 + i * 16, height: 70 + i * 16, borderRadius: 200, borderWidth: 0.5, borderColor: '#BCAF9C', opacity: 0.35, transform: [{ scaleY: 0.55 }, { rotate: '25deg' }] }} />)}</View>
        <Text aria-hidden style={s.district}>{arrondissement(m.district)}</Text>
        <Text style={s.time} adjustsFontSizeToFit numberOfLines={1}>
          {time}
        </Text></View>
    </View>
    <Text style={s.body}>{dateLabel(m.startsAt)} · {m.host === 'Vous' ? 'votre place' : `avec ${m.host}`}</Text>
    <Tear />
    <SeatRow total={m.seats} taken={taken} />
    <View style={s.row}>
      <Text style={s.body}>Invitation de l’hôte</Text>
      <Text style={s.amount}>
        {euros(m.price)}
      </Text>
    </View>
    {m.womenOnly && <Text style={s.label}>Femmes uniquement</Text>}
    <View style={s.serial}>
      <View><Text aria-hidden numberOfLines={1} style={[s.label, { width: '100%', position: 'absolute', left: 0.7, top: 0.6, opacity: 0.3, color: c.accent }]}>N° {serialOf(m.id)} / PARIS</Text><Text style={s.label}>N° {serialOf(m.id)} / PARIS</Text></View>
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
    fontFamily: medium,
    fontSize: 13,
    lineHeight: 20,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: c.muted
  },
  face: {
    position: 'relative'
  },
  timeFace: { position: 'relative', overflow: 'hidden' },
  district: {
    position: 'absolute',
    right: 0,
    bottom: -18,
    fontFamily: serif,
    fontSize: 120,
    lineHeight: 140,
    color: '#EADFCF',
    letterSpacing: -4
  },
  title: {
    fontFamily: serif,
    fontSize: 30,
    lineHeight: 36,
    color: c.ink,
    maxWidth: 290,
    marginTop: 12
  },
  time: {
    fontFamily: display,
    fontSize: 100,
    lineHeight: 116,
    letterSpacing: -6,
    color: c.ink,
    fontVariant: ['tabular-nums']
  },
  body: {
    fontFamily: sans,
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
export function serialOf(id: string) {
  return id.startsWith('place-') ? String(4120 + Number(id.slice(6))).padStart(5, '0') : `0${(5000 + Number(id.replace(/\D/g, '').slice(-3) || 0)) % 10000}`.padStart(5, '0');
}
