import {card,heading,button,escapeHtml} from '../ui.js';

// Patient identification is confined to this dedicated form; scanning cannot overwrite clinical fields.
export function todayView(state){
  const rows=state.visits.filter(v=>v.state!=='Completed').map(v=>{
    const patient=state.patients.find(p=>p.id===v.patientId);if(!patient)return '';
    const detail=patient.type==='student'?`Student · ${patient.grade}, ${patient.section}`:patient.type==='staff'?`Staff · ${patient.department}`:'Visitor';
    const time=new Intl.DateTimeFormat('en',{timeZone:'Asia/Manila',hour:'numeric',minute:'2-digit',hour12:true}).format(new Date(v.startedAt)).toLowerCase();
    return `<div class="patient-row"><div class="patient-info"><strong>${escapeHtml(patient.name)}</strong><p class="small muted">${escapeHtml(detail)} · ${escapeHtml(time)}</p></div><span class="badge ${v.state==='Resting in clinic'?'badge-success':''}">${escapeHtml(v.state)}</span>${button('Open',`#/visits/${encodeURIComponent(v.id)}`)}</div>`;
  }).join('');
  const referrals=state.referrals.filter(r=>r.state!=='Resolved').length;
  const messages=state.messages.filter(m=>['failed','missing-recipient'].includes(m.status)).length;
  return `${heading('Today','Thursday, 15 October · Your clinic at a glance.')}${card('Start a visit',`<p class="muted">Scan a school card or find the patient by name.</p><span class="badge">Manual lookup available</span><form id="identify-form" class="form-stack"><div class="field"><label for="school-card">School ID or card</label><input id="school-card" name="card" placeholder="Scan a card or enter a school ID" autocomplete="off" required></div><div class="actions"><button class="button button-primary" type="submit">Find patient</button>${button('Search by name','#/patients')}${button('Register patient','#/patients/register')}</div></form>`,{symbol:'visit'})}${card('In the clinic',`<p class="muted">Continue care for patients who are still here.</p>${rows||'<p class="muted">No patients are in the clinic right now.</p>'}`,{symbol:'patients'})}${card('Needs attention',`<div class="actions">${button(`${referrals} referral follow-ups`,'#/referrals')}${button(`${messages} message${messages===1?'':'s'} need${messages===1?'s':''} attention`,'#/messages?status=failed')}</div>`,{symbol:'attention'})}<p class="small muted">${state.schoolUpdatedAt?'School records updated '+new Intl.DateTimeFormat('en',{timeZone:'Asia/Manila',day:'numeric',month:'long',hour:'numeric',minute:'2-digit'}).format(new Date(state.schoolUpdatedAt))+'.':'School records have not been updated yet.'}</p>`;
}
