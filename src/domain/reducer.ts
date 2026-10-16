import type { Credit, Draft, Moment, Partner, Photo, Rating, Request, Unexpected, User } from './types';
import { canReportNoShow, confirmationExpired, depositReleaseDue, MINUTE, monthKey, RULES } from './rules';
import { canMarkPresence } from './selectors';
export type State = { users: User[]; partners: Partner[]; moments: Moment[]; requests: Request[]; unexpected: Unexpected[]; ratings: Rating[]; photos: Photo[]; platformCents: number; draft: Draft | null; signedInId: string | null };
type Timed = { now: number; actor: string };
export type Action = Timed & (
  { type: 'publish'; moment: Moment } |
  { type: 'request'; momentId: string; id: string } |
  { type: 'accept' | 'confirm' | 'joker'; requestId: string } |
  { type: 'cancel'; requestId: string; as: 'host' | 'guest' } |
  { type: 'expire' | 'tick' } |
  { type: 'unexpected'; requestId: string; id: string; phrase: string } |
  { type: 'resolveUnexpected'; id: string; accept: boolean } |
  { type: 'markPresence'; momentId: string; photoUri?: string } | { type: 'close'; momentId: string } |
  { type: 'noShow'; requestId: string } |
  { type: 'rate'; rating: Rating } | { type: 'addPhoto'; photo: Photo } |
  { type: 'consent'; photoId: string; granted: boolean } |
  { type: 'rebook'; momentId: string; startsAt: number; endsAt: number } |
  { type: 'consumeCredit'; creditId: string } |
  { type: 'partnerApply'; partner: Partner } | { type: 'partnerValidate'; partnerId: string } |
  { type: 'signIn'; user: User }
);
export const initialState = (moments: Moment[] = [], users: User[] = [], partners: Partner[] = []): State => ({ moments, users, partners, requests: [], unexpected: [], ratings: [], photos: [], platformCents: 0, draft: null, signedInId: null });
const live = (r: Request) => ['accepted', 'confirmed'].includes(r.status);
const member = (s: State, m: Moment, id: string) => id === m.hostId || s.requests.some(r => r.momentId === m.id && r.guestId === id && r.status === 'confirmed' && r.presentAt !== undefined);
function settle(s: State, r: Request, forfeit: boolean): void {
  if (r.deposit !== 'held') return;
  r.deposit = forfeit ? 'forfeited' : 'released';
  if (forfeit) {
    const m = s.moments.find(m => m.id === r.momentId)!;
    const host = s.users.find(u => u.id === m.hostId)!;
    const credit: Credit = { id: `deposit:${r.id}`, owner: host.id, cents: RULES.hostShare, consumed: false };
    host.credits.push(credit); s.platformCents += RULES.momentShare;
  }
}
function accept(s: State, r: Request, now: number, automatic: boolean): void {
  r.status = automatic ? 'confirmed' : 'accepted'; r.acceptedAt = now;
  if (automatic) { r.confirmedAt = now; r.deposit = 'held'; }
  for (const other of s.requests) if (other.id !== r.id && other.guestId === r.guestId && other.status === 'requested') other.status = 'cancelled';
}
export function validatePublication(s: State, m: Moment, actor: User, now: number): boolean {
  const partner = s.partners.find(p => p.id === m.partnerId && p.owner === actor.id && p.status === 'valide');
  const money = (value: number) => Number.isSafeInteger(value) && value >= 0;
  const postal = m.privateAddress.match(/750(\d{2})\b/);
  return m.hostId === actor.id && !s.moments.some(x => x.id === m.id) && m.status === 'active' &&
    !!m.title.trim() && !!m.neighborhood.trim() && /\bParis\b/i.test(m.privateAddress) &&
    !/\b(?!750(?:0[1-9]|1[0-9]|20)\b)\d{5}\b/.test(m.privateAddress) &&
    Number.isInteger(m.district) && m.district >= 1 && m.district <= 20 && (!postal || Number(postal[1]) === m.district) &&
    RULES.categories.includes(m.category) && [1, 2, 3].includes(m.seats) &&
    Number.isFinite(m.startsAt) && Number.isFinite(m.endsAt) && m.endsAt > m.startsAt &&
    (m.urgent ? now <= m.startsAt + 30 * MINUTE && now >= m.startsAt - 90 * MINUTE : m.startsAt > now) &&
    money(m.invitationCents) && (m.freeAmountCents === undefined || money(m.freeAmountCents)) &&
    (actor.role === 'partenaire' ? !!partner && (!!partner.gesture.trim() || partner.discountPercent > 0) :
      !m.partnerId && m.invitationCents <= 5000 && (m.freeAmountCents ?? 0) <= 5000 && !s.moments.some(x => x.hostId === actor.id && x.status === 'active'));
}
/** Invalid transitions return the original state; valid transitions never mutate inputs. */
export function reducer(state: State, action: Action): State {
  if (!Number.isFinite(action.now)) return state;
  const s: State = structuredClone(state);
  const user = s.users.find(u => u.id === action.actor);
  if (action.type === 'tick' || action.type === 'expire') {
    let changed = false;
    for (const r of s.requests) {
      const m = s.moments.find(m => m.id === r.momentId)!;
      if (r.status === 'accepted' && r.acceptedAt !== undefined && (confirmationExpired(r.acceptedAt, action.now) || (m.urgent && action.now > m.startsAt + 30 * MINUTE))) { r.status = 'expired'; changed = true; }
      if (r.status === 'confirmed' && r.deposit === 'held' && r.presentAt === undefined && depositReleaseDue(m.startsAt, action.now)) { settle(s, r, false); changed = true; }
    }
    return changed ? s : state;
  }
  if (action.type === 'noShow') {
    const r = s.requests.find(r => r.id === action.requestId);
    const m = r && s.moments.find(m => m.id === r.momentId);
    if (!r || !m || !user || m.status === 'cancelled') return state;
    const partnerOwner = m.partnerId !== undefined && s.partners.some(p => p.id === m.partnerId && p.owner === user.id);
    if ((m.hostId !== user.id && !partnerOwner) || r.status !== 'confirmed' || r.deposit !== 'held' || !canReportNoShow(m.startsAt, action.now, r.presentAt)) return state;
    r.noShowAt = action.now; r.noShowBy = user.id; settle(s, r, true);
    const guest = s.users.find(u => u.id === r.guestId)!;
    guest.absences++; if (guest.absences >= 2) guest.priority = false; if (guest.absences >= 3) guest.accountStatus = 'closed';
    return s;
  }
  if (action.type === 'signIn') {
    if (action.user.id !== action.actor || action.user.role === 'visiteur') return state;
    // Stub authentication never overwrites balances or sanctions of an existing account.
    if (!user) s.users.push(structuredClone(action.user));
    s.signedInId = action.actor; return s;
  }
  if (!user || user.role === 'visiteur') return state;
  const activeAccount = user.accountStatus === 'active';
  if (action.type === 'publish') {
    if (!activeAccount || !validatePublication(s, action.moment, user, action.now)) return state;
    s.moments.push(structuredClone(action.moment)); return s;
  }
  if (action.type === 'partnerApply') {
    const p = action.partner;
    if (!activeAccount || p.owner !== user.id || s.partners.some(x => x.id === p.id) || !Number.isFinite(p.discountPercent) || p.discountPercent < 0 || p.discountPercent > 100) return state;
    s.partners.push({ ...p, status: 'en_revue' }); user.role = 'partenaire'; return s;
  }
  if (action.type === 'partnerValidate') {
    // Explicit demo-only manual validation stub, no production administrator/auth service.
    const p = s.partners.find(p => p.id === action.partnerId);
    if (!activeAccount || !p) return state;
    p.status = 'valide'; return s;
  }
  if (action.type === 'consumeCredit') {
    const c = user.credits.find(c => c.id === action.creditId && c.owner === user.id && !c.consumed);
    if (!activeAccount || !c) return state;
    c.consumed = true; return s;
  }
  if (action.type === 'resolveUnexpected') {
    const u = s.unexpected.find(u => u.id === action.id && u.recipient === user.id && u.status === 'pending');
    if (!u) return state;
    const r = s.requests.find(r => r.id === u.requestId)!;
    if (r.status !== 'confirmed' || r.presentAt !== undefined) return state;
    u.status = action.accept ? 'accepted' : 'declined';
    if (action.accept) { settle(s, r, false); r.status = 'cancelled'; }
    return s;
  }
  if (action.type === 'consent') {
    const p = s.photos.find(p => p.id === action.photoId && p.people.includes(user.id));
    if (!p) return state;
    p.consent = p.consent.filter(id => id !== user.id);
    if (action.granted) p.consent.push(user.id);
    return s;
  }
  if (action.type === 'rate' || action.type === 'addPhoto') {
    const item = action.type === 'rate' ? action.rating : action.photo;
    const m = s.moments.find(m => m.id === item.momentId);
    if (!m || m.status !== 'closed' || item.author !== user.id || !member(s, m, user.id)) return state;
    if (action.type === 'rate') {
      const r = action.rating;
      if (![1, 3, 5].includes(r.momentLevel) || ![1, 3, 5].includes(r.venueLevel) || r.recipient === user.id || !member(s, m, r.recipient) || s.ratings.some(x => x.id === r.id || (x.author === user.id && x.momentId === m.id && x.recipient === r.recipient))) return state;
      const recipient = s.users.find(u => u.id === r.recipient);
      if (!recipient) return state;
      s.ratings.push({ ...r }); recipient.momentRatings.push(r.momentLevel);
    } else {
      const p = action.photo;
      if (!['lieu', 'table'].includes(p.type) || !p.uri.trim() || s.photos.some(x => x.id === p.id) || (p.type === 'table' && (p.people.length < 1 || p.people.length > 2 || new Set(p.people).size !== p.people.length || p.people.some(id => !member(s, m, id))))) return state;
      s.photos.push({ ...p, people: [...p.people], consent: p.people.includes(user.id) ? [user.id] : [] });
    }
    return s;
  }
  if (action.type === 'request') {
    const m = s.moments.find(m => m.id === action.momentId && m.status === 'active');
    if (!activeAccount || !m || m.hostId === user.id || (m.femmesUniquement && !user.woman) || action.now > m.startsAt + 30 * MINUTE || s.requests.some(r => r.id === action.id || (r.momentId === m.id && r.guestId === user.id)) || s.requests.filter(r => r.momentId === m.id && live(r)).length >= m.seats) return state;
    const r: Request = { id: action.id, momentId: m.id, guestId: user.id, status: 'requested', deposit: 'none', requestedAt: action.now };
    s.requests.push(r);
    if (m.partnerId && s.partners.some(p => p.id === m.partnerId && p.status === 'valide')) accept(s, r, action.now, true);
    return s;
  }
  if (action.type === 'markPresence' || action.type === 'close' || action.type === 'rebook') {
    const m = s.moments.find(m => m.id === action.momentId);
    if (!m) return state;
    if (action.type === 'rebook') {
      if (!activeAccount || m.status !== 'closed' || !member(s, m, user.id) || !Number.isFinite(action.startsAt) || action.startsAt <= action.now || !Number.isFinite(action.endsAt) || action.endsAt <= action.startsAt) return state;
      const { id: _id, status: _status, hostPresentAt: _presence, ...draft } = m;
      s.draft = { ...draft, hostId: user.id, partnerId: undefined, startsAt: action.startsAt, endsAt: action.endsAt, urgent: false }; return s;
    }
    if (action.type === 'markPresence') {
      if (!canMarkPresence(m, action.now)) return state;
      if (m.hostId === user.id) { if (m.hostPresentAt !== undefined) return state; m.hostPresentAt = action.now; user.honoredMoments++; }
      else {
        const r = s.requests.find(r => r.momentId === m.id && r.guestId === user.id && r.status === 'confirmed' && r.presentAt === undefined && r.noShowAt === undefined);
        if (!r) return state;
        r.presentAt = action.now; if (action.photoUri) r.presencePhoto = action.photoUri; settle(s, r, false); user.honoredMoments++;
      }
      return s;
    }
    if (m.hostId !== user.id || m.status !== 'active' || action.now < m.endsAt || action.now <= m.startsAt + 15 * MINUTE) return state;
    m.status = 'closed';
    const hostAbsent = m.hostPresentAt === undefined;
    if (hostAbsent) { user.hostWarnings++; if (user.hostWarnings >= 2) user.accountStatus = 'closed'; }
    for (const r of s.requests.filter(r => r.momentId === m.id)) {
      if (r.status === 'confirmed') { /* Clôture sans effet sur la caution : seul « Pas venu » la fait perdre, sinon rendue le lendemain. */ }
      else if (r.status === 'accepted') r.status = 'expired';
      else if (r.status === 'requested') r.status = 'declined';
    }
    return s;
  }
  if (!('requestId' in action)) return state;
  const r = s.requests.find(r => r.id === action.requestId);
  const m = r && s.moments.find(m => m.id === r.momentId);
  if (!r || !m || m.status !== 'active' || action.now < r.requestedAt) return state;
  const guest = r.guestId === user.id; const host = m.hostId === user.id;
  if (action.type === 'accept') {
    if (!activeAccount || !host || r.status !== 'requested' || action.now > m.startsAt + 30 * MINUTE || s.requests.filter(x => x.momentId === m.id && live(x)).length >= m.seats) return state;
    accept(s, r, action.now, false); return s;
  }
  if (action.type === 'confirm') {
    if (!activeAccount || !guest || r.status !== 'accepted' || r.acceptedAt === undefined || action.now < r.acceptedAt || confirmationExpired(r.acceptedAt, action.now) || (m.urgent && action.now > m.startsAt + 30 * MINUTE)) return state;
    r.status = 'confirmed'; r.confirmedAt = action.now; r.deposit = 'held'; return s;
  }
  if (action.type === 'unexpected') {
    const phrase = action.phrase.trim();
    if ((!guest && !host) || r.status !== 'confirmed' || r.presentAt !== undefined || phrase.length < 10 || phrase.length > 140 || s.unexpected.some(u => u.momentId === m.id || u.id === action.id)) return state;
    s.unexpected.push({ id: action.id, requestId: r.id, momentId: m.id, sender: user.id, recipient: guest ? m.hostId : r.guestId, phrase, status: 'pending', createdAt: action.now }); return s;
  }
  if (action.type === 'joker') {
    const month = monthKey(action.now);
    if (!guest || r.status !== 'confirmed' || r.presentAt !== undefined || user.jokerMonths.includes(month)) return state;
    user.jokerMonths.push(month); settle(s, r, false); r.status = 'cancelled'; return s;
  }
  if (action.type === 'cancel') {
    if ((action.as === 'host' ? !host : !guest) || !['requested', 'accepted', 'confirmed'].includes(r.status) || r.presentAt !== undefined) return state;
    settle(s, r, action.as === 'guest' && m.startsAt - action.now < 3 * 60 * MINUTE); r.status = 'cancelled'; return s;
  }
  return state;
}
