import test from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
test('Local server serves the homepage, modules, and video byte ranges',async t=>{
 const child=spawn(process.execPath,['scripts/dev.mjs','--port','0'],{cwd:new URL('../',import.meta.url),stdio:['ignore','pipe','pipe']});
 t.after(()=>child.kill());
 const [chunk]=await once(child.stdout,'data');
 const base=chunk.toString().match(/http:\/\/127\.0\.0\.1:\d+/)?.[0];
 assert.ok(base);
 const home=await fetch(base+'/');assert.equal(home.status,200);assert.match(await home.text(),/src="\.\/src\/app.js"/);
 const module=await fetch(base+'/src/app.js');assert.equal(module.status,200);assert.match(module.headers.get('content-type'),/javascript/);
 const range=await fetch(base+'/assets/images/main.jpg',{headers:{Range:'bytes=0-9'}});assert.equal(range.status,206);assert.equal((await range.arrayBuffer()).byteLength,10);
 assert.equal((await fetch(base+'/.env')).status,403);
 assert.equal((await fetch(base+'/missing')).status,404);
});
