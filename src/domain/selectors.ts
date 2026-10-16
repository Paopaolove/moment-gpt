import type { Moment, Photo, Request, User } from './types';
import { MINUTE, RULES } from './rules';
export function publicView(moment: Moment) {
  const { privateAddress: _address, accessDetails: _access, ...visible } = moment;
  return visible;
}
export function visibleFeed(moments: readonly Moment[], _viewer: User | 'visiteur' | null = null) {
  return moments.filter(m => m.status === 'active').map(publicView);
}
export function addressFor(moment: Moment, viewer: User | null, requests: readonly Request[]): string | null {
  if (!viewer || viewer.role === 'visiteur') return null;
  const r = requests.find(r => r.momentId === moment.id && r.guestId === viewer.id && ['accepted', 'confirmed'].includes(r.status));
  if (viewer.id !== moment.hostId && !r) return null;
  return moment.privateAddress + ((viewer.id === moment.hostId || r?.status === 'confirmed') && moment.accessDetails ? ` — ${moment.accessDetails}` : '');
}
export const isUrgent = (moment: Moment, now: number) => now >= moment.startsAt - 90 * MINUTE && now <= moment.startsAt + 30 * MINUTE;
export const canMarkPresence = (moment: Moment, now: number) => moment.status === 'active' && now >= moment.startsAt - 15 * MINUTE && now <= moment.startsAt + 15 * MINUTE;
export function canChat(moment: Moment, viewer: User | null, requests: readonly Request[], now: number): boolean {
  return !!viewer && viewer.role !== 'visiteur' && viewer.accountStatus === 'active' && moment.status === 'active' && now >= moment.startsAt - 60 * MINUTE && now <= moment.endsAt && requests.some(r => r.momentId === moment.id && r.status === 'confirmed' && (viewer.id === moment.hostId || viewer.id === r.guestId));
}
export const reliable = (user: User) => user.honoredMoments >= RULES.reliableMoments && user.momentRatings.length > 0 && user.momentRatings.reduce((a, b) => a + b, 0) / user.momentRatings.length >= RULES.reliableAverage;
export const photoVisible = (photo: Photo) => photo.type === 'lieu' || (photo.people.length > 0 && photo.people.every(id => photo.consent.includes(id)));
/** Host inbox: priority first, then request time, without mutating the source. */
export function requestsForHost(moment: Moment, viewer: User, requests: readonly Request[], users: readonly User[]): Request[] {
  if (viewer.id !== moment.hostId) return [];
  const priority = (id: string) => users.find(u => u.id === id)?.priority === true ? 1 : 0;
  return requests.filter(r => r.momentId === moment.id && r.status === 'requested')
    .sort((a, b) => priority(b.guestId) - priority(a.guestId) || a.requestedAt - b.requestedAt)
    .map(r => ({ ...r }));
}
