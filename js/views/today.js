import {card,heading,button,escapeHtml} from '../ui.js';
import {scanHero} from './scan-hero.js';
import {patientDescription} from '../clinic.js';

// The scan listener runs only on Today and ignores editable controls and dialogs.
export function todayView(state){
  const rows=state.visits.filter(v=>v.state!=='Completed').map(v=>{
    const patient=state.patients.find(p=>p.id===v.patientId);if(!patient)return '';
    const detail=patientDescription(patient);
    const time=new Intl.DateTimeFormat('en',{timeZone:'Asia/Manila',hour:'numeric',minute:'2-digit',hour12:true}).format(new Date(v.startedAt)).toLowerCase();
    return `<div class="patient-row"><div class="patient-info"><strong>${escapeHtml(patient.name)}</strong><p class="small muted">${escapeHtml(detail)} · ${escapeHtml(time)}</p></div><span class="badge ${v.state==='Resting in clinic'?'badge-success':''}">${escapeHtml(v.state)}</span><div class="actions">${button('Open',`#/visits/${encodeURIComponent(v.id)}`)}<button class="button" type="button" data-discharge="${escapeHtml(v.id)}" aria-label="Discharge ${escapeHtml(patient.name)}">Discharge</button></div></div>`;
  }).join('');
  const referrals=state.referrals.filter(r=>r.state!=='Resolved').length;
  const messages=state.messages.filter(m=>['failed','missing-recipient'].includes(m.status)).length;
  const date=new Intl.DateTimeFormat('en-PH',{timeZone:'Asia/Manila',weekday:'long',day:'numeric',month:'long'}).format(new Date());
  return `${heading('Today',date+' · Your clinic at a glance.')}${scanHero()}${card('In the clinic',`<p class="muted">Continue care for patients who are still here.</p>${rows||'<p class="muted">No patients are in the clinic right now.</p>'}`,{symbol:'patients'})}${card('Needs attention',`<div class="actions">${button(`${referrals} referral follow-ups`,'#/referrals')}${button(`${messages} message${messages===1?'':'s'} need${messages===1?'s':''} attention`,'#/messages')}</div>`,{symbol:'attention'})}<p class="small muted">${state.schoolUpdatedAt?'School records updated '+new Intl.DateTimeFormat('en',{timeZone:'Asia/Manila',day:'numeric',month:'long',hour:'numeric',minute:'2-digit'}).format(new Date(state.schoolUpdatedAt))+'.':'School records have not been updated yet.'}</p>`;
}
