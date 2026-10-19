import {dischargeVisit} from './discharge.js';
import {patientDescription} from './clinic.js';
import {outcomes} from './visits.js';
import {select} from './views/visits.js';
import {escapeHtml as e,notice,button,formError} from './ui.js';
import {noteField,attachNoteCounters} from './note-ui.js';
import {createScanReader} from './intake.js';
export function createDischargeFlow({repository,session}){
 let open=false;
 function confirm(visitId){
  if(open)return;
  session.requireSession();const state=repository.readState(),visit=state.visits.find(v=>v.id===visitId),patient=state.patients.find(p=>p.id===visit?.patientId);
  if(!visit||!patient)throw Error('This visit could not be found. Open the patient record to review.');
  if(visit.state==='Completed'){location.hash='/visits/'+encodeURIComponent(visit.id);return;}
  const revision=state.revision,dirty=Boolean(state.drafts[patient.id]?.dirty),previous=document.activeElement;
  let resolveClosed;const closed=new Promise(resolve=>{resolveClosed=resolve;});
  const dialog=document.createElement('dialog');dialog.className='switch-dialog discharge-dialog';dialog.setAttribute('aria-labelledby','discharge-title');
  dialog.innerHTML=`<h2 id="discharge-title">Discharge patient?</h2><div class="discharge-identity"><strong>${e(patient.name)}</strong><p class="small muted">${e(patientDescription(patient))}</p><p>Complaint: ${e(visit.complaint||'Not recorded')}</p><p class="small muted">In clinic since ${e(new Date(visit.startedAt).toLocaleString('en-PH',{timeZone:'Asia/Manila'}))}</p></div>${dirty?notice('Review unsaved care first','Save or discard the visit’s care changes before discharge.','warning'):''}<form class="form-stack" id="discharge-form">${select('Outcome','discharge-outcome',[['','Choose an outcome'],...outcomes],'',true)}<details class="optional-care"><summary>Final notes (optional)</summary>${noteField('Final notes','finalNotes',visit.finalNotes||'',false,'discharge-notes')}</details><p class="small muted">Confirming completes this visit and generates a summary email for the school nurse. Review its status in Messages. Email delivery is simulated in this preview.</p><div class="actions"><button class="button" type="button" data-stay autofocus>Keep in clinic</button><button class="button button-primary" type="submit" data-confirm${dirty?' disabled':''}>Confirm discharge</button></div>${dirty?button('Review visit','#/visits/'+encodeURIComponent(visit.id)):''}</form>`;
  const close=()=>{window.removeEventListener('hashchange',leave);dialog.close();dialog.remove();open=false;resolveClosed();if(previous?.isConnected)previous.focus({preventScroll:true});};
  const leave=()=>close();dialog.oncancel=event=>{event.preventDefault();close();};dialog.querySelector('[data-stay]').onclick=close;
  const reader=createScanReader();dialog.addEventListener('keydown',event=>{if(event.target.closest('input,textarea,select,[contenteditable]')){reader.reset();return;}if(reader.feed(event.key)){event.preventDefault();event.stopPropagation();}});
  const form=dialog.querySelector('form'),submit=form.querySelector('[data-confirm]');
  form.onsubmit=event=>{event.preventDefault();if(event.submitter!==submit||submit.disabled)return;submit.disabled=true;
   try{const actor=session.requireSession();let completed;repository.commit(s=>{completed=dischargeVisit(s,visit.id,{outcome:form.elements['discharge-outcome'].value,finalNotes:form.elements.finalNotes.value},actor,new Date().toISOString());},revision);close();location.hash='/visits/'+encodeURIComponent(completed.id);}
   catch(error){submit.disabled=dirty;if(error.code==='AUTH_REQUIRED'){close();location.hash='/session-ended';return;}formError(form,error.message);}
  };
  open=true;document.body.append(dialog);attachNoteCounters(dialog);window.addEventListener('hashchange',leave);dialog.showModal();dialog.querySelector('[data-stay]').focus();
  return closed;
 }
 return {confirm};
}
