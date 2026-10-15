import { StyleSheet, Text, View } from 'react-native';
import { c, serif } from '../theme/tokens';
export function Brand({
  large = false
}: {
  large?: boolean;
}) {
  return <View accessibilityLabel="Moment GPT 2" style={s.brand}>
    <Text style={[s.word, large && s.large]}>moment</Text>
    <View style={[s.seal, large && s.largeSeal]}>
      <Text style={s.sealText}>GPT{'\n'}2</Text>
    </View>
  </View>;
}
const s = StyleSheet.create({
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  word: {
    fontFamily: serif,
    fontSize: 32,
    letterSpacing: -2,
    color: c.light
  },
  large: {
    fontSize: 72,
    letterSpacing: -5
  },
  seal: {
    width: 42,
    height: 42,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: c.light,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{
      rotate: '-12deg'
    }]
  },
  largeSeal: {
    width: 58,
    height: 58,
    borderRadius: 30,
    borderWidth: 2
  },
  sealText: {
    color: c.light,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 15,
    letterSpacing: 1
  }
});
