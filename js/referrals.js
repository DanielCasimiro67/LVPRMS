import {validateNote} from './note-rules.js';
import {ClinicError} from './clinic.js';
import {dischargeVisit} from './discharge.js';
export const referralStates=['Prepared','Awaiting doctor reply','Advice received','Resolved'];
const clean=v=>String(v??'').trim();
const reject=(code,message)=>{throw new ClinicError(code,message);};
function linkedVisit(s,id){const v=s.visits.find(v=>v.id===id);if(!v)reject('VISIT_MISSING','Save a visit before preparing or updating its referral.');if(!s.patients.some(p=>p.id===v.patientId))reject('PATIENT_MISSING','The patient could not be found.');return v;}
export function prepareReferral(s,visitId,input,actor,now){
 for(const key of ['reason','notes'])validateNote(input[key],{label:'Note'});
 const v=linkedVisit(s,visitId);if(!clean(input.reason))reject('REASON_REQUIRED','Enter the reason for referral.');
 const existing=s.referrals.find(r=>r.visitId===visitId&&r.state!=='Resolved');if(existing)return existing;
 const repeated=input.id&&s.referrals.find(r=>r.id===input.id);if(repeated){if(repeated.visitId!==visitId)reject('IDENTITY_LOCKED','This referral belongs to a different visit.');return repeated;}
 const r={id:input.id||crypto.randomUUID(),visitId,patientId:v.patientId,state:'Prepared',reason:clean(input.reason),destination:clean(input.destination),notes:clean(input.notes),preparedAt:now,preparedBy:actor.name,activities:[]};
 s.referrals.push(r);s.audit.push({action:'prepare-referral',referralId:r.id,visitId,actor:actor.name,at:now});return r;
}
export function appendReferralActivity(s,id,input,actor,now){
 for(const key of ['notes','advice','nextAction','actions','outcome'])validateNote(input[key],{label:'Note'});
 const r=s.referrals.find(r=>r.id===id);if(!r)reject('REFERRAL_MISSING','This referral could not be found.');const v=linkedVisit(s,r.visitId);
 if(r.patientId&&r.patientId!==v.patientId)reject('IDENTITY_LOCKED','The referral and visit refer to different patients.');
 if(input.id&&r.activities?.some(a=>a.id===input.id))return r;
 if(r.state==='Resolved')reject('REFERRAL_RESOLVED','This follow-up is resolved. Its history has been kept.');
 const required=(value,label)=>{const text=clean(value);if(!text)reject('FIELD_REQUIRED',`Enter ${label}.`);return text;};
 const timestamp=()=>{const value=clean(input.occurredAt),date=Date.parse(value);if(!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(value)||!Number.isFinite(date)||date>Date.parse(now)||date<Math.floor(Date.parse(v.startedAt)/60000)*60000)reject('TIME_INVALID','Use a valid date and time between the visit start and now (Philippine time).');return new Date(date).toISOString();};
 const activity={id:input.id||crypto.randomUUID(),kind:input.kind,author:actor.name,recordedAt:now};let next=r.state;
 if(input.kind==='contact'){
  if(!['Prepared','Awaiting doctor reply'].includes(r.state))reject('STATE_INVALID','Contact attempts are recorded before advice is received.');
  if(!['sent','not-reached'].includes(input.result))reject('CONTACT_RESULT','Choose whether a message was sent.');
  Object.assign(activity,{doctor:required(input.doctor,'the doctor’s name'),occurredAt:timestamp(),source:'Messenger',result:input.result,notes:clean(input.notes)});if(input.result==='sent')next='Awaiting doctor reply';
 }else if(input.kind==='reply'){
  const contacts=(r.activities||[]).filter(a=>a.kind==='contact'&&a.result==='sent');
  if(r.state!=='Awaiting doctor reply'||!contacts.length)reject('CONTACT_REQUIRED','Record the actual Messenger contact before recording a reply.');
  Object.assign(activity,{doctor:required(input.doctor,'the doctor’s name'),occurredAt:timestamp(),source:'Messenger',advice:required(input.advice,'the advice received'),nextAction:required(input.nextAction,'the planned next action')});
  if(Date.parse(activity.occurredAt)<Math.max(...contacts.map(a=>Date.parse(a.occurredAt))))reject('TIME_INVALID','The reply time must be after the recorded contact.');next='Advice received';
 }else if(input.kind==='action'||input.kind==='resolve'){
  Object.assign(activity,{actions:required(input.actions,'the actions taken'),destination:clean(input.destination),occurredAt:now});
  if(input.kind==='resolve'){activity.outcome=required(input.outcome,'the follow-up outcome');next='Resolved';}
 }else reject('ACTIVITY_INVALID','Choose a supported follow-up action.');
 (r.activities??=[]).push(activity);r.state=next;r.updatedAt=now;r.updatedBy=actor.name;
 s.audit.push({action:'referral-'+input.kind,referralId:id,activityId:activity.id,actor:actor.name,at:now});return r;
}
export function transferReferral(s,id,input,actor,now){
 const r=s.referrals.find(r=>r.id===id);if(!r)reject('REFERRAL_MISSING','This referral could not be found.');
 const v=linkedVisit(s,r.visitId);
 if(r.patientId&&r.patientId!==v.patientId)reject('IDENTITY_LOCKED','The referral and visit refer to different patients.');
 if(r.activities?.some(a=>a.kind==='transfer'))return r;
 if(r.state==='Resolved')reject('REFERRAL_RESOLVED','This follow-up is resolved. Open a new referral if further care is needed.');
 if(v.state==='Completed')reject('VISIT_COMPLETED','This visit is already completed. Its original summary has been kept. Review the visit before recording another transfer.');
 if(input.confirmed!==true)reject('TRANSFER_CONFIRMATION','Confirm that the patient has actually left the clinic for the receiving facility.');
 const destination=clean(input.destination),notes=validateNote(input.notes,{label:'Transfer notes'});
 if(!destination)reject('DESTINATION_REQUIRED','Enter the receiving facility before confirming the transfer.');
 if(input.id&&r.activities?.some(a=>a.id===input.id))reject('ACTIVITY_CONFLICT','This action was already used. Refresh the referral before recording the transfer.');
 const activity={id:input.id||crypto.randomUUID(),kind:'transfer',destination,notes,author:actor.name,occurredAt:now,recordedAt:now};
 dischargeVisit(s,v.id,{outcome:'Referred to an external facility',transferDestination:destination,finalNotes:input.notes===undefined?undefined:notes},actor,now);
 (r.activities??=[]).push(activity);r.updatedAt=now;r.updatedBy=actor.name;
 s.audit.push({action:'referral-transfer',referralId:r.id,visitId:v.id,activityId:activity.id,destination,actor:actor.name,at:now});return r;
}
