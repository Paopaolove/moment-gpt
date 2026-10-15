import { StyleSheet, Text, View } from 'react-native';
import { type Moment, dateLabel, euros, isUrgent } from '../domain/rules';
import { useStore } from '../store';
import { colors, serif } from '../theme';
import { AnimatedEntry } from './AnimatedEntry';
import { Avatar } from './Avatar';
import { PressableScale } from './PressableScale';
export function MomentCard({
  moment,
  index = 0,
  onPress,
}: {
  moment: Moment;
  index?: number;
  onPress: () => void;
}) {
  const { now } = useStore();
  const urgent = isUrgent(moment.startsAt, now);
  return (
    <AnimatedEntry index={index}>
      <PressableScale
        onPress={onPress}
        accessibilityLabel={`Voir ${moment.title}, avec ${moment.host}, ${euros(moment.price)}`}
        style={local.card}
      >
        <View style={[local.cover, moment.category === 'Bar' && local.barCover]}>
          <View style={local.coverTop}>
            <Text
              style={local.neighborhood}
            >{`PARIS / ${String(moment.district).padStart(2, '0')}`}</Text>
            <Text style={local.category}>{moment.category}</Text>
          </View>
          <View
            accessible={false}
            style={local.illustration}
          >
            <View style={local.plate}>
              <View style={local.plateCenter} />
            </View>
            <View style={local.stem} />
            <View style={local.glass} />
            <View style={local.napkin} />
          </View>
          <Text style={local.coverCaption}>
            {moment.category === 'Bar'
              ? 'la soirée commence ici'
              : 'le plaisir de partager'}
          </Text>
        </View>
        <View style={local.content}>
          <View style={local.meta}>
            <Text style={[local.status, urgent && local.urgent]}>
              {urgent ? '● À l’improviste' : '○ À venir'}
            </Text>
            <Text
              style={local.seats}
            >{`${moment.seats} place${moment.seats > 1 ? 's' : ''}`}</Text>
          </View>
          <Text
            accessibilityRole="header"
            style={local.title}
          >
            {moment.title}
          </Text>
          <Text style={local.date}>{dateLabel(moment.startsAt)}</Text>
          <Text
            numberOfLines={2}
            style={local.description}
          >
            {moment.description}
          </Text>
          {moment.womenOnly && <Text style={local.women}>Table entre femmes</Text>}
          <View style={local.footer}>
            <View style={local.host}>
              <Avatar
                name={moment.host}
                size={38}
              />
              <View style={local.hostCopy}>
                <Text style={local.hostName}>{moment.host}</Text>
                <Text style={local.hostLabel}>vous fait une place</Text>
              </View>
            </View>
            <View style={local.priceBlock}>
              <Text style={local.price}>{`${euros(moment.price)} ↗`}</Text>
              <Text style={local.hostLabel}>invitation / pers.</Text>
            </View>
          </View>
        </View>
      </PressableScale>
    </AnimatedEntry>
  );
}
const local = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 26,
    backgroundColor: colors.white,
    overflow: 'hidden',
    marginBottom: 24,
  },
  cover: {
    height: 176,
    backgroundColor: '#E4D5C2',
    padding: 20,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  barCover: {
    backgroundColor: '#DCE0D1',
  },
  coverTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  neighborhood: {
    color: colors.ink,
    letterSpacing: 3,
    fontSize: 10,
  },
  category: {
    color: colors.ink,
    fontSize: 12,
    fontFamily: serif,
    fontStyle: 'italic',
  },
  illustration: {
    position: 'absolute',
    width: 200,
    height: 160,
    alignSelf: 'center',
    top: 25,
    transform: [
      {
        rotate: '-15deg',
      },
    ],
  },
  plate: {
    position: 'absolute',
    top: 24,
    left: 24,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plateCenter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: colors.line,
  },
  stem: {
    position: 'absolute',
    top: 68,
    right: 25,
    width: 2,
    height: 35,
    backgroundColor: colors.accent,
  },
  glass: {
    position: 'absolute',
    right: 9,
    top: 30,
    width: 34,
    height: 42,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: colors.accent,
    backgroundColor: '#C48F7355',
  },
  napkin: {
    position: 'absolute',
    left: 1,
    top: 42,
    width: 12,
    height: 68,
    backgroundColor: colors.olive,
    borderRadius: 2,
  },
  coverCaption: {
    fontFamily: serif,
    fontStyle: 'italic',
    fontSize: 15,
    color: colors.ink,
    alignSelf: 'flex-end',
  },
  content: {
    padding: 24,
    gap: 14,
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  status: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 1.3,
    color: colors.muted,
  },
  urgent: {
    color: colors.accent,
  },
  seats: {
    fontSize: 11,
    color: colors.muted,
  },
  title: {
    fontFamily: serif,
    fontSize: 31,
    lineHeight: 37,
    letterSpacing: -0.7,
    color: colors.ink,
  },
  date: {
    fontSize: 12,
    lineHeight: 19,
    color: colors.accent,
  },
  description: {
    fontSize: 14,
    lineHeight: 23,
    color: colors.muted,
  },
  women: {
    fontSize: 11,
    color: colors.olive,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingTop: 18,
    marginTop: 4,
    borderTopWidth: 1,
    borderColor: colors.line,
  },
  host: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    flex: 1,
  },
  hostCopy: {
    flex: 1,
    gap: 3,
  },
  hostName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.ink,
  },
  hostLabel: {
    fontSize: 10,
    color: colors.muted,
    lineHeight: 16,
  },
  priceBlock: {
    alignItems: 'flex-end',
    gap: 3,
  },
  price: {
    fontFamily: serif,
    fontSize: 24,
    color: colors.ink,
  },
});
