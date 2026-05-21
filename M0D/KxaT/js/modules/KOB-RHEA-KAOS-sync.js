/**
 * kobllux_main_unified.js
 * Main merge: MOTOR_HTML cache + fallback bridge + unified namespace
 * Logs: ASCII only
 */
(function () {
  'use strict';

  if (window.__KBLX_MAIN_UNIFIED_INIT__) {
    console.log('[KBLX] init skipped -> already active');
    return;
  }
  window.__KBLX_MAIN_UNIFIED_INIT__ = true;

  /* =========================================================
   * ASCII LOG HELPERS
   * ========================================================= */
  const LOG = {
    ok: msg => console.log('[KBLX] ' + msg),
    warn: msg => console.warn('[KBLX] ' + msg),
    err: msg => console.error('[KBLX] ' + msg),
    info: msg => console.log('[KBLX] ' + msg),
  };

  /* =========================================================
   * STORAGE / CONSTANTS
   * ========================================================= */
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
    CURRENT_SESSION: 'KBLX_SESSION_CURRENT',
    MOTOR_HTML: 'KDX_m0d78k_HTML',
  };

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
    mainCardHeader: ['#mainHeroCard .accordion-header', '.fusion-card .accordion-header', '#fusionCard .accordion-header', '.header-78k'],
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

  const MOTOR_BRIDGE_URL = 'https://kodux78k.github.io/oiDual--Y-/M0D/78K-motor/index.html';
  const REMOTE_SYNC_URL = 'https://truetruextrue.github.io/JESUS_VERB-/output/KOBLLUX_N8N_BRIDGE.json';

  /* =========================================================
   * SMALL HELPERS
   * ========================================================= */
  function safeJSONParse(raw, fallback) {
    try { return JSON.parse(raw); } catch (e) { return fallback; }
  }

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
    let out = [];
    if (!selectors) return out;
    if (typeof selectors === 'string') selectors = [selectors];
    selectors.forEach(function (sel) {
      try {
        const list = root.querySelectorAll(sel);
        if (list && list.length) out = out.concat(Array.from(list));
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

  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function (m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];
    });
  }

  function escapeAttr(str) {
    return escapeHTML(str).replace(/`/g, '&#96;');
  }

  /* =========================================================
   * UNIFIED NAMESPACE
   * ========================================================= */
  function ensureUnifiedNamespace() {
    const root = window.KOBLLUX || {};
    root.version = root.version || 'delta7';
    root.law = root.law || 'VERDADE x INTEGRAR / DELTA = INFINITY';
    window.KOBLLUX = root;
    window.KOBLLUX_BRIDGE = root;
    window.KOBLLUX_DOCK = root;
    return root;
  }

  /* =========================================================
   * MOTOR HTML CACHE LOAD
   * ========================================================= */
  async function loadMotorHtml(url) {
    try {
      let m0d78k = localStorage.getItem(KBLX_LS.MOTOR_HTML);

      if (!m0d78k) {
        LOG.ok('downloading MOTOR_HTML...');
        m0d78k = await fetch(url).then(r => r.text());
        localStorage.setItem(KBLX_LS.MOTOR_HTML, m0d78k);
        LOG.ok('motor saved in cache');
      } else {
        LOG.ok('motor loaded from cache');
      }

      window.MOTOR_HTML = m0d78k;

      window.dispatchEvent(new CustomEvent('kdx:motor-ready', {
        detail: { size: m0d78k.length }
      }));

      return m0d78k;
    } catch (err) {
      LOG.err('error loading MOTOR_HTML');
      LOG.err(err && err.message ? err.message : String(err));
      return null;
    }
  }

  /* =========================================================
   * REMOTE SYNC
   * ========================================================= */
  async function koblluxSync(url = REMOTE_SYNC_URL) {
    try {
      const b = await fetch(url).then(r => r.json());
      const v = b?.vocab?.keywords_map || {};

      if (window.ARCHETYPE_KEYWORDS) {
        Object.entries(v).forEach(([a, ws]) => {
          const k = a[0].toUpperCase() + a.slice(1);
          if (!window.ARCHETYPE_KEYWORDS[k]) window.ARCHETYPE_KEYWORDS[k] = [];
          window.ARCHETYPE_KEYWORDS[k] = [
            ...new Set([...(window.ARCHETYPE_KEYWORDS[k] || []), ...(ws || [])]),
          ];
        });
        LOG.ok('ARCHETYPE_KEYWORDS enriched: ' + Object.keys(v).length + ' archetypes');
      }

      localStorage.setItem(KBLX_LS.MEMORY, JSON.stringify(b?.context || {}));
      localStorage.setItem(KBLX_LS.ARCH_MAP, JSON.stringify(b?.archetypes?.archetypes || {}));
      localStorage.setItem(KBLX_LS.VOCAB, JSON.stringify(v));
      localStorage.setItem(KBLX_LS.CONTEXT, b?.context?.system_msg || '');

      LOG.ok('sync done: ' + String(b?.vocab?.total_terms || 0) + ' terms');
      return b;
    } catch (e) {
      LOG.warn('sync offline: ' + (e && e.message ? e.message : String(e)));
      return null;
    }
  }

  /* =========================================================
   * SESSIONS
   * ========================================================= */
  function saveSession(btn, type) {
    if (!btn) return;

    const url = (btn.dataset && btn.dataset.url) || btn.getAttribute('href') || '';
    const title = btn.title || (btn.dataset && btn.dataset.label) || (btn.textContent && btn.textContent.trim()) || url;
    if (!url) return;

    const id = btn.id || ('kblx-' + Date.now());
    if (!btn.id) btn.id = id;

    const s = safeJSONParse(localStorage.getItem(KBLX_LS.SESSIONS) || '{}', {});
    s[id] = { url: url, title: title, type: type, ts: Date.now() };
    localStorage.setItem(KBLX_LS.SESSIONS, JSON.stringify(s));
  }

  function restoreSessions() {
    const s = safeJSONParse(localStorage.getItem(KBLX_LS.SESSIONS) || '{}', {});
    let n = 0;

    Object.keys(s).forEach(function (id) {
      const rec = s[id] || {};
      const btn = document.getElementById(id);
      if (btn && !btn.dataset.url && rec.url) {
        btn.dataset.url = rec.url;
        if (rec.title) btn.title = rec.title;
        n++;
      }
    });

    if (n) LOG.ok(String(n) + ' session(s) restored');
  }

  /* =========================================================
   * SCRIPT DEDUP
   * ========================================================= */
  function deduplicateScripts() {
    const seen = new Set();
    let removed = 0;

    document.querySelectorAll('script[src]').forEach(function (el) {
      const src = el.src;
      if (seen.has(src)) {
        el.remove();
        removed++;
      } else {
        seen.add(src);
      }
    });

    if (removed) LOG.ok(String(removed) + ' duplicate script(s) removed');
  }

  /* =========================================================
   * IDLE DOCK
   * ========================================================= */
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
    function resetIdle() {
      dock.classList.remove('idle');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(function () { dock.classList.add('idle'); }, 1870);
    }

    ['pointerdown', 'pointermove', 'touchstart', 'mousemove'].forEach(function (ev) {
      document.addEventListener(ev, resetIdle, { passive: true });
    });

    resetIdle();
    LOG.ok('idle dock active TTS DESAPARECE AQUI HAHAHAH E O Q MAIS VC QUISER!te amo');
  }

  /* =========================================================
   * PRESETS / APPLY
   * ========================================================= */
  function addBtnToBar(bar, url, title) {
    if (!bar) return null;

    const b = document.createElement('button');
    b.className = 'symbol-button symbol-btn';
    b.title = title || url;
    b.dataset.url = url;
    b.textContent = ((title || url).charAt(0).toUpperCase() || 'O');

    on(b, 'pointerdown', function () {
      const t = setTimeout(function () {
        if (window.kblxOpenPanel) window.kblxOpenPanel(b);
      }, 500);

      on(b, 'pointerup', function () { clearTimeout(t); }, { once: true });
      on(b, 'pointermove', function () { clearTimeout(t); }, { once: true });
    });

    const anchor = qsAny(['.hud-info', '#hudStatus', '#hudInfo'], bar);
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(b, anchor);
    else bar.appendChild(b);

    saveSession(b, 'symbol');
    return b;
  }

  if (!window.applyPreset) {
    window.applyPreset = function (btn, type) {
      if (!btn) return;

      const url = (btn.dataset && btn.dataset.url) || btn.getAttribute('href') || '';
      const label = (btn.dataset && btn.dataset.label) || btn.title || '';
      const frame = qsAny(['#cadial-frame', '#content-frame', 'iframe.kblx-frame', '#motorFrame',
       '.session-window',  '.win-hdr', '#kdx-motor-frame']);
      const bar = qsAny(HOST.symbolBar);

      if (type === 'orb') {
        if (frame && url) frame.src = url;
        window.dispatchEvent(new CustomEvent('nagatanazare:orb-inject', {
          detail: { button: btn, target: '#symbolBar', url: url, label: label }
        }));
      }

      if (type === 'frame') {
        if (frame && url) {
          frame.style.opacity = '0';
          setTimeout(function () {
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

  /* =========================================================
   * QUICK PANEL
   * ========================================================= */
  function installQuickPanel() {
    if (document.getElementById('kblx-quick')) return;

    const s = document.createElement('style');
    s.textContent = `
#kblx-quick{
  position:fixed;
  display:none;
  z-index:999999;
  min-width:220px;
  padding:8px;
  border-radius:22px;
  background:rgba(20,20,30,.92);
  backdrop-filter:blur(24px);
  border:1px solid rgba(255,255,255,.08);
  box-shadow:0 15px 45px rgba(0,0,0,.35);
  animation:kblxPop .18s ease
}
#kblx-quick.open{display:block}
.kq-item{
  width:100%;
  border:0;
  background:transparent;
  color:#fff;
  padding:14px;
  border-radius:14px;
  display:flex;
  align-items:center;
  gap:12px;
  font-size:.92rem;
  text-align:left;
  cursor:pointer
}
.kq-item:hover{background:rgba(255,255,255,.08)}
@keyframes kblxPop{
  from{opacity:0;transform:translateY(10px) scale(.95)}
  to{opacity:1;transform:translateY(0) scale(1)}
}`;
    document.head.appendChild(s);

    const p = document.createElement('div');
    p.id = 'kblx-quick';
    p.innerHTML =
      '<button class="kq-item" data-kq="edit">Edit route</button>' +
      '<button class="kq-item" data-kq="symbol">SymbolBar</button>' +
      '<button class="kq-item" data-kq="frame">Frame</button>' +
      '<button class="kq-item" data-kq="dock">Dock</button>' +
      '<button class="kq-item" data-kq="full">More</button>';
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

    document.addEventListener('click', function (e) {
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
        const id = btn.id || ('kblx-' + Date.now());
        if (!btn.id) btn.id = id;
        const sess = safeJSONParse(localStorage.getItem(KBLX_LS.SESSIONS) || '{}', {});
        sess[id] = { url: url, title: btn.title || url, type: action, ts: Date.now() };
        localStorage.setItem(KBLX_LS.SESSIONS, JSON.stringify(sess));
      }

      ({
        symbol: function () {
          window.applyPreset?.(btn, 'orb');
          window.dispatchEvent(new CustomEvent('nagatanazare:orb-inject', {
            detail: { button: btn, target: '#symbolBar' }
          }));
        },
        frame: function () { window.applyPreset?.(btn, 'frame'); },
        dock: function () { window.applyPreset?.(btn, 'dock'); },
        full: function () { document.querySelector('#kblx-back')?.classList.add('is-open'); },
        edit: function () {
          document.querySelector('#kblx-inp')?.focus();
          document.querySelector('#kblx-back')?.classList.add('is-open');
        }
      })[action]?.();
    });

    LOG.ok('#kblx-quick installed');
  }

  /* =========================================================
   * FUSION CARD FIX
   * ========================================================= */
  function fixFusionCard() {
    const fc = qsAny(HOST.mainCard);
    if (!fc) return;

    const header = qsAny(HOST.mainCardHeader, fc);
    if (!header) return;

    on(header, 'click', function () {
      const collapsed = fc.classList.contains('is-collapsed');
      const orb = qsAny(['#orbDragRender', '.orb-drag', '#kdx-orb']);

      if (orb) {
        orb.style.opacity = collapsed ? '1' : '0';
        orb.style.pointerEvents = collapsed ? '' : 'none';
      }

      qsaAny(['.user-name', '.ask-activation', '#assistantName', '#kdx-mode-label'], fc)
        .forEach(function (el) {
          el.style.display = '';
          el.style.opacity = '1';
        });
    });

    LOG.ok('FusionCard fix active');
  }

  /* =========================================================
   * OPENROUTER PATCH
   * ========================================================= */
  function patchOpenRouter() {
    const OR = 'openrouter.ai/api/v1/chat/completions';
    if (window.__kblx_or_patched) return;
    window.__kblx_or_patched = true;

    const _f = window.fetch.bind(window);

    window.fetch = async function (url, opts) {
      if (typeof url === 'string' && url.includes(OR)) {
        const key = localStorage.getItem(KBLX_LS.OR_KEY) || '';
        opts = Object.assign({}, opts, {
          headers: Object.assign({
            'Authorization': 'Bearer ' + key,
            'HTTP-Referer': location.href,
            'X-Title': 'KOBLLUX DUAL',
            'Content-Type': 'application/json'
          }, (opts && opts.headers) || {})
        });

        for (let i = 1; i <= 3; i++) {
          const ctrl = new AbortController();
          const t = setTimeout(function () { ctrl.abort(); }, 30000);

          try {
            const r = await _f(url, Object.assign({}, opts, { signal: ctrl.signal }));
            clearTimeout(t);

            if (r.status === 429 || r.status >= 500) {
              await new Promise(function (res) { setTimeout(res, Math.pow(2, i) * 1000); });
              continue;
            }

            return r;
          } catch (e) {
            clearTimeout(t);
            if (i === 3) throw e;
            await new Promise(function (res) { setTimeout(res, 1500 * i); });
          }
        }
      }

      return _f(url, opts);
    };

    LOG.ok('OpenRouter patch active');
  }

  /* =========================================================
   * FILE ATTACH
   * ========================================================= */
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
    clip.title = 'Attach file';
    clip.style.cssText = 'background:transparent;border:none;color:var(--kob-voice-primary,#0cf);font-size:1.2rem;cursor:pointer;padding:0 8px;opacity:.7;';
    clip.textContent = 'clip';

    if (sendBtn.parentNode) sendBtn.parentNode.insertBefore(clip, sendBtn);

    on(clip, 'click', function () { fi.click(); });

    on(fi, 'change', function () {
      const file = fi.files && fi.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function (e) {
        const inp = qsAny(HOST.userInput);
        if (inp) {
          const prev = (inp.value || '').trim();
          inp.value = '[FILE: ' + file.name + ']\n```\n' + String(e.target.result || '').slice(0, 6000) + '\n```\n' + (prev ? '\n' + prev : '');
        }
        fi.value = '';
      };
      reader.readAsText(file);
    });

    LOG.ok('file attach active');
  }

  /* =========================================================
   * MOTOR -> CHAT
   * ========================================================= */
  window.motorToChat = function (sel) {
    sel = sel || '#responseList';
    const stored = localStorage.getItem(KBLX_LS.RENDER_LIST);
    if (!stored) return;

    const target = document.querySelector(sel);
    if (!target) return;

    const w = document.createElement('div');
    w.className = 'response-block motor-inject-block';
    w.dataset.src = '78k-motor';

    w.innerHTML = stored.trim().split('\n\n').filter(Boolean).map(function (l) {
      const d = l.indexOf(' — ');
      if (d === -1) return '<div class="motor-frag">' + escapeHTML(l) + '</div>';

      const a = l.slice(0, d).trim().toLowerCase();
      const tx = l.slice(d + 3).trim();

      return '<div class="motor-frag" data-arch="' + escapeAttr(a) + '">' +
        '<span style="opacity:.6;font-size:.78em">' + escapeHTML(a.toUpperCase()) + '</span>' +
        '<span> — ' + escapeHTML(tx) + '</span>' +
        '</div>';
    }).join('');

    target.appendChild(w);
    if (typeof target.scrollTop === 'number') target.scrollTop = target.scrollHeight;

    LOG.ok('Motor -> Chat injected');
  };

  /* =========================================================
   * SESSION FRAME
   * ========================================================= */
  function createSessionFrame(sel, urls) {
    const c = document.querySelector(sel);
    if (!c) return null;

    urls = Array.isArray(urls) ? urls : [];
    const f = document.createElement('iframe');
    f.id = 'kblx-session-frame';
    f.style.cssText = 'width:100%;height:100%;border:none;background:transparent;border-radius:12px;transition:opacity .22s ease';

    let idx = 0;
    let visible = true;

    const setVisible = function (state) {
      visible = !!state;
      f.style.opacity = visible ? '1' : '0';
      f.style.pointerEvents = visible ? '' : 'none';
    };

    const nav = function (url) {
      if (!url) return;
      setVisible(false);
      setTimeout(function () {
        f.src = url;
        localStorage.setItem(KBLX_LS.CURRENT_SESSION, url);
        setVisible(true);
      }, 120);
    };

    const next = function () {
      if (!urls.length) return;
      idx = (idx + 1) % urls.length;
      nav(urls[idx]);
    };

    const prev = function () {
      if (!urls.length) return;
      idx = (idx - 1 + urls.length) % urls.length;
      nav(urls[idx]);
    };

    c.addEventListener('dblclick', function (e) {
      e.preventDefault();
      if (navigator.vibrate) navigator.vibrate(12);

      if (urls.length > 1) {
        next();
        return;
      }

      setVisible(!visible);
    });

    if (urls.length) nav(urls[0]);
    else {
      const s = localStorage.getItem(KBLX_LS.CURRENT_SESSION);
      if (s) nav(s);
    }

    c.appendChild(f);

    return {
      navigate: nav,
      next: next,
      prev: prev,
      toggle: function () { setVisible(!visible); },
      frame: f,
    };
  }

  /* =========================================================
   * Fallback editor / quick panel / motor dock
   * ========================================================= */
  function latestSpeakableText() {
    const root = qsAny(HOST.responseList);
    if (!root) return '';

    const blocks = root.querySelectorAll('.response-block');
    if (!blocks || !blocks.length) return '';

    return Array.from(blocks).map(function (block) {
      if (!block) return '';

      const clone = block.cloneNode(true);
      clone.querySelectorAll('.send-to-motor-btn,button,.symbol-btn,.symbol-button,.copy-btn,.delete-btn,[data-exclude-from-motor="1"]')
        .forEach(function (el) { el.remove(); });

      return (clone.innerText || clone.textContent || '').trim();
    }).filter(Boolean).join('\n\n---\n\n');
  }

  function getCurrentArchFromBlock(block) {
    if (!block) return null;

    const arch = block.dataset ? (block.dataset.archetype || block.dataset.arch) : '';
    if (arch) return String(arch).trim();

    const active = localStorage.getItem(KBLX_LS.ARCH_ACTIVE) ||
      localStorage.getItem('archTypeActive') ||
      localStorage.getItem('archetype_active');

    return active || null;
  }

  function ensureMotorSrc() {
    const frame = qsAny(HOST.motorFrame);
    if (!frame) return null;

    if (!window.MOTOR_HTML || typeof window.MOTOR_HTML !== 'string' || !window.MOTOR_HTML.trim()) {
      LOG.warn('MOTOR_HTML empty; waiting for cache load');
      return null;
    }

    try {
      if (!window.__kblx_motor_blob_url) {
        const blob = new Blob([window.MOTOR_HTML], { type: 'text/html;charset=utf-8' });
        window.__kblx_motor_blob_url = URL.createObjectURL(blob);
      }
      frame.src = window.__kblx_motor_blob_url;
      return window.__kblx_motor_blob_url;
    } catch (err) {
      LOG.err('blob create failed, using srcdoc');
      try { frame.srcdoc = window.MOTOR_HTML; } catch (e) {}
      return null;
    }
  }

  let pendingMotorPayload = null;
  let motorReady = false;

  function flushMotorPayload() {
    const frame = qsAny(HOST.motorFrame);
    if (!frame || !frame.contentWindow || !pendingMotorPayload) return;

    try {
      frame.contentWindow.postMessage({ type: 'kdx-motor-load', payload: pendingMotorPayload }, '*');
      pendingMotorPayload = null;
    } catch (e) {
      LOG.warn('flushMotorPayload failed');
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

  function openMotorDock(payload, opts) {
    const dock = qsAny(HOST.motorDock);
    const frame = qsAny(HOST.motorFrame);

    if (!dock || !frame) {
      LOG.warn('motorDock/motorFrame not found');
      return;
    }

    ensureMotorSrc();
    dock.hidden = false;
    document.body.classList.add('motor-mode');

    const state = qsAny(HOST.footerHint);
    if (state) state.textContent = opts && opts.localOnly ? 'local mode' : 'motor mode ready';

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

  function wireBlockMotorButtons() {
    const root = qsAny(HOST.responseList);
    if (!root || root.dataset.motorButtonsWired === '1') return;

    root.dataset.motorButtonsWired = '1';

    const obs = new MutationObserver(function () {
      qsaAny(['.response-block'], root).forEach(function (block) {
        if (block.querySelector('.send-to-motor-btn')) return;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'send-to-motor-btn';
        btn.textContent = '78K';

        on(btn, 'click', function (ev) {
          ev.stopPropagation();
          const text = (block.innerText || block.textContent || '').trim();
          if (!text) return;

          const arch = getCurrentArchFromBlock(block) || localStorage.getItem(KBLX_LS.ARCH_ACTIVE) || 'kodux';
          openMotorDock(null, { localOnly: false });
          sendToMotor({ type: 'kdx-motor-load', text: text, arch: arch, cycle: true, run: true });

          const hint = qsAny(HOST.footerHint);
          if (hint) hint.textContent = 'message sent to motor 78K';
        });

        block.appendChild(btn);
      });
    });

    obs.observe(root, { childList: true, subtree: true });
  }

  function wireMotorToggle() {
    const btn = qsAny(HOST.toggleMotorBtn);
    if (btn && btn.dataset.wired !== '1') {
      btn.dataset.wired = '1';
      on(btn, 'click', function (ev) {
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
      on(dockClose, 'click', function () { closeMotorDock(); });
    }

    let longPressTimer = null;
    let longPressFired = false;
    const star = qsAny(HOST.motorModeToggle);

    if (star && star.dataset.wired !== '1') {
      star.dataset.wired = '1';

      on(star, 'click', function (ev) {
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

      on(star, 'pointerdown', function () {
        longPressFired = false;
        clearTimeout(longPressTimer);

        longPressTimer = setTimeout(function () {
          longPressFired = true;

          openMotorDock({
            type: 'kdx-motor-load',
            text: latestSpeakableText(),
            arch: localStorage.getItem(KBLX_LS.ARCH_ACTIVE) || 'kodux',
            cycle: false,
            run: false
          }, { localOnly: true, keepOpen: true });

          const hint = qsAny(HOST.footerHint);
          if (hint) hint.textContent = 'local mode active';
        }, 520);
      });

      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) {
        on(star, ev, function () { clearTimeout(longPressTimer); });
      });
    }

    window.addEventListener('message', function (ev) {
      const d = ev && ev.data ? ev.data : null;
      if (!d) return;

      if (d.type === 'kdx-motor-ready') {
        motorReady = true;
        flushMotorPayload();
        const hint = qsAny(HOST.footerHint);
        if (hint) hint.textContent = 'motor ready';
        return;
      }

      if (d.type === 'kdx-motor-result' && typeof d.result === 'string') {
        localStorage.setItem(KBLX_LS.RENDER_LIST, d.result);
        return;
      }
    });
  }

  function applyAriaStates() {
    const dock = qsAny(HOST.motorDock);
    const btn = qsAny(HOST.toggleMotorBtn);
    const star = qsAny(HOST.motorModeToggle);

    if (dock && btn) btn.setAttribute('aria-pressed', dock.hidden ? 'false' : 'true');
    if (star) star.classList.toggle('kdx-motor-armed', !dock || !dock.hidden);
  }

  function wireEngineControlsFallback() {
    const genBtn = qsAny(HOST.engineGenBtn);
    const input = qsAny(HOST.engineInput);
    const startArch = qsAny(HOST.engineStartArch);
    const cycleMode = qsAny(HOST.engineCycleMode);
    const reverseBtn = qsAny(HOST.engineReverse);

    if (!genBtn) return;

    if (genBtn.dataset.wired !== '1') {
      genBtn.dataset.wired = '1';
      on(genBtn, 'click', function () {
        const payload = {
          text: input && typeof input.value === 'string' ? input.value : '',
          arch: (startArch && startArch.value) || 'kodux',
          cycle: !!(cycleMode && cycleMode.checked),
          reverse: reverseBtn ? /ON/.test(reverseBtn.textContent || '') : false,
          run: true
        };
        openMotorDock(payload, { keepOpen: true });
      });
    }
  }

  function longPressEditor() {
    const back = byIdOrFallback(['kblx-back', 'kdx-back']);
    const panel = byIdOrFallback(['kblx-panel', 'kdx-panel']);
    const inp = byIdOrFallback(['kblx-inp', 'kdx-inp']);
    const ttl = byIdOrFallback(['kblx-ttl', 'kdx-ttl']);
    const save = byIdOrFallback(['kblx-btn-save', 'kdx-btn-save']);
    const close = byIdOrFallback(['kblx-btn-close', 'kdx-btn-close']);

    if (!back || !panel) return;

    on(back, 'click', function (e) {
      if (e.target === back) back.classList.remove('is-open');
    });

    on(close, 'click', function () { back.classList.remove('is-open'); });

    on(save, 'click', function () {
      const btn = window._kblxState && window._kblxState.currentBtn || window._kblxCurrentBtn;
      if (!btn || !inp) return;

      const val = (inp.value || '').trim();
      if (val) {
        btn.dataset.url = val;
        try { btn.title = btn.title || (new URL(val, location.href)).pathname; } catch (e) {}
        saveSession(btn, 'edit');
        LOG.ok('route saved: ' + val);
      }

      back.classList.remove('is-open');
    });

    qsaAny(['.symbol-button', '.symbol-btn']).forEach(_attachLongPress);

    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          if (n.nodeType !== 1) return;
          if (n.matches && (n.matches('.symbol-button') || n.matches('.symbol-btn'))) _attachLongPress(n);
          if (n.querySelectorAll) qsaAny(['.symbol-button', '.symbol-btn'], n).forEach(_attachLongPress);
        });
      });
    }).observe(document.body, { childList: true, subtree: true });

    function _attachLongPress(btn) {
      if (!btn || btn.dataset.kblxLp) return;
      btn.dataset.kblxLp = '1';

      let timer;

      on(btn, 'pointerdown', function () {
        timer = setTimeout(function () {
          window._kblxState = window._kblxState || {};
          window._kblxState.currentBtn = btn;
          window._kblxCurrentBtn = btn;

          if (window.kblxOpenPanel) {
            window.kblxOpenPanel(btn);
            return;
          }

          if (ttl) ttl.textContent = btn.title || 'Button';
          if (inp) inp.value = btn.dataset.url || '';
          if (back) back.classList.add('is-open');
        }, 600);
      });

      on(btn, 'pointerup', function () { clearTimeout(timer); });
      on(btn, 'pointermove', function () { clearTimeout(timer); });
      on(btn, 'pointercancel', function () { clearTimeout(timer); });
    }

    LOG.ok('long-press editor active');
  }

  /* =========================================================
   * BOOT
   * ========================================================= */
  function boot() {
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
      on(frame, 'load', function () {
        setTimeout(flushMotorPayload, 150);
      });
    }

    const api = {
      LS: KBLX_LS,
      sync: koblluxSync,
      motorToChat: window.motorToChat,
      openPanel: window.kblxOpenPanel,
      createSessionFrame: createSessionFrame,
      saveSession: saveSession,
      restoreSessions: restoreSessions,
      openMotorDock: openMotorDock,
      closeMotorDock: closeMotorDock,
      toggleMotorDock: toggleMotorDock,
      sendToMotor: sendToMotor,
      ensureMotorSrc: ensureMotorSrc,
      version: 'delta7',
      law: 'VERDADE x INTEGRAR / INFINITY'
    };

    window.KOBLLUX = Object.assign(window.KOBLLUX || {}, api);
    window.KOBLLUX_BRIDGE = window.KOBLLUX;
    window.KOBLLUX_DOCK = window.KOBLLUX;

    LOG.ok('syncronizado! mas tu n tem log de quantos ahahhahaunified namespace ready');
    
  }

  /* =========================================================
   * INIT FLOW
   * ========================================================= */
  function start() {
    ensureUnifiedNamespace();

    loadMotorHtml(MOTOR_BRIDGE_URL).then(function () {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot, { once: true });
      } else {
        boot();
      }
    });
  }

  start();

})();
