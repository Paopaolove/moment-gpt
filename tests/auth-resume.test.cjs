const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const ts=require('typescript');
const load=require('./load.cjs');
const {reducer}=load('src/domain/reducer.ts');
const {seedState}=load('src/domain/seed.ts');

// Exercise the actual UI coordinator, including the stale pre-auth render.
function harness(){
  const now=Date.parse('2026-10-16T15:00:00Z');
  let state=seedState(now);
  const slots=[];
  let cursor=0;
  const hooks={
    useState(initial){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return [slots[i],v=>{slots[i]=typeof v==='function'?v(slots[i]):v}];},
    useRef(initial){const i=cursor++;if(!(i in slots))slots[i]={current:initial};return slots[i];},
    useReducer(){cursor++;return [{completed:true},()=>{}];},
    useEffect(){}
  };
  const store={useStore(){const user=state.users.find(u=>u.id===state.signedInId)??null;return {state,user,now,setNow(){},dispatch(action){state=reducer(state,action)},act(action){state=reducer(state,{...action,now,actor:action.actor??user?.id??'guest'})}}}};
  const module={exports:{}};
  const code=ts.transpileModule(fs.readFileSync('src/useJourney.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
  vm.runInNewContext(code,{module,exports:module.exports,require(id){if(id==='react')return hooks;if(id==='./store')return store;return load('src/'+id.replace('./','')+'.ts');}});
  return ()=>{cursor=0;return module.exports.useJourney();};
}
for(const [momentId,status] of [['moment-0','requested'],['moment-2','confirmed']]){
  test('Apple reprend automatiquement la demande : '+momentId,()=>{
    const render=harness();
    render().select(momentId);
    render().requestPlace();
    assert.equal(render().sheet,'auth');
    assert.equal(render().state.requests.length,0);
    render().auth();
    const result=render();
    assert.equal(result.user.id,'guest');
    assert.equal(result.sheet,'detail');
    assert.equal(result.request.momentId,momentId);
    assert.equal(result.request.status,status);
    assert.equal(result.state.requests.length,1);
    result.auth();
    assert.equal(render().state.requests.length,1,'l’intention reprise est consommée une seule fois');
  });
}

test('Apple reprend la navigation partenaire interrompue',()=>{
  const render=harness();
  const visitor=render();
  visitor.requireAccount(()=>visitor.setSheet('partner'));
  assert.equal(render().sheet,'auth');
  render().auth();
  assert.equal(render().sheet,'partner');
});
