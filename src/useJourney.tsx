import { useEffect, useReducer, useRef, useState } from 'react';
import { initialOnboarding, onboardingReducer } from './domain/onboarding';
import { demoUser } from './domain/seed';
import { isUrgent } from './domain/selectors';
import type { Level, Moment } from './domain/types';
import { useStore } from './store';
export function useJourney() {
  const pending = useRef<null | string>(null);
  const pendingAction = useRef<null | (() => void)>(null);
  const { state, user, now, setNow, act, dispatch: storeDispatch } = useStore();
  const [onboarding, next] = useReducer(onboardingReducer, initialOnboarding);
  const [tab, setTab] = useState('Découvrir');
  const [sheet, setSheet] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [category, setCategory] = useState('Tout');
  const [urgent, setUrgent] = useState(false);
  const [mode, setMode] = useState('Liste');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notice, setNotice] = useState('');
  const [phrase, setPhrase] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Record<string, string[]>>({});
  const [momentLevel, setMomentLevel] = useState<Level>(5);
  const [venueLevel, setVenueLevel] = useState<Level>(5);
  useEffect(() => {
    if(!onboarding.completed)
      return;
    const id = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(id);
  }, [onboarding.completed]);
  const m = state.moments.find(x => x.id === selected);
  const request = state.requests.find(r => r.momentId === selected && r.guestId === user?.id);
  const host = m && state.users.find(u => u.id === m.hostId);
  function requireAccount(fn: () => void) {
    if(!user) {
      pendingAction.current = fn;
      setSheet('auth');
      return;
    }
    fn();
  }
  function select(id: string) {
    setSelected(id);
    setSheet('detail');
    setNotice('');
  }
  const feed = state.moments.filter(m => m.status === 'active' && now <= m.startsAt + 30 * 60000 && (category === 'Tout' || category === m.category) && (!urgent || isUrgent(m, now)));
  const ownRequests = state.requests.filter(r => r.guestId === user?.id);
  const activeHost = state.moments.find(m => m.hostId === user?.id && m.status === 'active');
  function auth() {
    const account = state.users.find(u => u.id === 'guest') ?? demoUser('guest', 'Camille');
    act({ type: 'signIn', user: state.users.find(u => u.id === 'guest') ?? demoUser('guest', 'Camille') });
    setSheet('');
    const afterAuth = pendingAction.current;
    pendingAction.current = null;
    afterAuth?.();
    if(pending.current) {
      const target = state.moments.find(x => x.id === pending.current);
      if(target) {
        act({
          type: 'request',
          momentId: target.id,
          id: `request-${target.id}-${account.id}`,
          actor: account.id
        });
        setSelected(target.id);
        setSheet('detail');
        setNotice('Demande envoyée');
      }
      pending.current = null;
    }
  }
  function acceptDemo() {
    const r = ownRequests.find(r => r.status === 'requested');
    if(r) {
      const moment = state.moments.find(m => m.id === r.momentId)!;
      act({
        type: 'accept', requestId: r.id, actor: moment.hostId
      });
      setNotice('L’hôte a accepté votre demande.');
    }
  }
  function closeDemo(target: number) {
    setNow(target);
    state.moments.filter(m => m.status === 'active' && m.endsAt <= target).forEach(m => actAtClose(m, target));
  }
  function actAtClose(m: Moment, target: number) {
    const action = {
      type: 'close' as const,
      momentId: m.id,
      actor: m.hostId,
      now: target
    };
    storeDispatch(action);
  }
  function requestPlace() {
    if(!user) {
      pending.current = m?.id ?? null;
      setSheet('auth');
      return;
    }
    requireAccount(() => {
      if(!m)
        return;
      act({
        type: 'request',
        momentId: m.id,
        id: `request-${m.id}-${user!.id}`
      });
      setSheet('detail');
      setNotice(m.partnerId ? 'Place confirmée automatiquement · caution simulée de 20 € bloquée.' : 'Demande envoyée. L’hôte vous répondra ici.');
    });
  }
  return {
    state,
    user,
    now,
    setNow,
    act,
    storeDispatch,
    onboarding,
    next,
    tab,
    setTab,
    sheet,
    setSheet,
    selected,
    setSelected,
    category,
    setCategory,
    urgent,
    setUrgent,
    mode,
    setMode,
    loading,
    setLoading,
    error,
    setError,
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
    requireAccount,
    select,
    feed,
    ownRequests,
    activeHost,
    auth,
    acceptDemo,
    closeDemo,
    requestPlace
  };
}
export type JourneyContext = ReturnType<typeof useJourney>;
