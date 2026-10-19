import test from 'node:test';
import assert from 'node:assert/strict';
import {seedState} from '../js/data.js';
import {createRepository} from '../js/store.js';
import {prepareReferral,appendReferralActivity} from '../js/referrals.js';
import {saveVisit,completeVisit} from '../js/visits.js';
const actor={name:'Elena Lim'},now='2026-10-19T04:00:00Z';
const prep={reason:'Persistent headache',destination:'Dr. Alex Garcia',notes:'Symptoms continue after rest.'};
const contact={id:'contact-one',kind:'contact',doctor:'Dr. Alex Garcia',occurredAt:'2026-10-19T02:00:00Z',result:'sent',notes:'Sent assessment through Messenger.'};
const reply={id:'reply-one',kind:'reply',doctor:'Dr. Alex Garcia',occurredAt:'2026-10-19T02:20:00Z',advice:'Continue observation.',nextAction:'Observe in clinic.'};
function setup(){let raw=null,fail=false;const repo=createRepository({seed:seedState,storage:{getItem:()=>raw,setItem:(_,v)=>{if(fail)throw Error('Full');raw=v;}}});let id;repo.commit(s=>{s.referrals=[];id=prepareReferral(s,'mara-current',prep,actor,now).id;},0);return {repo,id,fail:()=>fail=true};}
test('stale referral update rejects before changing clinical or follow-up data',()=>{const {repo,id}=setup(),old=repo.readState();repo.commit(()=>{},old.revision);const latest=repo.readState();assert.throws(()=>repo.commit(s=>appendReferralActivity(s,id,contact,actor,now),old.revision),{code:'STALE_REVISION'});assert.deepEqual(repo.readState(),latest);});
test('preparation requires saved visit and reason; creates one Prepared referral without implying contact',()=>{
 const s=seedState();s.referrals=[];const before=structuredClone(s);assert.throws(()=>prepareReferral(s,'missing',prep,actor,now));assert.throws(()=>prepareReferral(s,'mara-current',{reason:' '},actor,now));assert.deepEqual(s,before);
 const v=structuredClone(s.visits),mail=structuredClone(s.messages),r=prepareReferral(s,'mara-current',prep,actor,now);assert.equal(r.state,'Prepared');assert.deepEqual(r.activities,[]);assert.equal(prepareReferral(s,'mara-current',prep,actor,now).id,r.id);assert.equal(s.referrals.length,1);assert.deepEqual(s.visits,v);assert.deepEqual(s.messages,mail);
});
test('failed contact attempt stays Prepared; actual Messenger contact waits for reply and keeps history',()=>{
 const {repo,id}=setup();repo.commit(s=>{appendReferralActivity(s,id,{...contact,id:'not-reached',result:'not-reached'},actor,now);assert.equal(s.referrals[0].state,'Prepared');appendReferralActivity(s,id,contact,actor,now);},1);const r=repo.readState().referrals[0];assert.equal(r.state,'Awaiting doctor reply');assert.equal(r.activities.length,2);assert.equal(r.activities[1].source,'Messenger');assert.equal(r.activities[1].author,actor.name);
});
test('contact and reply require source, time, advice and planned action without inventing doctor approval',()=>{
 const {repo,id}=setup();const s=repo.readState();for(const patch of [{doctor:''},{occurredAt:''},{occurredAt:'2099-01-01T00:00:00Z'},{occurredAt:'yesterday'},{result:''}])assert.throws(()=>appendReferralActivity(s,id,{...contact,...patch},actor,now));
 assert.throws(()=>appendReferralActivity(s,id,reply,actor,now));appendReferralActivity(s,id,contact,actor,now);const before=structuredClone(s);for(const patch of [{doctor:''},{occurredAt:''},{occurredAt:'2026-10-19T01:00:00Z'},{advice:' '},{nextAction:''}]){assert.throws(()=>appendReferralActivity(s,id,{...reply,...patch},actor,now));assert.deepEqual(s,before);}
 appendReferralActivity(s,id,reply,{name:'Nina Reyes'},now);assert.equal(s.referrals[0].state,'Advice received');assert.equal(s.referrals[0].activities.at(-1).author,'Nina Reyes');assert.equal(s.referrals[0].activities.at(-1).source,'Messenger');assert.equal(s.visits[0].state,'In progress');
});
test('repeat activity requests are idempotent and resolved referrals reject later changes',()=>{
 const {repo,id}=setup();repo.commit(s=>{appendReferralActivity(s,id,contact,actor,now);appendReferralActivity(s,id,contact,actor,now);assert.equal(s.referrals[0].activities.length,1);appendReferralActivity(s,id,{id:'resolve-one',kind:'resolve',actions:'Followed the advice.',outcome:'Improved.'},actor,now);appendReferralActivity(s,id,{id:'resolve-one',kind:'resolve',actions:'Followed the advice.',outcome:'Improved.'},actor,now);assert.throws(()=>appendReferralActivity(s,id,{...contact,id:'later'},actor,now),{code:'REFERRAL_RESOLVED'});},1);assert.equal(repo.readState().referrals[0].activities.length,2);
});
test('urgent transfer/action can be documented while waiting without resolving or completing the encounter',()=>{
 const {repo,id}=setup();repo.commit(s=>{appendReferralActivity(s,id,contact,actor,now);appendReferralActivity(s,id,{id:'transfer',kind:'action',actions:'Arranged transfer.',destination:'External facility'},actor,now);},1);const s=repo.readState();assert.equal(s.referrals[0].state,'Awaiting doctor reply');assert.equal(s.visits[0].state,'In progress');assert.equal(s.referrals[0].activities.at(-1).destination,'External facility');
});
test('late reply and resolution never reopen a transferred completed visit or resend its summary',()=>{
 const {repo,id}=setup();repo.commit(s=>{appendReferralActivity(s,id,contact,actor,now);completeVisit(s,{patientId:'mara',visitId:'mara-current',complaintChoice:'Headache',state:'Awaiting doctor reply',outcome:'Referred to an external facility'},actor,now);},1);const before=repo.readState();repo.commit(s=>{appendReferralActivity(s,id,reply,actor,now);appendReferralActivity(s,id,{id:'resolved',kind:'resolve',actions:'Documented advice and transfer.',outcome:'Transferred for further care.'},actor,now);},before.revision);const after=repo.readState();assert.equal(after.referrals[0].state,'Resolved');assert.deepEqual(after.visits,before.visits);assert.deepEqual(after.messages,before.messages);assert.deepEqual(after.inventory,before.inventory);
});
test('blank actions/outcome and failed persistence preserve referral and visit history',()=>{
 const {repo,id,fail}=setup();const before=repo.readState();for(const input of [{kind:'resolve',actions:'',outcome:'Improved'},{kind:'resolve',actions:'Observed',outcome:' '},{kind:'action',actions:' '}])assert.throws(()=>repo.commit(s=>appendReferralActivity(s,id,input,actor,now),before.revision));assert.deepEqual(repo.readState(),before);fail();assert.throws(()=>repo.commit(s=>appendReferralActivity(s,id,contact,actor,now),before.revision),{code:'SAVE_FAILED'});assert.deepEqual(repo.readState(),before);
});
test('all patient types retain identity and completed visits support a later referral without a new encounter',()=>{
 for(const patientId of ['mara','leo','ana']){const s=seedState();s.referrals=[];const v=saveVisit(s,{patientId,complaintChoice:'Headache',state:'In progress'},actor,now);completeVisit(s,{patientId,visitId:v.id,complaintChoice:'Headache',state:'In progress',outcome:'Sent home'},actor,now);const visits=structuredClone(s.visits),r=prepareReferral(s,v.id,prep,actor,now);assert.equal(r.patientId,patientId);assert.equal(r.visitId,v.id);assert.deepEqual(s.visits,visits);}
});
test('legacy unlinked examples are preserved but cannot acquire fabricated visit history',()=>{const s=seedState();s.referrals.push({id:'orphan',patientId:'ana',state:'Prepared'});const before=structuredClone(s);assert.throws(()=>appendReferralActivity(s,'orphan',contact,actor,now),{code:'VISIT_MISSING'});assert.deepEqual(s,before);});
test('minute-precision contact time accepts the same minute as a newly saved visit',()=>{const s=seedState();s.referrals=[];const started='2026-10-19T03:59:45Z',v=saveVisit(s,{patientId:'ana',complaintChoice:'Headache',state:'In progress'},actor,started),r=prepareReferral(s,v.id,prep,actor,now);appendReferralActivity(s,r.id,{...contact,occurredAt:'2026-10-19T03:59:00Z'},actor,now);assert.equal(r.state,'Awaiting doctor reply');});
test('referral screens escape clinical text, keep category identity and show preparation only for saved visits',async()=>{
 const {referralsView,referralView,referralPrintView}=await import('../js/views/follow-up.js');const {visitView}=await import('../js/views/visits.js');
 const s=seedState();s.referrals=[];const v=s.visits[0],p=s.patients[0],r=prepareReferral(s,v.id,{...prep,reason:'<script>bad()</script>'},actor,now);
 const html=referralView(s,r,v,p);assert.match(html,/&lt;script&gt;/);assert.doesNotMatch(html,/<script>/);assert.match(referralsView(s,new URLSearchParams('status=Resolved')),/No follow-ups/);assert.match(referralPrintView(s,r,v,p),/Not recorded|Elena Lim/);
 assert.match(visitView({...s,referrals:[]},p,v),/#\/referrals\/new\?visit=mara-current/);assert.doesNotMatch(visitView(s,p,{}),/#\/referrals\/new\?visit=/);
});
