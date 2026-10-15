import { StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import { Button, Field, Header, Notice, Page, Pill } from '../components';
import {
  RULES,
  dateLabel,
  euros,
  validateMoment,
  type Category,
  type Moment,
} from '../domain/rules';
import { useFlow } from '../navigation/context';
import { useStore } from '../store';
import { styles as s } from '../theme';
export function Publier() {
  const { now, publish } = useStore();
  const { go } = useFlow();
  const [title, setTitle] = useState('Un dîner qui prend son temps');
  const [description, setDescription] = useState(
    'Une cuisine de saison, quelques assiettes à partager et le plaisir de découvrir de nouveaux horizons. On se retrouve devant le bistrot.',
  );
  const [address, setAddress] = useState('18 rue Paul Bert, 75011 Paris');
  const [district, setDistrict] = useState('11');
  const [category, setCategory] = useState<Category>('Resto');
  const [seats, setSeats] = useState(2);
  const [price, setPrice] = useState('20');
  const [delay, setDelay] = useState(60);
  const [womenOnly, setWomenOnly] = useState(false);
  const [error, setError] = useState('');
  function submit() {
    const cents = Number(price.replace(',', '.')) * 100;
    const m: Moment = {
      id: `own-${now}`,
      hostId: 'me',
      host: 'Vous',
      own: true,
      title: title.trim(),
      description:
        description.trim() || 'Une table ouverte et le plaisir de faire connaissance.',
      address: address.trim(),
      district: Number(district),
      category,
      seats,
      price: Math.round(cents),
      startsAt: now + delay * 60000,
      womenOnly,
    };
    const invalid =
      !price.trim() ||
      !Number.isFinite(cents) ||
      Math.abs(cents - Math.round(cents)) > 0.00001
        ? 'Indiquez un prix avec deux décimales maximum.'
        : validateMoment(m, now);
    if (invalid) {
      setError(invalid);
      return;
    }
    publish(m);
    go('Detail', m.id);
  }
  return (
    <Page>
      <Header
        eyebrow="Ouvrir sa table"
        title={'Les bonnes soirées\ncommencent par vous.'}
        subtitle="Vous choisissez le lieu. Vous faites une place. Être hôte est gratuit, sans abonnement."
      />
      <View style={s.row}>
        <Text style={s.eyebrow}>01 / L’envie</Text>
        <Text style={s.muted}>Resto ou Bar</Text>
      </View>
      <View style={s.wrap}>
        {RULES.categories.map((c) => (
          <Pill
            key={c}
            title={c}
            selected={category === c}
            onPress={() => setCategory(c)}
          />
        ))}
      </View>
      <Field
        label="Le titre de votre moment"
        value={title}
        onChangeText={setTitle}
        placeholder="Un dîner qui prend son temps"
        maxLength={80}
      />
      <Field
        label="Quelques mots pour donner envie"
        value={description}
        onChangeText={setDescription}
        placeholder="L’ambiance, les assiettes, votre envie…"
        multiline
        maxLength={500}
      />
      <Text style={s.eyebrow}>02 / Le point de rendez-vous</Text>
      <Field
        label="Adresse à Paris intramuros"
        value={address}
        onChangeText={setAddress}
        placeholder="18 rue Paul Bert, 75011 Paris"
      />
      <Field
        label="Arrondissement · du 1er au 20e"
        value={district}
        onChangeText={setDistrict}
        keyboardType="number-pad"
        maxLength={2}
      />
      <Notice>
        Adresse déclarative : vérifiez que le lieu est bien à Paris intramuros.
      </Notice>
      <View style={s.wrap}>
        {[30, 60, 180, 1440].map((v) => (
          <Pill
            key={v}
            title={v === 1440 ? 'Dans 24 h' : `Dans ${v} min`}
            selected={delay === v}
            onPress={() => setDelay(v)}
          />
        ))}
      </View>
      <Text
        style={s.muted}
      >{`${dateLabel(now + delay * 60000)} · heure de Paris`}</Text>
      <Text style={s.eyebrow}>03 / Votre tablée</Text>
      <View style={s.wrap}>
        {Array.from(
          {
            length: RULES.maxSeats,
          },
          (_, i) => i + RULES.minSeats,
        ).map((v) => (
          <Pill
            key={v}
            title={`${v} place${v > 1 ? 's' : ''}`}
            selected={seats === v}
            onPress={() => setSeats(v)}
          />
        ))}
      </View>
      <Pill
        title={`${womenOnly ? '✓ ' : ''}Femmes uniquement`}
        selected={womenOnly}
        onPress={() => setWomenOnly(!womenOnly)}
      />
      <Text style={s.eyebrow}>04 / Invitation par personne</Text>
      <View style={s.wrap}>
        {RULES.pricePills.map((v) => (
          <Pill
            key={v}
            title={euros(v)}
            selected={Number(price) === v / 100}
            onPress={() => setPrice(String(v / 100))}
          />
        ))}
      </View>
      <Field
        label={`Autre montant · maximum ${euros(RULES.maxInvitation)}`}
        value={price}
        onChangeText={setPrice}
        keyboardType="decimal-pad"
      />
      <Notice>{`La caution de ${euros(RULES.deposit)} s’ajoute au principe de l’invitation. Tout est simulé dans ce prototype.`}</Notice>
      {!!error && <Notice>{error}</Notice>}
      <View style={local.footnote}>
        <Text style={local.detailTitle}>Votre invitation en un regard</Text>
        <Text
          style={local.body}
        >{`${category} · Paris ${district || '…'}e · ${seats} place${seats > 1 ? 's' : ''} · ${price || '0'} € par personne`}</Text>
        <Text
          style={local.body}
        >{`${womenOnly ? 'Table réservée aux femmes' : 'Table ouverte à tous'} · L’hôte ne paie pas d’abonnement.`}</Text>
      </View>
      <View style={local.editorial}>
        <Text
          accessibilityRole="header"
          style={local.sectionTitle}
        >
          Une invitation qui vous ressemble.
        </Text>
        <Text style={local.intro}>Le bon détail donne envie de pousser la porte.</Text>
        <View style={local.detailRow}>
          <Text style={local.number}>01</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>L’ambiance avant tout</Text>
            <Text style={local.body}>
              Une terrasse tranquille, un comptoir animé, des assiettes à partager :
              racontez ce que vous aimez dans ce lieu.
            </Text>
          </View>
        </View>
        <View style={local.detailRow}>
          <Text style={local.number}>02</Text>
          <View style={local.detailCopy}>
            <Text style={local.detailTitle}>Une adresse précise</Text>
            <Text style={local.body}>
              Indiquez le numéro, la rue et le code postal. Après confirmation, donnez
              un repère simple pour vous retrouver.
            </Text>
          </View>
        </View>
        <View style={local.footnote}>
          <Text style={local.detailTitle}>À l’improviste, mais avec soin.</Text>
          <Text style={local.body}>
            Votre table rejoint les invitations urgentes de H−90 à H+30. Au-delà, elle
            quitte les découvertes. Paris intramuros uniquement.
          </Text>
        </View>
      </View>
      <Button
        primary
        title="Publier mon invitation  ↗"
        onPress={submit}
      />
    </Page>
  );
}
const local = StyleSheet.create({
  editorial: {
    paddingTop: 32,
    gap: 24,
    borderTopWidth: 1,
    borderTopColor: '#DCD1C1',
  },
  sectionTitle: {
    fontSize: 29,
    lineHeight: 36,
    letterSpacing: -0.8,
    color: '#292F29',
    fontWeight: '500',
  },
  intro: {
    fontSize: 17,
    lineHeight: 27,
    color: '#696B60',
    maxWidth: 440,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 18,
    paddingVertical: 12,
  },
  number: {
    color: '#A44832',
    fontSize: 12,
    letterSpacing: 1,
    paddingTop: 4,
  },
  detailCopy: {
    flex: 1,
    gap: 10,
  },
  detailTitle: {
    color: '#292F29',
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '600',
  },
  body: {
    color: '#696B60',
    fontSize: 15,
    lineHeight: 25,
  },
  footnote: {
    backgroundColor: '#EEE6D9',
    borderRadius: 22,
    padding: 24,
    gap: 12,
  },
});
