const { test } = require('node:test');
const assert = require('node:assert/strict');
const { reducer, initialState } = require('./load.cjs')('src/domain/reducer.ts');
const t = Date.UTC(2026, 9, 15, 16);
const moment = { id: 'a', hostId: 'host', host: 'Camille', title: 'Table', address: '18 rue Paul Bert, 75011 Paris', district: 11, category: 'Resto', startsAt: t + 3600000, seats: 2, price: 2000, womenOnly: false, description: '' };
const act = (s, type, actor = 'me', now = t) => reducer(s, { type, actor, now, id: 'a' });
function accepted() { return act(act(initialState([moment]), 'request'), 'accept', 'host'); }
function confirmed() { return act(accepted(), 'confirm'); }
test('seul l’hôte accepte, seul l’invité confirme', () => {
  const requested = act(initialState([moment]), 'request');
  assert.equal(act(requested, 'accept'), requested);
  assert.equal(act(requested, 'accept', 'stranger'), requested);
  const s = accepted(); assert.equal(act(s, 'confirm', 'host'), s);
  assert.equal(confirmed().bookings[0].deposit, 'held');
});
test('confirmation rejetée à l’échéance même sans tick préalable', () => {
  assert.equal(act(accepted(), 'confirm', 'me', t + 599999).bookings[0].status, 'confirmed');
  const expired = act(accepted(), 'confirm', 'me', t + 600000);
  assert.equal(expired.bookings[0].status, 'expired'); assert.equal(expired.bookings[0].deposit, 'none');
});
test('présence bloquée avant H−15 puis libération unique', () => {
  const s = confirmed(); assert.equal(act(s, 'present', 'me', moment.startsAt - 900001), s);
  const present = act(s, 'present', 'me', moment.startsAt - 900000);
  assert.equal(present.bookings[0].deposit, 'released');
  assert.equal(act(present, 'cancel'), present); assert.equal(act(present, 'present'), present);
});
test('annulation : contrôle des acteurs et comptabilité sans double crédit', () => {
  const s = confirmed(); assert.equal(act(s, 'cancel', 'stranger'), s);
  const cancelled = act(s, 'cancel'); assert.equal(cancelled.bookings[0].deposit, 'split');
  assert.equal(cancelled.momentCredits, 690); assert.equal(cancelled.credits.host, 1310);
  assert.equal(act(cancelled, 'cancel'), cancelled);
  const hostCancel = act(s, 'cancel', 'host'); assert.equal(hostCancel.bookings[0].deposit, 'released'); assert.equal(hostCancel.momentCredits, 0);
  assert.equal(act(accepted(), 'cancel').bookings[0].deposit, 'none');
});
test('Joker : invité confirmé seulement, un par mois civil', () => {
  assert.equal(act(accepted(), 'joker').jokerMonths.length, 0);
  assert.equal(act(confirmed(), 'joker', 'host').jokerMonths.length, 0);
  const joker = act(confirmed(), 'joker'); assert.equal(joker.bookings[0].deposit, 'released'); assert.equal(joker.jokerMonths.length, 1); assert.equal(joker.momentCredits, 0);
  const another = {...confirmed(), jokerMonths: joker.jokerMonths}; assert.equal(act(another, 'joker'), another);
  assert.equal(act(another, 'joker', 'me', Date.UTC(2026, 10, 1)).jokerMonths.length, 2);
});
test('demande : femmes uniquement, pas sa propre table, pas après H+30', () => {
  const s = initialState([{...moment, womenOnly: true}]); assert.equal(act(s, 'request'), s);
  assert.equal(act(reducer(s, {type: 'woman', value: true}), 'request').bookings[0].status, 'requested');
  const own = initialState([{...moment, hostId: 'me'}]); assert.equal(act(own, 'request'), own);
  const normal = initialState([moment]); assert.equal(act(normal, 'request', 'me', moment.startsAt + 1800001), normal);
});
test('publication validée dans le reducer et identifiants uniques', () => {
  const s = initialState([]);
  assert.equal(reducer(s, {type: 'publish', moment, now: t}).moments.length, 0);
  const m = {...moment, hostId: 'me', own: true};
  const published = reducer(s, {type: 'publish', moment: m, now: t}); assert.equal(published.moments.length, 1);
  assert.equal(reducer(published, {type: 'publish', moment: m, now: t}).moments.length, 1);
  assert.equal(reducer(s, {type: 'publish', moment: {...m, seats: 4}, now: t}).moments.length, 0);
});
