import {ClinicError} from './clinic.js';
import {validateNote} from './note-rules.js';
export const openingStock=()=>[
 {id:'gauze',name:'Gauze',unit:'pieces',quantity:98,step:1,lowAt:20},
 {id:'alcohol',name:'Alcohol',unit:'bottles',quantity:3,step:.1,lowAt:5},
 {id:'cotton',name:'Cotton balls',unit:'pieces',quantity:120,step:1,lowAt:20},
 {id:'paracetamol',name:'Paracetamol',unit:'tablets',quantity:40,step:1,lowAt:10},
 {id:'bandage',name:'Adhesive bandage',unit:'pieces',quantity:30,step:1,lowAt:10},
 {id:'saline',name:'Saline',unit:'bottles',quantity:10,step:1,lowAt:3}
];
const fail=(code,text)=>{throw new ClinicError(code,text);};
const units=n=>Math.round(Number(n)*1000);
export function validQuantity(item,value,{zero=false}={}){const q=Number(value),scaled=q*1000,step=units(item.step??1);return String(value).trim()!==''&&Number.isFinite(q)&&q>=0&&(zero||units(q)>0)&&Number.isSafeInteger(units(q))&&Math.abs(scaled-units(q))<.000001&&step>0&&units(q)%step===0;}
export function enableInventory(s,actor,at){
 if(s.inventoryVersion===1)return;
 const items=s.inventory.length?s.inventory.map(i=>({...i,quantity:i.quantity??0,step:i.step??1,lowAt:i.lowAt??5})):openingStock();
 for(const i of items)if(!validQuantity(i,i.quantity,{zero:true}))fail('STOCK_INVALID','A saved stock balance needs review before inventory can be opened.');
 const usage={};for(const v of s.visits)usage[v.id]=Object.fromEntries((v.supplies||[]).map(row=>[row.itemId,Number(row.quantity)]));
 s.inventory=items;s.stockUsage=usage;s.stockMovements=items.map(i=>({id:crypto.randomUUID(),itemId:i.id,delta:i.quantity,balance:i.quantity,kind:'opening',reason:'Opening stock count',actor:actor.name,at}));s.inventoryVersion=1;
 s.audit.push({action:'enable-demo-inventory',actor:actor.name,at});
}
export function adjustStock(s,itemId,delta,reason,actor,at){
 const item=s.inventory.find(i=>i.id===itemId);if(!item)fail('ITEM_MISSING','Choose an existing stock item.');
 const note=validateNote(reason,{required:true,label:'Reason'}),raw=Number(delta);
 if(!validQuantity(item,Math.abs(raw)))fail('QUANTITY_INVALID',`Enter a non-zero quantity in steps of ${item.step??1} ${item.unit}.`);
 const change=units(raw)/1000;
 const next=units(item.quantity)+units(change);if(next<0||!Number.isSafeInteger(next))fail('INSUFFICIENT_STOCK',`${item.name} cannot have a negative or invalid stock balance.`);
 item.quantity=next/1000;(s.stockMovements??=[]).push({id:crypto.randomUUID(),itemId,delta:change,balance:item.quantity,kind:'adjustment',reason:note,actor:actor.name,at});s.audit.push({action:'adjust-stock',itemId,delta:change,reason:note,actor:actor.name,at});return item;
}
export function reconcileVisitSupplies(s,visitId,previous,next,actor,at){
 if(s.inventoryVersion!==1)return; // Earlier domain fixtures remain readable; app activation establishes the baseline.
 const before=s.stockUsage?.[visitId]||{},after={};
 for(const row of next){const item=s.inventory.find(i=>i.id===row.itemId);if(!item||!validQuantity(item,row.quantity)||Object.hasOwn(after,row.itemId))fail('SUPPLY_INVALID','Choose each stock item once and use a quantity that matches its unit.');after[row.itemId]=Number(row.quantity);}
 const changes=[...new Set([...Object.keys(before),...Object.keys(after)])].map(itemId=>{const item=s.inventory.find(i=>i.id===itemId);if(!item)fail('ITEM_MISSING','A previously used stock item needs review.');const delta=units(before[itemId]||0)-units(after[itemId]||0),balance=units(item.quantity)+delta;if(balance<0||!Number.isSafeInteger(balance))fail('INSUFFICIENT_STOCK',`${item.name}: only ${item.quantity} ${item.unit} available. Reduce the additional quantity or add stock before saving.`);return {item,delta,balance};});
 for(const {item,delta,balance} of changes)if(delta){item.quantity=balance/1000;(s.stockMovements??=[]).push({id:crypto.randomUUID(),itemId:item.id,visitId,delta:delta/1000,balance:item.quantity,kind:'visit',reason:Object.keys(before).length?'Visit supply correction':'Saved visit supplies',actor:actor.name,at});}
 (s.stockUsage??={})[visitId]=after;
}
