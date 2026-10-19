import {noteField} from '../note-ui.js';
import {card,heading,button,notice,escapeHtml as e} from '../ui.js';
import {messageStatuses,messageDetails} from '../messages.js';
const when=value=>value?new Date(value).toLocaleString('en-PH',{timeZone:'Asia/Manila'}):'Not recorded';
export const statusBadge=status=>`<span class="badge badge-${e(status)}">${e(messageStatuses[status]||'Status unavailable')}</span>`;
export function messagesView(s,params){
 const filter=params.get('status')||'',matches=s.messages.filter(m=>!filter||m.status===filter);
 const list=kind=>matches.filter(m=>m.kind===kind).sort((a,b)=>String(b.at||'').localeCompare(String(a.at||''))).map(raw=>{
 const m=messageDetails(raw),p=s.patients.find(p=>p.id===m.patientId);
 return `<article class="message-row"><div class="patient-info"><strong>${e(m.subject)}</strong><p>${e(p?.name||'Patient unavailable')} · To: ${e(m.recipientName||'School nurse')}</p><p class="small muted">${e(when(m.at))}</p></div>${statusBadge(m.status)}${button('Open message','#/messages/'+encodeURIComponent(m.id))}</article>`;
 }).join('')||'<p class="muted empty-state">No messages match this filter.</p>';
 return heading('Messages','Check message status and follow up when needed.')+
 `<p class="small muted">Demonstration only. Email results are simulated; no real email is delivered.</p><nav class="actions" aria-label="Message status filters">${[['','All messages'],...Object.entries(messageStatuses)].map(([value,label])=>`<a class="button${filter===value?' filter-selected':''}" href="#/messages${value?'?status='+value:''}"${filter===value?' aria-current="page"':''}>${e(label)}</a>`).join('')}</nav>`+
 card('Nurse visit summaries',list('nurse-summary'),{symbol:'default'})+card('Other visit updates',`<p class="small muted">Brief updates for the patient’s contact.</p>${list('concerned-party')}`,{symbol:'default'})+button('Back to Today','#/today');
}
export function messageView(s,raw){
 const m=messageDetails(raw),p=s.patients.find(p=>p.id===m.patientId),attempts=m.attempts||[],followUps=m.followUps||[];
 const warning={failed:['Message could not be sent','The visit is saved. Retry or contact the recipient directly.'],pending:['Email pending','The visit is saved. Check the message status again later.'],'missing-recipient':['Nurse email address missing','The visit is saved. Ask school support to provide the nurse email address, then retry.']}[m.status];
 return heading('Message details','Review the message and follow up when needed.')+
 (m.status==='sent'?notice('Message accepted by the simulated sending service','No real email was delivered. Recipient delivery and reading are not confirmed.','success'):'')+
 card(m.kind==='nurse-summary'?'Visit summary email':'Visit update',`<strong>${e(m.subject)}</strong><p>${e(p?.name||'Patient unavailable')}</p><p class="muted">To: ${e(m.recipientName||'School nurse')}${m.recipient?' · '+e(m.recipient):''} · Email</p>${statusBadge(m.status)}<p class="small muted">Generated ${e(when(m.at))} · Demonstration only</p><div class="message-body">${e(m.body)}</div>${warning?notice(...warning,'warning'):''}<div id="message-feedback" role="status"></div><div class="actions">${['failed','missing-recipient'].includes(m.status)?'<button class="button button-primary" id="retry-message">Retry message</button>':''}${m.status==='pending'?'<button class="button button-primary" id="check-message">Check status</button>':''}<button class="button" id="show-follow-up">Record manual follow-up</button></div><form id="manual-follow-up" class="form-stack" hidden>${noteField('What did you do to follow up?','note','',true,'follow-up-note')}<div class="actions"><button class="button button-primary" type="submit">Save follow-up</button><button class="button" type="button" id="cancel-follow-up">Cancel</button></div></form>`,{symbol:'default'})+
 `<div class="actions">${button('Back to Messages','#/messages')}${m.visitId?button('View visit','#/visits/'+encodeURIComponent(m.visitId)):''}${button('Back to Today','#/today')}</div>`+
 card('Message history',`<p class="small muted">The original email content is kept when a visit is corrected. Manual follow-up does not change the email status.</p><details><summary>Sending attempts (${attempts.length})</summary><div class="result-list">${attempts.map((a,i)=>`<article class="note"><strong>Attempt ${i+1} · ${e(messageStatuses[a.status])}</strong><p>${e(a.recipient)} · ${e(when(a.at))}</p><p>${e(a.detail)}</p>${a.checkedAt?`<p class="small muted">Last checked ${e(when(a.checkedAt))}</p>`:''}</article>`).join('')||'<p>No sending attempts recorded.</p>'}</div></details><details${followUps.length?' open':''}><summary>Manual follow-up (${followUps.length})</summary><div class="result-list">${followUps.map(n=>`<article class="note"><p class="note-text">${e(n.note)}</p><p class="small muted">${e(n.author)} · ${e(when(n.at))}</p></article>`).join('')||'<p>No manual follow-up recorded.</p>'}</div></details>`,{symbol:'history'});
}

