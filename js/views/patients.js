import {noteField} from '../note-ui.js';
import {card,heading,button,field,notice,escapeHtml as e} from '../ui.js';
import {searchPatients,patientDescription} from '../clinic.js';
import {profileFormView,profileDetails,profileHistory,profileStatus} from './profiles.js';
const types=[['all','All patients'],['student','Students'],['staff','Staff'],['visitor','Visitors']];
export const patientsHash=(type='all',query='')=>'#/patients?'+new URLSearchParams({type,q:query});
export const identityPanel=p=>`<section class="identity-panel" aria-label="Selected patient"><strong>${e(p.name)}</strong><p>${e(patientDescription(p))}</p></section>`;
export function patientResults(s,options){
  const results=searchPatients(s,options);
  return results.length?results.map(p=>{
    const active=s.visits.some(v=>v.patientId===p.id&&v.state!=='Completed');
    return `<div class="patient-row"><div class="patient-info"><strong>${e(p.name)}</strong><p class="small muted">${e(patientDescription(p))}</p>${profileStatus(s,p)}</div><span class="badge ${!active||p.type==='staff'?'badge-success':''}">${active?'In clinic':'No active visit'}</span>${button('Open',`#/patients/${encodeURIComponent(p.id)}`)}</div>`;
  }).join(''):`<div class="empty-state"><h3>No matching patient</h3><p class="muted">Try another name or school ID, or register a new patient.</p></div>`;
}
export function patientsView(s,params){
  const type=types.some(([t])=>t===params.get('type'))?params.get('type'):'all',query=params.get('q')||'';
  return heading('Patients','Find a student, staff member, or visitor.')+card('Find a patient',`<form id="patient-search" role="search">${field('Search','patient-query',{value:query,placeholder:'Search by name or school ID'})}</form><nav class="actions patient-filters" aria-label="Patient category">${types.map(([t,label])=>button(label,patientsHash(t,query)).replace('class="button"',`class="button ${type===t?'filter-selected':''}" data-category="${t}"${type===t?' aria-current="true"':''}`)).join('')}${button('Register patient','#/patients/register',{primary:true})}</nav><div id="patient-results" class="result-list" aria-live="polite">${patientResults(s,{type,query})}</div>`,{symbol:'patients'});
}
export function registerView(params,draft={},state={patients:[]}){return profileFormView(state,{departmentGroup:'',schoolId:params.get('schoolId')||'',rfid:params.get('rfid')||'',...draft});}
const when=value=>new Intl.DateTimeFormat('en',{timeZone:'Asia/Manila',day:'numeric',month:'long',year:'numeric',hour:'numeric',minute:'2-digit'}).format(new Date(value));
const complaintKey=value=>(value||'').trim().toLocaleLowerCase();
function complaintFilter(s,p){
  const options=new Map();
  for(const v of s.visits.filter(v=>v.patientId===p.id))if(complaintKey(v.complaint)&&!options.has(complaintKey(v.complaint)))options.set(complaintKey(v.complaint),v.complaint.trim());
  return `<div class="field"><label for="history-complaint">Complaint</label><select id="history-complaint" name="history-complaint"><option value="">All complaints</option>${[...options.values()].sort((a,b)=>a.localeCompare(b)).map(c=>`<option value="${e(c)}">${e(c)}</option>`).join('')}</select></div>`;
}
export function noteView(n){
  return `<article class="note" data-note-id="${e(n.id)}"><p class="note-text">${e(n.text)}</p><p class="small muted">${e(n.author)} · ${e(when(n.at))}</p>${n.updatedAt?`<p class="small muted">Edited by ${e(n.updatedBy)} · ${e(when(n.updatedAt))}</p>`:''}<div class="actions"><button class="button" type="button" data-edit-note="${e(n.id)}">Edit note</button></div>${n.revisions?.length?`<details><summary>Edit history</summary><div class="result-list">${n.revisions.map(r=>`<div><p class="note-text">${e(r.text)}</p><p class="small muted">${e(r.author)} · ${e(when(r.at))}</p></div>`).join('')}</div></details>`:''}</article>`;
}
export function historyRows(s,p,{date='',complaint=''}={}){
  const visits=s.visits.filter(v=>v.patientId===p.id&&(!date||new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Manila',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(v.startedAt))===date)&&(!complaint||complaintKey(v.complaint)===complaintKey(complaint))).sort((a,b)=>b.startedAt.localeCompare(a.startedAt));
  return visits.map(v=>`<div class="patient-row"><div class="patient-info"><strong>${e(when(v.startedAt))} · ${e(v.complaint||'Visit')}</strong><p class="small muted">${e(v.loggedBy||'Elena Lim')}</p></div><span class="badge ${v.state==='Completed'?'badge-success':''}">${e(v.state)}</span>${button('Open','#/visits/'+encodeURIComponent(v.id))}</div>`).join('')||'<p class="muted">No visits match these filters.</p>';
}
export function recordView(s,p,back){
  const active=s.visits.some(v=>v.patientId===p.id&&v.state!=='Completed');
  return heading('Patient record','Visit history and follow-up notes.')+identityPanel(p)+card('Patient details',`${profileDetails(s,p)}<p class="muted">Allergy: ${e(p.allergy||'Not recorded')} · Blood type: ${e(p.bloodType||'Not recorded')}</p><div class="actions"><button class="button button-primary" data-start="${e(p.id)}">${active?'Resume visit':'Start visit'}</button></div>`,{symbol:'patients'})+card('Visit history',`<form id="history-filters" class="filter-grid">${field('Visit date','history-date',{type:'date'})}${complaintFilter(s,p)}</form><div id="history-results" class="result-list" aria-live="polite">${historyRows(s,p)}</div>`,{symbol:'history'})+card('Follow-up notes',`<div class="result-list">${(p.notes||[]).map(noteView).join('')||'<p class="muted">No additional notes.</p>'}</div><form id="note-form" class="form-stack">${noteField('Add a note','note','',true,'patient-note')}<div class="actions"><button class="button button-primary" type="submit">Save note</button></div></form>`)+profileHistory(p)+`<div class="actions">${button('Back to patients',back)}</div>`;
}
export function intakeView(s,p,entry){
  const completed=entry.state==='Completed';
  return identityPanel(p)+heading(completed?'Completed visit':entry.startedAt?'Ongoing visit':'New visit','Check the patient’s details before recording care.')+card('Complaint and assessment',`<form id="intake-form" class="form-stack" data-patient="${e(p.id)}">${field('Reason for visit','complaint',{value:entry.complaint,required:true,readonly:completed})}<div class="field"><label for="encounter-state">Visit status</label><select id="encounter-state" name="state" ${completed?'disabled':''}>${(completed?['Completed']:['In progress','Resting in clinic','Awaiting doctor reply']).map(x=>`<option${entry.state===x?' selected':''}>${x}</option>`).join('')}</select></div><p id="draft-status" class="small muted" role="status">${completed?'Saved visit.':'Your patient’s draft is kept separately when you switch patients.'}</p>${completed?'':`<div class="actions"><button class="button button-primary" type="submit">Save visit</button>${button('Complete visit','',{disabled:true})}</div>`}<div class="actions">${button('Back to Today','#/today')}${button('View patient history','#/patients/'+encodeURIComponent(p.id))}</div></form>`);
}
export function unknownView(){return heading('Card not recognized')+card('We couldn’t find this card',`<p class="muted">Search by name, or register a new patient. Department details identify the patient category.</p><div class="actions">${button('Search by name','#/patients',{primary:true})}${button('Register patient','#/patients/register')}${button('Try scanning again','#/today')}</div>`);}
