const { test } = require('node:test');
const assert = require('node:assert/strict');
const load = require('./load.cjs');
const { seed, seedHistory } = load('src/domain/seed.ts');
const { isUrgent } = load('src/domain/rules.ts');
const { parisDay, parisTime, nextSlot, offerHours } = load('src/domain/parisTime.ts');
const clock = t => new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit' }).format(t);
test('seed : horaires parisiens plausibles et un moment Maintenant à toute heure', () => {
  const expected = [['19:30', '20:30', '21:00'], ['12:30', '19:00'], ['20:15'], ['08:00', '19:00'], ['12:30'], ['20:00'], ['18:30'], ['20:00'], ['19:30', '20:30', '21:00']];
  for (const date of ['2026-10-15', '2026-10-25', '2026-03-29']) {
    for (let h = 0; h < 24; h++) {
      const now = Date.parse(`${date}T${String(h).padStart(2, '0')}:33:00Z`);
      const moments = seed(now);
      assert.equal(new Set(moments.map(m => m.id)).size, moments.length);
      assert.ok(moments.some(m => isUrgent(m.startsAt, now)));
      moments.slice(0, 9).forEach((m, i) => {
        assert.ok(expected[i].includes(clock(m.startsAt)));
        assert.ok(m.startsAt > now);
      });
    }
  }
});
test('créneau par défaut futur, demain après le dernier horaire ; conversion été/hiver', () => {
  for (const day of ['2026-01-15', '2026-07-15', '2026-10-25', '2026-03-29']) {
    assert.equal(clock(parisTime(day, '20:30')), '20:30');
    const now = parisTime(day, '23:45');
    const slot = nextSlot(now, offerHours);
    assert.ok(slot > now);
    assert.notEqual(parisDay(slot), day);
    assert.equal(clock(slot), '08:00');
  }
});

test('carnet de démonstration : trois souches passées dans trois arrondissements', () => {
  const now = Date.parse('2026-10-16T18:00:00Z');
  const history = seedHistory(now);
  assert.equal(history.moments.length, 3);
  assert.deepEqual(history.moments.map(m => clock(m.startsAt)), ['12:30', '19:00', '20:00']);
  assert.deepEqual(seedHistory(now + 86400000).moments.map(m => m.startsAt), history.moments.map(m => m.startsAt));
  assert.equal(new Set(history.moments.map(m => m.district)).size, 3);
  assert.ok(history.moments.every(m => m.startsAt < now));
  assert.equal(history.bookings.length, 3);
  assert.ok(history.bookings.every(b => b.status === 'present' && b.deposit === 'released' && history.moments.some(m => m.id === b.momentId)));
});
