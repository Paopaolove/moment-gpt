import { StyleSheet, Text, View } from 'react-native';
import { Brand } from '../components/Brand';
import { Action, Copy, SeatRow, Tear } from '../components/Primitives';
import { TicketShell } from '../components/Ticket';
import { c, sans, serif } from '../theme/tokens';
import { Journey } from '../useJourney';
export function Manifeste({ journey }: {
  journey: Journey;
}) {
  const { step, setStep, go } = journey;
  return <View style={s.screen}>
    <Brand large />
    <Text style={s.label}>LA PLACE LIBRE · {String(step + 1).padStart(2, '0')} / 03</Text>
    <Text style={s.hero}>
      {['Quelqu’un, ce soir, a une place à côté de lui.', 'Une chaise. Un siège. Une quatrième raquette.', 'Prenez la place. Partagez le moment.'][step]}
    </Text>
    <TicketShell>
      <SeatRow total={step === 1 ? 3 : 1} taken={step === 2 ? 1 : 0} />
      <Tear />
      <Copy>
        {['Au bistrot, au cinéma, au bord d’un terrain. Il manque seulement quelqu’un.', 'Table, Sport, Culture. Une invitation à rejoindre ce qui existe déjà.', 'Une caution de 20 € tient votre place. Elle vous est rendue quand vous êtes là.'][step]}
      </Copy>
    </TicketShell>
    <Action label={step < 2 ? 'La suite' : 'Voir les places'} onPress={() => step < 2 ? setStep(step + 1) : go('list')} />
    <Copy small>Paris intramuros · IRL · pas de dating.</Copy>
  </View>;
}
const s = StyleSheet.create({
  screen: {
    gap: 22
  },
  label: {
    fontFamily: sans,
    fontSize: 13,
    letterSpacing: 1.8,
    lineHeight: 18,
    color: c.light,
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  hero: {
    fontFamily: serif,
    fontSize: 52,
    lineHeight: 56,
    letterSpacing: -1.8,
    color: c.light
  }
});
