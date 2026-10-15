import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';
import { PressableScale } from './PressableScale';
import { useReducedMotion } from './useReducedMotion';
export function Pill({
  title,
  selected = false,
  onPress,
}: {
  title: string;
  selected?: boolean;
  onPress: () => void;
}) {
  const progress = useRef(new Animated.Value(selected ? 1 : 0)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    Animated.timing(progress, {
      toValue: selected ? 1 : 0,
      duration: reduced ? 0 : 180,
      useNativeDriver: true,
    }).start();
    return () => progress.stopAnimation();
  }, [selected, progress, reduced]);
  return (
    <PressableScale
      onPress={onPress}
      accessibilityState={{
        selected,
      }}
      style={[local.pill, selected && local.selected]}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          local.tint,
          {
            opacity: progress,
          },
        ]}
      />
      <Text style={[local.label, selected && local.selectedLabel]}>{title}</Text>
    </PressableScale>
  );
}
const local = StyleSheet.create({
  pill: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  selected: {
    borderColor: colors.accent,
  },
  tint: {
    position: 'absolute',
    inset: 0,
    backgroundColor: colors.card,
  },
  label: {
    fontSize: 13,
    color: colors.muted,
  },
  selectedLabel: {
    color: colors.accent,
    fontWeight: '600',
  },
});
