import {cp,mkdir,rm,writeFile,readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const dist=new URL('dist/',root);
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
for(const item of ['index.html','assets','src']) await cp(new URL(item,root),new URL(item,dist),{recursive:true});
await mkdir(new URL('docs/',dist),{recursive:true});
await cp(new URL('docs/colors.html',root),new URL('docs/colors.html',dist));
await cp(new URL('docs/brand.html',root),new URL('docs/brand.html',dist));
// Give each release its own asset URLs, including the ES module dependencies.
// Returning visitors then receive matching HTML, code, and styles after a deploy.
async function filesIn(directory){
 const files=[];
 for(const entry of await readdir(new URL(directory,root),{withFileTypes:true})){
  const path=directory+entry.name;
  if(entry.isDirectory())files.push(...await filesIn(path+'/'));
  else files.push(path);
 }
 return files.sort();
}
const inputs=['index.html',...await filesIn('assets/'),...await filesIn('src/')];
const hash=createHash('sha256');
for(const path of inputs)hash.update(path).update(await readFile(new URL(path,root)));
const revision=hash.digest('hex').slice(0,12);
for(const path of [...inputs,'docs/brand.html','docs/colors.html']){
 if(!/\.(html|css|js)$/.test(path))continue;
 const target=new URL(path,dist);
 let content=await readFile(target,'utf8');
 if(path.endsWith('.html'))content=content.replace(/((?:href|src)=["'])(\.{1,2}\/(?:assets|src)\/[^"'?]+)(["'])/g,`$1$2?v=${revision}$3`);
 if(path.endsWith('.css')||path.endsWith('.html'))content=content.replace(/url\((["']?)(\.{1,2}\/[^"')?]+)\1\)/g,`url($1$2?v=${revision}$1)`);
 if(path.endsWith('.js'))content=content.replace(/((?:from\s*|new URL\(\s*)["'])(\.{1,2}\/[^"'?]+)(["'])/g,`$1$2?v=${revision}$3`);
 await writeFile(target,content);
}
await writeFile(new URL('.nojekyll',dist),'');
console.log(`Built dist/ — release ${revision}, ready for GitHub Pages`);
