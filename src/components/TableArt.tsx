import { StyleSheet, Text, View } from 'react-native';
import { colors, serif } from '../theme';
/** An original still life made from native shapes; no remote asset required. */
export function TableArt({
  label = 'une place pour vous',
  compact = false,
}: {
  label?: string;
  compact?: boolean;
}) {
  return (
    <View
      accessibilityLabel="Illustration d’une table pour deux, vue du dessus"
      style={[local.frame, compact && local.compact]}
    >
      <View style={local.sun} />
      <View style={local.shadow} />
      <View style={local.table}>
        {[0, 1].map((index) => (
          <View
            key={index}
            style={[local.setting, index === 1 && local.secondSetting]}
          >
            <View style={local.fork} />
            <View style={local.plate}>
              <View style={local.plateRim} />
            </View>
            <View style={local.knife} />
            <View style={local.glass} />
          </View>
        ))}
        <View style={local.vase}>
          <View style={local.branch} />
        </View>
      </View>
      <View style={local.captionRule} />
      <Text style={local.caption}>{label}</Text>
    </View>
  );
}
const local = StyleSheet.create({
  frame: {
    height: 270,
    borderRadius: 28,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  compact: {
    height: 190,
  },
  sun: {
    position: 'absolute',
    right: -45,
    top: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#E7D9BB',
  },
  shadow: {
    position: 'absolute',
    width: 245,
    height: 152,
    borderRadius: 90,
    backgroundColor: '#D7C6AF',
    transform: [
      {
        translateX: 12,
      },
      {
        translateY: 3,
      },
      {
        rotate: '-18deg',
      },
    ],
  },
  table: {
    width: 245,
    height: 152,
    borderRadius: 90,
    backgroundColor: colors.accent,
    transform: [
      {
        rotate: '-18deg',
      },
    ],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 40,
  },
  setting: {
    width: 95,
    height: 104,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondSetting: {
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },
  plate: {
    width: 65,
    height: 65,
    borderRadius: 34,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plateRim: {
    width: 45,
    height: 45,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.line,
  },
  fork: {
    position: 'absolute',
    left: 6,
    top: 29,
    width: 3,
    height: 47,
    backgroundColor: '#E6C5AB',
    borderRadius: 2,
  },
  knife: {
    position: 'absolute',
    right: 6,
    top: 29,
    width: 3,
    height: 47,
    backgroundColor: '#E6C5AB',
    borderRadius: 2,
  },
  glass: {
    position: 'absolute',
    right: 0,
    top: 6,
    width: 18,
    height: 18,
    borderWidth: 2,
    borderColor: '#E6C5AB',
    borderRadius: 10,
  },
  vase: {
    position: 'absolute',
    left: 114,
    top: 62,
    width: 17,
    height: 25,
    borderRadius: 8,
    backgroundColor: '#E4CCA3',
  },
  branch: {
    width: 4,
    height: 31,
    backgroundColor: colors.olive,
    transform: [
      {
        rotate: '25deg',
      },
    ],
    marginTop: -22,
    marginLeft: 5,
    borderRadius: 4,
  },
  captionRule: {
    position: 'absolute',
    bottom: 44,
    width: 18,
    height: 1,
    backgroundColor: colors.accent,
  },
  caption: {
    position: 'absolute',
    bottom: 18,
    fontFamily: serif,
    fontStyle: 'italic',
    color: colors.ink,
    fontSize: 17,
  },
});
