import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { c, serif } from '../theme/tokens';
import { Copy, Action, Pills, Input } from '../components/Primitives';
import { Category, euros } from '../domain/rules';
import { Journey } from '../useJourney';
const subtypes: Record<Category, string[]> = {
  Table: ['Bistrot', 'Terrasse', 'Cuisine française'],
  Sport: ['Padel', 'Footing', 'Piscine'],
  Culture: ['Cinéma', 'Concert', 'Exposition', 'Théâtre']
};
export function Offrir({
  journey
}: {
  journey: Journey;
}) {
  const {
    error,
    category,
    setCategory,
    subtype,
    setSubtype,
    title,
    setTitle,
    address,
    setAddress,
    district,
    setDistrict,
    day,
    setDay,
    hour,
    setHour,
    seats,
    setSeats,
    price,
    setPrice,
    women,
    setWomen,
    publish
  } = journey;
  return <View style={s.screen}>
    <Text style={s.label}>DE L’AUTRE CÔTÉ DU BILLET</Text>
    <Text style={s.hero}>À côté de vous, une place.</Text>
    <Copy>Offrir une place est gratuit. Sans abonnement hôte.</Copy>
    <Pills items={['Table', 'Sport', 'Culture']} value={category} onChange={v => {
      setCategory(v as Category);
      setSubtype(subtypes[v as Category][0]!);
    }} />
    <Text style={s.label}>SOUS-TYPE</Text>
    <Pills items={subtypes[category]} value={subtype} onChange={setSubtype} />
    <Input label="Le nom de votre moment" value={title} set={setTitle} />
    <Input label="Lieu · adresse à Paris intramuros" value={address} set={setAddress} />
    <Input label="Arrondissement · 1 à 20" value={district} set={setDistrict} keyboardType="numeric" />
    <Input label="Date · AAAA-MM-JJ · heure de Paris" value={day} set={setDay} />
    <Input label="Heure · HH:MM" value={hour} set={setHour} />
    <Text style={s.label}>PLACES LIBRES</Text>
    <Pills items={['1', '2', '3']} value={seats} onChange={setSeats} />
    <Text style={s.label}>VOTRE INVITATION · PAR PLACE</Text>
    <Pills items={['10', '20', '30', '40']} value={price} onChange={setPrice} />
    <Input label="Montant en euros · 50 € maximum" value={price} set={setPrice} keyboardType="numeric" />
    <Copy small>Vous offrez ce montant à chaque invité pour le repas, l’activité ou l’entrée.</Copy>
    <View style={s.row}>
      <Copy>Femmes uniquement</Copy>
      <Switch accessibilityLabel="Femmes uniquement" value={women} onValueChange={setWomen} trackColor={{
        false: c.line,
        true: c.muted
      }} thumbColor={c.card} />
    </View>
    {error ? <Text accessibilityRole="alert" style={s.body}>
      {error}
    </Text> : null}
    <Action label="Offrir cette place" onPress={publish} />
    <Copy small>Publication locale de démonstration. Aucun paiement.</Copy>
  </View>;
}
const s = StyleSheet.create({
  screen: {
    gap: 22
  },
  label: {
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
  },
  body: {
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
