import React, { createContext, useContext, useEffect, useReducer, useState, } from 'react';
import { feedback } from './components/haptics';
import { initialState, reducer } from './legacy/reducer';
import { monthKey, type Moment } from './legacy/rules';
import { seed, seedHistory } from './legacy/seed';
function useMomentStore() {
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const now = Date.now();
    const history = seedHistory(now);
    return { ...initialState([...seed(now), ...history.moments]), bookings: history.bookings };
  });
  const [offset, setOffset] = useState(0);
  const [clock, setClock] = useState(Date.now);
  const now = clock + offset;
  useEffect(() => {
    const timer = setInterval(() => setClock(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    dispatch({
      type: 'tick',
      now,
    });
  }, [now]);
  return {
    ...state,
    now,
    addReview: (momentId: string, rating: number, text: string) => dispatch({
      type: 'review',
      review: {
        momentId,
        rating,
        text,
      },
    }),
    sendMessage: (momentId: string, text: string) => dispatch({
      type: 'message',
      message: {
        momentId,
        text,
        sentAt: now,
      },
    }),
    jokerUsed: state.jokerMonths.includes(monthKey(now)),
    setWoman: (value: boolean) => dispatch({
      type: 'woman',
      value,
    }),
    act: (id: string, type: 'request' | 'accept' | 'confirm' | 'present' | 'cancel' | 'joker', asHost = false) => {
      if(type === 'confirm' || type === 'present')
        void feedback('success');
      if(type === 'joker')
        void feedback('warning');
      dispatch({
        type,
        id,
        now,
        actor: asHost ? (state.moments.find((m) => m.id === id)?.hostId ?? '') : 'me',
      });
    },
    publish: (moment: Moment) => dispatch({
      type: 'publish',
      moment,
      now,
    }),
    advance: (minutes: number) => setOffset((v) => v + minutes * 60000),
  };
}
const Context = createContext<ReturnType<typeof useMomentStore> | null>(null);
export function Provider({ children }: {
  children: React.ReactNode;
}) {
  return <Context.Provider value={useMomentStore()}>{children}</Context.Provider>;
}
export function useStore() {
  const store = useContext(Context);
  if(!store)
    throw new Error('Provider manquant');
  return store;
}
