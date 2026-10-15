import test from 'node:test';
import assert from 'node:assert/strict';

const memory = () => {
  const values = new Map();
  return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};
};
const seed = () => ({schemaVersion:1,revision:0,patients:[],visits:[],drafts:{},messages:[],referrals:[],inventory:[],audit:[]});

test('stale revision is rejected before a second writer can change saved data', async () => {
  const {createRepository} = await import('../js/store.js').catch(()=>({}));
  assert.equal(typeof createRepository,'function','Repository must expose createRepository for the stale-revision check');
  const storage=memory();
  const first=createRepository({storage,seed,key:'test'});
  const second=createRepository({storage,seed,key:'test'});
  const stale=second.readState();
  first.commit(s=>{s.audit.push({action:'first'});},0);
  assert.throws(()=>second.commit(s=>{s.audit.push({action:'stale'});},stale.revision),{code:'STALE_REVISION'});
  assert.equal(first.readState().revision,1);
  assert.deepEqual(first.readState().audit,[{action:'first'}]);
});

test('failed storage commit leaves previous state intact and returns a recoverable error',async()=>{
  const {createRepository}=await import('../js/store.js');
  const storage=memory();const repo=createRepository({storage,seed,key:'test'});
  repo.commit(s=>s.audit.push({action:'saved'}),0);
  storage.setItem=()=>{throw new Error('Quota exceeded');};
  assert.throws(()=>repo.commit(s=>s.audit.push({action:'unsaved'}),1),{code:'SAVE_FAILED'});
  assert.deepEqual(repo.readState().audit,[{action:'saved'}]);
});

test('corrupt and incompatible saved data is retained without silent reset',async()=>{
  const {createRepository}=await import('../js/store.js');
  for(const value of ['{broken',JSON.stringify({...seed(),schemaVersion:99}),JSON.stringify({...seed(),visits:null})]){
    const storage=memory();storage.setItem('test',value);
    const repo=createRepository({storage,seed,key:'test'});
    assert.throws(()=>repo.readState(),{code:'INVALID_DATA'});
    assert.equal(storage.getItem('test'),value);
  }
});

test('unavailable storage is distinguished from an empty clinic database',async()=>{
  const {createRepository}=await import('../js/store.js');
  const repo=createRepository({storage:{getItem(){throw new Error('Blocked');}},seed});
  assert.throws(()=>repo.readState(),{code:'READ_FAILED'});
});

test('reads are detached and invalid changes never alter stored data',async()=>{
  const {createRepository}=await import('../js/store.js');
  const repo=createRepository({storage:memory(),seed});
  const view=repo.readState();view.audit.push({action:'not saved'});
  assert.deepEqual(repo.readState().audit,[]);
  assert.throws(()=>repo.commit(s=>{s.visits=null;},0),{code:'INVALID_DATA'});
  assert.equal(repo.readState().revision,0);
});

test('demonstration sessions allow only nurse/assistant accounts and expire at the inactivity boundary',async()=>{
  const {createSessionService}=await import('../js/services.js').catch(()=>({}));
  assert.equal(typeof createSessionService,'function');
  let time=1000;const storage=memory();const service=createSessionService({storage,now:()=>time,timeoutMs:100});
  await assert.rejects(service.signIn('admin','clinic-demo'));
  await assert.rejects(service.signIn('elena.lim','wrong'));
  await service.signIn('elena.lim','clinic-demo');
  assert.equal(service.requireSession().role,'School nurse');
  time=1099;assert.ok(service.current());
  time=1100;assert.equal(service.current(),null);
  assert.throws(()=>service.requireSession(),{code:'AUTH_REQUIRED'});
  await service.signIn('nina.reyes','clinic-demo');assert.equal(service.current().role,'Nursing assistant');
  service.signOut();assert.equal(service.current(),null);
});

test('password simulation validates current and confirmation values without storing any passwords',async()=>{
  const {createSessionService}=await import('../js/services.js').catch(()=>({}));
  assert.equal(typeof createSessionService,'function');
  const storage=memory();const service=createSessionService({storage});
  await service.signIn('elena.lim','clinic-demo');
  await assert.rejects(service.changePassword('wrong','NewClinic!123','NewClinic!123'));
  await assert.rejects(service.changePassword('clinic-demo','NewClinic!123','different'));
  await service.changePassword('clinic-demo','NewClinic!123','NewClinic!123');
  const saved=storage.getItem('lvcc.session.v1');
  assert.ok(!saved.includes('clinic-demo')&&!saved.includes('NewClinic!123'));
  service.signOut();
  await assert.rejects(service.signIn('elena.lim','clinic-demo'));
  await service.signIn('elena.lim','NewClinic!123');
  assert.equal(service.current().username,'elena.lim');
});

test('revision is checked again after a mutator so a nested newer save cannot be overwritten',async()=>{
  const {createRepository}=await import('../js/store.js');
  const storage=memory();const repo=createRepository({storage,seed});
  assert.throws(()=>repo.commit(s=>{
    repo.commit(newer=>newer.audit.push({action:'newer'}),0);
    s.audit.push({action:'old'});
  },0),{code:'STALE_REVISION'});
  assert.deepEqual(repo.readState().audit,[{action:'newer'}]);
});

test('sign-out conceals the session even if browser removal is unavailable',async()=>{
  const {createSessionService}=await import('../js/services.js');
  const storage=memory();const service=createSessionService({storage});
  await service.signIn('elena.lim','clinic-demo');
  storage.removeItem=()=>{throw new Error('Blocked');};
  service.signOut();assert.equal(service.current(),null);
});

test('all live Figma screens have a route and all four guide frames are accounted for',async()=>{
  const {readFile}=await import('node:fs/promises');
  const inventory=JSON.parse(await readFile(new URL('../docs/figma-screen-inventory.json',import.meta.url),'utf8'));
  assert.equal(inventory.nodes.filter(n=>n.kind==='screen').length,348);
  assert.equal(inventory.nodes.filter(n=>n.kind==='guide').length,4);
  assert.equal(new Set(inventory.nodes.map(n=>n.id)).size,352);
  assert.ok(inventory.nodes.every(n=>n.route&&n.textCount>0&&n.inspection));
});

test('browser UI and route modules import in Node and escape patient-provided text',async()=>{
  const {escapeHtml}=await import('../js/ui.js');
  const {parseRoute}=await import('../js/routes.js');
  const {seedState}=await import('../js/data.js');
  assert.equal(escapeHtml('<img onerror="bad">'), '&lt;img onerror=&quot;bad&quot;&gt;');
  assert.equal(parseRoute('#/patients?type=student').params.get('type'),'student');
  assert.equal(seedState().patients.length,3);
});
