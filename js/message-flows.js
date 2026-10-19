import {createMessageService,recordManualFollowUp} from './messages.js';
import {messagesView,messageView} from './views/messages.js';
import {heading,button,formError} from './ui.js';
export function createMessageFlows({repository,session,rerender}){
 const service=createMessageService({repository});let revision=0,eventId=null;
 function view(path,params){
  if(path!=='/messages'&&!path.startsWith('/messages/'))return null;
  const s=repository.readState();revision=s.revision;eventId=null;
  if(path==='/messages')return messagesView(s,params);
  eventId=decodeURIComponent(path.slice(10));const m=s.messages.find(m=>m.id===eventId);
  return m?messageView(s,m):heading('Message not found')+button('Back to Messages','#/messages');
 }
 const feedback=error=>{if(error.code==='AUTH_REQUIRED'){location.hash='/session-ended';return;}const box=document.getElementById('message-feedback')||document.getElementById('page-feedback');if(box)box.textContent=error.message;};
 function attach(){
  for(const [id,action] of [['retry-message','retryMessage'],['check-message','processMessage']]){
   const control=document.getElementById(id);if(control)control.onclick=()=>{control.disabled=true;try{session.requireSession();service[action](eventId,revision);rerender();document.getElementById('announcement').textContent='Message status updated.';}catch(error){feedback(error);control.disabled=false;}};
  }
  const form=document.getElementById('manual-follow-up');
  if(form){document.getElementById('show-follow-up').onclick=()=>{form.hidden=false;form.elements.note.focus();};document.getElementById('cancel-follow-up').onclick=()=>{form.reset();form.hidden=true;document.getElementById('show-follow-up').focus();};form.onsubmit=event=>{event.preventDefault();try{const actor=session.requireSession();repository.commit(s=>recordManualFollowUp(s,eventId,form.elements.note.value,actor,new Date().toISOString()),revision);rerender();document.getElementById('announcement').textContent='Manual follow-up saved.';}catch(error){if(error.code==='AUTH_REQUIRED')feedback(error);else formError(form,error.message,'note');}};}
  // Only persisted completion events are processed. One queued callback; no background form rerender.
  const path=location.hash.split('?')[0];
  if(path.startsWith('#/messages')||(/^#\/visits\/[^/]+$/.test(path)&&document.querySelector('h1')?.textContent==='Visit completed')){
   setTimeout(()=>{
    if(location.hash.split('?')[0]!==path||!session.current()||document.querySelector('#manual-follow-up:not([hidden])'))return;
    try{const pending=repository.readState().messages.filter(m=>m.kind==='nurse-summary'&&m.status==='pending'&&!m.attempts?.length);if(!pending.length)return;for(const m of pending)service.processMessage(m.id);rerender();}catch(error){feedback(error);}
   },350);
  }
 }
 return {view,attach};
}
