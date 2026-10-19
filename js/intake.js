import {identifyPatient,ClinicError} from './clinic.js';
import {scanVisitAction} from './discharge.js';
export function resolveIntake(s,value,mode='scan'){
 const identifier=String(value??'').trim();if(!identifier)throw new ClinicError('IDENTIFIER_REQUIRED','Scan an ID or enter the school ID.');
 const match=identifyPatient(s,identifier);
 if(match.status==='match')return {kind:'match',patientId:match.patient.id,name:match.patient.name};
 if(match.status==='ambiguous')return {kind:'ambiguous',href:'/patients?'+new URLSearchParams({q:identifier,notice:'ambiguous'})};
 return {kind:'unknown',href:'/patients/register?'+new URLSearchParams({[mode==='manual'?'schoolId':'rfid']:identifier,from:'scan'})};
}
export function createScanGate(now=()=>Date.now()){
 const recent=new Map();return {accept(value){const key=String(value).trim().toLowerCase(),time=now();for(const [k,at] of recent)if(time-at>=1500)recent.delete(k);if(recent.has(key))return false;recent.set(key,time);return true;}};
}
// Keyboard-wedge readers send a short burst followed by Enter. No visible ID entry is needed.
export function createScanReader(now=()=>performance.now()){
 let value='',last=0,overflow=false;
 const reset=()=>{value='';last=0;overflow=false;};
 return {reset,feed(key){if(['Shift','CapsLock'].includes(key))return null;const at=now();if(at-last>120)reset();last=at;
  if(key==='Enter'){const result=!overflow&&value.length>=2?value:null;reset();return result;}
  if(key.length!==1){reset();return null;}
  if(value.length>=128){overflow=true;return null;}value+=key;return null;
 }};
}
let detachScan=()=>{};
export function attachIntake({repository,session,start,gate}){
 detachScan();const hero=document.getElementById('scan-hero');if(!hero)return;
 const feedback=document.getElementById('scan-feedback'),reader=createScanReader(),hash=location.hash;
 let busy=false,timer;
 const show=(state,title,detail)=>{hero.dataset.state=state;feedback.querySelector('strong').textContent=title;feedback.querySelector('p').textContent=detail;};
 const keydown=event=>{
  if(!hero.isConnected||location.hash!==hash||busy)return;
  if(event.ctrlKey||event.altKey||event.metaKey||event.isComposing||document.querySelector('dialog[open]')||event.target.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"]')){reader.reset();return;}
  const identifier=reader.feed(event.key);if(!identifier)return;event.preventDefault();if(!gate.accept(identifier))return;
  try{session.requireSession();const result=resolveIntake(repository.readState(),identifier);busy=true;
   const returning=result.kind==='match'&&scanVisitAction(repository.readState(),result.patientId).kind==='discharge';
   show(result.kind,result.kind==='match'?'Patient found':result.kind==='unknown'?'Patient not found':'More than one match',result.kind==='match'?`${result.name} · ${returning?'Opening discharge confirmation…':'Opening the visit…'}`:result.kind==='unknown'?'Opening patient registration…':'Opening matching records. Check the patient’s identity.');
   timer=setTimeout(async()=>{if(location.hash!==hash||!hero.isConnected)return;
    try{session.requireSession();if(result.kind==='match')await start(result.patientId,{automatic:true});else location.hash=result.href;}
    catch(error){if(error.code==='AUTH_REQUIRED')location.hash='/session-ended';else show('error','Could not open the visit',error.message);}
    finally{busy=false;if(location.hash===hash&&hero.isConnected&&hero.dataset.state!=='error')show('ready','Ready to scan','The patient’s visit form will open automatically.');}
   },650);
  }catch(error){busy=false;if(error.code==='AUTH_REQUIRED')location.hash='/session-ended';else show('error','Could not read the ID',error.message);}
 };
 const cancel=()=>{clearTimeout(timer);reader.reset();busy=false;if(hero.isConnected&&location.hash===hash)show('ready','Ready to scan','The patient’s visit form will open automatically.');};
 document.addEventListener('keydown',keydown);window.addEventListener('hashchange',cancel);window.addEventListener('blur',cancel);
 detachScan=()=>{cancel();document.removeEventListener('keydown',keydown);window.removeEventListener('hashchange',cancel);window.removeEventListener('blur',cancel);};
}
