import test from 'node:test';
import assert from 'node:assert/strict';
import {seedState} from '../js/data.js';
import {mergeSchoolIdentities} from '../js/clinic.js';
import {createProfile,updateProfile,profileDraft,schoolRecords} from '../js/profiles.js';

const actor={name:'Elena Lim'},at='2026-10-20T02:00:00Z';
test('school category update survives a later contact-only edit without stale education fields',()=>{
 const s=seedState(),r=schoolRecords(s).find(r=>r.sourceId==='school-demo-3001');
 const p=createProfile(s,r,actor,at);p.notes=[{text:'Original',author:'Elena Lim',at}];
 const clinical=structuredClone({notes:p.notes,visits:s.visits,messages:s.messages,inventory:s.inventory});
 assert.equal(mergeSchoolIdentities(s,[{sourceId:r.sourceId,name:r.name,schoolId:r.schoolId,cards:[r.rfid],type:'staff',department:'Finance'}],actor,at).updated,1);
 assert.equal(p.departmentGroup,'staff');
 assert.equal(p.program,undefined);assert.equal(p.year,undefined);assert.equal(p.grade,undefined);
 updateProfile(s,p.id,{...profileDraft(s,p),contact:'09171234567'},actor,at);
 assert.equal(p.type,'staff');assert.equal(p.department,'Finance');
 assert.deepEqual({notes:p.notes,visits:s.visits,messages:s.messages,inventory:s.inventory},clinical);
});
test('school education update replaces obsolete grade fields and retains higher-ed identity on contact save',()=>{
 const s=seedState(),p=s.patients.find(p=>p.id==='mara');
 mergeSchoolIdentities(s,[{sourceId:'school-mara',name:p.name,schoolId:p.schoolId,cards:['RFID-1001'],type:'student',program:'BSIS',year:'3rd year'}],actor,at);
 assert.equal(p.departmentGroup,'higher-ed');assert.equal(p.program,'BSIS');assert.equal(p.year,'3rd year');
 assert.equal(p.grade,undefined);assert.equal(p.section,undefined);
 updateProfile(s,p.id,{...profileDraft(s,p),emergencyName:'Contact'},actor,at);
 assert.equal(p.program,'BSIS');assert.equal(p.year,'3rd year');assert.equal(p.type,'student');
});
