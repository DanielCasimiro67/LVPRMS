import {createProfile,updateProfile,profileDraft,inferProfileType,schoolRecords,sections} from './profiles.js';
import {educationFields,profileFormView} from './views/profiles.js';
import {startOrResumeVisit} from './clinic.js';
import {heading,button,notice,field,formError,escapeHtml as e} from './ui.js';
export function createProfileFlows({repository,session,editIdentity}){
 let lockedPath=null;
 let revision=0,current=null,draft={},dirty=false,context='',cache=new Map();
 const read=form=>({...draft,...Object.fromEntries(new FormData(form))});
 function view(path,params){
  lockedPath=null;
  const editing=/^\/patients\/[^/]+\/edit$/.test(path);if(path!=='/patients/register'&&!editing)return null;
  const s=repository.readState();revision=s.revision;current=editing?s.patients.find(p=>p.id===decodeURIComponent(path.split('/')[2])):null;
  if(editing&&!current)return heading('Patient not found')+button('Back to patients','#/patients');
  if(editing){const locked=editIdentity.route(path,current);if(locked){lockedPath=path;return locked;}}
  context=current?'edit:'+current.id:'new:'+(params.get('rfid')||params.get('schoolId')||'');
  draft=cache.get(context)|| (current?profileDraft(s,current):{departmentGroup:params.get('type')==='visitor'?'none':'',schoolId:params.get('schoolId')||'',rfid:params.get('rfid')||'',name:'',managed:false});dirty=cache.has(context);
  return profileFormView(s,draft,{editing,patient:current});
 }
 function attach(){
  if(lockedPath){editIdentity.attachRoute(lockedPath,current);return;}
  const form=document.getElementById('profile-form');if(!form)return;
  const status=()=>{
   const type=inferProfileType(draft),category=document.getElementById('profile-category');category.textContent=type?'Patient category: '+({student:'Student',staff:'Staff',visitor:'Visitor'}[type]):'Choose a department to identify the patient category.';
   const school=form.querySelector('#school-profile-fields'),hideSchool=draft.departmentGroup==='none'&&!draft.schoolId&&!draft.rfid;if(hideSchool&&school.contains(document.activeElement))form.elements.departmentGroup.focus();school.hidden=hideSchool;
   const student=type==='student'&&!draft.managed;for(const name of ['schoolId','rfid']){form.elements[name].required=student;form.querySelector('label[for="'+name+'"]').innerHTML=(name==='schoolId'?'School ID':'RFID')+(student?' <span aria-hidden="true">*</span>':'');}
   const missing=[!draft.emergencyName?.trim()?'contact name':'',!draft.emergencyPhone?.trim()?'contact number':''].filter(Boolean);
   document.getElementById('profile-completion').innerHTML=missing.length?notice('Emergency contact incomplete','Missing '+missing.join(' and ')+'. You can save this record and finish it later.','warning'):notice('Emergency contact recorded','Check the details before saving.','success');
  };
  const remember=()=>{dirty=true;cache.set(context,{...draft});};
  const renderEducation=()=>{form.querySelector('#education-fields').innerHTML=educationFields(repository.readState(),draft);};
  form.oninput=event=>{
   draft=read(form);if(event.target.name==='departmentGroup'){for(const k of ['program','year','grade','section'])draft[k]='';renderEducation();}
   if(event.target.name==='grade'){draft.section='';if(form.elements.section)form.elements.section.value='';const list=form.querySelector('#section-choices');if(list)list.innerHTML=sections(repository.readState(),draft.grade).map(v=>`<option value="${e(v)}"></option>`).join('');}
   if(event.target.name==='program'){draft.year='';if(form.elements.year)form.elements.year.value='';}
   remember();
   if(['name','schoolId','rfid'].includes(event.target.name)){form.querySelector('.form-error')?.remove();document.getElementById('duplicate-candidates').replaceChildren();}
   status();
  };
  const lookup=document.getElementById('find-school-record');if(lookup){form.elements.schoolId.setAttribute('list','school-record-options');lookup.onclick=()=>{
   draft=read(form);const s=repository.readState(),query=(draft.schoolId||draft.rfid||'').trim().toLowerCase(),box=document.getElementById('school-match');
   const rows=schoolRecords(s).filter(r=>[r.schoolId,r.rfid].some(v=>v?.toLowerCase()===query));
   if(!query){box.innerHTML=notice('Enter an ID first','Enter the school ID or RFID to find saved school details.');return;}
   if(rows.length!==1){box.innerHTML=notice(rows.length?'Check the school records':'School record not found',rows.length?'More than one saved identity matches. Find the existing patient instead.':'You can enter the details below.');return;}
   const row=rows[0];if(row.patientId){box.innerHTML=notice('Patient already has a clinic record','Open the existing record to keep the history together.')+button('Open existing record','#/patients/'+encodeURIComponent(row.patientId),{primary:true});return;}
   if(draft.rfid&&draft.rfid!==row.rfid){box.innerHTML=notice('RFID does not match','The school record has a different card. Check the card before using these details.','warning');return;}
   draft={...draft,...row,managed:true};remember();const oldContact={contact:draft.contact,emergencyName:draft.emergencyName,emergencyPhone:draft.emergencyPhone,emergencyRelationship:draft.emergencyRelationship};
   document.getElementById('main').querySelector('.page-heading').nextElementSibling?.remove();
   // Re-render only after explicit school lookup; entered contact values remain in the cached draft.
   const container=document.createElement('div');container.innerHTML=profileFormView(s,{...draft,...oldContact},{editing:false});
   const main=document.getElementById('main');main.querySelector('#profile-form')?.remove();main.querySelector('.page-heading')?.remove();while(container.firstChild)main.append(container.firstChild);attach();main.querySelector('#name')?.focus();
  };}
  form.onsubmit=event=>{event.preventDefault();const submit=form.querySelector('[type=submit]');submit.disabled=true;
   try{const actor=session.requireSession(),input=read(form),at=new Date().toISOString();let saved;
    repository.commit(s=>{saved=current?updateProfile(s,current.id,input,actor,at):createProfile(s,input,actor,at);if(!current)startOrResumeVisit(s,saved.id,actor,at);},revision);
    dirty=false;cache.delete(context);location.hash=current?'/patients/'+encodeURIComponent(saved.id):'/visits/new?patient='+encodeURIComponent(saved.id);document.getElementById('announcement').textContent=current?'Patient details updated.':'Patient registered.';
   }catch(error){if(error.code==='AUTH_REQUIRED'){location.hash='/session-ended';return;}formError(form,error.message);if(error.details?.candidates){document.getElementById('duplicate-candidates').innerHTML=error.details.candidates.map(p=>button('Open '+p.name,'#/patients/'+encodeURIComponent(p.id))).join('')+(error.code==='POSSIBLE_DUPLICATE'?field('Reason for registering separately','duplicateReason',{required:true}):'');}submit.disabled=false;}
  };status();
 }
 function beforeLeave(){if(!dirty||!document.getElementById('profile-form'))return true;return new Promise(resolve=>{const dialog=document.createElement('dialog');dialog.className='switch-dialog';dialog.setAttribute('aria-label','Unsaved patient details');dialog.innerHTML='<h2>Leave these changes?</h2><p>The patient details have not been saved.</p><div class="actions"><button class="button button-primary" data-stay autofocus>Keep editing</button><button class="button" data-discard>Discard changes</button></div>';const close=value=>{dialog.close();dialog.remove();if(!value)document.querySelector('#profile-form input:not([type=hidden])')?.focus();resolve(value);};dialog.querySelector('[data-stay]').onclick=()=>close(false);dialog.querySelector('[data-discard]').onclick=()=>{dirty=false;cache.delete(context);close(true);};dialog.oncancel=event=>{event.preventDefault();close(false);};document.body.append(dialog);dialog.showModal();});}
 window.addEventListener('beforeunload',event=>{if(dirty&&document.getElementById('profile-form')){event.preventDefault();event.returnValue='';}});
 return {view,attach,beforeLeave};
}
