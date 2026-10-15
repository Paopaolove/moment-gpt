import { StyleSheet, View } from 'react-native';
import { c } from '../theme/tokens';
export function Tear() {
  return <View style={s.tear}>
    <View style={[s.notch, s.left]} />
    {Array.from({
      length: 24
    }, (_, i) => <View key={i} style={s.dash} />)}
    <View style={[s.notch, s.right]} />
  </View>;
}
const s = StyleSheet.create({
  tear: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
    position: 'relative'
  },
  dash: {
    width: 4,
    height: 1,
    backgroundColor: c.muted
  },
  notch: {
    position: 'absolute',
    top: -8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: c.paper
  },
  left: {
    left: -31
  },
  right: {
    right: -31
  }
});
