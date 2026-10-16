const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load, H, minute, base, act, accepted, confirmed, demoUser } = require('./fixtures.cjs');
const { visibleFeed, addressFor } = load('src/domain/selectors.ts');
test('un visiteur voit des moments sans compte', () => {
 const s = base(); const feed = visibleFeed(s.moments, 'visiteur');
 assert.equal(feed.length, 1); assert.equal('privateAddress' in feed[0], false); assert.equal('accessDetails' in feed[0], false);
});
test('un invité ne confirme pas après 10 min', () => {
 const s = accepted();
 assert.equal(act(s, 'confirm', {now:H-50*minute-1}).requests[0].status, 'confirmed');
 for (const now of [H-50*minute,H-49*minute]) assert.equal(act(s,'confirm',{now}),s);
 assert.equal(act(s,'expire',{now:H-50*minute}).requests[0].status,'expired');
});
test('un urgent ne se confirme pas après H+30', () => {
 const s = accepted({urgent:true}, H+25*minute);
 assert.equal(act(s,'confirm',{now:H+30*minute}).requests[0].status,'confirmed');
 assert.equal(act(s,'confirm',{now:H+30*minute+1}),s);
});
test('une caution ne se rend pas avant H−15', () => {
 const s=confirmed(); assert.equal(act(s,'markPresence',{momentId:'m',now:H-15*minute-1}),s);
 const present=act(s,'markPresence',{momentId:'m',now:H-15*minute}); assert.equal(present.requests[0].deposit,'released');
 assert.equal(act(present,'markPresence',{momentId:'m',now:H}),present);
 assert.equal(act(s,'markPresence',{momentId:'m',now:H+90*minute+1}),s);
});
test('un invité ne peut pas annuler comme hôte', () => {
 const s=confirmed(); assert.equal(act(s,'cancel',{as:'host'}),s); assert.equal(act(s,'cancel',{actor:'other',as:'guest'}),s);
 assert.equal(act(s,'cancel',{actor:'h',as:'host'}).requests[0].deposit,'released');
});
test('un crédit ne se consomme pas deux fois', () => {
 const s=act(confirmed(),'cancel',{as:'guest'}); const credit=s.users.find(u=>u.id==='h').credits[0];
 const used=act(s,'consumeCredit',{actor:'h',creditId:credit.id});
 assert.equal(used.users.find(u=>u.id==='h').credits[0].consumed,true);
 assert.equal(act(used,'consumeCredit',{actor:'h',creditId:credit.id}),used);
 assert.equal(act(s,'consumeCredit',{actor:'g',creditId:credit.id}),s);
});
test("l'adresse n'apparaît pas avant le oui", () => {
 const s=base(); const g=demoUser('g'); const pending=act(s,'request',{momentId:'m',id:'r'});
 assert.equal(addressFor(s.moments[0],null,[]),null); assert.equal(addressFor(s.moments[0],g,pending.requests),null);
 assert.equal(addressFor(s.moments[0],g,accepted().requests),s.moments[0].privateAddress);
 assert.match(addressFor(s.moments[0],g,confirmed().requests),/Étage 2/);
 assert.equal(addressFor(s.moments[0],demoUser('other'),confirmed().requests),null);
});
test('les slides ne changent pas sans décision', () => {
 const {initialOnboarding,onboardingReducer}=load('src/domain/onboarding.ts');
 let s=initialOnboarding;
 for(const now of [0,10000,Date.UTC(2050,0,1)]) assert.equal(onboardingReducer(s,{type:'tick',now}),s);
 s=onboardingReducer(s,{type:'next',now:0}); assert.equal(s.slide,1);
 assert.equal(onboardingReducer(s,{type:'tick',now:999999999}),s);
});
