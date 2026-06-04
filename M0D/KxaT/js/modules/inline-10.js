

/* === Drop-in: Stacks + AutoSave + Export integration (colar após os scripts existentes) === */
(function(){
  // --- Config / keys (reaproveita STORAGE se existir) ---
  const LS_KEY = 'KDX_STACKS';
  const AUTO_KEY = 'KDX_STACKS_AUTOSAVE';
  const AUTO_INTERVAL_KEY = 'KDX_STACKS_AUTOSAVE_INTERVAL';

  // util simples
  function safeParse(s){ try { return JSON.parse(s||'{}'); } catch(e){ return {}; } }
  function loadStacks(){ return safeParse(localStorage.getItem(LS_KEY)); }
  function saveStacks(obj){ try { localStorage.setItem(LS_KEY, JSON.stringify(obj)); return true; } catch(e){ console.error('Salvar stacks falhou', e); return false; } }

  // detect existing containers
  const kdxApps = document.getElementById('kdxDevApps');
  const dumpTo = kdxApps || (function(){
    // fallback: cria um pequeno container flutuante
    let box = document.getElementById('kdx-stacks-fallback');
    if (!box){
      box = document.createElement('div');
      box.id = 'kdx-stacks-fallback';
      box.style.position = 'fixed';
      box.style.right = '12px';
      box.style.bottom = '90px';
      box.style.width = '320px';
      box.style.maxHeight = '44vh';
      box.style.overflow = 'auto';
      box.style.zIndex = 100000;
      box.style.background = 'linear-gradient(180deg, rgba(6,10,22,.98), rgba(2,4,12,.95))';
      box.style.border = '1px solid rgba(255,255,255,.04)';
      box.style.borderRadius = '12px';
      box.style.padding = '8px';
      document.body.appendChild(box);
    }
    return box;
  })();

  // make UI
  const wrapper = document.createElement('div');
  wrapper.style.marginTop = '8px';
  wrapper.innerHTML = `
    <strong>Stacks · Conversas</strong>
    <div style="display:flex;gap:8px;margin-top:8px;">
      <input id="stackNameInput" placeholder="nome da stack" style="flex:1;padding:8px;border-radius:8px;background:transparent;border:1px solid rgba(255,255,255,.06);color:inherit">
      <button id="stackSaveBtn" class="kdxExportBtn json" style="flex:0 0 140px;padding:8px">Salvar</button>
    </div>
    <div style="margin-top:8px;max-height:160px;overflow:auto" id="stacksList"></div>
    <div style="display:flex;gap:8px;margin-top:8px">
      <button id="stacksExportAll" class="kdxExportBtn zip">📦 Exportar todas</button>
      <input id="stacksImportFile" type="file" accept="application/json" style="display:none" />
      <button id="stacksImportBtn" class="kdxExportBtn json">📂 Importar</button>
    </div>
    <div style="margin-top:8px;display:flex;gap:8px;align-items:center">
      <label style="font-size:12px"><input id="stacksAutoToggle" type="checkbox"> Auto-save</label>
      <input id="stacksAutoInterval" type="number" min="5" value="15" style="width:70px;padding:6px;border-radius:6px;border:1px solid rgba(255,255,255,.06);background:transparent;color:inherit">s
    </div>
  `;
  dumpTo.appendChild(wrapper);

  const nameInput = document.getElementById('stackNameInput');
  const saveBtn = document.getElementById('stackSaveBtn');
  const listEl = document.getElementById('stacksList');
  const exportAllBtn = document.getElementById('stacksExportAll');
  const importFile = document.getElementById('stacksImportFile');
  const importBtn = document.getElementById('stacksImportBtn');
  const autoToggle = document.getElementById('stacksAutoToggle');
  const autoIntervalInput = document.getElementById('stacksAutoInterval');

  // capture conv: prioriza `conversation` global, se não existir pega .response-block
  function captureConversation(){
    try{
      if (window.conversation && Array.isArray(window.conversation) && window.conversation.length){
        // transform to consistent lightweight format
        return window.conversation.map((m,i)=>({
          role: m.role || (m.sender||'unknown'),
          content: (m.content || m.text || '').toString(),
          ts: Date.now() + i
        }));
      }
      // else DOM fallback
      const blocks = Array.from(document.querySelectorAll('.response-block'));
      return blocks.map((b,i)=>({
        role: b.classList.contains('user-pulse') ? 'user' : 'assistant',
        content: (b.innerText||b.textContent||'').trim(),
        archetype: b.dataset.archetype || null,
        ts: Date.now() + i
      }));
    }catch(e){
      console.error('captureConversation erro', e);
      return [];
    }
  }

  function renderList(){
    const stacks = loadStacks();
    listEl.innerHTML = '';
    const keys = Object.keys(stacks).sort().reverse();
    if (!keys.length){
      listEl.textContent = 'Nenhuma stack salva.';
      return;
    }
    keys.forEach(k=>{
      const row = document.createElement('div');
      row.style.display='flex';
      row.style.gap='6px';
      row.style.alignItems='center';
      row.style.marginBottom='6px';
      const title = document.createElement('div');
      title.textContent = k;
      title.style.flex = '1';
      title.style.cursor = 'pointer';
      title.title = 'Clique para abrir em nova aba';
      title.addEventListener('click', ()=>{
        const w = window.open('','_blank');
        w.document.write(`<pre style="white-space:pre-wrap;font-family:monospace;background:#04040a;color:#e6f3ff;padding:12px">${escapeHtml(JSON.stringify(stacks[k],null,2))}</pre>`);
      });

      const loadBtn = document.createElement('button'); loadBtn.textContent = '↺'; loadBtn.title='carregar para window.KDX.LOADED_STACK';
      loadBtn.addEventListener('click', ()=>{
        window.KDX = window.KDX || {};
        window.KDX.LOADED_STACK = stacks[k];
        console.info('Stack carregada em window.KDX.LOADED_STACK', k);
        alert('Stack "'+k+'" carregada em window.KDX.LOADED_STACK');
      });

      const exportBtn = document.createElement('button'); exportBtn.textContent='⬇️'; exportBtn.title='exportar essa stack';
      exportBtn.addEventListener('click', ()=>{
        const blob = new Blob([JSON.stringify({[k]:stacks[k]},null,2)], {type:'application/json'});
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = k.replace(/\s+/g,'_') + '.json'; a.click();
        setTimeout(()=> URL.revokeObjectURL(a.href), 3000);
      });

      const delBtn = document.createElement('button'); delBtn.textContent = '🗑️';
      delBtn.addEventListener('click', ()=>{
        if (!confirm('Remover stack "'+k+'"?')) return;
        const s = loadStacks(); delete s[k]; saveStacks(s); renderList();
        console.info('Stack removida', k);
      });

      row.appendChild(title);
      row.appendChild(loadBtn);
      row.appendChild(exportBtn);
      row.appendChild(delBtn);
      listEl.appendChild(row);
    });
  }

  function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  // save current conversation as stack
  function saveCurrentStack(name){
    const key = name && name.trim() ? name.trim() : ('stack-'+new Date().toISOString());
    const s = loadStacks();
    s[key] = {
      meta: { name: key, created: new Date().toISOString(), count: 0 },
      conversation: captureConversation()
    };
    s[key].meta.count = s[key].conversation.length;
    const ok = saveStacks(s);
    if (ok) { renderList(); console.info('Stack salva', key); return key; }
    else { alert('Erro ao salvar stack (ver console)'); return null; }
  }

  saveBtn.addEventListener('click', ()=> {
    const key = saveCurrentStack(nameInput.value || null);
    if (key) { alert('Stack salva: ' + key); nameInput.value = ''; }
  });

  exportAllBtn.addEventListener('click', ()=>{
    const all = loadStacks();
    const blob = new Blob([JSON.stringify(all,null,2)], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'kdx-stacks-'+new Date().toISOString()+'.json'; a.click();
    setTimeout(()=> URL.revokeObjectURL(a.href), 3000);
  });

  importBtn.addEventListener('click', ()=> importFile.click());
  importFile.addEventListener('change', async e=>{
    const f = e.target.files[0];
    if (!f) return;
    try{
      const txt = await f.text();
      const incoming = JSON.parse(txt);
      const exist = loadStacks();
      Object.entries(incoming).forEach(([k,v])=>{
        let key = k;
        if (exist[key]) key = key + ' (import ' + new Date().toISOString() + ')';
        exist[key] = v;
      });
      saveStacks(exist);
      renderList();
      alert('Import concluído.');
    }catch(err){ console.error('import stack err', err); alert('Erro ao importar (veja console)'); }
  });

  // Auto-save logic
  function startAutoSave(){
    stopAutoSave();
    const enabled = autoToggle.checked;
    const intervalSec = Math.max(5, parseInt(autoIntervalInput.value||15,10));
    localStorage.setItem(AUTO_KEY, enabled ? '1' : '0');
    localStorage.setItem(AUTO_INTERVAL_KEY, String(intervalSec));
    if (!enabled) return;
    window._kdxStacksAutoTimer = setInterval(()=>{
      // salva somente se houver conteúdo
      const conv = captureConversation();
      if (conv && conv.length) {
        const name = 'auto-'+new Date().toISOString();
        const s = loadStacks();
        s[name] = { meta:{ name, created:new Date().toISOString(), auto:true, count: conv.length }, conversation: conv };
        saveStacks(s);
        console.info('Auto-saved stack', name);
        renderList();
      }
    }, intervalSec * 1000);
  }
  function stopAutoSave(){
    if (window._kdxStacksAutoTimer) { clearInterval(window._kdxStacksAutoTimer); window._kdxStacksAutoTimer = null; }
  }
  // restore prefs
  (function restoreAutoPrefs(){
    const en = localStorage.getItem(AUTO_KEY) === '1';
    const iv = parseInt(localStorage.getItem(AUTO_INTERVAL_KEY) || '15',10);
    autoToggle.checked = en;
    autoIntervalInput.value = iv;
    if (en) startAutoSave();
  })();
  autoToggle.addEventListener('change', startAutoSave);
  autoIntervalInput.addEventListener('change', startAutoSave);

  // Integrar com botão exportZip (se existir) para incluir stacks
  (function integrateWithExportZip(){
    const exportZipBtn = document.querySelector('.kdxExportBtn.zip') || document.getElementById('kdxDevExportZip');
    if (!exportZipBtn) return;
    // try to monkey-patch its click handler by wrapping its onclick / addEventListener
    const origHandler = exportZipBtn.onclick;
    exportZipBtn.addEventListener('click', (ev)=>{
      // if JSZip is used by page, try to append stacks file into the zip before original handler runs
      try{
        const stacks = loadStacks();
        if (!stacks || Object.keys(stacks).length === 0){ /* nothing to add */ }
        else if (window.JSZip){
          // create zip with stacks and allow original handler (which may create zip too)
          const zip = new window.JSZip();
          zip.file('kdx-stacks.json', JSON.stringify(stacks,null,2));
          zip.generateAsync({type:'blob'}).then(blob=>{
            // trigger download for stacks-only + let original's zip run too
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'kdx-stacks-'+new Date().toISOString()+'.json';
            a.style.display='none';
            document.body.appendChild(a); a.click();
            setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); }, 2500);
          });
        } else {
          // fallback: offer to download stacks json directly
          const blob = new Blob([JSON.stringify(stacks,null,2)], {type:'application/json'});
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
          a.download = 'kdx-stacks-'+new Date().toISOString()+'.json'; a.click();
          setTimeout(()=> URL.revokeObjectURL(a.href), 3000);
        }
      }catch(e){ console.warn('Não foi possível anexar stacks ao ZIP', e); }
      // do not block original handler; both will run
    });
    // keep original onclick if present
    if (typeof origHandler === 'function') exportZipBtn.addEventListener('click', origHandler);
  })();

  // initial render
  renderList();

  // expose helpers globally
  window.KDX = window.KDX || {};
  window.KDX.saveStack = saveCurrentStack;
  window.KDX.getStacks = loadStacks;

  console.info('KDX Stacks plugin initialized.');
})();

