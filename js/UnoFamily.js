
const $=(q,r=document)=>r.querySelector(q);const $$=(q,r=document)=>Array.from(r.querySelectorAll(q));
function navTo(key){ $$('.view').forEach(v=>v.style.display='none'); const v=$('#view-'+key); if(v) v.style.display='block'; $$('.tab').forEach(b=>b.classList.toggle('active', b.dataset.nav===key)); }
$$('[data-nav]').forEach(b=> b.addEventListener('click', ()=> navTo(b.dataset.nav)));
$$('[data-open]').forEach(c=> c.addEventListener('click', ()=> navTo(c.dataset.open==='brain'?'apps':c.dataset.open)));

// Brain dropdown
const brainMenu=$('#brainMenu'); $('#btnBrainDrop').onclick=(e)=>{ brainMenu.classList.toggle('open'); e.stopPropagation(); };
document.addEventListener('click', (e)=>{ if(!brainMenu.contains(e.target)) brainMenu.classList.remove('open'); });

// Drawer
function openBrain(on){ $('#brain').style.transform= on? 'translateX(0)': 'translateX(105%)'; }
$('#brainClose').onclick=()=> openBrain(false);

// Perf/TTS demo
function setPerf(p){ $('#perfSmall') && ($('#perfSmall').textContent=p); log('Perf='+p); }
function ttsTest(){ try{ if(!('speechSynthesis' in window)) return; const u=new SpeechSynthesisUtterance('Teste de voz'); u.lang='pt-BR'; speechSynthesis.cancel(); speechSynthesis.speak(u);}catch{} }

// Logs/backup demo
function log(m){ const box=$('#log'); if(!box) return; box.textContent=(new Date().toLocaleTimeString()+" • "+m+"\n")+box.textContent }
function exportBackup(){ const data={ when:Date.now(), storage:Object.assign({},localStorage) }; const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='dual.backup.json'; a.click(); }

// Apps (mínimo para listar locais)
const RAW={apps:[]}; function renderApps(list){ const wrap=$('#appsWrap'); wrap.innerHTML=''; const q=($('#appSearch')?.value||'').toLowerCase(); let L=(list||[]); if(q) L=L.filter(a=> (a.title||'').toLowerCase().includes(q)); L.forEach(a=>{ const el=document.createElement('div'); el.className='card'; el.innerHTML='<div class="ico">🧩</div><div><div class="title" style="font-weight:800">'+(a.title||'App')+'</div><div class="muted">'+(a.desc||'')+'</div><div style="margin-top:6px"><button class="btn">Abrir</button></div></div>'; wrap.appendChild(el); }); $('#appsCount').textContent=L.length+' apps'; }
renderApps(RAW.apps);

// Stack minimal
const stackWrap=$('#stackWrap'); const dock=$('#dock'); function updateDock(){ dock.innerHTML=''; $$('.session').forEach(s=>{ const meta=JSON.parse(s.dataset.meta||'{}'); const b=document.createElement('button'); b.className='badge'; b.textContent=meta.title||'App'; b.onclick=()=>{ s.classList.remove('min'); s.scrollIntoView({behavior:'smooth'}); }; dock.appendChild(b); }); }
function openApp(a){ const sid='s_'+Math.random().toString(36).slice(2); const url=a.url||'about:blank'; const card=document.createElement('div'); card.className='session'; card.dataset.sid=sid; card.dataset.meta=JSON.stringify({title:a.title||'App', url:a.url||''}); card.innerHTML=`<div class="hdr"><div class="title">${a.title||'App'}</div><div class="tools"><button class="btn" data-act="min" title="Minimizar">—</button><button class="btn" data-act="ref" title="Recarregar">↻</button><button class="btn" data-act="close" title="Fechar">✕</button></div></div><iframe src="${url}"></iframe>`; stackWrap.prepend(card); card.querySelector('[data-act=min]').onclick=()=>{ card.classList.toggle('min'); updateDock(); }; card.querySelector('[data-act=ref]').onclick=()=>{ const fr=card.querySelector('iframe'); try{ fr.contentWindow.location.reload(); }catch{ fr.src=fr.src; } }; card.querySelector('[data-act=close]').onclick=()=>{ card.remove(); updateDock(); }; navTo('stack'); updateDock(); }

$('#btnBack').onclick=()=>{ try{ history.back(); }catch{} };
// Boot
navTo('home');
