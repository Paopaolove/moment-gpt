import { View } from 'react-native';
import { Moment } from '../domain/types';
import { Icon } from './Icon';
import { T } from './T';
export function NeighborhoodMap({ moment }: {
  moment: Moment;
}) {
  return <View
    accessibilityLabel={'Plan indicatif du quartier ' + moment.neighborhood + ', sans adresse'}
    style={{
      height: 150,
      backgroundColor: '#F1F2EC',
      borderRadius: 16,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }}>
    {[0, 1, 2, 3, 4].map(i => <View
      key={i}
      style={{
        position: 'absolute',
        width: 400,
        height: 7,
        backgroundColor: '#FFFFFF',
        top: i * 40,
        transform: [{ rotate: '-22deg' }]
      }} />)}
    {[0, 1, 2].map(i => <View
      key={i}
      style={{
        position: 'absolute',
        width: 6,
        height: 240,
        backgroundColor: '#FFFFFF',
        left: 40 + i * 100,
        transform: [{ rotate: '18deg' }]
      }} />)}
    <View style={{
      padding: 12, borderRadius: 32, backgroundColor: '#E0E7DE'
    }}>
      <Icon name="pin" color="#1F2937" />
    </View>
    <T
      style={{
        fontSize: 13,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 10,
        borderRadius: 8
      }}>
      {moment.neighborhood}{" · zone indicative"}</T>
  </View>;
}
