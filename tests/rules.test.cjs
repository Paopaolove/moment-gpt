const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const vm = require('node:vm');
const source = fs.readFileSync('src/domain/rules.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } });
const scope = { exports: {}, Intl };
vm.runInNewContext(compiled.outputText, scope);
const r = scope.exports;
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
