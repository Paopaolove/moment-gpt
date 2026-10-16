import { Marquee } from '../components/Funky';
import { useEffect } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Action, Copy, Input, Pills } from '../components/Primitives';
import { Ticket } from '../components/Ticket';
import { addDays, offerHours, parisDay, parisTime } from '../domain/parisTime';
import { Category } from '../domain/rules';
import { c, medium, sans, serif } from '../theme/tokens';
import { Journey } from '../useJourney';
const subtypes: Record<Category, string[]> = {
  Nuit: ['Bal', 'Karaoké', 'Club', 'Guinguette'],
  Table: ['Bistrot', 'Terrasse', 'Cuisine française'],
  Sport: ['Padel', 'Footing', 'Piscine'],
  Culture: ['Cinéma', 'Concert', 'Exposition', 'Théâtre']
};
export function Offrir({ journey }: {
  journey: Journey;
}) {
  const { error, category, setCategory, subtype, setSubtype, title, setTitle, address, setAddress, district, setDistrict, day, setDay, hour, setHour, seats, setSeats, price, setPrice, women, setWomen, publish } = journey;
  const { offerStep: stage, setOfferStep: setStage } = journey;
  const today = parisDay(journey.store.now);
  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const hoursFor = (date: string) => offerHours.filter(h => parisTime(date, h) > journey.store.now);
  const availableDays = days.filter(d => hoursFor(d).length);
  const hours = hoursFor(day);
  useEffect(() => {
    if(!availableDays.includes(day))
      setDay(availableDays[0]!);
    else if(!hours.includes(hour))
      setHour(hours[0]!);
  }, [day, hour, today, journey.store.now]);
  const dayLabels = availableDays.map(d => d === today ? 'Aujourd’hui' : d === addDays(today, 1) ? 'Demain' : new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'long', day: 'numeric' }).format(Date.parse(d + 'T12:00:00Z')));
  return <View style={s.screen}>
    <Text style={s.label}>DE L’AUTRE CÔTÉ DU BILLET</Text>
    <Text style={s.hero}>Faites place au grand soir.</Text>
    <Marquee text="HÔTE GRATUIT · INVITEZ LA VIE · " /><Copy>Offrir une place est gratuit. Sans abonnement hôte.</Copy>
    <View style={{ flexDirection: 'row', gap: 8 }}>{['Quoi', 'Où · quand', 'Pour qui'].map((label, i) => <View key={label} accessibilityLabel={label + (i === stage ? ', étape active' : i < stage ? ', terminée' : ', à venir')} style={{ flex: 1, opacity: i > stage ? 0.5 : 1, borderBottomWidth: i === stage ? 2 : 0, borderColor: c.light, paddingBottom: 8 }}><Text numberOfLines={1} style={{ fontFamily: medium, fontSize: 14, lineHeight: 22, textAlign: 'center', color: i === stage ? c.ink : c.light, backgroundColor: i === stage ? c.light : 'transparent', paddingVertical: 8 }}>{i < stage ? '✓ ' : ''}{label}</Text></View>)}</View>
    {stage === 0 && <>
      <Pills items={['Table', 'Sport', 'Culture', 'Nuit']} value={category} onChange={v => {
        setCategory(v as Category);
        setSubtype(subtypes[v as Category][0]!);
      }} />
      <Text style={s.label}>SOUS-TYPE</Text>
      <Pills items={subtypes[category]} value={subtype} onChange={setSubtype} />
      <Input label="Le nom de votre moment" value={title} set={setTitle} />
    </>}
    {stage === 1 && <>
      <Input label="Lieu · adresse à Paris intramuros" value={address} set={setAddress} />
      <View style={s.group}>
        <Text style={s.label}>ARRONDISSEMENT</Text>
        <Pills compact items={Array.from({ length: 20 }, (_, i) => String(i + 1))} value={district} onChange={setDistrict} />
      </View>
      <View style={s.group}>
        <Text style={s.label}>LE JOUR · HEURE DE PARIS</Text>
        <Pills items={dayLabels} value={dayLabels[availableDays.indexOf(day)] ?? ''} onChange={v => { journey.setManualTime(true); setDay(availableDays[dayLabels.indexOf(v)]!); }} />
      </View>
      <View style={s.group}>
        <Text style={s.label}>LE CRÉNEAU</Text>
        <Pills items={hours} value={hour} onChange={v => { journey.setManualTime(true); setHour(v); }} />
      </View>
    </>}
    {stage === 2 && <>
      <Text style={s.label}>PLACES LIBRES</Text>
      <Pills items={['1', '2', '3', '4']} value={seats} onChange={setSeats} />
      <Text style={s.label}>VOTRE INVITATION · PAR PLACE</Text>
      <Pills items={['0', '10', '20', '30', '40']} value={price} onChange={setPrice} />
      {price === '0' && <Copy>0 € · Juste la place</Copy>}
      <Input label="Montant en euros · 50 € maximum" value={price} set={setPrice} keyboardType="numeric" />
      <Copy small>Vous offrez ce montant à chaque invité pour le repas, l’activité ou l’entrée.</Copy>
      <View style={s.row}>
        <Copy>Femmes uniquement</Copy>
        <Switch accessibilityLabel="Femmes uniquement" value={women} onValueChange={setWomen} trackColor={{
          false: c.line,
          true: c.muted
        }} thumbColor={c.card} />
      </View>
      <Text style={s.label}>VOTRE BILLET · APERÇU EN DIRECT</Text>
      <Ticket m={{ id: 'apercu', host: 'Vous', hostId: 'me', category, subtype, title, address, district: Number(district), startsAt: parisTime(day, hour), seats: Number(seats), price: Number(price) * 100 || 0, womenOnly: women, description: '' }} />
    </>}
    {stage > 0 && <Text accessibilityRole="button" onPress={() => setStage(stage - 1)} style={s.body}>← Étape précédente</Text>}
    {error ? <Text accessibilityRole="alert" style={s.body}>
      {error}
    </Text> : null}
    <Action label={stage === 2 ? "Offrir cette place" : "Continuer"} disabled={stage === 0 && !title.trim() || stage === 1 && !address.trim()} onPress={() => stage < 2 ? setStage(stage + 1) : publish()} />
    <Copy small>Publication locale de démonstration. Aucun paiement.</Copy>
  </View>;
}
const s = StyleSheet.create({
  group: { gap: 12, marginVertical: 4 },
  screen: {
    gap: 26
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
    fontSize: 52,
    lineHeight: 62,
    letterSpacing: -1.8,
    color: c.light
  },
  body: {
    fontFamily: sans,
    fontSize: 16,
    lineHeight: 25,
    color: c.light
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap'
  }
});
