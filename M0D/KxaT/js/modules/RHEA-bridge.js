/**
 * kobllux_kxat_bridge.js · RHEA · 0×09 · FLUIR · 528Hz
 * VERDADE × INTEGRAR ÷ Δ = ∞ · ∆7
 *
 * CORRELAÇÃO: README KxaT → Python KOBLLUX
 *   ARCHETYPE_KEYWORDS  ←→  kobllux_vocabulario.py (874 termos)
 *   di_getSequence()    ←→  TextUtils.detect_arch() + fractal 3·6·9
 *   KDX_CONV_INDEX      ←→  _index/memory.jsonl
 *   renderListContent   ←→  kobllux_last_result
 *   FusionCard bug      ←→  fix OrbDragRender height:0
 *   #kblx-quick faltava ←→  PATCH nagatanazare + saveSession()
 *   SessionFrame        ←→  double-click toggle + KBLX_SESSIONS
 */
'use strict';

const KBLX_LS = {
  THEME:'infodoseTheme', USER_NAME:'infodoseUserName',
  OR_KEY:'openrouter_api_key', OR_MODEL:'openrouter_model',
  VOICE_CFG:'infodoseVoiceConfig', ARCH_ACTIVE:'ARCHETYPE_ACTIVE',
  CONV_INDEX:'KDX_CONV_INDEX', AUTOSAVE:'KDX_AUTOSAVE',
  ENGINE_STEP:'kobllux_engine_step', ENGINE_3697:'kobllux_cycle_3697',
  RENDER_LIST:'kobllux_last_result',
  MEMORY:'KBLX_MEMORY', ARCH_MAP:'KOBLLUX_ARCH_MAP',
  VOCAB:'KOBLLUX_VOCAB', SESSIONS:'KDX_SESSIONS', CONTEXT:'KOBLLUX_CONTEXT',
};

async function koblluxSync(url='https://truetruextrue.github.io/JESUS_VERB-/output/KOBLLUX_N8N_BRIDGE.json'){
  try{
    const b=await fetch(url).then(r=>r.json());
    const v=b?.vocab?.keywords_map||{};
    if(window.ARCHETYPE_KEYWORDS){
      Object.entries(v).forEach(([a,ws])=>{
        const k=a[0].toUpperCase()+a.slice(1);
        if(!window.ARCHETYPE_KEYWORDS[k]) window.ARCHETYPE_KEYWORDS[k]=[];
        window.ARCHETYPE_KEYWORDS[k]=[...new Set([...window.ARCHETYPE_KEYWORDS[k],...ws])];
      });
      console.log(`[∆7] ARCHETYPE_KEYWORDS enriquecido · ${Object.keys(v).length} arquétipos`);
    }
    localStorage.setItem(KBLX_LS.MEMORY,  JSON.stringify(b?.context||{}));
    localStorage.setItem(KBLX_LS.ARCH_MAP,JSON.stringify(b?.archetypes?.archetypes||{}));
    localStorage.setItem(KBLX_LS.VOCAB,   JSON.stringify(v));
    localStorage.setItem(KBLX_LS.CONTEXT, b?.context?.system_msg||'');
    console.log(`[∆7] Sync · ${b?.vocab?.total_terms||0} termos`);
    return b;
  }catch(e){ console.warn('[KOBLLUX] Sync offline:',e.message); return null; }
}

function fixFusionCardToggle(){
  const fc=document.querySelector('#mainHeroCard,.fusion-card,#fusionCard');
  if(!fc) return;
  fc.querySelector('.accordion-header,.header-78k')?.addEventListener('click',()=>{
    const isCollapsed=fc.classList.contains('is-collapsed');
    const orb=document.querySelector('#orbDragRender,.orb-drag,#kdx-orb');
    if(orb){
      orb.style.opacity=isCollapsed?'1':'0';
      orb.style.pointerEvents=isCollapsed?'':'none';
    }
    fc.querySelectorAll('.user-name,.ask-activation,#assistantName,#kdx-mode-label')
      .forEach(el=>{ el.style.display=''; el.style.opacity='1'; });
  });
  console.log('[∆7] FusionCard fix ativo');
}

