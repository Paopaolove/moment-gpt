import { View } from 'react-native';
import { T } from './T';
export function Brand() {
  return <View style={{
    flexDirection: 'row', alignItems: 'center', gap: 10
  }}>
    <T style={{
      fontFamily: 'Fraunces_500Medium', fontSize: 30, lineHeight: 40
    }}>{"moment"}</T>
    <View
      style={{
        backgroundColor: '#F0F0EE',
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 12
      }}>
      <T style={{
        fontSize: 11, lineHeight: 16, color: '#595959'
      }}>{"GPT Pro"}</T>
    </View>
  </View>;
}
