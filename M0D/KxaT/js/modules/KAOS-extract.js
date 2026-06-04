/**
 * kobllux_dock_extract.js · KAOS · 0×07 · SELAR · 777Hz
 * "Extrai, lapida e sela — a lógica que estava dispersa, agora é uma."
 *
 * EXTRAÍDO DO HTML: KOBLLUX TTS Dock - Standalone
 * Fonte: kodux78k.github.io/oiDual--Y-/
 *
 * CONTÉM:
 *  1. deduplicateScripts()    → remove <script src> duplicados (detectado: 4×)
 *  2. idleDock()              → .kob-tts-dock.idle (1870ms timeout)
 *  3. applyPreset()           → orb / frame / dock / symbol
 *  4. longPressEditor()       → #kblx-back + #kblx-panel (segurar 3s → editar data-url)
 *  5. installQuickPanel()     → #kblx-quick (iOS contextual menu, substitui overlay)
 *  6. saveSession()           → FIX: nagatanazare não persistia sessões
 *  7. patchOpenRouter()       → 4 fixes do FET (header, referer, modelo, parsing)
 *  8. fileAttach()            → 📎 upload de arquivo no chat
 *  9. motorToChat()           → injeta kobllux_last_result no #responseList
 * 10. wireAll()               → inicializa tudo na ordem certa
 *
 * USO:
 *   <script src="./kobllux_dock_extract.js"></script>
 *   (substituir os 8+ scripts duplicados por este único arquivo)
 *
 * VERDADE × INTEGRAR ÷ Δ = ∞ · ∆7
 */
