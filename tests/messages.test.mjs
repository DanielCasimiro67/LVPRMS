import test from 'node:test';
import assert from 'node:assert/strict';
import {seedState} from '../js/data.js';
import {createRepository} from '../js/store.js';
import {completeVisit,correctVisit,saveVisit} from '../js/visits.js';
import {buildNurseSummary,createMessageService,recordManualFollowUp} from '../js/messages.js';
const actor={name:'Elena Lim'},now='2026-10-18T03:00:00Z';
const input={patientId:'ana',complaintChoice:'Headache',state:'In progress',outcome:'Sent home'};
function setup(delivery='sent',recipient='nurse@example.com'){
 let raw=null,fail=false;const repo=createRepository({seed:seedState,storage:{getItem:()=>raw,setItem:(_,v)=>{if(fail)throw Error('Full');raw=v;}}});
 let id;repo.commit(s=>{s.demo={delivery,nurseEmail:recipient};const v=completeVisit(s,input,actor,now);id=s.messages.find(m=>m.visitId===v.id).id;},0);
 return {repo,id,service:createMessageService({repository:repo,now:()=>now}),fail:()=>fail=true};
}
test('stale message retry is rejected before changing attempts or the completed visit',()=>{
 const {repo,id,service}=setup('failed');service.processMessage(id);const old=repo.readState();repo.commit(()=>{},old.revision);const current=repo.readState();
 assert.throws(()=>service.retryMessage(id,old.revision),{code:'STALE_REVISION'});assert.deepEqual(repo.readState(),current);
});
test('summary includes saved facts only, for all patient types and dispositions; corrections keep snapshot',()=>{
 for(const patientId of ['mara','leo','ana'])for(const outcome of ['Returned to class/work','Left clinic after treatment','Sent home','Referred to an external facility']){
 const s=seedState(),v=completeVisit(s,{...input,patientId,outcome,assessment:'Rest advised',temperature:'36.8',supplies:[{itemId:'gauze',quantity:2}]},actor,now),m=s.messages.at(-1);
 assert.deepEqual(buildNurseSummary(s,v),{subject:m.subject,body:m.body});assert.match(m.body,/Rest advised/);assert.match(m.body,/Gauze/);assert.doesNotMatch(m.body,/Pulse|undefined|null/);assert.equal(m.recipient,'nurse@example.com');
 const snapshot=structuredClone(m);correctVisit(s,v.id,{...input,patientId,outcome,state:'Completed',assessment:'Updated'},'Clarify',actor,now);assert.deepEqual(s.messages.at(-1),snapshot);
 }
});
test('pending then accepted result is persisted once; repeat processing and retry cannot send again',()=>{
 const {repo,id,service}=setup();assert.equal(repo.readState().messages.at(-1).status,'pending');service.processMessage(id);const first=repo.readState();assert.equal(first.messages.at(-1).status,'sent');assert.equal(first.messages.at(-1).attempts.length,1);
 service.processMessage(id);service.retryMessage(id,first.revision);assert.deepEqual(repo.readState(),first);
});
test('failed retry updates same event, appends attempts, and leaves visit saved',()=>{
 const {repo,id,service}=setup('failed');service.processMessage(id);let s=repo.readState();assert.equal(s.messages.at(-1).status,'failed');const visits=structuredClone(s.visits);
 repo.commit(s=>s.demo.delivery='sent',s.revision);service.retryMessage(id,repo.readState().revision);s=repo.readState();assert.equal(s.messages.at(-1).status,'sent');assert.equal(s.messages.at(-1).attempts.length,2);assert.equal(s.messages.filter(m=>m.id===id).length,1);assert.deepEqual(s.visits,visits);
});
test('pending refresh/check reuses the same attempt rather than creating a new send',()=>{
 const {repo,id,service}=setup('pending');service.processMessage(id);const first=repo.readState().messages.at(-1).attempts[0];
 createMessageService({repository:repo,now:()=>now}).processMessage(id);assert.equal(repo.readState().messages.at(-1).attempts.length,1);
 repo.commit(s=>s.demo.delivery='sent',repo.readState().revision);service.processMessage(id);assert.equal(repo.readState().messages.at(-1).attempts[0].id,first.id);assert.equal(repo.readState().messages.at(-1).status,'sent');
});
test('missing or non-example address prevents sending and can be recovered explicitly',()=>{
 for(const address of ['', 'real@school.edu']){const {repo,id,service}=setup('sent',address);service.processMessage(id);let s=repo.readState();assert.equal(s.messages.at(-1).status,'missing-recipient');assert.equal(s.messages.at(-1).attempts.length,0);assert.equal(s.visits.at(-1).state,'Completed');repo.commit(s=>s.demo.nurseEmail='nurse@example.com',s.revision);service.retryMessage(id,repo.readState().revision);assert.equal(repo.readState().messages.at(-1).status,'sent');}
});
test('manual follow-up rejects blank, appends author/time and does not claim email success',()=>{
 const {repo,id,service}=setup('failed');service.processMessage(id);let s=repo.readState();assert.throws(()=>recordManualFollowUp(s,id,'  ',actor,now),{code:'NOTE_REQUIRED'});
 repo.commit(s=>recordManualFollowUp(s,id,'Called the nurse.',actor,now),s.revision);s=repo.readState();assert.equal(s.messages.at(-1).status,'failed');assert.deepEqual(s.messages.at(-1).followUps,[{note:'Called the nurse.',author:actor.name,at:now}]);
});
test('storage failure cannot persist partial delivery results or lose the completed visit',()=>{
 const {repo,id,service,fail}=setup();const before=repo.readState();fail();assert.throws(()=>service.processMessage(id),{code:'SAVE_FAILED'});assert.deepEqual(repo.readState(),before);
});
test('ordinary saves produce no summaries and concerned-party examples are never auto processed',()=>{
 const s=seedState();saveVisit(s,input,actor,now);assert.equal(s.messages.filter(m=>m.kind==='nurse-summary').length,0);
 const {repo,service}=setup();const before=structuredClone(repo.readState().messages[0]);service.processMessage(before.id);assert.deepEqual(repo.readState().messages[0],before);
});
test('concerned-party retry keeps a minimal update without clinical summary disclosure',()=>{
 const {repo,service}=setup();service.retryMessage('adviser-update',repo.readState().revision);const m=repo.readState().messages[0];
 assert.equal(m.status,'sent');assert.match(m.body,/contact the clinic/);assert.doesNotMatch(m.body,/Assessment|Temperature|Treatment|Outcome/);assert.equal(m.recipient,'adviser@example.com');
});
test('a concerned-party pending attempt can be checked explicitly without a second send',()=>{
 const {repo,service}=setup('pending');service.retryMessage('adviser-update',repo.readState().revision);assert.equal(repo.readState().messages[0].status,'pending');
 repo.commit(s=>s.demo.delivery='sent',repo.readState().revision);service.processMessage('adviser-update',repo.readState().revision);const m=repo.readState().messages[0];assert.equal(m.status,'sent');assert.equal(m.attempts.length,1);
});
test('message views escape saved content and provide inbox filters, attempt history and visit navigation',async()=>{
 const {messagesView,messageView}=await import('../js/views/messages.js');const {repo}=setup();const s=repo.readState(),m=s.messages.at(-1);m.body='<img src=x onerror=alert(1)>';
 assert.match(messagesView(s,new URLSearchParams()),/Nurse visit summaries/);assert.match(messagesView(s,new URLSearchParams('status=sent')),/No messages match/);
 const html=messageView(s,m);assert.match(html,/&lt;img/);assert.doesNotMatch(html,/<img src=x/);assert.match(html,/Sending attempts/);assert.match(html,/View visit/);assert.match(html,/Record manual follow-up/);
});
