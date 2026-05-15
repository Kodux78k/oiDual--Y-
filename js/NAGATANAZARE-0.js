
(() => {
  const ENGINE_NAME = 'NAGATANAZARE';
  const CACHE_KEY = 'di_btn_icon_cache_v3';
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

  const storageRemove = (storage, key) => {
    try {
      storage.removeItem(key);
    } catch {}
  };

  const cache = storageGet(localStorage, CACHE_KEY) || {};

  const normKey = (url) => {
    try {
      return new URL(url, location.href).href;
    } catch {
      return String(url || '');
    }
  };

  const getStorageKey = (btn) => {
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

  function saveCache() {
    storageSet(localStorage, CACHE_KEY, cache);
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
            saveCache();
            return resolved;
          }
        } catch {}
      }

      const apple = doc.querySelector('link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]');
      if (apple?.getAttribute('href')) {
        const resolved = new URL(apple.getAttribute('href'), base).href;
        cache[key] = resolved;
        saveCache();
        return resolved;
      }

      const shortcut = doc.querySelector('link[rel="shortcut icon"], link[rel="icon"]');
      if (shortcut?.getAttribute('href')) {
        const resolved = new URL(shortcut.getAttribute('href'), base).href;
        cache[key] = resolved;
        saveCache();
        return resolved;
      }

      const fallback = new URL('/favicon.ico', base).href;
      cache[key] = fallback;
      saveCache();
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
        saveCache();
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
      btn.innerHTML = '';
      iconEl = document.createElement('span');
      iconEl.className = 'symbol-icon';
      btn.appendChild(iconEl);
    }
    return iconEl;
  }

  function setSymbol(btn, symbol) {
    if (!btn) return;
    const iconEl = ensureIconEl(btn);
    if (!iconEl) return;

    iconEl.textContent = symbol || getAutoIcon(btn.dataset.url || '');
    btn.classList.add('di-icon-ready');
    btn.dataset.diIconDone = '1';
    btn.dataset.iconMode = 'symbol';
    delete btn.dataset.iconUrl;
  }

  function setImage(btn, iconUrl) {
    if (!btn || !iconUrl) return;

    btn.innerHTML = '';
    btn.classList.add('di-icon-ready');
    btn.dataset.diIconDone = '1';
    btn.dataset.iconMode = 'image';
    btn.dataset.iconUrl = iconUrl;

    const img = document.createElement('img');
    img.className = 'di-btn-icon-img';
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.src = iconUrl;

    img.onerror = () => {
      setSymbol(btn, btn.dataset.fallback || getAutoIcon(btn.dataset.url || ''));
    };

    btn.appendChild(img);
  }

  function paintButton(btn, { iconUrl = '', symbol = '' } = {}) {
    if (iconUrl) {
      setImage(btn, iconUrl);
      return;
    }
    setSymbol(btn, symbol || getAutoIcon(btn.dataset.url || ''));
  }

  function applyPreset(btn, presetKey) {
    if (!btn || !ORB_PRESETS[presetKey]) return null;

    const preset = ORB_PRESETS[presetKey];
    btn.dataset.preset = presetKey;
    btn.dataset.injectTarget = preset.injectTarget;
    btn.dataset.mode = preset.mode;
    paintButton(btn, { symbol: preset.icon });

    const payload = {
      id: btn.id || '',
      preset: presetKey,
      url: btn.dataset.url || '',
      mode: preset.mode,
      icon: preset.icon,
      iconMode: 'symbol',
      updatedAt: Date.now()
    };

    const key = getStorageKey(btn);
    if (key) {
      storageSet(sessionStorage, key, payload);
      storageSet(localStorage, key, payload);
    }

    dispatch('nagatanazare:preset-applied', { button: btn, preset, payload });
    return payload;
  }

  async function processButton(btn) {
    if (!btn || !btn.classList.contains('symbol-button')) return;

    const preset = btn.dataset.preset;
    const url = btn.dataset.url || '';

    if (preset && ORB_PRESETS[preset]) {
      applyPreset(btn, preset);
      return;
    }

    if (!url) {
      paintButton(btn, { symbol: getAutoIcon('') });
      return;
    }

    const iconUrl = await resolveIcon(url);
    if (iconUrl) {
      setImage(btn, iconUrl);
    } else {
      paintButton(btn, { symbol: getAutoIcon(url) });
    }
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
    let iconUrl = '';

    if (preset && ORB_PRESETS[preset]) {
      applyPreset(btn, preset);
      iconText = ORB_PRESETS[preset].icon;
    } else {
      iconText = getAutoIcon(cleanUrl);
      paintButton(btn, { symbol: iconText });

      if (refresh && cleanUrl) {
        const resolved = await resolveIcon(cleanUrl);
        if (resolved) {
          iconUrl = resolved;
          setImage(btn, resolved);
        }
      }
    }

    const payload = {
      id: btn.id || '',
      url: cleanUrl,
      preset: preset || btn.dataset.preset || '',
      icon: btn.dataset.iconMode === 'image'
        ? ''
        : ($('.symbol-icon', btn)?.textContent || iconText || ''),
      iconUrl,
      iconMode: btn.dataset.iconMode || 'symbol',
      updatedAt: Date.now()
    };

    const key = getStorageKey(btn);
    if (key) {
      if (session) storageSet(sessionStorage, key, payload);
      if (save) storageSet(localStorage, key, payload);
      if (!session && !save) {
        storageRemove(sessionStorage, key);
        storageRemove(localStorage, key);
      }
    }

    dispatch('nagatanazare:button-updated', { button: btn, payload });
    return payload;
  }

  function restoreButtons() {
    $$('.symbol-button').forEach(btn => {
      const key = getStorageKey(btn);
      if (!key) return;

      const data = storageGet(sessionStorage, key) || storageGet(localStorage, key);
      if (!data) return;

      if (data.url) btn.dataset.url = data.url;
      if (data.preset) btn.dataset.preset = data.preset;
      if (data.mode) btn.dataset.mode = data.mode;
      if (data.injectTarget) btn.dataset.injectTarget = data.injectTarget;
      if (data.iconUrl) btn.dataset.iconUrl = data.iconUrl;

      if (data.iconMode === 'image' && data.iconUrl) {
        setImage(btn, data.iconUrl);
      } else {
        paintButton(btn, { symbol: data.icon || getAutoIcon(data.url || '') });
      }

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
              processButton(node);
            }

            node.querySelectorAll?.('.symbol-button').forEach(btn => processButton(btn));
          });
        }

        if (m.type === 'attributes' && m.attributeName === 'data-url') {
          const btn = m.target;
          if (btn?.classList?.contains('symbol-button')) {
            btn.dataset.diIconDone = '';
            processButton(btn);
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
    wrap.appendChild(clone);
    host.appendChild(wrap);
  }

  function openFullPanel(btn) {
    if (!btn) return;
    state.currentButton = btn;

    const back = $('#kblx-back');
    const title = $('#kblx-ttl');
    const input = $('#kblx-inp');

    if (back) {
      back.classList.add('is-open');
      back.setAttribute('aria-hidden', 'false');
    }

    if (title) title.textContent = btn.dataset.title || btn.id || 'Botão';
    if (input) input.value = btn.dataset.url || '';

    updatePreview(btn.dataset.url || '');

    dispatch('nagatanazare:panel-open', {
      button: btn,
      url: btn.dataset.url || '',
      preset: btn.dataset.preset || ''
    });
  }

  function openQuickMenu(btn) {
    if (!btn) return;
    state.currentButton = btn;

    if (navigator.vibrate) {
      navigator.vibrate(12);
    }

    const menu = $('#kblx-quick');
    if (!menu) return;

    const rect = btn.getBoundingClientRect();
    const menuWidth = 230;
    const menuHeight = 280;

    let left = rect.left + (rect.width / 2) - (menuWidth / 2);
    let top = rect.top - menuHeight - 10;

    if (left < 10) left = 10;
    if (left + menuWidth > window.innerWidth - 10) left = window.innerWidth - menuWidth - 10;

    if (top < 10) {
      top = rect.bottom + 10;
      menu.classList.add('flipped');
    } else {
      menu.classList.remove('flipped');
    }

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.classList.add('open');
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

    dispatch('nagatanazare:panel-close', { button: state.currentButton });
    state.currentButton = null;
  }

  function bindLongPress() {
    const clearHold = () => {
      document.querySelectorAll('.kblx-hold').forEach(el => el.classList.remove('kblx-hold'));
      clearTimeout(state.longPressTimer);
      state.longPressTimer = null;
    };

    document.addEventListener('pointerdown', (e) => {
      const btn = e.target.closest?.('.symbol-button');
      if (!btn) return;

      clearHold();
      btn.classList.add('kblx-hold');

      state.longPressTimer = setTimeout(() => {
        btn.classList.remove('kblx-hold');
        openQuickMenu(btn);
      }, LONG_PRESS_MS);
    });

    document.addEventListener('pointerup', clearHold);
    document.addEventListener('pointercancel', clearHold);
    document.addEventListener('pointerleave', clearHold);

    document.addEventListener('contextmenu', (e) => {
      const btn = e.target.closest?.('.symbol-button');
      if (!btn) return;
      e.preventDefault();
      clearHold();
      openQuickMenu(btn);
    });
  }

  function bindPanelUI() {
    document.addEventListener('click', async (e) => {
      const menu = $('#kblx-quick');
      const item = e.target.closest?.('[data-kq]');
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

      if (menu && !menu.contains(e.target) && !e.target.closest('.symbol-button')) {
        menu.classList.remove('open');
      }

      if (item) {
        const btn = state.currentButton;
        if (!btn) return;

        const action = item.dataset.kq;

        if (action === 'symbol') {
          applyPreset(btn, 'orb');
          window.dispatchEvent(new CustomEvent('nagatanazare:orb-inject', {
            detail: { button: btn, target: '#symbolBar', url: btn.dataset.url || '', preset: 'orb' }
          }));
        }

        if (action === 'frame') {
          applyPreset(btn, 'frame');
          window.dispatchEvent(new CustomEvent('kblx:special-frame-open', {
            detail: { button: btn, target: '#session-iframe-embedded .win-frame', url: btn.dataset.url || '', preset: 'frame' }
          }));
        }

        if (action === 'dock') {
          applyPreset(btn, 'dock');
          window.dispatchEvent(new CustomEvent('nagatanazare:orb-inject', {
            detail: { button: btn, target: '#dock', url: btn.dataset.url || '', preset: 'dock' }
          }));
        }

        if (action === 'duplicate') {
          console.log('Duplicar:', btn.id || btn.dataset.storeKey || btn.dataset.url || '');
        }

        if (action === 'favorite') {
          console.log('Favoritar:', btn.id || btn.dataset.storeKey || btn.dataset.url || '');
        }

        if (action === 'full') {
          menu.classList.remove('open');
          openFullPanel(btn);
        }

        if (action === 'edit') {
          menu.classList.remove('open');
          openFullPanel(btn);
          setTimeout(() => {
            const inp = $('#kblx-inp');
            if (inp) inp.focus();
          }, 50);
        }

        return;
      }

      if (closeBtn) {
        closePanel();
        return;
      }

      if (moreBtn) {
        const backEl = $('#kblx-back');
        backEl?.classList.toggle('is-advanced');
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
          refresh: false
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
        current.dataset.iconMode = '';

        paintButton(current, { symbol: '◉' });

        const key = getStorageKey(current);
        if (key) {
          storageRemove(sessionStorage, key);
          storageRemove(localStorage, key);
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
    openQuickMenu,
    openPanel: openFullPanel,
    closePanel,
    applyPreset,
    updateAttrBtn,
    restoreButtons,
    getCurrentButton: () => state.currentButton,
    refreshAll: async () => {
      restoreButtons();
      await Promise.all($$('.symbol-button[data-url]').map(processButton));
    },
    clearIconCache: () => {
      Object.keys(cache).forEach(k => delete cache[k]);
      saveCache();
    }
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
