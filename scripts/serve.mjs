import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
let port=Number(process.argv[2]||4174);
if(!Number.isInteger(port)||port<1||port>65535){
  console.error('Choose a port from 1 to 65535, for example: npm run dev -- 4300');
  process.exit(1);
}
let retries=0;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ttf':'font/ttf'};
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://127.0.0.1');
    const pathname=decodeURIComponent(url.pathname);
    if(pathname!=='/'&&pathname!=='/index.html'&&!/^\/(css|js|assets)\/[A-Za-z0-9_./-]+$/.test(pathname)){res.writeHead(404);res.end('Not found');return;}
    const filename=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
    if(!filename.startsWith(root)||pathname.split('/').includes('..')){res.writeHead(404);res.end('Not found');return;}
    const data=await readFile(filename);
    res.writeHead(200,{'Content-Type':mime[path.extname(filename)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});
    res.end(req.method==='HEAD'?undefined:data);
  }catch{res.writeHead(404);res.end('Not found');}
});
server.on('error',error=>{
  if(error.code==='EADDRINUSE'&&retries<20&&port<65535){
    console.log(`Port ${port} is busy. Trying ${port+1}...`);
    port++;retries++;server.listen(port,'127.0.0.1');return;
  }
  console.error(error.code==='EADDRINUSE'?'No free port found. Choose another: npm run dev -- 4300':`Could not start the clinic preview: ${error.message}`);
  process.exitCode=1;
});
server.on('listening',()=>{
  console.log(`\n  La Verdad Clinic\n\n  Local: http://127.0.0.1:${server.address().port}/\n\n  Ctrl+click the link to open. Press Ctrl+C to stop.\n`);
});
server.listen(port,'127.0.0.1');
