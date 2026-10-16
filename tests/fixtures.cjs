const load = require('./load.cjs');
const { reducer, initialState } = load('src/domain/reducer.ts');
const { demoUser } = load('src/domain/seed.ts');
const H = Date.parse('2026-10-16T18:00:00Z');
const minute = 60000;
const moment = (patch = {}) => ({ id: 'm', title: 'Une table', category: 'Table', neighborhood: 'Sainte-Marguerite', district: 11, privateAddress: '18 rue Paul Bert, 75011 Paris', accessDetails: 'Étage 2', startsAt: H, endsAt: H + 90 * minute, seats: 2, invitationCents: 2000, femmesUniquement: false, hostId: 'h', urgent: false, status: 'active', ...patch });
const base = (patch = {}) => initialState([moment(patch)], ['h', 'g', 'g2', 'other'].map(id => demoUser(id)));
const act = (s, type, patch = {}) => reducer(s, { type, now: H - 60 * minute, actor: 'g', requestId: 'r', ...patch });
function accepted(patch = {}, now = H - 60 * minute) {
 let s = act(base(patch), 'request', { momentId: 'm', id: 'r', now });
 return act(s, 'accept', { actor: 'h', now });
}
const confirmed = (patch = {}, now = H - 60 * minute) => act(accepted(patch, now), 'confirm', { now });
module.exports = { load, reducer, initialState, demoUser, H, minute, moment, base, act, accepted, confirmed };
