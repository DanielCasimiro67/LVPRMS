// Prototype policy; backend parity must be agreed during integration.
export const NOTE_LIMIT=2000;
export function validateNote(value,{required=false,label='Note'}={}){
 const text=String(value??'');
 if(text.length>NOTE_LIMIT)throw Object.assign(new Error(`${label} must be ${NOTE_LIMIT.toLocaleString('en')} characters or fewer. Shorten it before saving; your text has been kept.`),{code:'NOTE_TOO_LONG'});
 if(required&&!text.trim())throw Object.assign(new Error(`Enter ${label.toLowerCase()} before saving.`),{code:'NOTE_REQUIRED'});
 return text.trim();
}
