import {ClinicError} from './clinic.js';
export const clinicDay=value=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Manila',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(value));
export function reportRows(s,{from='',to='',type='all',complaint=''}={}){
 const date=value=>!value||(/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value);
 if(!date(from)||!date(to)||(from&&to&&from>to))throw new ClinicError('REPORT_DATE','Choose a valid date range with the start on or before the end.');
 if(!['all','student','staff','visitor'].includes(type))throw new ClinicError('REPORT_TYPE','Choose a supported patient category.');
 const key=v=>String(v||'').trim().toLowerCase();
 return s.visits.filter(v=>Number.isFinite(Date.parse(v.startedAt))).map(v=>({...v,patient:s.patients.find(p=>p.id===v.patientId)})).filter(v=>v.patient&&(!from||clinicDay(v.startedAt)>=from)&&(!to||clinicDay(v.startedAt)<=to)&&(type==='all'||v.patient.type===type)&&(!complaint||key(v.complaint)===key(complaint))).sort((a,b)=>b.startedAt.localeCompare(a.startedAt));
}
export function summarizeReports(rows){
 const group=(items,label)=>{const result=new Map();for(const row of items){const name=label(row)||'Not recorded',key=name.trim().toLowerCase();if(!result.has(key))result.set(key,{label:name,count:0});result.get(key).count++;}return [...result.values()].sort((a,b)=>b.count-a.count||a.label.localeCompare(b.label));};
 const frequent=new Map();for(const row of rows){const p=row.patient;if(!frequent.has(p.id))frequent.set(p.id,{patient:p,count:0});frequent.get(p.id).count++;}
 return {total:rows.length,types:Object.fromEntries(['student','staff','visitor'].map(type=>[type,rows.filter(v=>v.patient.type===type).length])),months:group(rows,v=>clinicDay(v.startedAt).slice(0,7)).sort((a,b)=>a.label.localeCompare(b.label)),complaints:group(rows,v=>v.complaint),students:group(rows.filter(v=>v.patient.type==='student'),v=>[v.patient.program,v.patient.year,v.patient.grade,v.patient.section].filter(Boolean).join(' · ')),departments:group(rows.filter(v=>v.patient.type==='staff'),v=>v.patient.department),frequent:[...frequent.values()].sort((a,b)=>b.count-a.count||a.patient.name.localeCompare(b.patient.name))};
}
