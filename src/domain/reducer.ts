import { Booking, ChatMessage, Moment, RULES, Review, canAttend, confirmationExpired, monthKey, validateMoment, confirmationDelay, jokerBalance } from './rules';
export type State = {
  moments: Moment[];
  reviews: Review[];
  chatMessages: ChatMessage[];
  bookings: Booking[];
  woman: boolean;
  jokerMonths: string[];
  credits: Record<string, number>;
  momentCredits: number;
  message: string;
};
export type Action = {
  type: 'review';
  review: Review;
} | {
  type: 'message';
  message: ChatMessage;
} | {
  type: 'request' | 'accept' | 'confirm' | 'present' | 'cancel' | 'joker';
  id: string;
  actor: string;
  now: number;
} | {
  type: 'tick';
  now: number;
} | {
  type: 'woman';
  value: boolean;
} | {
  type: 'publish';
  moment: Moment;
  now: number;
};
export const initialState = (moments: Moment[]): State => ({ moments, reviews: [], chatMessages: [], bookings: [], woman: false, jokerMonths: [], credits: {}, momentCredits: 0, message: '' });
export function reducer(state: State, action: Action): State {
  if(action.type === 'review') {
    const r = action.review;
    if(!state.bookings.some(b => b.momentId === r.momentId && b.status === 'present') || state.reviews.some(v => v.momentId === r.momentId) || !Number.isInteger(r.rating) || r.rating < 1 || r.rating > 5 || !r.text.trim() || r.text.length > 500)
      return state;
    return { ...state, reviews: [...state.reviews, { ...r, text: r.text.trim() }] };
  }
  if(action.type === 'message') {
    const m = action.message;
    if(!state.bookings.some(b => b.momentId === m.momentId && ['confirmed', 'present'].includes(b.status)) || !m.text.trim() || m.text.length > 1000 || !Number.isFinite(m.sentAt))
      return state;
    return { ...state, chatMessages: [...state.chatMessages, { ...m, text: m.text.trim() }] };
  }
  if(action.type === 'woman')
    return { ...state, woman: action.value };
  if(action.type === 'publish') {
    const error = validateMoment(action.moment, action.now);
    if(error || action.moment.hostId !== 'me' || state.moments.some(m => m.id === action.moment.id))
      return { ...state, message: error || 'Invitation non autorisée.' };
    return { ...state, moments: [action.moment, ...state.moments], message: 'Votre invitation est publiée. Une place de plus à Paris.' };
  }
  const expired = state.bookings.map(b => b.status === 'accepted' && b.acceptedAt !== undefined && confirmationExpired(b.acceptedAt, action.now, b.confirmationMinutes) ? { ...b, status: 'expired' as const } : b);
  const current = expired.some((b, i) => b !== state.bookings[i]) ? { ...state, bookings: expired } : state;
  if(action.type === 'tick')
    return current;
  const m = current.moments.find(m => m.id === action.id);
  if(!m)
    return current;
  const b = current.bookings.find(b => b.momentId === m.id);
  const guest = action.actor === (b?.guestId ?? 'me');
  const host = action.actor === m.hostId;
  let next: Booking | undefined;
  let message = '';
  let result = current;
  if(action.type === 'request' && guest && !host && !b && (!m.womenOnly || current.woman) && action.now <= m.startsAt + RULES.urgentAfterMinutes * 60000) {
    next = { momentId: m.id, guestId: action.actor, status: 'requested', deposit: 'none' };
    message = 'Votre demande est envoyée. La conversation commence ici.';
  }
  if(action.type === 'accept' && host && b?.status === 'requested' && action.now <= m.startsAt + RULES.urgentAfterMinutes * 60000) {
    next = { ...b, status: 'accepted', acceptedAt: action.now, confirmationMinutes: confirmationDelay(m.startsAt, action.now) };
    message = `Une place vous attend. Vous avez ${next.confirmationMinutes} minutes pour confirmer.`;
  }
  if(action.type === 'confirm' && guest && b?.status === 'accepted' && b.acceptedAt !== undefined && !confirmationExpired(b.acceptedAt, action.now, b.confirmationMinutes)) {
    next = { ...b, status: 'confirmed', deposit: 'held' };
    message = 'C’est prévu. Caution de 20 € réservée en simulation.';
  }
  if(action.type === 'present' && guest && b?.status === 'confirmed' && canAttend(m.startsAt, action.now)) {
    next = { ...b, status: 'present', deposit: 'released', presentAt: action.now };
    message = 'Vous y êtes. Caution libérée, profitez du moment.';
  }
  if((action.type === 'cancel' || action.type === 'joker') && b && ['requested', 'accepted', 'confirmed'].includes(b.status) && (guest || host)) {
    const joker = action.type === 'joker';
    const month = monthKey(action.now);
    if(joker && (!guest || host || b.status !== 'confirmed' || jokerBalance(current.bookings, current.jokerMonths, action.now).remaining === 0))
      return current;
    const split = b.status === 'confirmed' && !joker && !host;
    next = { ...b, status: 'cancelled', deposit: split ? 'split' : b.deposit === 'held' ? 'released' : 'none' };
    result = { ...current, jokerMonths: joker ? [...current.jokerMonths, month] : current.jokerMonths, momentCredits: current.momentCredits + (split ? RULES.momentShare : 0), credits: split ? { ...current.credits, [m.hostId]: (current.credits[m.hostId] ?? 0) + RULES.hostShare } : current.credits };
    message = split ? 'Caution répartie : 6,90 € Moment · 13,10 € hôte. Crédits fictifs.' : 'Annulation enregistrée. Toute caution réservée est libérée.';
  }
  return next ? { ...result, bookings: [...result.bookings.filter(b => b.momentId !== m.id), next], message } : current;
}
