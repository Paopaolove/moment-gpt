import { useState } from 'react';
import { View } from 'react-native';
import { Banner, Button, Field, StatusPill, T, s } from '../components/UI';
import { useStore } from '../store';
import { Publish } from './Publish';
export function PartnerFlow({ onDone }: {
  onDone: () => void;
}) {
  const { state, user, act } = useStore();
  const p = state.partners.find(p => p.owner === user?.id);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('6');
  const [gesture, setGesture] = useState('');
  const [discount, setDiscount] = useState('15');
  const valid = !!name.trim() && /Paris/i.test(address) && Number(district) >= 1 && Number(district) <= 20 && (!!gesture.trim() || Number(discount) > 0) && Number(discount) >= 0 && Number(discount) <= 100;
  return <View style={s.stack}>
    {!p ? <>
      <T style={s.title}>{"Faites vivre votre lieu."}</T>
      <T style={s.muted}>{"Un geste, une remise et une nouvelle occasion de se retrouver."}</T>
      <Field label="Nom du lieu" value={name} onChangeText={setName} />
      <Field label="Adresse à Paris" value={address} onChangeText={setAddress} />
      <Field
        label="Arrondissement"
        value={district}
        onChangeText={setDistrict}
        keyboardType="number-pad" />
      <Field
        label="Geste offert (facultatif si remise)"
        value={gesture}
        onChangeText={setGesture}
        placeholder="Un café offert" />
      <Field
        label="Remise en % (0–100)"
        value={discount}
        onChangeText={setDiscount}
        keyboardType="decimal-pad" />
      <Button
        title="Envoyer la demande"
        disabled={!valid}
        onPress={() => act({
          type: 'partnerApply', partner: {
            id: `partner-${user!.id}`,
            owner: user!.id,
            status: 'en_revue',
            gesture: gesture.trim(),
            discountPercent: Number(discount)
          }
        })} />
    </> : p.status === 'en_revue' ? <>
      <StatusPill title="En revue" tone="warning" />
      <T style={s.title}>
        {name || 'Votre lieu'}
      </T>
      <T style={s.muted}>{"Notre équipe examine votre demande. La validation est manuelle."}</T>
      <Button
        title="Simuler la validation"
        onPress={() => act({ type: 'partnerValidate', partnerId: p.id })} />
    </> : <>
      <StatusPill title="Partenaire validé" tone="success" />
      <Banner>
        {p.gesture || 'Votre offre'}
        ·
        {p.discountPercent}
        % de remise. Geste et remise sont cumulables, sans plafond en euros. Les demandes sont confirmées automatiquement ; la caution de 20 € est bloquée en simulation.
      </Banner>
      <Publish
        partner
        venue={{
          name, address, district
        }}
        onPublished={onDone} />
    </>}
  </View>;
}
