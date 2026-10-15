export const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const icon=name=>`<img class="icon" src="assets/icons/${['today','patients','referrals','inventory','reports','visit','attention','history'].includes(name)?name:'default'}.svg" width="20" height="20" alt="">`;
export function button(label,href,{primary=false,disabled=false}={}){
  const style=`button${primary?' button-primary':''}`;
  return disabled?`<button class="${style}" type="button" disabled title="Available in a later preview">${escapeHtml(label)}</button>`:`<a class="${style}" href="${escapeHtml(href)}">${escapeHtml(label)}</a>`;
}
export const card=(title,content,{symbol='default',subtitle=''}={})=>`<section class="card"><h2>${icon(symbol)}${escapeHtml(title)}</h2>${subtitle?`<p class="muted">${escapeHtml(subtitle)}</p>`:''}${content}</section>`;
export const heading=(title,subtitle='')=>`<header class="page-heading"><h1 tabindex="-1">${escapeHtml(title)}</h1>${subtitle?`<p class="muted">${escapeHtml(subtitle)}</p>`:''}</header>`;
export function field(label,name,{type='text',value='',readonly=false,required=false,markRequired=true,autocomplete='',hint='',placeholder=''}={}){
  return `<div class="field"><label for="${escapeHtml(name)}">${escapeHtml(label)}${required&&markRequired?' <span aria-hidden="true">*</span>':''}</label><input id="${escapeHtml(name)}" name="${escapeHtml(name)}" type="${type}" value="${escapeHtml(value)}"${readonly?' readonly':''}${required?' required':''}${autocomplete?` autocomplete="${autocomplete}"`:''}${hint?` aria-describedby="${escapeHtml(name)}-hint"`:''} placeholder="${escapeHtml(placeholder)}">${hint?`<p id="${escapeHtml(name)}-hint" class="field-hint">${escapeHtml(hint)}</p>`:''}</div>`;
}
export const notice=(title,message,kind='info')=>`<div class="notice notice-${kind}" role="status"><strong>${escapeHtml(title)}</strong><p>${escapeHtml(message)}</p></div>`;
export function formError(form,message,fieldName){
  let box=form.querySelector('.form-error');
  if(!box){box=document.createElement('div');box.className='notice notice-error form-error';box.setAttribute('role','alert');box.tabIndex=-1;form.prepend(box);}
  box.textContent=message;
  form.querySelectorAll('[aria-invalid]').forEach(x=>x.removeAttribute('aria-invalid'));
  const input=fieldName?form.elements.namedItem(fieldName):null;
  if(input){input.setAttribute('aria-invalid','true');input.focus();}else box.focus();
}
