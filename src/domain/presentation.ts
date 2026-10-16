import { Category } from './rules';
import { nextSlot } from './parisTime';

/** Human delays in minutes; a started event never looks like a countdown. */
export function formatDelay(startsAt: number, now: number) {
  const minutes = Math.ceil(Math.abs(startsAt - now) / 60000);
  const duration = minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, '0')}`;
  return startsAt < now ? `commencé depuis ${duration}` : `dans ${duration}`;
}
export function defaultOfferSlot(now: number, category: Category, subtype?: string) {
  const hours: Record<string, string> = { Bistrot: '20:00', Terrasse: '19:00', Padel: '19:00', Footing: '08:00', Piscine: '12:30', Cinéma: '20:15', Concert: '20:00', Exposition: '18:30', Théâtre: '20:00' };
  return nextSlot(now, [hours[subtype ?? ''] ?? ({ Table: '20:00', Verre: '19:00', Sport: '19:00', Culture: '20:00' }[category])]);
}
