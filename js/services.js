import {operators} from './data.js';

export function mockEmailResult(mode){
 const status=['sent','failed','pending'].includes(mode)?mode:'failed';
 return {status,detail:{sent:'Accepted by the simulated sending service. No real email was delivered.',failed:'The simulated sending service could not accept the message.',pending:'Waiting for the simulated sending service.'}[status]};
}

export class SessionError extends Error {
  constructor(code,message){super(message);this.name='SessionError';this.code=code;}
}

// Disposable, local demonstration only. No password or verifier is written to storage.
export function createSessionService({storage,now=()=>Date.now(),timeoutMs=15*60*1000}) {
  const key='lvcc.session.v1';
  let revoked=false;
  const verifiers=new Map();
  const digest=async value=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),x=>x.toString(16).padStart(2,'0')).join('');
  const write=session=>{
    try{storage.setItem(key,JSON.stringify(session));}
    catch{throw new SessionError('SESSION_UNAVAILABLE','Sign-in could not be saved. Allow browser storage and try again.');}
  };
  const signOut=()=>{revoked=true;try{storage.removeItem(key);}catch{/* Remain signed out in this page even if browser removal fails. */}};
  const current=()=>{
    if(revoked)return null;
    try{
      const s=JSON.parse(storage.getItem(key)||'null');
      const operator=operators.find(o=>o.id===s?.operatorId);
      if(!operator||!Number.isFinite(s.lastActiveAt)||s.lastActiveAt>now()||now()-s.lastActiveAt>=timeoutMs){signOut();return null;}
      return {...operator};
    }catch{return null;}
  };
  const requireSession=()=>{const operator=current();if(!operator)throw new SessionError('AUTH_REQUIRED','Please sign in again.');return operator;};
  const expected=async username=>verifiers.get(username)??await digest('clinic-demo');
  return {current,requireSession,signOut,timeoutMs,
    async signIn(username,password){
      const operator=operators.find(o=>o.username===String(username).trim().toLowerCase());
      if(!operator||await digest(password)!==await expected(operator.username))throw new SessionError('INVALID_LOGIN','Check your username and password, then try again.');
      write({operatorId:operator.id,lastActiveAt:now()});revoked=false;return {...operator};
    },
    touch(){const operator=current();if(operator)write({operatorId:operator.id,lastActiveAt:now()});return operator;},
    async changePassword(currentPassword,next,confirmation){
      const operator=requireSession();
      if(await digest(currentPassword)!==await expected(operator.username))throw new SessionError('CURRENT_PASSWORD','Your current password is incorrect.');
      if(typeof next!=='string'||!next.trim()||next.length<8)throw new SessionError('PASSWORD_LENGTH','Use at least 8 characters for your new password; it cannot be only spaces.');
      if(next!==confirmation)throw new SessionError('PASSWORD_CONFIRMATION','The new passwords do not match.');
      if(next===currentPassword)throw new SessionError('PASSWORD_UNCHANGED','Choose a different new password.');
      const verifier=await digest(next),active=requireSession();
      if(active.id!==operator.id)throw new SessionError('AUTH_REQUIRED','Your signed-in account changed. Please sign in again.');
      verifiers.set(operator.username,verifier);return true;
    }
  };
}
