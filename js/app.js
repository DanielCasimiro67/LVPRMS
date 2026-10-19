import {attachNoteCounters} from './note-ui.js';
import {enableInventory} from './inventory.js';
import {createOperationsFlows} from './operations-flows.js';
import {attachPasswordToggles} from './password-ui.js';
import {createRepository} from './store.js';
import {seedState} from './data.js';
import {createSessionService} from './services.js';
import {navigation,parseRoute,routeTitle} from './routes.js';
import {icon,button,card,heading,notice,escapeHtml,formError} from './ui.js';
import {loginView,accountView,expiredView} from './views/access.js';
import {todayView} from './views/today.js';
import {createPatientFlows} from './patient-flows.js';
import {createMessageFlows} from './message-flows.js';
import {createReferralFlows} from './referral-flows.js';

const app=document.getElementById('app');
const KEY='lvcc.clinic.v1';
let repository,session,patientFlows,messageFlows,referralFlows,operationsFlows,renderedPath='',passwordChanged=false,activeHash='',routing=false;
document.querySelector('.skip-link').addEventListener('click',event=>{
  event.preventDefault();const main=document.getElementById('main');if(main){main.tabIndex=-1;main.focus();}
});

function shell(content,operator,path){
  const selected=path==='/account'||path==='/menu'||path.startsWith('/visits/')||path.startsWith('/messages')?'/today':path;
  const links=navigation.map(([label,url,symbol])=>`<a class="nav-link" href="#${url}"${selected===url||selected.startsWith(url+'/')?' aria-current="page"':''}>${icon(symbol)}<span>${label}</span></a>`).join('');
  return `<div class="app-shell"><aside class="sidebar" aria-label="Clinic workspace"><p class="brand">✚ &nbsp;La Verdad</p><p class="brand-subtitle">SCHOOL CLINIC</p><nav class="nav-links" aria-label="Main navigation">${links}</nav><div class="account-links"><p>${escapeHtml(operator.name)}</p><p class="small muted">${escapeHtml(operator.role)}</p>${button('My account','#/account')}${button('Sign out','#/logout')}</div></aside><div class="workspace"><header class="topbar">${button('Menu','#/menu').replace('class="button"','class="button mobile-only menu-button"')}<span class="school desktop-only">La Verdad Christian College · Clinic</span><span class="school mobile-only">La Verdad Clinic</span>${button('Messages','#/messages').replace('class="button"','class="button message-button"')}</header><main id="main" class="content"><div id="page-feedback" class="inline-feedback" aria-live="polite"></div>${content}</main></div></div>`;
}
function feedback(message){
  const element=document.getElementById('page-feedback')||document.getElementById('announcement');
  if(element)element.textContent=message;
}
function recovery(error){
  document.title='Saved records unavailable · La Verdad Clinic';
  app.innerHTML=`<main id="main" class="standalone-content">${heading('Records could not be opened')}${card('Your saved data has been kept',`<p>${escapeHtml(error.message)}</p><p class="muted">Try again after checking your browser storage. If the problem continues, download your saved data and ask school support for help.</p><div class="recovery-actions"><button class="button button-primary" data-action="reload">Try again</button><button class="button" data-action="download">Download saved data</button></div><p id="recovery-feedback" role="status"></p>`)}</main>`;
  app.querySelector('[data-action=reload]').onclick=()=>location.reload();
  app.querySelector('[data-action=download]').onclick=()=>{
    const message=document.getElementById('recovery-feedback');
    try{
      const raw=localStorage.getItem(KEY);if(raw===null){message.textContent='No saved records were found to download.';return;}
      const url=URL.createObjectURL(new Blob([raw],{type:'application/json'}));const link=document.createElement('a');link.href=url;link.download='clinic-records-recovery.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);message.textContent='A copy has been downloaded. The original data is still in this browser.';
    }catch{message.textContent='Browser storage is still unavailable. Allow storage and try again.';}
  };
}
function attachForms(){
  attachPasswordToggles(app);
  const login=app.querySelector('#login-form');
  if(login)login.addEventListener('submit',async event=>{
    event.preventDefault();const submit=login.querySelector('[type=submit]');submit.disabled=true;submit.textContent='Signing in…';
    const values=new FormData(login);
    try{await session.signIn(values.get('username'),values.get('password'));login.reset();location.hash='/today';}
    catch(error){formError(login,error.message,'password');}
    finally{submit.disabled=false;submit.textContent='Sign in';}
  });
  const form=app.querySelector('#password-form');
  if(form)form.addEventListener('submit',async event=>{
    event.preventDefault();const values=new FormData(form);const submit=form.querySelector('[type=submit]');submit.disabled=true;
    try{
      await session.changePassword(values.get('current-password'),values.get('new-password'),values.get('confirm-password'));
      form.reset();passwordChanged=true;render();
      document.getElementById('announcement').textContent='Password changed.';
    }catch(error){
      if(error.code==='AUTH_REQUIRED'){location.hash='/session-ended';return;}
      const fieldName=error.code==='CURRENT_PASSWORD'?'current-password':error.code==='PASSWORD_CONFIRMATION'?'confirm-password':'new-password';
      formError(form,error.message,fieldName);
    }finally{submit.disabled=false;}
  });
}
function render(){
  const {path}=parseRoute(location.hash);
  if(path==='/logout'){session.signOut();passwordChanged=false;location.replace('#/login');return;}
  let content;
  try{
    if(path==='/session-ended'){session.signOut();app.innerHTML=expiredView();document.title='Please sign in again · La Verdad Clinic';}
    else if(path==='/login'){app.innerHTML=loginView();document.title='Sign in · La Verdad Clinic';}
    else{
      const operator=session.current();
      if(!operator){location.replace('#/login');return;}
      const saved=repository.readState();if(saved.inventoryVersion!==1)repository.commit(s=>enableInventory(s,operator,new Date().toISOString()),saved.revision);
      if(path==='/today')content=todayView(repository.readState());
      else if(path==='/account')content=accountView(operator,{changed:passwordChanged});
      else if(path==='/menu')content=`${heading('Menu','Where would you like to go?')}<nav class="menu-links" aria-label="Clinic menu">${[...navigation.map(([l,p])=>[l,p]),['My account','/account'],['Sign out','/logout']].map(([label,url])=>button(label,'#'+url)).join('')}</nav>`;
      else content=operationsFlows.view(path,parseRoute(location.hash).params)??referralFlows.view(path,parseRoute(location.hash).params)??messageFlows.view(path,parseRoute(location.hash).params)??patientFlows.view(path,parseRoute(location.hash).params)??`${heading(routeTitle(path))}${card('This page is not available yet',`<p class="muted">You can return to Today or manage your own sign-in details in this preview.</p><div class="actions">${button('Back to Today','#/today',{primary:true})}${button('My account','#/account')}</div>`,{symbol:routeTitle(path).toLowerCase()})}`;
      document.title=`${path==='/today'?'Today':path==='/account'?'My account':path==='/menu'?'Menu':routeTitle(path)} · La Verdad Clinic`;
      app.innerHTML=path.startsWith('/reports/')&&path.endsWith('/print')?'<main id="main" class="report-print">'+content+'</main>':path.startsWith('/referrals/')&&path.endsWith('/print')?'<main id="main" class="referral-print">'+content+'</main>':shell(content,operator,path);
      const identity=app.querySelector('.visit-identity');if(identity)app.querySelector('.workspace').insertBefore(identity,app.querySelector('main'));
      document.title=`${app.querySelector('h1')?.textContent||routeTitle(path)} · La Verdad Clinic`;
    }
    attachForms();
    patientFlows.attach();
    attachNoteCounters();
    messageFlows.attach();
    referralFlows.attach();
    operationsFlows.attach();
    if(renderedPath&&renderedPath!==path)app.querySelector('h1')?.focus({preventScroll:true});
    renderedPath=path;
    activeHash=location.hash;
  }catch(error){recovery(error);}
}
try{
  repository=createRepository({storage:{getItem:key=>localStorage.getItem(key),setItem:(key,value)=>{if(localStorage.getItem('lvcc.demo.storageFailure')==='true')throw Error('Simulated storage failure');localStorage.setItem(key,value);}},seed:seedState});
  session=createSessionService({storage:sessionStorage});
  patientFlows=createPatientFlows({repository,session,rerender:render});
  messageFlows=createMessageFlows({repository,session,rerender:render});
  referralFlows=createReferralFlows({repository,session});
  operationsFlows=createOperationsFlows({repository,session,rerender:render});
  repository.readState();
  if(localStorage.getItem(KEY)===null)repository.commit(()=>{},0);
  if(!location.hash)location.replace(session.current()?'#/today':'#/login');
  render();
  window.addEventListener('hashchange',async()=>{
    if(routing)return;routing=true;const target=location.hash;
    try{
      const path=parseRoute(target).path;
      if(activeHash&&target!==activeHash&&!['/login','/logout','/session-ended'].includes(path)&&session.current()){
        history.replaceState(null,'',activeHash);
        if(!await operationsFlows.beforeLeave()||!await referralFlows.beforeLeave()||!await patientFlows.beforeLeave())return;
        history.replaceState(null,'',target);
      }
      if(path!=='/account')passwordChanged=false;render();
    }finally{routing=false;}
  });
  const activity=()=>{
    if(!['/login','/session-ended'].includes(parseRoute(location.hash).path)){
      if(!session.current()){location.replace('#/session-ended');return;}
      try{session.touch();}catch(error){feedback(error.message);}
    }
  };
  window.addEventListener('pointerdown',activity,{passive:true});
  window.addEventListener('keydown',activity);
  const checkSession=()=>{
    if(!['/login','/session-ended'].includes(parseRoute(location.hash).path)&&!session.current())location.replace('#/session-ended');
  };
  setInterval(checkSession,1000);window.addEventListener('focus',checkSession);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkSession();});
  window.addEventListener('storage',event=>{
    if(event.key===KEY||event.key===null)feedback('Records changed in another tab. Finish or copy your entries, then refresh to load the latest version.');
  });
}catch(error){recovery(error);}
