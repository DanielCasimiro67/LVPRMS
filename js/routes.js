export const navigation=[['Today','/today','today'],['Patients','/patients','patients'],['Referrals','/referrals','referrals'],['Inventory','/inventory','inventory'],['Reports','/reports','reports']];
export function parseRoute(hash){
  try{const u=new URL(hash.replace(/^#/,'')||'/login','http://clinic.local');return {path:u.pathname,params:u.searchParams};}
  catch{return {path:'/not-found',params:new URLSearchParams()};}
}
export function routeTitle(path){return navigation.find(([,p])=>path===p||path.startsWith(p+'/'))?.[0]|| (path.startsWith('/messages')?'Messages':'Page unavailable');}
