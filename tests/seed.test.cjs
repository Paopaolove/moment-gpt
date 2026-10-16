const {test}=require('node:test');
const assert=require('node:assert/strict');
const load=require('./load.cjs');
const {seed,seedState}=load('src/domain/seed.ts');
const {isUrgent}=load('src/domain/selectors.ts');
const {parisDay,parisTime,nextSlot,offerHours}=load('src/domain/parisTime.ts');
const clock=t=>new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Paris',hour:'2-digit',minute:'2-digit'}).format(t);
test('seed : identifiants uniques, Paris intramuros et urgent à toute heure',()=>{
 for(const date of ['2026-10-15','2026-10-25','2026-03-29']) for(let h=0;h<24;h++){
 const now=Date.parse(`${date}T${String(h).padStart(2,'0')}:33:00Z`);const moments=seed(now);
 assert.equal(new Set(moments.map(m=>m.id)).size,moments.length);
 assert.ok(moments.some(m=>isUrgent(m,now)));
 assert.ok(moments.every(m=>m.district>=1&&m.district<=20&&m.endsAt>m.startsAt));
 assert.ok(moments.filter(m=>!m.urgent).every(m=>m.startsAt>now));
 const state=seedState(now);assert.ok(moments.every(m=>state.users.some(u=>u.id===m.hostId)));
 }
});
test('créneaux futurs et conversion été/hiver en heure de Paris',()=>{
 for(const day of ['2026-01-15','2026-07-15','2026-10-25','2026-03-29']){
 assert.equal(clock(parisTime(day,'20:30')),'20:30');const now=parisTime(day,'23:45');const slot=nextSlot(now,offerHours);
 assert.ok(slot>now);assert.notEqual(parisDay(slot),day);assert.equal(clock(slot),'08:00');
 }
});
