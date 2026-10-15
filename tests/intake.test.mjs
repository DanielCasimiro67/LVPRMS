import test from 'node:test';
import assert from 'node:assert/strict';
import {seedState} from '../js/data.js';
const load=()=>import('../js/clinic.js').catch(()=>({}));
const actor={id:'nurse-elena',name:'Elena Lim'};
const now='2026-10-15T02:00:00.000Z';

test('RFID/manual identity matching never creates a visit, message or stock change',async()=>{
  const {identifyPatient}=await load();assert.equal(typeof identifyPatient,'function');
  const state=seedState();const before=structuredClone(state);
  assert.equal(identifyPatient(state,'2026-001').patient.id,'mara');
  assert.equal(identifyPatient(state,'RFID-1001').patient.id,'mara');
  assert.equal(identifyPatient(state,'missing').status,'unknown');
  state.patients.push({...state.patients[0],id:'another'});
  assert.equal(identifyPatient(state,'2026-001').status,'ambiguous');
  state.patients.pop();assert.deepEqual(state,before);
});
test('repeat intake resumes active work and new-patient drafts are stable without encounters',async()=>{
  const {startOrResumeVisit}=await load();assert.equal(typeof startOrResumeVisit,'function');
  const state=seedState();
  assert.equal(startOrResumeVisit(state,'mara',actor,now).visit.id,'mara-current');
  const first=startOrResumeVisit(state,'ana',actor,now);
  assert.equal(first.kind,'draft');
  assert.equal(startOrResumeVisit(state,'ana',actor,now).draft.id,first.draft.id);
  assert.equal(state.visits.length,2);assert.equal(state.messages.length,1);
});
test('registration enforces patient type, exact school ID collisions and explicit same-name recovery',async()=>{
  const {registerPatient}=await load();assert.equal(typeof registerPatient,'function');
  const state=seedState();
  const visitor=registerPatient(state,{name:'Jose Dela Cruz',type:'visitor',schoolId:'unwanted',grade:'unwanted'},actor,now);
  assert.ok(visitor.id);assert.equal(visitor.schoolId,undefined);assert.equal(visitor.grade,undefined);
  assert.throws(()=>registerPatient(state,{name:'Other',type:'student',schoolId:'2026-001'},actor,now),{code:'DUPLICATE_ID'});
  assert.throws(()=>registerPatient(state,{name:'Jose Dela Cruz',type:'visitor'},actor,now),{code:'POSSIBLE_DUPLICATE'});
  assert.throws(()=>registerPatient(state,{name:'Unknown',type:'doctor'},actor,now),{code:'INVALID_PATIENT'});
});
test('draft switching preserves work; invalid save leaves it untouched; valid save creates one ongoing visit',async()=>{
  const {startOrResumeVisit,saveIntakeDraft}=await load();assert.equal(typeof saveIntakeDraft,'function');
  const s=seedState();startOrResumeVisit(s,'ana',actor,now);const before=structuredClone(s);
  assert.throws(()=>saveIntakeDraft(s,'ana',{complaint:''},actor,now),{code:'COMPLAINT_REQUIRED'});assert.deepEqual(s,before);
  const v=saveIntakeDraft(s,'ana',{complaint:'Headache',state:'In progress'},actor,now);
  assert.equal(saveIntakeDraft(s,'ana',{complaint:'Improved',state:'Resting in clinic'},actor,now).id,v.id);
  assert.equal(s.visits.filter(v=>v.patientId==='ana').length,1);assert.equal(s.messages.length,1);
});
test('MIS merges by verified source key, preserves history/visitors, rotates cards and reports collisions',async()=>{
  const {mergeSchoolIdentities,identifyPatient}=await load();assert.equal(typeof mergeSchoolIdentities,'function');
  const s=seedState();const clinical=structuredClone(s.visits);const visitor=structuredClone(s.patients.find(p=>p.id==='ana'));
  const result=mergeSchoolIdentities(s,[{sourceId:'school-mara',schoolId:'2026-001',name:'Mara S. Santos',type:'student',grade:'Grade 12',section:'Faith',cards:['RFID-NEW']}],actor,now);
  assert.equal(result.conflicts.length,0);assert.equal(identifyPatient(s,'RFID-NEW').patient.id,'mara');
  assert.equal(identifyPatient(s,'RFID-1001').status,'unknown');
  assert.deepEqual(s.visits,clinical);assert.deepEqual(s.patients.find(p=>p.id==='ana'),visitor);
  const collision=mergeSchoolIdentities(s,[{sourceId:'different-person',schoolId:'2026-001',name:'Different',type:'staff',cards:[]}],actor,now);
  assert.equal(collision.conflicts.length,1);assert.equal(s.patients.find(p=>p.id==='mara').name,'Mara S. Santos');
});
test('follow-up notes require text and retain author/time',async()=>{
  const {addPatientNote}=await load();assert.equal(typeof addPatientNote,'function');
  const s=seedState();assert.throws(()=>addPatientNote(s,'mara',' ',actor,now));
  addPatientNote(s,'mara','Check on symptoms tomorrow.',actor,now);
  assert.equal(s.patients[0].notes[0].author,'Elena Lim');assert.equal(s.patients[0].notes[0].at,now);
});