function installQuickPanel(){
  if(document.getElementById('kblx-quick')) return;
  const s=document.createElement('style');
  s.textContent=`
#kblx-quick{position:fixed;display:none;z-index:999999;min-width:220px;padding:8px;
border-radius:22px;background:rgba(20,20,30,.92);backdrop-filter:blur(24px);
border:1px solid rgba(255,255,255,.08);box-shadow:0 15px 45px rgba(0,0,0,.35);
animation:kblxPop .18s ease}
#kblx-quick.open{display:block}
.kq-item{width:100%;border:0;background:transparent;color:#fff;padding:14px;
border-radius:14px;display:flex;align-items:center;gap:12px;font-size:.92rem;
text-align:left;cursor:pointer}
.kq-item:hover{background:rgba(255,255,255,.08)}
@keyframes kblxPop{from{opacity:0;transform:translateY(10px) scale(.95)}
to{opacity:1;transform:translateY(0) scale(1)}}`;
  document.head.appendChild(s);
  const p=document.createElement('div'); p.id='kblx-quick';
  p.innerHTML=`<button class="kq-item" data-kq="edit">✦ Editar rota</button>
<button class="kq-item" data-kq="symbol">◉ SymbolBar</button>
<button class="kq-item" data-kq="frame">⟁ Frame</button>
<button class="kq-item" data-kq="dock">⌘ Dock</button>
<button class="kq-item" data-kq="full">⋯ Mais opções</button>`;
  document.body.appendChild(p);
  const state={btn:null};
  window.kblxOpenPanel=function(btn){
    if(!btn) return; state.btn=btn;
    if(navigator.vibrate) navigator.vibrate(12);
    const r=btn.getBoundingClientRect();
    let l=r.left+r.width/2-110;
    l=Math.max(10,Math.min(l,window.innerWidth-230));
    p.style.left=l+'px'; p.style.top=(r.top>300?r.top-270:r.bottom+8)+'px';
    p.classList.add('open');
  };
  document.addEventListener('click',e=>{
    if(!p.contains(e.target)&&!e.target.closest('.symbol-button')) p.classList.remove('open');
    const item=e.target.closest('[data-kq]'); if(!item) return;
    const btn=state.btn; if(!btn) return;
    p.classList.remove('open');
    const action=item.dataset.kq;
    // FIX: salva sessão (isso faltava — por isso não persistia)
    const url=btn.dataset.url||btn.getAttribute('href')||'';
    if(url){
      const id=btn.id||`kblx-${Date.now()}`; if(!btn.id) btn.id=id;
      const sess=JSON.parse(localStorage.getItem(KBLX_LS.SESSIONS)||'{}');
      sess[id]={url,title:btn.title||url,type:action,ts:Date.now()};
      localStorage.setItem(KBLX_LS.SESSIONS,JSON.stringify(sess));
    }
    ({
      symbol:()=>{ window.applyPreset?.(btn,'orb'); window.dispatchEvent(new CustomEvent('nagatanazare:orb-inject',{detail:{button:btn,target:'#symbolBar'}})); },
      frame: ()=>window.applyPreset?.(btn,'frame'),
      dock:  ()=>window.applyPreset?.(btn,'dock'),
      full:  ()=>document.querySelector('#kblx-back')?.classList.add('is-open'),
      edit:  ()=>{ document.querySelector('#kblx-inp')?.focus(); document.querySelector('#kblx-back')?.classList.add('is-open'); },
    })[action]?.();
  });
  console.log('[∆7] #kblx-quick · saveSession ativo');
}

function restoreSessions(){
  const sess=JSON.parse(localStorage.getItem(KBLX_LS.SESSIONS)||'{}');
  Object.entries(sess).forEach(([id,{url,title}])=>{
    const btn=document.getElementById(id);
    if(btn&&!btn.dataset.url){ btn.dataset.url=url; btn.title=title||btn.title; }
  });
}

