(function () {
  'use strict';

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
    MODEL: 'nvidia/nemotron-3-nano-omni-30b-a3-b-reasoning:free',
    TEMP: 0.2,
    CHUNK_SIZE: 12000
  };

  const SPEAK_COUNT = 6;
  const PAUSE_BETWEEN_BLOCKS_MS = 369;
  const MAX_SPEECH_CHARS = 2500;
  const PAUSE_BETWEEN_SPEECH_CHUNKS_MS = 80;
  const HIGHLIGHT_CLASS = 'speaking';

  const synth = window.speechSynthesis || null;
  let currentUtterance = null;
  let availableVoices = [];
  let voiceConfig = null;
  let currentVoiceKey = 'default';
  let conversation = [];
  let isCollapsed = true;
  let initialized = false;
  const responseBlocks = [];
  let bootBlock = null;
  let __kdxAutoScrollEnabled = true;
  let __kdxScrollRaf = 0;

  const ARCHETYPE_KEYWORDS = {
    Atlas: ["atlas", "fluxo", "mapa", "estrutura", "organização", "organizar", "planejamento", "árvore", "checklist", "estratégia"],
    Nova: ["nova", "começar", "começo", "ideia", "idéia", "visão", "criar", "protótipo", "protótipos", "imaginar", "descobrir", "ativar", "estado"],
    Vitalis: ["vitalis", "corpo", "energia", "respiração", "ritmo", "h3o2", "saúde", "vitalidade", "hidratação", "movimento"],
    Pulse: ["pulse", "pulso", "tempo", "ciclo", "ciclos", "batida", "pulsar", "ritmo", "loop", "síncrono", "batimento"],
    Artemis: ["artemis", "foco", "focada", "mira", "precisão", "aventura", "explorar", "exploração", "alvo", "caçada"],
    Serena: ["serena", "serenidade", "calma", "acolhimento", "cuidar", "suave", "pausa", "repouso", "apoio", "paz", "tranquilo", "tranquilidade"],
    Kaos: ["kaos", "quebra", "ruptura", "caos", "provocação", "virada", "rebeldia", "desalinho", "disrupção", "choque"],
    Genus: ["genus", "padrão", "padrões", "tabela", "planilha", "referência", "documento", "estrutura lógica", "dados", "sistematizar"],
    Lumine: ["lumine", "luz", "cores", "estética", "beleza", "design", "gradiente", "iluminar", "alegria", "lúdico", "brincadeira", "brilho", "colorido"],
    Rhea: ["rhea", "guia", "cuidado", "conectar", "empatia", "acompanhamento", "profundo", "profundidade", "vínculo", "raízes", "intimidade"],
    Solus: ["solus", "unidade", "sozinho", "inteiro", "solo", "núcleo", "essência", "solidão", "silêncio", "meditação", "contemplar", "introspecção"],
    Aion: ["aion", "tempo longo", "ciclos grandes", "eras", "fractal", "registro", "eterno", "futuro", "linha do tempo", "cíclico", "infinito"],
    KOBLLUX: ["kobllux", "kob", "nó raiz", "núcleo do sistema", "portal", "oráculo", "meta-sistema"],
    Uno: ["uno", "origem", "fonte", "essência", "essencial", "mínimo", "minimalista", "centro"],
    Dual: ["dual", "espelho", "contraste", "polaridade", "dois lados", "reverso", "espelhado"],
    Trinity: ["trinity", "trindade", "tríade", "3·6·9", "3x", "síntese", "triângulo", "triádico"],
    Infodose: ["infodose", "dose", "arquétipo", "arquétipos", "ativação", "dopamina", "pílula"],
    Kodux: ["kodux", "criador", "metaconsciência", "pulso criador", "manifesto", "metafuturo"],
    Bllue: ["bllue", "blue", "emoção", "emocional", "sensível", "sensação", "sensório", "intuitivo"],
    Minuz: ["minuz", "minimalista", "hacker", "hackear", "direto ao ponto", "compressão", "refatorar"],
    HANAH: ["hanah", "hannah", "estético", "estética", "futurista", "visual", "simbolismo", "símbolos"],
    MetaLux: ["metalux", "meta lux", "lux", "oráculo", "luxar", "portal lux", "estético-simbólico"]
  };

  const $ = sel => document.querySelector(sel);
  const el = id => document.getElementById(id);

  const responseContainer = el('response');
  const responseList = el('responseList');
  bootBlock = el('bootBlock');
  const bootText = el('bootText');
  const footerHint = el('footerHint');
  const copyBtn = el('copyBtn');
  const pasteBtn = el('pasteBtn');
  const parserBtn = el('parserBtn');
  const parserFile = el('parserFile');
  const voiceConfigBtn = el('voiceConfigBtn');
  const voiceConfigFile = el('voiceConfigFile');
  const toggleLoginBtn = el('toggleLoginBtn');
  const loginBox = el('loginBox');
  const loginForm = el('loginForm');
  const userNameInput = el('userName');
  const assistantInput = el('assistantInput');
  const assistantNameEl = el('assistantName');
  const userInput = el('userInput');
  const sendBtn = el('sendBtn');
  const themeToggleBtn = el('themeToggle');
  const voiceBtn = el('voiceBtn');
  const iaConfigPanel = el('iaConfigPanel');
  const apiKeyInput = el('apiKeyInput');
  const modelSelect = el('modelSelect');
  const customModelInput = el('customModelInput');
  const saveIaConfigBtn = el('saveIaConfigBtn');
  const clearIaConfigBtn = el('clearIaConfigBtn');
  const iaStatus = el('iaStatus');
  const themeSelect = el('themeSelect');
  const settingsBtn = el('toggleSettingsBtn');

  const CONFIG = {
    API_URL: DEFAULTS.API_URL,
    MODEL: DEFAULTS.MODEL,
    TEMP: DEFAULTS.TEMP,
    CHUNK_SIZE: DEFAULTS.CHUNK_SIZE,
    AUTH_TOKEN: ''
  };

  if (synth) {
    const loadVoices = () => {
      try {
        availableVoices = synth.getVoices() || [];
      } catch (e) {
        availableVoices = [];
      }
    };
    loadVoices();
    synth.onvoiceschanged = loadVoices;
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  function getScrollHost() {
    if (responseList && responseList.scrollHeight > responseList.clientHeight) return responseList;
    if (responseContainer && responseContainer.scrollHeight > responseContainer.clientHeight) return responseContainer;
    return document.scrollingElement || document.documentElement;
  }

  function isNearBottom(elm, threshold = 180) {
    if (!elm) return true;
    const remaining = elm.scrollHeight - elm.scrollTop - elm.clientHeight;
    return remaining < threshold;
  }

  function updateAutoScrollState() {
    const host = getScrollHost();
    if (!host) return;
    __kdxAutoScrollEnabled = isNearBottom(host, 220);
  }

  function scrollToBottomSmooth(force = false) {
    const host = getScrollHost();
    if (!host) return;
    if (!force && !__kdxAutoScrollEnabled) return;

    if (__kdxScrollRaf) cancelAnimationFrame(__kdxScrollRaf);
    __kdxScrollRaf = requestAnimationFrame(() => {
      try {
        if (host === document.documentElement || host === document.body || host === document.scrollingElement) {
          window.scrollTo({
            top: document.documentElement.scrollHeight || document.body.scrollHeight,
            behavior: 'smooth'
          });
        } else {
          host.scrollTo({
            top: host.scrollHeight,
            behavior: 'smooth'
          });
        }
      } catch (e) {}
    });
  }

  function scrollBlockIntoView(block) {
    if (!block || !__kdxAutoScrollEnabled) return;
    try {
      block.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      });
    } catch (e) {}
  }

  (function setupKdxAutoScrollListeners() {
    const host = getScrollHost();
    if (host) {
      host.addEventListener('scroll', updateAutoScrollState, { passive: true });
    }
    window.addEventListener('wheel', updateAutoScrollState, { passive: true });
    window.addEventListener('touchmove', updateAutoScrollState, { passive: true });
    window.addEventListener('resize', () => scrollToBottomSmooth(false), { passive: true });
    updateAutoScrollState();
  })();

  function loadIaConfigFromStorage() {
    const key = localStorage.getItem(STORAGE.OPENROUTER_KEY) || '';
    const model = localStorage.getItem(STORAGE.OPENROUTER_MODEL) || DEFAULTS.MODEL;

    CONFIG.API_URL = DEFAULTS.API_URL;
    CONFIG.MODEL = model || DEFAULTS.MODEL;
    CONFIG.TEMP = DEFAULTS.TEMP;
    CONFIG.CHUNK_SIZE = DEFAULTS.CHUNK_SIZE;
    CONFIG.AUTH_TOKEN = key ? 'Bearer ' + key : '';

    if (apiKeyInput) apiKeyInput.value = key;

    let optionFound = false;
    if (modelSelect) {
      Array.from(modelSelect.options).forEach(opt => {
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

  function saveIaConfig() {
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

  function clearIaConfig() {
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

  function saveConversationNow() {
    try {
      const snap = {
        ts: new Date().toISOString(),
        conversation: conversation.slice(0, 100)
      };
      const key = 'KDX_CONV_' + snap.ts;
      localStorage.setItem(key, JSON.stringify(snap));
      const idx = JSON.parse(localStorage.getItem('KDX_CONV_INDEX') || '[]');
      idx.unshift(key);
      localStorage.setItem('KDX_CONV_INDEX', JSON.stringify(idx.slice(0, 50)));
      if (footerHint) footerHint.textContent = 'Conversa salva.';
      renderHistoryItems();
      return true;
    } catch (e) {
      console.error(e);
      if (footerHint) footerHint.textContent = 'Erro ao salvar conversa.';
      return false;
    }
  }

  function renderHistoryItems() {
    const container = el('kdxHistoryItems');
    if (!container) return;

    container.innerHTML = '';
    const idx = JSON.parse(localStorage.getItem('KDX_CONV_INDEX') || '[]');

    if (idx.length === 0) {
      container.innerHTML = '<div class="lv-callout lv-aside">Nenhuma conversa salva ainda.</div>';
      return;
    }

    idx.forEach(k => {
      try {
        const snap = JSON.parse(localStorage.getItem(k));
        const card = document.createElement('div');
        card.className = 'md-tabelista';
        card.innerHTML = `
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;">
            <div>
              <strong>${escapeHtml(snap.ts)}</strong>
              <div style="opacity:.85;font-size:.82rem">${snap.conversation.length} itens</div>
            </div>
            <div style="display:flex;gap:6px">
              <button class="lv-btn" data-load="${escapeHtml(k)}">Carregar</button>
              <button class="lv-btn secondary" data-delete="${escapeHtml(k)}">Excluir</button>
            </div>
          </div>
        `;
        container.appendChild(card);
      } catch (e) {}
    });

    container.querySelectorAll('[data-load]').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        const key = ev.currentTarget.dataset.load;
        const snap = JSON.parse(localStorage.getItem(key) || 'null');
        if (!snap) return;

        conversation = Array.isArray(snap.conversation) ? snap.conversation.slice() : [];
        responseBlocks.length = 0;
        if (responseList) responseList.innerHTML = '';

        conversation.forEach(item => {
          const d = document.createElement('div');
          d.className = 'response-block middle';
          d.innerHTML = `<div><strong>${escapeHtml(item.role || 'message')}</strong><div style="opacity:.85;margin-top:6px">${escapeHtml(item.content || '')}</div></div>`;
          enhanceBlock(d);
          responseList.appendChild(d);
        });

        if (footerHint) footerHint.textContent = 'Conversa carregada do histórico.';
      });
    });

    container.querySelectorAll('[data-delete]').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        const key = ev.currentTarget.dataset.delete;
        localStorage.removeItem(key);
        const nextIdx = JSON.parse(localStorage.getItem('KDX_CONV_INDEX') || '[]').filter(k => k !== key);
        localStorage.setItem('KDX_CONV_INDEX', JSON.stringify(nextIdx));
        renderHistoryItems();
      });
    });
  }

  function maybeAutoSave() {
    if (localStorage.getItem('KDX_AUTOSAVE') === '1') {
      clearTimeout(window.__kdx_auto_save_t_);
      window.__kdx_auto_save_t_ = setTimeout(() => {
        saveConversationNow();
      }, 1200);
    }
  }

  function pushConversation(item) {
    conversation.push(item);
    maybeAutoSave();
  }

  function applyTheme(theme) {
    document.body.dataset.theme = theme;
    localStorage.setItem(STORAGE.THEME, theme);
    if (themeSelect) themeSelect.value = theme;
  }

  function restoreTheme() {
    const theme = localStorage.getItem(STORAGE.THEME) || 'dark';
    applyTheme(theme);
  }

  function restoreNames() {
    const user = localStorage.getItem(STORAGE.USER_NAME) || '';
    const asst = localStorage.getItem(STORAGE.ASSISTANT_NAME) || 'Dual.Infodose · Cinemático';
    if (userNameInput && user) userNameInput.value = user;
    if (assistantInput && asst) assistantInput.value = asst;
    if (assistantNameEl) assistantNameEl.textContent = asst;
  }

  const settingsPanelId = 'kdxSettingsPanel';

  function ensureSettingsPanel() {
    if (el(settingsPanelId)) return;

    const panel = document.createElement('aside');
    panel.id = settingsPanelId;
    panel.className = 'kdx-settings-panel';
    panel.innerHTML = `
      <header class="kdx-sp-header">
        <strong>Configurações · Dual.Infodose</strong>
        <button id="kdxSpClose" aria-label="Fechar">✕</button>
      </header>
      <div class="kdx-sp-body">
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

    const closeBtn = el('kdxSpClose');
    const kdxThemeSelect = el('kdxThemeSelect');
    const voiceSel = el('kdxVoiceSelect');

    if (closeBtn) closeBtn.addEventListener('click', () => panel.classList.remove('active'));

    if (kdxThemeSelect) {
      kdxThemeSelect.addEventListener('change', (e) => {
        applyTheme(e.target.value === 'medium' ? 'medium' : e.target.value);
        localStorage.setItem(STORAGE.THEME, e.target.value);
      });
    }

    document.querySelectorAll('.kdx-style-btn').forEach(btn => {
      btn.addEventListener('click', (ev) => {
        const style = ev.currentTarget.dataset.style;
        document.body.dataset.pageStyle = style;
        localStorage.setItem('PAGE_STYLE', style);

        if (style === 'minimal') {
          document.documentElement.style.setProperty('--kob-voice-theme-duration', '250ms');
          document.documentElement.style.setProperty('--shadow-soft', '0 6px 12px rgba(0,0,0,.45)');
          document.body.classList.add('minimal-style');
          document.body.classList.remove('turbo-style');
        } else if (style === '78k') {
          document.body.classList.add('turbo-style');
          document.body.classList.remove('minimal-style');
        } else {
          document.body.classList.remove('minimal-style', 'turbo-style');
        }
      });
    });

    const archKeys = Object.keys(window.KOBLLUX_VOICES || {}).sort();
    if (voiceSel) {
      voiceSel.innerHTML = '<option value="">Automático (por arquétipo)</option>' + archKeys.map(k => `<option value="${escapeHtml(k)}">${escapeHtml(k)}</option>`).join('');
    }

    const voiceApply = el('kdxVoiceApply');
    if (voiceApply && voiceSel) {
      voiceApply.addEventListener('click', () => {
        const v = voiceSel.value;
        if (v) {
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
    }

    const openHistory = el('kdxOpenHistory');
    if (openHistory) {
      openHistory.addEventListener('click', () => {
        const hsec = el('kdxHistoryList');
        if (!hsec) return;
        hsec.style.display = hsec.style.display === 'none' ? 'block' : 'none';
        renderHistoryItems();
      });
    }

    const saveConv = el('kdxSaveConv');
    if (saveConv) saveConv.addEventListener('click', saveConversationNow);

    const auto = localStorage.getItem('KDX_AUTOSAVE') === '1';
    const autoSave = el('kdxAutoSave');
    if (autoSave) {
      autoSave.checked = auto;
      autoSave.addEventListener('change', (e) => {
        localStorage.setItem('KDX_AUTOSAVE', e.target.checked ? '1' : '0');
      });
    }
  }

  function openSettingsPanel() {
    ensureSettingsPanel();
    const panel = el(settingsPanelId);
    if (!panel) return;
    panel.classList.add('active');

    const sel = el('kdxThemeSelect');
    if (sel) sel.value = localStorage.getItem(STORAGE.THEME) || 'dark';

    const style = localStorage.getItem('PAGE_STYLE') || 'default';
    document.body.dataset.pageStyle = style;
  }

  function loadVoiceConfigFromStorage() {
    try {
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
    } catch (e) {
      console.warn('Erro ao carregar config de voz:', e);
      voiceConfig = null;
    }
  }

  function updateVoiceOrbLabel() {
    if (!voiceConfigBtn) return;
    const label = currentVoiceKey || 'voz';
    voiceConfigBtn.title = voiceConfig
      ? 'Voz atual: ' + label + ' (clique para alternar)'
      : 'Carregar / alternar vozes de arquétipos';
  }

  function loadCurrentVoiceProfile() {
    let profile = null;
    if (voiceConfig) {
      if (currentVoiceKey && voiceConfig[currentVoiceKey]) {
        profile = voiceConfig[currentVoiceKey];
      } else if (voiceConfig.default) {
        profile = voiceConfig.default;
      }
    }
    return profile;
  }

  function resolveVoice(profile, lang) {
    if (!availableVoices || !availableVoices.length) return null;
    if (profile && profile.voiceHint) {
      const hint = String(profile.voiceHint).toLowerCase();
      let chosen = availableVoices.find(v => String(v.name || '').toLowerCase().includes(hint));
      if (!chosen) chosen = availableVoices.find(v => v.lang === lang) || null;
      return chosen;
    }
    return availableVoices.find(v => v.lang === lang) || null;
  }

  function detectArchetypeFromText(text) {
    if (!text) return null;
    const t = String(text).toLowerCase();
    let best = null;
    let bestScore = 0;

    Object.entries(ARCHETYPE_KEYWORDS).forEach(([name, words]) => {
      let score = 0;
      if (t.includes(name.toLowerCase())) score += 10;
      words.forEach(w => {
        if (t.includes(String(w).toLowerCase())) score++;
      });
      if (score > bestScore) {
        bestScore = score;
        best = name;
      }
    });

    return bestScore > 0 ? best : null;
  }

  function markBlockArchetype(div, archeName) {
    if (!div || !archeName) return;
    div.dataset.archetype = archeName;
    let badge = div.querySelector('.archetype-badge');
    if (!badge) {
      badge = document.createElement('span');
      badge.className = 'archetype-badge';
      div.appendChild(badge);
    }
    badge.textContent = archeName;
  }

  function buildTabelistaHtml(rawBlock) {
    const lines = String(rawBlock).trim().split('\n').filter(l => l.trim().startsWith('|'));
    if (lines.length < 3) {
      return '<pre>' + escapeHtml(rawBlock).replace(/\n/g, '<br/>') + '</pre>';
    }

    function cells(line) {
      return line.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
    }

    const headerCells = cells(lines[0]);
    const headerText = headerCells.join(' | ');
    const secondCells = cells(lines[1]);
    const isSeparator = secondCells.every(c => /^:?-+:?$/.test(c));
    const subText = isSeparator ? '' : secondCells.join(' | ');
    const dataLines = lines.slice(isSeparator ? 2 : 1);

    let html = '<div class="md-tabelista">';
    html += '<div class="tbl-head">' + escapeHtml(headerText) + '</div>';
    if (subText) html += '<div class="tbl-sub">' + escapeHtml(subText) + '</div>';
    html += '<ul>';

    dataLines.forEach(line => {
      const cols = cells(line);
      if (!cols.length) return;
      const col1 = escapeHtml(cols[0]);
      const rest = cols.slice(1).map((c, idx) => {
        const cls = 'tbl-col' + (idx + 2);
        if (idx === 0) return '<span class="' + cls + '">(' + escapeHtml(c) + ')</span>';
        return '<span class="' + cls + '">' + escapeHtml(c) + '</span>';
      }).join(' | ');
      html += '<li><span class="tbl-col1">' + col1 + '</span>';
      if (rest) html += ' | ' + rest;
      html += '</li>';
    });

    html += '</ul></div>';
    return html;
  }

  function parseMarkdownBasic(rawText) {
    if (!rawText) return '';

    if (typeof window.customMarkdownParser === 'function') {
      try {
        const html = window.customMarkdownParser(rawText);
        if (typeof html === 'string') return html;
      } catch (e) {
        console.warn('customMarkdownParser falhou, usando parser interno.', e);
      }
    }

    let text = String(rawText);
    const tableMap = {};
    let tableIndex = 0;

    text = text.replace(/((?:^\|.*\n?){3,})/gm, (match) => {
      const id = '@@TABLE_' + (tableIndex++) + '@@';
      tableMap[id] = buildTabelistaHtml(match);
      return id;
    });

    text = escapeHtml(text).replace(/\r\n/g, '\n');

    text = text.replace(/\[\[btn:([^\]|]+)(?:\|([^\]]+))?\]\]/g, function (_m, action, label) {
      const act = escapeHtml(action.trim());
      const lab = escapeHtml((label && label.trim()) || action.trim());
      return '<button class="lv-btn" data-action="' + act + '">' + lab + '</button>';
    });

    text = text.replace(/^::(info|warn|success|question|aside)\s+(.*)$/gm, '<div class="lv-callout lv-$1">$2</div>');
    text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

    text = text.replace(/```([\s\S]*?)```/g, function (_m, code) {
      return '<pre><code>' + code.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>';
    });

    text = text.replace(/^### (.*)$/gim, '<h3>$1</h3>');
    text = text.replace(/^## (.*)$/gim, '<h2>$1</h2>');
    text = text.replace(/^# (.*)$/gim, '<h1>$1</h1>');
    text = text.replace(/^> (.*)$/gim, '<blockquote>$1</blockquote>');
    text = text.replace(/^\s*[-*+] (.*)$/gim, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>');

    Object.keys(tableMap).forEach(id => {
      text = text.replace(id, tableMap[id]);
    });

    return text;
  }

  function splitSpeechText(text, maxLen = MAX_SPEECH_CHARS) {
    const clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return [];
    if (clean.length <= maxLen) return [clean];

    const chunks = [];
    let remaining = clean;

    while (remaining.length > maxLen) {
      let cut = Math.max(
        remaining.lastIndexOf('. ', maxLen),
        remaining.lastIndexOf('! ', maxLen),
        remaining.lastIndexOf('? ', maxLen),
        remaining.lastIndexOf(', ', maxLen),
        remaining.lastIndexOf('; ', maxLen),
        remaining.lastIndexOf(': ', maxLen),
        remaining.lastIndexOf(' ', maxLen)
      );

      if (cut < 200) cut = maxLen;
      chunks.push(remaining.slice(0, cut + 1).trim());
      remaining = remaining.slice(cut + 1).trim();
    }

    if (remaining) chunks.push(remaining);
    return chunks;
  }

  function splitResponseCinematic(text) {
    const parts = String(text || '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean);

    if (!parts.length) {
      return [{
        kind: 'middle',
        html: '<p>' + parseMarkdownBasic(text).replace(/\n/g, '<br/>') + '</p>'
      }];
    }

    return parts.map((p, idx) => {
      const kind = idx === 0 ? 'intro' : (idx === parts.length - 1 ? 'ending' : 'middle');
      const html = '<p>' + parseMarkdownBasic(p).replace(/\n/g, '<br/>') + '</p>';
      return { kind, html };
    });
  }

  function getBlockText(block) {
    if (!block) return '';
    const raw = block.innerHTML
      .replace(/<button[^>]*class="block-tts-btn"[^>]*>[\s\S]*?<\/button>/gi, '')
      .replace(/<span[^>]*class="archetype-badge"[^>]*>[\s\S]*?<\/span>/gi, '')
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/p>/gi, '\n\n')
      .replace(/<\/h[1-6]>/gi, '\n')
      .replace(/<li>/gi, '- ')
      .replace(/<\/li>/gi, '\n')
      .replace(/<[^>]+>/g, '');
    return raw.trim();
  }

  function resolveVoiceProfile() {
    return loadCurrentVoiceProfile();
  }

  function speakChunkText(chunk, profile) {
    return new Promise((resolve) => {
      if (!chunk) return resolve();
      if (!synth) return resolve();

      const lang = profile && profile.lang ? profile.lang : 'pt-BR';
      const rate = (profile && typeof profile.rate === 'number') ? profile.rate : 1;
      const pitch = (profile && typeof profile.pitch === 'number') ? profile.pitch : 1;
      const vol = (profile && typeof profile.volume === 'number') ? profile.volume : 1;

      const utter = new SpeechSynthesisUtterance(chunk);
      utter.lang = lang;
      utter.rate = rate;
      utter.pitch = pitch;
      utter.volume = vol;
      utter.voice = resolveVoice(profile, lang) || null;

      currentUtterance = utter;

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };

      utter.onstart = () => {
        if (voiceBtn) voiceBtn.classList.add('speaking');
        if (footerHint) footerHint.textContent = 'Lendo o bloco em voz alta.';
      };

      utter.onend = finish;
      utter.onerror = finish;

      synth.speak(utter);

      const safety = Math.min(Math.max(chunk.length * 55, 1200), 20000);
      setTimeout(finish, safety);
    });
  }

  async function speakTextSequential(text, profile) {
    const chunks = splitSpeechText(text, MAX_SPEECH_CHARS);
    if (!chunks.length) return;

    for (let i = 0; i < chunks.length; i++) {
      await speakChunkText(chunks[i], profile);
      if (i < chunks.length - 1) {
        await sleep(PAUSE_BETWEEN_SPEECH_CHUNKS_MS);
      }
    }
  }

  async function speakBlock(block) {
    if (!synth) {
      if (footerHint) footerHint.textContent = 'Seu navegador não suporta voz (SpeechSynthesis).';
      return;
    }
    if (!block) {
      if (footerHint) footerHint.textContent = 'Nenhum bloco selecionado.';
      return;
    }

    const text = getBlockText(block);
    if (!text) {
      if (footerHint) footerHint.textContent = 'Nada para ler nesse bloco.';
      return;
    }

    const detectedArch = detectArchetypeFromText(text);
    if (detectedArch) {
      currentVoiceKey = detectedArch;
      localStorage.setItem('ARCHETYPE_ACTIVE', detectedArch);
      localStorage.setItem(STORAGE.VOICE_CURRENT_KEY, currentVoiceKey);
      markBlockArchetype(block, detectedArch);
      updateVoiceOrbLabel();
    }

    if (synth.speaking) {
      synth.cancel();
      if (voiceBtn) voiceBtn.classList.remove('speaking');
    }

    const profile = resolveVoiceProfile();

    try {
      scrollBlockIntoView(block);
      block.dataset.state = 'spoken';
      block.classList.add(HIGHLIGHT_CLASS);
      await speakTextSequential(text, profile);
    } catch (e) {
      console.warn('Erro ao falar bloco:', e);
      if (footerHint) footerHint.textContent = 'Erro ao tentar falar.';
    } finally {
      block.classList.remove(HIGHLIGHT_CLASS);
      updateAutoScrollState();
      if (voiceBtn) voiceBtn.classList.remove('speaking');
      if (footerHint) footerHint.textContent = 'Leitura concluída.';
    }
  }

  function speakBlockPromise(block) {
    return speakBlock(block);
  }

  async function speakRecentBlocks(count = SPEAK_COUNT, opts = {}) {
    if (!responseBlocks || !responseBlocks.length) return;

    let blocks;
    if (!isFinite(count)) {
      blocks = Array.from(responseBlocks);
    } else {
      const start = Math.max(0, responseBlocks.length - count);
      blocks = responseBlocks.slice(start);
    }

    blocks = blocks.filter(b => b && b.parentNode);

    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      if (b) b.dataset.state = 'spoken';
      await speakBlockPromise(b);
      if (opts.pauseBetween) {
        await sleep(opts.pauseBetween);
      } else {
        await sleep(PAUSE_BETWEEN_BLOCKS_MS);
      }
    }
  }

  function speakLastBlock() {
    speakRecentBlocks(1);
  }

  function onBlockClick(ev) {
    const block = ev.currentTarget;
    block.classList.add('clicked');
    setTimeout(() => block.classList.remove('clicked'), 350);

    const state = block.dataset.state || 'idle';
    if (state === 'idle' || state === 'sent') {
      block.dataset.state = 'spoken';
      speakBlock(block);
    } else if (state === 'spoken') {
      block.dataset.state = 'sent';
      const text = getBlockText(block);
      if (text) sendPrompt(text, { fromBlock: true });
    }
  }

  function addTtsButtonToBlock(div) {
    if (!div || div.querySelector('.block-tts-btn')) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'block-tts-btn';
    btn.textContent = '◎';
    btn.addEventListener('click', (ev) => {
      ev.stopPropagation();
      speakBlock(div);
    });

    div.appendChild(btn);
  }

  function enhanceBlock(div) {
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

  function appendBlocksFromData(blocks) {
    if (!blocks || !blocks.length) return;

    if (bootBlock) {
      bootBlock.remove();
      bootBlock = null;
    }

    blocks.forEach(page => {
      const div = document.createElement('div');
      div.className = 'response-block ' + (page.kind || 'middle');
      div.innerHTML = page.html;
      enhanceBlock(div);
      responseList.appendChild(div);
    });

    requestAnimationFrame(() => {
      scrollToBottomSmooth(true);
      speakRecentBlocks(SPEAK_COUNT);
    });
  }

  function appendUserPulseBlock(text) {
    if (!text) return;

    if (bootBlock) {
      bootBlock.remove();
      bootBlock = null;
    }

    const div = document.createElement('div');
    div.className = 'response-block user-pulse';
    div.innerHTML = '<p>' + parseMarkdownBasic(text).replace(/\n/g, '<br/>') + '</p>';
    enhanceBlock(div);
    responseList.appendChild(div);

    requestAnimationFrame(() => {
      scrollToBottomSmooth(true);
    });
  }

  function buildSystemPrompt() {
    const userName = localStorage.getItem(STORAGE.USER_NAME) || 'humano';
    const asstName = localStorage.getItem(STORAGE.ASSISTANT_NAME) || 'Dual.Infodose';

    return [
      `${asstName} é o assistente Cinemático da Infodose, especializado em respostas em blocos.`,
      '1. Responda em português por padrão.',
      '2. Use blocos curtos, com títulos, listas e callouts (::info, ::warn, ::success, ::question, ::aside) quando fizer sentido.',
      '3. Cada parágrafo separado por linha vazia vira um bloco independente.',
      '4. Priorize explicações práticas, exemplos e micro-ações de 1%.',
      '5. Quando fizer sentido, use Tabelista (linhas com "- |") para estruturar comparações.',
      '6. Não peça chave de API; assuma que a infraestrutura já está pronta do lado do usuário.',
      `7. O usuário se chama ${userName}; fale com ele pelo nome algumas vezes, mas sem exagero.`
    ].join('\n');
  }

  async function callOpenRouter(promptText) {
    if (!CONFIG.AUTH_TOKEN) {
      throw new Error('Defina a chave OpenRouter no painel de Config IA.');
    }

    const userName = localStorage.getItem(STORAGE.USER_NAME) || 'Você';
    const sysPrompt = buildSystemPrompt();

    const messages = [
      { role: 'system', content: sysPrompt },
      ...conversation,
      { role: 'user', content: `${userName} diz: ${promptText}` }
    ];

    const body = {
      model: CONFIG.MODEL,
      temperature: CONFIG.TEMP,
      messages,
      max_tokens: 1200
    };

    const res = await fetch(CONFIG.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': CONFIG.AUTH_TOKEN,
        'HTTP-Referer': 'https://infodose.com.br',
        'X-Title': 'Dual-Infodose Chat Cinemático'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      console.error('Erro IA:', txt);
      throw new Error('Falha na resposta da IA: ' + res.status);
    }

    const data = await res.json();
    const choice = data.choices && data.choices[0];
    const content = choice?.message?.content || '(sem conteúdo retornado)';

    conversation.push({ role: 'user', content: promptText });
    conversation.push({ role: 'assistant', content });

    maybeAutoSave();
    return content;
  }

  async function sendPrompt(promptText, options) {
    const opts = options || {};
    const fromBlock = !!opts.fromBlock;
    const text = (promptText || '').trim();
    if (!text) return;

    setCollapsed(false);
    if (!fromBlock && userInput) userInput.value = '';
    if (userInput) userInput.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    const oldFooter = footerHint ? footerHint.textContent : '';
    if (footerHint) {
      footerHint.textContent = fromBlock
        ? 'Pulso em expansão a partir do bloco.'
        : 'Processando pulso.';
    }

    if (synth && synth.speaking) {
      synth.cancel();
      if (voiceBtn) voiceBtn.classList.remove('speaking');
    }

    appendUserPulseBlock(text);

    try {
      if (!CONFIG.AUTH_TOKEN) {
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
    } catch (err) {
      console.error(err);
      const errorBlocks = [{
        kind: 'ending',
        html: '<p><strong>Ops.</strong> Não foi possível falar com o OpenRouter agora. Verifique sua chave e tente novamente.</p>'
      }];
      appendBlocksFromData(errorBlocks);
    } finally {
      if (userInput) {
        userInput.disabled = false;
        userInput.focus();
      }
      if (sendBtn) sendBtn.disabled = false;
      if (footerHint) footerHint.textContent = oldFooter || 'Do seu jeito. Sempre único. Sempre seu.';
    }
  }

  async function handleSendFromInput() {
    const text = userInput ? userInput.value.trim() : '';
    if (!text) return;
    await sendPrompt(text, { fromBlock: false });
  }

  function updateVoiceOrbLabel() {
    if (!voiceConfigBtn) return;
    const label = currentVoiceKey || 'voz';
    voiceConfigBtn.title = voiceConfig
      ? 'Voz atual: ' + label + ' (clique para alternar)'
      : 'Carregar / alternar vozes de arquétipos';
  }

  function initParticles() {
    if (!window.particlesJS) {
      console.warn('particlesJS não encontrado.');
      return;
    }

    particlesJS('particles-js', {
      particles: {
        number: { value: 60, density: { enable: true, value_area: 800 } },
        color: { value: ['#00f5ff', '#ff4bff', '#ffffff'] },
        shape: { type: 'circle' },
        opacity: { value: 0.45, random: true },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 140,
          color: '#00f5ff',
          opacity: 0.25,
          width: 1
        },
        move: {
          enable: true,
          speed: 1.2,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: false, mode: 'push' },
          resize: true
        },
        modes: {
          grab: {
            distance: 160,
            line_linked: { opacity: 0.5 }
          }
        }
      },
      retina_detect: true
    });
  }

  function init() {
    if (initialized) return;
    initialized = true;

    restoreTheme();
    restoreNames();
    loadIaConfigFromStorage();
    loadVoiceConfigFromStorage();

    const archActive = localStorage.getItem('ARCHETYPE_ACTIVE');
    if (archActive) {
      currentVoiceKey = archActive;
      localStorage.setItem(STORAGE.VOICE_CURRENT_KEY, currentVoiceKey);
    }
    updateVoiceOrbLabel();

    setCollapsed(true);
    initParticles();

    const RV_ARCHES = ['Atlas', 'Nova', 'Vitalis', 'Pulse', 'Artemis', 'Serena', 'Kaos', 'Genus', 'Lumine', 'Rhea', 'Solus', 'Aion'];
    const randomArch = RV_ARCHES[Math.floor(Math.random() * RV_ARCHES.length)];
    localStorage.setItem('ARCHETYPE_ACTIVE', randomArch);

    if (bootText) {
      const msg = `[${randomArch}] Roda-Viva aleatória ativada.
Hoje quem abre o portal é ${randomArch}.
Iniciando. Pulso simbiótico detectado. Presença reconhecida.`;
      bootText.dataset.text = msg;
      bootText.textContent = msg;
    }

    if (bootBlock) {
      markBlockArchetype(bootBlock, randomArch);
    }

    if (typeof window.KOB_APPLY_VOICE_THEME === 'function') {
      window.KOB_APPLY_VOICE_THEME(randomArch.toLowerCase());
    }

    if (bootText) bootText.classList.add('pulse');
    if (bootBlock && synth) {
      setTimeout(() => {
        try { speakBlock(bootBlock); } catch (e) {}
      }, 700);
    }

    console.log('Dual Cinemático + Roda-Viva inicializado. Arquétipo inicial:', randomArch);
  }

  if (saveIaConfigBtn) saveIaConfigBtn.addEventListener('click', saveIaConfig);
  if (clearIaConfigBtn) clearIaConfigBtn.addEventListener('click', clearIaConfig);

  if (themeSelect) {
    themeSelect.addEventListener('change', () => {
      applyTheme(themeSelect.value || 'dark');
    });
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      openSettingsPanel();
    });
  }

  if (toggleLoginBtn) {
    toggleLoginBtn.addEventListener('click', () => {
      loginBox.classList.toggle('active');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const user = userNameInput ? (userNameInput.value.trim() || 'Você') : 'Você';
      const asst = assistantInput ? (assistantInput.value.trim() || 'Dual.Infodose') : 'Dual.Infodose';
      localStorage.setItem(STORAGE.USER_NAME, user);
      localStorage.setItem(STORAGE.ASSISTANT_NAME, asst);
      if (assistantNameEl) assistantNameEl.textContent = asst;
      if (loginBox) loginBox.classList.remove('active');

      pushConversation({
        role: 'system',
        content: `O usuário se chama ${user}. O assistente se apresenta como ${asst}. Responda com carinho cinematográfico.`
      });
    });
  }

  if (footerHint) {
    footerHint.addEventListener('click', () => {
      isCollapsed = !isCollapsed;
      if (responseContainer) {
        if (isCollapsed) responseContainer.classList.add('collapsed');
        else responseContainer.classList.remove('collapsed');
      }
    });
  }

  if (settingsBtn && iaConfigPanel) {
    settingsBtn.addEventListener('click', () => {
      iaConfigPanel.classList.toggle('active');
    });
  }

  if (parserBtn && parserFile) {
    parserBtn.addEventListener('click', () => {
      parserFile.value = '';
      parserFile.click();
    });
  }

  if (parserFile) {
    parserFile.addEventListener('change', () => {
      const file = parserFile.files && parserFile.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result || '';
        const name = file.name.toLowerCase();

        if (name.endsWith('.css')) {
          const style = document.createElement('style');
          style.textContent = content;
          document.head.appendChild(style);
          if (footerHint) footerHint.textContent = 'CSS extra de renderização aplicado.';
        } else if (name.endsWith('.js')) {
          try {
            const fn = new Function('window', 'document', content);
            fn(window, document);
            if (footerHint) footerHint.textContent = 'Parser JS carregado. Se definiu window.customMarkdownParser(text), já está ativo.';
          } catch (e) {
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

  function loadCurrentVoiceSelectionFromStorage() {
    try {
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
    } catch (e) {
      console.warn('Erro ao carregar config de voz:', e);
      voiceConfig = null;
    }
  }

  if (voiceConfigBtn) {
    voiceConfigBtn.addEventListener('click', () => {
      if (!voiceConfig) {
        if (voiceConfigFile) voiceConfigFile.click();
        return;
      }
      const keys = Object.keys(voiceConfig).filter(k => k !== 'current');
      if (!keys.length) return;

      const idx = keys.indexOf(currentVoiceKey);
      const nextKey = keys[(idx + 1 + keys.length) % keys.length];
      currentVoiceKey = nextKey;
      localStorage.setItem(STORAGE.VOICE_CURRENT_KEY, currentVoiceKey);
      updateVoiceOrbLabel();
      if (footerHint) footerHint.textContent = 'Voz ativa: ' + currentVoiceKey;
    });
  }

  if (voiceConfigFile) {
    voiceConfigFile.addEventListener('change', () => {
      const file = voiceConfigFile.files && voiceConfigFile.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result || '{}');
          if (!json || typeof json !== 'object') {
            if (footerHint) footerHint.textContent = 'JSON inválido de vozes.';
            return;
          }

          voiceConfig = json;
          const keys = Object.keys(voiceConfig);
          if (!keys.length) {
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
        } catch (e) {
          console.error('Erro ao ler JSON de vozes:', e);
          if (footerHint) footerHint.textContent = 'Erro ao carregar JSON de vozes. Veja o console.';
        }
      };
      reader.readAsText(file);
    });
  }

  function updateVoiceOrbLabel() {
    if (!voiceConfigBtn) return;
    const label = currentVoiceKey || 'voz';
    voiceConfigBtn.title = voiceConfig
      ? 'Voz atual: ' + label + ' (clique para alternar)'
      : 'Carregar / alternar vozes de arquétipos';
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      let target = responseBlocks[responseBlocks.length - 1];
      if (!target && bootBlock) target = bootBlock;
      if (!target) return;

      const temp = getBlockText(target);
      if (!temp) return;

      try {
        await navigator.clipboard.writeText(temp);
        if (footerHint) footerHint.textContent = 'Bloco copiado para a área de transferência.';
      } catch {
        if (footerHint) footerHint.textContent = 'Não consegui copiar automaticamente.';
      }
    });
  }

  if (pasteBtn) {
    pasteBtn.addEventListener('click', async () => {
      try {
        const txt = await navigator.clipboard.readText();
        if (txt && userInput) userInput.value = txt;
      } catch (e) {}
    });
  }

  if (voiceBtn) {
    voiceBtn.addEventListener('click', (ev) => {
      const wantAll = ev.shiftKey === true;
      if (wantAll) {
        speakRecentBlocks(Infinity);
      } else {
        speakRecentBlocks(SPEAK_COUNT);
      }
    });
  }

  if (sendBtn) sendBtn.addEventListener('click', handleSendFromInput);
  if (userInput) {
    userInput.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' && !ev.shiftKey) {
        ev.preventDefault();
        handleSendFromInput();
      }
    });
  }

  function setCollapsed(state) {
    isCollapsed = state;
    if (!responseContainer) return;
    if (isCollapsed) responseContainer.classList.add('collapsed');
    else responseContainer.classList.remove('collapsed');
  }

  init();
})();