test('school import rejects malformed rows and collisions with provisional school patients',async()=>{
  const {mergeSchoolIdentities,registerPatient}=await load();const s=seedState();
  s.schoolIdentities=[];
  registerPatient(s,{name:'Local student',type:'student',schoolId:'2026-777'},actor,now);
  const r=mergeSchoolIdentities(s,[null,{sourceId:'bad',schoolId:'x',name:'X',type:'student',cards:'not-an-array'},
    {sourceId:'foreign-staff',schoolId:'2026-777',name:'Other person',type:'staff',cards:[]}],actor,now);
  assert.equal(r.conflicts.length,3);assert.equal(s.patients.filter(p=>p.schoolId==='2026-777').length,1);
});

test('search is category-correct and partial names never auto-select a patient',async()=>{
  const {searchPatients}=await load();const s=seedState();
  assert.deepEqual(searchPatients(s,{type:'student'}).map(p=>p.id),['mara']);
  assert.deepEqual(searchPatients(s,{type:'staff'}).map(p=>p.id),['leo']);
  assert.deepEqual(searchPatients(s,{type:'visitor'}).map(p=>p.id),['ana']);
  assert.equal(searchPatients(s,{query:'SANT'}).length,1);assert.equal(searchPatients(s,{query:'absent'}).length,0);
});

test('ambiguous card recovery lists every matching record for explicit selection',async()=>{
  const {identityRecords,searchPatients}=await load();const s=seedState();s.schoolIdentities=identityRecords(s);
  for(const r of s.schoolIdentities)r.cards.push('RFID-SHARED');
  assert.deepEqual(searchPatients(s,{query:'RFID-SHARED'}).map(p=>p.id),['mara','leo']);
});

test('a bookmarked new-visit entry resolves saved active work instead of displaying a blank form',async()=>{
  const {getIntakeEntry}=await load();assert.equal(typeof getIntakeEntry,'function');
  const s=seedState();assert.equal(getIntakeEntry(s,'new','mara').entry.complaint,'Headache');
  s.drafts.mara={complaint:'Kept draft',state:'In progress',dirty:true};
  assert.equal(getIntakeEntry(s,'new','mara').entry.complaint,'Kept draft');
});

test('a linked identity cannot take the school ID of a different provisional patient',async()=>{
  const {mergeSchoolIdentities,registerPatient,identityRecords}=await load();const s=seedState();
  s.schoolIdentities=identityRecords(s);
  registerPatient(s,{name:'Different student',type:'student',schoolId:'2026-777'},actor,now);
  const before=structuredClone(s.patients);
  const result=mergeSchoolIdentities(s,[{sourceId:'school-mara',schoolId:'2026-777',name:'Mara Santos',type:'student',cards:['RFID-NEW']}],actor,now);
  assert.equal(result.updated,0);assert.equal(result.conflicts.length,1);
  assert.deepEqual(s.patients,before);
  assert.equal(s.patients.filter(p=>p.schoolId==='2026-777').length,1);
});

