import { StyleSheet, View } from 'react-native';
import { c } from '../theme/tokens';
export function Perforation() {
  return <View accessibilityElementsHidden style={s.edge}>
    {Array.from({
      length: 19
    }, (_, i) => <View key={i} style={s.hole} />)}
  </View>;
}
const s = StyleSheet.create({
  edge: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: -5,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  hole: {
    width: 8,
    height: 10,
    borderRadius: 5,
    backgroundColor: c.paper
  }
});
