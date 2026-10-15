import React, { createContext, useContext, useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { c } from '../theme/tokens';
export function Pills({
  items,
  value,
  onChange,
  compact = false
}: {
  compact?: boolean;
  items: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return <View style={s.wrap}>
    {items.map(item => <Pressable key={item} accessibilityRole="button" accessibilityState={{
      selected: item === value
    }} onPress={() => onChange(item)} style={[s.pill, compact && s.compact, item === value && s.selected]}>
      <Text style={[s.pillText, item === value && s.selectedText]}>
        {item}
      </Text>
    </Pressable>)}
  </View>;
}
const s = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  pill: {
    borderWidth: 1,
    borderColor: c.line,
    paddingHorizontal: 17,
    paddingVertical: 12,
    borderRadius: 30
  },
  compact: { width: '17%', paddingHorizontal: 0, alignItems: 'center', paddingVertical: 10 },
  selected: {
    backgroundColor: c.card
  },
  pillText: {
    color: c.light,
    fontSize: 13
  },
  selectedText: {
    color: c.ink
  }
});