test('a provisional school match requires reconciliation before relabeling clinical history',async()=>{
  const {mergeSchoolIdentities,registerPatient,saveIntakeDraft,identityRecords}=await load();const s=seedState();
  s.schoolIdentities=identityRecords(s);
  const p=registerPatient(s,{name:'Wrong local person',type:'student',schoolId:'2026-888'},actor,now);
  saveIntakeDraft(s,p.id,{complaint:'Fictional visit',state:'In progress'},actor,now);
  const patients=structuredClone(s.patients),visits=structuredClone(s.visits);
  const result=mergeSchoolIdentities(s,[{sourceId:'new-school-person',schoolId:'2026-888',name:'Completely different person',type:'student',cards:[]}],actor,now);
  assert.equal(result.updated,0);assert.equal(result.conflicts.length,1);
  assert.deepEqual(s.patients,patients);assert.deepEqual(s.visits,visits);
});

test('follow-up edits preserve original authorship and every prior version',async()=>{
  const {addPatientNote,editPatientNote}=await load();assert.equal(typeof editPatientNote,'function');
  const s=seedState();addPatientNote(s,'ana','Original note',actor,now);
  const note=s.patients.find(p=>p.id==='ana').notes[0];
  const later='2026-10-15T03:00:00.000Z',editor={name:'Nina Reyes'};
  editPatientNote(s,'ana',note.id,'Corrected note',editor,later);
  assert.equal(note.text,'Corrected note');assert.equal(note.author,actor.name);assert.equal(note.at,now);
  assert.equal(note.updatedBy,editor.name);assert.equal(note.updatedAt,later);
  assert.deepEqual(note.revisions,[{text:'Original note',author:actor.name,at:now}]);
  const before=structuredClone(s);
  assert.throws(()=>editPatientNote(s,'ana',note.id,'  ',editor,later),{code:'NOTE_REQUIRED'});
  assert.throws(()=>editPatientNote(s,'mara',note.id,'Wrong patient',editor,later),{code:'NOTE_MISSING'});
  assert.deepEqual(s,before);
  editPatientNote(s,'ana',note.id,'Second correction',actor,'2026-10-15T04:00:00.000Z');
  assert.deepEqual(note.revisions[1],{text:'Corrected note',author:editor.name,at:later});
});

test('patient history offers recorded complaint options and filters exact complaints',async()=>{
  const {recordView,historyRows}=await import('../js/views/patients.js');
  const s=seedState(),p=s.patients[0];
  s.visits.push({...s.visits[0],id:'other-headache',complaint:'Severe headache'});
  s.visits.push({...s.visits[0],id:'same-headache',complaint:' headache '});
  const html=recordView(s,p,'#/patients');
  assert.match(html,/<select[^>]*name="history-complaint"/);
  assert.match(html,/<option value="">All complaints<\/option>/);
  assert.equal((html.match(/<option value="Headache">/g)||[]).length,1);
  const filtered=historyRows(s,p,{complaint:'Headache'});
  assert.match(filtered,/mara-current/);assert.match(filtered,/same-headache/);assert.doesNotMatch(filtered,/other-headache/);
});

test('note edits reject stale or failed storage writes without partial history or clinical effects',async()=>{
  const {createRepository}=await import('../js/store.js');const {addPatientNote,editPatientNote}=await load();
  let raw=null,fail=false;const storage={getItem:()=>raw,setItem:(_,value)=>{if(fail)throw Error('Full');raw=value;}};
  const repo=createRepository({storage,seed:seedState});
  repo.commit(s=>addPatientNote(s,'ana','Original',actor,now),0);
  const stale=repo.readState(),noteId=stale.patients.find(p=>p.id==='ana').notes[0].id;
  repo.commit(s=>editPatientNote(s,'ana',noteId,'Newer correction',actor,now),stale.revision);
  const saved=repo.readState();
  assert.throws(()=>repo.commit(s=>editPatientNote(s,'ana',noteId,'Stale correction',actor,now),stale.revision),{code:'STALE_REVISION'});
  fail=true;
  assert.throws(()=>repo.commit(s=>editPatientNote(s,'ana',noteId,'Unsaved correction',actor,now),saved.revision),{code:'SAVE_FAILED'});
  assert.deepEqual(repo.readState(),saved);
  for(const field of ['visits','messages','inventory'])assert.deepEqual(saved[field],stale[field]);
});
