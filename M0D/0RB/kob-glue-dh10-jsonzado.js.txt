// ╔═══════════════════════════════════════════════════════╗
// ║  KxaT-arch-loader.js                                 ║
// ║  Real-time Archetype Fetch + CSS Patch Engine        ║
// ║  KD1 · KOBLLUX · ATLAS MODE ✓                        ║
// ║                                                      ║
// ║  FLUXO:                                              ║
// ║  1. Tenta fetch do JSON remoto (URL configurável)    ║
// ║  2. Fallback para localStorage (sessão anterior)     ║
// ║  3. Fallback para ARCHETYPES local embutido          ║
// ║  4. Aplica html[data-arch] + CSS vars em runtime     ║
// ║  5. Expõe window.KOBLLUX_ARCH_LOADER para outros JS  ║
// ╚═══════════════════════════════════════════════════════╝

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     GUARD — roda só uma vez por sessão
  ───────────────────────────────────────────────────────── */
  if (window.__KxaT_ARCH_LOADER_INIT__) {
    console.log('[ArchLoader] já ativo.');
    return;
  }
  window.__KxaT_ARCH_LOADER_INIT__ = true;

  /* ─────────────────────────────────────────────────────────
     CONFIG — edite aqui para apontar para seu JSON
     O JSON remoto pode estar em:
       • GitHub Pages  → seu repo /arquetipos.json
       • Duo app       → gerado dinamicamente e servido
       • localStorage  → cache automático da sessão anterior
  ───────────────────────────────────────────────────────── */
  const CFG = {
    // URL primária do JSON de arquétipos (altere conforme necessário)
    remoteUrl: localStorage.getItem('kxat_arch_url') ||
      'https://kodux78k.github.io/oiDual--Y-/data/arquetipos.json',

    // Chave localStorage para cache do JSON
    cacheKey: 'kxat_arch_cache',

    // Chave para o índice do arquétipo ativo
    archIdxKey: 'kob_arch_id',

    // Intervalo de re-fetch (ms) — 0 = sem polling automático
    // Defina ex: 30000 para atualizar a cada 30s em tempo real
    pollInterval: 0,

    // Timeout do fetch em ms
    fetchTimeout: 8000,
  };

  /* ─────────────────────────────────────────────────────────
     ROOT LAYER — mesma hierarquia do kob-glue-dh10.js
  ───────────────────────────────────────────────────────── */
  const HTML = document.documentElement;   // <html> — CSS selector root
  const BODY = document.body;
  const META = document.querySelector('meta[name="kob-arch"]');

  /* ─────────────────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────────────────── */
  let _archetypes = [];   // array vivo — substituído pelo fetch
  let _activeIdx  = 0;
  let _pollTimer  = null;

  /* ─────────────────────────────────────────────────────────
     UTIL — hexToRgba
  ───────────────────────────────────────────────────────── */
  function hexToRgba(hex, a) {
    const c = String(hex || '#000').replace('#', '');
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  /* ─────────────────────────────────────────────────────────
     UTIL — normaliza um arquétipo vindo do JSON
     Aceita o formato do arquetipos_2.json (arquetipos_visuais)
     E também o formato do KxaT-inline-00.js (ARCHETYPES array)
  ───────────────────────────────────────────────────────── */
  function normalizeArch(raw) {
    if (!raw || typeof raw !== 'object') return null;

    // Formato KxaT-inline-00.js já tem .theme completo
    if (raw.theme && raw.theme.primary) return raw;

    // Formato arquetipos_2.json — tem .p (primary), .s (secondary), .a (accent)
    const primary   = raw.p   || raw.color   || '#00f5ff';
    const secondary = raw.s   || primary;
    const color     = raw.p   || raw.color   || primary;

    return {
      id:      String(raw.name || raw.id || 'unknown').toLowerCase(),
      name:    String(raw.name || raw.id || 'UNKNOWN').toUpperCase(),
      opcode:  raw.opcode  || null,
      hz:      raw.hz      || 432,
      emoji:   raw.emoji   || '●',
      role:    raw.role    || '',
      voice:   raw.voice   || null,
      lang:    raw.lang    || 'pt-BR',
      rate:    raw.rate    || 1.0,
      pitch:   raw.pitch   || 1.0,
      color,
      theme: {
        primary,
        secondary,
        accent:  raw.a || secondary,
        bgSoft: `radial-gradient(circle at 40% 20%, ${hexToRgba(primary, 0.09)}, transparent)`,
        glow:   `0 0 18px ${hexToRgba(primary, 0.55)}`,
      }
    };
  }

  /* ─────────────────────────────────────────────────────────
     UTIL — normaliza um JSON inteiro
     Suporta:
       • Array direto: [{...}, {...}]
       • Objeto com .arquetipos_visuais (formato Blue)
       • Objeto com raiz livre de keys → pega o primeiro array
  ───────────────────────────────────────────────────────── */
  function normalizeJSON(data) {
    let arr = [];

    if (Array.isArray(data)) {
      arr = data;
    } else if (data && Array.isArray(data.arquetipos_visuais)) {
      // formato arquetipos_2.json — pega os visuais (têm cores)
      arr = data.arquetipos_visuais;
    } else if (data && typeof data === 'object') {
      // tenta achar qualquer array no primeiro nível
      const found = Object.values(data).find(v => Array.isArray(v));
      if (found) arr = found;
    }

    return arr.map(normalizeArch).filter(Boolean);
  }

  /* ─────────────────────────────────────────────────────────
     CSS PATCH — injeta as regras html[data-arch="X"]
     em runtime, para todos os arquétipos carregados
  ───────────────────────────────────────────────────────── */
  function injectArchCSS(archetypes) {
    const styleId = 'KXAT_ARCH_CSS_RUNTIME';
    let el = document.getElementById(styleId);
    if (!el) {
      el = document.createElement('style');
      el.id = styleId;
      document.head.appendChild(el);
    }

    const rules = archetypes.map(arch => {
      const t = arch.theme;
      return `
html[data-arch="${arch.id}"] {
  --kob-voice-primary:   ${t.primary};
  --kob-voice-secondary: ${t.secondary};
  --kob-voice-glow:      ${t.glow};
  --kob-voice-bg-soft:   ${t.bgSoft};
  --kob-tts-primary:     ${t.primary};
  --kob-tts-secondary:   ${t.secondary};
  --kob-tts-glow:        ${t.glow};
  --orb-primary:         ${t.primary};
  --orb-secondary:       ${t.secondary};
  --orb-accent:          ${t.accent || t.secondary};
  --grad-a:              ${t.primary};
}`.trim();
    }).join('\n\n');

    el.textContent = rules;
    console.log(`[ArchLoader] CSS patch injetado — ${archetypes.length} arquétipos`);
  }

  /* ─────────────────────────────────────────────────────────
     APPLY THEME — escreve nas 4 camadas
  ───────────────────────────────────────────────────────── */
  function applyTheme(arch) {
    if (!arch || !arch.theme) return;
    const t = arch.theme;

    // Layer 1 — html[data-arch] (CSS selector truth)
    HTML.setAttribute('data-arch',       arch.id);
    HTML.setAttribute('data-voice-arch', arch.id);

    // Layer 2 — body[data-voice-arch] (legacy compat)
    if (BODY) BODY.setAttribute('data-voice-arch', arch.id);

    // Layer 3 — meta[name="kob-arch"]
    if (META) META.setAttribute('content', arch.id);

    // Layer 4 — CSS custom properties (JS-driven, suplementam o CSS)
    const root = HTML;
    root.style.setProperty('--kob-voice-primary',   t.primary);
    root.style.setProperty('--kob-voice-secondary', t.secondary);
    root.style.setProperty('--kob-voice-bg-soft',   t.bgSoft);
    root.style.setProperty('--kob-voice-glow',      t.glow);
    root.style.setProperty('--kob-tts-primary',     t.primary);
    root.style.setProperty('--kob-tts-secondary',   t.secondary);
    root.style.setProperty('--orb-primary',         t.primary);
    root.style.setProperty('--orb-secondary',       t.secondary);
    root.style.setProperty('--orb-accent',          t.accent || t.secondary);
    root.style.setProperty('--grad-a',              t.primary);

    // HUD status text
    const hud = document.getElementById('hudStatus');
    if (hud) hud.textContent = arch.name + (arch.role ? ' · ' + arch.role : '');

    // Propaga para KOBLLUX global se disponível
    try {
      if (window.KOBLLUX && typeof window.KOBLLUX.applyVoiceTheme === 'function') {
        window.KOBLLUX.applyVoiceTheme(arch);
      }
    } catch (e) {}

    // Persiste ID no localStorage
    try { localStorage.setItem('kob_arch_id', arch.id); } catch (e) {}

    console.log(`[ArchLoader] Tema aplicado → ${arch.name} (${arch.id})`);
    window.dispatchEvent(new CustomEvent('KXAT_ARCH_CHANGED', { detail: arch }));
  }

  /* ─────────────────────────────────────────────────────────
     SET ACTIVE ARCHETYPE — por ID ou índice
  ───────────────────────────────────────────────────────── */
  function setArchById(id) {
    const idx = _archetypes.findIndex(a => a.id === id);
    if (idx >= 0) {
      _activeIdx = idx;
      applyTheme(_archetypes[idx]);
      return true;
    }
    return false;
  }

  function setArchByIndex(idx) {
    const len = _archetypes.length;
    if (!len) return false;
    _activeIdx = ((idx % len) + len) % len;
    applyTheme(_archetypes[_activeIdx]);
    return true;
  }

  function cycleArch(step = 1) {
    return setArchByIndex(_activeIdx + step);
  }

  /* ─────────────────────────────────────────────────────────
     LOAD ARCHETYPES — aplica array normalizado
  ───────────────────────────────────────────────────────── */
  function loadArchetypes(arr, source) {
    if (!Array.isArray(arr) || !arr.length) {
      console.warn('[ArchLoader] array vazio ou inválido, ignorado.');
      return;
    }

    _archetypes = arr;

    // Injeta CSS para todos os arquétipos
    injectArchCSS(_archetypes);

    // Expõe no KOBLLUX global (compatibilidade com kob-glue-dh10.js)
    try {
      if (window.KOBLLUX && typeof window.KOBLLUX.setArchetypes === 'function') {
        window.KOBLLUX.setArchetypes(_archetypes);
      }
    } catch (e) {}

    // Restaura arquétipo salvo ou usa o primeiro
    const savedId = localStorage.getItem(CFG.archIdxKey);
    const restored = savedId ? setArchById(savedId) : false;
    if (!restored) setArchByIndex(0);

    console.log(`[ArchLoader] ${arr.length} arquétipos carregados (fonte: ${source})`);
    window.dispatchEvent(new CustomEvent('KXAT_ARCH_LOADED', {
      detail: { archetypes: _archetypes, source }
    }));
  }

  /* ─────────────────────────────────────────────────────────
     CACHE localStorage
  ───────────────────────────────────────────────────────── */
  function saveCache(arr) {
    try {
      localStorage.setItem(CFG.cacheKey, JSON.stringify(arr));
    } catch (e) {}
  }

  function loadCache() {
    try {
      const raw = localStorage.getItem(CFG.cacheKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : null;
    } catch (e) {
      return null;
    }
  }

  /* ─────────────────────────────────────────────────────────
     FETCH remoto com timeout
  ───────────────────────────────────────────────────────── */
  async function fetchWithTimeout(url, ms) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    try {
      const res = await fetch(url, {
        mode: 'cors',
        credentials: 'omit',
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      clearTimeout(timer);
      throw e;
    }
  }

  /* ─────────────────────────────────────────────────────────
     FETCH + MERGE — lógica principal
     1. Tenta URL remota
     2. Fallback localStorage cache
     3. Fallback ARCHETYPES local (window.KOBLLUX_VOICES)
  ───────────────────────────────────────────────────────── */
  async function fetchAndApply(url) {
    // ── 1. Remote fetch ──
    try {
      console.log(`[ArchLoader] Buscando ${url} …`);
      const data = await fetchWithTimeout(url, CFG.fetchTimeout);
      const arr  = normalizeJSON(data);

      if (arr.length) {
        saveCache(arr);          // atualiza cache
        loadArchetypes(arr, 'remote:' + url);
        return;
      }
      throw new Error('JSON sem arquétipos válidos');
    } catch (e) {
      console.warn(`[ArchLoader] Fetch remoto falhou (${e.message}), tentando cache…`);
    }

    // ── 2. localStorage cache ──
    const cached = loadCache();
    if (cached && cached.length) {
      loadArchetypes(cached, 'cache:localStorage');
      return;
    }

    // ── 3. Fallback — KOBLLUX_VOICES global (KxaT-inline-00.js)
    //       ou ARCHETYPES local (kob-glue-dh10.js)
    const fallbackVoices = window.KOBLLUX_VOICES
      ? Object.values(window.KOBLLUX_VOICES)
      : null;
    const fallbackGlobal = window.KOBLLUX && window.KOBLLUX.getArchetypes
      ? window.KOBLLUX.getArchetypes()
      : null;
    const fallback = fallbackVoices || fallbackGlobal || [];

    if (fallback.length) {
      const arr = normalizeJSON(fallback);
      loadArchetypes(arr, 'fallback:global');
      return;
    }

    console.error('[ArchLoader] Nenhuma fonte de arquétipos disponível.');
    window.dispatchEvent(new CustomEvent('KXAT_ARCH_ERROR', { detail: { url } }));
  }

  /* ─────────────────────────────────────────────────────────
     POLLING — re-fetch periódico para atualização em tempo real
     Uso: window.KOBLLUX_ARCH_LOADER.startPolling(30000)
  ───────────────────────────────────────────────────────── */
  function startPolling(intervalMs) {
    stopPolling();
    if (!intervalMs || intervalMs <= 0) return;
    _pollTimer = setInterval(() => fetchAndApply(CFG.remoteUrl), intervalMs);
    console.log(`[ArchLoader] Polling ativo — intervalo ${intervalMs}ms`);
  }

  function stopPolling() {
    if (_pollTimer) { clearInterval(_pollTimer); _pollTimer = null; }
  }

  /* ─────────────────────────────────────────────────────────
     setRemoteUrl — muda a URL e re-faz o fetch
     Útil quando a Duo app sabe o endpoint certo
  ───────────────────────────────────────────────────────── */
  function setRemoteUrl(url) {
    CFG.remoteUrl = url;
    try { localStorage.setItem('kxat_arch_url', url); } catch (e) {}
    console.log('[ArchLoader] URL atualizada →', url);
    return fetchAndApply(url);
  }

  /* ─────────────────────────────────────────────────────────
     patchFromObject — injeta um arquétipo avulso sem fetch
     Útil quando a Duo app envia via postMessage ou WebSocket
  ───────────────────────────────────────────────────────── */
  function patchFromObject(rawArch) {
    const arch = normalizeArch(rawArch);
    if (!arch) { console.warn('[ArchLoader] patchFromObject: objeto inválido'); return; }

    // Merge: adiciona ou substitui no array vivo
    const existing = _archetypes.findIndex(a => a.id === arch.id);
    if (existing >= 0) {
      _archetypes[existing] = arch;
    } else {
      _archetypes.push(arch);
    }

    // Rebake CSS
    injectArchCSS(_archetypes);

    // Aplica se for o ativo
    if (!_archetypes[_activeIdx] || _archetypes[_activeIdx].id === arch.id) {
      applyTheme(arch);
    }

    saveCache(_archetypes);
    console.log(`[ArchLoader] patchFromObject → ${arch.name} merged`);
    window.dispatchEvent(new CustomEvent('KXAT_ARCH_PATCHED', { detail: arch }));
  }

  /* ─────────────────────────────────────────────────────────
     patchFromJSON — recebe string ou objeto JSON completo
  ───────────────────────────────────────────────────────── */
  function patchFromJSON(jsonStringOrObj) {
    try {
      const data = typeof jsonStringOrObj === 'string'
        ? JSON.parse(jsonStringOrObj)
        : jsonStringOrObj;
      const arr = normalizeJSON(data);
      if (!arr.length) throw new Error('Nenhum arquétipo válido');
      loadArchetypes(arr, 'patchFromJSON');
    } catch (e) {
      console.warn('[ArchLoader] patchFromJSON falhou:', e.message);
    }
  }

  /* ─────────────────────────────────────────────────────────
     postMessage bridge — Duo app pode enviar:
     { type: 'KXAT_PATCH_ARCH', payload: { arch: {...} } }
     { type: 'KXAT_LOAD_JSON',  payload: { data: {...} } }
     { type: 'KXAT_SET_URL',    payload: { url: '...' }  }
     { type: 'KXAT_CYCLE',      payload: { step: 1 }     }
  ───────────────────────────────────────────────────────── */
  window.addEventListener('message', (e) => {
    const msg = e.data;
    if (!msg || typeof msg !== 'object') return;

    switch (msg.type) {
      case 'KXAT_PATCH_ARCH':
        if (msg.payload?.arch) patchFromObject(msg.payload.arch);
        break;
      case 'KXAT_LOAD_JSON':
        if (msg.payload?.data) patchFromJSON(msg.payload.data);
        break;
      case 'KXAT_SET_URL':
        if (msg.payload?.url) setRemoteUrl(msg.payload.url);
        break;
      case 'KXAT_CYCLE':
        cycleArch(msg.payload?.step ?? 1);
        break;
      case 'KXAT_SET_ARCH':
        if (msg.payload?.id) setArchById(msg.payload.id);
        break;
    }
  });

  /* ─────────────────────────────────────────────────────────
     Integração com KOBLLUX.updateArchetype existente
     Se kob-glue-dh10.js já existe, faz hook
  ───────────────────────────────────────────────────────── */
  function hookKOBLLUX() {
    if (!window.KOBLLUX) return;

    // Sobrescreve updateArchetype para usar nosso array vivo
    const _oldUpdate = window.KOBLLUX.updateArchetype;
    window.KOBLLUX.updateArchetype = function (idx) {
      // Tenta usar o array vivo do loader
      if (_archetypes.length) {
        setArchByIndex(idx);
      } else if (typeof _oldUpdate === 'function') {
        _oldUpdate.call(this, idx);
      }
    };

    // Expõe cycleArch no KOBLLUX
    window.KOBLLUX.cycleArch = cycleArch;
    console.log('[ArchLoader] Hook KOBLLUX.updateArchetype instalado');
  }

  /* ─────────────────────────────────────────────────────────
     API PÚBLICA — window.KOBLLUX_ARCH_LOADER
  ───────────────────────────────────────────────────────── */
  window.KOBLLUX_ARCH_LOADER = {
    // Leitura
    getArchetypes:  ()  => _archetypes.slice(),
    getActive:      ()  => _archetypes[_activeIdx] || null,
    getActiveIdx:   ()  => _activeIdx,

    // Navegação
    setArchById,
    setArchByIndex,
    cycleArch,

    // Fetch / Patch
    fetch:          ()  => fetchAndApply(CFG.remoteUrl),
    setRemoteUrl,
    patchFromObject,
    patchFromJSON,

    // Polling
    startPolling,
    stopPolling,

    // Config
    getCfg: ()  => ({ ...CFG }),
    setCfg: (patch) => Object.assign(CFG, patch),
  };

  /* ─────────────────────────────────────────────────────────
     BOOT
  ───────────────────────────────────────────────────────── */
  // Aguarda voices do KxaT-inline-00.js se necessário
  if (window.KOBLLUX_VOICES && Object.keys(window.KOBLLUX_VOICES).length) {
    // Voices já carregadas — usa como fallback imediato antes do fetch
    const arr = normalizeJSON(Object.values(window.KOBLLUX_VOICES));
    if (arr.length) {
      _archetypes = arr;
      injectArchCSS(arr);
      const savedId = localStorage.getItem(CFG.archIdxKey);
      if (savedId) setArchById(savedId); else setArchByIndex(0);
    }
  }

  // Fetch remoto — substitui o fallback quando chegar
  fetchAndApply(CFG.remoteUrl);

  // Hook KOBLLUX global (pode não estar pronto ainda)
  hookKOBLLUX();
  window.addEventListener('KOBLLUX_VOICES_READY', () => {
    hookKOBLLUX();
    // Re-enriquece o array com dados de voz do KxaT-inline-00.js
    if (window.KOBLLUX_VOICES) {
      _archetypes = _archetypes.map(arch => {
        const voice = window.KOBLLUX_VOICES[arch.id];
        if (voice) return Object.assign({}, arch, {
          voice: voice.voice || arch.voice,
          lang:  voice.lang  || arch.lang,
          rate:  voice.rate  || arch.rate,
          pitch: voice.pitch || arch.pitch,
        });
        return arch;
      });
      saveCache(_archetypes);
    }
  });

  // Polling automático se configurado
  if (CFG.pollInterval > 0) startPolling(CFG.pollInterval);

  console.log('[ArchLoader] ✓ KxaT-arch-loader ativo | html[data-arch] root | fetch:', CFG.remoteUrl);

})();