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
const neighborhoods: Record<string, [
  number,
  number
]> = {
  'Sainte-Marguerite': [77, 54],
  'Porte-Saint-Martin': [59, 29],
  'Saint-Germain-des-Prés': [42, 60],
  'Combat': [75, 20],
  'Sorbonne': [54, 64],
  'Folie-Méricourt': [73, 39],
  'Gare': [67, 82],
  'Chaillot': [13, 40],
  'Aligre': [77, 63],
  'Pont-de-Flandre': [79, 10],
  'Les Halles': [45, 42]
};
export function ParisMap({ moments, onSelect }: {
  moments: Moment[];
  onSelect: (id: string) => void;
}) {
  const [peekId, setPeek] = useState<string | null>(null);
  const peek = moments.find(m => m.id === peekId);
  const groups = [...new Set(moments.map(m => m.neighborhood))].map(name => moments.filter(m => m.neighborhood === name));
  return <View style={s.stack}>
    <View
      style={{
        height: 410,
        padding: 12,
        backgroundColor: '#F4F5EF',
        borderRadius: 20,
        overflow: 'hidden'
      }}>
      <T style={{ fontSize: 11, color: c.secondary }}>{"PARIS · PLAN INDICATIF · NORD EN HAUT"}</T>
      <View style={{
        flex: 1, marginTop: 12, marginRight: 30
      }}>
        <View
          style={{
            position: 'absolute',
            left: '3%',
            top: '10%',
            width: '105%',
            height: '86%',
            borderRadius: 140,
            borderWidth: 1,
            borderColor: '#D7DDCF',
            backgroundColor: '#E9EDDF'
          }} />
        <View
          style={{
            position: 'absolute',
            left: '1%',
            top: '58%',
            width: '110%',
            height: 13,
            borderRadius: 12,
            backgroundColor: '#C2DCE5',
            transform: [{ rotate: '16deg' }]
          }} />
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
            width: 37,
            height: 37,
            borderWidth: 1,
            borderColor: '#D0D7C7',
            borderRadius: 14,
            backgroundColor: '#FFFFFFB8',
            alignItems: 'center',
            justifyContent: 'center'
          }}><T style={{ fontSize: 12, color: '#555C50' }}>{n}</T></View>)}
        {groups.map(matches => {
          const first = matches[0]!;
          const district = districts.find(d => d[0] === first.district)!;
          const [x, y] = neighborhoods[first.neighborhood] ?? [district[1], district[2]];
          return <Pressable
            key={first.neighborhood}
            accessibilityRole="button"
            accessibilityLabel={first.neighborhood + ', ' + matches.length + ' moments. Afficher un aperçu.'}
            accessibilityState={{ selected: peek?.neighborhood === first.neighborhood }}
            onPress={() => {
              const i = matches.findIndex(m => m.id === peekId);
              setPeek(matches[(i + 1) % matches.length]!.id);
            }}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              minWidth: 44,
              minHeight: 44,
              alignItems: 'center',
              justifyContent: 'center'
            }}><View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                borderWidth: 2,
                borderColor: 'white',
                backgroundColor: categoryColors[first.category],
                alignItems: 'center',
                justifyContent: 'center',
                transform: [{ scale: peek?.neighborhood === first.neighborhood ? 1.15 : 1 }]
              }}><T style={{ fontSize: 12, color: 'white' }}>{matches.length}</T></View></Pressable>;
        })}
      </View>
    </View>
    {peek ? <Motion key={peek.id}><View style={s.card}><T style={s.h}>{peek.title}</T><T style={{ fontSize: 14, color: c.secondary }}>{peek.neighborhood}</T><Button title="Voir le moment" onPress={() => onSelect(peek.id)} /></View></Motion> : <T style={{ fontSize: 13, color: c.secondary }}>{"Touchez un repère pour découvrir le moment. Plusieurs moments dans un quartier : touchez à nouveau."}</T>}
    <T style={{ fontSize: 12, color: c.secondary }}>{"20 arrondissements · repères de quartier approximatifs. Aucune adresse exacte."}</T>
  </View>;
}
