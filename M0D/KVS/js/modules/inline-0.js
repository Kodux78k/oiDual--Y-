
    const STORAGE_KEY = 'zpr-studio-v2-state';
    const HISTORY_MAX = 20;

    const state = {
      activeTab: 'kaos',
      activeView: 'raw',
      activeGenusView: 'assets',
      activeLumineView: 'js',
      rawInput: '',
      zprState: {
        target: '#app-root',
        mode: 'replace',
        html: [],
        css: [],
        js: [],
        inlineJs: [],
        zoneName: 'Nexus Zone',
        presetName: 'ZPR_v2_' + Date.now()
      },
      savedZones: [],
      history: [],
      detectedIds: ['#app-root', '#orb-core', '#brn-arch', '#ZPR'],
      theme: 'dark'
    };

    const KODUX_LIBRARY = {
      "CSS / ROOT": ["https://kodux78k.github.io/oiDual--Y-/css/kxt-solar.css","https://kodux78k.github.io/oiDual--Y-/css/kob-glass-0.css"],
      "ZPR & ORB": ["https://kodux78k.github.io/oiDual--Y-/M0D/di_Pad/css/zpr.css"],
      "DH0 / KOBLLUX": ["https://kodux78k.github.io/oiDual--Y-/M0D/kob-DH0/css/0x01_pulsar_V_D5-2.css"],
      "JS / CORE": ["https://kodux78k.github.io/oiDual--Y-/js/koblluxv30.js"]
    };

    const $ = (id) => document.getElementById(id);
    const escapeHtml = (str) => String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

    function showToast(msg, type='info'){
      const t = $('toast');
      t.textContent = msg;
      t.className = 'toast show';
      if(type==='error') t.style.background = 'rgba(255,107,122,.2)';
      else if(type==='success') t.style.background = 'rgba(47,228,138,.2)';
      else t.style.background = 'rgba(10,14,20,.92)';
      clearTimeout(showToast.timer);
      showToast.timer = setTimeout(() => t.classList.remove('show'), 2500);
    }

    function setTab(tab){
      state.activeTab = tab;
      document.querySelectorAll('.tab').forEach(b => b.classList.toggle('active', b.dataset.tab === tab));
      ['kaos','genus','kobllux','lumine'].forEach(n => $(` tab-${n}`).classList.toggle('hidden', n!==tab));
      
      const titles = {
        kaos: ['Kaos de Entrada', 'Cole HTML, arraste arquivos, processe e veja o resultado.'],
        genus: ['Genus de Estrutura', 'Edite assets, target, modo e valide a zona.'],
        kobllux: ['Kobllux de Fusão', 'Funda zonas salvas em versões novas.'],
        lumine: ['Lumine de Exportação', 'Exporte em JS, HTML ou JSON.']
      };
      $('mainTitle').textContent = titles[tab][0];
      $('mainSubtitle').textContent = titles[tab][1];

      if(tab==='lumine') syncExports();
      if(tab==='kobllux') renderSavedZones();
      renderPreview();
      persist();
    }

    function switchView(v){
      state.activeView = v;
      document.querySelectorAll('[id^="view-"]').forEach(el => el.classList.toggle('hidden', !el.id.includes(v)));
      document.querySelectorAll('.tabs-h button').forEach((b,i) => b.classList.toggle('active', ['raw','preview','history'][i]===v));
    }

    function switchGenusView(v){
      state.activeGenusView = v;
      ['assets','editor','validate'].forEach(n => $(`genus-${n}`).classList.toggle('hidden', n!==v));
      document.querySelectorAll('#tab-genus .tabs-h button').forEach((b,i) => b.classList.toggle('active', ['assets','editor','validate'][i]===v));
    }

    function switchLumineView(v){
      state.activeLumineView = v;
      ['js','html','json'].forEach(n => $(`lumine-${n}`).classList.toggle('hidden', n!==v));
      document.querySelectorAll('#tab-lumine .tabs-h button').forEach((b,i) => b.classList.toggle('active', ['js','html','json'][i]===v));
      syncExports();
    }

    function inferType(url){
      const u = String(url||'').toLowerCase();
      if(u.endsWith('.css') || u.includes('fonts.googleapis')) return 'css';
      if(u.endsWith('.js') || u.includes('unpkg.com')) return 'js';
      if(u.endsWith('.html') || u.endsWith('/')) return 'html';
      return 'unknown';
    }

    function uniq(arr){return [...new Set(arr.filter(Boolean))]}

    function processKaos(){
      const raw = $('rawInput').value || '';
      if(!raw.trim()){showToast('Cole um HTML antes.',  'error');return}

      const parser = new DOMParser();
      const doc = parser.parseFromString(raw, 'text/html');

      const ids = Array.from(doc.querySelectorAll('[id]')).map(el => `#${el.id}`);
      const css = Array.from(doc.querySelectorAll('link[rel="stylesheet"]')).map(el => el.href || '');
      const js = Array.from(doc.querySelectorAll('script[src]')).map(el => el.src || '');
      const inline = Array.from(doc.querySelectorAll('script:not([src])')).map(el => (el.textContent||'').trim()).filter(Boolean);

      const cleanDoc = parser.parseFromString(raw, 'text/html');
      cleanDoc.querySelectorAll('script, link').forEach(el => el.remove());
      const html = (cleanDoc.body?.innerHTML || '').trim();

      state.detectedIds = uniq([...state.detectedIds, ...ids]);
      state.zprState.html = html ? [html, ...state.zprState.html] : state.zprState.html;
      state.zprState.css = uniq([...state.zprState.css, ...css]);
      state.zprState.js = uniq([...state.zprState.js, ...js]);
      state.zprState.inlineJs = [...state.zprState.inlineJs, ...inline];

      addHistory(`Processamento de ${css.length} CSS, ${js.length} JS`);
      updateUI();
      setTab('genus');
      showToast('✓ Kaos processado', 'success');
    }

    function loadUltimateZPR(){
      let css = [], js = [];
      Object.values(KODUX_LIBRARY).flat().forEach(url => {
        if(inferType(url)==='css') css.push(url);
        if(inferType(url)==='js') js.push(url);
      });
      state.zprState.zoneName = 'ZPR Ultimate';
      state.zprState.css = uniq([...state.zprState.css, ...css]);
      state.zprState.js = uniq([...state.zprState.js, ...js]);
      addHistory('Cofre KODUX carregado');
      updateUI();
      setTab('genus');
      persist();
      showToast('✓ Cofre carregado', 'success');
    }

    function saveZone(){
      state.zprState.zoneName = $('zoneNameInput').value || 'Unnamed';
      const snapshot = {
        ...JSON.parse(JSON.stringify(state.zprState)),
        id: Date.now(),
        createdAt: new Date().toLocaleString()
      };
      state.savedZones.unshift(snapshot);
      addHistory(`Zona salva: ${snapshot.zoneName}`);
      persist();
      setTab('kobllux');
      showToast('✓ Zona salva', 'success');
    }

    function removeSaved(id){
      state.savedZones = state.savedZones.filter(z => z.id!==id);
      persist();
      renderSavedZones();
      showToast('Zona removida');
    }

    function loadSavedZone(id){
      const zone = state.savedZones.find(z => z.id===id);
      if(!zone) return;
      state.zprState = JSON.parse(JSON.stringify(zone));
      delete state.zprState.id;
      delete state.zprState.createdAt;
      updateUI();
      setTab('genus');
      persist();
      showToast('✓ Zona carregada', 'success');
    }

    function renderSavedZones(){
      const wrap = $('savedGrid');
      if(!state.savedZones.length){
        wrap.innerHTML = '<div class="muted" style="grid-column:1/-1;padding:20px;text-align:center">Nenhuma zona salva.</div>';
        return;
      }
      wrap.innerHTML = state.savedZones.map(z => `
        <div class="saved">
          <h3 title="${escapeHtml(z.zoneName)}">${escapeHtml(z.zoneName)}</h3>
          <div class="muted" style="font-size:10px">${z.createdAt || 'N/A'}</div>
          <div class="stats" style="margin:12px 0 0">
            <div class="stat"><strong>${z.html.length}</strong><span>HTML</span></div>
            <div class="stat"><strong>${z.css.length}</strong><span>CSS</span></div>
            <div class="stat"><strong>${z.js.length}</strong><span>JS</span></div>
          </div>
          <div class="toolbar" style="margin-top:12px">
            <button class="btn" onclick="loadSavedZone(${z.id})">Carregar</button>
            <button class="btn bad" onclick="removeSaved(${z.id})">Deletar</button>
          </div>
        </div>
      `).join('');
      $('savedCount').textContent = state.savedZones.length + ' zonas';
    }

    function updateUI(){
      $('htmlTextarea').value = state.rawInput;
      $('htmlEditor').value = state.zprState.html.join('\n\n');
      $('inlineEditor').value = state.zprState.inlineJs.join('\n\n');
      $('targetInput').value = state.zprState.target;
      $('modeInput').value = state.zprState.mode;
      $('zoneNameInput').value = state.zprState.zoneName;

      const idsList = $('idsList');
      idsList.innerHTML = state.detectedIds.map(id => `<div class="history-item">${escapeHtml(id)}</div>`).join('') || '<div class="muted">Nenhum.</div>';

      const cssList = $('cssList');
      cssList.innerHTML = state.zprState.css.map(url => `<div class="history-item">${url.split('/').pop()}</div>`).join('') || '<div class="muted">Nenhum.</div>';
      $('cssCnt').textContent = state.zprState.css.length;

      const jsList = $('jsList');
      jsList.innerHTML = state.zprState.js.map(url => `<div class="history-item">${url.split('/').pop()}</div>`).join('') || '<div class="muted">Nenhum.</div>';
      $('jsCnt').textContent = state.zprState.js.length;

      $('countHtml').textContent = state.zprState.html.length;
      $('countCss').textContent = state.zprState.css.length;
      $('countJs').textContent = state.zprState.js.length;
      $('zoneSummary').textContent = `${state.zprState.zoneName} | ${state.zprState.target} | ${state.zprState.mode}`;

      updateCounters();
      syncExports();
      renderPreview();
      renderHistory();
    }

    function updateCounters(){
      $('countHtml').textContent = state.zprState.html.length;
      $('countCss').textContent = state.zprState.css.length;
      $('countJs').textContent = state.zprState.js.length;
    }

    function updateStateFromEditors(){
      state.zprState.target = $('targetInput').value;
      state.zprState.mode = $('modeInput').value;
      state.zprState.zoneName = $('zoneNameInput').value;
      state.zprState.html = $('htmlEditor').value.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
      state.zprState.inlineJs = $('inlineEditor').value.split(/\n{2,}/).map(s => s.trim()).filter(Boolean);
      addHistory('Zona editada manualmente');
      updateUI();
      persist();
      showToast('✓ Edições aplicadas', 'success');
    }

    function validateCode(){
      let errors = [];
      if(!state.zprState.html.length) errors.push('❌ HTML vazio');
      if(!state.zprState.css.length && !state.zprState.js.length) errors.push('⚠️ Sem CSS/JS');
      if(state.zprState.inlineJs.some(s => s.includes('<script>'))) errors.push('❌ Script tags no inline');
      
      const msg = $('validationMsg');
      if(errors.length){
        msg.innerHTML = errors.map(e => `<div class="validation-msg error">${e}</div>`).join('');
        showToast('Erros encontrados', 'error');
      }else{
        msg.innerHTML = '<div class="validation-msg success">✓ Validação OK</div>';
        showToast('✓ Tudo certo', 'success');
      }
    }

    function validateFull(){
      const result = $('validationResults');
      const checks = [
        {name: 'HTML presente', ok: state.zprState.html.length > 0},
        {name: 'Target válido', ok: state.zprState.target.startsWith('#')},
        {name: 'CSS sem erros', ok: state.zprState.css.every(c => c.startsWith('http'))},
        {name: 'JS sem erros', ok: state.zprState.js.every(j => j.startsWith('http'))},
      ];
      result.innerHTML = checks.map(c => `<div class="validation-msg ${c.ok?'success':'error'}">${c.ok?'✓':'❌'} ${c.name}</div>`).join('');
    }

    function minifyHTML(){
      const textarea = $('htmlTextarea');
      textarea.value = textarea.value.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
      showToast('✓ Minificado');
    }

    function formatHTML(){
      const textarea = $('htmlTextarea');
      let html = textarea.value;
      html = html.replace(/</g, '\n<').replace(/>/g, '>\n').split('\n').map(l => l.trim()).filter(Boolean).join('\n');
      textarea.value = html;
      showToast('✓ Formatado');
    }

    function handleDrop(e){
      e.preventDefault();
      e.stopPropagation();
      $('dropzone').classList.remove('dragover');
      const files = e.dataTransfer.files;
      handleFileList(files);
    }

    function handleDragOver(e){
      e.preventDefault();
      e.stopPropagation();
      $('dropzone').classList.add('dragover');
    }

    function handleDragLeave(e){
      e.preventDefault();
      e.stopPropagation();
      $('dropzone').classList.remove('dragover');
    }

    function handleFileInput(e){
      handleFileList(e.target.files);
    }

    function handleFileList(files){
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const content = evt.target.result;
          const type = file.name.split('.').pop().toLowerCase();
          if(type === 'html' || type === 'txt'){
            $('rawInput').value += '\n' + content;
          }else if(type === 'zip'){
            showToast('Arquivo ZIP - extrair manualmente');
          }else{
            $('rawInput').value += '\n' + content;
          }
          addHistory(`Arquivo carregado: ${file.name}`);
          showToast(`✓ ${file.name} carregado`);
        };
        reader.readAsText(file);
      });
    }

    function getJSExport(){
      const z = state.zprState;
      return `/* ZPR STUDIO v2.0 EXPORT */
const ZPR_CONFIG = {
  zoneName: "${z.zoneName}",
  target: "${z.target}",
  mode: "${z.mode}",
  assets: {
    css: ${JSON.stringify(z.css, null, 2)},
    js: ${JSON.stringify(z.js, null, 2)}
  }
};

function applyZPR(){
  const target = document.querySelector(ZPR_CONFIG.target);
  if(!target) return;
  ZPR_CONFIG.assets.css.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  });
  ${z.html.map((h,i) => `target.innerHTML ${i===0?'=':'+'} \`${h}\`;`).join('\n  ')}
  ZPR_CONFIG.assets.js.forEach(url => {
    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
  });
  try{${z.inlineJs.join('\n')}}catch(e){console.error(e)}
}
applyZPR();`;
    }

    function getFullHTML(){
      const z = state.zprState;
      return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${escapeHtml(z.zoneName)} | ZPR</title>
${z.css.map(c => `<link rel="stylesheet" href="${escapeHtml(c)}">`).join('\n')}
<style>body{margin:0;min-height:100vh;background:#05070a;color:#fff;font-family:system-ui,sans-serif}#${z.target.replace('#','')}{width:100%;min-height:100vh}</style>

</head>
<body data-theme="dark" data-arch="kodux">
<div id="${z.target.replace('#','')}">
${z.html.join('\n')}
</div>
${z.js.map(j => `<script src="${escapeHtml(j)}"><\/script>`).join('\n')}
<script>
try{
${z.inlineJs.join('\n')}
}catch(e){console.error(e)}
<\/script>
</body>
</html>`;
    }

```
function syncExports(){
  $('jsExport').value = getJSExport();
  $('htmlExport').value = getFullHTML();
  $('jsonExport').value = JSON.stringify({version:2,zone:state.zprState,saved:state.savedZones}, null, 2);
}

function renderPreview(){
  const z = state.zprState;
  const doc = `<!doctype html>
```

<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${z.css.map(c => `<link rel="stylesheet" href="${escapeHtml(c)}">`).join('\n')}
<style>html,body{margin:0;background:transparent;color:#fff;font-family:system-ui,sans-serif}#${z.target.replace('#','')||'app'}{width:100%;min-height:100vh}</style>
</head>
<body>
<div id="${z.target.replace('#','')||'app'}">
${z.html.join('')}
</div>
${z.js.map(j => `<script src="${escapeHtml(j)}"><\/script>`).join('\n')}
<script>try{${z.inlineJs.join(';')}}catch(e){}
