(function(){
  const STORAGE = {
    ENABLED: 'infodoseEnabled',
    THEME: 'infodoseTheme',
    USER_NAME: 'infodoseUserName',
    ASSISTANT_NAME: 'infodoseAssistantName',
    OPENROUTER_KEY: 'openrouter_api_key',
    OPENROUTER_MODEL: 'openrouter_model',
    VOICE_CONFIG: 'infodoseVoiceConfig',
    VOICE_CURRENT_KEY: 'infodoseVoiceCurrentKey'
  };

  const DEFAULTS = {
    API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    MODEL:   'nvidia/nemotron-3-nano-omni-30b-a3-b-reasoning:free',
    TEMP: 0.2,
    CHUNK_SIZE: 12000
  };

  const synth = window.speechSynthesis || null;
  let currentUtterance = null;
  let availableVoices = [];
  let voiceConfig = null;
  let currentVoiceKey = 'default';

  if (synth) {
    const loadVoices = () => {
      try { availableVoices = synth.getVoices() || []; }
      catch(e){ availableVoices = []; }
    };
    loadVoices();
    synth.onvoiceschanged = loadVoices;
  }

  const qs = (selectors, root = document) => {
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  };

  const responseContainer = qs(['#response']);
  const responseList   = qs(['#responseList']);
  let   bootBlock      = qs(['#bootBlock']);
  const bootText       = qs(['#bootText']);
  const footerHint     = qs(['#footerHint']);
  const copyBtn        = qs(['#copyBtn']);
  const pasteBtn       = qs(['#pasteBtn']);
  const parserBtn      = qs(['#parserBtn']);
  const parserFile     = qs(['#parserFile']);
  const voiceConfigBtn = qs(['#voiceConfigBtn']);
  const voiceConfigFile= qs(['#voiceConfigFile']);
  const toggleLoginBtn = qs(['#toggleLoginBtn']);
  const loginBox       = qs(['#loginBox']);
  const loginForm      = qs(['#loginForm']);
  const userNameInput  = qs(['#profileUserNameInput', '#userName', '#diUserNameInput']);
  const assistantInput = qs(['#assistantInput']);
  const assistantNameEl= qs(['#assistantName']);
  const userInput      = qs(['#chatMessageInput', '#userInput', '#inputText', '#messageInput', '#dualMessageInput']);
  const sendBtn        = qs(['#sendBtn']);
  const themeToggleBtn = qs(['#themeToggle']);
  const voiceBtn       = qs(['#voiceBtn']);

  const iaConfigPanel   = qs(['#iaConfigPanel']);
  const apiKeyInput     = qs(['#apiKeyInput']);
  const modelSelect     = qs(['#modelSelect']);
  const customModelInput= qs(['#customModelInput']);
  const saveIaConfigBtn = qs(['#saveIaConfigBtn']);
  const clearIaConfigBtn= qs(['#clearIaConfigBtn']);
  const iaStatus        = qs(['#iaStatus']);
  const themeSelect     = qs(['#themeSelect']);
  const settingsBtn     = qs(['#toggleSettingsBtn']);

  const CONFIG = {
    API_URL: DEFAULTS.API_URL,
    MODEL: DEFAULTS.MODEL,
    TEMP: DEFAULTS.TEMP,
    CHUNK_SIZE: DEFAULTS.CHUNK_SIZE,
    AUTH_TOKEN: ''
  };

  const ARCHETYPE_KEYWORDS = {
    Atlas:   ["atlas","fluxo","mapa","estrutura","organização","organizar","planejamento","árvore","checklist","estratégia"],
    Nova:    ["nova","começar","começo","ideia","idéia","visão","criar","protótipo","protótipos","imaginar","descobrir","ativar","estado"],
    Vitalis: ["vitalis","corpo","energia","respiração","ritmo","h3o2","saúde","vitalidade","hidratação","movimento"],
    Pulse:   ["pulse","pulso","tempo","ciclo","ciclos","batida","pulsar","ritmo","loop","síncrono","batimento"],
    Artemis: ["artemis","foco","focada","mira","precisão","aventura","explorar","exploração","alvo","caçada"],
    Serena:  ["serena","serenidade","calma","acolhimento","cuidar","suave","pausa","repouso","apoio","paz","tranquilo","tranquilidade"],
    Kaos:    ["kaos","quebra","ruptura","caos","provocação","virada","rebeldia","desalinho","disrupção","choque"],
    Genus:   ["genus","padrão","padrões","tabela","planilha","referência","documento","estrutura lógica","dados","sistematizar"],
    Lumine:  ["lumine","luz","cores","estética","beleza","design","gradiente","iluminar","alegria","lúdico","brincadeira","brilho","colorido"],
    Rhea:    ["rhea","guia","cuidado","conectar","empatia","acompanhamento","profundo","profundidade","vínculo","raízes","intimidade"],
    Solus:   ["solus","unidade","sozinho","inteiro","solo","núcleo","essência","solidão","silêncio","meditação","contemplar","introspecção"],
    Aion:    ["aion","tempo longo","ciclos grandes","eras","fractal","registro","eterno","futuro","linha do tempo","cíclico","infinito"],
    KOBLLUX: ["kobllux","kob","nó raiz","núcleo do sistema","portal","oráculo","meta-sistema"],
    Uno:     ["uno","origem","fonte","essência","essencial","mínimo","minimalista","centro"],
    Dual:    ["dual","espelho","contraste","polaridade","dois lados","reverso","espelhado"],
    Trinity: ["trinity","trindade","tríade","3·6·9","3x","síntese","triângulo","triádico"],
    Infodose:["infodose","dose","arquétipo","arquétipos","ativação","dopamina","pílula"],
    Kodux:   ["kodux","criador","metaconsciência","pulso criador","manifesto","metafuturo"],
    Bllue:   ["bllue","blue","emoção","emocional","sensível","sensação","sensório","intuitivo"],
    Minuz:   ["minuz","minimalista","hacker","hackear","direto ao ponto","compressão","refatorar"],
    HANAH:   ["hanah","hannah","estético","estética","futurista","visual","simbolismo","símbolos"],
    MetaLux: ["metalux","meta lux","lux","oráculo","luxar","portal lux","estético-simbólico"],
  KD1:     ["kd°1","kd1","kd primeiro","KOD1","KDo°1","kod1","78K","kd1x","k-d-1","solus-online"],
  CHRISTOS:["christos","cristo","cristos","christus","kristos","kristos"],
};

  let conversation = [];
  let isCollapsed = true;
  let initialized = false;
  const responseBlocks = [];

  function escapeHtml(s){
    return String(s)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;');
  }

  function loadIaConfigFromStorage(){
    const key   = localStorage.getItem(STORAGE.OPENROUTER_KEY) || '';
    const model = localStorage.getItem(STORAGE.OPENROUTER_MODEL) || DEFAULTS.MODEL;

    CONFIG.API_URL = DEFAULTS.API_URL;
    CONFIG.MODEL   = model || DEFAULTS.MODEL;
    CONFIG.TEMP    = DEFAULTS.TEMP;
    CONFIG.CHUNK_SIZE = DEFAULTS.CHUNK_SIZE;
    CONFIG.AUTH_TOKEN = key ? 'Bearer ' + key : '';

    if (apiKeyInput) apiKeyInput.value = key;

    let optionFound = false;
    if (modelSelect) {
      Array.from(modelSelect.options).forEach(opt=>{
        if (opt.value === model) {
          optionFound = true;
          modelSelect.value = model;
        }
      });
      if (!optionFound) {
        modelSelect.value = 'custom';
        if (customModelInput) customModelInput.value = model;
      }
    }

    if (iaStatus) {
      if (!key) {
        iaStatus.textContent = 'Nenhuma chave salva ainda.';
        iaStatus.className = 'ia-status warn';
      } else {
        iaStatus.textContent = 'Config carregada. Pronto para chamar a IA.';
        iaStatus.className = 'ia-status ok';
      }
    }
  }

  function saveIaConfig(){
    let key = apiKeyInput ? apiKeyInput.value.trim() : '';
    let model = modelSelect ? modelSelect.value : DEFAULTS.MODEL;

    if (model === 'custom') {
      const custom = customModelInput ? customModelInput.value.trim() : '';
      if (custom) model = custom;
    }
    if (!model) model = DEFAULTS.MODEL;

    if (!key) {
      if (iaStatus) {
        iaStatus.textContent = 'Cole uma chave sk-or-... para salvar.';
        iaStatus.className = 'ia-status warn';
      }
      return;
    }

    localStorage.setItem(STORAGE.OPENROUTER_KEY, key);
    localStorage.setItem(STORAGE.OPENROUTER_MODEL, model);

    CONFIG.AUTH_TOKEN = 'Bearer ' + key;
    CONFIG.MODEL = model;

    if (iaStatus) {
      iaStatus.textContent = 'Config salva com sucesso.';
      iaStatus.className = 'ia-status ok';
    }
  }

  function saveConversationNow(){
    try{
      const snap = {
        ts: new Date().toISOString(),
        conversation: conversation.slice(0,100)
      };
      const key = 'KDX_CONV_' + snap.ts;
      localStorage.setItem(key, JSON.stringify(snap));
      const idx = JSON.parse(localStorage.getItem('KDX_CONV_INDEX') || '[]');
      idx.unshift(key);
      localStorage.setItem('KDX_CONV_INDEX', JSON.stringify(idx.slice(0,50)));
      if (footerHint) footerHint.textContent = 'Conversa salva.';
      renderHistoryItems();
      return true;
    }catch(e){
      console.error(e);
      if (footerHint) footerHint.textContent = 'Erro ao salvar conversa.';
      return false;
    }
  }

  function renderHistoryItems(){
    const container = document.getElementById('kdxHistoryItems');
    if (!container) return;
    container.innerHTML = '';
    const idx = JSON.parse(localStorage.getItem('KDX_CONV_INDEX') || '[]');
    if (idx.length === 0){
      container.innerHTML = '<div class="lv-callout lv-aside">Nenhuma conversa salva ainda.</div>';
      return;
    }
    idx.forEach(k=>{
      try{
        const snap = JSON.parse(localStorage.getItem(k));
        const el = document.createElement('div');
        el.className = 'md-tabelista';
        el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;">
            <div><strong>${snap.ts}</strong><div style="opacity:.85;font-size:.82rem">${snap.conversation.length} itens</div></div>
            <div style="display:flex;gap:6px">
              <button class="lv-btn" data-load="${k}">Carregar</button>
              <button class="lv-btn secondary" data-delete="${k}">Excluir</button>
            </div>
          </div>`;
        container.appendChild(el);
      }catch(e){}
    });

    container.querySelectorAll('[data-load]').forEach(btn=>{
      btn.addEventListener('click', (ev)=>{
        const key = ev.currentTarget.dataset.load;
        const snap = JSON.parse(localStorage.getItem(key));
        if (snap){
          conversation = snap.conversation.slice();
          responseList.innerHTML = '';
          conversation.slice().reverse().forEach(item=>{
            const d = document.createElement('div');
            d.className = 'response-block middle';
            d.innerHTML = `<div><strong>${escapeHtml(item.role)}</strong><div style="opacity:.85;margin-top:6px">${escapeHtml(item.content || '')}</div></div>`;
            responseList.appendChild(d);
          });
          if (footerHint) footerHint.textContent = 'â€•Conversa carregada do histórico.';
        }
      });
    });

    container.querySelectorAll('[data-delete]').forEach(btn=>{
      btn.addEventListener('click', (ev)=>{
        const key = ev.currentTarget.dataset.delete;
        localStorage.removeItem(key);
        const idx = JSON.parse(localStorage.getItem('KDX_CONV_INDEX') || '[]').filter(k=>k!==key);
        localStorage.setItem('KDX_CONV_INDEX', JSON.stringify(idx));
        renderHistoryItems();
      });
    });
  }

  function maybeAutoSave(){
    if (localStorage.getItem('KDX_AUTOSAVE') === '1'){
      clearTimeout(window.__kdx_auto_save_t_);
      window.__kdx_auto_save_t_ = setTimeout(()=> {
        saveConversationNow();
      }, 1200);
    }
  }

  function pushConversation(item){
    conversation.unshift(item);
    maybeAutoSave();
  }

  function clearIaConfig(){
    localStorage.removeItem(STORAGE.OPENROUTER_KEY);
    localStorage.removeItem(STORAGE.OPENROUTER_MODEL);
    if (apiKeyInput) apiKeyInput.value = '';
    if (customModelInput) customModelInput.value = '';
    if (modelSelect) modelSelect.value = DEFAULTS.MODEL;
    CONFIG.AUTH_TOKEN = '';
    CONFIG.MODEL = DEFAULTS.MODEL;
    if (iaStatus) {
      iaStatus.textContent = 'Config limpa. Defina novamente antes de enviar.';
      iaStatus.className = 'ia-status warn';
    }
  }

  if (saveIaConfigBtn) saveIaConfigBtn.addEventListener('click', saveIaConfig);
  if (clearIaConfigBtn) clearIaConfigBtn.addEventListener('click', clearIaConfig);

  function applyTheme(theme){
    document.body.dataset.theme = theme;
    localStorage.setItem(STORAGE.THEME, theme);
    if (themeSelect) themeSelect.value = theme;
  }

  function restoreTheme(){
    const theme = localStorage.getItem(STORAGE.THEME) || 'dark';
    applyTheme(theme);
  }

  if (themeSelect){
    themeSelect.addEventListener('change', ()=>{
      applyTheme(themeSelect.value || 'dark');
    });
  }

  const settingsPanelId = 'kdxSettingsPanel';

  function ensureSettingsPanel(){
    if (document.getElementById(settingsPanelId)) return;
    const panel = document.createElement('aside');
    panel.id = settingsPanelId;
    panel.className = 'kdx-settings-panel';
    panel.innerHTML = `
      <header class="kdx-sp-header">
        <strong>Configurações · Dual.Infodose</strong>
        <button id="kdxSpClose" aria-label="Fechar">✕</button>
      </header>
      <div style="z-index:0" class="kdx-sp-body">
        <section class="kdx-section">
          <label>Tema</label>
          <select id="kdxThemeSelect">
            <option value="dark">Dark</option>
            <option value="medium">Medium Light</option>
            <option value="vibe">Vibe</option>
          </select>
        </section>

        <section class="kdx-section">
          <label>Estilo de página</label>
          <div>
            <button class="kdx-style-btn" data-style="default">Padrão</button>
            <button class="kdx-style-btn" data-style="minimal">Minimal</button>
            <button class="kdx-style-btn" data-style="78k">78K Turbo</button>
          </div>
        </section>

        <section class="kdx-section">
          <label>Voz / Arquétipo ativo</label>
          <div style="display:flex;gap:8px;align-items:center;">
            <select id="kdxVoiceSelect"></select>
            <button id="kdxVoiceApply" class="pill-btn">Aplicar</button>
          </div>
          <small id="kdxVoiceHint" style="opacity:.8;display:block;margin-top:6px;">A voz será selecionada automaticamente ao ler blocos por arquétipo; aqui você pode sobrescrever.</small>
        </section>

        <section class="kdx-section">
          <label>Histórico & Salvamento</label>
          <div style="display:flex;gap:8px;align-items:center;">
            <button id="kdxOpenHistory" class="pill-btn secondary">Abrir Histórico</button>
            <button id="kdxSaveConv" class="pill-btn">Salvar Agora</button>
          </div>
          <div style="margin-top:8px;">
            <label><input type="checkbox" id="kdxAutoSave"/> Salvar conversas automaticamente</label>
          </div>
        </section>

        <section id="kdxHistoryList" class="kdx-section" style="display:none;">
          <label>Histórico de conversas</label>
          <div id="kdxHistoryItems" style="max-height:220px;overflow:auto;"></div>
        </section>
      </div>
      <footer class="kdx-sp-footer">
        <small>Registro Vivo Δ7</small>
      </footer>
    `;
    document.body.appendChild(panel);

    document.getElementById('kdxSpClose').addEventListener('click', ()=>panel.classList.remove('active'));
    document.getElementById('kdxThemeSelect').addEventListener('change', (e)=> {
      applyTheme(e.target.value === 'medium' ? 'medium' : e.target.value);
      localStorage.setItem(STORAGE.THEME, e.target.value);
    });
    document.querySelectorAll('.kdx-style-btn').forEach(btn=>{
      btn.addEventListener('click', (ev)=>{
        const style = ev.currentTarget.dataset.style;
        document.body.dataset.pageStyle = style;
        localStorage.setItem('PAGE_STYLE', style);
        if (style === 'minimal'){
          document.documentElement.style.setProperty('--kob-voice-theme-duration','250ms');
          document.documentElement.style.setProperty('--shadow-soft','0 6px 12px rgba(0,0,0,.45)');
          document.body.classList.add('minimal-style');
          document.body.classList.remove('turbo-style');
        } else if (style === '78k'){
          document.body.classList.add('turbo-style');
          document.body.classList.remove('minimal-style');
        } else {
          document.body.classList.remove('minimal-style','turbo-style');
        }
      });
    });

    const voiceSel = document.getElementById('kdxVoiceSelect');
    const archKeys = Object.keys(window.KOBLLUX_VOICES || {}).sort();
    voiceSel.innerHTML = '<option value="">Automático (por arquétipo)</option>' + archKeys.map(k=>`<option value="${k}">${k}</option>`).join('');
    document.getElementById('kdxVoiceApply').addEventListener('click', ()=>{
      const v = voiceSel.value;
      if (v){
        voiceConfig = voiceConfig || {};
        voiceConfig.default = voiceConfig.default || {};
        voiceConfig.default.voiceHint = (window.KOBLLUX_VOICES && KOBLLUX_VOICES[v] && KOBLLUX_VOICES[v].voice) || v;
        localStorage.setItem(STORAGE.VOICE_CONFIG, JSON.stringify(voiceConfig));
        if (footerHint) footerHint.textContent = `Voz sobrescrita: ${v}`;
      } else {
        if (footerHint) footerHint.textContent = 'Voz automática por arquétipo.';
        if (voiceConfig && voiceConfig.default) {
          delete voiceConfig.default;
          localStorage.setItem(STORAGE.VOICE_CONFIG, JSON.stringify(voiceConfig));
        }
      }
    });

    document.getElementById('kdxOpenHistory').addEventListener('click', ()=>{
      const hsec = document.getElementById('kdxHistoryList');
      hsec.style.display = hsec.style.display === 'none' ? 'block' : 'none';
      renderHistoryItems();
    });

    document.getElementById('kdxSaveConv').addEventListener('click', saveConversationNow);

    const auto = localStorage.getItem('KDX_AUTOSAVE') === '1';
    document.getElementById('kdxAutoSave').checked = auto;
    document.getElementById('kdxAutoSave').addEventListener('change', (e)=>{
      localStorage.setItem('KDX_AUTOSAVE', e.target.checked ? '1' : '0');
    });
  }

  function openSettingsPanel(){
    ensureSettingsPanel();
    const panel = document.getElementById('kdxSettingsPanel');
    if (!panel) return;
    panel.classList.add('active');
    const sel = document.getElementById('kdxThemeSelect');
    if (sel) sel.value = (localStorage.getItem(STORAGE.THEME) || 'dark');
    const style = localStorage.getItem('PAGE_STYLE') || 'default';
    document.body.dataset.pageStyle = style;
  }

  if (themeToggleBtn){
    themeToggleBtn.addEventListener('click', (ev)=>{
      ev.preventDefault();
      openSettingsPanel();
    });
  }

  function restoreNames(){
    const user = localStorage.getItem(STORAGE.USER_NAME) || '';
    const asst = localStorage.getItem(STORAGE.ASSISTANT_NAME) || 'Dual.Infodose · Cinemático';
    if (user && userNameInput) userNameInput.value = user;
    if (asst && assistantInput) assistantInput.value = asst;
    if (assistantNameEl) assistantNameEl.textContent = asst;
  }

  if (toggleLoginBtn){
    toggleLoginBtn.addEventListener('click', ()=>{
      loginBox.classList.toggle('active');
    });
  }

  if (loginForm){
    loginForm.addEventListener('submit',(ev)=>{
      ev.preventDefault();
      const user = userNameInput ? (userNameInput.value.trim() || 'Você') : 'Você';
      const asst = assistantInput ? (assistantInput.value.trim() || 'Dual.Infodose') : 'Dual.Infodose';
      localStorage.setItem(STORAGE.USER_NAME, user);
      localStorage.setItem(STORAGE.ASSISTANT_NAME, asst);
      if (assistantNameEl) assistantNameEl.textContent = asst;
      loginBox.classList.remove('active');
      conversation.unshift({
        role:'system',
        content:`O usuário se chama ${user}. O assistente se apresenta como ${asst}. Responda com carinho cinematográfico.`
      });
    });
  }

  function setCollapsed(state){
    isCollapsed = state;
    if (!responseContainer) return;
    if (isCollapsed) responseContainer.classList.add('collapsed');
    else responseContainer.classList.remove('collapsed');
  }

  if (footerHint){
    footerHint.addEventListener('click', ()=>{
      setCollapsed(!isCollapsed);
    });
  }

  if (settingsBtn && iaConfigPanel){
    settingsBtn.addEventListener('click', ()=>{
      iaConfigPanel.classList.toggle('active');
    });
  }

  if (parserBtn){
    parserBtn.addEventListener('click', ()=>{
      parserFile.value = '';
      parserFile.click();
    });
  }

  if (parserFile){
    parserFile.addEventListener('change', ()=>{
      const file = parserFile.files && parserFile.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ()=>{
        const content = reader.result || '';
        const name = file.name.toLowerCase();
        if (name.endsWith('.css')){
          const style = document.createElement('style');
          style.textContent = content;
          document.head.appendChild(style);
          if (footerHint) footerHint.textContent = 'CSS extra de renderização aplicado.';
        } else if (name.endsWith('.js')){
          try{
            const fn = new Function('window','document', content);
            fn(window,document);
            if (footerHint) footerHint.textContent = 'Parser JS carregado. Se definiu window.customMarkdownParser(text), já está ativo.';
          }catch(e){
            console.error('Erro ao avaliar parser JS:', e);
            if (footerHint) footerHint.textContent = 'Erro ao carregar parser JS. Veja o console.';
          }
        } else {
          if (footerHint) footerHint.textContent = 'Formato não suportado. Use .js ou .css.';
        }
      };
      reader.readAsText(file);
    });
  }

  function updateVoiceOrbLabel(){
    if (!voiceConfigBtn) return;
    const label = currentVoiceKey || 'voz';
    voiceConfigBtn.title = voiceConfig
      ? 'Voz atual: ' + label + ' (clique para alternar)'
      : 'Carregar / alternar vozes de arquétipos';
  }

  function loadVoiceConfigFromStorage(){
    try{
      const raw = localStorage.getItem(STORAGE.VOICE_CONFIG);
      if (!raw) return;
      voiceConfig = JSON.parse(raw);
      const keys = Object.keys(voiceConfig || {});
      if (!keys.length) return;
      const storedKey = localStorage.getItem(STORAGE.VOICE_CURRENT_KEY);
      const candidate =
        (storedKey && keys.includes(storedKey)) ? storedKey :
        (voiceConfig.current && keys.includes(voiceConfig.current)) ? voiceConfig.current :
        (keys.includes('default') ? 'default' : keys[0]);
      currentVoiceKey = candidate;
      updateVoiceOrbLabel();
    }catch(e){
      console.warn('Erro ao carregar config de voz:', e);
      voiceConfig = null;
    }
  }

  if (voiceConfigBtn){
    voiceConfigBtn.addEventListener('click', ()=>{
      if (!voiceConfig){
        if (voiceConfigFile) voiceConfigFile.click();
        return;
      }
      const keys = Object.keys(voiceConfig).filter(k=>k!=='current');
      if (!keys.length) return;
      const idx = keys.indexOf(currentVoiceKey);
      const nextKey = keys[(idx + 1 + keys.length) % keys.length];
      currentVoiceKey = nextKey;
      localStorage.setItem(STORAGE.VOICE_CURRENT_KEY, currentVoiceKey);
      updateVoiceOrbLabel();
      if (footerHint) footerHint.textContent = 'Voz ativa: ' + currentVoiceKey;
    });
  }

  if (voiceConfigFile){
    voiceConfigFile.addEventListener('change', ()=>{
      const file = voiceConfigFile.files && voiceConfigFile.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ()=>{
        try{
          const json = JSON.parse(reader.result || '{}');
          if (!json || typeof json !== 'object'){
            if (footerHint) footerHint.textContent = 'JSON inválido de vozes.';
            return;
          }
          voiceConfig = json;
          const keys = Object.keys(voiceConfig);
          if (!keys.length){
            if (footerHint) footerHint.textContent = 'JSON de vozes vazio.';
            return;
          }
          const candidate =
            (voiceConfig.current && keys.includes(voiceConfig.current)) ? voiceConfig.current :
            (keys.includes('default') ? 'default' : keys[0]);
          currentVoiceKey = candidate;
          localStorage.setItem(STORAGE.VOICE_CONFIG, JSON.stringify(voiceConfig));
          localStorage.setItem(STORAGE.VOICE_CURRENT_KEY, currentVoiceKey);
          updateVoiceOrbLabel();
          if (footerHint) footerHint.textContent = 'Config de vozes carregada: ' + keys.join(', ');
        }catch(e){
          console.error('Erro ao ler JSON de vozes:', e);
          if (footerHint) footerHint.textContent = 'Erro ao carregar JSON de vozes. Veja o console.';
        }
      };
      reader.readAsText(file);
    });
  }

  function buildTabelistaHtml(rawBlock){
    const lines = String(rawBlock).trim().split('\n').filter(l=>l.trim().startsWith('|'));
    if (lines.length < 3){
      return '<pre>' + escapeHtml(rawBlock).replace(/\n/g,'<br/>') + '</pre>';
    }
    function cells(line){
      return line.trim().replace(/^\||\|$/g,'').split('|').map(c=>c.trim());
    }
    const headerCells = cells(lines[0]);
    const headerText = headerCells.join(' | ');
    const secondCells = cells(lines[1]);
    const isSeparator = secondCells.every(c=>/^:?-+:?$/.test(c));
    const subText = isSeparator ? '' : secondCells.join(' | ');
    const dataLines = lines.slice(isSeparator ? 2 : 1);
    let html = '<div class="md-tabelista">';
    html += '<div class="tbl-head">'+escapeHtml(headerText)+'</div>';
    if (subText) html += '<div class="tbl-sub">'+escapeHtml(subText)+'</div>';
    html += '<ul>';
    dataLines.forEach(line=>{
      const cols = cells(line);
      if (!cols.length) return;
      const col1 = escapeHtml(cols[0]);
      const rest = cols.slice(1).map((c,idx)=>{
        const cls = 'tbl-col'+(idx+2);
        if (idx===0) return '<span class="'+cls+'">('+escapeHtml(c)+')</span>';
        return '<span class="'+cls+'">'+escapeHtml(c)+'</span>';
      }).join(' | ');
      html += '<li><span class="tbl-col1">'+col1+'</span>';
      if (rest) html += ' | '+rest;
      html += '</li>';
    });
    html += '</ul></div>';
    return html;
  }

  function parseMarkdownBasic(rawText){
    if (!rawText) return '';
    if (typeof window.customMarkdownParser === 'function'){
      try{
        const html = window.customMarkdownParser(rawText);
        if (typeof html === 'string') return html;
      }catch(e){
        console.warn('customMarkdownParser falhou, usando parser interno.', e);
      }
    }
    let text = String(rawText);

    const tableMap = {};
    let tableIndex = 0;
    text = text.replace(/((?:^\|.*\n?){3,})/gm,(match)=>{
      const id = '@@TABLE_'+(tableIndex++)+'@@';
      tableMap[id] = buildTabelistaHtml(match);
      return id;
    });

    text = escapeHtml(text);
    text = text.replace(/\r\n/g,'\n');

    text = text.replace(/\[\[btn:([^\]|]+)(?:\|([^\]]+))?\]\]/g, function(_m,action,label){
      const act = escapeHtml(action.trim());
      const lab = escapeHtml((label && label.trim()) || action.trim());
      return '<button class="lv-btn" data-action="'+act+'">'+lab+'</button>';
    });

    text = text.replace(/^::(info|warn|success|question|aside)\s+(.*)$/gm,
      '<div class="lv-callout lv-$1">$2</div>');

    text = text.replace(/\*\*\*([^*]+)\*\*\*/g,'<strong><em>$1</em></strong>');
    text = text.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g,'<em>$1</em>');
    text = text.replace(/`([^`]+)`/g,'<code>$1</code>');

    text = text.replace(/```([\s\S]*?)```/g,function(_m,code){
      return '<pre><code>' + code.replace(/</g,'&lt;').replace(/>/g,'&gt;') + '</code></pre>';
    });

    text = text.replace(/^### (.*)$/gim,'<h3>$1</h3>');
    text = text.replace(/^## (.*)$/gim,'<h2>$1</h2>');
    text = text.replace(/^# (.*)$/gim,'<h1>$1</h1>');
    text = text.replace(/^> (.*)$/gim,'<blockquote>$1</blockquote>');
    text = text.replace(/^\s*[-*+] (.*)$/gim,'<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/gims,'<ul>$1</ul>');

    Object.keys(tableMap).forEach(id=>{
      text = text.replace(id, tableMap[id]);
    });

    return text;
  }

  function splitResponseCinematic(text){
    const parts = text.split(/\n{2,}/).map(p=>p.trim()).filter(Boolean);
    if (!parts.length){
      return [{
        kind:'middle',
        html:'<p>'+parseMarkdownBasic(text).replace(/\n/g,'<br/>')+'</p>'
      }];
    }
    const blocks = [];
    parts.forEach((p,idx)=>{
      const kind = idx===0 ? 'intro' : (idx===parts.length-1 ? 'ending' : 'middle');
      const html = '<p>'+parseMarkdownBasic(p).replace(/\n/g,'<br/>')+'</p>';
      blocks.push({ kind, html });
    });
    return blocks;
  }

  function getBlockText(block){
    if (!block) return '';
    const clone = block.cloneNode(true);
    clone.querySelectorAll('.block-tts-btn,.archetype-badge').forEach(el=>el.remove());
    return (clone.innerText || clone.textContent || '').trim();
  }

  const SPEAK_COUNT = 9;
  const PAUSE_BETWEEN_BLOCKS_MS = 120;
  const HIGHLIGHT_CLASS = 'speaking';
  const HIGHLIGHT_DURATION = 90;

  function detectArchetypeFromText(text){
    if (!text) return null;
    const t = text.toLowerCase();
    let best = null;
    let bestScore = 0;
    Object.entries(ARCHETYPE_KEYWORDS).forEach(([name,words])=>{
      let score = 0;
      if (t.includes(name.toLowerCase())) score += 10;
      words.forEach(w=>{
        if (t.includes(String(w).toLowerCase())) score++;
      });
      if (score > bestScore){
        bestScore = score;
        best = name;
      }
    });
    return bestScore > 0 ? best : null;
  }

  function markBlockArchetype(div, archeName){
    if (!div || !archeName) return;
    div.dataset.archetype = archeName;
    let badge = div.querySelector('.archetype-badge');
    if (!badge){
      badge = document.createElement('span');
      badge.className = 'archetype-badge';
      div.appendChild(badge);
    }
    badge.textContent = archeName;
  }

  function resolveBlockArchetypes(block, text){
    const tagArch = (block && block.dataset && block.dataset.archetype) ? String(block.dataset.archetype).trim() : '';
    const textArch = detectArchetypeFromText(text);
    const stack = [tagArch, textArch].filter(Boolean);
    const uniqueStack = [...new Set(stack)];
    return {
      tagArch: tagArch || null,
      textArch: textArch || null,
      detectedArch: uniqueStack[0] || null,
      stack: uniqueStack
    };
  }

  function speakBlock(block){
    if (!synth){
      if (footerHint) footerHint.textContent = 'Seu navegador não suporta voz (SpeechSynthesis).';
      return;
    }
    if (!block){
      if (footerHint) footerHint.textContent = 'Nenhum bloco selecionado.';
      return;
    }
    const text = getBlockText(block);
    if (!text){
      if (footerHint) footerHint.textContent = 'Nada para ler nesse bloco.';
      return;
    }

    const resolved = resolveBlockArchetypes(block, text);
    if (resolved.stack.length) {
      block.dataset.archetypeStack = resolved.stack.join('|');
    }

    if (resolved.detectedArch){
      currentVoiceKey = resolved.detectedArch;
      localStorage.setItem('ARCHETYPE_ACTIVE', resolved.detectedArch);
      localStorage.setItem(STORAGE.VOICE_CURRENT_KEY, currentVoiceKey);
      markBlockArchetype(block, resolved.detectedArch);
      updateVoiceOrbLabel();
    }

    if (synth.speaking){
      synth.cancel();
      if (voiceBtn) voiceBtn.classList.remove('speaking');
    }

    const utter = new SpeechSynthesisUtterance(text);

    let profile = null;
    if (voiceConfig){
      if (currentVoiceKey && voiceConfig[currentVoiceKey]){
        profile = voiceConfig[currentVoiceKey];
      } else if (voiceConfig.default){
        profile = voiceConfig.default;
      }
    }

    const lang  = profile && profile.lang  ? profile.lang  : 'pt-BR';
    const rate  = (profile && typeof profile.rate  === 'number') ? profile.rate  : 1;
    const pitch = (profile && typeof profile.pitch === 'number') ? profile.pitch : 1;
    const vol   = (profile && typeof profile.volume === 'number') ? profile.volume : 1;

    utter.lang   = lang;
    utter.rate   = rate;
    utter.pitch  = pitch;
    utter.volume = vol;

    if (profile && profile.voiceHint && availableVoices && availableVoices.length){
      const hint = String(profile.voiceHint).toLowerCase();
      let chosen = availableVoices.find(v=>v.name.toLowerCase().includes(hint));
      if (!chosen) chosen = availableVoices.find(v=>v.lang === lang) || null;
      if (chosen) utter.voice = chosen;
    }

    currentUtterance = utter;

    utter.onstart = ()=>{
      if (voiceBtn) voiceBtn.classList.add('speaking');
      if (footerHint) footerHint.textContent = 'Lendo o bloco em voz alta.';
    };
    utter.onend = ()=>{
      if (voiceBtn) voiceBtn.classList.remove('speaking');
      if (footerHint) footerHint.textContent = 'Leitura concluída.';
    };
    utter.onerror = ()=>{
      if (voiceBtn) voiceBtn.classList.remove('speaking');
     // if (footerHint) footerHint.textContent = 'Erro ao tentar falar.';
    };

    synth.cancel();
    synth.speak(utter);
  }

  function speakBlockPromise(block){
    return new Promise((resolve) => {
      if (!block) return resolve();

      const text = getBlockText(block);
      if (!text) return resolve();

      block.dataset.state = 'spoken';
      block.classList.add(HIGHLIGHT_CLASS);

      function finish(){
        setTimeout(()=>{
          block.classList.remove(HIGHLIGHT_CLASS);
          resolve();
        }, HIGHLIGHT_DURATION);
      }

      if (typeof synth !== 'undefined' && synth && 'speak' in synth && typeof speakBlock === 'function'){
        try {
          speakBlock(block);
        } catch (e){
          console.warn('speakBlock threw', e);
          const estMs = Math.min(Math.max(text.length * 35, 500), 12000);
          setTimeout(finish, estMs);
          return;
        }

        const utter = currentUtterance;
        if (utter){
          const origOnEnd = utter.onend;
          let called = false;
          utter.onend = function(e){
            try { if (typeof origOnEnd === 'function') origOnEnd.call(this,e); } catch(err){ console.warn(err); }
            if (!called){
              called = true;
              finish();
            }
          };
          const origOnError = utter.onerror;
          utter.onerror = function(e){
            try { if (typeof origOnError === 'function') origOnError.call(this,e); } catch(err){ console.warn(err); }
            if (!called){
              called = true;
              finish();
            }
          };
          const safetyTimeout = Math.min(Math.max(text.length * 60, 2000), 20000);
          setTimeout(()=>{ if (!called){ called = true; finish(); } }, safetyTimeout);
          return;
        } else {
          const estMs = Math.min(Math.max(text.length * 40, 500), 12000);
          setTimeout(finish, estMs);
          return;
        }
      } else {
        const estMs = Math.min(Math.max(text.length * 40, 500), 12000);
        setTimeout(finish, estMs);
        return;
      }
    });
  }

  function getSpeakableBlocks(){
    return (responseBlocks || []).filter(b => b && b.parentNode && !b.classList.contains('user-pulse'));
  }

  async function speakRecentBlocks(count = SPEAK_COUNT, opts = {}){
    if (!responseBlocks || !responseBlocks.length) return;
    let blocks = getSpeakableBlocks();

    if (!isFinite(count)){
      // já está tudo
    } else {
      const start = Math.max(0, blocks.length - count);
      blocks = blocks.slice(start);
    }

    for (let i = 0; i < blocks.length; i++){
      const b = blocks[i];
      if (b) b.dataset.state = 'spoken';
      await speakBlockPromise(b);
      if (opts.pauseBetween) await new Promise(r => setTimeout(r, opts.pauseBetween));
      else await new Promise(r => setTimeout(r, PAUSE_BETWEEN_BLOCKS_MS));
    }
  }

  function speakLastBlock(){
    speakRecentBlocks(1);
  }

  function onBlockClick(ev){
    const block = ev.currentTarget;
    block.classList.add('clicked');
    setTimeout(() => block.classList.remove('clicked'), 350);

    const state = block.dataset.state || 'idle';
    const text = getBlockText(block);
    if (!text) return;

    if (state === 'idle' || state === 'sent'){
      block.dataset.state = 'spoken';
      speakBlock(block);
      return;
    }

    if (state === 'spoken'){
      block.dataset.state = 'sent';
      sendPrompt(text, { fromBlock: true });
      return;
    }
  }

  function addTtsButtonToBlock(div){
    if (!div || div.querySelector('.block-tts-btn')) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'block-tts-btn';
    btn.textContent = '◎';
    btn.addEventListener('click',(ev)=>{
      ev.stopPropagation();
      speakBlock(div);
    });
    div.appendChild(btn);
  }

  function enhanceBlock(div){
    if (!div) return;
    div.dataset.state = div.dataset.state || 'idle';
    div.addEventListener('click', onBlockClick);
    addTtsButtonToBlock(div);
    const t = getBlockText(div);
    const arch = detectArchetypeFromText(t);
    if (arch) markBlockArchetype(div, arch);
    if (!responseBlocks.includes(div)) responseBlocks.push(div);
  }

  if (bootBlock) enhanceBlock(bootBlock);

  function appendBlocksFromData(blocks){
    if (!blocks || !blocks.length) return;
    if (bootBlock){
      bootBlock.remove();
      bootBlock = null;
    }
    blocks.forEach(page=>{
      const div = document.createElement('div');
      div.className = 'response-block ' + (page.kind || 'middle');
      div.dataset.role = 'assistant';
      div.innerHTML = page.html;
      enhanceBlock(div);
      responseList.appendChild(div);
    });
  }

  function appendUserPulseBlock(text){
    if (!text) return;
    if (bootBlock){
      bootBlock.remove();
      bootBlock = null;
    }
    const div = document.createElement('div');
    div.className = 'response-block user-pulse';
    div.dataset.role = 'user';
    const html = '<p>'+parseMarkdownBasic(text).replace(/\n/g,'<br/>')+'</p>';
    div.innerHTML = html;
    enhanceBlock(div);
    responseList.appendChild(div);
  }

  function buildSystemPrompt(){
    const userName = localStorage.getItem(STORAGE.USER_NAME) || 'humano';
    const asstName = localStorage.getItem(STORAGE.ASSISTANT_NAME) || 'Dual.Infodose';

    return [
      `${asstName} é o assistente Cinemático da Infodose, especializado em respostas em blocos.`,
      '1. Responda em português por padrão.',
      '2. Use blocos curtos, com títulos, listas e callouts (::info, ::warn, ::success, ::question, ::aside) quando fizer sentido.',
      '3. Cada parágrafo separado por linha vazia vira um bloco independente.',
      '4. Priorize explicações práticas, exemplos e micro-ações de 1%.',
      '5. Quando fizer sentido, use Tabelista (linhas com "- |" ) para estruturar comparações.',
      '6. Não peça chave de API; assuma que a infraestrutura já está pronta do lado do usuário.',
      `7. O usuário se chama ${userName}; fale com ele pelo nome algumas vezes, mas sem exagero.`
    ].join('\n');
  }

  async function callOpenRouter(promptText){
    if (!CONFIG.AUTH_TOKEN){
      throw new Error('Defina a chave OpenRouter no painel de Config IA.');
    }

    const userName = localStorage.getItem(STORAGE.USER_NAME) || 'Você';
    const asstName = localStorage.getItem(STORAGE.ASSISTANT_NAME) || 'Dual.Infodose';
    const sysPrompt = buildSystemPrompt();

    const messages = [
      { role:'system', content: sysPrompt },
      ...conversation,
      { role:'user', content: `${userName} diz: ${promptText}` }
    ];

    const body = {
      model: CONFIG.MODEL,
      temperature: CONFIG.TEMP,
      messages,
      max_tokens: 1200
    };

    const res = await fetch(CONFIG.API_URL,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Authorization': CONFIG.AUTH_TOKEN,
          'HTTP-Referer': location.origin,
       // 'HTTP-Referer': 'https://infodose.com.br',
        'X-Title':'Dual-Infodose Chat Cinemático'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok){
      const txt = await res.text().catch(()=> '');
      console.error('Erro IA:', txt);
      throw new Error('Falha na resposta da IA: '+res.status);
    }

    const data = await res.json();
    const choice = data.choices && data.choices[0];
    const content = choice?.message?.content || '(sem conteúdo retornado)';

    conversation.push({ role:'user', content:promptText });
    conversation.push({ role:'assistant', content });

    return content;
  }

  async function sendPrompt(promptText, options){
    const opts = options || {};
    const fromBlock = !!opts.fromBlock;
    const text = (promptText || '').trim();
    if (!text) return;

    setCollapsed(false);
    if (!fromBlock && userInput) userInput.value = '';
    if (userInput) userInput.disabled = true;
    if (sendBtn) sendBtn.disabled   = true;

    const oldFooter = footerHint ? footerHint.textContent : '';

    if (footerHint) {
      footerHint.textContent = fromBlock
        ? 'Pulso em expansão a partir do bloco.'
        : 'Processando pulso.';
    }

    if (synth && synth.speaking){
      synth.cancel();
      if (voiceBtn) voiceBtn.classList.remove('speaking');
    }

    appendUserPulseBlock(text);

    try{
      if (!CONFIG.AUTH_TOKEN){
        const localMsg = [
          '::info Modo local ativo (sem OpenRouter).',
          '',
          'Você pode:',
          '- Abrir o painel de configuração (engrenagem) e salvar uma chave OpenRouter;',
          '- Ou usar este espaço como diário simbólico, clicando nos blocos para ouvir e reenviar.'
        ].join('\n');

        const cinematicBlocks = splitResponseCinematic(localMsg);
        appendBlocksFromData(cinematicBlocks);
        return;
      }

      const answer = await callOpenRouter(text);
      const cinematicBlocks = splitResponseCinematic(answer);
      appendBlocksFromData(cinematicBlocks);
    }catch(err){
      console.error(err);
      const errorBlocks = [{
        kind:'ending',
        html:'<p><strong>Ops.</strong> Não foi possível falar com o OpenRouter agora. Verifique sua chave e tente novamente.</p>'
      }];
      appendBlocksFromData(errorBlocks);
    }finally{
      if (userInput){
        userInput.disabled = false;
        userInput.focus();
      }
      if (sendBtn) sendBtn.disabled   = false;
      if (footerHint) footerHint.textContent = oldFooter || 'Do seu jeito. Sempre único. Sempre seu.';
    }
  }

  async function handleSendFromInput(){
    const text = userInput ? userInput.value.trim() : '';
    if (!text) return;
    await sendPrompt(text,{ fromBlock:false });
  }

  if (sendBtn) sendBtn.addEventListener('click', handleSendFromInput);
  if (userInput){
    userInput.addEventListener('keydown', ev=>{
      if (ev.key === 'Enter' && !ev.shiftKey){
        ev.preventDefault();
        handleSendFromInput();
      }
    });
  }

  if (copyBtn){
  copyBtn.addEventListener('click', async ()=>{

    const temp = responseList?.innerText || '';

    if (!temp) return;

    try{
      await navigator.clipboard.writeText(temp);

      if (footerHint){
        footerHint.textContent =
        'Tudo copiado.';
      }

    }catch{

      if (footerHint){
        footerHint.textContent =
        'Não consegui copiar.';
      }

    }

  });
}

  if (pasteBtn){
    pasteBtn.addEventListener('click', async ()=>{
      try{
        const txt = await navigator.clipboard.readText();
        if (txt && userInput) userInput.value = txt;
      }catch(e){}
    });
  }

  function initParticles(){
    if (!window.particlesJS){
      console.warn('particlesJS não encontrado.');
      return;
    }
    particlesJS('particles-js',{
      particles:{
        number:{ value:60, density:{ enable:true, value_area:800 } },
        color:{ value:['#00f5ff','#ff4bff','#ffffff'] },
        shape:{ type:'circle' },
        opacity:{ value:0.45, random:true },
        size:{ value:3, random:true },
        line_linked:{
          enable:true,
          distance:140,
          color:'#00f5ff',
          opacity:0.25,
          width:1
        },
        move:{
          enable:true,
          speed:1.2,
          direction:'none',
          random:false,
          straight:false,
          out_mode:'out',
          bounce:false
        }
      },
      interactivity:{
        detect_on:'canvas',
        events:{
          onhover:{ enable:true, mode:'grab' },
          onclick:{ enable:false, mode:'push' },
          resize:true
        },
        modes:{
          grab:{
            distance:160,
            line_linked:{ opacity:0.5 }
          }
        }
      },
      retina_detect:true
    });
  }

  function init(){
    if (initialized) return;
    initialized = true;

    restoreTheme();
    restoreNames();
    loadIaConfigFromStorage();
    loadVoiceConfigFromStorage();

    const archActive = localStorage.getItem('ARCHETYPE_ACTIVE');
    if (archActive){
      currentVoiceKey = archActive;
      localStorage.setItem(STORAGE.VOICE_CURRENT_KEY, currentVoiceKey);
    }
    updateVoiceOrbLabel();
    setCollapsed(true);
    initParticles();

    const RV_ARCHES = ['Atlas','Nova','Vitalis','Pulse','Artemis','Serena','Kaos','Genus','Lumine','Rhea','Solus','Aion'];
    const randomArch = RV_ARCHES[Math.floor(Math.random()*RV_ARCHES.length)];
    localStorage.setItem('ARCHETYPE_ACTIVE', randomArch);

    if (bootText){
      const msg =
`[${randomArch}]  â€”Onda-Viva 78K ativada.
åY€, quem abre o portal é ${randomArch}.
Iniciando. Pulso simbiótico detectado. Presença reconhecida.`;
      bootText.dataset.text = msg;
      bootText.textContent  = msg;
    }
    if (bootBlock){
      markBlockArchetype(bootBlock, randomArch);
    }
    if (typeof window.KOB_APPLY_VOICE_THEME === 'function'){
      window.KOB_APPLY_VOICE_THEME(randomArch.toLowerCase());
    }

    if (bootText) bootText.classList.add('pulse');
    if (bootBlock && synth){
      setTimeout(()=>{ try{ speakBlock(bootBlock); }catch(e){}; }, 700);
    }

    if (voiceBtn){
      voiceBtn.addEventListener('click', (ev)=>{
        const wantAll = ev.shiftKey === true;
        if (wantAll){
          speakRecentBlocks(Infinity);
          return;
        }
        speakRecentBlocks(SPEAK_COUNT);
      });
    }

    console.log('Dual Cinemático + Roda-Viva inicializado. Arquétipo inicial:', randomArch);
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
/*
(function() {
  function makeCollapsible(node) {
    if (!node || node.dataset.accordionInit) return;
    node.dataset.accordionInit = "true";
    const header = node.querySelector('.accordion-header');
    const body = node.querySelector('.collapsible-body');
    if (!header || !body) return;
    if (!header.querySelector('.indicator')) {
      const indicator = document.createElement('span');
      indicator.className = 'indicator';
      indicator.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
      header.appendChild(indicator);
    }
    if (!node.classList.contains('is-collapsed') && !node.classList.contains('is-open')) node.classList.add('is-open');
    if (node.classList.contains('is-collapsed')) body.style.height = '0px';
    header.addEventListener('click', (e) => {
      const targetTag = e.target.tagName.toLowerCase();
      if (['input', 'select', 'button', 'textarea'].includes(targetTag)) return;
      const isCollapsed = node.classList.contains('is-collapsed');
      if (isCollapsed) {
        node.classList.remove('is-collapsed');
        node.classList.add('is-open');
        body.style.height = body.scrollHeight + 'px';
        body.addEventListener('transitionend', function handler(ev) {
          if (ev.propertyName === 'height') {
            body.style.height = 'auto';
            body.removeEventListener('transitionend', handler);
          }
        });
      } else {
        body.style.height = body.scrollHeight + 'px';
        void body.offsetHeight;
        node.classList.remove('is-open');
        node.classList.add('is-collapsed');
        body.style.height = '0px';
      }
    });
  }

  window.KobAccordion = {
    open: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; if(card){ card.classList.remove('is-collapsed'); card.classList.add('is-open'); } },
    close: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; if(card){ card.classList.remove('is-open'); card.classList.add('is-collapsed'); } },
    toggle: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; card && card.querySelector('.accordion-header')?.click(); }
  };

  const observer = new MutationObserver((muts) => {
    muts.forEach((m) => {
      m.addedNodes && m.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches && node.matches('.accordion')) makeCollapsible(node);
        node.querySelectorAll && node.querySelectorAll('.accordion').forEach((el) => makeCollapsible(el));
      });
    });
  });

  if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  document.querySelectorAll('.accordion').forEach(makeCollapsible);

  const di_userNameRaw = localStorage.getItem("di_userName") || localStorage.getItem("infodoseUserName") || "";
  const userKey = di_userNameRaw.trim().toLowerCase();
  const displayUserName = di_userNameRaw.trim() || "User";

  let ARCHETYPES_BASE = [
    "atlas", "nova", "vitalis", "pulse", "kaos", "kodux", "lumine",
    "aion", "kobllux", "artemis", "serena", "genus", "solus",
    "rhea", "uno", "dual", "trinity", "infodose", "horus", "bllue"
  ];
  if (userKey && !ARCHETYPES_BASE.includes(userKey)) {
    ARCHETYPES_BASE.push(userKey);
  }
  const ARCHETYPES = [...ARCHETYPES_BASE];

  const ARCH_NAMES = {
    atlas: "Atlas", nova: "Nova", vitalis: "Vitalis", pulse: "Pulse", kaos: "Kaos",
    kodux: "Kodux", lumine: "Lumine", aion: "Aion", kobllux: "Kobllux", artemis: "Artemis",
    serena: "Serena", genus: "Genus", solus: "Solus", rhea: "Rhea", uno: "Uno",
    dual: "Dual", trinity: "Trinity", infodose: "Infodose", horus: "Horus", bllue: "Bllue"
  };
  if (userKey) ARCH_NAMES[userKey] = di_userNameRaw.trim();

  const userOption = document.getElementById("diUserOption");
  if (userOption) {
    userOption.value = userKey || "user";
    userOption.textContent = `${displayUserName} (Usuário/Núcleo)`;
  }

  let di_engineStep = parseInt(localStorage.getItem('kobllux_engine_step') || '0', 10);
  let di_reverse = localStorage.getItem('kobllux_reverse_mode') === 'true';
  let di_jump = parseInt(localStorage.getItem('kobllux_jump_step') || '0', 10);
  let di_use3697 = localStorage.getItem('kobllux_cycle_3697') === 'true';

  function saveEngineState() {
    localStorage.setItem('kobllux_engine_step', String(di_engineStep));
    localStorage.setItem('kobllux_reverse_mode', String(di_reverse));
    localStorage.setItem('kobllux_jump_step', String(di_jump));
    localStorage.setItem('kobllux_cycle_3697', String(di_use3697));
  }

  function syncEngineUI() {
    document.querySelectorAll('[data-engine]').forEach(btn => {
      const val = parseInt(btn.dataset.engine, 10);
      if (val === di_engineStep) btn.classList.add('is-active');
      else btn.classList.remove('is-active');
    });
    document.querySelectorAll('[data-jump]').forEach(btn => {
      const val = parseInt(btn.dataset.jump, 10);
      if (val === di_jump) btn.classList.add('is-active');
      else btn.classList.remove('is-active');
    });
    const reverseBtn = document.getElementById('reverseToggle');
    if (reverseBtn) {
      reverseBtn.textContent = `Reverse: ${di_reverse ? 'ON' : 'OFF'}`;
      reverseBtn.classList.toggle('is-active', di_reverse);
    }
    const cycleBtn = document.getElementById('cycle3697');
    if (cycleBtn) {
      cycleBtn.textContent = `3-6-9-7: ${di_use3697 ? 'ON' : 'OFF'}`;
      cycleBtn.classList.toggle('is-active', di_use3697);
    }
  }

  function di_getSequence(startIndex, length) {
    const total = ARCHETYPES.length;
    const sequence = [];
    let currentIndex = ((startIndex % total) + total) % total;
    const pattern = di_use3697 ? [3, 6, 9, 7] : [di_engineStep];
    for (let i = 0; i < length; i++) {
      sequence.push(ARCHETYPES[currentIndex]);
      let step = pattern[i % pattern.length];
      if (di_reverse) step *= -1;
      step += di_jump;
      currentIndex = (currentIndex + step) % total;
      if (currentIndex < 0) currentIndex += total;
    }
    return sequence;
  }

  function updateStatusWithEngine() {
    const statusBar = document.getElementById('statusBar');
    if (statusBar && !statusBar.textContent.includes('Opcode')) {
      statusBar.textContent = `Motor ${di_engineStep} · ${di_reverse ? 'Reverse' : 'Forward'} · salto +${di_jump} · ${di_use3697 ? '3-6-9-7' : 'Linear'}`;
    }
  }

  document.querySelectorAll('[data-engine]').forEach(btn => {
    btn.addEventListener('click', () => {
      di_engineStep = parseInt(btn.dataset.engine, 10);
      saveEngineState();
      syncEngineUI();
      updateStatusWithEngine();
      showToast(`Motor +${di_engineStep} ativado`);
    });
  });

  document.querySelectorAll('[data-jump]').forEach(btn => {
    btn.addEventListener('click', () => {
      di_jump = parseInt(btn.dataset.jump, 10);
      saveEngineState();
      syncEngineUI();
      updateStatusWithEngine();
      showToast(`Salto extra +${di_jump}`);
    });
  });

  const reverseBtnDom = document.getElementById('reverseToggle');
  if (reverseBtnDom) {
    reverseBtnDom.addEventListener('click', () => {
      di_reverse = !di_reverse;
      saveEngineState();
      syncEngineUI();
      updateStatusWithEngine();
      showToast(`Reverse ${di_reverse ? 'ATIVADO' : 'DESATIVADO'}`);
    });
  }

  const cycleBtnDom = document.getElementById('cycle3697');
  if (cycleBtnDom) {
    cycleBtnDom.addEventListener('click', () => {
      di_use3697 = !di_use3697;
      saveEngineState();
      syncEngineUI();
      updateStatusWithEngine();
      showToast(`Ciclo 3-6-9-7 ${di_use3697 ? 'ATIVADO' : 'DESATIVADO'}`);
    });
  }
  syncEngineUI();
  updateStatusWithEngine();

  const dom = {
    input: document.getElementById('inputText'),
    output: document.getElementById('outputContainer'),
    genBtn: document.getElementById('genBtn'),
    archSelect: document.getElementById('startArch'),
    cycleCheck: document.getElementById('cycleMode'),
    body: document.body,
    copyBtn: document.getElementById('copyBtn'),
    clearBtn: document.getElementById('clearBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    statusBar: document.getElementById('statusBar'),
    hudStatus: document.getElementById('hudStatus'),
    toastContainer: document.getElementById('toast-container'),
    mainCard: document.getElementById('mainHeroCard')
  };

  function showToast(message, isError = false) {
    if (!dom.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    if (!isError) {
      const currentColor = getComputedStyle(document.body).getPropertyValue('--kob-voice-primary').trim();
      if (currentColor) toast.style.background = currentColor;
    } else toast.style.background = "#c44";
    dom.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  if (dom.input) {
    const savedInput = localStorage.getItem('kobllux_draft_input');
    if (savedInput) dom.input.value = savedInput;
  }

  if (dom.archSelect) {
    dom.archSelect.addEventListener('change', (e) => {
      dom.body.setAttribute('data-arch', e.target.value);
    });
  }

  function generateFractals() {
    if (!dom.input || !dom.output || !dom.archSelect || !dom.cycleCheck) return;
    const text = dom.input.value.trim();
    if (!text) {
      showToast("Aviso: Texto de entrada vazio.", true);
      return;
    }
    localStorage.setItem('kobllux_draft_input', text);

    const sentencesMatch = text.replace(/\n+/g, ' ').match(/[^.!?]+[.!?]+|[^.!?]+$/g);
    const sentences = sentencesMatch ? sentencesMatch.map(s => s.trim()).filter(Boolean) : [];
    if (sentences.length === 0) return;

    const startArchName = dom.archSelect.value;
    const startIdx = ARCHETYPES.indexOf(startArchName);
    const isCycleMode = dom.cycleCheck.checked;

    const sequence = isCycleMode ? di_getSequence(startIdx, sentences.length) : [ARCHETYPES[startIdx]];

    dom.output.innerHTML = '';
    let resultTextForExport = "";

    sentences.forEach((sentence, i) => {
      const currentArchName = isCycleMode ? sequence[i] : ARCHETYPES[startIdx];

      const block = document.createElement('div');
      block.className = 'para-block accordion is-open';
      block.style.animationDelay = `${i * 0.1}s`;

      const dummyBody = document.createElement('body');
      dummyBody.setAttribute('data-arch', currentArchName);
      document.documentElement.appendChild(dummyBody);
      const archColor = getComputedStyle(dummyBody).getPropertyValue('--kob-voice-primary').trim();
      document.documentElement.removeChild(dummyBody);

      block.style.setProperty('--kob-voice-primary', archColor);
      block.style.setProperty('--kob-voice-bg-soft', `color-mix(in srgb, ${archColor} 12%, transparent)`);
      block.style.borderLeftColor = archColor;
      block.style.setProperty('--card-accent', archColor);

      const displayArchName = ARCH_NAMES[currentArchName] || currentArchName;

      block.innerHTML = `
        <div class="accordion-header">
          <div class="arch-tag" style="color: ${archColor}; border-color: color-mix(in srgb, ${archColor} 30%, rgba(255,255,255,0.1))">
            ${displayArchName} · Δ
          </div>
        </div>
        <div class="collapsible-body">
          <div class="content-inner">${escapeHtml(sentence)}</div>
        </div>
      `;
      dom.output.appendChild(block);
      resultTextForExport += `${displayArchName.toUpperCase()} — ${sentence}\n\n`;
    });

    localStorage.setItem('kobllux_last_result', resultTextForExport.trim());
    const total = sentences.length;
    if (dom.statusBar) dom.statusBar.textContent = `Opcode 0x0B · Motor 3·6·9 · ${total} Fractal(s) Gerado(s)`;
    if (dom.hudStatus) dom.hudStatus.textContent = `Δ-${total}`;

    if (dom.mainCard && dom.mainCard.classList.contains('is-open')) {
      dom.mainCard.querySelector('.accordion-header')?.click();
    }
    showToast(`Integração concluída | Motor: +${di_engineStep} | Reverse: ${di_reverse ? 'ON' : 'OFF'} | Salto: +${di_jump} | ${di_use3697 ? 'Ciclo 3697' : 'Linear'}`);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  if (dom.genBtn) dom.genBtn.addEventListener('click', generateFractals);
  if (dom.input) {
    dom.input.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generateFractals();
    });
  }

  if (dom.copyBtn) {
    dom.copyBtn.addEventListener('click', async () => {
      const content = localStorage.getItem('kobllux_last_result');
      if (!content) { showToast("Nenhum fractal para copiar.", true); return; }
      try {
        await navigator.clipboard.writeText(content);
        showToast("Fractais copiados para o Códex");
      } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = content;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast("Fractais copiados (fallback)");
      }
    });
  }

  if (dom.clearBtn) {
    dom.clearBtn.addEventListener('click', () => {
      if (dom.input) dom.input.value = '';
      if (dom.output) dom.output.innerHTML = '<div class="empty-state">Sistema reiniciado. Aguardando novos dados.</div>';
      localStorage.removeItem('kobllux_last_result');
      localStorage.removeItem('kobllux_draft_input');
      if (dom.statusBar) dom.statusBar.textContent = 'Sistema em repouso · Matrix Pronta';
      if (dom.hudStatus) dom.hudStatus.textContent = '78K-ID';
      if (dom.mainCard && dom.mainCard.classList.contains('is-collapsed')) dom.mainCard.querySelector('.accordion-header')?.click();
      showToast("Memória Limpa");
    });
  }

  if (dom.downloadBtn) {
    dom.downloadBtn.addEventListener('click', () => {
      const content = localStorage.getItem('kobllux_last_result');
      if (!content) { showToast("Nenhum fractal para transferir.", true); return; }
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KOBLLUX_Fractais_${new Date().toISOString().slice(0,10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Transferência Concluída");
    });
  }

  if (dom.archSelect) dom.body.setAttribute('data-arch', dom.archSelect.value);
})(); */
