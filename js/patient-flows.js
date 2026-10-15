import {identifyPatient,startOrResumeVisit,registerPatient,addPatientNote,editPatientNote,saveIntakeDraft,getIntakeEntry} from './clinic.js';
import {patientsView,patientResults,patientsHash,registerView,recordView,intakeView,historyRows,unknownView,identityPanel,noteView} from './views/patients.js';
import {card,heading,button,escapeHtml as e,field,formError} from './ui.js';

export function createPatientFlows({repository,session,rerender}){
  let revision=0,currentPatient=null,lastList='#/patients',registration={},dirty=false;
  const now=()=>new Date().toISOString();
  const commit=change=>{session.requireSession();const next=repository.commit(change,revision);revision=next.revision;return next;};
  const start=patientId=>{
    let result;commit(s=>{result=startOrResumeVisit(s,patientId,session.requireSession(),now());});
    location.hash=result.kind==='visit'?'/visits/'+encodeURIComponent(result.visit.id):'/visits/new?patient='+encodeURIComponent(patientId);
  };
  function view(path,params){
    const s=repository.readState();revision=s.revision;currentPatient=null;dirty=false;
    if(path==='/patients'){lastList=location.hash;return patientsView(s,params);}
    if(path==='/patients/register')return registerView(params,registration[params.get('type')||'student']||{});
    if(path==='/intake/unknown')return unknownView();
    if(path.startsWith('/patients/')){
      const p=s.patients.find(p=>p.id===decodeURIComponent(path.slice(10)));currentPatient=p?.id;
      return p?recordView(s,p,lastList):heading('Patient not found')+card('Choose another patient',button('Back to patients',lastList));
    }
    if(path.startsWith('/visits/')){
      const {patient:p,entry}=getIntakeEntry(s,decodeURIComponent(path.slice(8)),params.get('patient'));
      if(!p)return heading('Visit not found')+card('Choose a patient to start',button('Back to patients',lastList));
      currentPatient=p.id;dirty=Boolean(s.drafts[p.id]?.dirty);
      return intakeView(s,p,entry);
    }
    return null;
  }
  function attachNoteEditors(){
    document.querySelectorAll('[data-edit-note]').forEach(button=>button.onclick=()=>{
      const noteId=button.dataset.editNote,article=button.closest('article');
      const note=repository.readState().patients.find(p=>p.id===currentPatient)?.notes?.find(n=>n.id===noteId);
      if(!note)return;
      const restore=()=>{article.outerHTML=noteView(note);attachNoteEditors();document.querySelector(`[data-edit-note="${CSS.escape(noteId)}"]`)?.focus();};
      article.innerHTML=`<form class="form-stack"><div class="field"><label for="edit-note-${e(noteId)}">Edit follow-up note</label><textarea id="edit-note-${e(noteId)}" name="note" rows="3" required>${e(note.text)}</textarea></div><div class="actions"><button class="button button-primary" type="submit">Save changes</button><button class="button" type="button" data-cancel-note>Cancel</button></div></form>`;
      const form=article.querySelector('form');form.querySelector('textarea').focus();
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
    revision=repository.readState().revision;
    document.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>{try{start(b.dataset.start);}catch(error){formError(b.closest('section'),error.message);}});
    const identify=document.getElementById('identify-form');
    if(identify)identify.onsubmit=event=>{event.preventDefault();try{
      const value=new FormData(identify).get('card');const match=identifyPatient(repository.readState(),value);
      if(match.status==='match')start(match.patient.id);
      else if(match.status==='unknown')location.hash='/intake/unknown';
      else{location.hash='/patients?'+new URLSearchParams({q:value,notice:'ambiguous'});}
    }catch(error){formError(identify,error.message);}};
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
    const register=document.getElementById('register-form');
    if(register){
      register.oninput=event=>{
        registration[register.dataset.type]=Object.fromEntries(new FormData(register));
        if(['name','schoolId'].includes(event.target.name)){document.getElementById('duplicate-candidates').replaceChildren();register.querySelector('.form-error')?.remove();}
      };
      register.onsubmit=event=>{event.preventDefault();try{
        const input=Object.fromEntries(new FormData(register));const [grade,...rest]=(input.gradeSection||'').split(/\s*[·,]\s*/);
        let patient;commit(s=>{patient=registerPatient(s,{...input,type:register.dataset.type,grade,section:rest.join(' · ')},session.requireSession(),now());});
        delete registration[register.dataset.type];start(patient.id);
      }catch(error){
        formError(register,error.message);
        if(error.details?.candidates){const box=document.getElementById('duplicate-candidates');box.innerHTML=`<div class="result-list">${error.details.candidates.map(p=>card(p.name,button('Open existing record','#/patients/'+encodeURIComponent(p.id)))).join('')}</div>`+(error.code==='POSSIBLE_DUPLICATE'?field('Reason for registering separately','duplicateReason',{required:true,placeholder:'Explain how this is a different person'}):'');}
      }};
    }
    const note=document.getElementById('note-form');
    attachNoteEditors();
    if(note)note.onsubmit=event=>{event.preventDefault();try{commit(s=>addPatientNote(s,currentPatient,new FormData(note).get('note'),session.requireSession(),now()));rerender();document.getElementById('announcement').textContent='Follow-up note saved.';}catch(error){formError(note,error.message);}};
    const filters=document.getElementById('history-filters');
    if(filters){const update=()=>{const s=repository.readState();document.getElementById('history-results').innerHTML=historyRows(s,s.patients.find(p=>p.id===currentPatient),{date:filters.elements['history-date'].value,complaint:filters.elements['history-complaint'].value});};filters.oninput=update;filters.onchange=update;filters.onsubmit=event=>{event.preventDefault();update();};}
    const intake=document.getElementById('intake-form');
    if(intake&&!intake.querySelector('[readonly]')){
      intake.oninput=()=>{dirty=true;try{
        const values=Object.fromEntries(new FormData(intake));commit(s=>{const old=s.drafts[currentPatient]||s.visits.find(v=>v.patientId===currentPatient&&v.state!=='Completed')||{};s.drafts[currentPatient]={...old,patientId:currentPatient,...values,dirty:true};});
        document.getElementById('draft-status').textContent='Draft kept in this browser. Save the visit when ready.';
      }catch(error){formError(intake,error.message);}};
      intake.onsubmit=event=>{event.preventDefault();try{const visit=saveCurrent();if(location.hash.startsWith('#/visits/new'))location.hash='/visits/'+encodeURIComponent(visit.id);else rerender();document.getElementById('announcement').textContent='Ongoing visit saved.';}catch(error){formError(intake,error.message);}};
    }
  }
  function saveCurrent(){const form=document.getElementById('intake-form');let visit;commit(s=>{visit=saveIntakeDraft(s,currentPatient,Object.fromEntries(new FormData(form)),session.requireSession(),now());});dirty=false;return visit;}
  async function beforeLeave(){
    if(!dirty||!document.getElementById('intake-form'))return true;
    return new Promise(resolve=>{
      const previous=document.activeElement;const dialog=document.createElement('dialog');dialog.className='switch-dialog';dialog.setAttribute('aria-labelledby','switch-title');
      dialog.innerHTML=`<h2 id="switch-title">Save your visit before leaving</h2><p>You have changes that have not been saved as a visit.</p><div class="actions"><button class="button button-primary" data-choice="save">Save and switch</button><button class="button" data-choice="stay" autofocus>Keep editing</button><button class="button" data-choice="discard">Discard and switch</button></div>`;
      const finish=result=>{dialog.close();dialog.remove();if(!result)previous?.focus();resolve(result);};
      dialog.oncancel=event=>{event.preventDefault();finish(false);};
      dialog.onclick=event=>{const choice=event.target.closest('[data-choice]')?.dataset.choice;if(!choice)return;
        if(choice==='stay')return finish(false);
        try{if(choice==='save')saveCurrent();else{commit(s=>{delete s.drafts[currentPatient];});dirty=false;}finish(true);}
        catch(error){finish(false);formError(document.getElementById('intake-form'),error.message,'complaint');}
      };document.body.append(dialog);dialog.showModal();
    });
  }
  return {view,attach,beforeLeave};
}
