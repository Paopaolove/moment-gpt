import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { RULES, confirmationRemaining } from '../domain/rules';
import { colors, serif } from '../theme';
import { useReducedMotion } from './useReducedMotion';
export function Countdown({ acceptedAt, now }: { acceptedAt: number; now: number }) {
  const seconds = confirmationRemaining(acceptedAt, now);
  const reduced = useReducedMotion();
  const progress = useRef(
    new Animated.Value(seconds / (RULES.confirmationMinutes * 60)),
  ).current;
  useEffect(() => {
    Animated.timing(progress, {
      toValue: seconds / (RULES.confirmationMinutes * 60),
      duration: reduced ? 0 : 850,
      useNativeDriver: false,
    }).start();
    return () => progress.stopAnimation();
  }, [seconds, reduced, progress]);
  return (
    <View style={local.container}>
      <Text style={local.caption}>
        {seconds ? 'Votre place vous est réservée' : 'Le délai est écoulé'}
      </Text>
      <Text
        accessibilityRole="timer"
        accessibilityLabel={`${Math.floor(seconds / 60)} minutes ${seconds % 60} secondes restantes`}
        style={[local.clock, seconds <= 60 && local.urgent]}
      >{`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`}</Text>
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: 600,
          now: seconds,
        }}
        style={local.track}
      >
        <Animated.View
          style={[
            local.fill,
            {
              width: progress.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      <View style={local.limits}>
        <Text style={local.label}>À vous de confirmer</Text>
        <Text style={local.label}>10 min au total</Text>
      </View>
    </View>
  );
}
const local = StyleSheet.create({
  container: {
    paddingVertical: 32,
    gap: 20,
    alignItems: 'center',
  },
  caption: {
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: colors.muted,
  },
  clock: {
    fontFamily: serif,
    fontSize: 88,
    lineHeight: 104,
    color: colors.ink,
    letterSpacing: -4,
    fontVariant: ['tabular-nums'],
  },
  urgent: {
    color: colors.accent,
  },
  track: {
    height: 5,
    width: '100%',
    backgroundColor: colors.line,
    overflow: 'hidden',
    borderRadius: 5,
  },
  fill: {
    height: 5,
    backgroundColor: colors.accent,
    borderRadius: 5,
  },
  limits: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontSize: 11,
    color: colors.muted,
  },
});
