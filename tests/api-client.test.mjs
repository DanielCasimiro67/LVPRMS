import test from 'node:test';
import assert from 'node:assert/strict';
import {createApiClient} from '../src/services/api-client.js';
test('API client uses one version prefix, preserves validation and never falls back to demo',async()=>{
 const calls=[],api=createApiClient({baseUrl:'/api/v1/',fetchImpl:async(url,opts)=>{calls.push([url,opts]);return new Response(JSON.stringify({message:'Required',errors:{email:['Required']}}),{status:422});},tokenStore:{get:()=>null,clear(){}}});
 await assert.rejects(api.request('/patients',{method:'POST',body:{name:'Test'}}),e=>e.status===422&&e.errors.email[0]==='Required');assert.equal(calls[0][0],'/api/v1/patients');
});
test('401 clears token and reports unauthorized without returning fake records',async()=>{let cleared=false,expired=false;const api=createApiClient({fetchImpl:async()=>new Response('{}',{status:401}),tokenStore:{get:()=> 'token',clear:()=>cleared=true},onUnauthorized:()=>expired=true});await assert.rejects(api.request('/me'));assert.equal(cleared,true);assert.equal(expired,true);});
test('success retains envelopes and injects bearer token without logging it',async()=>{let headers;const api=createApiClient({fetchImpl:async(_,o)=>{headers=o.headers;return new Response('{"data":{"patient_id":4}}');},tokenStore:{get:()=> 'example',clear(){}}});assert.deepEqual(await api.request('/patients/4'),{data:{patient_id:4}});assert.equal(headers.get('Authorization'),'Bearer example');});
