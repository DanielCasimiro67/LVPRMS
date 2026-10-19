import {prepareReferral,appendReferralActivity,transferReferral} from './referrals.js';
import {referralsView,prepareView,referralView,referralFormView,referralPrintView} from './views/follow-up.js';
import {heading,button,notice,formError} from './ui.js';
export function createReferralFlows({repository,session}){
 let revision=0,current=null,visitId=null,action='',requestId='',dirty=false;
 function view(path,params){
  if(!path.startsWith('/referrals'))return null;
  const s=repository.readState();revision=s.revision;dirty=false;current=null;requestId=crypto.randomUUID();action='';visitId=null;
  if(path==='/referrals')return referralsView(s,params);
  if(path==='/referrals/new'){
   visitId=params.get('visit');const v=s.visits.find(v=>v.id===visitId),p=s.patients.find(p=>p.id===v?.patientId);
   return v&&p?prepareView(s,v,p):heading('Save the visit first')+notice('A saved visit is required','Return to the patient’s visit and choose Save visit before preparing a referral.')+button('Back to Today','#/today');
  }
  const parts=path.split('/'),id=decodeURIComponent(parts[2]);action=parts[3]||'';current=s.referrals.find(r=>r.id===id);
  if(!current)return heading('Referral not found')+button('Back to referrals','#/referrals');
  const v=s.visits.find(v=>v.id===current.visitId),p=s.patients.find(p=>p.id===(v?.patientId||current.patientId));
  if(!p)return heading('Patient not found')+button('Back to referrals','#/referrals');
  if(!v)return referralView(s,current,null,p);
  if(action==='print')return referralPrintView(s,current,v,p);
  if(action){const allowed=action==='transfer'?current.state!=='Resolved'&&v.state!=='Completed':action==='contact'?['Prepared','Awaiting doctor reply'].includes(current.state):action==='reply'?current.state==='Awaiting doctor reply':['actions','resolve'].includes(action)&&current.state!=='Resolved';if(!allowed)return heading('Action unavailable')+notice('The referral status has changed','Return to the referral to review its saved history.')+button('Back to referral','#/referrals/'+encodeURIComponent(id));return referralFormView(current,p,action,session.requireSession(),new Date().toISOString(),{visit:v,dirtyCare:Boolean(s.drafts[p.id]?.dirty)});}
  return referralView(s,current,v,p);
 }
 function attach(){
  const print=document.getElementById('print-referral');if(print)print.onclick=()=>{if(!session.current()){location.hash='/session-ended';return;}window.print();};
  const form=document.getElementById('referral-form');if(!form)return;
  form.oninput=()=>dirty=true;
  form.onsubmit=event=>{event.preventDefault();const submit=form.querySelector('[type=submit]');submit.disabled=true;
   try{if(action==='transfer'&&(event.submitter!==submit||submit.dataset.blocked==='true')){submit.disabled=submit.dataset.blocked==='true';return;}const actor=session.requireSession(),input={...Object.fromEntries(new FormData(form)),id:requestId};if(input.occurredAt)input.occurredAt+=':00+08:00';let referral;
    repository.commit(s=>{referral=action==='transfer'?transferReferral(s,current.id,{...input,confirmed:input.confirmed==='on'},actor,new Date().toISOString()):current?appendReferralActivity(s,current.id,{...input,kind:action==='actions'?'action':action},actor,new Date().toISOString()):prepareReferral(s,visitId,input,actor,new Date().toISOString());},revision);
    dirty=false;location.hash='/referrals/'+encodeURIComponent(referral.id);document.getElementById('announcement').textContent=action==='transfer'?'Transfer recorded. Visit completed; follow-up remains available.':'Referral saved.';
   }catch(error){if(error.code==='AUTH_REQUIRED')location.hash='/session-ended';else formError(form,error.message);submit.disabled=false;}
  };
 }
 function beforeLeave(){
  if(!dirty||!document.getElementById('referral-form'))return true;
  return new Promise(resolve=>{const dialog=document.createElement('dialog');dialog.className='switch-dialog';dialog.setAttribute('aria-label','Unsaved referral changes');dialog.innerHTML='<h2>Leave these changes?</h2><p>Your referral entries have not been saved.</p><div class="actions"><button class="button button-primary" data-stay autofocus>Keep editing</button><button class="button" data-discard>Discard changes</button></div>';const close=answer=>{dialog.close();dialog.remove();if(!answer)document.querySelector('#referral-form input, #referral-form textarea')?.focus();resolve(answer);};dialog.querySelector('[data-stay]').onclick=()=>close(false);dialog.querySelector('[data-discard]').onclick=()=>{dirty=false;close(true);};dialog.oncancel=event=>{event.preventDefault();close(false);};document.body.append(dialog);dialog.showModal();});
 }
 window.addEventListener('beforeunload',event=>{if(dirty&&document.getElementById('referral-form')){event.preventDefault();event.returnValue='';}});
 return {view,attach,beforeLeave};
}
