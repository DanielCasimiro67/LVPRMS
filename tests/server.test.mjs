import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
import {fileURLToPath} from 'node:url';

test('dev server chooses a free port when requested port is busy and serves only public files',async()=>{
  const occupied=http.createServer();occupied.listen(0,'127.0.0.1');await once(occupied,'listening');
  const port=occupied.address().port;
  const child=spawn(process.execPath,[fileURLToPath(new URL('../scripts/serve.mjs',import.meta.url)),String(port)],{stdio:['ignore','pipe','pipe']});
  let stderr='';child.stderr.on('data',data=>stderr+=data);
  try{
    const url=await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(Error('Server did not print its URL. '+stderr)),10000);
      child.once('exit',code=>{clearTimeout(timer);reject(Error('Server exited '+code+': '+stderr));});
      let output='';child.stdout.on('data',data=>{output+=data;const match=output.match(/http:\/\/(?:127\.0\.0\.1|localhost):\d+\//);if(match){clearTimeout(timer);resolve(match[0]);}});
    });
    assert.notEqual(new URL(url).port,String(port));
    const response=await fetch(url);assert.equal(response.status,200);assert.match(await response.text(),/id="app"/);
    assert.equal((await fetch(url+'package.json')).status,404);
    assert.equal((await fetch(url+'demo.html')).status,200);
    assert.equal(stderr,'');
  }finally{
    if(child.exitCode===null){const exit=once(child,'exit');child.kill();await exit;}
    await new Promise(resolve=>occupied.close(resolve));
  }
});
