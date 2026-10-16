const { test } = require('node:test');
const assert = require('node:assert/strict');
const { load, H, minute, moment, base, act, accepted, confirmed, initialState, demoUser } = require('./fixtures.cjs');
const { RULES, monthKey } = load('src/domain/rules.ts');
const { reliable, canChat, isUrgent, photoVisible } = load('src/domain/selectors.ts');
const host = s => s.users.find(u=>u.id==='h');
const guest = s => s.users.find(u=>u.id==='g');
const publish = (s, patch={}) => act(s,'publish',{actor:'h',moment:moment(patch)});
function empty() { return initialState([], [demoUser('h'),demoUser('g')]); }
function closed(s=confirmed(), presentHost=true) {
 if(presentHost) s=act(s,'markPresence',{actor:'h',momentId:'m',now:H});
 return act(s,'close',{actor:'h',momentId:'m',now:H+90*minute});
}
test('publication : une seule annonce active, plafond et champ libre',()=>{
 const s=empty(); const ok=publish(s,{invitationCents:5000,freeAmountCents:5000}); assert.equal(ok.moments.length,1);
 assert.equal(publish(ok,{id:'m2'}),ok);
 for(const patch of [{invitationCents:5001},{freeAmountCents:5001},{freeAmountCents:-1},{invitationCents:1.1},{seats:4},{seats:0},{district:21},{privateAddress:'Lyon'},{privateAddress:'75012 Paris'},{startsAt:NaN},{endsAt:H-1},{category:'Autre'}]) assert.equal(publish(s,patch),s);
 for(const amount of RULES.pricePills) assert.equal(publish(s,{invitationCents:amount}).moments.length,1);
 const old={...ok,moments:ok.moments.map(m=>({...m,status:'closed'}))}; assert.equal(publish(old,{id:'new'}).moments.length,2);
});
test('demandes : compte actif requis, femmes uniquement et capacité',()=>{
 const s=base({femmesUniquement:true}); assert.equal(act(s,'request',{momentId:'m',id:'r'}),s);
 guest(s).woman=true; assert.equal(act(s,'request',{momentId:'m',id:'r'}).requests.length,1);
 guest(s).accountStatus='closed'; assert.equal(act(s,'request',{momentId:'m',id:'r'}),s);
 assert.equal(publish({...empty(),users:[{...demoUser('h'),accountStatus:'closed'}]}).moments.length,0);
 const c=confirmed({seats:1}); assert.equal(act(c,'request',{actor:'g2',momentId:'m',id:'r2'}),c);
 const anon=base(); assert.equal(act(anon,'request',{actor:'missing',momentId:'m',id:'r'}),anon);
});
test('oui réservé à l’hôte, annule toutes les autres demandes requested du même invité',()=>{
 let s=base(); s.moments.push(moment({id:'m2',hostId:'other'}));
 s=act(s,'request',{momentId:'m',id:'r'}); s=act(s,'request',{momentId:'m2',id:'r2'});
 s=act(s,'request',{actor:'g2',momentId:'m2',id:'r3'});
 assert.equal(act(s,'accept'),s);
 const yes=act(s,'accept',{actor:'h'}); assert.deepEqual(yes.requests.map(r=>r.status),['accepted','cancelled','requested']);
 assert.equal(act(yes,'confirm',{actor:'h'}),yes);
});
test('annulation ≥ 3 h rendue ; < 3 h perdue avec split unique',()=>{
 const s=confirmed({},H-4*60*minute);
 const free=act(s,'cancel',{as:'guest',now:H-3*60*minute}); assert.equal(free.requests[0].deposit,'released'); assert.equal(host(free).credits.length,0);
 const lost=act(s,'cancel',{as:'guest',now:H-3*60*minute+1}); assert.equal(lost.requests[0].deposit,'forfeited'); assert.equal(lost.platformCents,690); assert.equal(host(lost).credits[0].cents,1310);
 assert.equal(act(lost,'cancel',{as:'guest'}),lost);
 assert.equal(s.requests[0].deposit,'held'); assert.equal(host(s).credits.length,0);
});
test('imprévu : une fois par moment, phrase 10–140, réponse de l’autre',()=>{
 const s=confirmed();
 for(const phrase of ['court','x'.repeat(141),' '.repeat(20)]) assert.equal(act(s,'unexpected',{id:'u',phrase}),s);
 const u=act(s,'unexpected',{id:'u',phrase:'Je suis malade ce soir.'});
 assert.equal(act(u,'unexpected',{id:'u2',phrase:'Un autre empêchement.'}),u);
 assert.equal(act(u,'resolveUnexpected',{id:'u',accept:true}),u);
 const yes=act(u,'resolveUnexpected',{actor:'h',id:'u',accept:true}); assert.equal(yes.requests[0].deposit,'released'); assert.equal(host(yes).credits.length,0);
 const no=act(u,'resolveUnexpected',{actor:'h',id:'u',accept:false}); assert.equal(no.requests[0].status,'confirmed'); assert.equal(no.requests[0].deposit,'held');
 assert.equal(act(no,'cancel',{as:'guest'}).requests[0].deposit,'forfeited');
 const fromHost=act(s,'unexpected',{actor:'h',id:'u',phrase:'Je suis malade ce soir.'});
 assert.equal(act(fromHost,'resolveUnexpected',{id:'u',accept:true}).requests[0].deposit,'released');
});
test('joker après refus : rendu sans crédit, un par mois civil Paris',()=>{
 let s=act(confirmed(),'unexpected',{id:'u',phrase:'Je suis malade ce soir.'}); s=act(s,'resolveUnexpected',{actor:'h',id:'u',accept:false});
 const now=Date.parse('2026-10-31T22:59:59Z');
 const j=act(s,'joker',{now}); assert.equal(j.requests[0].deposit,'released'); assert.equal(j.platformCents,0); assert.equal(host(j).credits.length,0);
 const again=structuredClone(s); guest(again).jokerMonths=guest(j).jokerMonths;
 assert.equal(act(again,'joker',{now}),again); assert.equal(act(again,'joker',{now:now+1000}).requests[0].deposit,'released');
 assert.notEqual(monthKey(now),monthKey(now+1000)); assert.equal(act(s,'joker',{actor:'h'}),s); assert.equal(act(accepted(),'joker').requests[0].deposit,'none');
});
test('« Pas venu » : absences invité, sanctions à 2 et 3, comptabilité idempotente',()=>{
 for(const previous of [0,1,2]) {
 const s=confirmed(); guest(s).absences=previous;
 const c=act(closed(s),'noShow',{actor:'h',now:H+95*minute}); assert.equal(guest(c).absences,previous+1); assert.equal(guest(c).priority,previous<1); assert.equal(guest(c).accountStatus,previous===2?'closed':'active');
 assert.equal(c.requests[0].deposit,'forfeited'); assert.equal(c.platformCents,690); assert.equal(host(c).credits.length,1);
 assert.equal(act(c,'noShow',{actor:'h',now:H+100*minute}),c);
 assert.equal(act(c,'close',{actor:'h',momentId:'m',now:H+100*minute}),c);
 }
 assert.equal(act(confirmed(),'close',{actor:'g',momentId:'m',now:H+100*minute}).moments[0].status,'active');
 assert.equal(act(confirmed(),'close',{actor:'h',momentId:'m',now:H}).moments[0].status,'active');
});
test('hôte absent : avertissement puis fermeture ; la clôture seule ne prend jamais la caution',()=>{
 for(const warnings of [0,1]) { const s=confirmed(); host(s).hostWarnings=warnings; const c=closed(s,false); assert.equal(host(c).hostWarnings,warnings+1); assert.equal(host(c).accountStatus,warnings?'closed':'active'); assert.equal(c.requests[0].deposit,'held'); assert.equal(host(c).credits.length,0); assert.equal(guest(c).absences,0); }
});
function attended() {
 let s=confirmed(); s=act(s,'markPresence',{momentId:'m',now:H}); return closed(s);
}
test('notes séparées 1/3/5 ; Fiable : 5 présences et moyenne reçue ≥ 4',()=>{
 let u=demoUser('u'); u.honoredMoments=5; u.momentRatings=[5,3]; assert.equal(reliable(u),true);
 assert.equal(reliable({...u,honoredMoments:4}),false); assert.equal(reliable({...u,momentRatings:[3,3]}),false); assert.equal(reliable({...u,momentRatings:[]}),false);
 const s=attended(); const rating={id:'note',momentId:'m',author:'g',recipient:'h',momentLevel:5,venueLevel:1};
 const r=act(s,'rate',{rating}); assert.deepEqual(host(r).momentRatings,[5]); assert.equal(r.ratings[0].venueLevel,1); assert.equal(act(r,'rate',{rating}),r);
 assert.equal(act(s,'rate',{rating:{...rating,momentLevel:4}}),s);
 assert.equal(act(confirmed(),'rate',{rating}).ratings.length,0);
 assert.equal(guest(s).honoredMoments,1);
});
test('photos : lieu visible, table 1 ou 2 personnes, consentement personnel révocable',()=>{
 const s=attended(); const photo={id:'p',momentId:'m',author:'g',type:'table',uri:'demo://table',people:['g','h'],consent:['g','h']};
 let p=act(s,'addPhoto',{photo}); assert.deepEqual(p.photos[0].consent,['g']); assert.equal(photoVisible(p.photos[0]),false);
 assert.equal(act(p,'consent',{actor:'other',photoId:'p',granted:true}),p);
 p=act(p,'consent',{actor:'h',photoId:'p',granted:true}); assert.equal(photoVisible(p.photos[0]),true);
 p=act(p,'consent',{actor:'h',photoId:'p',granted:false}); assert.equal(photoVisible(p.photos[0]),false);
 assert.equal(act(s,'addPhoto',{photo:{...photo,people:['g','h','g2']}}),s);
 assert.equal(photoVisible({type:'lieu'}),true);
});
test('partenaire : auto-confirme, caution bloquée, geste et remise cumulables, sans plafond euros',()=>{
 const s=empty(); host(s).role='partenaire'; s.partners=[{id:'p',owner:'h',status:'valide',gesture:'Café offert',discountPercent:15}];
 const p=publish(s,{partnerId:'p',invitationCents:12000,freeAmountCents:9000}); assert.equal(p.moments.length,1);
 const r=act(p,'request',{momentId:'m',id:'r'}); assert.equal(r.requests[0].status,'confirmed'); assert.equal(r.requests[0].deposit,'held'); assert.equal(r.partners[0].discountPercent,15); assert.equal(r.partners[0].gesture,'Café offert');
 const invalid=structuredClone(s); invalid.partners[0].gesture=''; invalid.partners[0].discountPercent=0; assert.equal(publish(invalid,{partnerId:'p'}),invalid);
 const review=structuredClone(s); review.partners[0].status='en_revue'; assert.equal(publish(review,{partnerId:'p'}),review);
});
test('chat à H−1 entre participants confirmés ; urgent bornes incluses',()=>{
 const s=confirmed(); const m=s.moments[0];
 assert.equal(canChat(m,guest(s),s.requests,H-60*minute-1),false); assert.equal(canChat(m,guest(s),s.requests,H-60*minute),true);
 assert.equal(canChat(m,host(s),s.requests,H),true); assert.equal(canChat(m,demoUser('other'),s.requests,H),false); assert.equal(canChat(m,guest(s),accepted().requests,H),false);
 for(const [delta,expected] of [[-90*minute-1,false],[-90*minute,true],[30*minute,true],[30*minute+1,false]]) assert.equal(isUrgent(m,H+delta),expected);
});
test('rebook crée seulement un brouillon prérempli ; auth et validation partenaire stubs',()=>{
 const s=attended(); const b=act(s,'rebook',{momentId:'m',startsAt:H+86400000,endsAt:H+90000000}); assert.equal(b.moments.length,s.moments.length); assert.equal(b.draft.neighborhood,s.moments[0].neighborhood); assert.equal(b.draft.hostId,'g');
 const p=act(base(),'partnerApply',{partner:{id:'new',owner:'g',gesture:'Un café',discountPercent:10,status:'valide'}}); assert.equal(p.partners[0].status,'en_revue');
 assert.equal(act(p,'partnerValidate',{partnerId:'new',actor:'h'}).partners[0].status,'valide');
 const sign=act(base(),'signIn',{user:{...demoUser('g'),absences:99}}); assert.equal(guest(sign).absences,0); assert.equal(sign.signedInId,'g');
});
test('seed : 10+ moments, 4 catégories, 2 urgents, partenaire validé et femmes uniquement',()=>{
 const {seedState}=load('src/domain/seed.ts');
 for(const now of [H,Date.parse('2026-03-29T00:30:00Z'),Date.parse('2026-10-25T01:30:00Z')]) {
 const s=seedState(now); assert.ok(s.moments.length>=10); assert.deepEqual([...new Set(s.moments.map(m=>m.category))].sort(),['Culture','Sport','Table','Verre']); assert.ok(s.moments.filter(m=>m.urgent&&isUrgent(m,now)).length>=2); assert.ok(s.moments.some(m=>m.femmesUniquement)); assert.equal(s.partners[0].status,'valide');
 for(const m of s.moments) assert.equal(load('src/domain/reducer.ts').validatePublication(initialState([],s.users,s.partners),m,s.users.find(u=>u.id===m.hostId),now),true);
 }
});
test('perte de priorité : les demandes passent après celles des invités prioritaires',()=>{
 const {requestsForHost}=load('src/domain/selectors.ts');
 let s=act(base(),'request',{momentId:'m',id:'r'});
 s=act(s,'request',{actor:'g2',momentId:'m',id:'r2',now:H-59*minute});
 guest(s).priority=false;
 assert.deepEqual(requestsForHost(s.moments[0],host(s),s.requests,s.users).map(r=>r.id),['r2','r']);
 assert.deepEqual(s.requests.map(r=>r.id),['r','r2']);
 assert.deepEqual(requestsForHost(s.moments[0],guest(s),s.requests,s.users),[]);
});
