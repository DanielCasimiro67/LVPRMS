import {createEditIdentity} from './edit-identity.js';
import {createDischargeFlow} from './discharge-flow.js';
import {scanVisitAction} from './discharge.js';
import {noteField,attachNoteCounters} from './note-ui.js';
import {createProfileFlows} from './profile-flows.js';
import {startOrResumeVisit,registerPatient,addPatientNote,editPatientNote,getIntakeEntry} from './clinic.js';
import {patientsView,patientResults,patientsHash,registerView,recordView,historyRows,unknownView,identityPanel,noteView} from './views/patients.js';
import {card,heading,button,escapeHtml as e,field,formError} from './ui.js';
import {saveVisit,completeVisit,correctVisit,careValues,supplyCatalog} from './visits.js';
import {visitView,completionView,completedView,readCareForm,supplyRow,visitHash} from './views/visits.js';
import {attachIntake,createScanGate} from './intake.js';

export function createPatientFlows({repository,session,rerender}){
  const scanGate=createScanGate();
  const discharge=createDischargeFlow({repository,session});
  const editIdentity=createEditIdentity({repository,session,rerender});
  const profileFlows=createProfileFlows({repository,session,editIdentity});
  let protectedRoute=null;
  let revision=0,currentPatient=null,lastList='#/patients',dirty=false,currentEntry=null,currentVisitId='',correcting=false;
  const now=()=>new Date().toISOString();
  window.addEventListener('beforeunload',event=>{if([...document.querySelectorAll('form[data-note-editor] textarea, #note-form textarea')].some(input=>input.value!==input.defaultValue)){event.preventDefault();event.returnValue='';}});
  const commit=change=>{session.requireSession();const next=repository.commit(change,revision);revision=next.revision;return next;};
  const start=(patientId,{automatic=false}={})=>{
    if(automatic){session.requireSession();const action=scanVisitAction(repository.readState(),patientId);if(action.kind==='discharge')return discharge.confirm(action.visitId);}
    const previousDraft=repository.readState().drafts[patientId];let result;commit(s=>{result=startOrResumeVisit(s,patientId,session.requireSession(),now());});
    const target=result.kind==='visit'?'/visits/'+encodeURIComponent(result.visit.id):'/visits/new?patient='+encodeURIComponent(patientId);
    if(!automatic&&(result.kind==='visit'||previousDraft)){const dialog=document.createElement('dialog');dialog.className='switch-dialog';dialog.setAttribute('aria-label','Resume existing visit');dialog.innerHTML='<h2>Continue the existing visit?</h2><p>This patient already has ongoing care or a saved draft.</p><div class="actions"><button class="button button-primary" data-resume>Resume visit</button><button class="button" data-cancel>Cancel</button></div>';const close=()=>{dialog.close();dialog.remove();};dialog.querySelector('[data-cancel]').onclick=close;dialog.querySelector('[data-resume]').onclick=()=>{close();location.hash=target;};document.body.append(dialog);dialog.showModal();}else location.hash=target;
  };
  function view(path,params){
    const s=repository.readState();revision=s.revision;currentPatient=null;dirty=false;protectedRoute=null;
    if(!/^\/patients\/[^/]+\/edit$/.test(path)&&!path.endsWith('/correct'))editIdentity.clear();
    if(path==='/patients'){lastList=location.hash;return patientsView(s,params);}
    const profilePage=profileFlows.view(path,params);if(profilePage!==null)return profilePage;
    if(path==='/intake/unknown')return unknownView();
    if(path.startsWith('/patients/')){
      const p=s.patients.find(p=>p.id===decodeURIComponent(path.slice(10)));currentPatient=p?.id;
      return p?recordView(s,p,lastList):heading('Patient not found')+card('Choose another patient',button('Back to patients',lastList));
    }
    if(path.startsWith('/visits/')){
      const visitId=decodeURIComponent(path.slice(8).split('/')[0]);
      const {patient:p,entry}=getIntakeEntry(s,visitId,params.get('patient'));
      if(!p)return heading('Visit not found')+card('Choose a patient to start',button('Back to patients',lastList));
      const saved=s.visits.find(v=>v.id===visitId)||(visitId==='new'?s.visits.find(v=>v.patientId===p.id&&v.state!=='Completed'):null);
      currentPatient=p.id;currentVisitId=saved?.id||'new';correcting=path.endsWith('/correct');
      if(saved?.state==='Completed'&&!correcting)return completedView(s,p,saved);
      if(correcting&&!saved)return heading('Visit not found')+button('Back to Today','#/today');
      if(correcting){const locked=editIdentity.route(path,p);if(locked){protectedRoute={path,p};return locked;}}
      currentEntry=correcting?{...saved,...s.correctionDrafts?.[saved.id]}:entry;
      dirty=Boolean(correcting?s.correctionDrafts?.[saved.id]?.dirty:s.drafts[p.id]?.dirty);
      if(path.endsWith('/complete'))return completionView(p,currentEntry);
      return visitView(s,p,currentEntry,{correcting});
    }
    return null;
  }
  function attachNoteEditors(){
    const editing=Boolean(document.querySelector('[data-note-editor]'));
    document.querySelectorAll('[data-edit-note], #note-form textarea, #note-form button').forEach(control=>{control.disabled=editing;});
    document.querySelectorAll('[data-edit-note]').forEach(button=>button.onclick=async()=>{
      const selected=repository.readState().patients.find(p=>p.id===currentPatient);
      if(!selected||!await editIdentity.confirm(selected))return;
      const noteId=button.dataset.editNote,article=button.closest('article');
      const note=repository.readState().patients.find(p=>p.id===currentPatient)?.notes?.find(n=>n.id===noteId);
      if(!note)return;
      const restore=()=>{article.outerHTML=noteView(note);attachNoteEditors();document.querySelector(`[data-edit-note="${CSS.escape(noteId)}"]`)?.focus();};
      article.innerHTML=`<form class="form-stack">${noteField('Edit follow-up note','note',note.text,true,'edit-note-'+noteId)}<div class="actions"><button class="button button-primary" type="submit">Save changes</button><button class="button" type="button" data-cancel-note>Cancel</button></div></form>`;
      const form=article.querySelector('form');form.dataset.noteEditor='true';attachNoteEditors();attachNoteCounters(form);form.querySelector('textarea').focus();
      form.querySelector('[data-cancel-note]').onclick=restore;
      form.onsubmit=event=>{event.preventDefault();try{
        const state=commit(s=>editPatientNote(s,currentPatient,noteId,new FormData(form).get('note'),session.requireSession(),now()));
        article.outerHTML=noteView(state.patients.find(p=>p.id===currentPatient).notes.find(n=>n.id===noteId));
        attachNoteEditors();document.querySelector(`[data-edit-note="${CSS.escape(noteId)}"]`)?.focus();
        document.getElementById('announcement').textContent='Follow-up note updated.';
      }catch(error){formError(form,error.message,'note');}};
    });
  }
  function attach(){
    editIdentity.retain(location.hash.slice(1).split('?')[0]);
    revision=repository.readState().revision;
    if(protectedRoute?.path!==location.hash.slice(1).split('?')[0])protectedRoute=null;
    if(protectedRoute){editIdentity.attachRoute(protectedRoute.path,protectedRoute.p);return;}
    document.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>{try{start(b.dataset.start);}catch(error){formError(b.closest('section'),error.message);}});
    document.querySelectorAll('[data-discharge]').forEach(b=>b.onclick=()=>{try{discharge.confirm(b.dataset.discharge);}catch(error){if(error.code==='AUTH_REQUIRED')location.hash='/session-ended';else formError(b.closest('section'),error.message);}});
    attachIntake({repository,session,start,gate:scanGate});
    const search=document.getElementById('patient-search');
    if(search){
      const update=()=>{const params=new URLSearchParams(location.hash.split('?')[1]);const type=params.get('type')||'all',query=search.elements['patient-query'].value;
        search.querySelector('.form-error')?.remove();
        const hash=patientsHash(type,query);history.replaceState(null,'',hash);lastList=hash;
        document.getElementById('patient-results').innerHTML=patientResults(repository.readState(),{type,query});
        document.querySelectorAll('[data-category]').forEach(a=>a.href=patientsHash(a.dataset.category,query));};
      search.oninput=update;search.onsubmit=event=>{event.preventDefault();update();};
      if(new URLSearchParams(location.hash.split('?')[1]).get('notice')==='ambiguous')formError(search,'More than one patient matches this ID. Open the correct record after checking the patient’s identity.');
    }
    profileFlows.attach();
    const note=document.getElementById('note-form');
    attachNoteEditors();
    if(note)note.onsubmit=event=>{event.preventDefault();try{commit(s=>addPatientNote(s,currentPatient,new FormData(note).get('note'),session.requireSession(),now()));rerender();document.getElementById('announcement').textContent='Follow-up note saved.';}catch(error){formError(note,error.message);}};
    const filters=document.getElementById('history-filters');
    if(filters){const update=()=>{const s=repository.readState();document.getElementById('history-results').innerHTML=historyRows(s,s.patients.find(p=>p.id===currentPatient),{date:filters.elements['history-date'].value,complaint:filters.elements['history-complaint'].value});};filters.oninput=update;filters.onchange=update;filters.onsubmit=event=>{event.preventDefault();update();};}
    const intake=document.getElementById('intake-form'),completion=document.getElementById('complete-form');
    function keepDraft(values,form){
      dirty=true;
      try{commit(s=>{
        if(correcting){(s.correctionDrafts??={})[currentVisitId]={...currentEntry,...values,dirty:true};}
        else s.drafts[currentPatient]={...currentEntry,...s.drafts[currentPatient],id:currentEntry.id||s.drafts[currentPatient]?.id||crypto.randomUUID(),...values,dirty:true};
      });const status=document.getElementById('draft-status');if(status)status.textContent='Draft kept in this browser. Save the visit when ready.';
      }catch(error){formError(form,error.message);}
    }
    if(intake){
      const toggle=()=>{const other=intake.elements.complaintChoice.value==='Other';intake.querySelector('#other-complaint').hidden=!other;intake.elements.otherComplaint.required=other;};toggle();
      let index=intake.querySelectorAll('[data-supply-row]').length;
      const supplies=()=>intake.querySelectorAll('[data-remove-supply]').forEach(b=>b.onclick=()=>{b.closest('[data-supply-row]').remove();keepDraft(readCareForm(intake),intake);});supplies();
      intake.querySelector('#add-supply').onclick=()=>{const state=repository.readState();intake.querySelector('#supply-rows').insertAdjacentHTML('beforeend',supplyRow(state.inventory?.length?state.inventory:supplyCatalog(),{},index++));supplies();};
      intake.querySelectorAll('input[type=number]').forEach(x=>{if(!x.closest('[data-supply-row]'))x.step=x.name==='temperature'?'any':'1';});
      intake.oninput=()=>{toggle();const items=repository.readState().inventory;intake.querySelectorAll('[data-supply-row]').forEach(row=>{const item=items.find(i=>i.id===row.querySelector('select').value),input=row.querySelector('input');input.step=item?.step||1;input.min=item?.step||1;});keepDraft(readCareForm(intake),intake);};
      intake.onsubmit=event=>{event.preventDefault();try{
        if(event.submitter?.dataset.intent==='complete'){
          const values=readCareForm(intake);careValues(repository.readState(),values,{completing:true});
          commit(s=>{s.drafts[currentPatient]={...currentEntry,...s.drafts[currentPatient],id:currentEntry.id||s.drafts[currentPatient]?.id||crypto.randomUUID(),...values,dirty:true};});dirty=false;
          location.hash=visitHash(currentEntry,repository.readState().patients.find(p=>p.id===currentPatient),'/complete');return;
        }
        const wasCorrection=correcting;const visit=saveCurrent();location.hash='/visits/'+encodeURIComponent(visit.id);rerender();
        document.getElementById('announcement').textContent=wasCorrection?'Visit corrected. Original history kept.':'Ongoing visit saved.';
      }catch(error){formError(intake,error.message);}};
      intake.querySelector('[data-cancel-correction]')?.addEventListener('click',event=>{event.preventDefault();try{commit(s=>{delete s.correctionDrafts?.[currentVisitId];});dirty=false;location.hash='/visits/'+encodeURIComponent(currentVisitId);}catch(error){formError(intake,error.message);}});
    }
    if(completion){
      completion.oninput=()=>keepDraft(Object.fromEntries(new FormData(completion)),completion);
      completion.onsubmit=event=>{event.preventDefault();try{
        let visit;const values={...currentEntry,...Object.fromEntries(new FormData(completion)),patientId:currentPatient,visitId:currentVisitId==='new'?currentEntry.id:currentVisitId};
        commit(s=>{visit=completeVisit(s,values,session.requireSession(),now());});dirty=false;location.hash='/visits/'+encodeURIComponent(visit.id);
      }catch(error){formError(completion,error.message);}};
      completion.querySelector('a')?.addEventListener('click',()=>{dirty=false;});
    }
  }
  function saveCurrent(){const form=document.getElementById('intake-form')||document.getElementById('complete-form');let visit;
    const values=document.getElementById('intake-form')?readCareForm(form):{...currentEntry,...Object.fromEntries(new FormData(form))};
    values.patientId=currentPatient;values.visitId=currentVisitId==='new'?'':currentVisitId;
    commit(s=>{visit=correcting?correctVisit(s,currentVisitId,values,values.reason,session.requireSession(),now()):saveVisit(s,values,session.requireSession(),now());});dirty=false;return visit;
  }
  async function beforeLeave(){
    if(!await profileFlows.beforeLeave())return false;
    const noteForms=[...document.querySelectorAll('form[data-note-editor], #note-form')].filter(f=>{const input=f.querySelector('textarea');return input&&input.value!==input.defaultValue;});
    if(noteForms.length){const leave=await new Promise(resolve=>{const d=document.createElement('dialog');d.className='switch-dialog';d.setAttribute('aria-label','Unsaved follow-up note');d.innerHTML='<h2>Leave this note?</h2><p>Your note changes have not been saved.</p><div class="actions"><button class="button button-primary" data-stay autofocus>Keep editing</button><button class="button" data-discard>Discard changes</button></div>';const close=v=>{d.close();d.remove();resolve(v);if(!v)noteForms[0].querySelector('textarea').focus();};d.querySelector('[data-stay]').onclick=()=>close(false);d.querySelector('[data-discard]').onclick=()=>close(true);d.oncancel=e=>{e.preventDefault();close(false);};document.body.append(d);d.showModal();});if(!leave)return false;}
    if(!dirty||!document.querySelector('#intake-form, #complete-form'))return true;
    return new Promise(resolve=>{
      const previous=document.activeElement;const dialog=document.createElement('dialog');dialog.className='switch-dialog';dialog.setAttribute('aria-labelledby','switch-title');
      dialog.innerHTML=`<h2 id="switch-title">Save your visit before leaving</h2><p>You have changes that have not been saved as a visit.</p><div class="actions"><button class="button button-primary" data-choice="save">Save and switch</button><button class="button" data-choice="stay" autofocus>Keep editing</button><button class="button" data-choice="discard">Discard and switch</button></div>`;
      const finish=result=>{dialog.close();dialog.remove();if(!result)previous?.focus();resolve(result);};
      dialog.oncancel=event=>{event.preventDefault();finish(false);};
      dialog.onclick=event=>{const choice=event.target.closest('[data-choice]')?.dataset.choice;if(!choice)return;
        if(choice==='stay')return finish(false);
        try{if(choice==='save')saveCurrent();else{commit(s=>{if(correcting)delete s.correctionDrafts?.[currentVisitId];else delete s.drafts[currentPatient];});dirty=false;}finish(true);}
        catch(error){finish(false);formError(document.querySelector('#intake-form, #complete-form'),error.message);}
      };document.body.append(dialog);dialog.showModal();
    });
  }
  return {view,attach,beforeLeave};
}
