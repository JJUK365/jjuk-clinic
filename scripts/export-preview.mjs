import {readFile,writeFile} from 'node:fs/promises';
import {resolve,extname} from 'node:path';
import {clinic} from '../src/clinic-config.js';
import {media} from '../src/media.js';

// Export the same source as a single file that opens without a local server.
const root=new URL('../',import.meta.url);
const output=resolve(process.argv[2]||'preview.html');
const mime={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.webp':'image/webp','.mp4':'video/mp4','.webm':'video/webm'};
const embedded=async url=>`data:${mime[extname(url.pathname)]||'application/octet-stream'};base64,${(await readFile(url)).toString('base64')}`;
const inlineMedia={};
for(const [key,value] of Object.entries(media))inlineMedia[key]=await embedded(new URL(value));
const config=structuredClone(clinic);
for(const key of ['video','exteriorPhoto','clinicPhoto']){
 if(config[key]&&!/^(https?:|data:)/.test(config[key]))config[key]=await embedded(new URL(config[key],root));
}
let css='';
for(const name of ['assets/site.css','assets/theme.css']){
 const url=new URL(name,root);
 let content=await readFile(url,'utf8');
 for(const match of [...content.matchAll(/url\(['"]?(\.\/[^'"\)]+)['"]?\)/g)]){
  content=content.replaceAll(match[0],`url('${await embedded(new URL(match[1],url))}')`);
 }
 css+=content+'\n';
}
const scheduling=(await readFile(new URL('src/scheduling.js',root),'utf8')).replaceAll('export function','function');
const app=(await readFile(new URL('src/app.js',root),'utf8')).replace(/^import .*?;\n/gm,'');
const js=`const clinic=${JSON.stringify(config)};\nconst media=${JSON.stringify(inlineMedia)};\n${scheduling}\n${app}`;
let html=await readFile(new URL('index.html',root),'utf8');
html=html.replace('<link rel="stylesheet" href="./assets/site.css"><link rel="stylesheet" href="./assets/theme.css">',()=>`<style>${css}</style>`);
html=html.replace('<script type="module" src="./src/app.js"></script>',()=>`<script>${js.replaceAll('</script','<\\/script')}</script>`);
await writeFile(output,html);
console.log(`Exported ${output}`);
