import { InfoRow } from '../components/InfoRow';
import { Pressable, View } from 'react-native';
import { hostLabel } from '../components/hostLabel';
import { Button, Countdown, Motion, StatusPill, T, s } from '../components/UI';
import { addressFor, canChat, canMarkPresence } from '../domain/selectors';
import type { Request } from '../domain/types';
import { colors as c } from '../theme/tokens';
const time = (n: number) => new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit'
}).format(n);
import type { JourneyContext } from '../useJourney';
export function RequestCard({ ctx, r }: {
  ctx: JourneyContext;
  r: Request;
}) {
  const { state, user, now, act, setSheet, setSelected, select } = ctx;
  const x = state.moments.find(m => m.id === r.momentId)!;
  const done = x.status === 'closed';
  const labels = {
    requested: 'En attente',
    accepted: 'Acceptée',
    confirmed: done ? 'Terminée' : 'Confirmée',
    expired: 'Expirée',
    cancelled: 'Annulée',
    declined: 'Refusée'
  };
  return <View
    key={r.id}
    style={[s.card, r.status === 'accepted' && {
      borderColor: c.accent, backgroundColor: "#FAFAF7", padding: 24
    }]}>
    <StatusPill
      title={labels[r.status]}
      tone={r.status === 'accepted' ? 'warning' : r.status === 'confirmed' ? 'success' : 'neutral'} />
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={"Voir " + x.title}
      style={{ minHeight: 44, justifyContent: "center" }}
      onPress={() => select(x.id)}>
      <T style={s.title}>
        {x.title}
      </T>
    </Pressable>
    <T style={s.muted}>
      {x.neighborhood}{" · "}{time(x.startsAt)}
    </T>
    {r.status === 'requested' && <T style={s.muted}>{"Demande envoyée · en attente de "}{hostLabel(x.hostId, state.users.find(u => u.id === x.hostId)?.name)}
    </T>}
    {r.status === 'accepted' && <>
      <T>{"Votre place vous attend. Confirmez dans"}</T>
      <Countdown until={r.acceptedAt! + 600000} now={now} />
      <View
        accessibilityRole="progressbar"
        accessibilityValue={{
          min: 0,
          max: 100,
          now: Math.max(0, Math.round((r.acceptedAt! + 600000 - now) / 6000))
        }}
        style={{
          height: 5, borderRadius: 3, backgroundColor: c.border
        }}>
        <View
          style={{
            height: 5,
            borderRadius: 3,
            backgroundColor: c.accent,
            width: `${Math.max(0, Math.min(100, (r.acceptedAt! + 600000 - now) / 6000))}%`
          }} />
      </View>
      <Button
        title="Confirmer et bloquer 20 €"
        onPress={() => act({ type: 'confirm', requestId: r.id })} />
    </>}
    {r.status === 'confirmed' && !done && <>
      <Motion>
        <View
          style={{
            gap: 8,
            padding: 16,
            backgroundColor: c.surface,
            borderRadius: 12
          }}>
          <T style={{ fontSize: 13, color: c.success }}>{"Adresse révélée"}</T>
          <T style={s.h}>
            {addressFor(x, user, state.requests)}
          </T>
        </View>
      </Motion>
      <StatusPill
        title={r.deposit === 'released' ? 'Caution rendue · 20 €' : 'Caution bloquée · 20 €'}
        tone="success" />
      <InfoRow
        icon={canChat(x, user, state.requests, now) ? 'check' : 'lock'}
        title="Conversation"
        detail={canChat(x, user, state.requests, now) ? 'Entre participants confirmés' : `Ouvre à ${time(x.startsAt - 3600000)}`}
      />
      {canChat(x, user, state.requests, now) && <Button
        variant="secondary"
        title="Ouvrir le chat"
        onPress={() => {
          setSelected(x.id);
          setSheet('chat');
        }} />}
      <Button
        title={r.presentAt ? 'Présence confirmée' : canMarkPresence(x, now) ? 'Je suis là' : now > x.startsAt + 900000 ? 'Fenêtre de présence fermée' : `Disponible à ${time(x.startsAt - 900000)}`}
        disabled={!!r.presentAt || !canMarkPresence(x, now)}
        onPress={() => act({ type: 'markPresence', momentId: x.id })} />
      {!r.presentAt && <Button
        variant="text"
        title="Un imprévu ? Annuler ou utiliser mon joker"
        onPress={() => {
          setSelected(x.id);
          setSheet('unexpected');
        }} />}
    </>}
    {done && r.presentAt !== undefined && <Button
      title="Noter ce moment"
      variant="secondary"
      onPress={() => {
        setSelected(x.id);
        setSheet('rating');
      }} />}
    {['cancelled', 'expired', 'declined'].includes(r.status) && <T style={s.muted}>
      {r.deposit === 'forfeited' ? 'Caution perdue : 6,90 € Moment · 13,10 € hôte.' : r.deposit === 'released' ? 'Votre caution a été rendue.' : 'Aucune caution prélevée.'}
    </T>}
  </View>;
}
