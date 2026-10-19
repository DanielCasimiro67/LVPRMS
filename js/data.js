export const operators=Object.freeze([
  Object.freeze({id:'nurse-elena',username:'elena.lim',name:'Elena Lim',role:'School nurse'}),
  Object.freeze({id:'assistant-nina',username:'nina.reyes',name:'Nina Reyes',role:'Nursing assistant'})
]);

export function seedState() {
  return {schemaVersion:1,revision:0,
    patients:[{id:'mara',name:'Mara Santos',type:'student',schoolId:'2026-001',grade:'Grade 11',section:'Hope'},
      {id:'leo',name:'Leo Cruz',type:'staff',schoolId:'2026-102',department:'Finance'},
      {id:'ana',name:'Ana Reyes',type:'visitor'}],
    visits:[{id:'mara-current',patientId:'mara',state:'In progress',startedAt:'2026-10-15T01:00:00.000Z',complaint:'Headache'},
      {id:'leo-current',patientId:'leo',state:'Resting in clinic',startedAt:'2026-10-15T00:50:00.000Z',complaint:'Wound care'}],
    drafts:{},messages:[{id:'adviser-update',status:'failed',patientId:'mara',kind:'concerned-party'}],
    referrals:[{id:'mara-follow-up',visitId:'mara-current',patientId:'mara',state:'Awaiting doctor reply',reason:'Persistent headache',notes:'Symptoms continue after rest.',destination:'Dr. Alex Garcia',preparedBy:'Elena Lim',preparedAt:'2026-10-15T01:05:00Z',activities:[{id:'mara-contact',kind:'contact',doctor:'Dr. Alex Garcia',source:'Messenger',result:'sent',occurredAt:'2026-10-15T01:10:00Z',recordedAt:'2026-10-15T01:10:00Z',author:'Elena Lim',notes:'Sent assessment and requested advice.'}]},
      {id:'leo-follow-up',visitId:'leo-current',patientId:'leo',state:'Prepared',reason:'Persistent wound discomfort',destination:'Dr. Alex Garcia',preparedBy:'Elena Lim',preparedAt:'2026-10-15T00:55:00Z',activities:[]}],inventory:[],audit:[],schoolUpdatedAt:'2026-10-15T00:30:00.000Z'};
}
