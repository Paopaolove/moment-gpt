import { Button, T, s } from '../components/UI';
import type { JourneyContext } from '../useJourney';
export function AuthSheet({ ctx }: {
  ctx: JourneyContext;
}) {
  const { auth } = ctx;
  if(false)
    return null;
  return <>
    <T style={s.muted}>{"Un prénom, un engagement. Le reste se passe en vrai."}</T>
    {['Continuer avec Apple', 'Continuer avec Google', 'E-mail'].map(t => <Button
      key={t}
      title={t}
      variant={t === 'Continuer avec Apple' ? 'primary' : 'secondary'}
      onPress={auth} />)}
    <T style={[s.muted, { fontSize: 13 }]}>{"Authentification simulée. Aucun compte externe connecté."}</T>
  </>;
}
