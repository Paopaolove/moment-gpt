const {test}=require('node:test');
const assert=require('node:assert/strict');
const {H,minute,base,act,accepted,confirmed}=require('./fixtures.cjs');
test('seul l’hôte accepte et seul l’invité confirme',()=>{
 const pending=act(base(),'request',{momentId:'m',id:'r'});
 assert.equal(act(pending,'accept'),pending);
 assert.equal(act(pending,'accept',{actor:'other'}),pending);
 const s=accepted();assert.equal(act(s,'confirm',{actor:'h'}),s);
 assert.equal(act(s,'confirm').requests[0].deposit,'held');
});
test('expiration simultanée sans prélèvement de caution',()=>{
 const s=accepted();const expired=act(s,'tick',{now:H-50*minute});
 assert.equal(expired.requests[0].status,'expired');
 assert.equal(expired.requests[0].deposit,'none');
 assert.equal(act(expired,'confirm',{now:H-49*minute}),expired);
});
test('annulation tardive : répartition unique et interdiction des acteurs étrangers',()=>{
 const s=confirmed();assert.equal(act(s,'cancel',{actor:'other',as:'guest'}),s);
 const cancelled=act(s,'cancel',{as:'guest'});
 assert.equal(cancelled.requests[0].deposit,'forfeited');
 assert.equal(cancelled.platformCents,690);
 assert.equal(cancelled.users.find(u=>u.id==='h').credits[0].cents,1310);
 assert.equal(act(cancelled,'cancel',{as:'guest'}),cancelled);
});
test('une présence ne peut être annulée et libère la caution une fois',()=>{
 const present=act(confirmed(),'markPresence',{momentId:'m',now:H-15*minute});
 assert.equal(present.requests[0].deposit,'released');
 assert.equal(act(present,'cancel',{as:'guest',now:H}),present);
 assert.equal(act(present,'markPresence',{momentId:'m',now:H}),present);
});
