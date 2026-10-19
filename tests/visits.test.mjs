import test from 'node:test';
import assert from 'node:assert/strict';
import {seedState} from '../js/data.js';
import {createRepository} from '../js/store.js';
import * as care from '../js/visits.js';
const nurse={name:'Elena Lim'},at='2026-10-18T01:00:00Z';
const input={patientId:'ana',complaintChoice:'Headache',state:'In progress'};
function setup(){let raw=null,fail=false;const repo=createRepository({seed:seedState,storage:{getItem:()=>raw,setItem:(_,v)=>{if(fail)throw Error('Full');raw=v;}}});return {repo,fail:()=>fail=true};}
test('stale care save is rejected before any visit, email or inventory mutation',()=>{
 const {repo}=setup();repo.commit(()=>{},0);const old=repo.readState();repo.commit(()=>{},old.revision);const latest=repo.readState();
 assert.throws(()=>repo.commit(s=>care.saveVisit(s,input,nurse,at),old.revision),{code:'STALE_REVISION'});assert.deepEqual(repo.readState(),latest);
});
test('care saves required patient, complaint and ongoing state only, never stock or mail',()=>{
 const s=seedState(),before=structuredClone({messages:s.messages,inventory:s.inventory});
 const v=care.saveVisit(s,input,nurse,at);assert.equal(v.state,'In progress');assert.equal(v.temperature,null);assert.deepEqual(v.supplies,[]);
 assert.equal(care.saveVisit(s,{...input,assessment:'Resting'},nurse,at).id,v.id);assert.equal(s.visits.filter(v=>v.patientId==='ana').length,1);
 assert.deepEqual({messages:s.messages,inventory:s.inventory},before);
});
test('invalid required values, Other, vitals and supplies never mutate saved records',()=>{
 for(const values of [{patientId:''},{complaintChoice:''},{complaintChoice:'Other',otherComplaint:' '},{state:''},{state:'Completed'},{temperature:'Infinity'},{pulse:'no'},{bp:'wrong'},{supplies:[{itemId:'gauze',quantity:0}]}]){
  const s=seedState(),before=structuredClone(s);assert.throws(()=>care.saveVisit(s,{...input,...values},nurse,at));assert.deepEqual(s,before);
 }
});
test('all four dispositions complete any patient type with one pending immutable email event',()=>{
 for(const patientId of ['mara','leo','ana'])for(const outcome of ['Returned to class/work','Left clinic after treatment','Sent home','Referred to an external facility']){
  const s=seedState(),stock=structuredClone(s.inventory);let v=care.saveVisit(s,{...input,patientId},nurse,at);
  v=care.completeVisit(s,{...input,patientId,visitId:v.id,outcome},nurse,at);const m=s.messages.find(m=>m.visitId===v.id&&m.kind==='nurse-summary');
  assert.equal(v.state,'Completed');assert.equal(m.status,'pending');assert.match(m.body,new RegExp(outcome));
  care.completeVisit(s,{...input,patientId,visitId:v.id,outcome},nurse,at);assert.equal(s.messages.filter(m=>m.visitId===v.id).length,1);assert.deepEqual(s.inventory,stock);
 }
});
test('invalid or failed completion leaves visit, messages and draft intact',()=>{
 const {repo,fail}=setup();repo.commit(s=>care.saveVisit(s,input,nurse,at),0);const before=repo.readState(),visitId=before.visits.find(v=>v.patientId==='ana').id;
 assert.throws(()=>repo.commit(s=>care.completeVisit(s,{...input,visitId},nurse,at),before.revision),{code:'OUTCOME_REQUIRED'});
 fail();assert.throws(()=>repo.commit(s=>care.completeVisit(s,{...input,visitId,outcome:'Sent home'},nurse,at),before.revision),{code:'SAVE_FAILED'});assert.deepEqual(repo.readState(),before);
});
test('corrections require a reason, preserve identity/outcome/audit and never rewrite original email',()=>{
 const s=seedState(),v=care.completeVisit(s,{...input,outcome:'Sent home',assessment:'Original'},nurse,at),before=structuredClone(s);
 assert.throws(()=>care.correctVisit(s,v.id,{...input,assessment:'Corrected'},'',nurse,at));assert.deepEqual(s,before);
 assert.throws(()=>care.correctVisit(s,v.id,{...input,patientId:'mara'},'Wrong identity',{name:'Nina Reyes'},at));
 const email=structuredClone(s.messages);care.correctVisit(s,v.id,{...input,state:'Completed',outcome:'Sent home',assessment:'Corrected',temperature:'36.8',supplies:[{itemId:'gauze',quantity:2}]},'Clarify assessment',{name:'Nina Reyes'},at);
 assert.equal(v.patientId,'ana');assert.equal(v.state,'Completed');assert.equal(v.assessment,'Corrected');assert.equal(v.loggedBy,'Elena Lim');assert.equal(v.revisions[0].before.assessment,'Original');assert.equal(v.revisions[0].reason,'Clarify assessment');assert.equal(v.revisions[0].author,'Nina Reyes');assert.deepEqual(s.messages,email);
});
test('later attendance creates a distinct visit; duplicate active encounters are rejected',()=>{
 const s=seedState(),v=care.completeVisit(s,{...input,outcome:'Sent home'},nurse,at),next=care.saveVisit(s,input,nurse,at);assert.notEqual(next.id,v.id);
 s.visits.push({...next,id:'duplicate'});const before=structuredClone(s);assert.throws(()=>care.saveVisit(s,input,nurse,at));assert.deepEqual(s,before);
});
test('visit screens render BRD fields, truthful pending mail and correction history',async()=>{
 const {visitView,completionView,completedView}=await import('../js/views/visits.js');const s=seedState(),p=s.patients[2];
 const form=visitView(s,p,{});assert.match(form,/Other complaint/);assert.match(form,/Allergy: Not recorded/);assert.match(form,/Blood type: Not recorded/);assert.doesNotMatch(form,/severity|No recorded allergies/);
 assert.match(completionView(p,{...input}),/nurse/);assert.match(completionView(p,input),/Continue care/);
 const v=care.completeVisit(s,{...input,outcome:'Sent home'},nurse,at);care.correctVisit(s,v.id,{...input,state:'Completed',outcome:'Sent home',assessment:'Correction'},'Clarify',nurse,at);
 const result=completedView(s,p,v);assert.match(result,/Email pending/);assert.match(result,/Correction history/);assert.match(result,/View in Messages/);
});
test('an unsaved encounter identifier makes double completion idempotent',()=>{
 const s=seedState();s.drafts.ana={id:'ana-draft',patientId:'ana'};const request={...input,visitId:'ana-draft',outcome:'Sent home'};
 const first=care.completeVisit(s,request,nurse,at);const repeated=care.completeVisit(s,request,nurse,at);
 assert.equal(repeated.id,first.id);assert.equal(s.visits.filter(v=>v.patientId==='ana').length,1);assert.equal(s.messages.filter(m=>m.visitId===first.id).length,1);
});
test('a leftover unsaved draft cannot create a second active encounter',()=>{
 for(const operation of [care.saveVisit,care.completeVisit]){
  const s=seedState();s.drafts.mara={id:'old-draft',patientId:'mara'};const before=structuredClone(s);
  assert.throws(()=>operation(s,{...input,patientId:'mara',visitId:'old-draft',outcome:'Sent home'},nurse,at),{code:'AMBIGUOUS_VISIT'});assert.deepEqual(s,before);
 }
});
