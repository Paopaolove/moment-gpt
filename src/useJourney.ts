import { useEffect, useState } from 'react';
import { nextSlot, offerHours, parisDay } from './domain/parisTime';
import { BackHandler } from 'react-native';
import { useStore } from './store';
import { Category, confirmationRemaining, Moment, validateMoment } from './domain/rules';
const subtypes: Record<Category, string[]> = {
  Table: ['Bistrot', 'Terrasse', 'Cuisine française'],
  Sport: ['Padel', 'Footing', 'Piscine'],
  Culture: ['Cinéma', 'Concert', 'Exposition', 'Théâtre']
};
export type Page = 'home' | 'list' | 'detail' | 'take' | 'confirmed' | 'offer';
export function useJourney() {
  const store = useStore();
  const [page, setPage] = useState<Page>('home');
  const [step, setStep] = useState(0);
  const [id, setId] = useState('place-0');
  const [filter, setFilter] = useState('Tout');
  const [urgent, setUrgent] = useState(false);
  const [error, setError] = useState('');
  const [category, setCategory] = useState<Category>('Table');
  const [subtype, setSubtype] = useState('Bistrot');
  const [title, setTitle] = useState('Une place à ma table');
  const [address, setAddress] = useState('18 rue Paul Bert, 75011 Paris');
  const [district, setDistrict] = useState('11');
  const initialSlot = nextSlot(store.now, offerHours);
  const [day, setDay] = useState(() => parisDay(initialSlot));
  const [hour, setHour] = useState(() => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(initialSlot));
  const [seats, setSeats] = useState('1');
  const [price, setPrice] = useState('20');
  const [women, setWomen] = useState(false);
  const m = store.moments.find(x => x.id === id)!;
  const booking = store.bookings.find(x => x.momentId === id);
  const go = (p: Page) => {
    setError('');
    setPage(p);
  };
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (page === 'home') return false;
      go(page === 'take' ? 'detail' : 'list');
      return true;
    });
    return () => sub.remove();
  }, [page]);
  function reserve() {
    store.act(id, 'request');
    go('take');
  }
  function publish() {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(day);
    const hm = /^(\d{2}):(\d{2})$/.exec(hour);
    if (!match || !hm || Number(hm[1]) > 23 || Number(hm[2]) > 59) {
      setError('Indiquez une date AAAA-MM-JJ et une heure HH:MM.');
      return;
    }
    // Convert Paris wall time with Intl, including winter/summer offset.
    const wall = Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(hm[1]), Number(hm[2]));
    const parts = (t: number) => Object.fromEntries(new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Paris',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    }).formatToParts(t).map(p => [p.type, p.value]));
    const p = parts(wall);
    const shifted = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute));
    const startsAt = wall - (shifted - wall);
    const actual = parts(startsAt);
    if (`${actual.year}-${actual.month}-${actual.day}` !== day || `${actual.hour}:${actual.minute}` !== hour) {
      setError('Cette date ou heure n’existe pas à Paris.');
      return;
    }
    const item: Moment = {
      id: `offre-${Date.now()}`,
      host: 'Vous',
      hostId: 'me',
      own: true,
      title,
      category,
      subtype,
      address,
      district: Number(district),
      startsAt,
      seats: Number(seats),
      price: Number(price) * 100,
      womenOnly: women,
      description: 'Une place offerte par vous. Retrouvez votre invité au lieu indiqué.'
    };
    const e = validateMoment(item, store.now);
    if (e) {
      setError(e);
      return;
    }
    store.publish(item);
    setId(item.id);
    go('detail');
  }
  const remaining = booking?.acceptedAt === undefined ? 600 : confirmationRemaining(booking.acceptedAt, store.now);
  const expired = booking?.status === 'expired';
  return {
    store,
    page,
    setPage,
    step,
    setStep,
    id,
    setId,
    filter,
    setFilter,
    urgent,
    setUrgent,
    error,
    category,
    setCategory,
    subtype,
    setSubtype,
    title,
    setTitle,
    address,
    setAddress,
    district,
    setDistrict,
    day,
    setDay,
    hour,
    setHour,
    seats,
    setSeats,
    price,
    setPrice,
    women,
    setWomen,
    m,
    booking,
    go,
    reserve,
    publish,
    remaining,
    expired
  };
}
export type Journey = ReturnType<typeof useJourney>;
