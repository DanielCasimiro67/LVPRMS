import {identifyPatient} from './clinic.js';
import {heading,card,field,button,formError,escapeHtml as e} from './ui.js';
export function matchesPatientIdentity(state,patientId,value){
 const text=String(value??'').trim(),patient=state.patients.find(p=>p.id===patientId);if(!patient||!text)return false;
 if(text===patient.id)return true;
 const result=identifyPatient(state,text);return result.status==='match'&&result.patient.id===patientId;
}
const content=p=>`<p>Confirm the identity of <strong>${e(p.name)}</strong> before editing. Your signed-in clinic account is still required to save changes.</p><p class="small muted">Patient ID: ${e(p.id)}${p.schoolId?' · School ID: '+e(p.schoolId):''}</p><form id="edit-identity-form" class="form-stack">${field('RFID, school ID or patient ID','edit-identifier',{required:true})}<div class="actions"><button type="submit" class="button button-primary">Confirm patient</button><button type="button" class="button" data-cancel-identity>Cancel</button></div></form>`;
export function createEditIdentity({repository,session,rerender}){
 let grant=null;
 const operator=()=>JSON.stringify(session.requireSession());
 const approved=path=>grant?.path===path&&grant.operator===operator();
 function route(path,p){if(grant?.path!==path)grant=null;if(approved(path))return null;return heading('Confirm patient before editing')+card('Check patient identity',content(p),{symbol:'patients'});}
 function bind(root,p,success,cancel){const form=root.querySelector('#edit-identity-form');if(!form)return;form.onsubmit=event=>{event.preventDefault();try{const who=operator();if(!matchesPatientIdentity(repository.readState(),p.id,form.elements['edit-identifier'].value))throw Error('This ID does not uniquely match the selected patient. Check the card or patient ID and try again.');success(who);}catch(error){formError(form,error.message,'edit-identifier');}};form.querySelector('[data-cancel-identity]').onclick=cancel;}
 function attachRoute(path,p){bind(document,p,who=>{grant={path,operator:who};rerender();},()=>{location.hash='/patients/'+encodeURIComponent(p.id);});}
 function confirm(p){return new Promise(resolve=>{const dialog=document.createElement('dialog');dialog.className='switch-dialog';dialog.setAttribute('aria-label','Confirm patient before editing');dialog.innerHTML='<h2>Confirm patient before editing</h2>'+content(p);const leave=()=>close(false);const close=value=>{window.removeEventListener('hashchange',leave);dialog.close();dialog.remove();resolve(value);};bind(dialog,p,()=>close(true),()=>close(false));dialog.oncancel=event=>{event.preventDefault();close(false);};window.addEventListener('hashchange',leave);document.body.append(dialog);dialog.showModal();dialog.querySelector('input').focus();});}
 return {route,attachRoute,confirm,approved,retain:path=>{if(grant?.path!==path)grant=null;},clear:()=>{grant=null;}};
}
