import {createMessageService,recordManualFollowUp} from './messages.js';
import {messagesView,messageView} from './views/messages.js';
import {heading,button,formError} from './ui.js';
export function createMessageFlows({repository,session,rerender}){
 const service=createMessageService({repository});let revision=0,eventId=null,dirty=false;
 function view(path,params){
  if(path!=='/messages'&&!path.startsWith('/messages/'))return null;
  const s=repository.readState();revision=s.revision;eventId=null;dirty=false;
  if(path==='/messages')return messagesView(s,params);
  eventId=decodeURIComponent(path.slice(10));const m=s.messages.find(m=>m.id===eventId);
  return m?messageView(s,m):heading('Message not found')+button('Back to Messages','#/messages');
 }
 const feedback=error=>{if(error.code==='AUTH_REQUIRED'){location.hash='/session-ended';return;}const box=document.getElementById('message-feedback')||document.getElementById('page-feedback');if(box)box.textContent=error.message;};
 function attach(){
  for(const [id,action] of [['retry-message','retryMessage'],['check-message','processMessage']]){
   const control=document.getElementById(id);if(control)control.onclick=()=>{if(dirty){feedback({message:'Save or cancel the manual follow-up before updating message status.'});document.querySelector('#manual-follow-up textarea')?.focus();return;}control.disabled=true;try{session.requireSession();service[action](eventId,revision);rerender();document.getElementById('announcement').textContent='Message status updated.';}catch(error){feedback(error);control.disabled=false;}};
  }
  const form=document.getElementById('manual-follow-up');
  if(form){form.oninput=()=>dirty=Boolean(form.elements.note.value);document.getElementById('show-follow-up').onclick=()=>{form.hidden=false;form.elements.note.focus();};document.getElementById('cancel-follow-up').onclick=()=>{form.reset();form.elements.note.dispatchEvent(new Event('input',{bubbles:true}));dirty=false;form.hidden=true;document.getElementById('show-follow-up').focus();};form.onsubmit=event=>{event.preventDefault();try{const actor=session.requireSession();repository.commit(s=>recordManualFollowUp(s,eventId,form.elements.note.value,actor,new Date().toISOString()),revision);dirty=false;rerender();document.getElementById('announcement').textContent='Manual follow-up saved.';}catch(error){if(error.code==='AUTH_REQUIRED')feedback(error);else formError(form,error.message,'note');}};}
  // Only persisted completion events are processed. One queued callback; no background form rerender.
  const path=location.hash.split('?')[0];
  if(path.startsWith('#/messages')||(/^#\/visits\/[^/]+$/.test(path)&&document.querySelector('h1')?.textContent==='Visit completed')){
   setTimeout(()=>{
    if(location.hash.split('?')[0]!==path||!session.current()||document.querySelector('#manual-follow-up:not([hidden])'))return;
    try{const pending=repository.readState().messages.filter(m=>m.kind==='nurse-summary'&&m.status==='pending'&&!m.attempts?.length);if(!pending.length)return;for(const m of pending)service.processMessage(m.id);rerender();}catch(error){feedback(error);}
   },350);
  }
 }
 function beforeLeave(){
  if(!dirty||!document.getElementById('manual-follow-up'))return true;
  return new Promise(resolve=>{const d=document.createElement('dialog');d.className='switch-dialog';d.setAttribute('aria-label','Unsaved message follow-up');d.innerHTML='<h2>Leave this follow-up?</h2><p>Your manual follow-up has not been saved.</p><div class="actions"><button class="button button-primary" data-stay autofocus>Keep editing</button><button class="button" data-discard>Discard changes</button></div>';const close=value=>{d.close();d.remove();if(!value)document.querySelector('#manual-follow-up textarea')?.focus();resolve(value);};d.querySelector('[data-stay]').onclick=()=>close(false);d.querySelector('[data-discard]').onclick=()=>{dirty=false;close(true);};d.oncancel=e=>{e.preventDefault();close(false);};document.body.append(d);d.showModal();});
 }
 window.addEventListener('beforeunload',e=>{if(dirty&&document.getElementById('manual-follow-up')){e.preventDefault();e.returnValue='';}});
 return {view,attach,beforeLeave};
}
