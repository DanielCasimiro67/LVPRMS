import {escapeHtml as e} from './ui.js';
const eye='<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>';
export function passwordField(label,name,{value='',autocomplete='current-password',hint='',markRequired=true}={}){
 return `<div class="field"><label for="${e(name)}">${e(label)}${markRequired?' <span aria-hidden="true">*</span>':''}</label><div class="password-control"><input id="${e(name)}" name="${e(name)}" type="password" value="${e(value)}" required autocomplete="${e(autocomplete)}"${hint?` aria-describedby="${e(name)}-hint"`:''}><button class="password-toggle" type="button" data-password-toggle="${e(name)}" data-password-label="${e(label.toLowerCase())}" aria-controls="${e(name)}" aria-label="Show ${e(label.toLowerCase())}" aria-pressed="false" title="Show ${e(label.toLowerCase())}"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${eye}<path data-eye-slash d="m3 3 18 18" hidden/></svg></button></div>${hint?`<p class="field-hint" id="${e(name)}-hint">${e(hint)}</p>`:''}</div>`;
}
export function attachPasswordToggles(root=document){
 const controls=[...root.querySelectorAll('[data-password-toggle]')];
 const set=(button,shown)=>{const input=root.querySelector('#'+CSS.escape(button.dataset.passwordToggle));if(!input)return;input.type=shown?'text':'password';const label=(shown?'Hide ':'Show ')+button.dataset.passwordLabel;button.setAttribute('aria-label',label);button.title=label;button.setAttribute('aria-pressed',String(shown));button.querySelector('[data-eye-slash]').toggleAttribute('hidden',!shown);};
 for(const button of controls){set(button,false);button.onclick=()=>set(button,button.getAttribute('aria-pressed')!=='true');}
 for(const form of new Set(controls.map(b=>b.closest('form')).filter(Boolean)))if(!form.dataset.passwordMaskBound){form.addEventListener('submit',()=>controls.filter(b=>b.closest('form')===form).forEach(b=>set(b,false)));form.dataset.passwordMaskBound='true';}
}
