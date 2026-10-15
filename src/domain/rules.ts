export const RULES = { deposit: 2000, momentShare: 690, hostShare: 1310, confirmationMinutes: 10, maxInvitation: 5000, maxSeats: 3 } as const;
export type Category = 'Resto' | 'Bar' | 'Balade' | 'Culture';
export type Participation = 'requested' | 'accepted' | 'confirmed' | 'present' | 'cancelled' | 'expired';
export type Moment = {
  id: string; title: string; category: Category; host: string; district: number;
  address: string; startsAt: number; seats: number; price: number; womenOnly: boolean;
  description: string; own?: boolean;
};
export type Booking = { momentId: string; status: Participation; acceptedAt?: number };
export const isUrgent = (startsAt: number, now: number): boolean => now >= startsAt - 90 * 60000 && now <= startsAt + 30 * 60000;
export const canAttend = (startsAt: number, now: number): boolean => now >= startsAt - 15 * 60000;
export const confirmationExpired = (acceptedAt: number, now: number): boolean => now >= acceptedAt + RULES.confirmationMinutes * 60000;
export const monthKey = (now: number): string => new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', month: '2-digit', year: 'numeric' }).format(now);
export const euros = (cents: number): string => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
export const dateLabel = (time: number): string => new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(time);
export function validateMoment(m: Pick<Moment, 'title' | 'address' | 'district' | 'seats' | 'price' | 'startsAt'>, now: number): string | null {
  if (!m.title.trim() || !m.address.trim()) return 'Ajoutez un titre et une adresse.';
  if (!Number.isInteger(m.district) || m.district < 1 || m.district > 20) return 'Choisissez un arrondissement de Paris, du 1er au 20e.';
  if (!Number.isInteger(m.seats) || m.seats < 1 || m.seats > 3) return 'Une table accueille de 1 à 3 places.';
  if (!Number.isInteger(m.price) || m.price < 0 || m.price > RULES.maxInvitation) return 'L’invitation doit être comprise entre 0 et 50 €.';
  if (!Number.isFinite(m.startsAt) || m.startsAt <= now) return 'Choisissez un horaire à venir.';
  return null;
}
