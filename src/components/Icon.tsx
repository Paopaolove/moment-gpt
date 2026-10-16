import React from 'react';
import { View } from 'react-native';
import { colors } from '../theme/tokens';
export type IconName = 'compass' | 'calendar' | 'plus' | 'person' | 'list' | 'map' | 'pin' | 'clock' | 'seats' | 'lock' | 'check' | 'arrow';
/** Every mark is drawn in a 24 pt box; no font glyphs or external assets. */
export function Icon({ name, color = colors.secondary, active = false }: {
  name: IconName;
  color?: string;
  active?: boolean;
}) {
  const stroke = active ? 2.3 : 1.5;
  const line = (left: number, top: number, width: number, rotate = 0) => <View
    style={{
      position: 'absolute',
      left,
      top,
      width,
      height: stroke,
      backgroundColor: color,
      transform: [{ rotate: `${rotate}deg` }]
    }} />;
  const box = (left: number, top: number, width: number, height: number, radius = 0) => <View
    style={{
      position: 'absolute',
      left,
      top,
      width,
      height,
      borderWidth: stroke,
      borderColor: color,
      borderRadius: radius
    }} />;
  return <View accessible={false} style={{ width: 24, height: 24 }}>
    {name === 'compass' && <>
      {box(2, 2, 20, 20, 12)}
      {line(7, 12, 11, -50)}
      {line(8, 9, 7, 40)}
    </>}
    {name === 'calendar' && <>
      {box(3, 5, 18, 17, 3)}
      {line(3, 10, 18)}
      {line(7, 3, 5, 90)}
      {line(14, 3, 5, 90)}
      {box(7, 14, 3, 3, 1)}
    </>}
    {name === 'plus' && <>
      {box(2, 2, 20, 20, 12)}
      {line(7, 12, 10)}
      {line(7, 12, 10, 90)}
    </>}
    {name === 'person' && <>
      {box(8, 2, 8, 8, 5)}
      {box(4, 13, 16, 10, 8)}
    </>}
    {name === 'list' && <>
      {[6, 12, 18].map(y => <React.Fragment key={y}>
        {line(7, y, 15)}
        {box(2, y - 1, 2, 2, 1)}
      </React.Fragment>)}
    </>}
    {name === 'map' && <>
      {box(2, 4, 20, 16, 2)}
      {line(1, 12, 16, 90)}
      {line(8, 12, 16, 90)}
    </>}
    {name === 'pin' && <>
      {box(5, 2, 14, 16, 9)}
      {box(10, 7, 4, 4, 3)}
      {line(9, 19, 6, 55)}
    </>}
    {name === 'clock' && <>
      {box(2, 2, 20, 20, 12)}
      {line(12, 8, 7, 90)}
      {line(12, 12, 5, 20)}
    </>}
    {name === 'seats' && <>
      {box(6, 3, 12, 11, 3)}
      {line(4, 17, 16)}
      {line(3, 20, 6, 90)}
      {line(15, 20, 6, 90)}
    </>}
    {name === 'lock' && <>
      {box(7, 2, 10, 13, 6)}
      {box(4, 10, 16, 12, 3)}
    </>}
    {name === 'check' && <>
      {line(3, 14, 8, 45)}
      {line(8, 12, 15, -45)}
    </>}
    {name === 'arrow' && <>
      {line(3, 12, 17)}
      {line(13, 9, 9, 45)}
      {line(13, 15, 9, -45)}
    </>}
  </View>;
}