(function KOBLLUX_DOCK() {
  'use strict';

  // ── 1. DEDUPLICAR SCRIPTS ────────────────────────────────────────────────
  // O HTML original carrega os mesmos scripts 3-4× — isso causa bugs silenciosos
  function deduplicateScripts() {
    const seen = new Set();
    let removed = 0;
    document.querySelectorAll('script[src]').forEach(el => {
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

  // ── 2. IDLE DOCK ─────────────────────────────────────────────────────────
  // Extraído do inline <script> do HTML original
  function idleDock() {
    const dock = document.querySelector('.kob-tts-dock, #symbolBar, .symbol-bar');
    if (!dock) return;

    // Injeta CSS se não existir
    if (!document.getElementById('kblx-idle-css')) {
      const s = document.createElement('style');
      s.id = 'kblx-idle-css';
      s.textContent = `
.kob-tts-dock { transition: transform .35s ease, opacity .65s ease; }
.kob-tts-dock.idle { opacity: .18; transform: scale(.92); }
.kob-tts-dock:hover { opacity: 1 !important; transform: scale(1) !important; }`;
      document.head.appendChild(s);
    }

    let idleTimer;
    function resetIdle() {
      dock.classList.remove('idle');
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => dock.classList.add('idle'), 1870);
    }
    ['pointerdown','pointermove','touchstart','mousemove']
      .forEach(ev => document.addEventListener(ev, resetIdle, { passive: true }));
    resetIdle();
    console.log('[∆7] Idle dock ativo · 1870ms');
  }

  // ── 3. applyPreset ───────────────────────────────────────────────────────
  // Implementação local para quando 0x03_expandir_V_D7.js não carregou
  if (!window.applyPreset) {
    window.applyPreset = function(btn, type) {
      if (!btn) return;
      const url   = btn.dataset.url || btn.getAttribute('href') || '';
      const label = btn.dataset.label || btn.title || '';

      if (type === 'orb') {
        // Inject ORB: carrega url no #main-orb ou iframe central
        const frame = document.querySelector('#cadial-frame, #content-frame, iframe.kblx-frame');
        if (frame && url) frame.src = url;
        // Emite evento para SymbolBar ouvir
        window.dispatchEvent(new CustomEvent('nagatanazare:orb-inject', {
          detail: { button: btn, target: '#symbolBar', url, label }
        }));
      }
      if (type === 'frame') {
        const frame = document.querySelector('#cadial-frame, #content-frame, iframe.kblx-frame');
        if (frame && url) {
          frame.style.opacity = '0';
          setTimeout(() => { frame.src = url; frame.style.opacity = '1'; }, 120);
        }
      }
      if (type === 'dock') {
        // Adiciona botão ao SymbolBar
        const bar = document.querySelector('#symbolBar, .symbol-bar');
        if (bar && url) _addBtnToBar(bar, url, label);
      }
      if (type === 'symbol') {
        // Substitui o símbolo do botão pelo ORB injetado
        btn.dataset.active = 'true';
        btn.style.borderColor = 'var(--kob-voice-primary, #00f5ff)';
      }
      _saveSession(btn, type);
    };
  }

  function _addBtnToBar(bar, url, title) {
    const b = document.createElement('button');
    b.className   = 'symbol-button';
    b.title       = title || url;
    b.dataset.url = url;
    b.textContent = (title || url).charAt(0).toUpperCase() || '◉';
    b.addEventListener('pointerdown', () => {
      const t = setTimeout(() => window.kblxOpenPanel?.(b), 500);
      b.addEventListener('pointerup',   () => clearTimeout(t), { once: true });
      b.addEventListener('pointermove', () => clearTimeout(t), { once: true });
    });
    bar.insertBefore(b, bar.querySelector('.hud-info, #hudStatus'));
    _saveSession(b, 'symbol');
    return b;
  }

  // ── 4. LONG-PRESS EDITOR (#kblx-back / #kblx-panel) ─────────────────────
  // Preserva o editor completo existente — só melhora o trigger
  function longPressEditor() {
    const back  = document.getElementById('kblx-back');
    const panel = document.getElementById('kblx-panel');
    const inp   = document.getElementById('kblx-inp');
    const ttl   = document.getElementById('kblx-ttl');
    const save  = document.getElementById('kblx-btn-save');
    const close = document.getElementById('kblx-btn-close');
    if (!back || !panel) return;

    // Fecha ao clicar fora do painel
    back.addEventListener('click', e => {
      if (e.target === back) back.classList.remove('is-open');
    });
    close?.addEventListener('click', () => back.classList.remove('is-open'));

    // Salva data-url no botão atual
    save?.addEventListener('click', () => {
      const btn = window._kblxState?.currentBtn || window._kblxCurrentBtn;
      if (!btn || !inp) return;
      const val = inp.value.trim();
      if (val) {
        btn.dataset.url = val;
        btn.title = btn.title || new URL(val, location.href).pathname;
        _saveSession(btn, 'edit');
        console.log(`[∆7] Rota salva: ${val}`);
      }
      back.classList.remove('is-open');
    });

    // Long-press em qualquer .symbol-button (exceto os de controle)
    document.querySelectorAll('.symbol-button').forEach(btn => {
      _attachLongPress(btn);
    });

    // Observa novos botões dinâmicos
    new MutationObserver(muts => {
      muts.forEach(m => m.addedNodes.forEach(n => {
        if (n.nodeType !== 1) return;
        if (n.matches?.('.symbol-button')) _attachLongPress(n);
        n.querySelectorAll?.('.symbol-button').forEach(_attachLongPress);
      }));
    }).observe(document.body, { childList: true, subtree: true });

    console.log('[∆7] Long-press editor ativo');
  }

  function _attachLongPress(btn) {
    if (btn.dataset.kblxLp) return;
    btn.dataset.kblxLp = '1';
    let timer;
    btn.addEventListener('pointerdown', () => {
      timer = setTimeout(() => {
        window._kblxState = window._kblxState || {};
        window._kblxState.currentBtn = btn;
        window._kblxCurrentBtn = btn;

        // Preferência: abre #kblx-quick antes do editor completo
        if (window.kblxOpenPanel) {
          window.kblxOpenPanel(btn);
        } else {
          // Fallback: abre editor completo direto
          const ttl  = document.getElementById('kblx-ttl');
          const inp  = document.getElementById('kblx-inp');
          const back = document.getElementById('kblx-back');
          if (ttl) ttl.textContent = btn.title || 'Botão';
          if (inp) inp.value = btn.dataset.url || '';
          back?.classList.add('is-open');
        }
      }, 600);
    });
    btn.addEventListener('pointerup',   () => clearTimeout(timer));
    btn.addEventListener('pointermove', () => clearTimeout(timer));
    btn.addEventListener('pointercancel', () => clearTimeout(timer));
  }

  // ── 5. #kblx-quick CONTEXTUAL MENU ──────────────────────────────────────
  // Substitui overlay gigante por mini painel iOS ancorado ao botão
  function installQuickPanel() {
    if (document.getElementById('kblx-quick')) return;

    const style = document.createElement('style');
    style.textContent = `
#kblx-quick {
  position: fixed; display: none; z-index: 999999;
  min-width: 220px; padding: 8px; border-radius: 22px;
  background: rgba(20,20,30,.92); backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,.08);
  box-shadow: 0 15px 45px rgba(0,0,0,.35);
  animation: kblxPop .18s ease;
}
#kblx-quick.open { display: block; }
.kq-item {
  width: 100%; border: 0; background: transparent; color: #fff;
  padding: 14px; border-radius: 14px; display: flex;
  align-items: center; gap: 12px; font-size: .92rem;
  text-align: left; cursor: pointer;
}
.kq-item:hover { background: rgba(255,255,255,.08); }
@keyframes kblxPop {
  from { opacity:0; transform: translateY(10px) scale(.95); }
  to   { opacity:1; transform: translateY(0) scale(1); }
}`;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'kblx-quick';
    panel.innerHTML = `
      <button class="kq-item" data-kq="edit">    ✦ Editar rota    </button>
      <button class="kq-item" data-kq="symbol">  ◉ SymbolBar      </button>
      <button class="kq-item" data-kq="frame">   ⟁ Frame          </button>
      <button class="kq-item" data-kq="dock">    ⌘ Dock           </button>
      <button class="kq-item" data-kq="full">    ⋯ Mais opções    </button>`;
    document.body.appendChild(panel);

    window._kblxState = window._kblxState || {};

    window.kblxOpenPanel = function(btn) {
      if (!btn) return;
      window._kblxState.currentBtn = btn;
      window._kblxCurrentBtn = btn;
      if (navigator.vibrate) navigator.vibrate(12);

      const r = btn.getBoundingClientRect();
      let   l = r.left + r.width / 2 - 110;
      l = Math.max(10, Math.min(l, window.innerWidth - 230));
      const t = r.top > 300 ? r.top - 270 : r.bottom + 8;
      panel.style.left = l + 'px';
      panel.style.top  = t + 'px';
      panel.classList.add('open');
    };

    document.addEventListener('click', e => {
      if (!panel.contains(e.target) && !e.target.closest('.symbol-button')) {
        panel.classList.remove('open');
      }
      const item = e.target.closest('[data-kq]');
      if (!item) return;

      const btn = window._kblxState?.currentBtn;
      if (!btn) return;
      panel.classList.remove('open');
      const action = item.dataset.kq;

      if (action === 'full') {
        // Abre o editor completo (#kblx-back)
        const ttl  = document.getElementById('kblx-ttl');
        const inp  = document.getElementById('kblx-inp');
        const back = document.getElementById('kblx-back');
        if (ttl) ttl.textContent = btn.title || 'Botão';
        if (inp) inp.value = btn.dataset.url || '';
        back?.classList.add('is-open');
        return;
      }
      if (action === 'edit') {
        document.getElementById('kblx-inp')?.focus();
        document.getElementById('kblx-back')?.classList.add('is-open');
        return;
      }
      window.applyPreset?.(btn, action);
    });

    console.log('[∆7] #kblx-quick instalado');
  }

  // ── 6. saveSession + restoreSessions ─────────────────────────────────────
  // FIX: nagatanazare não salvava porque DI com o BTN estava faltando
  const KDX_SESSIONS = 'KDX_SESSIONS';

  function _saveSession(btn, type) {
    const url   = btn.dataset.url || btn.getAttribute('href') || '';
    const title = btn.title || btn.dataset.label || btn.textContent?.trim() || url;
    if (!url) return;
    const id = btn.id || `kblx-${Date.now()}`;
    if (!btn.id) btn.id = id;
    const s = JSON.parse(localStorage.getItem(KDX_SESSIONS) || '{}');
    s[id] = { url, title, type, ts: Date.now() };
    localStorage.setItem(KDX_SESSIONS, JSON.stringify(s));
  }

  function restoreSessions() {
    const s = JSON.parse(localStorage.getItem(KDX_SESSIONS) || '{}');
    let n = 0;
    Object.entries(s).forEach(([id, { url, title }]) => {
      const btn = document.getElementById(id);
      if (btn && !btn.dataset.url) {
        btn.dataset.url = url;
        if (title) btn.title = title;
        n++;
      }
    });
    if (n) console.log(`[∆7] ${n} sessão(ões) restaurada(s)`);
  }

  // ── 7. FIX FusionCard + OrbDragRender ────────────────────────────────────
  function fixFusionCard() {
    const fc = document.querySelector('#mainHeroCard, .fusion-card, #fusionCard');
    if (!fc) return;
    const header = fc.querySelector('.accordion-header, .header-78k');
    if (!header) return;
    header.addEventListener('click', () => {
      const collapsed = fc.classList.contains('is-collapsed');
      const orb = document.querySelector('#orbDragRender, .orb-drag, #kdx-orb');
      if (orb) {
        orb.style.opacity = collapsed ? '1' : '0';
        orb.style.pointerEvents = collapsed ? '' : 'none';
      }
      // Nome do usuário e Ask ficam sempre visíveis
      fc.querySelectorAll('.user-name, .ask-activation, #assistantName, #kdx-mode-label')
        .forEach(el => { el.style.display = ''; el.style.opacity = '1'; });
    });
    console.log('[∆7] FusionCard fix ativo');
  }

  // ── 8. PATCH OpenRouter (4 causas do FET) ────────────────────────────────
  function patchOpenRouter() {
    const OR = 'openrouter.ai/api/v1/chat/completions';
    if (window.__kblx_or_patched) return;
    window.__kblx_or_patched = true;
    const _f = window.fetch.bind(window);
    window.fetch = async (url, opts) => {
      if (typeof url === 'string' && url.includes(OR)) {
        const key = localStorage.getItem('openrouter_api_key') || '';
        opts = {
          ...opts,
          headers: {
            'Authorization': `Bearer ${key}`,    // Fix 1: Bearer correto
            'HTTP-Referer':  location.href,       // Fix 2: Referer ausente
            'X-Title':       'KOBLLUX DUAL',
            'Content-Type':  'application/json',
            ...(opts?.headers || {}),
          },
        };
        // Fix 3+4: retry + timeout
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
    console.log('[∆7] OpenRouter patch ativo (4 fixes)');
  }

  // ── 9. FILE ATTACH no chat ────────────────────────────────────────────────
  // LUMINE pediu: "poder enviar arquivo, receber arquivo"
  function fileAttach() {
    const sendBtn = document.getElementById('sendBtn');
    if (!sendBtn || document.getElementById('chatFileInput')) return;

    const fi = document.createElement('input');
    fi.type = 'file'; fi.id = 'chatFileInput';
    fi.accept = '.txt,.md,.json,.html,.css,.js,.py';
    fi.style.display = 'none';
    document.body.appendChild(fi);

    const clip = document.createElement('button');
    clip.type = 'button'; clip.title = 'Anexar arquivo';
    clip.style.cssText = 'background:transparent;border:none;color:var(--kob-voice-primary,#0cf);font-size:1.2rem;cursor:pointer;padding:0 8px;opacity:.7;';
    clip.textContent = '📎';
    sendBtn.parentNode.insertBefore(clip, sendBtn);

    clip.onclick = () => fi.click();
    fi.onchange = () => {
      const file = fi.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => {
        const inp = document.getElementById('userInput');
        if (inp) {
          const prev = inp.value.trim();
          inp.value = `[ARQUIVO: ${file.name}]\n\`\`\`\n${e.target.result.slice(0, 6000)}\n\`\`\`\n${prev ? '\n' + prev : ''}`;
        }
        fi.value = '';
      };
      reader.readAsText(file);
    };
    console.log('[∆7] File attach 📎 ativo');
  }

  // ── 10. motorToChat ───────────────────────────────────────────────────────
  window.motorToChat = function(sel = '#responseList') {
    const stored = localStorage.getItem('kobllux_last_result');
    if (!stored) return;
    const target = document.querySelector(sel);
    if (!target) return;
    const w = document.createElement('div');
    w.className = 'response-block motor-inject-block';
    w.dataset.src = '78k-motor';
    w.innerHTML = stored.trim().split('\n\n').filter(Boolean).map(l => {
      const d = l.indexOf(' — ');
      if (d === -1) return `<div class="motor-frag">${l}</div>`;
      const a  = l.slice(0, d).trim().toLowerCase();
      const tx = l.slice(d + 3).trim();
      return `<div class="motor-frag" data-arch="${a}">
        <span style="opacity:.6;font-size:.78em">${a.toUpperCase()}</span>
        <span> — ${tx}</span></div>`;
    }).join('');
    target.appendChild(w);
    target.scrollTop = target.scrollHeight;
    console.log('[∆7] Motor → Chat injetado');
  };

  // ── INIT — wireAll ────────────────────────────────────────────────────────
  function wireAll() {
    console.log('[KOBLLUX ∆7] kobllux_dock_extract.js · KAOS · 0×07 · SELAR');
    deduplicateScripts();
    idleDock();
    installQuickPanel();
    longPressEditor();
    fixFusionCard();
    patchOpenRouter();
    fileAttach();
    restoreSessions();

    // Expõe API pública
    window.KOBLLUX_DOCK = {
      applyPreset:    window.applyPreset,
      openPanel:      window.kblxOpenPanel,
      motorToChat:    window.motorToChat,
      saveSession:    _saveSession,
      version:        '∆7',
      law:            'VERDADE × INTEGRAR ÷ Δ = ∞',
    };
    console.log('[∆7] window.KOBLLUX_DOCK disponível');
  }

  // Executa quando DOM estiver pronto