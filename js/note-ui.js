import {escapeHtml as e} from './ui.js';
import {NOTE_LIMIT,validateNote} from './note-rules.js';
export function noteField(label,name,value='',required=false,id=name){
 return `<div class="field"><label for="${e(id)}">${e(label)}${required?' <span aria-hidden="true">*</span>':''}</label><textarea id="${e(id)}" name="${e(name)}" rows="3" data-note-limit aria-describedby="${e(id)}-counter"${required?' required':''}>${e(value)}</textarea><p id="${e(id)}-counter" class="small muted note-counter"></p></div>`;
}
export function attachNoteCounters(root=document){
 root.querySelectorAll('textarea[data-note-limit]').forEach(input=>{
  const update=()=>{let error='';try{validateNote(input.value,{required:input.required});}catch(e){error=e.message;}input.setCustomValidity(error);const counter=document.getElementById(input.id+'-counter');counter.textContent=`${input.value.length.toLocaleString('en')} / ${NOTE_LIMIT.toLocaleString('en')} characters`+(input.value.length>NOTE_LIMIT?' — shorten before saving; text kept.':'');counter.classList.toggle('note-over-limit',input.value.length>NOTE_LIMIT);};
  if(!input.dataset.counterBound){input.addEventListener('input',update);input.dataset.counterBound='true';}update();
 });
}
