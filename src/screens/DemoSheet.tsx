import { View } from 'react-native';
import { Banner, Button, T, s } from '../components/UI';
import { parisDay } from '../domain/parisTime';
import { demoUser } from '../domain/seed';
const time = (n: number) => new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit'
}).format(n);
import type { JourneyContext } from '../useJourney';
export function DemoSheet({ ctx }: {
  ctx: JourneyContext;
}) {
  const {
    state,
    user,
    now,
    setNow,
    act,
    storeDispatch,
    setTab,
    setSheet,
    setLoading,
    setError,
    ownRequests,
    acceptDemo,
    closeDemo
  } = ctx;
  if(false)
    return null;
  return <>
    <Banner>
      Horloge unique de la démo ·
      {parisDay(now)}
      à
      {time(now)}
      . Les délais suivent cette horloge.
    </Banner>
    <Button title="+10 min" onPress={() => setNow(t => t + 600000)} />
    <Button title="Faire accepter par l’hôte" onPress={acceptDemo} />
    {(() => {
      const r = ownRequests.find(r => ['confirmed', 'accepted', 'requested'].includes(r.status));
      const target = state.moments.find(m => m.id === r?.momentId) ?? state.moments[0];
      return target && <>
        <Button
          title="Aller à H−15"
          variant="secondary"
          onPress={() => setNow(t => Math.max(t, target.startsAt - 900000))} />
        <Button
          title="Aller à H+30"
          variant="secondary"
          onPress={() => setNow(t => Math.max(t, target.startsAt + 1800000))} />
        <Button
          title="Terminer le moment (après sa fin)"
          variant="secondary"
          onPress={() => closeDemo(Math.max(now, target.endsAt + 60000))} />
      </>;
    })()}
    <Button
      title="Simuler une erreur du fil"
      variant="text"
      onPress={() => {
        setError(true);
        setTab('Découvrir');
        setSheet('');
      }} />
    <Button
      title="Recharger le fil (skeleton)"
      variant="text"
      onPress={() => {
        setLoading(true);
        setTab('Découvrir');
        setSheet('');
        setTimeout(() => setLoading(false), 650);
      }} />
    {user && <Button
      title={user.woman ? 'Identité de démo : homme' : 'Identité de démo : femme'}
      variant="text"
      onPress={() => {
        storeDispatch({
          type: 'signIn',
          actor: 'demo-woman',
          now,
          user: { ...demoUser('demo-woman', 'Camille'), woman: true }
        });
      }} />}
    {state.unexpected.filter(u => u.status === 'pending').map(u => <View key={u.id} style={s.card}>
      <T>
        {u.phrase}
      </T>
      <Button
        title="L’autre accepte l’imprévu"
        onPress={() => act({
          type: 'resolveUnexpected',
          id: u.id,
          accept: true,
          actor: u.recipient
        })} />
      <Button
        title="L’autre refuse"
        variant="secondary"
        onPress={() => act({
          type: 'resolveUnexpected',
          id: u.id,
          accept: false,
          actor: u.recipient
        })} />
    </View>)}
  </>;
}
