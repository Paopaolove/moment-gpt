import { useState } from 'react';
import { View } from 'react-native';
import { Photo } from '../components/Photo';
import { Button, Chip, Field, StatusPill, T, s } from '../components/UI';
import { photoVisible } from '../domain/selectors';
import type { Moment } from '../domain/types';
import { useStore } from '../store';
export function PhotoForm({ moment }: {
  moment: Moment;
}) {
  const { state, user, act } = useStore();
  const [uri, setUri] = useState('');
  const [kind, setKind] = useState<'lieu' | 'table'>('lieu');
  const photos = state.photos.filter(p => p.momentId === moment.id);
  return <View style={s.stack}>
    <T style={s.h}>{"Photos du moment"}</T>
    <T style={[s.muted, { fontSize: 13 }]}>{"Le lieu, ou une à deux personnes à table. Une photo de personnes reste masquée tant que chacune n’a pas donné son accord."}</T>
    <View style={s.row}>
      <Chip title="Lieu" selected={kind === 'lieu'} onPress={() => setKind('lieu')} />
      <Chip title="À table" selected={kind === 'table'} onPress={() => setKind('table')} />
    </View>
    <Field
      label="Lien de la photo (https://…)"
      value={uri}
      onChangeText={setUri}
      autoCapitalize="none" />
    <Button
      title="Ajouter la photo"
      variant="secondary"
      disabled={!/^https:\/\/.+/.test(uri)}
      onPress={() => {
        act({
          type: 'addPhoto', photo: {
            id: `photo-${photos.length}-${moment.id}`,
            momentId: moment.id,
            author: user!.id,
            type: kind,
            uri,
            people: kind === 'table' ? [user!.id, moment.hostId] : [],
            consent: []
          }
        });
        setUri('');
      }} />
    {photos.map(p => <View key={p.id} style={s.card}>
      <StatusPill title={photoVisible(p) ? 'Accords réunis · visible' : 'Masquée · accord manquant'} />
      <T style={s.muted}>
        {p.type === 'lieu' ? 'Photo du lieu' : 'Photo à table'}
      </T>
      {photoVisible(p) && <Photo uri={p.uri} />}
      {p.people.includes(user!.id) && <Button
        title={p.consent.includes(user!.id) ? 'Retirer mon accord' : 'Donner mon accord'}
        variant="text"
        onPress={() => act({
          type: 'consent',
          photoId: p.id,
          granted: !p.consent.includes(user!.id)
        })} />}
    </View>)}
  </View>;
}
