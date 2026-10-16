import { View } from 'react-native';
import { InfoRow } from '../components/InfoRow';
import { NeighborhoodMap } from '../components/NeighborhoodMap';
import { Avatar, Banner, StatusPill, T, s } from '../components/UI';
import { hostLabel } from '../components/hostLabel';
import { addressFor, reliable } from '../domain/selectors';
import { colors as c } from '../theme/tokens';
const time = (n: number) => new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit'
}).format(n);
import type { JourneyContext } from '../useJourney';
export function MomentDetail({ ctx }: {
  ctx: JourneyContext;
}) {
  const { state, user, m, request, host } = ctx;
  if(!m)
    return null;
  return <>
    <StatusPill title={m.category} />
    <NeighborhoodMap moment={m} />
    <T style={s.large}>
      {m.title}
    </T>
    <T style={s.muted}>
      {m.neighborhood}{" · Paris "}{m.district}{"e"}</T>
    <InfoRow icon="clock" title={time(m.startsAt)} detail="Horaire de Paris" />
    <InfoRow icon="pin" title={m.neighborhood} detail={"Paris " + m.district + "e · adresse privée"} />
    <InfoRow icon="seats" title={m.seats + ' places disponibles'} />
    <InfoRow
      icon="plus"
      title={m.partnerId ? 'Offre partenaire' : m.invitationCents / 100 + ' € par personne'} />
    <View style={s.row}>
      <Avatar name={hostLabel(m.hostId, host?.name)} />
      <View>
        <T style={s.h}>
          {hostLabel(m.hostId, host?.name)}
        </T>
        <T style={{ fontSize: 13, color: c.secondary }}>
          {host?.honoredMoments ?? 0}{" moments honorés"}</T>
      </View>
      {host && reliable(host) && <StatusPill title="Fiable" tone="success" />}
    </View>
    {m.partnerId ? <Banner>
      {state.partners.find(p => p.id === m.partnerId)?.gesture}
      · remise
      {state.partners.find(p => p.id === m.partnerId)?.discountPercent}
      %. Confirmation automatique et caution de 20 € bloquée en simulation.
    </Banner> : <T style={s.title}>
      {m.invitationCents / 100}{" € "}<T style={s.muted}>{"pour ce moment"}</T>
    </T>}
    {m.femmesUniquement && <StatusPill title="Femmes uniquement" />}
    {addressFor(m, user, state.requests) && <Banner>
      {addressFor(m, user, state.requests)}
    </Banner>}
    <View style={s.card}>
      <T style={s.h}>{"Comment ça marche"}</T>
      <InfoRow icon="arrow" title="1. Demander" detail="Choisissez votre moment." />
      <InfoRow icon="check" title="2. L’hôte dit oui" detail="Sa réponse apparaît dans Mes moments." />
      <InfoRow icon="clock" title="3. 10 min pour confirmer" detail="Caution de 20 € rendue si présent." />
    </View>
    {request?.status === 'requested' && <Banner>
      Demande envoyée · en attente de
      {hostLabel(m.hostId, host?.name)}
    </Banner>}
    {m.femmesUniquement && user && !user.woman && <Banner>
      Ce moment est réservé aux femmes. Vous pouvez préciser votre identité dans votre compte de démo.
    </Banner>}
  </>;
}
