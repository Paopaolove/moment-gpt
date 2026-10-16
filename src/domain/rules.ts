export type { Category } from './types';
export const RULES = {
  deposit: 2000, momentShare: 690, hostShare: 1310, confirmationMinutes: 10,
  urgentBeforeMinutes: 90, urgentAfterMinutes: 30, presenceBeforeMinutes: 15,
  presenceAfterMinutes: 15, chatBeforeMinutes: 60, freeCancellationHours: 3,
  pricePills: [1000, 2000, 3000, 4000], maxInvitation: 5000, minSeats: 1, maxSeats: 3,
  jokerPerMonth: 1, unexpectedPerMoment: 1, phraseMin: 10, phraseMax: 140,
  reliableMoments: 5, reliableAverage: 4, guestPriorityLoss: 2, guestClosure: 3,
  hostWarning: 1, hostClosure: 2, timezone: 'Europe/Paris',
  categories: ['Table', 'Verre', 'Sport', 'Culture'],
} as const;
export const MINUTE = 60000;
export const monthKey = (now: number): string => new Intl.DateTimeFormat('fr-FR', { timeZone: RULES.timezone, year: 'numeric', month: '2-digit' }).format(now);
export const confirmationExpired = (accepted: number, now: number) => now >= accepted + RULES.confirmationMinutes * MINUTE;
