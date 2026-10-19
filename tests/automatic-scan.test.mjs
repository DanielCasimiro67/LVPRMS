import test from 'node:test';
import assert from 'node:assert/strict';
import {createScanReader} from '../js/intake.js';
import {scanHero} from '../js/views/scan-hero.js';
test('scan hero has just automatic feedback and two fallback links',()=>{const html=scanHero();assert.match(html,/Please scan your ID/);assert.match(html,/Search by name/);assert.match(html,/Register patient/);assert.equal((html.match(/<a /g)||[]).length,2);assert.doesNotMatch(html,/<input|<form|<button|<details|Continue|Find patient|Manual lookup/);});
test('reader emits a complete fast ID only on Enter and clears it afterwards',()=>{let at=0;const r=createScanReader(()=>at);for(const key of 'RFID-1001'){at+=10;assert.equal(r.feed(key),null);}assert.equal(r.feed('Enter'),'RFID-1001');assert.equal(r.feed('Enter'),null);});
test('slow or interrupted input cannot combine into a different ID',()=>{let at=0;const r=createScanReader(()=>at);r.feed('A');at+=500;r.feed('B');assert.equal(r.feed('Enter'),null);r.feed('X');r.reset();assert.equal(r.feed('Enter'),null);});
test('oversized scan is discarded rather than truncated to a valid patient identifier',()=>{const r=createScanReader(()=>0);for(const key of 'X'.repeat(129))r.feed(key);assert.equal(r.feed('Enter'),null);});
test('reader keeps a card burst intact when the reader sends Shift keys',()=>{const r=createScanReader(()=>0);r.feed('Shift');r.feed('A');r.feed('Shift');r.feed('B');assert.equal(r.feed('Enter'),'AB');});
