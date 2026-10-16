import { categoryColor } from '../theme/tokens';
import { ambiance } from '../theme/ambiance';
import { TicketImpact } from './TicketImpact';
import { formatDelay } from '../domain/presentation';
import { arrondissement } from '../domain/rules';
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Moment, dateLabel, euros } from '../domain/rules';
import { c, display, medium, sans, serif } from '../theme/tokens';
import { feedback } from './haptics';
import { Perforation } from './Perforation';
import { PaperContext, SeatRow, Tear } from './Primitives';
import { useReducedMotion } from './useReducedMotion';
export function Poster({ children, index = 0, onPress, accessibilityLabel, compact = false, category }: {
  category?: Moment['category'];
  children: React.ReactNode;
  compact?: boolean;
  index?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
}) {
  const reduced = useReducedMotion();
  const lift = useRef(new Animated.Value(1)).current;
  const impact = useRef(new Animated.Value(0)).current;
  const strike = () => {
    if (reduced) return;
    Animated.sequence([Animated.timing(impact, { toValue: 1, duration: 35, useNativeDriver: true }), Animated.spring(impact, { toValue: 0, friction: 4, tension: 220, useNativeDriver: true })]).start();
  };
  const press = (value: number) => Animated.spring(lift, {
    toValue: value,
    ...(reduced ? { overshootClamping: true } : {}),
    useNativeDriver: true,
    friction: 7
  }).start();
  return <PaperContext.Provider value><TicketImpact.Provider value={strike}>
    <Pressable accessible={!!onPress} accessibilityRole={onPress ? "button" : undefined} accessibilityLabel={accessibilityLabel} onPress={onPress ? () => { void feedback('selection'); onPress(); } : undefined} onPressIn={onPress && !reduced ? () => press(1.018) : undefined} onPressOut={onPress && !reduced ? () => press(1) : undefined}>
      <Animated.View style={[s.paper, category && {backgroundColor:categoryColor[category], borderColor:categoryColor[category], shadowColor:category === 'Nuit' ? c.pink : c.blue}, compact && { padding: 16, gap: 8 }, {
        transform: [{ translateY: impact.interpolate({ inputRange: [0, 1], outputRange: [0, 3] }) }, { rotateZ: impact.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '0.5deg'] }) }, {
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
            length: 100
          }, (_, i) => <View key={i} style={[s.grain, {backgroundColor: category === 'Nuit' ? c.light : c.ink,
            right: (i % 10) * 9,
            bottom: Math.floor(i / 10) * 9
          }]} />)}
        </View>
        {children}
      </Animated.View>
    </Pressable>
  </TicketImpact.Provider></PaperContext.Provider>;
}
export const TicketShell = Poster;
export function Ticket({ m, children, taken = 0, index = 0, onPress, now, featured = false, compact = false }: {
  m: Moment;
  now?: number;
  featured?: boolean;
  compact?: boolean;
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
  const ink = {color: m.category === 'Nuit' ? c.light : c.ink};
  if (compact) return <TicketShell category={m.category} compact>
    <Text style={[s.label, ink, { backgroundColor: categoryColor[m.category], color: ink.color, padding: 8 }]}>{m.category} / {m.subtype}</Text>
    <Text style={[s.title, ink, { marginTop: 0, fontSize: 26, lineHeight: 30 }]}>{m.title}</Text>
    <Text style={[s.time, ink, { fontSize: 72, lineHeight: 76 }]}>{time}</Text>
    <SeatRow color={ink.color} total={m.seats} taken={taken} />
    {children}
  </TicketShell>;
  return <TicketShell category={m.category} index={index} onPress={onPress} accessibilityLabel={`Voir le billet : ${m.title}`}>
    {featured && <Text style={[s.label, ink, { color: ink.color }]}>À LA UNE · {now !== undefined ? formatDelay(m.startsAt, now).toUpperCase() : ''}</Text>}
    <View style={[s.row, {minHeight:64,paddingRight:70}]}>
      <Text style={[s.label, ink, { backgroundColor: categoryColor[m.category], color: ink.color, padding: 8 }]}>{m.category} / {m.subtype}</Text>
    </View>
    <View pointerEvents="none" style={{position:'absolute',right:14,top:featured ? 60 : 22,width:64,height:64,alignItems:'center',justifyContent:'center',transform:[{rotate:'12deg'}]}}>{Array.from({length:12},(_,i)=><View key={i} style={{position:'absolute',width:56,height:56,borderRadius:18,backgroundColor:c.yellow,transform:[{rotate:`${i*30}deg`}]}} />)}<Text style={{fontFamily:serif,fontSize:24,color:c.ink}}>{arrondissement(m.district)}</Text></View>
    <View style={s.face}>

      <Text style={[s.title, ink]}>
        {m.title}
      </Text>
      <View style={s.timeFace}>
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>{Array.from({ length: 12 }, (_, i) => <View key={i} style={{ position: 'absolute', right: 18 - i * 8, top: 24 - i * 8, width: 70 + i * 16, height: 70 + i * 16, borderRadius: 200, borderWidth: 0.5, borderColor: '#BCAF9C', opacity: 0.35, transform: [{ scaleY: 0.55 }, { rotate: '25deg' }] }} />)}</View>

        <Text style={[s.time, ink, featured && { fontSize: 112, lineHeight: 130 }]} adjustsFontSizeToFit numberOfLines={1}>
          {time}
        </Text></View>
    </View>
    <Text style={[s.body, ink]}>{dateLabel(m.startsAt)} · {m.host === 'Vous' ? 'votre place' : `avec ${m.host}`}</Text>
    {now !== undefined && !featured && <Text style={[s.body, ink]}>{formatDelay(m.startsAt, now)}</Text>}
    {(featured || !onPress) && <Text style={[s.body, ink]}>☀ MÉTÉO D’AMBIANCE · {ambiance(m.district)}</Text>}
    <Tear />
    <SeatRow color={ink.color} total={m.seats} taken={taken} />
    <View style={s.row}>
      <Text style={[s.body, ink]}>Invitation de l’hôte</Text>
      <Text style={[s.amount, ink]}>
        {m.price === 0 ? 'Juste la place' : euros(m.price)}
      </Text>
    </View>
    {m.womenOnly && <Text style={[s.label, ink]}>Femmes uniquement</Text>}
    <View style={s.serial}>
      <View><Text aria-hidden numberOfLines={1} style={[s.label, ink, { width: '100%', position: 'absolute', left: 0.7, top: 0.6, opacity: 0.3, color: c.accent }]}>N° {serialOf(m.id)} / PARIS</Text><Text style={[s.label, ink]}>N° {serialOf(m.id)} / PARIS</Text></View>
      <View style={s.punch} />
    </View>
    {children}
  </TicketShell>;
}
const s = StyleSheet.create({
  paper: {
    backgroundColor: c.card,
    padding: 20,
    borderWidth: 2,
    borderColor: c.pink,
    shadowColor: c.blue,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    gap: 16,
    overflow: 'hidden',
    marginVertical: 5
  },
  grain: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 2,
    backgroundColor: c.ink,
    opacity: 0.25
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
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: c.muted
  },
  face: {
    position: 'relative'
  },
  timeFace: { position: 'relative', overflow: 'hidden' },
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
    fontSize: 14,
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
  return /^place-\d+$/.test(id) ? String(4120 + Number(id.slice(6))).padStart(5, '0') : `0${(5000 + Number(id.replace(/\D/g, '').slice(-3) || 0)) % 10000}`.padStart(5, '0');
}
