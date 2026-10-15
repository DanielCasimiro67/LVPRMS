import {createRepository} from './store.js';
import {seedState} from './data.js';
import {createSessionService} from './services.js';
import {identityRecords,mergeSchoolIdentities} from './clinic.js';
const service=createSessionService({storage:sessionStorage}),repo=createRepository({storage:localStorage,seed:seedState});
document.getElementById('school-data').value=JSON.stringify([{sourceId:'school-mara',schoolId:'2026-001',name:'Mara Santos',type:'student',grade:'Grade 11',section:'Hope',cards:['RFID-NEW']}],null,2);
const run=change=>{const output=document.getElementById('result');try{const actor=service.requireSession(),s=repo.readState();let result;repo.commit(next=>{result=change(next,actor);},s.revision);output.textContent=JSON.stringify(result,null,2);}catch(error){output.textContent=error.message;}};
document.getElementById('apply').onclick=()=>run((s,actor)=>mergeSchoolIdentities(s,JSON.parse(document.getElementById('school-data').value),actor,new Date().toISOString()));
document.getElementById('ambiguous').onclick=()=>run(s=>{s.schoolIdentities=structuredClone(identityRecords(s));for(const r of s.schoolIdentities.filter(r=>['mara','leo'].includes(r.patientId)))if(!r.cards.includes('RFID-SHARED'))r.cards.push('RFID-SHARED');return {message:'RFID-SHARED now matches two fictional patients. The clinic must ask for explicit selection.'};});
