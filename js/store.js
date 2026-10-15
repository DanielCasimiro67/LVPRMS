export class StorageError extends Error {
  constructor(code,message,cause) {super(message,{cause});this.name='StorageError';this.code=code;}
}
export function createRepository({storage,seed,key='lvcc.clinic.v1'}) {
  const validate=state=>{
    if(!state||state.schemaVersion!==1||!Number.isSafeInteger(state.revision)||state.revision<0||
       !['patients','visits','messages','referrals','inventory','audit'].every(k=>Array.isArray(state[k]))||
       !state.drafts||typeof state.drafts!=='object'||Array.isArray(state.drafts))
      throw new StorageError('INVALID_DATA','Saved records could not be read. Your data has been kept; download a copy and contact support.');
    return state;
  };
  const readState=()=>{
    let raw;
    try {raw=storage.getItem(key);} catch(cause){throw new StorageError('READ_FAILED','Browser storage is unavailable. Allow storage and try again.',cause);}
    try {return structuredClone(validate(raw===null?seed():JSON.parse(raw)));}
    catch(cause){if(cause instanceof StorageError)throw cause;throw new StorageError('INVALID_DATA','Saved records could not be read. Your data has been kept; download a copy and contact support.',cause);}
  };
  return {readState,commit(change,expectedRevision){
    const current=readState();
    if(current.revision!==expectedRevision) throw new StorageError('STALE_REVISION','A newer version is saved. Reload it before saving your changes.');
    const next=structuredClone(current);
    const result=change(next);
    if(result&&typeof result.then==='function')throw new StorageError('INVALID_CHANGE','Save changes synchronously before starting external work.');
    next.revision=current.revision+1;validate(next);
    if(readState().revision!==expectedRevision)throw new StorageError('STALE_REVISION','A newer version is saved. Reload it before saving your changes.');
    try{storage.setItem(key,JSON.stringify(next));}
    catch(cause){throw new StorageError('SAVE_FAILED','Changes could not be saved. Your entries are still here. Free browser storage and try again.',cause);}
    return structuredClone(next);
  }};
}
