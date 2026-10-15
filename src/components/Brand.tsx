import { StyleSheet, Text, View } from 'react-native';
import { c, sans, serif } from '../theme/tokens';
export function Brand({ large = false }: {
  large?: boolean;
}) {
  return <View accessibilityLabel="Moment GPT 4" style={s.brand}>
    <Text style={[s.word, large && s.large]}>moment</Text>
    <View style={[s.seal, large && s.largeSeal]}>
      <Text style={[s.sealText, large && { fontSize: 15, lineHeight: 18 }]}>{large ? 'GPT\n4' : 'GPT 4'}</Text>
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
    fontSize: 27,
    letterSpacing: -2,
    color: c.light
  },
  large: {
    fontFamily: serif,
    fontSize: 72,
    letterSpacing: -5
  },
  seal: {
    width: 44,
    height: 26,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: c.light,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{
      rotate: '-12deg'
    }]
  },
  largeSeal: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2
  },
  sealText: {
    color: c.light,
    fontFamily: sans,
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 15,
    letterSpacing: 1
  }
});