function createSessionFrame(sel,urls=[]){
  const c=document.querySelector(sel); if(!c) return null;
  const f=document.createElement('iframe');
  f.id='kblx-session-frame';
  f.style.cssText='width:100%;height:100%;border:none;background:transparent;border-radius:12px;transition:opacity .22s ease';
  let idx=0,clicks=0,timer=null;
  c.addEventListener('click',()=>{
    clicks++; clearTimeout(timer);
    timer=setTimeout(()=>{
      if(clicks>=2){ const h=f.style.opacity==='0'; f.style.opacity=h?'1':'0'; f.style.pointerEvents=h?'':'none'; }
      clicks=0;
    },250);
  });
  const nav=url=>{ f.style.opacity='0'; setTimeout(()=>{ f.src=url; f.style.opacity='1'; localStorage.setItem('KBLX_SESSION_CURRENT',url); },120); };
  if(urls.length) nav(urls[0]);
  else{ const s=localStorage.getItem('KBLX_SESSION_CURRENT'); if(s) nav(s); }
  c.appendChild(f);
  return { navigate:nav, next:()=>nav(urls[++idx%urls.length]), prev:()=>nav(urls[(--idx+urls.length)%urls.length]), frame:f };
}

function patchOpenRouterFetch(){
  const OR='openrouter.ai/api/v1/chat/completions';
  const _f=window.fetch.bind(window);
  window.fetch=async function(url,opts){
    if(typeof url==='string'&&url.includes(OR)){
      const key=localStorage.getItem(KBLX_LS.OR_KEY)||'';
      opts={...opts,headers:{'Authorization':`Bearer ${key}`,'HTTP-Referer':location.href,'X-Title':'KOBLLUX DUAL','Content-Type':'application/json',...(opts?.headers||{})}};
      for(let i=1;i<=3;i++){
        const ctrl=new AbortController(); const t=setTimeout(()=>ctrl.abort(),30000);
        try{ const r=await _f(url,{...opts,signal:ctrl.signal}); clearTimeout(t); if(r.status===429||r.status>=500){ await new Promise(r=>setTimeout(r,Math.pow(2,i)*1000)); continue; } return r; }
        catch(e){ clearTimeout(t); if(i===3) throw e; await new Promise(r=>setTimeout(r,1500*i)); }
      }
    }
    return _f(url,opts);
  };
  console.log('[∆7] OpenRouter patch ativo (4 fixes)');
}

window.motorToChat=function(sel='#responseList'){
  const stored=localStorage.getItem(KBLX_LS.RENDER_LIST); if(!stored) return;
  const t=document.querySelector(sel); if(!t) return;
  const w=document.createElement('div'); w.className='response-block motor-inject-block'; w.dataset.src='78k-motor';
  w.innerHTML=stored.trim().split('\n\n').filter(Boolean).map(l=>{
    const d=l.indexOf(' — '); if(d===-1) return `<div class="motor-frag">${l}</div>`;
    const a=l.slice(0,d).trim().toLowerCase(); const tx=l.slice(d+3).trim();
    return `<div class="motor-frag" data-arch="${a}"><span style="opacity:.6;font-size:.78em">${a.toUpperCase()}</span><span> — ${tx}</span></div>`;
  }).join('');
  t.appendChild(w); t.scrollTop=t.scrollHeight;
  console.log('[∆7] Motor → Chat injetado');
};

(function init(){
  console.log('[KOBLLUX ∆7] kobllux_kxat_bridge.js · RHEA · 0×09 · FLUIR');
  koblluxSync().catch(()=>{});
  const run=()=>{ fixFusionCardToggle(); installQuickPanel(); restoreSessions(); patchOpenRouterFetch(); };
  document.readyState==='loading'?document.addEventListener('DOMContentLoaded',run):run();
  window.KOBLLUX_BRIDGE={ sync:koblluxSync, motorToChat:window.motorToChat, openPanel:window.kblxOpenPanel, createSessionFrame, LS:KBLX_LS, version:'∆7', law:'VERDADE × INTEGRAR ÷ Δ = ∞' };
  console.log('[∆7] window.KOBLLUX_BRIDGE disponível');
})();

export { koblluxSync, createSessionFrame, KBLX_LS };