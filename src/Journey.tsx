import { ScrollView, View } from 'react-native';
import { Brand } from './components/Brand';
import { Banner, Button, Field, Motion, RatingPicker, Sheet, StatusPill, T, TabBar, s } from './components/UI';
import { monthKey } from './domain/rules';
import { canChat } from './domain/selectors';
import { colors as c } from './theme/tokens';
import { PhotoForm } from './components/PhotoForm';
import { AuthSheet } from './screens/AuthSheet';
import { DemoSheet } from './screens/DemoSheet';
import { Discover } from './screens/Discover';
import { MomentDetail } from './screens/MomentDetail';
import { MyMoments } from './screens/MyMoments';
import { Onboarding } from './screens/Onboarding';
import { PartnerFlow } from './screens/Partner';
import { Profile } from './screens/Profile';
import { Publish } from './screens/Publish';
import { useJourney } from './useJourney';
export function Journey() {
  const ctx = useJourney();
  const {
    state,
    user,
    now,
    act,
    onboarding,
    tab,
    setTab,
    sheet,
    setSheet,
    notice,
    setNotice,
    phrase,
    setPhrase,
    message,
    setMessage,
    messages,
    setMessages,
    momentLevel,
    setMomentLevel,
    venueLevel,
    setVenueLevel,
    m,
    request,
    host,
    activeHost,
    requestPlace
  } = ctx;
  const Content = tab === 'Publier' ? View : ScrollView;
  if(!onboarding.completed)
    return <Onboarding ctx={ctx} />;
  return <View style={{
    flex: 1, width: '100%', maxWidth: 760, alignSelf: 'center'
  }}>
    <Content
      style={tab === 'Publier' ? {
        flex: 1, padding: 20, gap: 16
      } : undefined}
      contentContainerStyle={{
        padding: 20, gap: 24, paddingBottom: 36
      }}
      keyboardShouldPersistTaps="handled">
      <View style={s.between}>
        <Brand />
      </View>
      {notice && <Banner>
        {notice}
      </Banner>}
      <Motion key={tab} style={tab === 'Publier' ? { flex: 1 } : undefined}>
        <View style={[s.stack, tab === 'Publier' && { flex: 1 }]}>
          <View style={{ gap: 4 }}>
            <T style={s.large}>
              {tab}
            </T>
            <T style={s.muted}>
              {tab === 'Découvrir' ? 'Paris · ce soir' : tab === 'Mes moments' ? 'Vos moments à partager.' : tab === 'Publier' ? 'Une place libre, une belle idée.' : 'Votre place chez Moment.'}
            </T>
          </View>
          {tab === 'Découvrir' && <Discover ctx={ctx} />}
          {tab === 'Mes moments' && <MyMoments ctx={ctx} />}
          {tab === 'Publier' && (!user ? <View style={s.card}>
            <T style={s.title}>{"Invitez à votre table."}</T>
            <T style={s.muted}>{"Publier est gratuit. Une à trois places, un moment à partager."}</T>
            <Button title="Créer un compte" onPress={() => setSheet('auth')} />
          </View> : user.role === 'partenaire' ? <Button title="Ouvrir mon espace partenaire" onPress={() => setSheet('partner')} /> : activeHost ? <View style={s.card}>
            <StatusPill title="Annonce active" tone="success" />
            <T style={s.title}>
              {activeHost.title}
            </T>
            <T style={s.muted}>{"Une seule annonce à la fois. Retrouvez vos invités et gérez les demandes."}</T>
            <Button title="Gérer mon moment" onPress={() => setTab('Mes moments')} />
          </View> : <Publish
            onPublished={() => {
              setTab('Mes moments');
              setNotice('Votre moment est publié. À bientôt, en vrai.');
            }} />)}
          {tab === 'Profil' && <Profile ctx={ctx} />}
        </View>
      </Motion>
    </Content>
    <TabBar tab={tab} onChange={v => {
      setTab(v);
      setNotice('');
    }} />
    <Sheet
      footer={sheet === 'detail' && m ? <View style={s.between}>
        <View>
          <T style={s.h}>
            {m.partnerId ? 'Offre partenaire' : m.invitationCents / 100 + ' €'}
          </T>
          <T style={{ fontSize: 12, color: c.secondary }}>{"Caution de 20 €"}</T>
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title={request ? 'Voir ma demande' : 'Demander une place'}
            disabled={!!user && m.femmesUniquement && !user.woman}
            onPress={request ? () => {
              setSheet('');
              setTab('Mes moments');
            } : requestPlace} />
        </View>
      </View> : undefined}
      title={sheet === 'auth' ? 'Créer un compte' : sheet === 'detail' ? 'Le moment' : sheet === 'demo' ? 'Mode démo' : sheet === 'unexpected' ? 'Un imprévu' : sheet === 'rating' ? 'Après le moment' : sheet === 'chat' ? 'Votre conversation' : sheet === 'partner' ? 'Espace partenaire' : 'Moment+'}
      visible={!!sheet}
      onClose={() => setSheet('')}>
      {sheet === 'auth' && <AuthSheet ctx={ctx} />}
      {sheet === 'detail' && <MomentDetail ctx={ctx} />}
      {sheet === 'demo' && <DemoSheet ctx={ctx} />}
      {sheet === 'unexpected' && m && request && <>
        <Banner>
          Une fois par moment, avec une phrase de 10 à 140 caractères. Si l’autre accepte : caution rendue. S’il refuse à moins de 3 h : caution perdue, sauf joker. L’hôte ne touche rien en cas d’imprévu accepté ou de joker.
        </Banner>
        <Field
          label="Expliquez votre imprévu"
          value={phrase}
          onChangeText={setPhrase}
          maxLength={140}
          multiline />
        <Button
          title="Envoyer mon imprévu"
          disabled={phrase.trim().length < 10 || state.unexpected.some(u => u.momentId === m.id)}
          onPress={() => {
            act({
              type: 'unexpected',
              requestId: request.id,
              id: `unexpected-${request.id}`,
              phrase
            });
            setNotice('Imprévu envoyé. En attente de la réponse de l’hôte.');
            setSheet('');
            setPhrase('');
          }} />
        <Button
          title="Utiliser mon joker du mois"
          variant="secondary"
          disabled={user?.jokerMonths.includes(monthKey(now))}
          onPress={() => {
            act({ type: 'joker', requestId: request.id });
            setSheet('');
          }} />
        <T style={[s.muted, { fontSize: 13 }]}>{"Un joker par mois civil (heure de Paris). Caution rendue même en cas de refus. L’hôte ne touche rien."}</T>
        <Button
          title={m.startsAt - now >= 10800000 ? 'Annuler · caution rendue' : 'Annuler · perdre la caution de 20 €'}
          variant="text"
          onPress={() => {
            act({
              type: 'cancel', requestId: request.id, as: 'guest'
            });
            setSheet('');
          }} />
      </>}
      {sheet === 'chat' && m && <>
        {canChat(m, user, state.requests, now) ? <>
          <T style={s.muted}>{"Entre participants confirmés, à partir de H−1."}</T>
          {(messages[m.id] ?? []).map((text, i) => <Banner key={i}>
            {text}
          </Banner>)}
          <Field label="Votre message" value={message} onChangeText={setMessage} maxLength={1000} />
          <Button
            title="Envoyer"
            disabled={!message.trim()}
            onPress={() => {
              setMessages(v => ({ ...v, [m.id]: [...(v[m.id] ?? []), message.trim()] }));
              setMessage('');
            }} />
        </> : <Banner>
          Le chat est disponible à H−1 pour les participants confirmés.
        </Banner>}
      </>}
      {sheet === 'rating' && m && user && <>
        <RatingPicker label="Le moment" value={momentLevel} onChange={setMomentLevel} />
        <RatingPicker label="Le lieu" value={venueLevel} onChange={setVenueLevel} />
        <Button
          title={state.ratings.some(r => r.momentId === m.id && r.author === user.id) ? 'Merci, vos notes sont enregistrées' : 'Enregistrer mes notes'}
          disabled={state.ratings.some(r => r.momentId === m.id && r.author === user.id)}
          onPress={() => act({
            type: 'rate', rating: {
              id: `rating-${m.id}-${user.id}`,
              momentId: m.id,
              author: user.id,
              recipient: m.hostId,
              momentLevel,
              venueLevel
            }
          })} />
        <PhotoForm moment={m} />
        <Button
          title={`Refaire un moment avec ${host?.name.startsWith('host') ? 'votre hôte' : host?.name ?? 'votre hôte'}`}
          variant="secondary"
          onPress={() => {
            act({
              type: 'rebook',
              momentId: m.id,
              startsAt: now + 86400000,
              endsAt: now + 91800000
            });
            setSheet('');
            setTab('Publier');
          }} />
      </>}
      {sheet === 'partner' && <PartnerFlow
        onDone={() => {
          setSheet('');
          setTab('Mes moments');
        }} />}
      {sheet === 'subscription' && <>
        <T style={s.title}>{"Moment+"}</T>
        <T>{"Un abonnement invité en préparation."}</T>
        <Banner>
          Stub de démonstration, non activé. Aucun prix réel ni paiement. La caution de 20 € reste distincte et aucune fonction n’est conditionnée à cet abonnement.
        </Banner>
      </>}
    </Sheet>
  </View>;
}
