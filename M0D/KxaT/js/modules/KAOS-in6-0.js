
(async function(){

  const CACHE='KDX_m0d78k_HTML';

  try{

    let m0d78k=localStorage.getItem(CACHE);

    if(!m0d78k){

      console.log('[KOBLLUX] baixando Motor 78K...');

      m0d78k=await fetch(
        'https://kodux78k.github.io/oiDual--Y-/M0D/78K-motor/index.html'
      ).then(r=>r.text());

      localStorage.setItem(
        CACHE,
        m0d78k
      );

      console.log('[KOBLLUX] motor salvo em cache ✔');

    }else{

      console.log(
        '[KOBLLUX] motor carregado do cache ⚡'
      );

    }

    // disponibiliza globalmente
    window.MOTOR_HTML=m0d78k;

    // sinal opcional para outros módulos
    window.dispatchEvent(
      new CustomEvent(
        'kdx:motor-ready',
        {
          detail:{
            size:m0d78k.length
          }
        }
      )
    );

  }catch(err){

    console.error(
      '[KOBLLUX] erro carregando MOTOR_HTML',
      err
    );

  }

})();

  
  (function KOBLLUX_UNIFIED_FALLBACK() {

  'use strict';

  if (window.__KBLX_UNIFIED_FALLBACK__) return;

  window.__KBLX_UNIFIED_FALLBACK__ = true;

  // =========================

  // Selector fallback helpers

  // =========================

  function qsAny(selectors, root) {

    root = root || document;

    if (!selectors) return null;

    if (typeof selectors === 'string') selectors = [selectors];

    for (var i = 0; i < selectors.length; i++) {

      try {

        var el = root.querySelector(selectors[i]);

        if (el) return el;

      } catch (e) {}

    }

    return null;

  }

  function qsaAny(selectors, root) {

    root = root || document;

    var out = [];

    if (!selectors) return out;

    if (typeof selectors === 'string') selectors = [selectors];

    selectors.forEach(function (sel) {

      try {

        var list = root.querySelectorAll(sel);

        if (list && list.length) out = out.concat(Array.from(list));

      } catch (e) {}

    });

    return Array.from(new Set(out));

  }

  function byIdOrFallback(ids, root) {

    root = root || document;

    if (!ids) return null;

    if (typeof ids === 'string') ids = [ids];

    for (var i = 0; i < ids.length; i++) {

      var el = root.getElementById ? root.getElementById(ids[i]) : null;

      if (el) return el;

    }

    return null;

  }

  function on(el, ev, fn, opts) {

    if (!el || !el.addEventListener) return;

    el.addEventListener(ev, fn, opts || false);

  }

  // =========================

  // Host / UI fallback ids

  // =========================

  var HOST = {

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

  // =========================

  // Session / persistence

  // =========================

  var KDX_SESSIONS = 'KDX_SESSIONS';

  var motorUrl = null;

  var motorReady = false;

  var pendingMotorPayload = null;

  var longPressTimer = null;

  var longPressFired = false;

  function safeJSONParse(raw, fallback) {

    try { return JSON.parse(raw); } catch (e) { return fallback; }

  }

  function saveSession(btn, type) {

    if (!btn) return;

    var url = (btn.dataset && btn.dataset.url) || btn.getAttribute('href') || '';

    var title = btn.title || (btn.dataset && btn.dataset.label) || btn.textContent && btn.textContent.trim() || url;

    if (!url) return;

    var id = btn.id || ('kblx-' + Date.now());

    if (!btn.id) btn.id = id;

    var s = safeJSONParse(localStorage.getItem(KDX_SESSIONS) || '{}', {});

    s[id] = { url: url, title: title, type: type, ts: Date.now() };

    localStorage.setItem(KDX_SESSIONS, JSON.stringify(s));

  }

  function restoreSessions() {

    var s = safeJSONParse(localStorage.getItem(KDX_SESSIONS) || '{}', {});

    var n = 0;

    Object.keys(s).forEach(function (id) {

      var rec = s[id] || {};

      var btn = document.getElementById(id);

      if (btn && !btn.dataset.url && rec.url) {

        btn.dataset.url = rec.url;

        if (rec.title) btn.title = rec.title;

        n++;

      }

    });

    if (n) console.log('[KBLX] ' + n + ' sessão(ões) restaurada(s)');

  }

  // =========================

  // Deduplicate scripts

  // =========================

  function deduplicateScripts() {

    var seen = new Set();

    var removed = 0;

    document.querySelectorAll('script[src]').forEach(function (el) {

      var src = el.src;

      if (seen.has(src)) {

        el.remove();

        removed++;

      } else {

        seen.add(src);

      }

    });

    if (removed) console.log('[KBLX] ' + removed + ' scripts duplicados removidos');

  }

  // =========================

  // Idle dock

  // =========================

  function idleDock() {

    var dock = qsAny(HOST.symbolBar);

    if (!dock) return;

    if (!document.getElementById('kblx-idle-css')) {

      var s = document.createElement('style');

      s.id = 'kblx-idle-css';

      s.textContent =

        '.kob-tts-dock,.symbol-bar,#hudBar{transition:transform .35s ease,opacity .65s ease}' +

        '.kob-tts-dock.idle,.symbol-bar.idle,#hudBar.idle{opacity:.18;transform:scale(.92)}' +

        '.kob-tts-dock:hover,.symbol-bar:hover,#hudBar:hover{opacity:1 !important;transform:scale(1) !important}';

      document.head.appendChild(s);

    }

    var idleTimer;

    function resetIdle() {

      dock.classList.remove('idle');

      clearTimeout(idleTimer);

      idleTimer = setTimeout(function () { dock.classList.add('idle'); }, 1870);

    }

    ['pointerdown', 'pointermove', 'touchstart', 'mousemove'].forEach(function (ev) {

      document.addEventListener(ev, resetIdle, { passive: true });

    });

    resetIdle();

    console.log('[KBLX] Idle dock ativo');

  }

  // =========================

  // Presets / symbol injection

  // =========================

  if (!window.applyPreset) {

    window.applyPreset = function (btn, type) {

      if (!btn) return;

      var url = (btn.dataset && btn.dataset.url) || btn.getAttribute('href') || '';

      var label = (btn.dataset && btn.dataset.label) || btn.title || '';

      var frame = qsAny(['#cadial-frame', '#content-frame', 'iframe.kblx-frame', '#motorFrame', '#kdx-motor-frame']);

      var bar = qsAny(HOST.symbolBar);

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

  function addBtnToBar(bar, url, title) {

    if (!bar) return null;

    var b = document.createElement('button');

    b.className = 'symbol-button symbol-btn';

    b.title = title || url;

    b.dataset.url = url;

    b.textContent = (title || url).charAt(0).toUpperCase() || '◉';

    on(b, 'pointerdown', function () {

      var t = setTimeout(function () {

        if (window.kblxOpenPanel) window.kblxOpenPanel(b);

      }, 500);

      on(b, 'pointerup', function () { clearTimeout(t); }, { once: true });

      on(b, 'pointermove', function () { clearTimeout(t); }, { once: true });

    });

    var anchor = qsAny(['.hud-info', '#hudStatus', '#hudInfo'], bar);

    if (anchor && anchor.parentNode) {

      anchor.parentNode.insertBefore(b, anchor);

    } else {

      bar.appendChild(b);

    }

    saveSession(b, 'symbol');

    return b;

  }

  // =========================

  // Long press editor

  // =========================

  function longPressEditor() {

    var back = byIdOrFallback(['kblx-back', 'kdx-back']);

    var panel = byIdOrFallback(['kblx-panel', 'kdx-panel']);

    var inp = byIdOrFallback(['kblx-inp', 'kdx-inp']);

    var ttl = byIdOrFallback(['kblx-ttl', 'kdx-ttl']);

    var save = byIdOrFallback(['kblx-btn-save', 'kdx-btn-save']);

    var close = byIdOrFallback(['kblx-btn-close', 'kdx-btn-close']);

    if (!back || !panel) return;

    on(back, 'click', function (e) {

      if (e.target === back) back.classList.remove('is-open');

    });

    on(close, 'click', function () { back.classList.remove('is-open'); });

    on(save, 'click', function () {

      var btn = window._kblxState && window._kblxState.currentBtn || window._kblxCurrentBtn;

      if (!btn || !inp) return;

      var val = (inp.value || '').trim();

      if (val) {

        btn.dataset.url = val;

        try { btn.title = btn.title || (new URL(val, location.href)).pathname; } catch (e) {}

        saveSession(btn, 'edit');

        console.log('[KBLX] Rota salva: ' + val);

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

    console.log('[KBLX] Long-press editor ativo');

  }

  function _attachLongPress(btn) {

    if (!btn || btn.dataset.kblxLp) return;

    btn.dataset.kblxLp = '1';

    var timer;

    on(btn, 'pointerdown', function () {

      timer = setTimeout(function () {

        window._kblxState = window._kblxState || {};

        window._kblxState.currentBtn = btn;

        window._kblxCurrentBtn = btn;

        if (window.kblxOpenPanel) {

          window.kblxOpenPanel(btn);

          return;

        }

        var ttl = byIdOrFallback(['kblx-ttl', 'kdx-ttl']);

        var inp = byIdOrFallback(['kblx-inp', 'kdx-inp']);

        var back = byIdOrFallback(['kblx-back', 'kdx-back']);

        if (ttl) ttl.textContent = btn.title || 'Botão';

        if (inp) inp.value = btn.dataset.url || '';

        if (back) back.classList.add('is-open');

      }, 600);

    });

    on(btn, 'pointerup', function () { clearTimeout(timer); });

    on(btn, 'pointermove', function () { clearTimeout(timer); });

    on(btn, 'pointercancel', function () { clearTimeout(timer); });

  }

  // =========================

  // Quick panel

  // =========================

  function installQuickPanel() {

    if (document.getElementById('kblx-quick')) return;

    var style = document.createElement('style');

    style.textContent =

      '#kblx-quick{position:fixed;display:none;z-index:999999;min-width:220px;padding:8px;border-radius:22px;background:rgba(20,20,30,.92);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.08);box-shadow:0 15px 45px rgba(0,0,0,.35);animation:kblxPop .18s ease}' +

      '#kblx-quick.open{display:block}' +

      '.kq-item{width:100%;border:0;background:transparent;color:#fff;padding:14px;border-radius:14px;display:flex;align-items:center;gap:12px;font-size:.92rem;text-align:left;cursor:pointer}' +

      '.kq-item:hover{background:rgba(255,255,255,.08)}' +

      '@keyframes kblxPop{from{opacity:0;transform:translateY(10px) scale(.95)}to{opacity:1;transform:translateY(0) scale(1)}}';

    document.head.appendChild(style);

    var panel = document.createElement('div');

    panel.id = 'kblx-quick';

    panel.innerHTML =

      '<button class="kq-item" data-kq="edit">✦ Editar rota</button>' +

      '<button class="kq-item" data-kq="symbol">◉ SymbolBar</button>' +

      '<button class="kq-item" data-kq="frame">⟁ Frame</button>' +

      '<button class="kq-item" data-kq="dock">⌘ Dock</button>' +

      '<button class="kq-item" data-kq="full">⋯ Mais opções</button>';

    document.body.appendChild(panel);

    window._kblxState = window._kblxState || {};

    window.kblxOpenPanel = function (btn) {

      if (!btn) return;

      window._kblxState.currentBtn = btn;

      window._kblxCurrentBtn = btn;

      if (navigator.vibrate) navigator.vibrate(12);

      var r = btn.getBoundingClientRect();

      var l = r.left + r.width / 2 - 110;

      l = Math.max(10, Math.min(l, window.innerWidth - 230));

      var t = r.top > 300 ? r.top - 270 : r.bottom + 8;

      panel.style.left = l + 'px';

      panel.style.top = t + 'px';

      panel.classList.add('open');

    };

    on(document, 'click', function (e) {

      if (!panel.contains(e.target) && !e.target.closest('.symbol-button,.symbol-btn')) {

        panel.classList.remove('open');

      }

      var item = e.target.closest('[data-kq]');

      if (!item) return;

      var btn = window._kblxState && window._kblxState.currentBtn;

      if (!btn) return;

      panel.classList.remove('open');

      var action = item.dataset.kq;

      if (action === 'full') {

        var ttl = byIdOrFallback(['kblx-ttl', 'kdx-ttl']);

        var inp = byIdOrFallback(['kblx-inp', 'kdx-inp']);

        var back = byIdOrFallback(['kblx-back', 'kdx-back']);

        if (ttl) ttl.textContent = btn.title || 'Botão';

        if (inp) inp.value = btn.dataset.url || '';

        if (back) back.classList.add('is-open');

        return;

      }

      if (action === 'edit') {

        byIdOrFallback(['kblx-inp', 'kdx-inp']) && byIdOrFallback(['kblx-inp', 'kdx-inp']).focus();

        byIdOrFallback(['kblx-back', 'kdx-back']) && byIdOrFallback(['kblx-back', 'kdx-back']).classList.add('is-open');

        return;

      }

      window.applyPreset && window.applyPreset(btn, action);

    });

    console.log('[KBLX] #kblx-quick instalado');

  }

  // =========================

  // FusionCard / main card fix

  // =========================

  function fixFusionCard() {

    var fc = qsAny(HOST.mainCard);

    if (!fc) return;

    var header = qsAny(HOST.mainCardHeader, fc);

    if (!header) return;

    on(header, 'click', function () {

      var collapsed = fc.classList.contains('is-collapsed');

      var orb = qsAny(['#orbDragRender', '.orb-drag', '#kdx-orb']);

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

    console.log('[KBLX] FusionCard fix ativo');

  }

  // =========================

  // OpenRouter patch

  // =========================

  function patchOpenRouter() {

    var OR = 'openrouter.ai/api/v1/chat/completions';

    if (window.__kblx_or_patched) return;

    window.__kblx_or_patched = true;

    var _f = window.fetch.bind(window);

    window.fetch = async function (url, opts) {

      if (typeof url === 'string' && url.includes(OR)) {

        var key = localStorage.getItem('openrouter_api_key') || '';

        opts = Object.assign({}, opts, {

          headers: Object.assign({

            'Authorization': 'Bearer ' + key,

            'HTTP-Referer': location.href,

            'X-Title': 'KOBLLUX DUAL',

            'Content-Type': 'application/json'

          }, (opts && opts.headers) || {})

        });

        for (var i = 1; i <= 3; i++) {

          var ctrl = new AbortController();

          var t = setTimeout(function () { ctrl.abort(); }, 30000);

          try {

            var r = await _f(url, Object.assign({}, opts, { signal: ctrl.signal }));

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

    console.log('[KBLX] OpenRouter patch ativo');

  }

  // =========================

  // File attach

  // =========================

  function fileAttach() {

    var sendBtn = qsAny(HOST.sendBtn);

    if (!sendBtn || document.getElementById('chatFileInput')) return;

    var fi = document.createElement('input');

    fi.type = 'file';

    fi.id = 'chatFileInput';

    fi.accept = '.txt,.md,.json,.html,.css,.js,.py';

    fi.style.display = 'none';

    document.body.appendChild(fi);

    var clip = document.createElement('button');

    clip.type = 'button';

    clip.title = 'Anexar arquivo';

    clip.style.cssText = 'background:transparent;border:none;color:var(--kob-voice-primary,#0cf);font-size:1.2rem;cursor:pointer;padding:0 8px;opacity:.7;';

    clip.textContent = '📎';

    if (sendBtn.parentNode) sendBtn.parentNode.insertBefore(clip, sendBtn);

    on(clip, 'click', function () { fi.click(); });

    on(fi, 'change', function () {

      var file = fi.files && fi.files[0];

      if (!file) return;

      var reader = new FileReader();

      reader.onload = function (e) {

        var inp = qsAny(HOST.userInput);

        if (inp) {

          var prev = (inp.value || '').trim();

          inp.value = '[ARQUIVO: ' + file.name + ']\n```\n' + String(e.target.result || '').slice(0, 6000) + '\n```\n' + (prev ? '\n' + prev : '');

        }

        fi.value = '';

      };

      reader.readAsText(file);

    });

    console.log('[KBLX] File attach ativo');

  }

  // =========================

  // Motor bridge

  // =========================

  window.motorToChat = function (sel) {

    sel = sel || '#responseList';

    var stored = localStorage.getItem('kobllux_last_result');

    if (!stored) return;

    var target = document.querySelector(sel);

    if (!target) return;

    var w = document.createElement('div');

    w.className = 'response-block motor-inject-block';

    w.dataset.src = '78k-motor';

    w.innerHTML = stored.trim().split('\n\n').filter(Boolean).map(function (l) {

      var d = l.indexOf(' — ');

      if (d === -1) return '<div class="motor-frag">' + escapeHTML(l) + '</div>';

      var a = l.slice(0, d).trim().toLowerCase();

      var tx = l.slice(d + 3).trim();

      return '<div class="motor-frag" data-arch="' + escapeAttr(a) + '"><span style="opacity:.6;font-size:.78em">' + escapeHTML(a.toUpperCase()) + '</span><span> — ' + escapeHTML(tx) + '</span></div>';

    }).join('');

    target.appendChild(w);

    if (typeof target.scrollTop === 'number') target.scrollTop = target.scrollHeight;

    console.log('[KBLX] Motor → Chat injetado');

  };

  function escapeHTML(str) {

    return String(str).replace(/[&<>"']/g, function (m) {

      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m];

    });

  }

  function escapeAttr(str) { return escapeHTML(str).replace(/`/g, '&#96;'); }

  // =========================

  // Motor iframe / dock bridge

  // =========================

  function latestSpeakableText() {

    var root = qsAny(HOST.responseList);

    if (!root) return '';

    var blocks = root.querySelectorAll('.response-block');

    if (!blocks || !blocks.length) return '';

    return Array.from(blocks).map(function (block) {

      if (!block) return '';

      var clone = block.cloneNode(true);

      clone.querySelectorAll('.send-to-motor-btn,button,.symbol-btn,.symbol-button,.copy-btn,.delete-btn,[data-exclude-from-motor="1"]')

        .forEach(function (el) { el.remove(); });

      return (clone.innerText || clone.textContent || '').trim();

    }).filter(Boolean).join('\n\n────────\n\n');

  }

  function getCurrentArchFromBlock(block) {

    if (!block) return null;

    var arch = block.dataset ? (block.dataset.archetype || block.dataset.arch) : '';

    if (arch) return String(arch).trim();

    var active = localStorage.getItem('ARCHETYPE_ACTIVE') || localStorage.getItem('archTypeActive') || localStorage.getItem('archetype_active');

    return active || null;

  }

  function ensureMotorSrc() {

    var frame = qsAny(HOST.motorFrame);

    if (!frame) return null;

    if (motorUrl) return motorUrl;

    // Reuse your existing MOTOR_HTML here.

    // If you already have MOTOR_HTML in another file, keep it there and only

    // retain this bridge code.

    if (typeof window.MOTOR_HTML !== 'string' || !window.MOTOR_HTML.trim()) {

      console.warn('[KBLX] window.MOTOR_HTML vazio; motor iframe não pode ser montado aqui.');

      return null;

    }

    try {

      var blob = new Blob([window.MOTOR_HTML], { type: 'text/html;charset=utf-8' });

      motorUrl = URL.createObjectURL(blob);

      frame.src = motorUrl;

      return motorUrl;

    } catch (err) {

      console.error('[KBLX] Falha ao criar blob do motor:', err);

      try {

        frame.srcdoc = window.MOTOR_HTML;

      } catch (e) {}

      return null;

    }

  }

  function openMotorDock(payload, opts) {

    var dock = qsAny(HOST.motorDock);

    var frame = qsAny(HOST.motorFrame);

    if (!dock || !frame) {

      console.warn('[KBLX] motorDock/motorFrame não encontrados. Verifique os IDs de fallback.');

      return;

    }

    ensureMotorSrc();

    dock.hidden = false;

    document.body.classList.add('motor-mode');

    var state = qsAny(HOST.footerHint);

    if (state) state.textContent = opts && opts.localOnly ? 'modo local · eco do espaço mental' : 'modo motor · pronto';

    var btn = qsAny(HOST.toggleMotorBtn);

    if (btn) btn.setAttribute('aria-pressed', 'true');

    if (payload) sendToMotor(payload, opts);

  }

  function closeMotorDock() {

    var dock = qsAny(HOST.motorDock);

    var btn = qsAny(HOST.toggleMotorBtn);

    if (dock) dock.hidden = true;

    document.body.classList.remove('motor-mode');

    if (btn) btn.setAttribute('aria-pressed', 'false');

  }

  function toggleMotorDock(payload, opts) {

    var dock = qsAny(HOST.motorDock);

    if (!dock) return;

    if (dock.hidden) openMotorDock(payload, opts);

    else closeMotorDock();

  }

  function flushMotorPayload() {

    var frame = qsAny(HOST.motorFrame);

    if (!frame || !frame.contentWindow || !pendingMotorPayload) return;

    try {

      frame.contentWindow.postMessage({ type: 'kdx-motor-load', payload: pendingMotorPayload }, '*');

      pendingMotorPayload = null;

    } catch (e) {

      console.warn('[KBLX] flushMotorPayload failed', e);

    }

  }

  function sendToMotor(payload, opts) {

    var frame = qsAny(HOST.motorFrame);

    if (!frame) return;

    ensureMotorSrc();

    pendingMotorPayload = payload || {};

    if (motorReady) flushMotorPayload();

    if (opts && opts.keepOpen) {

      openMotorDock(null, opts);

    }

  }

  function wireBlockMotorButtons() {

    var root = qsAny(HOST.responseList);

    if (!root || root.dataset.motorButtonsWired === '1') return;

    root.dataset.motorButtonsWired = '1';

    var obs = new MutationObserver(function () {

      qsaAny(['.response-block'], root).forEach(function (block) {

        if (block.querySelector('.send-to-motor-btn')) return;

        var btn = document.createElement('button');

        btn.type = 'button';

        btn.className = 'send-to-motor-btn';

        btn.textContent = '↗78K';

        on(btn, 'click', function (ev) {

          ev.stopPropagation();

          var text = (block.innerText || block.textContent || '').trim();

          if (!text) return;

          var arch = getCurrentArchFromBlock(block) || localStorage.getItem('ARCHETYPE_ACTIVE') || 'kodux';

          openMotorDock(null, { localOnly: false });

          sendToMotor({ type: 'kdx-motor-load', text: text, arch: arch, cycle: true, run: true });

          var hint = qsAny(HOST.footerHint);

          if (hint) hint.textContent = 'Mensagem enviada ao motor 78K.';

        });

        block.appendChild(btn);

      });

    });

    obs.observe(root, { childList: true, subtree: true });

  }

  function wireMotorToggle() {

    var btn = qsAny(HOST.toggleMotorBtn);

    if (btn && btn.dataset.wired !== '1') {

      btn.dataset.wired = '1';

      on(btn, 'click', function (ev) {

        ev.preventDefault();

        ev.stopPropagation();

        toggleMotorDock({

          text: latestSpeakableText(),

          arch: localStorage.getItem('ARCHETYPE_ACTIVE') || 'kodux',

          cycle: true,

          run: true

        }, { keepOpen: true });

      });

    }

    var dockClose = qsAny(HOST.motorDockClose);

    if (dockClose && dockClose.dataset.wired !== '1') {

      dockClose.dataset.wired = '1';

      on(dockClose, 'click', function () { closeMotorDock(); });

    }

    var star = qsAny(HOST.motorModeToggle);

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

          arch: localStorage.getItem('ARCHETYPE_ACTIVE') || 'kodux',

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

            arch: localStorage.getItem('ARCHETYPE_ACTIVE') || 'kodux',

            cycle: false,

            run: false

          }, { localOnly: true, keepOpen: true });

          var hint = qsAny(HOST.footerHint);

          if (hint) hint.textContent = 'Modo local ativado: o motor apenas ecoa a leitura.';

        }, 520);

      });

      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (ev) {

        on(star, ev, function () { clearTimeout(longPressTimer); });

      });

    }

  }

  function applyAriaStates() {

    var dock = qsAny(HOST.motorDock);

    var btn = qsAny(HOST.toggleMotorBtn);

    var star = qsAny(HOST.motorModeToggle);

    if (dock && btn) btn.setAttribute('aria-pressed', dock.hidden ? 'false' : 'true');

    if (star) star.classList.toggle('kdx-motor-armed', !dock || !dock.hidden);

  }

  window.addEventListener('message', function (ev) {

    var d = ev && ev.data ? ev.data : null;

    if (!d) return;

    if (d.type === 'kdx-motor-ready') {

      motorReady = true;

      flushMotorPayload();

      var hint = qsAny(HOST.footerHint);

      if (hint) hint.textContent = 'Motor 78K USE•TRANSFORME•DEVOLVA';

      return;

    }

    if (d.type === 'kdx-motor-result' && typeof d.result === 'string') {

      localStorage.setItem('kobllux_last_result', d.result);

      return;

    }

  });

  function wireEngineControlsFallback() {

    var genBtn = qsAny(HOST.engineGenBtn);

    var input = qsAny(HOST.engineInput);

    var startArch = qsAny(HOST.engineStartArch);

    var cycleMode = qsAny(HOST.engineCycleMode);

    var reverseBtn = qsAny(HOST.engineReverse);

    if (!genBtn) return;

    if (genBtn.dataset.wired !== '1') {

      genBtn.dataset.wired = '1';

      on(genBtn, 'click', function () {

        var payload = {

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

    var frame = qsAny(HOST.motorFrame);

    if (frame) {

      on(frame, 'load', function () {

        setTimeout(flushMotorPayload, 150);

      });

    }

    applyAriaStates();

    window.KOBLLUX_DOCK = {

      applyPreset: window.applyPreset,

      openPanel: window.kblxOpenPanel,

      motorToChat: window.motorToChat,

      saveSession: saveSession,

      openMotorDock: openMotorDock,

      closeMotorDock: closeMotorDock,

      toggleMotorDock: toggleMotorDock,

      sendToMotor: sendToMotor,

      version: '∆7-fallback',

      law: 'VERDADE × INTEGRAR ÷ Δ = ∞'

    };

    console.log('[KBLX] unified fallback bridge pronto');

  }

  function startWhenReady(){

  if(
    typeof window.MOTOR_HTML==='string' &&
    window.MOTOR_HTML.trim()
  ){
      boot();
      return;
  }

  window.addEventListener(
    'kdx:motor-ready',
    function(){

      console.log(
        '[KBLX] MOTOR_HTML recebido ✔'
      );

      boot();

    },
    {once:true}
  );

}

if(document.readyState==='loading'){

   document.addEventListener(
      'DOMContentLoaded',
      startWhenReady
   );

}else{

   startWhenReady();

}
})();
