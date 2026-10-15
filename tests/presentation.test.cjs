const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./load.cjs');
const { formatDelay, defaultOfferSlot } = load('src/domain/presentation.ts');
const { parisTime, parisDay, addDays } = load('src/domain/parisTime.ts');
test('délais explicites : minutes, heures, début passé et bornes', () => {
  const now = 10000000;
  for (const [delta, expected] of [[12 * 60000, 'dans 12 min'], [65 * 60000, 'dans 1 h 05'], [-8 * 60000, 'commencé depuis 8 min'], [0, 'dans 0 min'], [1, 'dans 1 min'], [60 * 60000, 'dans 1 h 00'], [-1, 'commencé depuis 1 min']]) assert.equal(formatDelay(now + delta, now), expected);
});
test('Offrir : chaque sous-type, aujourd’hui sinon demain, y compris égalité et changement saisonnier', () => {
  const cases = [['Table', undefined, '20:00'], ['Table', 'Bistrot', '20:00'], ['Table', 'Terrasse', '19:00'], ['Table', 'Cuisine française', '20:00'], ['Sport', 'Padel', '19:00'], ['Sport', 'Footing', '08:00'], ['Sport', 'Piscine', '12:30'], ['Culture', 'Cinéma', '20:15'], ['Culture', 'Concert', '20:00'], ['Culture', 'Exposition', '18:30'], ['Culture', 'Théâtre', '20:00']];
  for (const day of ['2026-10-16', '2026-10-25', '2026-03-29']) for (const [category, subtype, hour] of cases) {
    const slot = parisTime(day, hour);
    assert.equal(defaultOfferSlot(slot - 1, category, subtype), slot);
    for (const now of [slot, parisTime(day, '23:59')]) {
      const next = defaultOfferSlot(now, category, subtype);
      assert.equal(next, parisTime(addDays(day, 1), hour));
      assert.notEqual(parisDay(next), day);
      assert.ok(next > now);
    }
  }
});
