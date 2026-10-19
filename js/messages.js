import {validateNote} from './note-rules.js';
import {ClinicError,patientDescription} from './clinic.js';
import {mockEmailResult} from './services.js';
export const messageStatuses={pending:'Pending',sent:'Sent',failed:'Failed','missing-recipient':'Missing recipient'};
export const nurseAddress=s=>s.demo?.nurseEmail??'nurse@example.com';
const stamp=value=>new Date(value).toLocaleString('en-PH',{timeZone:'Asia/Manila'});
export function buildNurseSummary(s,v){
 const p=s.patients.find(p=>p.id===v.patientId);
 const lines=[`Patient: ${p.name}`,`Patient type: ${patientDescription(p)}`,`Visit started: ${stamp(v.startedAt)}`,`Completed: ${stamp(v.completedAt)}`,`Complaint: ${v.complaint}`];
 if(v.transferDestination)lines.push(`Transfer destination: ${v.transferDestination}`);
 for(const [label,value] of [['Assessment',v.assessment],['Temperature (°C)',v.temperature],['Pulse (bpm)',v.pulse],['Blood pressure (mmHg)',v.bp],['Treatment',v.treatment],['Final notes',v.finalNotes]])if(value!==null&&value!==undefined&&value!=='')lines.push(`${label}: ${value}`);
 if(v.supplies?.length)lines.push('Supplies: '+v.supplies.map(x=>`${x.name} · ${x.quantity} ${x.unit}`).join(', '));
 lines.push(`Outcome: ${v.outcome}`,`Recorded by: ${v.loggedBy||'Not recorded'}`,`Completed by: ${v.completedBy||'Not recorded'}`);
 return {subject:`Visit summary · ${p.name}`,body:lines.join('\n')};
}
// Compatibility for the original minimal concerned-party seed; no clinical summary is added.
export function messageDetails(m){return m.kind==='concerned-party'?{subject:'Visit update',recipient:'adviser@example.com',recipientName:'Class adviser',body:'The patient is resting in the clinic. Please contact the clinic for updates.',at:'2026-10-15T01:00:00Z',visitId:'mara-current',simulated:true,...m}:m;}
function find(s,id){const m=s.messages.find(m=>m.id===id);if(!m)throw new ClinicError('MESSAGE_MISSING','This message could not be found.');return m;}
export function recordManualFollowUp(s,id,note,actor,now){
 validateNote(note,{required:true,label:'Follow-up note'});
 const m=find(s,id);if(!String(note??'').trim())throw new ClinicError('NOTE_REQUIRED','Enter what you did to follow up.');
 (m.followUps??=[]).push({note:note.trim(),author:actor.name,at:now});
 s.audit.push({action:'message-manual-follow-up',messageId:id,actor:actor.name,at:now});
}
// Synchronous local adapter: one atomic storage commit per simulated result. No network send.
// Pending checks reuse the existing attempt; retries append only after an unresolved failure.
export function createMessageService({repository,now=()=>new Date().toISOString(),deliver=mockEmailResult}){
 function processMessage(id,expectedRevision,{retry=false}={}){
  const current=repository.readState();
  if(expectedRevision!==undefined&&expectedRevision!==current.revision)throw new ClinicError('STALE_REVISION','Records changed. Refresh before trying again.');
  const event=find(current,id);
  if(event.status==='sent'||(!retry&&(event.status!=='pending'||(event.kind!=='nurse-summary'&&!event.attempts?.some(a=>a.status==='pending')))))return current;
  if(retry&&!['failed','missing-recipient'].includes(event.status))return current;
  return repository.commit(s=>{
   const m=find(s,id),at=now();Object.assign(m,messageDetails(m));m.attempts??=[];
   if(m.kind==='nurse-summary'&&(!m.recipient||m.recipient==='School nurse'||m.status==='missing-recipient'))m.recipient=nurseAddress(s);
   if(!/^[^\s@]+@example\.com$/i.test(m.recipient||'')){m.status='missing-recipient';m.updatedAt=at;return;}
   let attempt=!retry?m.attempts.findLast(a=>a.status==='pending'):null;
   if(!attempt){attempt={id:crypto.randomUUID(),recipient:m.recipient,at,status:'pending'};m.attempts.push(attempt);}
   const result=deliver(s.demo?.delivery??'sent');
   Object.assign(attempt,{status:result.status,detail:result.detail,checkedAt:at});
   m.status=result.status;m.updatedAt=at;m.simulated=true;
   s.audit.push({action:retry?'retry-message':'process-message',messageId:id,attemptId:attempt.id,status:m.status,at});
  },expectedRevision??current.revision);
 }
 return {processMessage,retryMessage:(id,revision)=>processMessage(id,revision,{retry:true})};
}
