(function () {
  'use strict';

  if (window.__ARCHETYPE_OVERRIDE_V1__) return;
  window.__ARCHETYPE_OVERRIDE_V1__ = true;

  const ARCHETYPE_STORAGE_KEY = 'duality.archetypes.byUsername';
  const CURRENT_ARCHETYPE_KEY = 'duality.archetypes.current';
  const ARCHETYPE_TAG_ID = 'archTagOverride';
  const ARCHETYPE_LABEL_ID = 'archTagOverrideLabel';
  const ARCHETYPE_PLAY_ID = 'archTagOverridePlay';

  const DEFAULT_THEME = {
    primary: '#78e3ff',
    secondary: '#b978ff',
    bgSoft: 'radial-gradient(circle at 40% 10%, rgba(120,227,255,.07), transparent)',
    glow: '0 0 18px rgba(120,227,255,.55)'
  };

  const NEW_ARCHETYPES = [
    {
      id: 'kd1',
      name: 'KD PRIMEIRO',
      aliases: ['kd°1', 'kd1', 'kd primeiro', 'kd graus 1', 'k d 1', 'k-d-1', 'cadê primeiro', 'cade primeiro'],
      voice: 'Rocko',
      lang: 'safe',
      speechLang: 'pt-BR',
      rate: 0.33,
      pitch: 0.03,
      color: '#9BE7FF',
      theme: {
        primary: '#9BE7FF',
        secondary: '#6A5CFF',
        bgSoft: 'radial-gradient(circle at 45% 25%, rgba(155,231,255,.10), transparent)',
        glow: '0 0 18px rgba(155,231,255,.58)'
      }
    },
    {
      id: 'christos',
      name: 'CHRISTOS',
      aliases: ['christos', 'cristo', 'cristos'],
      voice: 'Paulina',
      lang: 'safe',
      speechLang: 'pt-BR',
      rate: 0.33,
      pitch: 0.03,
      color: '#FFB84D',
      theme: {
        primary: '#FFB84D',
        secondary: '#FFD166',
        bgSoft: 'radial-gradient(circle at 45% 30%, rgba(255,184,77,.10), transparent)',
        glow: '0 0 18px rgba(255,184,77,.58)'
      }
    }
  ];

  function norm(v) {
    return String(v || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-°]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function safeArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function loadMap() {
    try {
      return JSON.parse(localStorage.getItem(ARCHETYPE_STORAGE_KEY) || '{}') || {};
    } catch {
      return {};
    }
  }

  function saveMap(map) {
    try {
      localStorage.setItem(ARCHETYPE_STORAGE_KEY, JSON.stringify(map || {}));
    } catch {}
  }

  function saveCurrentArchetypeId(id) {
    try {
      localStorage.setItem(CURRENT_ARCHETYPE_KEY, id || '');
    } catch {}
  }

  function getCurrentArchetypeId() {
    try {
      return localStorage.getItem(CURRENT_ARCHETYPE_KEY) || '';
    } catch {
      return '';
    }
  }

  function getUsernameCandidates() {
    const ids = [
      'inputUser',
      'infodoseNameInput',
      'username',
      'userName',
      'nameInput',
      'name'
    ];

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el && String(el.value || '').trim()) return String(el.value).trim();
    }

    const lbl = document.getElementById('lblName');
    if (lbl && String(lbl.textContent || '').trim()) return String(lbl.textContent).trim();

    return '';
  }

  function ensureArchetypes() {
    if (!Array.isArray(window.ARCHETYPES)) window.ARCHETYPES = [];

    const existingIds = new Set(window.ARCHETYPES.map(a => norm(a && a.id)));
    for (const item of NEW_ARCHETYPES) {
      if (!existingIds.has(norm(item.id))) {
        window.ARCHETYPES.push(item);
      }
    }

    window.ARCHETYPES = window.ARCHETYPES.map(a => ({
      theme: DEFAULT_THEME,
      rate: 1,
      pitch: 1,
      aliases: [],
      speechLang: a && a.lang ? a.lang : 'pt-BR',
      ...a,
      theme: {
        ...DEFAULT_THEME,
        ...(a && a.theme ? a.theme : {})
      }
    }));
  }

  function getArchetypeByText(text) {
    const source = norm(text);
    if (!source) return null;

    return safeArray(window.ARCHETYPES).find(a => {
      const aliases = [a && a.id, a && a.name, ...(a && a.aliases ? a.aliases : [])]
        .filter(Boolean)
        .map(norm);

      return aliases.some(alias => alias && source.includes(alias));
    }) || null;
  }

  function getSavedArchetypeForUsername(username) {
    const u = norm(username);
    if (!u) return null;

    const map = loadMap();
    const archetypeId = map[u];
    if (!archetypeId) return null;

    return safeArray(window.ARCHETYPES).find(a => norm(a && a.id) === norm(archetypeId)) || null;
  }

  function saveArchetypeForUsername(username, archetype) {
    const u = norm(username);
    if (!u || !archetype || !archetype.id) return;

    const map = loadMap();
    map[u] = archetype.id;
    saveMap(map);
    saveCurrentArchetypeId(archetype.id);
  }

  function findOrRestoreArchetype(text, username) {
    const detectedByText = getArchetypeByText(text);
    if (detectedByText) {
      saveArchetypeForUsername(username || text, detectedByText);
      return detectedByText;
    }

    const saved = getSavedArchetypeForUsername(username || text);
    if (saved) {
      saveCurrentArchetypeId(saved.id);
      return saved;
    }

    const currentId = getCurrentArchetypeId();
    const current = currentId
      ? safeArray(window.ARCHETYPES).find(a => norm(a && a.id) === norm(currentId)) || null
      : null;

    return current;
  }

  function ensureTagElement() {
    const mount =
      document.getElementById('activationCard') ||
      document.getElementById('cardBody') ||
      document.body;

    let tag = document.getElementById(ARCHETYPE_TAG_ID);

    if (!tag) {
      tag = document.createElement('div');
      tag.id = ARCHETYPE_TAG_ID;
      tag.setAttribute('role', 'button');
      tag.setAttribute('tabindex', '0');
      tag.style.cssText = [
        'display:flex',
        'align-items:center',
        'justify-content:space-between',
        'gap:10px',
        'margin:10px 0 12px',
        'padding:10px 12px',
        'border:1px solid rgba(255,255,255,.12)',
        'border-radius:14px',
        'background:rgba(0,0,0,.28)',
        'backdrop-filter:blur(12px)',
        'cursor:pointer',
        'user-select:none'
      ].join(';');

      tag.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;min-width:0">
          <span style="width:10px;height:10px;border-radius:999px;display:inline-block;background:var(--arch-color,#78e3ff);box-shadow:var(--arch-glow,0 0 18px rgba(120,227,255,.55))"></span>
          <div style="display:flex;flex-direction:column;min-width:0;text-align:left">
            <span id="${ARCHETYPE_LABEL_ID}" style="font-weight:800;letter-spacing:.08em;font-size:.85rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">ARCHETYPE</span>
            <span style="font-size:.72rem;opacity:.65;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">toque para ouvir</span>
          </div>
        </div>
        <button id="${ARCHETYPE_PLAY_ID}" type="button" class="small-btn" style="min-width:44px;padding:8px 10px">🔊</button>
      `;

      mount.prepend(tag);
    }

    return tag;
  }

  function speakArchetype(archetype) {
    if (!archetype) return;
    if (!('speechSynthesis' in window)) return;

    const utter = new SpeechSynthesisUtterance();
    utter.text = `${archetype.name}. ${archetype.id}.`;
    utter.lang = archetype.speechLang || archetype.lang || 'pt-BR';
    utter.rate = typeof archetype.rate === 'number' ? archetype.rate : 1;
    utter.pitch = typeof archetype.pitch === 'number' ? archetype.pitch : 1;
    utter.volume = 1;

    try {
      speechSynthesis.cancel();
      speechSynthesis.speak(utter);
    } catch {}
  }

  function renderArchetypeTag(archetype) {
    const tag = ensureTagElement();
    if (!tag) return;

    const label = document.getElementById(ARCHETYPE_LABEL_ID);
    const play = document.getElementById(ARCHETYPE_PLAY_ID);

    const current = archetype || getSavedArchetypeForUsername(getUsernameCandidates()) || null;

    if (current) {
      tag.style.setProperty('--arch-color', current.color || DEFAULT_THEME.primary);
      tag.style.setProperty('--arch-glow', current.theme && current.theme.glow ? current.theme.glow : DEFAULT_THEME.glow);
      tag.style.borderColor = current.color || 'rgba(255,255,255,.12)';
      tag.style.boxShadow = current.theme && current.theme.glow ? current.theme.glow : 'none';
      tag.title = `Arquétipo: ${current.name}`;
      if (label) label.textContent = current.name;
      if (play) play.textContent = '🔊';
    } else {
      tag.style.setProperty('--arch-color', DEFAULT_THEME.primary);
      tag.style.setProperty('--arch-glow', DEFAULT_THEME.glow);
      tag.style.borderColor = 'rgba(255,255,255,.12)';
      tag.style.boxShadow = 'none';
      tag.title = 'Nenhum arquétipo ativo';
      if (label) label.textContent = 'ARCHETYPE';
      if (play) play.textContent = '🔊';
    }

    const click = () => {
      const active = current || getSavedArchetypeForUsername(getUsernameCandidates());
      if (active) speakArchetype(active);
    };

    tag.onclick = click;
    if (play) play.onclick = (ev) => {
      ev.stopPropagation();
      click();
    };

    tag.onkeydown = (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        click();
      }
    };
  }

  function bindUsernameInput() {
    const input = document.getElementById('inputUser') || document.getElementById('infodoseNameInput');
    if (!input || input.__archBound) return;
    input.__archBound = true;

    const handle = () => {
      const username = String(input.value || '').trim();
      const currentText =
        String(document.getElementById('actPre')?.textContent || '') + ' ' +
        String(document.getElementById('cardBody')?.textContent || '') + ' ' +
        username;

      const archetype = findOrRestoreArchetype(currentText, username);
      if (archetype) {
        saveArchetypeForUsername(username, archetype);
        renderArchetypeTag(archetype);
      } else {
        renderArchetypeTag(null);
      }

      window.__CURRENT_ARCHETYPE__ = archetype || null;
    };

    input.addEventListener('input', handle, { passive: true });
    input.addEventListener('change', handle, { passive: true });
    input.addEventListener('blur', handle, { passive: true });
    handle();
  }

  function bindMessageScan() {
    const targets = [
      document.getElementById('actPre'),
      document.getElementById('cardBody'),
      document.getElementById('mainCard')
    ].filter(Boolean);

    const scan = () => {
      const username = getUsernameCandidates();
      const text = targets.map(el => String(el.textContent || '')).join(' ');
      const archetype = findOrRestoreArchetype(text, username);

      if (archetype) {
        saveArchetypeForUsername(username || text, archetype);
        renderArchetypeTag(archetype);
        window.__CURRENT_ARCHETYPE__ = archetype;
      }
    };

    for (const el of targets) {
      if (el.__archObserverBound) continue;
      el.__archObserverBound = true;

      const obs = new MutationObserver(() => scan());
      obs.observe(el, { childList: true, subtree: true, characterData: true });
    }

    scan();
  }

  function patchUpdateInterface() {
    const original = window.updateInterface;
    if (typeof original !== 'function' || original.__archPatched) return;

    const patched = function (...args) {
      const out = original.apply(this, args);

      try {
        const username = getUsernameCandidates() || String(args[0] || '').trim();
        const text = [
          username,
          document.getElementById('actPre')?.textContent || '',
          document.getElementById('cardBody')?.textContent || ''
        ].join(' ');

        const archetype = findOrRestoreArchetype(text, username);
        if (archetype) {
          saveArchetypeForUsername(username || text, archetype);
          renderArchetypeTag(archetype);
          window.__CURRENT_ARCHETYPE__ = archetype;
        }
      } catch {}

      return out;
    };

    patched.__archPatched = true;
    window.updateInterface = patched;
  }

  function patchRenderResponseLikeFunctions() {
    const candidates = ['renderResponse', 'renderresponse', 'renderAct', 'renderActPre'];
    for (const name of candidates) {
      const fn = window[name];
      if (typeof fn !== 'function' || fn.__archPatched) continue;

      const patched = function (...args) {
        const out = fn.apply(this, args);
        try {
          const username = getUsernameCandidates();
          const text = args.map(v => String(v || '')).join(' ');
          const archetype = findOrRestoreArchetype(text, username);

          if (archetype) {
            saveArchetypeForUsername(username || text, archetype);
            renderArchetypeTag(archetype);
            window.__CURRENT_ARCHETYPE__ = archetype;
          }
        } catch {}
        return out;
      };

      patched.__archPatched = true;
      window[name] = patched;
    }
  }

  function boot() {
    ensureArchetypes();
    ensureTagElement();
    renderArchetypeTag(getSavedArchetypeForUsername(getUsernameCandidates()) || null);
    bindUsernameInput();
    bindMessageScan();
    patchUpdateInterface();
    patchRenderResponseLikeFunctions();

    window.addEventListener('storage', () => {
      renderArchetypeTag(getSavedArchetypeForUsername(getUsernameCandidates()) || null);
    });

    const obs = new MutationObserver(() => {
      bindUsernameInput();
      patchUpdateInterface();
      patchRenderResponseLikeFunctions();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.ARCHETYPE_UTILS = {
    normalize: norm,
    getArchetypeByText,
    getSavedArchetypeForUsername,
    saveArchetypeForUsername,
    renderArchetypeTag,
    speakArchetype,
    findOrRestoreArchetype
  };
})();
