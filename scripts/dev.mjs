import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,extname,sep} from 'node:path';
const root=resolve(fileURLToPath(new URL('../',import.meta.url)));
const args=process.argv.slice(2);
function flag(name,fallback){const i=args.indexOf(name);return i<0?fallback:args[i+1];}
const port=Number(flag('--port',process.env.PORT||5173));
const host=flag('--host','127.0.0.1');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.json':'application/json','.mp4':'video/mp4','.webm':'video/webm'};
const server=createServer(async(req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
  const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  const path=resolve(root,'.'+name);
  if((path!==root&&!path.startsWith(root+sep))||name.split('/').some(part=>part.startsWith('.'))){res.writeHead(403);res.end();return;}
  const info=await stat(path),file=info.isDirectory()?resolve(path,'index.html'):path;
  const data=await readFile(file);
  const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  const headers={'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Accept-Ranges':'bytes'};
  if(range){const start=Number(range[1]),end=range[2]?Math.min(Number(range[2]),data.length-1):data.length-1;if(start>end||start>=data.length){res.writeHead(416,{'Content-Range':`bytes */${data.length}`});res.end();return;}res.writeHead(206,{...headers,'Content-Range':`bytes ${start}-${end}/${data.length}`,'Content-Length':end-start+1});res.end(req.method==='HEAD'?undefined:data.subarray(start,end+1));return;}
  res.writeHead(200,{...headers,'Content-Length':data.length});res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(404,{'Content-Type':'text/plain; charset=utf-8'});res.end('페이지를 찾을 수 없습니다.');}
});
server.listen(port,host,()=>console.log(`쭉한의원 preview: http://${host}:${server.address().port}`));
