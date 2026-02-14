/* combined.js
   Unificação coerente dos módulos JS do projeto DUAL.Infodose
   TRINITY ∴ KOBLLUX — modo: dual.infodose — espetáculo cinematográfico
   -------------------------
   Instruções: coloque este arquivo em assets/js/combined.js e aponte index.html para ele.
   Pontos marcados: // --- MODULE PLACEHOLDER ---  -> cole aqui trechos específicos dos módulos se precisar.
*/

(function () {
  'use strict';

  /* -------------------------
     Utilitários
  ------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));
  const on = (el, ev, fn) => el && el.addEventListener(ev, fn);
  const off = (el, ev, fn) => el && el.removeEventListener(ev, fn);
  const isHidden = el => !el || el.classList.contains('activation-hidden') || el.hidden;
  const cls = (el, c) => el && el.classList.toggle(c);

  function safeGet(id) { return document.getElementById(id); }

  // Debounce
  function debounce(fn, t = 120) {
    let to;
    return (...a) => { clearTimeout(to); to = setTimeout(() => fn(...a), t); };
  }

  // Simple local "vault" encode/decode (not cryptographically secure, placeholder)
  const vault = {
    key: 'kodux_vault',
    passKey: 'kodux_vault_pass',
    encode: (str) => btoa(unescape(encodeURIComponent(str || ''))),
    decode: (enc) => {
      try { return decodeURIComponent(escape(atob(enc))); } catch (e) { return ''; }
    },
    save: (obj) => localStorage.setItem(vault.key, vault.encode(JSON.stringify(obj))),
    load: () => {
      const raw = localStorage.getItem(vault.key);
      if (!raw) return null;
      try { return JSON.parse(vault.decode(raw)); } catch (e) { return null; }
    },
    setPass: (p) => localStorage.setItem(vault.passKey, vault.encode(p)),
    checkPass: (p) => {
      const stored = localStorage.getItem(vault.passKey);
      if (!stored) return false;
      return vault.decode(stored) === p;
    }
  };

  /* -------------------------
     DOM normalization & fixes
     (resolve duplicates found in the markup)
  ------------------------- */
  function normalizeDOM() {
    // If there are multiple <body> tags (yikes), prefer the last and migrate children
    const bodies = document.getElementsByTagName('body');
    if (bodies.length > 1) {
      const keep = bodies[bodies.length - 1];
      // move children of earlier bodies into the last
      for (let i = 0; i < bodies.length - 1; i++) {
        while (bodies[i].childNodes.length) {
          keep.appendChild(bodies[i].childNodes[0]);
        }
        bodies[i].parentNode && bodies[i].parentNode.removeChild(bodies[i]);
      }
      // ensure html/body references still work
      document.body = keep;
    }

    // If duplicate particles-js containers, keep the first and remove subsequent ones
    const particles = $$('[id="particles-js"]');
    if (particles.length > 1) {
      particles.slice(1).forEach(n => n.parentNode && n.parentNode.removeChild(n));
    }
  }

  /* -------------------------
     Core UI: sections, mode, drawers, toggles
  ------------------------- */
  function toggleSection(id) {
    const el = safeGet(id);
    if (!el) return;
    el.classList.toggle('activation-hidden');
  }

  function setMode(mode) {
    const modes = ['card','orb','hud'];
    if (!modes.includes(mode)) return;
    // body classes: mode-card, mode-orb, mode-hud
    document.body.classList.remove('mode-card','mode-orb','mode-hud');
    document.body.classList.add('mode-' + mode);
    // update UI buttons
    $$('.mode-btn').forEach(b => b.classList.toggle('active-mode', b.id && b.id.includes(mode)));
    // small hook for custom logic
    const ev = new CustomEvent('dual:modechange', { detail: { mode } });
    window.dispatchEvent(ev);
  }

  function toggleDrawer(id) {
    const el = safeGet(id);
    if (!el) return;
    el.classList.toggle('open');
    el.style.display = el.classList.contains('open') ? '' : 'none';
  }

  function goToIndex() {
    // Behavior: focus the main input and animate a tiny feedback
    const input = safeGet('userInput') || safeGet('inputUser');
    if (input) {
      input.focus();
      input.classList.add('pulse-feedback');
      setTimeout(() => input.classList.remove('pulse-feedback'), 500);
    } else window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* -------------------------
     Small preview, greeting, clock
  ------------------------- */
  function initGreetingAndClock() {
    const lblName = safeGet('lblName') || safeGet('usernameDisplay') || null;
    const clockTime = safeGet('clockTime');
    // load name from localStorage
    const savedName = localStorage.getItem('dual_username') || 'Convidado';
    if (lblName) lblName.textContent = savedName;

    function updateClock() {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2,'0');
      const mm = String(now.getMinutes()).padStart(2,'0');
      if (clockTime) clockTime.textContent = `${hh}:${mm}`;
    }

    updateClock();
    setInterval(updateClock, 60 * 1000);

    // update when user changes cockpit input
    const inputCockpit = safeGet('inputUserId') || safeGet('inputUser');
    if (inputCockpit) {
      on(inputCockpit, 'change', (e) => {
        const v = e.target.value || 'Convidado';
        if (lblName) lblName.textContent = v;
        localStorage.setItem('dual_username', v);
      });
    }
  }

  /* -------------------------
     Audio + Logo click + iframe lazy control
  ------------------------- */
  function initMediaAndIframe() {
    const audio = safeGet('transitionSound');
    const logo = safeGet('logo');
    const iframe = document.querySelector('iframe[src*="kodux78k.github.io"]');
    if (logo && audio) {
      on(logo, 'click', () => {
        try { audio.currentTime = 0; audio.play(); } catch (e) {/* autoplay policy */}
        goToIndex();
      });
    }

    // Lazy fallback: if iframe has loading=lazy it's fine; but if you want "local mode" we can swap src to data-src
    if (iframe) {
      // Ensure we don't unintentionally load an external iframe in local mode; keep src but mark for potential replacement.
      iframe.dataset.originalSrc = iframe.getAttribute('src');
      // If running on file:// you might want to disable iframe or replace with local content.
      window.addEventListener('dual:localmode', (e) => {
        // custom event consumers can replace iframe with local version
        const localPath = e.detail && e.detail.localPath;
        if (localPath) iframe.src = localPath;
      });
    }
  }

  /* -------------------------
     Keys Manager / Vault UI
  ------------------------- */
  function initVaultAndKeys() {
    const keysModal = safeGet('keysModal');
    const vaultModal = safeGet('vaultModal');
    const keyList = safeGet('keyList');
    const addKeyBtn = safeGet('addKeyBtn');
    const keyNameInput = safeGet('keyNameInput');
    const keyTokenInput = safeGet('keyTokenInput');
    const closeKeysBtn = safeGet('closeKeysBtn');
    const lockVaultBtn = safeGet('lockVaultBtn');
    const vaultUnlockBtn = safeGet('vaultUnlockBtn');
    const vaultPassInput = safeGet('vaultPassInput');
    const vaultCancelBtn = safeGet('vaultCancelBtn');
    const vaultStatusText = safeGet('vaultStatusText');

    function renderKeyList() {
      const data = vault.load() || { keys: [] };
      keyList.innerHTML = '';
      if (!data.keys || data.keys.length === 0) {
        keyList.innerHTML = '<div style="color:rgba(255,255,255,0.5)">Nenhuma chave</div>';
        return;
      }
      data.keys.forEach((k, idx) => {
        const div = document.createElement('div');
        div.className = 'key-row';
        div.innerHTML = `
          <div style="display:flex;gap:8px;align-items:center;justify-content:space-between">
            <div><strong>${escapeHtml(k.name)}</strong><div style="font-size:0.8rem;opacity:.6">${k.token ? 'token ••••' : 'sem token'}</div></div>
            <div style="display:flex;gap:8px">
              <button data-idx="${idx}" class="small-btn key-copy">Copiar</button>
              <button data-idx="${idx}" class="small-btn key-del danger">Excluir</button>
            </div>
          </div>
        `;
        keyList.appendChild(div);
      });

      // attach handlers
      $$('.key-copy', keyList).forEach(btn => {
        on(btn, 'click', e => {
          const idx = +btn.dataset.idx;
          const data = vault.load() || { keys: [] };
          const token = data.keys[idx] && data.keys[idx].token ? data.keys[idx].token : '';
          navigator.clipboard && navigator.clipboard.writeText(token || '').then(() => {
            btn.textContent = 'COPIADO';
            setTimeout(() => btn.textContent = 'Copiar', 900);
          }).catch(() => {});
        });
      });

      $$('.key-del', keyList).forEach(btn => {
        on(btn, 'click', e => {
          const idx = +btn.dataset.idx;
          const data = vault.load() || { keys: [] };
          data.keys.splice(idx, 1);
          vault.save(data);
          renderKeyList();
        });
      });
    }

    // add key
    if (addKeyBtn) on(addKeyBtn, 'click', () => {
      const name = (keyNameInput && keyNameInput.value || '').trim();
      const token = (keyTokenInput && keyTokenInput.value || '').trim();
      if (!name) {
        alert('Informe um nome para a chave');
        return;
      }
      const data = vault.load() || { keys: [] };
      data.keys = data.keys || [];
      data.keys.push({ name, token });
      vault.save(data);
      keyNameInput.value = '';
      keyTokenInput.value = '';
      renderKeyList();
    });

    // open/close keys modal
    if (closeKeysBtn) on(closeKeysBtn, 'click', () => {
      keysModal.setAttribute('aria-hidden', 'true');
      keysModal.style.display = 'none';
    });

    // vault lock/unlock
    if (lockVaultBtn) on(lockVaultBtn, 'click', () => {
      // simple lock: clear in-memory and hide modal
      keysModal.setAttribute('aria-hidden', 'true');
      keysModal.style.display = 'none';
      vault.setPass(''); // NOT ideal, placeholder -> could implement actual lock
      vault.save({ keys: [] });
      renderKeyList();
      if (vaultStatusText) vaultStatusText.textContent = 'Cofre Bloqueado';
    });

    if (vaultUnlockBtn) on(vaultUnlockBtn, 'click', () => {
      const pass = vaultPassInput && vaultPassInput.value || '';
      if (!pass) {
        alert('Digite a senha do cofre');
        return;
      }
      if (!localStorage.getItem(vault.passKey)) {
        // first time: set pass
        vault.setPass(pass);
        if (vaultStatusText) vaultStatusText.textContent = 'Cofre Aberto';
        vaultModal.setAttribute('aria-hidden', 'true');
        vaultModal.style.display = 'none';
        renderKeyList();
        return;
      }
      if (vault.checkPass(pass)) {
        vaultModal.setAttribute('aria-hidden', 'true');
        vaultModal.style.display = 'none';
        if (vaultStatusText) vaultStatusText.textContent = 'Cofre Aberto';
        renderKeyList();
      } else {
        alert('Senha incorreta.');
      }
    });

    if (vaultCancelBtn) on(vaultCancelBtn, 'click', () => {
      vaultModal.setAttribute('aria-hidden', 'true');
      vaultModal.style.display = 'none';
    });

    // initial render
    renderKeyList();
  }

  /* -------------------------
     System Config / Save / Load
  ------------------------- */
  function initSystemConfig() {
    const saveBtn = safeGet('saveSystemBtn');
    const infodoseNameInput = safeGet('infodoseNameInput');
    const apiKeyInput = safeGet('apiKeyInput');
    const modelSelect = safeGet('modelSelect');

    function loadConfigToUI() {
      const cfg = JSON.parse(localStorage.getItem('dual_system_cfg') || '{}');
      if (infodoseNameInput) infodoseNameInput.value = cfg.name || '';
      if (apiKeyInput) apiKeyInput.value = cfg.apiKey || '';
      if (modelSelect) modelSelect.value = cfg.model || '';
    }

    function saveConfigFromUI() {
      const cfg = {
        name: infodoseNameInput ? infodoseNameInput.value.trim() : '',
        apiKey: apiKeyInput ? apiKeyInput.value.trim() : '',
        model: modelSelect ? modelSelect.value : ''
      };
      localStorage.setItem('dual_system_cfg', JSON.stringify(cfg));
      // dispatch event
      window.dispatchEvent(new CustomEvent('dual:configSaved', { detail: cfg }));
      // small UI feedback
      if (saveBtn) {
        saveBtn.textContent = 'SALVO ✓';
        setTimeout(() => { if (saveBtn) saveBtn.textContent = 'SALVAR CONFIGURAÇÃO'; }, 900);
      }
    }

    if (saveBtn) on(saveBtn, 'click', saveConfigFromUI);
    loadConfigToUI();
  }

  /* -------------------------
     Drag handle (simple) & card open/close demo
  ------------------------- */
  function initCardBehavior() {
    const mainCard = safeGet('mainCard');
    const drag = safeGet('drag-handle') || safeGet('cardHeader') || null;
    const smallPreview = safeGet('smallPreview');

    if (!mainCard) return;

    // open/close by click on card header
    const header = safeGet('cardHeader');
    if (header) {
      on(header, 'click', (e) => {
        if (mainCard.classList.contains('closed')) {
          mainCard.classList.remove('closed');
        } else {
          mainCard.classList.add('closed');
        }
      });
    }

    // small preview hover behavior
    if (smallPreview) {
      on(smallPreview, 'click', () => {
        mainCard.classList.remove('closed');
      });
    }
  }

  /* -------------------------
     File inputs: css upload & bg upload
  ------------------------- */
  function initFileUploads() {
    const cssUpload = safeGet('cssUploadInput');
    const customCssInput = safeGet('customCssInput');
    const btnClearCss = safeGet('btnClearCss');
    const bgUploadInput = safeGet('bgUploadInput');

    if (cssUpload && customCssInput) {
      on(cssUpload, 'change', (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
          customCssInput.value = reader.result || '';
          localStorage.setItem('dual_custom_css', reader.result || '');
        };
        reader.readAsText(f);
      });
      // load saved css
      const saved = localStorage.getItem('dual_custom_css');
      if (saved) customCssInput.value = saved;
    }
    if (btnClearCss) on(btnClearCss, 'click', () => {
      customCssInput.value = '';
      localStorage.removeItem('dual_custom_css');
    });

    if (bgUploadInput) {
      on(bgUploadInput, 'change', (e) => {
        const f = e.target.files && e.target.files[0];
        if (!f) return;
        const reader = new FileReader();
        reader.onload = () => {
          // save as data URL and render thumbnail
          const url = reader.result;
          localStorage.setItem('dual_bg_custom', url);
          const panel = safeGet('bgThumbPanel');
          if (panel) {
            const img = document.createElement('img');
            img.src = url;
            img.style.maxWidth = '100%';
            img.style.borderRadius = '6px';
            panel.prepend(img);
          }
        };
        reader.readAsDataURL(f);
      });
    }
  }

  /* -------------------------
     Minor helpers for safety / escaping
  ------------------------- */
  function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/[&<"'>]/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
  }

  /* -------------------------
     Init everything
  ------------------------- */
  function boot() {
    normalizeDOM();

    initGreetingAndClock();
    initMediaAndIframe();
    initVaultAndKeys();
    initSystemConfig();
    initCardBehavior();
    initFileUploads();

    // Wire common buttons & controls from markup
    on(document, 'click', (ev) => {
      const t = ev.target;
      // HUD / ORB toggle
      if (t && t.matches && (t.matches('#orbToggle') || t.closest('#orbToggle'))) {
        setMode('orb');
      }
      // top buttons
      if (t && t.id === 'btnSettings') toggleDrawer('drawerSettings');
      if (t && t.id === 'btnDeck') toggleDrawer('drawerDeck');
      // mode buttons
      if (t && t.classList && t.classList.contains('mode-btn')) {
        if (t.id && t.id.includes('Card')) setMode('card');
        else if (t.id && t.id.includes('Orb')) setMode('orb');
        else if (t.id && t.id.includes('Hud')) setMode('hud');
      }
      // activation toggles (data-driven)
      if (t && t.closest && t.closest('.activation-toggle')) {
        const parent = t.closest('.activation-toggle');
        // expects onclick="toggleSection('activationCard')" in markup, but we handle generic
        const onclick = parent.getAttribute && parent.getAttribute('onclick');
        if (onclick && onclick.includes('toggleSection')) {
          // extract id between quotes
          const m = onclick.match(/toggleSection\(['"]([^'"]+)['"]\)/);
          if (m) toggleSection(m[1]);
        } else {
          // fallback: find next .activation-card
          const next = parent.nextElementSibling;
          if (next && next.classList.contains('activation-card')) next.classList.toggle('activation-hidden');
        }
      }
    });

    // copy activation text button
    const copyActBtn = safeGet('copyActBtn');
    if (copyActBtn) on(copyActBtn, 'click', () => {
      const pre = safeGet('actPre');
      if (!pre) return;
      navigator.clipboard && navigator.clipboard.writeText(pre.textContent || '').then(() => {
        copyActBtn.textContent = 'COPIADO';
        setTimeout(() => (copyActBtn.textContent = 'COPIAR'), 900);
      });
    });

    // quick bindings for drawer toggles close
    $$('.drawer .btn-icon').forEach(b => on(b, 'click', (e) => {
      const drawer = b.closest('.drawer');
      if (drawer) drawer.style.display = 'none';
    }));

    // safety: prevent accidental double-submits on forms
    $$('.glass-input, .cyber-input').forEach(el => {
      on(el, 'keydown', (e) => {
        if (e.key === 'Enter') e.preventDefault();
      });
    });

    // show there's a working unified script
    console.info('DUAL — combined.js loaded — TRINITY ∴ KOBLLUX active');
  }

  // Wait DOM
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();

  /* -------------------------
     Extension points for inlining module code
     If you want to paste the original module contents, paste them here inside an IIFE
     Example:
     (function inline000(){ /* paste inline-000.js content here * / })();
  ------------------------- */

  // --- MODULE PLACEHOLDER: inline-000.js ---
  // --- MODULE PLACEHOLDER: 0RB-0S17.js ---
  // --- MODULE PLACEHOLDER: bgPanel.js ---
  // --- MODULE PLACEHOLDER: inline-1.js ---
  // --- MODULE PLACEHOLDER: inline-2.js ---
  // --- MODULE PLACEHOLDER: inline-3.js ---
  // --- MODULE PLACEHOLDER: inline-4.js ---

})();
