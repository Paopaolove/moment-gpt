import { Text, View } from 'react-native';
import { c, serif, medium } from '../theme/tokens';
import { Sticker, Entrance } from './Funky';
import { Stamp } from './Stamp';
export function Brand({ large = false }: { large?: boolean }) {
 if (!large) return <Text accessibilityLabel="Moment GPT Funky" style={{fontFamily:serif,fontSize:23,color:c.yellow}}>moment funky ✦</Text>;
 return <Entrance><Sticker shape="star" size={124}><Text style={{fontFamily:serif,fontSize:30,lineHeight:30,color:c.ink,textAlign:'center'}}>moment{ '\n' }funky</Text></Sticker><Text style={{fontFamily:medium,fontSize:14,color:c.ink,textAlign:'center'}}>GPT FUNKY</Text></Entrance>;
}
