import {ClinicError} from './clinic.js';
import {complaints,completeVisit} from './visits.js';
export function scanVisitAction(state,patientId){
 if(!state.patients.some(p=>p.id===patientId))throw new ClinicError('PATIENT_MISSING','This patient could not be found.');
 const visits=state.visits.filter(v=>v.patientId===patientId&&v.state!=='Completed');
 if(visits.length>1)throw new ClinicError('AMBIGUOUS_VISIT','More than one ongoing visit needs reconciliation. Open the patient record to review.');
 return visits.length?{kind:'discharge',visitId:visits[0].id}:{kind:'visit'};
}
export function dischargeVisit(state,visitId,input,actor,at){
 const visit=state.visits.find(v=>v.id===visitId);if(!visit)throw new ClinicError('VISIT_MISSING','This visit could not be found. Open the patient record to review.');
 if(visit.state==='Completed')return visit;
 if(state.drafts[visit.patientId]?.dirty)throw new ClinicError('UNSAVED_CARE','This visit has unsaved care changes. Review and save the visit before discharge.');
 const choice=visit.complaintChoice||(complaints.includes(visit.complaint)?visit.complaintChoice||visit.complaint:'Other');
 return completeVisit(state,{...visit,patientId:visit.patientId,visitId:visit.id,complaintChoice:choice,otherComplaint:choice==='Other'?(visit.otherComplaint||visit.complaint):'',outcome:input.outcome,transferDestination:input.transferDestination,finalNotes:input.finalNotes??visit.finalNotes??''},actor,at);
}
