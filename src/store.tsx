import React, { createContext, useContext, useEffect, useState } from 'react';
import { seed } from './domain/seed';
import { confirmationExpired, monthKey, canAttend, type Booking, type Moment } from './domain/rules';
type Store = { now: number; moments: Moment[]; bookings: Booking[]; woman: boolean; setWoman: (value: boolean) => void; jokerUsed: boolean; message: string; act: (id: string, action: 'request' | 'accept' | 'confirm' | 'present' | 'cancel' | 'joker') => void; publish: (m: Moment) => void; advance: (minutes: number) => void };
const Context = createContext<Store | null>(null);
export function Provider({ children }: { children: React.ReactNode }) {
  const [initial] = useState(Date.now);
  const [offset, setOffset] = useState(0);
  const [tick, setTick] = useState(Date.now);
  const now = tick + offset;
  const [moments, setMoments] = useState(() => seed(initial));
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [woman, setWoman] = useState(false);
  const [jokerMonth, setJokerMonth] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  useEffect(() => { const timer = setInterval(() => setTick(Date.now()), 1000); return () => clearInterval(timer); }, []);
  useEffect(() => { setBookings(old => old.some(b => b.status === 'accepted' && b.acceptedAt !== undefined && confirmationExpired(b.acceptedAt, now)) ? old.map(b => b.status === 'accepted' && b.acceptedAt !== undefined && confirmationExpired(b.acceptedAt, now) ? { ...b, status: 'expired' } : b) : old); }, [now]);
  const jokerUsed = jokerMonth === monthKey(now);
  function act(id: string, action: 'request' | 'accept' | 'confirm' | 'present' | 'cancel' | 'joker') {
    const m = moments.find(item => item.id === id); const b = bookings.find(item => item.momentId === id);
    if (!m) return;
    let next: Booking | undefined;
    if (action === 'request' && !m.own && !b && m.seats > 0 && now <= m.startsAt + 30 * 60000 && (!m.womenOnly || woman)) next = { momentId: id, status: 'requested' };
    if (action === 'accept' && b?.status === 'requested') next = { ...b, status: 'accepted', acceptedAt: now };
    if (action === 'confirm' && b?.status === 'accepted' && b.acceptedAt !== undefined && !confirmationExpired(b.acceptedAt, now)) next = { ...b, status: 'confirmed' };
    if (action === 'present' && b?.status === 'confirmed' && canAttend(m.startsAt, now)) next = { ...b, status: 'present' };
    if ((action === 'cancel' || action === 'joker') && b && ['requested', 'accepted', 'confirmed'].includes(b.status)) {
      if (action === 'joker' && (jokerUsed || b.status !== 'confirmed')) return;
      if (action === 'joker') setJokerMonth(monthKey(now));
      next = { ...b, status: 'cancelled' };
    }
    if (next) { setBookings(old => [...old.filter(item => item.momentId !== id), next]); setMessage(action === 'joker' ? 'Joker utilisé : caution simulée libérée.' : action === 'cancel' && b?.status === 'confirmed' ? 'Annulation : caution simulée répartie, 6,90 € Moment / 13,10 € hôte.' : 'Votre moment a été mis à jour.'); }
  }
  return <Context.Provider value={{ now, moments, bookings, woman, setWoman, jokerUsed, message, act, publish: m => setMoments(old => [m, ...old]), advance: minutes => setOffset(old => old + minutes * 60000) }}>{children}</Context.Provider>;
}
export function useStore(): Store { const value = useContext(Context); if (!value) throw new Error('Provider manquant'); return value; }
