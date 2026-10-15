const { test } = require('node:test');
const assert = require('node:assert/strict');
const r = require('./load.cjs')('src/domain/rules.ts');
const start = Date.UTC(2026, 9, 15, 18);
test('urgence : bornes H−90 et H+30 incluses', () => {
  assert.equal(r.isUrgent(start, start - 90 * 60000 - 1), false);
  assert.equal(r.isUrgent(start, start - 90 * 60000), true);
  assert.equal(r.isUrgent(start, start + 30 * 60000), true);
  assert.equal(r.isUrgent(start, start + 30 * 60000 + 1), false);
});
test('présence uniquement à partir de H−15', () => {
  assert.equal(r.canAttend(start, start - 900001), false);
  assert.equal(r.canAttend(start, start - 900000), true);
});
test('confirmation expire exactement à 10 minutes', () => {
  assert.equal(r.confirmationExpired(start, start + 599999), false);
  assert.equal(r.confirmationExpired(start, start + 600000), true);
});
test('répartition exacte de la caution en centimes', () => {
  assert.equal(r.RULES.deposit, 2000);
  assert.equal(r.RULES.momentShare, 690);
  assert.equal(r.RULES.hostShare, 1310);
  assert.equal(r.RULES.momentShare + r.RULES.hostShare, r.RULES.deposit);
});
test('Paris, 1 à 3 places, invitation de 50 € maximum', () => {
  const m = { title: 'Une table', address: '18 rue Paul Bert, Paris', district: 11, seats: 3, price: 5000, startsAt: start + 1 };
  assert.equal(r.validateMoment(m, start), null);
  for (const patch of [{ district: 0 }, { district: 21 }, { seats: 0 }, { seats: 4 }, { price: 5001 }, { price: -1 }, { startsAt: start }, { title: ' ' }]) assert.ok(r.validateMoment({ ...m, ...patch }, start));
});
test('renouvellement du Joker selon le mois civil à Paris', () => {
  assert.notEqual(r.monthKey(Date.UTC(2026, 0, 31, 22, 59)), r.monthKey(Date.UTC(2026, 0, 31, 23, 0)));
});

test('adresse et catégorie : rejeter hors Paris et incohérences postales', () => {
  const m = { title: 'Table', address: '18 rue Paul Bert, 75011 Paris', district: 11, seats: 2, price: 2000, startsAt: start + 1, category: 'Resto' };
  for (const patch of [{address: 'Paris, 92100'}, {address: 'Lyon'}, {address: '75012 Paris'}, {category: 'Culture'}, {seats: 1.5}, {price: NaN}, {startsAt: Infinity}]) assert.ok(r.validateMoment({...m, ...patch}, start));
  assert.equal(r.validateMoment({...m, category: 'Bar'}, start), null);
});
test('le fuseau de Paris suit aussi le passage à l’heure d’été', () => {
  assert.notEqual(r.monthKey(Date.UTC(2026, 5, 30, 21, 59)), r.monthKey(Date.UTC(2026, 5, 30, 22, 0)));
  assert.equal(r.RULES.hostSubscription, 0);
  assert.deepEqual(r.RULES.pricePills, [1000, 2000, 3000, 4000]);
});
