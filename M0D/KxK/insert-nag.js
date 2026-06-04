(function(h,s='#inject-here'){const p=new DOMParser(),c=p.parseFromString(h,'text/html'),
  f=document.createDocumentFragment(),
  t=document.querySelector(s)||document.body;Array.from(c.body.childNodes).forEach(n=>f.appendChild(document.importNode(n,true)));t.appendChild(f);
  Array.from(c.querySelectorAll('script')).forEach(x=>{const n=document.createElement('script');for(const a of x.attributes)n.setAttribute(a.name,a.value);
    n.textContent=x.textContent;
    document.body.appendChild(n)})})(`
<body>
 <style>
 :root{
    --nag-bg: rgba(5, 7, 10, .18);
    --nag-panel: rgba(18, 22, 30, .92);
    --nag-line: rgba(255,255,255,.08);
    --nag-text: rgba(255,255,255,.96);
    --nag-dim: rgba(255,255,255,.62);
    --nag-soft: rgba(255,255,255,.06);
    --nag-soft2: rgba(255,255,255,.10);
    --nag-glow: 0 24px 80px rgba(0,0,0,.48);
    --nag-radius: 24px;
  }

  #kblx-back{
    position: fixed;
    right: 16px;
    bottom: 16px;
    display: none;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 0;
    background: transparent;
    z-index: 999999;
    pointer-events: none;
  }

  #kblx-back.is-open{
    display: block;
  }

  #kblx-panel{
    width: min(92vw, 380px);
    border-radius: var(--nag-radius);
    padding: 14px;
    background:
      linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.03)),
      var(--nag-panel);
    border: 1px solid var(--nag-line);
    box-shadow: var(--nag-glow);
    color: var(--nag-text);
    font-family: "Montserrat","Inter",-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    pointer-events: auto;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .kblx-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    gap: 10px;
  }

  .p-chip{
    display:inline-flex;
    align-items:center;
    gap: 8px;
    padding: 7px 11px;
    border-radius: 999px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.06);
    font-size: .72rem;
    letter-spacing: .10em;
    text-transform: uppercase;
    color: var(--nag-text);
    white-space: nowrap;
  }

  .kblx-icon-btn,
  .kblx-preset,
  .kblx-btn{
    border: 0;
    cursor: pointer;
  }

  .kblx-icon-btn{
    width: 40px;
    height: 40px;
    border-radius: 14px;
    background: rgba(255,255,255,.08);
    color: var(--nag-text);
    font-size: 1rem;
    font-weight: 700;
    display:grid;
    place-items:center;
    flex: 0 0 auto;
  }

  .kblx-title-wrap{
    margin-top: 12px;
  }

  .p-title{
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.1;
    font-weight: 800;
    letter-spacing: -.02em;
  }

  .kblx-sub{
    margin: 6px 0 0;
    color: var(--nag-dim);
    font-size: .84rem;
    line-height: 1.35;
  }

  .kblx-current{
    margin-top: 10px;
    padding: 10px 11px;
    border-radius: 14px;
    background: rgba(255,255,255,.045);
    border: 1px solid rgba(255,255,255,.05);
    color: var(--nag-dim);
    font-size: .8rem;
    line-height: 1.35;
    word-break: break-word;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .kblx-section{
    margin-top: 12px;
  }

  .p-lbl{
    display:flex;
    align-items:center;
    gap: 8px;
    margin-bottom: 9px;
    color: var(--nag-dim);
    font-size: .82rem;
    line-height: 1.2;
  }

  .p-lbl code{
    padding: 2px 6px;
    border-radius: 8px;
    background: rgba(255,255,255,.06);
    color: var(--nag-text);
    font-size: .78rem;
  }

  #kblx-inp{
    width: 100%;
    min-height: 46px;
    padding: 12px 13px;
    border: 1px solid rgba(255,255,255,.08);
    outline: none;
    border-radius: 16px;
    background: rgba(255,255,255,.06);
    color: #fff;
    font-size: .92rem;
    font-family: inherit;
    box-sizing: border-box;
  }

  #kblx-inp::placeholder{
    color: rgba(255,255,255,.42);
  }

  #kblx-inp:focus{
    border-color: rgba(255,255,255,.16);
    box-shadow: 0 0 0 3px rgba(255,255,255,.05);
  }

  .kblx-preview{
    margin-top: 9px;
    padding: 10px 11px;
    border-radius: 13px;
    background: rgba(255,255,255,.045);
    border: 1px solid rgba(255,255,255,.05);
    color: var(--nag-dim);
    font-size: .79rem;
    line-height: 1.35;
    word-break: break-word;
  }

  /* MODIFIED: kblx-quick -> kblx-actions to avoid conflicts */
  .kblx-actions{
    display:grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    margin-top: 12px;
  }

  .kblx-btn{
    min-height: 44px;
    border-radius: 14px;
    background: rgba(255,255,255,.10);
    color: var(--nag-text);
    font: inherit;
    font-weight: 700;
    box-shadow: inset 0 1px 0 rgba(255,255,255,.06);
  }

  .kblx-save{ background: rgba(255,255,255,.14); }
  .kblx-inject{ background: rgba(255,255,255,.10); }
  .kblx-frame{ background: rgba(255,255,255,.08); }
  .kblx-clear{ background: rgba(255,255,255,.06); }

  .kblx-more-row{
    display:flex;
    gap: 8px;
    margin-top: 10px;
    flex-wrap: wrap;
  }

  .kblx-mini{
    flex: 1 1 100px;
    min-height: 40px;
    border-radius: 13px;
    background: rgba(255,255,255,.06);
    color: var(--nag-text);
    font: inherit;
    font-weight: 600;
  }

  .kblx-advanced{
    display:none;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(255,255,255,.05);
  }

  #kblx-back.is-advanced .kblx-advanced{
    display:block;
  }

  .kblx-note{
    margin-top: 10px;
    color: rgba(255,255,255,.48);
    font-size: .72rem;
    line-height: 1.35;
  }

  .symbol-button{
    -webkit-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }

  /* NEW: Escala física no ícone quando pressionado */
  .symbol-button.kblx-hold {
    transform: scale(.92);
    transition: .18s;
  }

  .symbol-button .symbol-icon{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    min-width: 1em;
  }

  .di-btn-icon-fallback{
    display:inline-flex;
    align-items:center;
    justify-content:center;
    font-weight:700;
  }

  .di-icon-ready{
    position: relative;
  }

  /* iOS STYLE QUICK MENU CSS */
  #kblx-quick {
    position: fixed;
    display: none;
    z-index: 999999;
    min-width: 220px;
    padding: 8px;
    border-radius: 22px;
    background: rgba(20, 20, 30, .92);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, .08);
    box-shadow: 0 15px 45px rgba(0, 0, 0, .35);
    animation: kblxPop .18s ease;
  }

  /* NEW: Contextual Arrow */
  #kblx-quick::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 50%;
    width: 16px;
    height: 16px;
    background: inherit;
    transform: translateX(-50%) rotate(45deg);
    border-right: 1px solid rgba(255, 255, 255, .08);
    border-bottom: 1px solid rgba(255, 255, 255, .08);
  }

  /* Intelligence: Flip arrow if menu drops below button */
  #kblx-quick.flipped::after {
    bottom: auto;
    top: -8px;
    transform: translateX(-50%) rotate(45deg);
    border-right: none;
    border-bottom: none;
    border-left: 1px solid rgba(255, 255, 255, .08);
    border-top: 1px solid rgba(255, 255, 255, .08);
  }

  #kblx-quick.open {
    display: block;
  }
  .kq-item {
    width: 100%;
    border: 0;
    background: transparent;
    color: #fff;
    padding: 14px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: .92rem;
    text-align: left;
    cursor: pointer;
  }
  .kq-item:active {
    background: rgba(255, 255, 255, .08);
  }
  @keyframes kblxPop {
    from { opacity: 0; transform: translateY(10px) scale(.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
</style>

<div id="kblx-quick">
  <button class="kq-item" data-kq="edit">✦ Editar</button>
  <button class="kq-item" data-kq="symbol">◉ SymbolBar</button>
  <button class="kq-item" data-kq="frame">⟁ Session</button>
  <button class="kq-item" data-kq="dock">⌘ Dock</button>
  <button class="kq-item" data-kq="duplicate">📋 Duplicar</button>
  <button class="kq-item" data-kq="favorite">⭐ Favoritar</button>
  <button class="kq-item" data-kq="full">⋯ Mais</button>
</div>

<div id="kblx-back" aria-hidden="true">
  <div id="kblx-panel">
    <div class="kblx-head">
      <div class="p-chip">⌘ NAGATANAZARE · QUICK ROUTE</div>
      <button class="kblx-icon-btn" id="kblx-btn-close" type="button">✕</button>
    </div>

    <div class="kblx-title-wrap">
      <h2 class="p-title" id="kblx-ttl">Botão</h2>
      <p class="kblx-sub" id="kblx-sub">Escolha rápido, salve e injete sem cobrir a tela.</p>
    </div>

    <div class="kblx-current" id="kblx-current">Nenhuma rota definida.</div>

    <section class="kblx-section">
      <label class="p-lbl" for="kblx-inp">
        Novo valor para <code>data-url</code>
      </label>

      <input id="kblx-inp" type="text" placeholder="arquivo.html  ou  https://..." spellcheck="false" autocomplete="off">
    </section>

    <div class="kblx-actions">
      <button class="kblx-btn kblx-save" id="kblx-btn-save" type="button">Salvar</button>
      <button class="kblx-btn kblx-inject" id="kblx-btn-orb-inject" type="button">SymbolBar</button>
      <button class="kblx-btn kblx-frame" id="kblx-btn-frame" type="button">Session Frame</button>
    </div>

    <div class="kblx-more-row">
      <button class="kblx-mini" id="kblx-btn-more" type="button">Mais</button>
      <button class="kblx-mini" id="kblx-btn-clear" type="button">Limpar</button>
    </div>

    <div class="kblx-advanced" id="kblx-advanced">
      <section class="kblx-section">
        <div class="kblx-note" style="margin-top:0">Presets rápidos</div>
        <div class="kblx-more-row">
          <button class="kblx-mini" type="button" data-orb-preset="orb">◉ Orb</button>
          <button class="kblx-mini" type="button" data-orb-preset="frame">⟁ Frame</button>
          <button class="kblx-mini" type="button" data-orb-preset="dock">⌘ Dock</button>
        </div>
      </section>

      <section class="kblx-section">
        <div class="kblx-note">
          Long press em qualquer <code>.symbol-button[data-url]</code> abre este painel.
        </div>
      </section>
    </div>
  </div>
</div>

<script>
(() => {
  const ENGINE_NAME = 'NAGATANAZARE';
  const CACHE_KEY = 'di_btn_icon_cache_v2';
  const STORAGE_PREFIX = 'symbol_button_';
  const LONG_PRESS_MS = 550;

  const ORB_PRESETS = {
    orb: {
      name: 'Orb',
      icon: '◉',
      mode: 'orb',
      injectTarget: '#symbolBar'
    },
    frame: {
      name: 'Frame',
      icon: '⟁',
      mode: 'special-frame',
      injectTarget: '#session-iframe-embedded .win-frame'
    },
    dock: {
      name: 'Dock',
      icon: '⌘',
      mode: 'dock',
      injectTarget: '#dock'
    }
  };

  const state = {
    currentButton: null,
    longPressTimer: null
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const storageGet = (storage, key) => {
    try {
      const raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const storageSet = (storage, key, value) => {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch {}
  };

  const loadCache = () => storageGet(localStorage, CACHE_KEY) || {};
  const saveCache = (cache) => storageSet(localStorage, CACHE_KEY, cache);

  const cache = loadCache();

  const normKey = (url) => {
    try {
      return new URL(url, location.href).href;
    } catch {
      return String(url || '');
    }
  };

  const storageKeyForBtn = (btn) => {
    if (!btn) return null;
    if (!btn.dataset.storeKey) {
      const seed = btn.id || `nag_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
      btn.dataset.storeKey = seed;
    }
    return `${STORAGE_PREFIX}${btn.dataset.storeKey}`;
  };

  function dispatch(name, detail = {}) {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  }

  async function fetchText(url) {
    const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  }

  async function fetchJSON(url) {
    const res = await fetch(url, { mode: 'cors', credentials: 'omit' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  function pickBestIcon(icons = []) {
    if (!Array.isArray(icons) || !icons.length) return null;

    const parsed = icons
      .map(i => ({
        ...i,
        sizeNum: (() => {
          const m = String(i.sizes || '').match(/(\d+)\s*x\s*(\d+)/i);
          return m ? Math.max(+m[1], +m[2]) : 0;
        })()
      }))
      .sort((a, b) => b.sizeNum - a.sizeNum);

    return (
      parsed.find(i => String(i.sizes || '').includes('192')) ||
      parsed.find(i => i.sizeNum >= 192) ||
      parsed[0] ||
      null
    );
  }

  async function resolveIcon(url) {
    const key = normKey(url);
    if (cache[key]) return cache[key];

    try {
      const base = new URL(key);
      const html = await fetchText(base.href);
      const doc = new DOMParser().parseFromString(html, 'text/html');

      const manifestLink = doc.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        const manifestUrl = new URL(manifestLink.getAttribute('href'), base).href;

        try {
          const manifest = await fetchJSON(manifestUrl);
          const icon = pickBestIcon(manifest?.icons);
          if (icon?.src) {
            const resolved = new URL(icon.src, manifestUrl).href;
            cache[key] = resolved;
            saveCache(cache);
            return resolved;
          }
        } catch {}
      }

      const apple = doc.querySelector('link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]');
      if (apple?.getAttribute('href')) {
        const resolved = new URL(apple.getAttribute('href'), base).href;
        cache[key] = resolved;
        saveCache(cache);
        return resolved;
      }

      const shortcut = doc.querySelector('link[rel="shortcut icon"], link[rel="icon"]');
      if (shortcut?.getAttribute('href')) {
        const resolved = new URL(shortcut.getAttribute('href'), base).href;
        cache[key] = resolved;
        saveCache(cache);
        return resolved;
      }

      const fallback = new URL('/favicon.ico', base).href;
      cache[key] = fallback;
      saveCache(cache);
      return fallback;
    } catch {
      const fallback = (() => {
        try {
          return new URL('/favicon.ico', new URL(key, location.href)).href;
        } catch {
          return null;
        }
      })();

      if (fallback) {
        cache[key] = fallback;
        saveCache(cache);
      }

      return fallback;
    }
  }

  function getAutoIcon(url = '') {
    const u = String(url).toLowerCase();

    if (!u) return '◉';
    if (u.startsWith('http://') || u.startsWith('https://')) return '⇱';
    if (u.includes('youtube')) return '▶';
    if (u.includes('github')) return '⌘';
    if (u.includes('ai')) return '✦';
    if (u.includes('orb')) return '◉';
    if (u.includes('frame')) return '⟁';
    if (u.includes('dock')) return '⌘';
    if (u.endsWith('.html')) return '◈';
    if (/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(u)) return '▣';
    if (/\.(mp4|webm|mov)$/i.test(u)) return '▸';

    return '◉';
  }

  function updatePreview(text) {
    const preview = $('#kblx-preview');
    const current = $('#kblx-current');
    const value = String(text || '').trim();

    if (preview) preview.textContent = value ? `Destino: ${value}` : 'Nenhuma rota definida.';
    if (current) current.textContent = value ? `Atual: ${value}` : 'Nenhuma rota definida.';
  }

  function ensureIconEl(btn) {
    if (!btn) return null;

    let iconEl = $('.symbol-icon', btn);
    if (!iconEl) {
      iconEl = document.createElement('span');
      iconEl.className = 'symbol-icon';
      if (btn.firstChild) {
        btn.insertBefore(iconEl, btn.firstChild);
      } else {
        btn.appendChild(iconEl);
      }
    }
    return iconEl;
  }

  function paintButton(btn, iconText) {
    if (!btn) return;

    const iconEl = ensureIconEl(btn);
    if (!iconEl) return;

    iconEl.textContent = iconText || getAutoIcon(btn.dataset.url || '');
    btn.classList.add('di-icon-ready');
    btn.dataset.diIconDone = '1';
  }

  function applyPreset(btn, presetKey) {
    if (!btn || !ORB_PRESETS[presetKey]) return null;

    const preset = ORB_PRESETS[presetKey];

    btn.dataset.preset = presetKey;
    btn.dataset.injectTarget = preset.injectTarget;
    btn.dataset.mode = preset.mode;

    paintButton(btn, preset.icon);

    const payload = {
      id: btn.id || '',
      preset: presetKey,
      url: btn.dataset.url || '',
      mode: preset.mode,
      updatedAt: Date.now()
    };

    const key = storageKeyForBtn(btn);
    if (key) {
      storageSet(sessionStorage, key, payload);
      storageSet(localStorage, key, payload);
    }

    dispatch('nagatanazare:preset-applied', { button: btn, preset, payload });
    return payload;
  }

  async function updateAttrBtn(
    btn,
    {
      url,
      preset = '',
      save = true,
      session = true,
      refresh = true,
      fallback = '◉'
    } = {}
  ) {
    if (!btn) return null;

    const cleanUrl = String(url || '').trim();
    if (!cleanUrl && !preset) return null;

    if (cleanUrl) btn.dataset.url = cleanUrl;
    btn.dataset.fallback = fallback;

    let iconText = '';

    if (preset && ORB_PRESETS[preset]) {
      applyPreset(btn, preset);
      iconText = ORB_PRESETS[preset].icon;
    } else {
      iconText = getAutoIcon(cleanUrl);
      paintButton(btn, iconText);
    }

    let iconUrl = '';
    if (refresh && cleanUrl) {
      const resolved = await resolveIcon(cleanUrl);
      if (resolved) {
        iconUrl = resolved;
        btn.dataset.iconUrl = resolved;
        paintButton(btn, iconText || getAutoIcon(cleanUrl));
      }
    }

    const payload = {
      id: btn.id || '',
      url: cleanUrl,
      preset: preset || btn.dataset.preset || '',
      icon: ($('.symbol-icon', btn)?.textContent || iconText || ''),
      iconUrl,
      updatedAt: Date.now()
    };

    const key = storageKeyForBtn(btn);
    if (key) {
      if (session) storageSet(sessionStorage, key, payload);
      if (save) storageSet(localStorage, key, payload);
    }

    dispatch('nagatanazare:button-updated', { button: btn, payload });

    return payload;
  }

  function restoreButtons() {
    $$('.symbol-button').forEach(btn => {
      const key = storageKeyForBtn(btn);
      if (!key) return;

      const data = storageGet(sessionStorage, key) || storageGet(localStorage, key);
      if (!data) return;

      if (data.url) btn.dataset.url = data.url;
      if (data.preset) btn.dataset.preset = data.preset;
      if (data.mode) btn.dataset.mode = data.mode;
      if (data.injectTarget) btn.dataset.injectTarget = data.injectTarget;
      if (data.iconUrl) btn.dataset.iconUrl = data.iconUrl;

      paintButton(btn, data.icon || getAutoIcon(data.url || ''));

      if (data.preset && ORB_PRESETS[data.preset]) {
        btn.dataset.mode = ORB_PRESETS[data.preset].mode;
        btn.dataset.injectTarget = ORB_PRESETS[data.preset].injectTarget;
      }
    });
  }

  function observeDynamicButtons() {
    const root = document.body;
    if (!root) return;

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'childList') {
          m.addedNodes.forEach((node) => {
            if (!(node instanceof Element)) return;

            if (node.matches?.('.symbol-button')) {
              paintButton(node, getAutoIcon(node.dataset.url || ''));
            }

            node.querySelectorAll?.('.symbol-button').forEach(btn => {
              paintButton(btn, getAutoIcon(btn.dataset.url || ''));
            });
          });
        }

        if (m.type === 'attributes' && m.attributeName === 'data-url') {
          const btn = m.target;
          if (btn?.classList?.contains('symbol-button')) {
            btn.dataset.diIconDone = '';
            paintButton(btn, getAutoIcon(btn.dataset.url || ''));
          }
        }
      }
    });

    mo.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-url']
    });
  }

  function injectButtonIntoHost(detail = {}) {
    const { button, target, url, preset } = detail;
    if (!button) return;

    if (target === '#session-iframe-embedded .win-frame' || preset === 'frame') {
      const frame = document.querySelector('#session-iframe-embedded .win-frame') || document.querySelector('#frame');
      if (frame && url) frame.src = url;
      return;
    }

    const host = document.querySelector(target || '#symbolBar');
    if (!host) return;

    const wrap = document.createElement('div');
    wrap.className = 'symbol-wrap nag-injected';

    const clone = button.cloneNode(true);
    clone.dataset.url = url || button.dataset.url || '';
    clone.dataset.storeKey = button.dataset.storeKey || button.id || '';
    paintButton(clone, clone.querySelector('.symbol-icon')?.textContent || '◉');

    wrap.appendChild(clone);
    host.appendChild(wrap);
  }

  // Abertura do Editor Completo (Original Panel)
  function openFullPanel(btn) {
    if (!btn) return;
    state.currentButton = btn;

    const back = $('#kblx-back');
    const title = $('#kblx-ttl');
    const input = $('#kblx-inp');
    const preview = $('#kblx-preview');

    if (back) {
      back.classList.add('is-open');
      back.setAttribute('aria-hidden', 'false');
    }

    if (title) title.textContent = btn.dataset.title || btn.id || 'Botão';
    if (input) input.value = btn.dataset.url || '';
    if (preview) updatePreview(btn.dataset.url || '');

    dispatch('nagatanazare:panel-open', {
      button: btn,
      url: btn.dataset.url || '',
      preset: btn.dataset.preset || ''
    });
  }

  // NOVO: Abertura Menu Contextual Estilo iOS (com Anti-Clip Screen)
  function openPanel(btn){
      if(!btn)return;
      state.currentButton = btn;
      
      if(navigator.vibrate){
         navigator.vibrate(12);
      }
      
      const menu = $("#kblx-quick");
      const rect = btn.getBoundingClientRect();
      const menuWidth = 230;
      const menuHeight = 280;
      
      let left = rect.left + (rect.width/2) - (menuWidth/2);
      let top = rect.top - menuHeight - 10;
      
      if(left < 10){
         left = 10;
      }
      if(left + menuWidth > window.innerWidth - 10){
         left = window.innerWidth - menuWidth - 10;
      }
      
      if(top < 10){
          top = rect.bottom + 10;
          menu.classList.add('flipped');
      } else {
          menu.classList.remove('flipped');
      }
      
      menu.style.left = left + "px";
      menu.style.top = top + "px";
      menu.classList.add("open");
  }

  function closePanel() {
    const back = $('#kblx-back');
    const menu = $('#kblx-quick');

    if (back) {
      back.classList.remove('is-open');
      back.classList.remove('is-advanced');
      back.setAttribute('aria-hidden', 'true');
    }

    if (menu) {
      menu.classList.remove('open');
    }

    dispatch('nagatanazare:panel-close', {
      button: state.currentButton
    });

    state.currentButton = null;
  }

  // NOVO: Touch Events para Escala e Feedback
  function bindLongPress() {
    const clearHold = () => {
       document.querySelectorAll(".kblx-hold").forEach(e => e.classList.remove("kblx-hold"));
       clearTimeout(state.longPressTimer);
    };

    document.addEventListener('touchstart', (e) => {
      const btn = e.target.closest?.('.symbol-button');
      if (!btn) return;
      
      clearHold();
      btn.classList.add("kblx-hold");
      state.longPressTimer = setTimeout(() => {
         btn.classList.remove("kblx-hold");
         openPanel(btn);
      }, LONG_PRESS_MS);
    }, { passive: true });

    document.addEventListener("touchend", clearHold, { passive: true });
    document.addEventListener("touchmove", clearHold, { passive: true });

    document.addEventListener('mousedown', (e) => {
      const btn = e.target.closest?.('.symbol-button');
      if (!btn) return;
      
      clearHold();
      btn.classList.add("kblx-hold");
      state.longPressTimer = setTimeout(() => {
         btn.classList.remove("kblx-hold");
         openPanel(btn);
      }, LONG_PRESS_MS);
    });

    document.addEventListener('mouseup', clearHold);
    document.addEventListener('mouseleave', clearHold);

    document.addEventListener('contextmenu', (e) => {
      const btn = e.target.closest?.('.symbol-button');
      if (!btn) return;
      e.preventDefault();
      clearHold();
      openPanel(btn);
    });
  }

  function bindPanelUI() {

    // Lógica Menu Contextual
    document.addEventListener("click", e => {
      const menu = document.querySelector("#kblx-quick");
      if (!menu) return;

      if (!menu.contains(e.target) && !e.target.closest(".symbol-button")) {
        menu.classList.remove("open");
      }

      const item = e.target.closest("[data-kq]");
      if (!item) return;

      const btn = state.currentButton;
      if (!btn) return;

      const action = item.dataset.kq;

      if (action === "symbol") {
        applyPreset(btn, "orb");
        window.dispatchEvent(new CustomEvent("nagatanazare:orb-inject", {
          detail: { button: btn, target: "#symbolBar" }
        }));
      }
      if (action === "frame") {
        applyPreset(btn, "frame");
      }
      if (action === "dock") {
        applyPreset(btn, "dock");
      }
      // Placeholder para ações adicionais
      if (action === "duplicate") {
         console.log("Duplicar:", btn.id);
         // Lógica futura de clone
      }
      if (action === "favorite") {
         console.log("Favoritar:", btn.id);
         // Lógica futura de favoritar
      }
      if (action === "full") {
        menu.classList.remove("open");
        openFullPanel(btn);
      }
      if (action === "edit") {
        menu.classList.remove("open");
        openFullPanel(btn);
        setTimeout(() => {
          const inp = document.querySelector("#kblx-inp");
          if(inp) inp.focus();
        }, 50);
      }
    });

    // Lógica Painel Principal
    document.addEventListener('click', async (e) => {
      const closeBtn = e.target.closest?.('#kblx-btn-close');
      const moreBtn = e.target.closest?.('#kblx-btn-more');
      const saveBtn = e.target.closest?.('#kblx-btn-save');
      const clearBtn = e.target.closest?.('#kblx-btn-clear');
      const injectBtn = e.target.closest?.('#kblx-btn-orb-inject');
      const frameBtn = e.target.closest?.('#kblx-btn-frame');
      const presetBtn = e.target.closest?.('[data-orb-preset]');
      const back = e.target.closest?.('#kblx-back');

      if (back && back.id === 'kblx-back' && e.target === back) {
        closePanel();
        return;
      }

      if (closeBtn) {
        closePanel();
        return;
      }

      if (moreBtn) {
        back?.classList.toggle('is-advanced');
        return;
      }

      if (presetBtn) {
        const presetKey = presetBtn.dataset.orbPreset;
        const current = state.currentButton;
        if (!current) return;

        await updateAttrBtn(current, {
          preset: presetKey,
          url: current.dataset.url || '',
          save: true,
          session: true,
          refresh: true
        });

        const title = $('#kblx-ttl');
        if (title && ORB_PRESETS[presetKey]) {
          title.textContent = `${current.dataset.title || current.id || 'Botão'} · ${ORB_PRESETS[presetKey].name}`;
        }
        return;
      }

      if (saveBtn) {
        const input = $('#kblx-inp');
        const current = state.currentButton;
        if (!input || !current) return;

        await updateAttrBtn(current, {
          url: input.value,
          save: true,
          session: true,
          refresh: true
        });

        updatePreview(input.value);
        return;
      }

      if (clearBtn) {
        const input = $('#kblx-inp');
        const current = state.currentButton;
        if (!input || !current) return;

        input.value = '';
        updatePreview('');
        current.dataset.url = '';
        current.dataset.preset = '';
        current.dataset.mode = '';
        current.dataset.injectTarget = '';
        current.dataset.iconUrl = '';
        current.dataset.diIconDone = '';

        paintButton(current, '◉');

        const key = storageKeyForBtn(current);
        if (key) {
          try { sessionStorage.removeItem(key); } catch {}
          try { localStorage.removeItem(key); } catch {}
        }

        dispatch('nagatanazare:button-cleared', { button: current });
        return;
      }

      if (injectBtn) {
        const current = state.currentButton;
        if (!current) return;

        dispatch('nagatanazare:orb-inject', {
          button: current,
          target: '#symbolBar',
          url: current.dataset.url || '',
          preset: current.dataset.preset || '',
          mode: current.dataset.mode || ''
        });
        return;
      }

      if (frameBtn) {
        const current = state.currentButton;
        if (!current) return;

        dispatch('kblx:special-frame-open', {
          button: current,
          target: '#session-iframe-embedded .win-frame',
          url: current.dataset.url || '',
          preset: current.dataset.preset || 'frame'
        });
      }
    });

    document.addEventListener('input', async (e) => {
      const input = e.target;
      if (!input.matches?.('#kblx-inp')) return;

      const current = state.currentButton;
      if (!current) return;

      updatePreview(input.value);

      await updateAttrBtn(current, {
        url: input.value,
        save: false,
        session: true,
        refresh: true
      });
    });
  }

  window.NAGATANAZARE = {
    name: ENGINE_NAME,
    presets: ORB_PRESETS,
    openPanel,
    closePanel,
    applyPreset,
    updateAttrBtn,
    restoreButtons,
    getCurrentButton: () => state.currentButton
  };

  function init() {
    restoreButtons();
    observeDynamicButtons();
    bindLongPress();
    bindPanelUI();

    window.addEventListener('nagatanazare:orb-inject', (e) => {
      injectButtonIntoHost(e.detail || {});
    });

    window.addEventListener('kblx:special-frame-open', (e) => {
      const detail = e.detail || {};
      const frame = document.querySelector('#session-iframe-embedded .win-frame') || document.querySelector('#frame');
      if (frame && detail.url) frame.src = detail.url;
    });

    dispatch('nagatanazare:ready', { engine: ENGINE_NAME });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
</script>
</body>
`); 
