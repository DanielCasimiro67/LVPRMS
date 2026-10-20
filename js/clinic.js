import {validateNote} from './note-rules.js';
export class ClinicError extends Error{
  constructor(code,message,details={}){super(message);this.code=code;this.details=details;}
}
const clean=v=>String(v??'').trim();
const key=v=>clean(v).toLocaleLowerCase();
const id=()=>crypto.randomUUID();
const person=(s,patientId)=>{const p=s.patients.find(p=>p.id===patientId);if(!p)throw new ClinicError('PATIENT_MISSING','This patient record could not be found.');return p;};
export const patientDescription=p=>p.type==='student'?['Student',p.program,p.year,p.grade,p.section].filter(Boolean).join(' · '):p.type==='staff'?['Staff',p.department].filter(Boolean).join(' · '):'Visitor';
export function identityRecords(s){return s.schoolIdentities??s.patients.filter(p=>p.type!=='visitor'&&p.schoolId).map(p=>({sourceId:p.id==='mara'?'school-mara':p.id==='leo'?'school-leo':null,patientId:p.id,schoolId:p.schoolId,cards:p.id==='mara'?['RFID-1001']:p.id==='leo'?['RFID-1002']:[]}));}
export function identifyPatient(s,value){
  const query=key(value);if(!query)return {status:'unknown',candidates:[]};
  const ids=new Set(identityRecords(s).filter(r=>key(r.schoolId)===query||(r.cards||[]).some(c=>key(c)===query)).map(r=>r.patientId));
  const candidates=s.patients.filter(p=>p.type!=='visitor'&&(ids.has(p.id)||key(p.schoolId)===query));
  return {status:candidates.length===1?'match':candidates.length?'ambiguous':'unknown',patient:candidates.length===1?candidates[0]:null,candidates};
}
export function searchPatients(s,{query='',type='all'}={}){
  const cardIds=new Set(identityRecords(s).filter(r=>key(query)&&(r.cards||[]).some(c=>key(c)===key(query))).map(r=>r.patientId));
  return s.patients.filter(p=>(type==='all'||p.type===type)&&(!query||key(p.name).includes(key(query))||key(p.schoolId).includes(key(query))||cardIds.has(p.id)));
}
export function registerPatient(s,input,actor,now){
  const name=clean(input.name),type=input.type;
  if(!name||name.length>120||!['student','staff','visitor'].includes(type))throw new ClinicError('INVALID_PATIENT','Enter a full name and choose a patient type.');
  const schoolId=type==='visitor'?'':clean(input.schoolId);
  const exact=s.patients.find(p=>schoolId&&key(p.schoolId)===key(schoolId));
  if(exact)throw new ClinicError('DUPLICATE_ID','This school ID already belongs to a patient. Open their existing record.',{candidates:[exact]});
  const candidates=s.patients.filter(p=>key(p.name)===key(name));
  if(candidates.length&&!clean(input.duplicateReason))throw new ClinicError('POSSIBLE_DUPLICATE','A patient with this name already exists. Check the records before registering separately.',{candidates});
  const rfid=clean(input.rfid),mappings=structuredClone(identityRecords(s));
  if(rfid&&type==='visitor')throw new ClinicError('SCHOOL_CARD_TYPE','This card is for a school patient. Check the patient’s school details before linking it.');
  const cardOwner=rfid&&mappings.find(r=>key(r.schoolId)===key(rfid)||(r.cards||[]).some(card=>key(card)===key(rfid)));
  if(cardOwner)throw new ClinicError('DUPLICATE_RFID','This RFID already belongs to a patient. Open the existing record.',{candidates:s.patients.filter(p=>p.id===cardOwner.patientId)});
  const patient={id:id(),name,type,contact:clean(input.contact),createdAt:now,registeredBy:actor.name,notes:[]};
  if(type!=='visitor'){patient.schoolId=schoolId;patient.provisional=true;if(type==='student'){patient.grade=clean(input.grade);patient.section=clean(input.section);}else patient.department=clean(input.department);}
  s.patients.push(patient);if(rfid){s.schoolIdentities=mappings;s.schoolIdentities.push({sourceId:null,patientId:patient.id,schoolId,cards:[rfid]});}s.audit.push({action:'register-patient',patientId:patient.id,actor:actor.name,at:now,reason:clean(input.duplicateReason)});return patient;
}
export function startOrResumeVisit(s,patientId,actor,now){
  person(s,patientId);const visits=s.visits.filter(v=>v.patientId===patientId&&v.state!=='Completed');
  if(visits.length>1)throw new ClinicError('AMBIGUOUS_VISIT','More than one active visit was found. Ask school support to reconcile the records.');
  if(visits.length)return {kind:'visit',visit:visits[0]};
  if(!Object.hasOwn(s.drafts,patientId))s.drafts[patientId]={id:id(),patientId,complaint:'',state:'In progress',createdAt:now,author:actor.name};
  return {kind:'draft',draft:s.drafts[patientId]};
}
export function getIntakeEntry(s,visitId,patientId){
  const visit=visitId==='new'?s.visits.find(v=>v.patientId===patientId&&v.state!=='Completed'):s.visits.find(v=>v.id===visitId);
  const patient=s.patients.find(p=>p.id===(visit?.patientId||patientId));
  return {patient,entry:patient?(s.drafts[patient.id]||visit||{complaint:'',state:'In progress'}):null};
}
export function saveIntakeDraft(s,patientId,input,actor,now){
  person(s,patientId);
  if(!clean(input.complaint))throw new ClinicError('COMPLAINT_REQUIRED','Enter the reason for this visit before saving.');
  if(!['In progress','Resting in clinic','Awaiting doctor reply'].includes(input.state))throw new ClinicError('STATE_REQUIRED','Choose the current visit status.');
  const existing=s.visits.filter(v=>v.patientId===patientId&&v.state!=='Completed');
  if(existing.length>1)throw new ClinicError('AMBIGUOUS_VISIT','The active visits need reconciliation.');
  const visit=existing[0]||{id:s.drafts[patientId]?.id||id(),patientId,startedAt:now,loggedBy:actor.name};
  visit.complaint=clean(input.complaint);visit.state=input.state;visit.updatedAt=now;visit.updatedBy=actor.name;
  if(!existing.length)s.visits.push(visit);
  delete s.drafts[patientId];s.audit.push({action:'save-intake',visitId:visit.id,actor:actor.name,at:now});return visit;
}
export function addPatientNote(s,patientId,text,actor,now){
  validateNote(text,{required:true,label:'Follow-up note'});
  const p=person(s,patientId);if(!clean(text))throw new ClinicError('NOTE_REQUIRED','Enter a follow-up note before saving.');
  (p.notes??=[]).push({id:id(),text:clean(text),author:actor.name,at:now});
}
export function editPatientNote(s,patientId,noteId,text,actor,now){
  validateNote(text,{required:true,label:'Follow-up note'});
  const note=(person(s,patientId).notes||[]).find(n=>n.id===noteId);
  if(!note)throw new ClinicError('NOTE_MISSING','This follow-up note could not be found. Reload the patient record.');
  if(!clean(text))throw new ClinicError('NOTE_REQUIRED','Enter a follow-up note before saving.');
  if(clean(text)===note.text)return note;
  (note.revisions??=[]).push({text:note.text,author:note.updatedBy||note.author,at:note.updatedAt||note.at});
  note.text=clean(text);note.updatedBy=actor.name;note.updatedAt=now;
  s.audit.push({action:'edit-patient-note',patientId,noteId,actor:actor.name,at:now});return note;
}
export function mergeSchoolIdentities(s,records,actor,now){
  if(!Array.isArray(records))throw new ClinicError('INVALID_IMPORT','School data must be a list of identity records.');
  s.schoolIdentities=structuredClone(identityRecords(s));const conflicts=[];let updated=0;
  const counts=new Map();for(const r of records.filter(r=>r&&typeof r==='object'))for(const k of ['source:'+r.sourceId,'school:'+key(r.schoolId),...(Array.isArray(r.cards)?r.cards:[]).map(c=>'card:'+key(c))])counts.set(k,(counts.get(k)||0)+1);
  for(const r of records){
    if(!r||typeof r.sourceId!=='string'||!r.sourceId||!clean(r.schoolId)||!clean(r.name)||!['student','staff'].includes(r.type)||!Array.isArray(r.cards)||r.cards.some(c=>typeof c!=='string'||!clean(c))||['source:'+r.sourceId,'school:'+key(r.schoolId),...r.cards.map(c=>'card:'+key(c))].some(k=>counts.get(k)>1)) {conflicts.push({sourceId:r?.sourceId,reason:'Missing or conflicting identity fields.'});continue;}
    const linked=s.schoolIdentities.find(x=>x.sourceId===r.sourceId);
    const collision=s.schoolIdentities.find(x=>x.sourceId!==r.sourceId&&(key(x.schoolId)===key(r.schoolId)||x.cards.some(c=>r.cards.some(v=>key(v)===key(c)))));
    const provisional=s.patients.find(p=>p.provisional&&key(p.schoolId)===key(r.schoolId)&&p.type===r.type);
    const schoolOwner=s.patients.find(p=>key(p.schoolId)===key(r.schoolId));
    if(!linked&&provisional){conflicts.push({sourceId:r.sourceId,reason:'A provisional clinic record uses this school ID. Verify and reconcile the patient identity before importing.'});continue;}
    if(linked&&provisional&&linked.patientId!==provisional.id){conflicts.push({sourceId:r.sourceId,reason:'School ID belongs to a different provisional patient. Resolve the identity conflict before importing.'});continue;}
    if(schoolOwner&&schoolOwner.id!==linked?.patientId&&schoolOwner.id!==provisional?.id){conflicts.push({sourceId:r.sourceId,reason:'School ID belongs to another local patient.'});continue;}
    if(collision&&!(provisional&&collision.patientId===provisional.id&&!collision.sourceId)){conflicts.push({sourceId:r.sourceId,reason:'School ID or card is already linked to another identity.'});continue;}
    let p=linked?s.patients.find(p=>p.id===linked.patientId):provisional;
    if(!p){p={id:id(),type:r.type,notes:[]};s.patients.push(p);}
    if(p.type==='visitor'){conflicts.push({sourceId:r.sourceId,reason:'Visitor records cannot be linked automatically.'});continue;}
    Object.assign(p,{name:clean(r.name),type:r.type,schoolId:clean(r.schoolId),provisional:false});
    for(const field of ['grade','section','program','year','department','departmentGroup'])delete p[field];
    if(r.type==='student'){
      const higher=r.departmentGroup==='higher-ed'||Boolean(clean(r.program));
      Object.assign(p,higher?{departmentGroup:'higher-ed',department:'Higher ed',program:clean(r.program),year:clean(r.year)}:{departmentGroup:'basic-ed',department:'Basic ed',grade:clean(r.grade),section:clean(r.section)});
    }else Object.assign(p,{departmentGroup:'staff',department:clean(r.department)});
    s.schoolIdentities=s.schoolIdentities.filter(x=>x.patientId!==p.id);s.schoolIdentities.push({sourceId:r.sourceId,patientId:p.id,schoolId:p.schoolId,cards:r.cards.map(clean)});updated++;
  }
  if(updated)s.schoolUpdatedAt=now;s.schoolSync={at:now,updated,conflicts};s.audit.push({action:'school-identity-update',actor:actor.name,at:now,updated,conflicts:conflicts.length});return {updated,conflicts};
}
