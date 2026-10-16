const {test}=require('node:test');
const assert=require('node:assert/strict');
const load=require('./load.cjs');
const r=load('src/domain/rules.ts');
const {initialState,reducer}=load('src/domain/reducer.ts');
const {seed}=load('src/domain/seed.ts');
const t=Date.UTC(2026,9,15,16);
test('Funky : Nuit, quatre sous-types, horaires crédibles et Paris intramuros',()=>{
 const nights=seed(t).filter(m=>m.category==='Nuit');
 assert.deepEqual(nights.map(m=>m.subtype),['Bal','Karaoké','Club','Guinguette']);
 assert.deepEqual(nights.map(m=>new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',hour:'2-digit',minute:'2-digit'}).format(m.startsAt)),['21:00','21:30','23:30','18:00']);
 for(const m of nights) assert.equal(r.validateMoment(m,t),null);
});
test('Funky : gratuit et quatre places acceptés, plafond inchangé',()=>{
 const m={...seed(t)[0],price:0,seats:4};
 assert.equal(r.validateMoment(m,t),null);
 assert.equal(r.validateMoment({...m,price:5000},t),null);
 for(const patch of [{price:5001},{price:-1},{seats:5},{seats:0}]) assert.ok(r.validateMoment({...m,...patch},t));
 assert.equal(r.RULES.pricePills[0],0);
});
test('Funky : délai figé à acceptation, cinq minutes urgentes, dix sinon',()=>{
 for(const [offset,minutes] of [[90*60000,5],[90*60000+1,10],[-30*60000,5]]){
 const m={...seed(t)[0],id:'a',startsAt:t+offset};
 let s=initialState([m]);
 s=reducer(s,{type:'request',id:'a',actor:'me',now:t});
 s=reducer(s,{type:'accept',id:'a',actor:m.hostId,now:t});
 assert.equal(s.bookings[0].confirmationMinutes,minutes);
 assert.equal(r.confirmationRemaining(t,t,minutes),minutes*60);
 assert.equal(reducer(s,{type:'confirm',id:'a',actor:'me',now:t+minutes*60000-1}).bookings[0].status,'confirmed');
 assert.equal(reducer(s,{type:'confirm',id:'a',actor:'me',now:t+minutes*60000}).bookings[0].status,'expired');
 }
});
test('Funky : troisième présence datée gagne un seul joker, deux utilisations maximum et renouvellement',()=>{
 const month=r.monthKey(t);const m={...seed(t)[0],id:'a'};
 let s=initialState([m]);
 const present=Array.from({length:6},(_,i)=>({momentId:`past-${i}`,guestId:'me',status:'present',presentAt:t,deposit:'released'}));
 const confirmed={momentId:'a',guestId:'me',status:'confirmed',deposit:'held'};
 assert.equal(r.jokerBalance(present.slice(0,2),[],t).total,1);
 assert.equal(r.jokerBalance(present.slice(0,3),[],t).total,2);
 s={...s,bookings:[...present,confirmed],jokerMonths:[month]};
 s=reducer(s,{type:'joker',id:'a',actor:'me',now:t});
 assert.equal(s.bookings.at(-1).deposit,'released');assert.equal(s.jokerMonths.length,2);
 assert.equal(r.jokerBalance(s.bookings,s.jokerMonths,t).remaining,0);
 const exhausted={...s,bookings:[...present,confirmed]};
 assert.equal(reducer(exhausted,{type:'joker',id:'a',actor:'me',now:t}),exhausted);
 assert.equal(r.jokerBalance(present,s.jokerMonths,Date.UTC(2026,10,1)).remaining,1);
 assert.equal(r.jokerBalance([{...present[0],presentAt:undefined}],[],t).presences,0);
});
