export const RULES = {
  deposit: 2000, momentShare: 690, hostShare: 1310, confirmationMinutes: 10,
  jokerPerMonth: 1, urgentBeforeMinutes: 90, urgentAfterMinutes: 30, presenceBeforeMinutes: 15,
  minSeats: 1, maxSeats: 3, maxInvitation: 5000, pricePills: [1000, 2000, 3000, 4000],
  categories: ['Resto', 'Bar'], timezone: 'Europe/Paris', hostSubscription: 0,
} as const;
export type Category = typeof RULES.categories[number];
export type Participation = 'requested' | 'accepted' | 'confirmed' | 'present' | 'cancelled' | 'expired';
export type Moment = { id: string; title: string; category: Category; host: string; hostId: string; district: number; address: string; startsAt: number; seats: number; price: number; womenOnly: boolean; description: string; own?: boolean };
export type Booking = { momentId: string; guestId: string; status: Participation; acceptedAt?: number; deposit: 'none' | 'held' | 'released' | 'split' };
export const isUrgent = (start: number, now: number) => now >= start - RULES.urgentBeforeMinutes * 60000 && now <= start + RULES.urgentAfterMinutes * 60000;
export const canAttend = (start: number, now: number) => now >= start - RULES.presenceBeforeMinutes * 60000;
export const confirmationExpired = (accepted: number, now: number) => now >= accepted + RULES.confirmationMinutes * 60000;
export const monthKey = (now: number) => new Intl.DateTimeFormat('fr-FR', { timeZone: RULES.timezone, month: '2-digit', year: 'numeric' }).format(now);
export const euros = (cents: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
export const dateLabel = (time: number) => new Intl.DateTimeFormat('fr-FR', { timeZone: RULES.timezone, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(time);
export function validateMoment(m: Pick<Moment, 'title' | 'address' | 'district' | 'seats' | 'price' | 'startsAt'> & { category?: string }, now: number): string | null {
  if (!m.title.trim() || !m.address.trim()) return 'Un titre et une adresse, pour se retrouver.';
  if (!/\bParis\b/i.test(m.address) || /\b(?!750(?:0[1-9]|1[0-9]|20)\b)\d{5}\b/.test(m.address)) return 'Indiquez une adresse à Paris intramuros, avec la mention Paris.';
  if (!Number.isInteger(m.district) || m.district < 1 || m.district > 20) return 'Paris uniquement : du 1er au 20e arrondissement.';
  const postal = m.address.match(/750(\d{2})\b/); if (postal && Number(postal[1]) !== m.district) return 'Le code postal et l’arrondissement doivent correspondre.';
  if (!Number.isInteger(m.seats) || m.seats < RULES.minSeats || m.seats > RULES.maxSeats) return 'Proposez de 1 à 3 places.';
  if (!Number.isInteger(m.price) || m.price < 0 || m.price > RULES.maxInvitation) return 'L’invitation est limitée à 50 €.';
  if (m.category !== undefined && !RULES.categories.some(c => c === m.category)) return 'Choisissez Resto ou Bar.';
  if (!Number.isFinite(m.startsAt) || m.startsAt <= now) return 'Choisissez un horaire à venir.';
  return null;
}
