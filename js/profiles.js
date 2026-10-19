import {ClinicError,identityRecords,registerPatient} from './clinic.js';
export const departments=[['','Choose department'],['higher-ed','Higher ed'],['basic-ed','Basic ed'],['staff','Staff'],['none','No school department']];
export const grades=Array.from({length:12},(_,i)=>'Grade '+(i+1));
export const programs=['BSIS'];
export const years=['1st year','2nd year','3rd year','4th year'];
const clean=v=>String(v??'').trim(),key=v=>clean(v).toLowerCase();
const reject=(code,message,details={})=>{throw new ClinicError(code,message,details);};
const identityFields=['name','departmentGroup','schoolId','rfid','program','year','grade','section'];
export function inferProfileType(d){return ['higher-ed','basic-ed'].includes(d.departmentGroup)?'student':d.departmentGroup==='staff'?'staff':d.departmentGroup==='none'?'visitor':clean(d.schoolId)?'staff':null;}
export function profileDraft(s,p){
 const mapping=identityRecords(s).find(r=>r.patientId===p.id),managed=Boolean(mapping?.sourceId&&!p.provisional);
 return {name:p.name||'',departmentGroup:p.departmentGroup||(p.type==='visitor'?'none':p.type==='staff'?'staff':p.program?'higher-ed':'basic-ed'),schoolId:p.schoolId||'',rfid:mapping?.cards?.[0]||'',grade:p.grade||'',section:p.section||'',program:p.program||'',year:p.year||'',contact:p.contact||'',emergencyName:p.emergencyName||'',emergencyPhone:p.emergencyPhone||'',emergencyRelationship:p.emergencyRelationship||'',sourceId:managed?mapping.sourceId:'',managed};
}
export function sections(s,grade,current=''){return [...new Set(['Hope','Faith',...s.patients.filter(p=>p.grade===grade).map(p=>p.section),current].filter(Boolean))];}
export function schoolRecords(s){
 const known=identityRecords(s).filter(r=>r.sourceId).map(r=>{const p=s.patients.find(p=>p.id===r.patientId);if(!p)return null;const d=profileDraft(s,p);return {...Object.fromEntries(identityFields.map(k=>[k,d[k]])),sourceId:r.sourceId,patientId:p.id};}).filter(Boolean);
 const example={sourceId:'school-demo-3001',name:'Rosa Dela Cruz',schoolId:'DEMO-3001',rfid:'RFID-DEMO-3001',departmentGroup:'higher-ed',program:'BSIS',year:'2nd year',grade:'',section:''};
 if(!known.some(r=>r.sourceId===example.sourceId))known.push(example);return known;
}
export function profileCompletion(s,p){
 const d=profileDraft(s,p),missing=[];
 if(!clean(p.name))missing.push('Full name');
 if(p.type==='student'){
  if(!d.schoolId)missing.push('School ID');if(!d.rfid)missing.push('RFID');
  if(d.departmentGroup==='higher-ed'){if(!d.program)missing.push('Program');if(!d.year)missing.push('Year level');}
  else{if(!d.grade)missing.push('Grade level');if(!d.section)missing.push('Section');}
 }
 if(!d.emergencyName)missing.push('Emergency contact name');if(!d.emergencyPhone)missing.push('Emergency contact number');
 return {complete:!missing.length,missing};
}
function values(s,input,{existing=null}={}){
 const d=Object.fromEntries([...identityFields,'contact','emergencyName','emergencyPhone','emergencyRelationship','sourceId'].map(k=>[k,clean(input[k])]));
 if(!d.name||d.name.length>120)reject('NAME_REQUIRED','Enter the full name (up to 120 characters).');
 if(!departments.some(([v])=>v===d.departmentGroup))reject('DEPARTMENT_REQUIRED','Choose a department.');
 const type=inferProfileType(d);if(!type)reject('DEPARTMENT_REQUIRED','Choose a department before saving this record.');
 if(type==='visitor'&&(d.schoolId||d.rfid))reject('CLASSIFICATION_CONFLICT','An ID is entered. Check the school department, or clear the IDs before saving a visitor.');
 const old=existing&&profileDraft(s,existing);
 if(old?.managed&&identityFields.some(k=>d[k]!==old[k]))reject('SCHOOL_MANAGED','School identity details are managed by the school. Update contact details here.');
 if(d.sourceId&&!old?.managed){const row=schoolRecords(s).find(r=>r.sourceId===d.sourceId);if(!row||identityFields.some(k=>d[k]!==clean(row[k])))reject('SCHOOL_MANAGED','Use the school record as provided, or enter a separate unverified record.');}
 if(type==='student'&&!old?.managed){
  if(!d.schoolId||!d.rfid)reject('STUDENT_ID_REQUIRED','Student records need a school ID and RFID.');
  if(d.departmentGroup==='basic-ed'&&(!grades.includes(d.grade)||!d.section))reject('EDUCATION_REQUIRED','Choose the grade level and section.');
  if(d.departmentGroup==='higher-ed'&&(!programs.includes(d.program)||!years.includes(d.year)))reject('EDUCATION_REQUIRED','Choose the program and year level.');
 }
 for(const name of ['contact','emergencyPhone'])if(d[name]&&(!/^[+()\d\s-]+$/.test(d[name])||d[name].replace(/\D/g,'').length<7||d[name].replace(/\D/g,'').length>15))reject('CONTACT_INVALID','Enter a valid contact number (7–15 digits), or leave it blank to finish later.');
 const mappings=identityRecords(s);for(const candidate of s.patients.filter(p=>p.id!==existing?.id)){
  const m=mappings.find(m=>m.patientId===candidate.id),aliases=[candidate.schoolId,...(m?.cards||[])].filter(Boolean).map(key);
  if(d.schoolId&&aliases.includes(key(d.schoolId)))reject('DUPLICATE_ID','This school ID is already used by another patient.',{candidates:[candidate]});
  if(d.rfid&&aliases.includes(key(d.rfid)))reject('DUPLICATE_RFID','This RFID is already used by another patient.',{candidates:[candidate]});
  if(key(candidate.name)===key(d.name)&&!clean(input.duplicateReason))reject('POSSIBLE_DUPLICATE','A patient with this name exists. Check the record before saving separately.',{candidates:[candidate]});
 }
 if(d.departmentGroup!=='higher-ed'){d.program='';d.year='';}if(d.departmentGroup!=='basic-ed'){d.grade='';d.section='';}
 return {...d,type,departmentGroup:d.departmentGroup||(type==='staff'?'staff':'')};
}
function assignProfile(s,p,d){
 const previousType=p.type;
 Object.assign(p,{name:d.name,type:d.type,departmentGroup:d.departmentGroup,contact:d.contact,emergencyName:d.emergencyName,emergencyPhone:d.emergencyPhone,emergencyRelationship:d.emergencyRelationship});
 for(const k of ['grade','section','program','year'])delete p[k];
 if(d.type==='student'){if(d.departmentGroup==='higher-ed')Object.assign(p,{program:d.program,year:d.year,department:'Higher ed'});else Object.assign(p,{grade:d.grade,section:d.section,department:'Basic ed'});}
 if(d.type==='staff'&&(previousType!=='staff'||!p.department))p.department='Staff';
 if(d.type==='visitor'){delete p.schoolId;delete p.department;delete p.provisional;}
 else p.schoolId=d.schoolId;
 const mapping=identityRecords(s).map(r=>structuredClone(r));
 if(d.type!=='visitor'){
  const row=mapping.find(r=>r.patientId===p.id);
  if(row){const unchanged=row.cards?.includes(d.rfid);row.schoolId=d.schoolId;row.cards=d.rfid?(unchanged?row.cards:[d.rfid]):[];if(d.sourceId)row.sourceId=d.sourceId;}
  else mapping.push({sourceId:d.sourceId||null,patientId:p.id,schoolId:d.schoolId,cards:d.rfid?[d.rfid]:[]});
 }else{const index=mapping.findIndex(r=>r.patientId===p.id);if(index>=0)mapping.splice(index,1);}
 s.schoolIdentities=mapping;
}
export function createProfile(s,input,actor,now){
 const d=values(s,input);const p=registerPatient(s,{...d,type:d.type,duplicateReason:input.duplicateReason},actor,now);assignProfile(s,p,d);if(d.sourceId)p.provisional=false;return p;
}
export function updateProfile(s,id,input,actor,now){
 const p=s.patients.find(p=>p.id===id);if(!p)reject('PATIENT_MISSING','The patient could not be found.');const before=profileDraft(s,p),d=values(s,input,{existing:p});
 const identityChanged=identityFields.some(k=>d[k]!==before[k]);
 assignProfile(s,p,d);if(identityChanged&&p.type!=='visitor'&&!d.sourceId)p.provisional=true;
 p.updatedBy=actor.name;p.updatedAt=now;(p.profileHistory??=[]).push({before,after:profileDraft(s,p),author:actor.name,at:now});
 s.audit.push({action:'update-patient-details',patientId:id,actor:actor.name,at:now});return p;
}
