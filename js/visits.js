import {validateNote} from './note-rules.js';
import {validQuantity,reconcileVisitSupplies} from './inventory.js';
import {ClinicError} from './clinic.js';
import {buildNurseSummary,nurseAddress} from './messages.js';
export const complaints=['Dysmenorrhea','Fever','Colds','Headache','Abdominal pain','Eye pain','Wound/scratch','Anxiety/stress','Other'];
export const encounterStates=['In progress','Resting in clinic','Awaiting doctor reply','Completed'];
export const outcomes=['Returned to class/work','Left clinic after treatment','Sent home','Referred to an external facility'];
export const supplyCatalog=()=>[{id:'paracetamol',name:'Paracetamol',unit:'tablets'},{id:'gauze',name:'Gauze',unit:'pieces'},{id:'bandage',name:'Adhesive bandage',unit:'pieces'},{id:'saline',name:'Saline',unit:'bottles'}];
const clean=v=>String(v??'').trim();
const reject=(code,message)=>{throw new ClinicError(code,message);};
function patient(s,id){const p=s.patients.find(p=>p.id===id);if(!p)reject('PATIENT_REQUIRED','Choose the patient before saving.');return p;}
function active(s,id){const rows=s.visits.filter(v=>v.patientId===id&&v.state!=='Completed');if(rows.length>1)reject('AMBIGUOUS_VISIT','More than one ongoing visit needs reconciliation.');return rows[0];}
export function careValues(s,input,{completing=false}={}){
 for(const key of ['assessment','treatment'])validateNote(input[key],{label:'Note'});
 const choice=clean(input.complaintChoice),other=clean(input.otherComplaint);
 if(!complaints.includes(choice)||(choice==='Other'&&!other))reject('COMPLAINT_REQUIRED','Choose a complaint. For Other, describe the complaint.');
 if(!encounterStates.includes(input.state)||(!completing&&input.state==='Completed'))reject('STATE_REQUIRED','Choose an ongoing state, or use Complete visit to record the outcome.');
 const number=(key,label)=>{const raw=clean(input[key]);if(!raw)return null;if(!/^\d+(\.\d+)?$/.test(raw)||!Number.isFinite(Number(raw))||Number(raw)<=0||(key==='pulse'&&!Number.isInteger(Number(raw))))reject('VITAL_INVALID',`Enter a valid ${label}, or leave it blank.`);return Number(raw);};
 const temperature=number('temperature','temperature'),pulse=number('pulse','whole-number pulse'),bp=clean(input.bp);
 if(bp&&!/^[1-9]\d{1,2}\s*\/\s*[1-9]\d{1,2}$/.test(bp))reject('VITAL_INVALID','Enter blood pressure as systolic/diastolic, for example 118/76, or leave it blank.');
 const items=s.inventory?.length?s.inventory:supplyCatalog(),supplies=[],seen=new Set();
 for(const row of input.supplies||[]){if(!row.itemId&&!clean(row.quantity))continue;const item=items.find(i=>i.id===row.itemId),quantity=Number(row.quantity);
  if(!item||!validQuantity(item,quantity))reject('SUPPLY_INVALID',`Choose a supply and enter a positive quantity in the item's allowed unit steps.`);
  if(seen.has(item.id))reject('SUPPLY_INVALID','Use one row per supply and combine the quantity.');seen.add(item.id);supplies.push({itemId:item.id,name:item.name,unit:item.unit,quantity});
 }
 return {complaintChoice:choice,otherComplaint:choice==='Other'?other:'',complaint:choice==='Other'?other:choice,state:input.state,temperature,pulse,bp,assessment:clean(input.assessment),treatment:clean(input.treatment),supplies};
}
function selected(s,input){
 const existing=input.visitId?s.visits.find(v=>v.id===input.visitId):active(s,input.patientId);
 if(input.visitId&&!existing&&s.drafts[input.patientId]?.id!==input.visitId)reject('VISIT_MISSING','This saved visit could not be found.');
 if(existing&&existing.patientId!==input.patientId)reject('IDENTITY_LOCKED','Patient identity cannot be changed through a clinical correction.');
 return existing;
}
function journal(v,reason,actor,now){const before=structuredClone(v);delete before.revisions;(v.revisions??=[]).push({before,reason,author:actor.name,at:now});}
function create(s,input,actor,now){const draft=s.drafts[input.patientId];return {id:draft?.id||crypto.randomUUID(),patientId:input.patientId,startedAt:Number.isFinite(Date.parse(draft?.createdAt))?draft.createdAt:now,loggedBy:actor.name};}
export function saveVisit(s,input,actor,now){
 patient(s,input.patientId);const values=careValues(s,input),v=selected(s,input),ongoing=active(s,input.patientId);
 if(v?.state==='Completed')reject('VISIT_COMPLETED','Use Correct visit to change a completed record.');
 if(ongoing&&(!v||ongoing.id!==v.id))reject('AMBIGUOUS_VISIT','Resume the existing ongoing visit.');
 const visit=v||create(s,input,actor,now);reconcileVisitSupplies(s,visit.id,v?.supplies||[],values.supplies,actor,now);if(v)journal(visit,'Care update',actor,now);
 Object.assign(visit,values,{updatedAt:now,updatedBy:actor.name});if(!v)s.visits.push(visit);delete s.drafts[input.patientId];s.audit.push({action:'save-visit',visitId:visit.id,actor:actor.name,at:now});return visit;
}
export function completeVisit(s,input,actor,now){
 const p=patient(s,input.patientId),existing=selected(s,input);if(existing?.state==='Completed')return existing;
 validateNote(input.finalNotes,{label:'Final notes'});
 if(!outcomes.includes(input.outcome))reject('OUTCOME_REQUIRED','Choose an outcome before completing the visit.');
 const values=careValues(s,input,{completing:true}),ongoing=active(s,input.patientId);
 if(ongoing&&(!existing||ongoing.id!==existing.id))reject('AMBIGUOUS_VISIT','Resume the existing ongoing visit.');
 const v=existing||create(s,input,actor,now);reconcileVisitSupplies(s,v.id,existing?.supplies||[],values.supplies,actor,now);if(existing)journal(v,'Visit completed',actor,now);
 Object.assign(v,values,{state:'Completed',outcome:input.outcome,finalNotes:clean(input.finalNotes),completedAt:now,completedBy:actor.name,updatedAt:now,updatedBy:actor.name},input.outcome==='Referred to an external facility'&&clean(input.transferDestination)?{transferDestination:clean(input.transferDestination)}:{});if(!existing)s.visits.push(v);delete s.drafts[input.patientId];
 if(!s.messages.some(m=>m.kind==='nurse-summary'&&m.visitId===v.id))s.messages.push({id:crypto.randomUUID(),visitId:v.id,patientId:p.id,kind:'nurse-summary',status:'pending',simulated:true,recipient:nurseAddress(s),recipientName:'School nurse',...buildNurseSummary(s,v),at:now,attempts:[]});
 s.audit.push({action:'complete-visit',visitId:v.id,actor:actor.name,at:now});return v;
}
export function correctVisit(s,visitId,input,reason,actor,now){
 validateNote(reason,{label:'Correction reason'});validateNote(input.finalNotes,{label:'Final notes'});
 const v=selected(s,{...input,visitId});if(!clean(reason))reject('REASON_REQUIRED','Explain the reason for this correction.');
 const values=careValues(s,input,{completing:v.state==='Completed'});
 if(input.state!==v.state)reject('STATE_LOCKED','A correction cannot reopen or complete a visit.');
 if(v.state==='Completed'&&!outcomes.includes(input.outcome))reject('OUTCOME_REQUIRED','Choose an outcome for the completed visit.');
 reconcileVisitSupplies(s,v.id,v.supplies||[],values.supplies,actor,now);journal(v,clean(reason),actor,now);Object.assign(v,values,{updatedAt:now,updatedBy:actor.name});if(v.state==='Completed')Object.assign(v,{outcome:input.outcome,finalNotes:clean(input.finalNotes)});
 delete s.correctionDrafts?.[visitId];s.audit.push({action:'correct-visit',visitId,reason:clean(reason),actor:actor.name,at:now});return v;
}

