import { useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, TableArt } from '../components';
import { useReducedMotion } from '../components/useReducedMotion';
import { useFlow } from '../navigation/context';
import { colors, serif } from '../theme';
const slides = [
  {
    chapter: '01 / Le plaisir du vrai',
    title: 'Les belles soirées\nne se scrollent pas.',
    body: 'Une porte que l’on pousse. Un prénom que l’on retient. Une conversation qui nous accompagne jusque chez nous.',
    art: 'Paris se vit à plusieurs',
    detail: 'Des moments en personne, dans les restos et les bars de Paris intramuros.',
  },
  {
    chapter: '02 / Une place à prendre',
    title: 'Une petite table.\nUn grand ailleurs.',
    body: 'Un bistrot dans le 11e, un verre près du canal. Derrière chaque invitation, quelqu’un qui a envie de faire une place.',
    art: 'la ville nous rapproche',
    detail: 'De 1 à 3 places proposées. Des rencontres amicales, sans visée amoureuse.',
  },
  {
    chapter: '03 / Votre tempo',
    title: 'Ce soir. Demain.\nOu maintenant.',
    body: 'Les envies spontanées ont aussi leur adresse. Découvrez les tables à l’improviste, de 90 minutes avant à 30 minutes après le début.',
    art: 'le bonheur d’un petit détour',
    detail: 'Resto ou Bar. Une invitation jusqu’à 50 €, annoncée avant de se décider.',
  },
  {
    chapter: '04 / Un vrai engagement',
    title: 'Un oui qui\ncompte vraiment.',
    body: 'L’hôte vous accueille ? Vous avez 10 minutes pour confirmer. Une caution de 20 € garde votre place, puis vous est rendue à votre présence.',
    art: 'on peut compter sur vous',
    detail:
      'Le bouton de présence apparaît dès H−15. Un Joker par mois protège vos imprévus.',
  },
  {
    chapter: '05 / À vous d’inviter',
    title: 'Les bons moments\ncommencent par vous.',
    body: 'Votre adresse préférée mérite une nouvelle conversation. Ouvrez votre table, racontez votre envie et laissez Paris vous surprendre.',
    art: 'une chaise, mille possibles',
    detail:
      'Pour les hôtes, aucun abonnement. Juste l’envie de partager une vraie soirée.',
  },
];
export function Onboarding() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { go } = useFlow();
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const x = useRef(new Animated.Value(0)).current;
  const list = useRef<FlatList<(typeof slides)[number]>>(null);
  return (
    <View style={local.page}>
      <View style={local.brandRow}>
        <Text style={local.brand}>
          moment
          <Text style={local.dot}>.</Text>
        </Text>
        <Text style={local.city}>PARIS · ENSEMBLE</Text>
      </View>
      <Animated.FlatList
        ref={list}
        data={slides}
        horizontal
        pagingEnabled
        extraData={width}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(slide) => slide.chapter}
        getItemLayout={(_, itemIndex) => ({
          length: width,
          offset: width * itemIndex,
          index: itemIndex,
        })}
        onLayout={() =>
          list.current?.scrollToOffset({
            offset: index * width,
            animated: false,
          })
        }
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x,
                },
              },
            },
          ],
          {
            useNativeDriver: true,
          },
        )}
        onMomentumScrollEnd={(event) =>
          setIndex(Math.round(event.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item }) => (
          <ScrollView
            style={{
              width,
            }}
            contentContainerStyle={local.slide}
            showsVerticalScrollIndicator={false}
          >
            <TableArt label={item.art} />
            <Text style={local.chapter}>{item.chapter}</Text>
            <Text
              accessibilityRole="header"
              style={[local.title, width < 380 && local.smallTitle]}
            >
              {item.title}
            </Text>
            <Text style={local.body}>{item.body}</Text>
            <View style={local.note}>
              <Text style={local.detail}>{item.detail}</Text>
            </View>
          </ScrollView>
        )}
      />
      <View style={[local.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <View
          accessibilityLabel={`Page ${index + 1} sur ${slides.length}`}
          style={local.pagination}
        >
          {slides.map((slide, i) => (
            <View
              key={slide.chapter}
              style={local.track}
            >
              <Animated.View
                style={[
                  local.indicator,
                  {
                    opacity: reduced
                      ? index === i
                        ? 1
                        : 0.15
                      : x.interpolate({
                          inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                          outputRange: [0.15, 1, 0.15],
                          extrapolate: 'clamp',
                        }),
                    transform: [
                      {
                        scaleX: reduced
                          ? 1
                          : x.interpolate({
                              inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                              outputRange: [0.3, 1, 0.3],
                              extrapolate: 'clamp',
                            }),
                      },
                    ],
                  },
                ]}
              />
            </View>
          ))}
        </View>
        <Button
          primary
          title={
            index === slides.length - 1
              ? 'Entrer dans Moment  ↗'
              : 'Découvrir la suite  →'
          }
          onPress={() => {
            if (index === slides.length - 1) {
              go('Fil');
              return;
            }
            list.current?.scrollToOffset({
              offset: (index + 1) * width,
              animated: !reduced,
            });
            setIndex(index + 1);
          }}
        />
        <Text style={local.prototype}>Prototype · aucun paiement réel</Text>
      </View>
    </View>
  );
}
const local = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  brandRow: {
    paddingHorizontal: 28,
    paddingTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    fontFamily: serif,
    fontSize: 34,
    color: colors.ink,
    letterSpacing: -1.5,
  },
  dot: {
    color: colors.accent,
  },
  city: {
    fontSize: 9,
    letterSpacing: 2,
    color: colors.muted,
  },
  slide: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 28,
    gap: 24,
    maxWidth: 720,
    width: '100%',
    alignSelf: 'center',
  },
  chapter: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: serif,
    fontSize: 44,
    lineHeight: 49,
    letterSpacing: -1.8,
    color: colors.ink,
  },
  smallTitle: {
    fontSize: 36,
    lineHeight: 42,
  },
  body: {
    fontSize: 17,
    lineHeight: 28,
    color: colors.ink,
    maxWidth: 500,
  },
  note: {
    borderTopWidth: 1,
    borderColor: colors.line,
    paddingTop: 20,
  },
  detail: {
    fontSize: 13,
    lineHeight: 21,
    color: colors.muted,
  },
  footer: {
    padding: 24,
    gap: 18,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  pagination: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
  },
  track: {
    width: 28,
    height: 3,
    backgroundColor: colors.line,
    overflow: 'hidden',
    borderRadius: 3,
  },
  indicator: {
    width: 28,
    height: 3,
    backgroundColor: colors.accent,
  },
  prototype: {
    textAlign: 'center',
    fontSize: 9,
    letterSpacing: 1,
    color: colors.muted,
    textTransform: 'uppercase',
  },
});
