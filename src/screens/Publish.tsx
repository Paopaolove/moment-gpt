import { useEffect, useState } from 'react';
import { ScrollView, Switch, View } from 'react-native';
import { Button, Chip, Field, MomentCard, T, s } from '../components/UI';
import { addDays, parisDay, parisTime } from '../domain/parisTime';
import type { Category, Moment } from '../domain/types';
import { useStore } from '../store';
import { colors as c } from '../theme/tokens';
const categories: Category[] = ['Table', 'Verre', 'Sport', 'Culture'];
const time = (n: number) => new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit'
}).format(n);
export function Publish({ onPublished, partner = false, venue }: {
  onPublished: () => void;
  partner?: boolean;
  venue?: {
    name: string;
    address: string;
    district: string;
  };
}) {
  const { state, user, now, dispatch } = useStore();
  const draft = state.draft;
  const Content = partner ? View : ScrollView;
  const [category, setCategory] = useState<Category>(draft?.category ?? 'Table');
  const [title, setTitle] = useState(draft?.title ?? '');
  const [address, setAddress] = useState(venue?.address ?? draft?.privateAddress ?? '');
  const [district, setDistrict] = useState(venue?.district ?? String(draft?.district ?? 11));
  const [neighborhood, setNeighborhood] = useState(draft?.neighborhood ?? '');
  const [day, setDay] = useState(parisDay(draft?.startsAt ?? now));
  const [hour, setHour] = useState(draft ? time(draft.startsAt) : '');
  const [seats, setSeats] = useState<1 | 2 | 3>(draft?.seats ?? 2);
  const [amount, setAmount] = useState('20');
  const [women, setWomen] = useState(false);
  const [error, setError] = useState('');
  const days = Array.from({ length: 7 }, (_, i) => addDays(parisDay(now), i));
  const slots = Array.from({ length: 48 }, (_, i) => String(Math.floor(i / 2)).padStart(2, '0') + ':' + (i % 2 ? '30' : '00')).filter(h => parisTime(day, h) > now);
  useEffect(() => {
    if(!slots.includes(hour))
      setHour(slots[0] ?? '');
  }, [day, now]);
  const overLimit = Number(amount.replace(',', '.')) > 50;
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(day) && /^([01]\d|2[0-3]):[0-5]\d$/.test(hour) && Number.isFinite(Date.parse(`${day}T${hour}:00Z`));
  const startsAt = validDate ? parisTime(day, hour) : now + 3600000;
  const p = state.partners.find(p => p.owner === user?.id && p.status === 'valide');
  const preview: Moment = {
    id: `published-${now}`,
    title: title.trim() || 'Votre prochain moment',
    category,
    neighborhood: neighborhood.trim() || 'Votre quartier',
    district: Number(district),
    privateAddress: address.trim(),
    startsAt,
    endsAt: startsAt + 5400000,
    seats,
    invitationCents: partner ? 0 : Math.round(Number(amount.replace(',', '.')) * 100),
    femmesUniquement: women,
    hostId: user?.id ?? '',
    urgent: false,
    status: 'active',
    ...(partner ? { partnerId: p?.id } : {})
  };
  function publish() {
    if(!validDate || !title.trim() || !neighborhood.trim() || !address.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(day) || !/^([01]\d|2[0-3]):[0-5]\d$/.test(hour)) {
      setError('Renseignez le titre, le quartier, l’adresse, le jour et l’heure.');
      return;
    }
    const action = {
      type: 'publish' as const, moment: preview, now, actor: user!.id
    }; // reducer remains the authority for publication
    import('../domain/reducer').then(({ reducer }) => {
      if(reducer(state, action) === state) {
        setError('Vérifiez : Paris intramuros, arrondissement 1–20, date future, montant de 0 à 50 € et une seule annonce active.');
        return;
      }
      dispatch(action);
      onPublished();
    });
  }
  return <View style={partner ? { gap: 16 } : { flex: 1 }}>
    <Content
      style={partner ? { gap: 16 } : undefined}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ gap: 16, paddingBottom: 24 }}>
      <View style={s.card}>
        <T style={s.h}>{"Le moment"}</T>
        <View style={{
          flexDirection: 'row', flexWrap: 'wrap', gap: 8
        }}>
          {categories.map(v => <Chip key={v} title={v} selected={category === v} onPress={() => setCategory(v)} />)}
        </View>
        <Field
          label="Titre du moment"
          placeholder="Une table à partager"
          value={title}
          onChangeText={setTitle} />
      </View>
      <View style={s.card}>
        <T style={s.h}>{"Le lieu"}</T>
        <Field
          label="Lieu et adresse à Paris"
          placeholder="18 rue Paul Bert, 75011 Paris"
          value={address}
          onChangeText={setAddress} />
        <Field
          label="Quartier"
          placeholder="Sainte-Marguerite"
          value={neighborhood}
          onChangeText={setNeighborhood} />
        <T style={s.h}>{"Arrondissement"}</T>
        <View style={{
          flexDirection: "row", flexWrap: "wrap", gap: 6
        }}>
          {Array.from({ length: 20 }, (_, i) => <View key={i} style={{ width: "18%" }}>
            <Chip
              title={String(i + 1)}
              selected={Number(district) === i + 1}
              onPress={() => setDistrict(String(i + 1))} />
          </View>)}
        </View>
        <T style={[s.muted, { fontSize: 13 }]}>{"Seul le quartier est public. L’adresse apparaît après le oui."}</T>
      </View>
      <View style={s.card}>
        <T style={s.h}>{"Quand et combien"}</T>
        <T style={s.h}>{"Jour"}</T>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {days.map((d, i) => <Chip
            key={d}
            title={i === 0 ? 'Aujourd’hui' : i === 1 ? 'Demain' : new Intl.DateTimeFormat('fr-FR', {
              weekday: 'short',
              day: 'numeric',
              timeZone: 'Europe/Paris'
            }).format(parisTime(d, '12:00'))}
            selected={day === d}
            onPress={() => setDay(d)} />)}
        </ScrollView>
        <T style={s.h}>{"Heure de Paris"}</T>
        <ScrollView horizontal contentContainerStyle={{ gap: 8 }}>
          {slots.map(h => <Chip key={h} title={h} selected={hour === h} onPress={() => setHour(h)} />)}
        </ScrollView>
        {slots.length === 0 && <T style={s.muted}>{"Choisissez demain pour les prochains créneaux."}</T>}
        <T>{"Places disponibles"}</T>
        <View style={s.row}>
          {([1, 2, 3] as const).map(n => <Chip key={n} title={String(n)} selected={seats === n} onPress={() => setSeats(n)} />)}
        </View>
        {!partner && <>
          <T style={s.h}>{"Montant par personne · maximum 50 €"}</T>
          <View
            style={{
              flexDirection: 'row',
              gap: 8,
              flexWrap: 'wrap',
              alignItems: 'flex-end'
            }}>
            {[10, 20, 30, 40].map(n => <Chip
              key={n}
              title={`${n} €`}
              selected={Number(amount) === n}
              onPress={() => setAmount(String(n))} />)}
            <View style={{ minWidth: 96, flex: 1 }}>
              <Field label="Libre (€)" keyboardType="decimal-pad" value={amount} onChangeText={setAmount} />
            </View>
          </View>
          <View>
            {overLimit && <T accessibilityRole="alert" style={{ color: c.error }}>{"Le montant ne peut pas dépasser 50 €."}</T>}
          </View>
          <View style={s.between}>
            <T>{"Femmes uniquement"}</T>
            <Switch
              accessibilityLabel="Femmes uniquement"
              value={women}
              onValueChange={setWomen}
              trackColor={{ true: c.accent }} />
          </View>
        </>}
      </View>
      <T style={s.h}>{"L’aperçu"}</T>
      <MomentCard
        moment={preview}
        now={now}
        offer={partner ? p?.gesture : undefined} />
      {error && <T accessibilityRole="alert" style={{ color: c.error }}>
        {error}
      </T>}
    </Content>
    <View
      style={{
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: c.border,
        gap: 6
      }}>
      <Button title="Publier" disabled={overLimit} onPress={publish} />
      <T style={[s.muted, { fontSize: 13, textAlign: 'center' }]}>{"Gratuit pour les hôtes. Aucun paiement réel."}</T>
    </View>
  </View>;
}
