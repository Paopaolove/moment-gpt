import { T } from '../components/T';
export function Countdown({ until, now }: {
  until: number;
  now: number;
}) {
  const sec = Math.max(0, Math.ceil((until - now) / 1000));
  return <T
    accessibilityLabel="Temps restant pour confirmer"
    style={{
      fontFamily: 'InterTight_700Bold',
      fontSize: 56,
      lineHeight: 64,
      fontVariant: ['tabular-nums']
    }}>
    {Math.floor(sec / 60).toString().padStart(2, '0')}{" : "}{(sec % 60).toString().padStart(2, '0')}
  </T>;
}
