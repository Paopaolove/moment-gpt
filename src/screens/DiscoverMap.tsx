import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Button, Motion, T, s } from '../components/UI';
import { Moment } from '../domain/types';
import { colors as c, categoryColors } from '../theme/tokens';
// Approximate district centres on an orientation map, never private addresses.
const districts: [
  number,
  number,
  number
][] = [
    [1, 44, 43], [2, 51, 32], [3, 61, 40], [4, 59, 54], [5, 53, 68],
    [6, 40, 63], [7, 28, 51], [8, 29, 30], [9, 45, 20], [10, 61, 23],
    [11, 74, 46], [12, 80, 69], [13, 63, 83], [14, 37, 82], [15, 17, 72],
    [16, 6, 43], [17, 23, 12], [18, 49, 5], [19, 76, 17], [20, 88, 42]
  ];
export function ParisMap({ moments, onSelect }: {
  moments: Moment[];
  onSelect: (id: string) => void;
}) {
  const [peekId, setPeek] = useState<string | null>(null);
  const peek = moments.find(m => m.id === peekId) ?? moments[0];
  const positions: { x: number; y: number }[] = [];
  moments.forEach(moment => {
    const district = districts.find(d => d[0] === moment.district) ?? districts[0]!;
    let point = { x: Math.min(84, district[1]), y: Math.min(80, district[2] + 5) };
    let distance = Infinity;
    for (let y = 2; y <= 82; y += 15) for (let x = 0; x <= 84; x += 16) {
      if (positions.some(p => Math.hypot((p.x - x) * 2.7, (p.y - y) * 3) < 44)) continue;
      const candidate = Math.hypot(x - district[1], y - district[2]);
      if (candidate < distance) { point = { x, y }; distance = candidate; }
    }
    positions.push(point);
  });
  return <View style={s.stack}>
    <View
      style={{
        minHeight: 490,
        padding: 12,
        backgroundColor: '#F4F5EF',
        borderRadius: 20,
        overflow: 'hidden'
      }}>
      <T style={{ fontSize: 11, color: c.secondary }}>{"PARIS · PLAN INDICATIF · NORD EN HAUT"}</T>
      <View style={{
        height: 300, marginTop: 12, marginHorizontal: 12
      }}>
        <View
          style={{
            position: 'absolute',
            left: '3%',
            top: '3%',
            width: '94%',
            height: '92%',
            borderTopLeftRadius: 100,
            borderTopRightRadius: 75,
            borderBottomRightRadius: 110,
            borderBottomLeftRadius: 65,
            transform: [{ rotate: '-12deg' }],
            borderWidth: 1,
            borderColor: '#D7DDCF',
            backgroundColor: '#E9EDDF'
          }} />
        {Array.from({ length: 60 }, (_, i) => {
          const x = 4 + i * 1.5;
          const y = 57 + 9 * Math.sin((i / 59) * Math.PI * 2 - 0.7);
          const nextY = 57 + 9 * Math.sin(((i + 1) / 59) * Math.PI * 2 - 0.7);
          return <View key={`river-${i}`} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: '2%', height: 3, borderRadius: 2, backgroundColor: '#A8CDD9', transform: [{ rotate: `${Math.atan2((nextY - y) * 3, 4.5) * 180 / Math.PI}deg` }] }} />;
        })}
        <T
          style={{
            position: 'absolute',
            left: '12%',
            top: '58%',
            fontSize: 10,
            color: '#385B68'
          }}>{"Seine"}</T>
        {districts.map(([n, x, y]) => <View
          key={n}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: 18,
            height: 18,
            alignItems: 'center',
            justifyContent: 'center'
          }}><T style={{ fontSize: 10, color: '#838A7D' }}>{n}</T></View>)}
        {moments.map((moment, positionIndex) => {
          const { x, y } = positions[positionIndex]!;
          const selected = peek?.id === moment.id;
          return <Pressable key={moment.id} accessibilityRole="button" accessibilityLabel={`${moment.title}, ${moment.neighborhood}. Afficher un aperçu.`} accessibilityState={{ selected }} onPress={() => setPeek(moment.id)} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: 44, height: 44, alignItems: 'center', justifyContent: 'center', zIndex: selected ? 2 : 1 }}>
            <View style={{ width: selected ? 34 : 26, height: selected ? 34 : 26, borderRadius: 20, borderWidth: 3, borderColor: 'white', backgroundColor: categoryColors[moment.category], alignItems: 'center', justifyContent: 'center' }}><T style={{ fontSize: 11, color: 'white' }}>{moment.category.slice(0, 1)}</T></View>
          </Pressable>;
        })}
      </View>
    {peek ? <Motion key={peek.id}><View style={[s.card, { padding: 12, gap: 4, backgroundColor: 'white' }] }><T style={s.h}>{peek.title}</T><T style={{ fontSize: 14, color: c.secondary }}>{peek.neighborhood}</T><Button title="Voir le moment" onPress={() => onSelect(peek.id)} /></View></Motion> : <T style={{ fontSize: 13, color: c.secondary }}>{"Touchez un repère pour découvrir le moment. "}</T>}
    </View>
    <T style={{ fontSize: 12, color: c.secondary }}>{"20 arrondissements · repères de quartier approximatifs. Aucune adresse exacte."}</T>
  </View>;
}
