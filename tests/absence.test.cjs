const { test } = require('node:test');
const assert = require('node:assert/strict');
const { H, minute, act, confirmed, initialState, demoUser, moment } = require('./fixtures.cjs');
const host = s => s.users.find(u => u.id === 'h');
const guest = s => s.users.find(u => u.id === 'g');
// H = 20:00 à Paris ; le lendemain commence à H + 4 h.
const NEXT_DAY = H + 4 * 60 * minute + minute;

test('silence = caution rendue le lendemain, sans pénalité', () => {
  const s = confirmed();
  const sameEvening = act(s, 'tick', { now: H + 3 * 60 * minute });
  assert.equal(sameEvening.requests[0].deposit, 'held');
  const next = act(s, 'tick', { now: NEXT_DAY });
  assert.equal(next.requests[0].deposit, 'released');
  assert.equal(next.platformCents, 0); assert.equal(host(next).credits.length, 0); assert.equal(guest(next).absences, 0);
  assert.equal(act(next, 'noShow', { actor: 'h', now: NEXT_DAY + minute }), next);
});

test('Pas venu = caution perdue avec le partage 6,90 € / 13,10 €', () => {
  const c = act(confirmed(), 'noShow', { actor: 'h', now: H + 20 * minute });
  assert.equal(c.requests[0].deposit, 'forfeited'); assert.equal(c.requests[0].noShowBy, 'h');
  assert.equal(c.platformCents, 690); assert.equal(host(c).credits[0].cents, 1310); assert.equal(guest(c).absences, 1);
  assert.equal(act(c, 'tick', { now: NEXT_DAY }).requests[0].deposit, 'forfeited');
});

test('Pas venu refusé après une présence marquée', () => {
  const s = act(confirmed(), 'markPresence', { momentId: 'm', now: H - 15 * minute });
  assert.notEqual(s.requests[0].presentAt, undefined);
  assert.equal(act(s, 'noShow', { actor: 'h', now: H + 30 * minute }), s);
});

test('Pas venu refusé avant H', () => {
  const s = confirmed();
  assert.equal(act(s, 'noShow', { actor: 'h', now: H - minute }), s);
  assert.equal(act(s, 'noShow', { actor: 'h', now: H }).requests[0].deposit, 'forfeited');
});

test('Pas venu réservé à l’hôte ou au partenaire du lieu', () => {
  const s = confirmed();
  assert.equal(act(s, 'noShow', { actor: 'g', now: H + minute }), s);
  assert.equal(act(s, 'noShow', { actor: 'other', now: H + minute }), s);
  const p = structuredClone(s); p.moments[0].partnerId = 'p1'; p.partners.push({ id: 'p1', owner: 'other', status: 'valide', gesture: 'Un café', discountPercent: 0 });
  assert.equal(act(p, 'noShow', { actor: 'other', now: H + minute }).requests[0].deposit, 'forfeited');
});

test('Je suis arrivé : dès H−15, photo facultative', () => {
  const s = confirmed();
  assert.equal(act(s, 'markPresence', { momentId: 'm', now: H - 16 * minute }), s);
  const without = act(s, 'markPresence', { momentId: 'm', now: H - 15 * minute });
  assert.equal(without.requests[0].presencePhoto, undefined); assert.notEqual(without.requests[0].presentAt, undefined);
  const withPhoto = act(s, 'markPresence', { momentId: 'm', now: H - 10 * minute, photoUri: 'stub://table.jpg' });
  assert.equal(withPhoto.requests[0].presencePhoto, 'stub://table.jpg');
});

test('Je suis arrivé : retardataire accepté à H+20', () => {
  const s = act(confirmed(), 'markPresence', { momentId: 'm', now: H + 20 * minute });
  assert.notEqual(s.requests[0].presentAt, undefined); assert.equal(s.requests[0].deposit, 'released');
  assert.equal(act(s, 'noShow', { actor: 'h', now: H + 30 * minute }), s);
});

test('Je suis arrivé : refusé après la fin du moment', () => {
  const s = confirmed();
  const end = s.moments[0].endsAt;
  assert.notEqual(act(s, 'markPresence', { momentId: 'm', now: end }).requests[0].presentAt, undefined);
  assert.equal(act(s, 'markPresence', { momentId: 'm', now: end + 1 }), s);
});
