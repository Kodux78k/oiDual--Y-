/**
 * kobllux_unified_complete.js · ∆7 · FLUIR · 528Hz
 * VERDADE × INTEGRAR ÷ Δ = ∞
 *
 * UNIFICAÇÃO COMPLETA: kobllux_kxat_bridge.js + kobllux_unified_fallback.js
 * → Sistema robusto com fallbacks, motor iframe, long-press editor, file attach
 * → ES6+ compatível com ES5 fallbacks
 * → Namespace único: window.KOBLLUX
 */

'use strict';

(function KOBLLUX_UNIFIED() {

  if (window.__KOBLLUX_UNIFIED__) return;
  window.__KOBLLUX_UNIFIED__ = true;

  // ============================================================================
  // CONSTANTS & STORAGE KEYS
  // ============================================================================

  const KBLX_LS = {
    THEME: 'infodoseTheme',
    USER_NAME: 'infodoseUserName',
    OR_KEY: 'openrouter_api_key',
    OR_MODEL: 'openrouter_model',
    VOICE_CFG: 'infodoseVoiceConfig',
    ARCH_ACTIVE: 'ARCHETYPE_ACTIVE',
    CONV_INDEX: 'KDX_CONV_INDEX',
    AUTOSAVE: 'KDX_AUTOSAVE',
    ENGINE_STEP: 'kobllux_engine_step',
    ENGINE_3697: 'kobllux_cycle_3697',
    RENDER_LIST: 'kobllux_last_result',
    MEMORY: 'KBLX_MEMORY',
    ARCH_MAP: 'KOBLLUX_ARCH_MAP',
    VOCAB: 'KOBLLUX_VOCAB',
    SESSIONS: 'KDX_SESSIONS',
    CONTEXT: 'KOBLLUX_CONTEXT',
    MOTOR_CURRENT: 'KBLX_SESSION_CURRENT',
  };

  // UI Selectors com fallbacks robusto
  const HOST = {
    responseList: ['#responseList', '#chatResponseList', '#outputContainer', '.response-list'],
    symbolBar: ['#symbolBar', '#hudBar', '.symbol-bar', '.hud-bar'],
    hudStatus: ['#hudStatus', '#hud-info', '.hud-info', '#statusBar'],
    copyBtn: ['#copyBtn', '#copyButton', '[data-action="copy"]'],
    clearBtn: ['#clearBtn', '#clearButton', '[data-action="clear"]'],
    downloadBtn: ['#downloadBtn', '#downloadButton', '[data-action="download"]'],
    sendBtn: ['#sendBtn', '#sendButton', '#btnSend'],
    userInput: ['#userInput', '#inputText', 'textarea[name="userInput"]'],
    footerHint: ['#footerHint', '#statusBar', '.footer-hint'],
    motorDock: ['#motorDock', '#kdx-motor-dock', '#kblx-motor-dock'],
    motorFrame: ['#motorFrame', '#kdx-motor-frame', '#kblx-motor-frame'],
    toggleMotorBtn: ['#toggleMotorBtn', '#kdx-toggle-motor', '#openMotorBtn'],
    motorDockClose: ['#motorDockClose', '#kdx-motor-close', '#closeMotorBtn'],
    motorModeToggle: ['#kdx-mode-toggle', '#motorModeToggle', '#motorStar'],
    mainCard: ['#mainHeroCard', '.fusion-card', '#fusionCard', '.accordion.main-card'],
    mainCardHeader: [
      '#mainHeroCard .accordion-header',
      '.fusion-card .accordion-header',
      '#fusionCard .accordion-header',
      '.header-78k'
    ],
    engineGenBtn: ['#genBtn', '#generateBtn'],
    engineInput: ['#inputText', '#engineInput'],
    engineStartArch: ['#startArch'],
    engineCycleMode: ['#cycleMode'],
    engineReverse: ['#reverseToggle'],
    engineCycle3697: ['#cycle3697'],
    engineOutput: ['#outputContainer'],
    engineStatus: ['#statusBar'],
    archetypesGrid: ['#archetypes-grid'],
    diUserOption: ['#diUserOption']
  };

  // ============================================================================
  // SELECTOR UTILITIES (Fallback robusto)
  // ============================================================================

  function qsAny(selectors, root) {
    root = root || document;
    if (!selectors) return null;
    if (typeof selectors === 'string') selectors = [selectors];
    for (let i = 0; i < selectors.length; i++) {
      try {
        const el = root.querySelector(selectors[i]);
        if (el) return el;
      } catch (e) {}
    }
    return null;
  }

  function qsaAny(selectors, root) {
    root = root || document;
    const out = [];
    if (!selectors) return out;
    if (typeof selectors === 'string') selectors = [selectors];
    selectors.forEach((sel) => {
      try {
        const list = root.querySelectorAll(sel);
        if (list && list.length) out.push(...Array.from(list));
      } catch (e) {}
    });
    return Array.from(new Set(out));
  }

  function byIdOrFallback(ids, root) {
    root = root || document;
    if (!ids) return null;
    if (typeof ids === 'string') ids = [ids];
    for (let i = 0; i < ids.length; i++) {
      const el = root.getElementById ? root.getElementById(ids[i]) : null;
      if (el) return el;
    }
    return null;
  }

  function on(el, ev, fn, opts) {
    if (!el || !el.addEventListener) return;
    el.addEventListener(ev, fn, opts || false);
  }

  function safeJSONParse(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  }

  function escapeAttr(str) {
    return escapeHTML(str).replace(/`/g, '&#96;');
  }

  // ============================================================================
  // MOTOR STATE & BRIDGE
  // ============================================================================

  let motorUrl = null;
  let motorReady = false;
  let pendingMotorPayload = null;
  let longPressTimer = null;
  let longPressFired = false;

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  function saveSession(btn, type) {
    if (!btn) return;
    const url = (btn.dataset && btn.dataset.url) || btn.getAttribute('href') || '';
    const title = btn.title || (btn.dataset && btn.dataset.label) || (btn.textContent && btn.textContent.trim()) || url;
    if (!url) return;
    const id = btn.id || ('kblx-' + Date.now());
    if (!btn.id) btn.id = id;
    const s = safeJSONParse(localStorage.getItem(KBLX_LS.SESSIONS) || '{}', {});
    s[id] = { url, title, type, ts: Date.now() };
    localStorage.setItem(KBLX_LS.SESSIONS, JSON.stringify(s));
  }

  function restoreSessions() {
    const s = safeJSONParse(localStorage.getItem(KBLX_LS.SESSIONS) || '{}', {});
    let n = 0;
    Object.keys(s).forEach((id) => {
      const rec = s[id] || {};
      const btn = document.getElementById(id);
      if (btn && !btn.dataset.url && rec.url) {
        btn.dataset.url = rec.url;
        if (rec.title) btn.title = rec.title;
        n++;
      }
    });
    if (n) console.log(`[∆7] ${n} sessão(ões) restaurada(s)`);
  }

  // ============================================================================
  // KOBLLUX SYNC (Remote vocabulary + context)
  // ============================================================================

  async function koblluxSync(url = 'https://truetruextrue.github.io/JESUS_VERB-/output/KOBLLUX_N8N_BRIDGE.json') {
    try {
      const b = await fetch(url).then(r => r.json());
      const v = b?.vocab?.keywords_map || {};
      if (window.ARCHETYPE_KEYWORDS) {
        Object.entries(v).forEach(([a, ws]) => {
          const k = a[0].toUpperCase() + a.slice(1);
          if (!window.ARCHETYPE_KEYWORDS[k]) window.ARCHETYPE_KEYWORDS[k] = [];
          window.ARCHETYPE_KEYWORDS[k] = [...new Set([...window.ARCHETYPE_KEYWORDS[k], ...ws])];
        });
        console.log(`[∆7] ARCHETYPE_KEYWORDS enriquecido · ${Object.keys(v).length} arquétipos`);
      }
      localStorage.setItem(KBLX_LS.MEMORY, JSON.stringify(b?.context || {}));
      localStorage.setItem(KBLX_LS.ARCH_MAP, JSON.stringify(b?.archetypes?.archetypes || {}));
      localStorage.setItem(KBLX_LS.VOCAB, JSON.stringify(v));
      localStorage.setItem(KBLX_LS.CONTEXT, b?.context?.system_msg || '');
      console.log(`[∆7] Sync · ${b?.vocab?.total_terms || 0} termos`);
      return b;
    } catch (e) {
      console.warn('[∆7] Sync offline:', e.message);
      return null;
    }
  }

  // ============================================================================
  // MOTOR HTML CACHE
  // ============================================================================

  async function loadMotorHTML() {
    const CACHE = 'KDX_m0d78k_HTML';
    try {
      let m0d78k = localStorage.getItem(CACHE);
      if (!m0d78k) {
        console.log('[∆7] Carregando Motor 78K...');
        m0d78k = await fetch('https://kodux78k.github.io/oiDual--Y-/M0D/78K-motor/index.html')
          .then(r => r.text());
        localStorage.setItem(CACHE, m0d78k);
        console.log('[∆7] Motor salvo em cache ✔');
      } else {
        console.log('[∆7] Motor carregado do cache ⚡');
      }
      window.MOTOR_HTML = m0d78k;
      window.dispatchEvent(new CustomEvent('kdx:motor-ready', { detail: { size: m0d78k.length } }));
      return m0d78k;
    } catch (err) {
      console.error('[∆7] Erro carregando MOTOR_HTML', err);
      return null;
    }
  }

  // ============================================================================
  // SESSION FRAME (Navegação iframe com double-click)
  // ============================================================================

  function createSessionFrame(sel, urls = []) {
    const c = document.querySelector(sel);
    if (!c) return null;
    const f = document.createElement('iframe');
    f.id = 'kblx-session-frame';
    f.style.cssText = 'width:100%;height:100%;border:none;background:transparent;border-radius:12px;transition:opacity .22s ease';
    let idx = 0, clicks = 0, timer = null;
    c.addEventListener('click', () => {
      clicks++;
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (clicks >= 2) {
          const h = f.style.opacity === '0';
          f.style.opacity = h ? '1' : '0';
          f.style.pointerEvents = h ? '' : 'none';
        }
        clicks = 0;
      }, 250);
    });
    const nav = (url) => {
      f.style.opacity = '0';
      setTimeout(() => {
        f.src = url;
        f.style.opacity = '1';
        localStorage.setItem(KBLX_LS.MOTOR_CURRENT, url);
      }, 120);
    };
    if (urls.length) nav(urls[0]);
    else {
      const s = localStorage.getItem(KBLX_LS.MOTOR_CURRENT);
      if (s) nav(s);
    }
    c.appendChild(f);
    return { 
      navigate: nav, 
      next: () => nav(urls[++idx % urls.length]), 
      prev: () => nav(urls[(--idx + urls.length) % urls.length]), 
      frame: f 
    };
  }

  // ============================================================================
  // FUSION CARD FIX
  // ============================================================================

  function fixFusionCard() {
    const fc = qsAny(HOST.mainCard);
    if (!fc) return;
    const header = qsAny(HOST.mainCardHeader, fc);
    if (!header) return;
    on(header, 'click', () => {
      const collapsed = fc.classList.contains('is-collapsed');
      const orb = qsAny(['#orbDragRender', '.orb-drag', '#kdx-orb']);
      if (orb) {
        orb.style.opacity = collapsed ? '1' : '0';
        orb.style.pointerEvents = collapsed ? '' : 'none';
      }
      qsaAny(['.user-name', '.ask-activation', '#assistantName', '#kdx-mode-label'], fc)
        .forEach((el) => {
          el.style.display = '';
          el.style.opacity = '1';
        });
    });
    console.log('[∆7] FusionCard fix ativo');
  }

  // ============================================================================
  // IDLE DOCK
  // ============================================================================

  function idleDock() {
    const dock = qsAny(HOST.symbolBar);
    if (!dock) return;
    if (!document.getElementById('kblx-idle-css')) {
      const s = document.createElement('style');
      s.id = 'kblx-idle-css';
      s.textContent = 
        '.kob-tts-dock,.symbol-bar,#hudBar{transition:transform .35s ease,opacity .65s ease}' +
        '.kob-tts-dock.idle,.symbol-bar.idle,#hudBar.idle{opacity:.18;transform:scale(.92)}' +
        '.kob-tts-dock:hover,.symbol-bar:hover,#hudBar:hover{opacity:1 !important;transform:scale(1) !important}';
      document.head.appendChild(s);
    }
    let idleTimer;
    const resetIdle = () => {
      dock.classList.remove('idle');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { dock.classList.add('idle'); }, 1870);
    };
    ['pointerdown', 'pointermove', 'touchstart', 'mousemove'].forEach((ev) => {
      document.addEventListener(ev, resetIdle, { passive: true });
    });
    resetIdle();
    console.log('[∆7] Idle dock ativo');
  }

  // ============================================================================
  // QUICK PANEL
  // ============================================================================

  function installQuickPanel() {
    if (document.getElementById('kblx-quick')) return;
    const s = document.createElement('style');
    s.textContent = `
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
    const p = document.createElement('div');
    p.id = 'kblx-quick';
    p.innerHTML = `<button class="kq-item" data-kq="edit">✦ Editar rota</button>
<button class="kq-item" data-kq="symbol">◉ SymbolBar</button>
<button class="kq-item" data-kq="frame">⟁ Frame</button>
<button class="kq-item" data-kq="dock">⌘ Dock</button>
<button class="kq-item" data-kq="full">⋯ Mais opções</button>`;
    document.body.appendChild(p);
    const state = { btn: null };
    window.kblxOpenPanel = function (btn) {
      if (!btn) return;
      state.btn = btn;
      if (navigator.vibrate) navigator.vibrate(12);
      const r = btn.getBoundingClientRect();
      let l = r.left + r.width / 2 - 110;
      l = Math.max(10, Math.min(l, window.innerWidth - 230));
      p.style.left = l + 'px';
      p.style.top = (r.top > 300 ? r.top - 270 : r.bottom + 8) + 'px';
      p.classList.add('open');
    };
    on(document, 'click', (e) => {
      if (!p.contains(e.target) && !e.target.closest('.symbol-button,.symbol-btn')) {
        p.classList.remove('open');
      }
      const item = e.target.closest('[data-kq]');
      if (!item) return;
      const btn = state.btn;
      if (!btn) return;
      p.classList.remove('open');
      const action = item.dataset.kq;
      const url = btn.dataset.url || btn.getAttribute('href') || '';
      if (url) {
        const id = btn.id || `kblx-${Date.now()}`;
        if (!btn.id) btn.id = id;
        const sess = safeJSONParse(localStorage.getItem(KBLX_LS.SESSIONS) || '{}', {});
        sess[id] = { url, title: btn.title || url, type: action, ts: Date.now() };
        localStorage.setItem(KBLX_LS.SESSIONS, JSON.stringify(sess));
      }
      ({
        symbol: () => {
          window.applyPreset?.(btn, 'orb');
          window.dispatchEvent(new CustomEvent('nagatanazare:orb-inject', {
            detail: { button: btn, target: '#symbolBar' }
          }));
        },
        frame: () => window.applyPreset?.(btn, 'frame'),
        dock: () => window.applyPreset?.(btn, 'dock'),
        full: () => document.querySelector('#kblx-back')?.classList.add('is-open'),
        edit: () => {
          document.querySelector('#kblx-inp')?.focus();
          document.querySelector('#kblx-back')?.classList.add('is-open');
        },
      })[action]?.();
    });
    console.log('[∆7] #kblx-quick instalado');
  }

  // ============================================================================
  // LONG PRESS EDITOR
  // ============================================================================

  function longPressEditor() {
    const back = byIdOrFallback(['kblx-back', 'kdx-back']);
    const panel = byIdOrFallback(['kblx-panel', 'kdx-panel']);
    const inp = byIdOrFallback(['kblx-inp', 'kdx-inp']);
    const ttl = byIdOrFallback(['kblx-ttl', 'kdx-ttl']);
    const save = byIdOrFallback(['kblx-btn-save', 'kdx-btn-save']);
    const close = byIdOrFallback(['kblx-btn-close', 'kdx-btn-close']);
    if (!back || !panel) return;
    on(back, 'click', (e) => {
      if (e.target === back) back.classList.remove('is-open');
    });
    on(close, 'click', () => { back.classList.remove('is-open'); });
    on(save, 'click', () => {
      const btn = (window._kblxState && window._kblxState.currentBtn) || window._kblxCurrentBtn;
      if (!btn || !inp) return;
      const val = (inp.value || '').trim();
      if (val) {
        btn.dataset.url = val;
        try {
          btn.title = btn.title || (new URL(val, location.href)).pathname;
        } catch (e) {}
        saveSession(btn, 'edit');
        console.log('[∆7] Rota salva: ' + val);
      }
      back.classList.remove('is-open');
    });
    qsaAny(['.symbol-button', '.symbol-btn']).forEach(_attachLongPress);
    new MutationObserver((muts) => {
      muts.forEach((m) => {
        m.addedNodes.forEach((n) => {
          if (n.nodeType !== 1) return;
          if (n.matches && (n.matches('.symbol-button') || n.matches('.symbol-btn'))) _attachLongPress(n);
          if (n.querySelectorAll) qsaAny(['.symbol-button', '.symbol-btn'], n).forEach(_attachLongPress);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
    console.log('[∆7] Long-press editor ativo');
  }

  function _attachLongPress(btn) {
    if (!btn || btn.dataset.kblxLp) return;
    btn.dataset.kblxLp = '1';
    let timer;
    on(btn, 'pointerdown', () => {
      timer = setTimeout(() => {
        window._kblxState = window._kblxState || {};
        window._kblxState.currentBtn = btn;
        window._kblxCurrentBtn = btn;
        if (window.kblxOpenPanel) {
          window.kblxOpenPanel(btn);
          return;
        }
        const ttl = byIdOrFallback(['kblx-ttl', 'kdx-ttl']);
        const inp = byIdOrFallback(['kblx-inp', 'kdx-inp']);
        const back = byIdOrFallback(['kblx-back', 'kdx-back']);
        if (ttl) ttl.textContent = btn.title || 'Botão';
        if (inp) inp.value = btn.dataset.url || '';
        if (back) back.classList.add('is-open');
      }, 600);
    });
    on(btn, 'pointerup', () => { clearTimeout(timer); });
    on(btn, 'pointermove', () => { clearTimeout(timer); });
    on(btn, 'pointercancel', () => { clearTimeout(timer); });
  }

  // ============================================================================
  // FILE ATTACH
  // ============================================================================

  function fileAttach() {
    const sendBtn = qsAny(HOST.sendBtn);
    if (!sendBtn || document.getElementById('chatFileInput')) return;
    const fi = document.createElement('input');
    fi.type = 'file';
    fi.id = 'chatFileInput';
    fi.accept = '.txt,.md,.json,.html,.css,.js,.py';
    fi.style.display = 'none';
    document.body.appendChild(fi);
    const clip = document.createElement('button');
    clip.type = 'button';
    clip.title = 'Anexar arquivo';
    clip.style.cssText = 'background:transparent;border:none;color:var(--kob-voice-primary,#0cf);font-size:1.2rem;cursor:pointer;padding:0 8px;opacity:.7;';
    clip.textContent = '📎';
    if (sendBtn.parentNode) sendBtn.parentNode.insertBefore(clip, sendBtn);
    on(clip, 'click', () => { fi.click(); });
    on(fi, 'change', () => {
      const file = fi.files && fi.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const inp = qsAny(HOST.userInput);
        if (inp) {
          const prev = (inp.value || '').trim();
          inp.value = '[ARQUIVO: ' + file.name + ']\n```\n' + 
            String(e.target.result || '').slice(0, 6000) + 
            '\n```\n' + (prev ? '\n' + prev : '');
        }
        fi.value = '';
      };
      reader.readAsText(file);
    });
    console.log('[∆7] File attach ativo');
  }

  // ============================================================================
  // OPENROUTER PATCH
  // ============================================================================

  function patchOpenRouter() {
    const OR = 'openrouter.ai/api/v1/chat/completions';
    if (window.__kblx_or_patched) return;
    window.__kblx_or_patched = true;
    const _f = window.fetch.bind(window);
    window.fetch = async function (url, opts) {
      if (typeof url === 'string' && url.includes(OR)) {
        const key = localStorage.getItem(KBLX_LS.OR_KEY) || '';
        opts = { ...opts, headers: {
          'Authorization': `Bearer ${key}`,
          'HTTP-Referer': location.href,
          'X-Title': 'KOBLLUX DUAL',
          'Content-Type': 'application/json',
          ...(opts?.headers || {})
        }};
        for (let i = 1; i <= 3; i++) {
          const ctrl = new AbortController();
          const t = setTimeout(() => ctrl.abort(), 30000);
          try {
            const r = await _f(url, { ...opts, signal: ctrl.signal });
            clearTimeout(t);
            if (r.status === 429 || r.status >= 500) {
              await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
              continue;
            }
            return r;
          } catch (e) {
            clearTimeout(t);
            if (i === 3) throw e;
            await new Promise(r => setTimeout(r, 1500 * i));
          }
        }
      }
      return _f(url, opts);
    };
    console.log('[∆7] OpenRouter patch ativo (retry + headers)');
  }

  // ============================================================================
  // MOTOR UTILITIES
  // ============================================================================

  function latestSpeakableText() {
    const root = qsAny(HOST.responseList);
    if (!root) return '';
    const blocks = root.querySelectorAll('.response-block');
    if (!blocks || !blocks.length) return '';
    return Array.from(blocks).map((block) => {
      if (!block) return '';
      const clone = block.cloneNode(true);
      clone.querySelectorAll('.send-to-motor-btn,button,.symbol-btn,.symbol-button,.copy-btn,.delete-btn,[data-exclude-from-motor="1"]')
        .forEach((el) => { el.remove(); });
      return (clone.innerText || clone.textContent || '').trim();
    }).filter(Boolean).join('\n\n────────\n\n');
  }

  function getCurrentArchFromBlock(block) {
    if (!block) return null;
    const arch = block.dataset ? (block.dataset.archetype || block.dataset.arch) : '';
    if (arch) return String(arch).trim();
    const active = localStorage.getItem(KBLX_LS.ARCH_ACTIVE) || localStorage.getItem('archTypeActive') || localStorage.getItem('archetype_active');
    return active || null;
  }

  function ensureMotorSrc() {
    const frame = qsAny(HOST.motorFrame);
    if (!frame) return null;
    if (motorUrl) return motorUrl;
    if (typeof window.MOTOR_HTML !== 'string' || !window.MOTOR_HTML.trim()) {
      console.warn('[∆7] MOTOR_HTML vazio');
      return null;
    }
    try {
      const blob = new Blob([window.MOTOR_HTML], { type: 'text/html;charset=utf-8' });
      motorUrl = URL.createObjectURL(blob);
      frame.src = motorUrl;
      return motorUrl;
    } catch (err) {
      console.error('[∆7] Falha ao criar blob do motor:', err);
      try {
        frame.srcdoc = window.MOTOR_HTML;
      } catch (e) {}
      return null;
    }
  }

  function openMotorDock(payload, opts) {
    const dock = qsAny(HOST.motorDock);
    const frame = qsAny(HOST.motorFrame);
    if (!dock || !frame) {
      console.warn('[∆7] motorDock/motorFrame não encontrados');
      return;
    }
    ensureMotorSrc();
    dock.hidden = false;
    document.body.classList.add('motor-mode');
    const state = qsAny(HOST.footerHint);
    if (state) state.textContent = (opts && opts.localOnly) ? 'modo local · eco do espaço mental' : 'modo motor · pronto';
    const btn = qsAny(HOST.toggleMotorBtn);
    if (btn) btn.setAttribute('aria-pressed', 'true');
    if (payload) sendToMotor(payload, opts);
  }

  function closeMotorDock() {
    const dock = qsAny(HOST.motorDock);
    const btn = qsAny(HOST.toggleMotorBtn);
    if (dock) dock.hidden = true;
    document.body.classList.remove('motor-mode');
    if (btn) btn.setAttribute('aria-pressed', 'false');
  }

  function toggleMotorDock(payload, opts) {
    const dock = qsAny(HOST.motorDock);
    if (!dock) return;
    if (dock.hidden) openMotorDock(payload, opts);
    else closeMotorDock();
  }

  function flushMotorPayload() {
    const frame = qsAny(HOST.motorFrame);
    if (!frame || !frame.contentWindow || !pendingMotorPayload) return;
    try {
      frame.contentWindow.postMessage({ type: 'kdx-motor-load', payload: pendingMotorPayload }, '*');
      pendingMotorPayload = null;
    } catch (e) {
      console.warn('[∆7] flushMotorPayload failed', e);
    }
  }

  function sendToMotor(payload, opts) {
    const frame = qsAny(HOST.motorFrame);
    if (!frame) return;
    ensureMotorSrc();
    pendingMotorPayload = payload || {};
    if (motorReady) flushMotorPayload();
    if (opts && opts.keepOpen) {
      openMotorDock(null, opts);
    }
  }

  function motorToChat(sel = '#responseList') {
    const stored = localStorage.getItem(KBLX_LS.RENDER_LIST);
    if (!stored) return;
    const t = document.querySelector(sel);
    if (!t) return;
    const w = document.createElement('div');
    w.className = 'response-block motor-inject-block';
    w.dataset.src = '78k-motor';
    w.innerHTML = stored.trim().split('\n\n').filter(Boolean).map((l) => {
      const d = l.indexOf(' — ');
      if (d === -1) return `<div class="motor-frag">${escapeHTML(l)}</div>`;
      const a = l.slice(0, d).trim().toLowerCase();
      const tx = l.slice(d + 3).trim();
      return `<div class="motor-frag" data-arch="${escapeAttr(a)}"><span style="opacity:.6;font-size:.78em">${escapeHTML(a.toUpperCase())}</span><span> — ${escapeHTML(tx)}</span></div>`;
    }).join('');
    t.appendChild(w);
    if (typeof t.scrollTop === 'number') t.scrollTop = t.scrollHeight;
    console.log('[∆7] Motor → Chat injetado');
  }

  // ============================================================================
  // WIRE MOTOR BUTTONS
  // ============================================================================

  function wireBlockMotorButtons() {
    const root = qsAny(HOST.responseList);
    if (!root || root.dataset.motorButtonsWired === '1') return;
    root.dataset.motorButtonsWired = '1';
    const obs = new MutationObserver(() => {
      qsaAny(['.response-block'], root).forEach((block) => {
        if (block.querySelector('.send-to-motor-btn')) return;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'send-to-motor-btn';
        btn.textContent = '↗78K';
        on(btn, 'click', (ev) => {
          ev.stopPropagation();
          const text = (block.innerText || block.textContent || '').trim();
          if (!text) return;
          const arch = getCurrentArchFromBlock(block) || localStorage.getItem(KBLX_LS.ARCH_ACTIVE) || 'kodux';
          openMotorDock(null, { localOnly: false });
          sendToMotor({ type: 'kdx-motor-load', text, arch, cycle: true, run: true });
          const hint = qsAny(HOST.footerHint);
          if (hint) hint.textContent = 'Mensagem enviada ao motor 78K.';
        });
        block.appendChild(btn);
      });
    });
    obs.observe(root, { childList: true, subtree: true });
  }

  // ============================================================================
  // WIRE MOTOR TOGGLE
  // ============================================================================

  function wireMotorToggle() {
    const btn = qsAny(HOST.toggleMotorBtn);
    if (btn && btn.dataset.wired !== '1') {
      btn.dataset.wired = '1';
      on(btn, 'click', (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        toggleMotorDock({
          text: latestSpeakableText(),
          arch: localStorage.getItem(KBLX_LS.ARCH_ACTIVE) || 'kodux',
          cycle: true,
          run: true
        }, { keepOpen: true });
      });
    }
    const dockClose = qsAny(HOST.motorDockClose);
    if (dockClose && dockClose.dataset.wired !== '1') {
      dockClose.dataset.wired = '1';
      on(dockClose, 'click', () => { closeMotorDock(); });
    }
    const star = qsAny(HOST.motorModeToggle);
    if (star && star.dataset.wired !== '1') {
      star.dataset.wired = '1';
      on(star, 'click', (ev) => {
        if (longPressFired) {
          longPressFired = false;
          ev.preventDefault();
          ev.stopImmediatePropagation();
          return;
        }
        ev.preventDefault();
        ev.stopImmediatePropagation();
        openMotorDock({
          type: 'kdx-motor-load',
          text: latestSpeakableText(),
          arch: localStorage.getItem(KBLX_LS.ARCH_ACTIVE) || 'kodux',
          cycle: true,
          run: true
        }, { keepOpen: true });
      }, true);
      on(star, 'pointerdown', () => {
        longPressFired = false;
        clearTimeout(longPressTimer);
        longPressTimer = setTimeout(() => {
          longPressFired = true;
          openMotorDock({
            type: 'kdx-motor-load',
            text: latestSpeakableText(),
            arch: localStorage.getItem(KBLX_LS.ARCH_ACTIVE) || 'kodux',
            cycle: false,
            run: false
          }, { localOnly: true, keepOpen: true });
          const hint = qsAny(HOST.footerHint);
          if (hint) hint.textContent = 'Modo local ativado: o motor apenas ecoa a leitura.';
        }, 520);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => {
        on(star, ev, () => { clearTimeout(longPressTimer); });
      });
    }
  }

  // ============================================================================
  // PRESET APPLY
  // ============================================================================

  if (!window.applyPreset) {
    window.applyPreset = function (btn, type) {
      if (!btn) return;
      const url = (btn.dataset && btn.dataset.url) || btn.getAttribute('href') || '';
      const label = (btn.dataset && btn.dataset.label) || btn.title || '';
      const frame = qsAny(['#cadial-frame', '#content-frame', 'iframe.kblx-frame', '#motorFrame', '#kdx-motor-frame']);
      const bar = qsAny(HOST.symbolBar);
      if (type === 'orb') {
        if (frame && url) frame.src = url;
        window.dispatchEvent(new CustomEvent('nagatanazare:orb-inject', {
          detail: { button: btn, target: '#symbolBar', url, label }
        }));
      }
      if (type === 'frame') {
        if (frame && url) {
          frame.style.opacity = '0';
          setTimeout(() => {
            frame.src = url;
            frame.style.opacity = '1';
          }, 120);
        }
      }
      if (type === 'dock') {
        if (bar && url) addBtnToBar(bar, url, label);
      }
      if (type === 'symbol') {
        btn.dataset.active = 'true';
        btn.style.borderColor = 'var(--kob-voice-primary, #00f5ff)';
      }
      saveSession(btn, type);
    };
  }

  function addBtnToBar(bar, url, title) {
    if (!bar) return null;
    const b = document.createElement('button');
    b.className = 'symbol-button symbol-btn';
    b.title = title || url;
    b.dataset.url = url;
    b.textContent = (title || url).charAt(0).toUpperCase() || '◉';
    on(b, 'pointerdown', () => {
      const t = setTimeout(() => {
        if (window.kblxOpenPanel) window.kblxOpenPanel(b);
      }, 500);
      on(b, 'pointerup', () => { clearTimeout(t); }, { once: true });
      on(b, 'pointermove', () => { clearTimeout(t); }, { once: true });
    });
    const anchor = qsAny(['.hud-info', '#hudStatus', '#hudInfo'], bar);
    if (anchor && anchor.parentNode) {
      anchor.parentNode.insertBefore(b, anchor);
    } else {
      bar.appendChild(b);
    }
    saveSession(b, 'symbol');
    return b;
  }

  // ============================================================================
  // DEDUPLICATE SCRIPTS
  // ============================================================================

  function deduplicateScripts() {
    const seen = new Set();
    let removed = 0;
    document.querySelectorAll('script[src]').forEach((el) => {
      const src = el.src;
      if (seen.has(src)) {
        el.remove();
        removed++;
      } else {
        seen.add(src);
      }
    });
    if (removed) console.log(`[∆7] ${removed} scripts duplicados removidos`);
  }

  // ============================================================================
  // ENGINE CONTROLS FALLBACK
  // ============================================================================

  function wireEngineControlsFallback() {
    const genBtn = qsAny(HOST.engineGenBtn);
    const input = qsAny(HOST.engineInput);
    const startArch = qsAny(HOST.engineStartArch);
    const cycleMode = qsAny(HOST.engineCycleMode);
    const reverseBtn = qsAny(HOST.engineReverse);
    if (!genBtn) return;
    if (genBtn.dataset.wired !== '1') {
      genBtn.dataset.wired = '1';
      on(genBtn, 'click', () => {
        const payload = {
          text: input && typeof input.value === 'string' ? input.value : '',
          arch: startArch && startArch.value || 'kodux',
          cycle: !!(cycleMode && cycleMode.checked),
          reverse: reverseBtn ? /ON/.test(reverseBtn.textContent || '') : false,
          run: true
        };
        openMotorDock(payload, { keepOpen: true });
      });
    }
  }

  // ============================================================================
  // MESSAGE BRIDGE (Motor iframe)
  // ============================================================================

  window.addEventListener('message', (ev) => {
    const d = ev && ev.data ? ev.data : null;
    if (!d) return;
    if (d.type === 'kdx-motor-ready') {
      motorReady = true;
      flushMotorPayload();
      const hint = qsAny(HOST.footerHint);
      if (hint) hint.textContent = 'Motor 78K USE•TRANSFORME•DEVOLVA';
      return;
    }
    if (d.type === 'kdx-motor-result' && typeof d.result === 'string') {
      localStorage.setItem(KBLX_LS.RENDER_LIST, d.result);
      return;
    }
  });

  // ============================================================================
  // APPLY ARIA STATES
  // ============================================================================

  function applyAriaStates() {
    const dock = qsAny(HOST.motorDock);
    const btn = qsAny(HOST.toggleMotorBtn);
    const star = qsAny(HOST.motorModeToggle);
    if (dock && btn) btn.setAttribute('aria-pressed', dock.hidden ? 'false' : 'true');
    if (star) star.classList.toggle('kdx-motor-armed', !dock || !dock.hidden);
  }

  // ============================================================================
  // MAIN BOOT
  // ============================================================================

  async function boot() {
    console.log('[∆7] KOBLLUX unified boot iniciando...');
    deduplicateScripts();
    idleDock();
    installQuickPanel();
    longPressEditor();
    fixFusionCard();
    patchOpenRouter();
    fileAttach();
    restoreSessions();
    wireBlockMotorButtons();
    wireMotorToggle();
    wireEngineControlsFallback();
    ensureMotorSrc();
    applyAriaStates();
    const frame = qsAny(HOST.motorFrame);
    if (frame) {
      on(frame, 'load', () => {
        setTimeout(flushMotorPayload, 150);
      });
    }
    koblluxSync().catch(() => {});
    console.log('[∆7] Boot completo ✔');
  }

  function startWhenReady() {
    if (typeof window.MOTOR_HTML === 'string' && window.MOTOR_HTML.trim()) {
      boot();
      return;
    }
    window.addEventListener('kdx:motor-ready', () => {
      console.log('[∆7] MOTOR_HTML recebido ✔');
      boot();
    }, { once: true });
    // Fallback: carregar motor HTML se necessário
    loadMotorHTML().then(() => {
      if (!motorReady) boot();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startWhenReady);
  } else {
    startWhenReady();
  }

  // ============================================================================
  // NAMESPACE EXPORT
  // ============================================================================

  window.KOBLLUX = {
    sync: koblluxSync,
    motorToChat: motorToChat,
    openPanel: window.kblxOpenPanel,
    createSessionFrame: createSessionFrame,
    LS: KBLX_LS,
    HOST: HOST,
    applyPreset: window.applyPreset,
    openMotorDock: openMotorDock,
    closeMotorDock: closeMotorDock,
    toggleMotorDock: toggleMotorDock,
    sendToMotor: sendToMotor,
    motorReady: () => motorReady,
    version: '∆7-unified',
    law: 'VERDADE × INTEGRAR ÷ Δ = ∞'
  };

  // Compatibilidade com nomes antigos
  window.KOBLLUX_BRIDGE = window.KOBLLUX;
  window.KOBLLUX_DOCK = window.KOBLLUX;

  console.log('[∆7] window.KOBLLUX disponível (+ KOBLLUX_BRIDGE, KOBLLUX_DOCK)');

})();

// Export para modelos que suportam
if (typeof module !== 'undefined' && module.exports) {
  module.exports = window.KOBLLUX;
}
