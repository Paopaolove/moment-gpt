import { Opening, Marquee } from '../components/Funky';
import { StyleSheet, Text, View } from 'react-native';
import { Brand } from '../components/Brand';
import { Action, Copy, SeatRow, Tear } from '../components/Primitives';
import { TicketShell } from '../components/Ticket';
import { c, medium, sans, serif } from '../theme/tokens';
import { Journey } from '../useJourney';
export function Manifeste({ journey }: {
  journey: Journey;
}) {
  const { step, setStep, go } = journey;
  return <View style={s.screen}>
    <Opening><Brand large /></Opening>
    <Marquee text="LE GRAND BAL DES PLACES LIBRES · " />
    <Text style={s.label}>LA PLACE LIBRE · {String(step + 1).padStart(2, '0')} / 03</Text>
    <Text style={s.hero}>
      {['Paris sort. Vous aussi ?', 'Le canapé survivra.', 'On danse ?'][step]}
    </Text>
    <TicketShell compact>
      <Copy>
        {['Une chaise vide. Votre entrée en scène.', 'Table, Sport, Culture, Nuit. Choisissez votre piste.', '20 € de caution. Présent ? Tout est rendu.'][step]}
      </Copy>
    </TicketShell>
    <Action label={step < 2 ? 'La suite' : 'Voir les places'} onPress={() => step < 2 ? setStep(step + 1) : go('list')} />
    <Copy small>Paris intramuros · IRL · pas de dating.</Copy>
  </View>;
}
const s = StyleSheet.create({
  screen: {
    gap: 10
  },
  label: {
    fontFamily: medium,
    fontSize: 14,
    letterSpacing: 1.8,
    lineHeight: 18,
    color: c.light,
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  hero: {
    fontFamily: serif,
    fontSize: 36,
    lineHeight: 40,
    letterSpacing: -1.8,
    color: c.light
  }
});
