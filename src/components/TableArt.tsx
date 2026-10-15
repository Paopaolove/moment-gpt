import { Text, View } from 'react-native';
import { colors, serif } from '../theme';
export function TableArt({ label = 'une place pour vous', compact = false }: {
    label?: string;
    compact?: boolean;
}) {
    return <View accessibilityLabel="Illustration d’une table vue du dessus" style={{ height: compact ? 170 : 270, borderRadius: 26, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
    <View style={{ width: 230, height: 150, borderRadius: 90, backgroundColor: colors.accent, transform: [{ rotate: '-18deg' }], alignItems: 'center', justifyContent: 'center' }}>
    <View style={{ flexDirection: 'row', gap: 30 }}>{[0, 1].map(i => <View key={i} style={{ width: 65, height: 65, borderWidth: 8, borderColor: colors.paper, borderRadius: 40, backgroundColor: colors.line }}/>)}</View>
    </View>
    <Text style={{ position: 'absolute', bottom: 18, fontFamily: serif, fontStyle: 'italic', color: colors.ink, fontSize: 18 }}>{label}</Text>
    </View>;
}
