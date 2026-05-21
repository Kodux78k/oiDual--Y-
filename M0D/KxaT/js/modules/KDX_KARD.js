/* =========================================================================
   FUSION CORE LOGIC (V7) + UNIVERSAL ORB GENERATOR 3D (V3)
   OVERRIDE COMPLETO & SINCRONIZAÇÃO DE BOOT ASCII (78K motor)
   ========================================================================= */

document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();

    // 1. REFERENCES & DOM ELEMENTS
    const els = {
      card: document.getElementById('mainCard'),
      header: document.getElementById('cardHeader'),
      avatarTgt: document.getElementById('avatarTarget'),
      input: document.getElementById('inputUser'), // Input exclusivo do card ASCII
      lblHello: document.getElementById('lblHello'),
      lblName: document.getElementById('lblName'),
      clock: document.getElementById('clockTime'),
      smallPreview: document.getElementById('smallPreview'),
      smallMiniAvatar: document.getElementById('smallMiniAvatar'),
      smallText: document.getElementById('smallText'),
      smallIdent: document.getElementById('smallIdent'),
      actCard: document.getElementById('activationCard'),
      actPre: document.getElementById('actPre'),
      actName: document.getElementById('actName'),
      actMiniAvatar: document.getElementById('actMiniAvatar'),
      actBadge: document.getElementById('actBadge'),
      actTitle: document.getElementById('actTitle'),
      // Buttons & Controls
      btnModeCard: document.getElementById('btnModeCard'),
      btnModeOrb: document.getElementById('btnModeOrb'),
      btnModeHud: document.getElementById('btnModeHud'),
      orbMenuTrigger: document.getElementById('orbMenuTrigger'),
      hudMenuBtn: document.getElementById('hudMenuBtn'),
      snapZone: document.getElementById('snap-zone'),
      // Keys UI
      keysModal: document.getElementById('keysModal'),
      keyList: document.getElementById('keyList'),
      keyName: document.getElementById('keyNameInput'),
      keyToken: document.getElementById('keyTokenInput'),
      addKeyBtn: document.getElementById('addKeyBtn'),
      closeKeysBtn: document.getElementById('closeKeysBtn'),
      lockVaultBtn: document.getElementById('lockVaultBtn'),
      vaultStatusText: document.getElementById('vaultStatusText'),
      // Vault UI
      vaultModal: document.getElementById('vaultModal'),
      vaultPass: document.getElementById('vaultPassInput'),
      vaultUnlock: document.getElementById('vaultUnlockBtn'),
      vaultCancel: document.getElementById('vaultCancelBtn'),
      // System UI
      systemCard: document.getElementById('systemCard'),
      saveSystemBtn: document.getElementById('saveSystemBtn'),
      copyActBtn: document.getElementById('copyActBtn')
    };

    // --- CRYPTO UTILS ---
    const CRYPTO = {
      algo: { name: 'AES-GCM', length: 256 },
      pbkdf2: { name: 'PBKDF2', hash: 'SHA-256', iterations: 100000 },
      async getKey(password, salt) {
        const enc = new TextEncoder();
        const keyMaterial = await window.crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
        return window.crypto.subtle.deriveKey({ ...this.pbkdf2, salt: salt }, keyMaterial, this.algo, false, ["encrypt", "decrypt"]);
      },
      async encrypt(data, password) {
        const salt = window.crypto.getRandomValues(new Uint8Array(16));
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const key = await this.getKey(password, salt);
        const encoded = new TextEncoder().encode(JSON.stringify(data));
        const encrypted = await window.crypto.subtle.encrypt({ name: "AES-GCM", iv: iv }, key, encoded);
        const bundle = { s: Array.from(salt), iv: Array.from(iv), d: Array.from(new Uint8Array(encrypted)) };
        return JSON.stringify(bundle);
      },
      async decrypt(bundleStr, password) {
        try {
          const bundle = JSON.parse(bundleStr);
          const salt = new Uint8Array(bundle.s);
          const iv = new Uint8Array(bundle.iv);
          const data = new Uint8Array(bundle.d);
          const key = await this.getKey(password, salt);
          const decrypted = await window.crypto.subtle.decrypt({ name: "AES-GCM", iv: iv }, key, data);
          return JSON.parse(new TextDecoder().decode(decrypted));
        } catch(e) { throw new Error("Senha incorreta ou dados corrompidos"); }
      }
    };

    // --- STATE & PERSISTENCE ---
    const STORAGE_KEY = 'fusion_os_data_v2';
    const UI_STATE_KEY = 'fusion_os_ui_state';
    const FIRST_PREVIEW_KEY = 'fusion_orb_smallpreview_shown';
    const FIRST_PREVIEW_DURATION = 5000;
    
    let STATE = {
      keys: [], 
      user: 'Convidado',
      isEncrypted: false,
      encryptedData: null
    };
    let SESSION_PASSWORD = null;

    // Persistência das chaves externas di_
    let apiKey = localStorage.getItem('di_apiKey') || '';
    let modelName = localStorage.getItem('di_modelName') || 'nvidia/nemotron-3-nano-30b-a3b:free';
    let userName = localStorage.getItem('di_userName') || '';
    let infodoseName = localStorage.getItem('di_infodoseName') || '';

    let state = {
        isOrb: false,
        isHud: false,
        isDragging: false,
        timer: null,
        startX: 0,
        startY: 0,
        dragOffsetX: 0,
        dragOffsetY: 0,
        pointerId: null
    };

    const HUD_SNAP_THRESHOLD = 60;
    const SWIPE_DOWN_THRESHOLD = 80;
    const LONG_PRESS_MS = 350;

    // Helper functions básicos
    const hashStr = s => { let h=0xdeadbeef; for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),2654435761);} return (h^h>>>16)>>>0; };
    function escapeHtml(s){ return s ? s.replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])) : ''; }
    function showToaster(txt,type='default'){ const t=document.createElement('div'); t.className=`toaster ${type}`; t.innerText=txt; document.getElementById('toasterWrap').appendChild(t); setTimeout(()=>t.classList.add('show'),10); setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),300)},2500); }
    
    function toggleSection(id, forceOpen = false){ 
        const el = document.getElementById(id);
        if(!el) return;
        const h = el.classList.contains('activation-hidden'); 
        if(forceOpen && !h) return;
        el.classList.toggle('activation-hidden', !forceOpen && !h); 
        el.classList.toggle('activation-open', forceOpen || h); 
    }

    function root369(name) {
      const clean = (name || '').trim();
      if (!clean) return '--';
      let n = clean.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      while (n > 9) n = String(n).split('').reduce((a, b) => a + Number(b), 0);
      return n;
    }

    function padTo(text, size) {
      text = String(text);
      if (text.length >= size) return text.slice(0, size);
      return text + ' '.repeat(size - text.length);
    }

    // --- 3D ORB RENDER INTEGRATION (UNIVERSAL ORB V3) ---
    function injectOrbStyles() {
      if (document.getElementById('dual-orb-styles')) return;
      const style = document.createElement('style');
      style.id = 'dual-orb-styles';
      style.innerHTML = `
        @keyframes orbBreathe { 0%, 100% { transform: translateZ(0) scale(1); opacity: .82; filter: brightness(1); } 50% { transform: translateZ(0) scale(1.08); opacity: 1; filter: brightness(1.22); } }
        @keyframes orbSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes orbPulse { 0% { transform: scale(.78); opacity: .55; } 100% { transform: scale(1.28); opacity: 0; } }
        @keyframes orbFloat { 0%, 100% { transform: translateY(0px) rotateX(0deg) rotateY(0deg); } 50% { transform: translateY(-2px) rotateX(10deg) rotateY(-10deg); } }
        .dual-orb-wrap { --orb-speed: 4s; --orb-spin-speed: 12s; --orb-pulse-speed: 2.2s; position: relative; display: inline-grid; place-items: center; width: var(--orb-size, 64px); aspect-ratio: 1; perspective: 900px; transform-style: preserve-3d; user-select: none; cursor: pointer; transition: transform .28s cubic-bezier(.175,.885,.32,1.275); }
        .dual-orb-wrap:active { transform: scale(.94); } .dual-orb-wrap:hover { transform: scale(1.03); }
        .dual-orb-svg { width: 100%; height: 100%; display: block; opacity: .78; filter: brightness(.72) saturate(1.08); transform: translateZ(0); }
        .dual-orb-shell { position: absolute; inset: 10%; display: grid; place-items: center; transform-style: preserve-3d; animation: orbFloat 6s ease-in-out infinite; pointer-events: none; }
        .dual-orb-halo { position: absolute; inset: -24%; border-radius: 50%; background: radial-gradient(circle, rgba(120,227,255,.24), rgba(185,120,255,.06) 42%, transparent 70%); filter: blur(18px); opacity: .9; animation: orbPulse var(--orb-pulse-speed) ease-in-out infinite; transform: translateZ(-18px); }
        .dual-orb-core { position: relative; width: 42%; height: 42%; border-radius: 50%; transform-style: preserve-3d; transform: translateZ(18px); background: radial-gradient(circle at 30% 28%, rgba(255,255,255,.95) 0%, rgba(255,255,255,.32) 8%, rgba(255,255,255,0) 26%), radial-gradient(circle at 70% 72%, var(--orb-primary, #78e3ff) 0%, var(--orb-secondary, #b978ff) 74%); box-shadow: 0 0 16px rgba(120,227,255,.55), 0 0 34px rgba(120,227,255,.25), inset -10px -12px 20px rgba(0,0,0,.38), inset 10px 10px 18px rgba(255,255,255,.12); animation: orbSpin var(--orb-spin-speed) linear infinite; }
        .dual-orb-wrap.speaking .dual-orb-core { animation: orbSpin 2s linear infinite, orbBreathe .55s ease-in-out infinite alternate; }
        .dual-orb-wrap.speaking .dual-orb-halo { animation: orbPulse .85s ease-in-out infinite; }
      `;
      document.head.appendChild(style);
    }

    function makeOrbAvatar(name = 'DUAL', size = 64) {
      injectOrbStyles();
      const safe = String(name || 'DUAL').trim() || 'DUAL';
      const seed = safe.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
      const h1 = seed % 360;
      const h2 = (seed * 37) % 360;
      const uid = Math.random().toString(36).slice(2, 7);
      const gradId = `orb_${seed.toString(36)}_${uid}`;

      return `
        <div class="dual-orb-wrap" id="${gradId}" style="--orb-size:${size}px; --orb-primary:hsl(${h1},100%,62%); --orb-secondary:hsl(${h2},92%,48%);" aria-label="${safe}" role="img">
          <svg class="dual-orb-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <defs>
              <radialGradient id="${gradId}_core" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stop-color="hsl(${h1},100%,66%)" stop-opacity="1"/>
                <stop offset="55%" stop-color="hsl(${h2},92%,46%)" stop-opacity=".9"/>
                <stop offset="100%" stop-color="hsl(${h2},100%,12%)" stop-opacity="0"/>
              </radialGradient>
              <linearGradient id="${gradId}_ring" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="hsl(${h1},100%,76%)"/>
                <stop offset="100%" stop-color="hsl(${h2},100%,58%)"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="#05070c"/>
            <circle cx="50" cy="50" r="40" fill="url(#${gradId}_core)" opacity=".28"/>
            <circle cx="50" cy="50" r="38" fill="none" stroke="url(#${gradId}_ring)" stroke-width="1"/>
            <circle cx="50" cy="50" r="46" fill="none" stroke="url(#${gradId}_ring)" stroke-width="2.5" stroke-dasharray="70 20 10 30" stroke-linecap="round" opacity=".86"/>
            <circle cx="50" cy="50" r="3" fill="#ffffff" opacity=".85"/>
          </svg>
          <div class="dual-orb-shell"><div class="dual-orb-halo"></div><div class="dual-orb-core"></div></div>
        </div>`;
    }

    window.makeOrbAvatar = makeOrbAvatar;
    window.makeMiniAvatar = (name) => makeOrbAvatar(name, 24);

    // --- INTERFACE INTERNALS ---
    function updateInterface(name){
      const safe = name || 'Convidado';
      if(els.lblName) els.lblName.innerText = safe;
      if(els.input && document.activeElement !== els.input) els.input.value = safe;
      
      const activeKey = STATE.keys.find(k=>k.active);
      if(els.smallIdent) els.smallIdent.innerText = activeKey ? activeKey.name : '--';
      
      // Acoplamento seguro do Novo 3D Orb Generator
      if(els.smallMiniAvatar) els.smallMiniAvatar.innerHTML = window.makeMiniAvatar(safe);
      if(els.actMiniAvatar) els.actMiniAvatar.innerHTML = makeOrbAvatar(safe, 36);
      if(els.avatarTgt) els.avatarTgt.innerHTML = makeOrbAvatar(safe, 64);
      
      if(els.actName) els.actName.innerText = `${safe}.Dual Infodose`;
      
      const phrases = ["Foco estável.","Ritmo criativo.","Percepção sutil."];
      if(els.smallText) els.smallText.innerText = activeKey ? `${activeKey.name} [ATIVO]` : (safe==='Convidado'?'Aguardando...':`${safe} · ${phrases[safe.length%phrases.length]}`);
    }

    function createAsciiActivation(name) {
      const clean = (name || '').trim() || 'Convidado';
      const displayName = `${clean}.Dual Infodose`;
      const title = 'CÉREBRO-ORÁCULO — BASE v1';
      const width = 35;
      const top = `+${'-'.repeat(width)}+`;
      return {
        ascii: [top, `| ${padTo(title, width - 2)} |`, top, `Ativar: ${displayName}`].join('\n'),
        displayName, root: root369(clean), title
      };
    }

    function updateActivationBlock(name) {
      const data = createAsciiActivation(name);
      if (els.actPre) els.actPre.innerText = data.ascii;
      if (els.actName) els.actName.innerText = data.displayName;
      if (els.actTitle) els.actTitle.innerText = data.title;
      if (els.actMiniAvatar) els.actMiniAvatar.innerHTML = makeOrbAvatar(name || 'DUAL', 36);

      if (els.actBadge) {
        els.actBadge.innerText = `v:${data.root}`;
        els.actBadge.classList.remove('vibe-gold');
        if (data.root === 3 || data.root === 6 || data.root === 9) els.actBadge.classList.add('vibe-gold');
      }
      if (els.smallText) els.smallText.innerText = (name && name.trim()) ? `${name.trim()} · canal ASCII ativo` : 'Aguardando ativação...';
      if (els.smallIdent) els.smallIdent.innerText = (name && name.trim()) ? `v:${data.root}` : '--';
    }

    window.updateActivationBlock = updateActivationBlock;

    // --- INTEGRATED TERMINAL BOOT SEQUENCE ---
    const bootLines = [
        "[Solus] — Onda-Viva 78K ativada.",
        "Iniciando. Pulso simbiótico detectado...",
        "Presença reconhecida. Canal ABERTO.",
        "KODUX, a Infodose está operando na frequência.",
        ":: AGUARDANDO ATIVAÇÃO ASCII ::"
    ];

    function runBootSequence() {
        // Encontra ou injeta dinamicamente o display do texto de boot sem quebrar layouts
        let bootContainer = document.getElementById("bootText");
        if (!bootContainer && els.actCard) {
            bootContainer = document.createElement("div");
            bootContainer.id = "bootText";
            bootContainer.style.cssText = "font-family:'JetBrains Mono',monospace; font-size:0.8rem; color:#00f0ff; margin-bottom:12px; padding:8px; background:rgba(0,0,0,0.4); border-radius:8px;";
            els.actCard.parentNode.insertBefore(bootContainer, els.actCard);
        }

        let lineIndex = 0;
        forceSmallPreview();

        if (!bootContainer) {
            setTimeout(finalizeBoot, 2000);
            return;
        }

        bootContainer.innerHTML = "";
        function printLine() {
            if (lineIndex < bootLines.length) {
                bootContainer.innerHTML += `<div style="margin-bottom:4px; text-shadow:0 0 4px rgba(0,240,255,0.5);">>> ${bootLines[lineIndex]}</div>`;
                lineIndex++;
                setTimeout(printLine, 500); // Ritmo fluido de digitação cinematográfica
            } else {
                finalizeBoot();
            }
        }
        printLine();

        function finalizeBoot() {
            // Terminou o boot text: força a abertura orgânica do card ASCII
            toggleSection('activationCard', true);
            if(els.input) {
                els.input.focus();
                // Efeito visual pulsante no input para chamar atenção pós-boot
                els.input.animate([
                    { boxShadow: '0 0 0px transparent' },
                    { boxShadow: '0 0 10px var(--neon-cyan, #00f0ff)' },
                    { boxShadow: '0 0 0px transparent' }
                ], { duration: 1000, iterations: 2 });
            }
            if(els.actBadge) {
                els.actBadge.innerText = "PRONTO";
                els.actBadge.style.color = "var(--neon-cyan)";
            }
        }
    }

    // --- LIFE UPDATE & SAFE LISTENERS (Anti-Colisão) ---
    if (els.input) {
        const run = () => {
          const name = els.input.value.trim() || 'Convidado';
          localStorage.setItem('di_userName', name);
          STATE.user = name;
          updateInterface(name);
          updateActivationBlock(name);
        };

        els.input.addEventListener('input', run);
        els.input.addEventListener('blur', run);
        
        // Ativação via Enter isolada do chat principal (#userInput)
        els.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                run();
                showToaster(`Cérebro ${STATE.user} Sincronizado!`, 'success');
                // Ativa animação de pulso estendido no Orb para feedback cinemático
                const currentWrap = els.avatarTgt.querySelector('.dual-orb-wrap');
                if(currentWrap) {
                    currentWrap.classList.add('speaking');
                    setTimeout(() => currentWrap.classList.remove('speaking'), 3000);
                }
            }
        });
    }

    // --- STATE PERSISTENCE ENGINE ---
    function saveUIState() {
        const mode = state.isOrb ? 'orb' : (state.isHud ? 'hud' : 'card');
        const uiState = { mode, left: els.card.style.left, top: els.card.style.top };
        localStorage.setItem(UI_STATE_KEY, JSON.stringify(uiState));
    }

    function saveData() {
      const payload = { keys: STATE.keys, user: STATE.user };
      if (SESSION_PASSWORD) {
        CRYPTO.encrypt(payload, SESSION_PASSWORD).then(enc => {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ isEncrypted: true, data: enc }));
          STATE.isEncrypted = true;
          STATE.encryptedData = enc;
          updateSecurityUI();
        });
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ isEncrypted: false, data: payload }));
      }
    }

    async function loadData() {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) { updateInterface(STATE.user); return; }
      const parsed = JSON.parse(raw);
      if (parsed.isEncrypted) {
        STATE.isEncrypted = true;
        STATE.encryptedData = parsed.data;
        updateSecurityUI();
      } else {
        STATE.keys = parsed.data.keys || [];
        STATE.user = parsed.data.user || 'Convidado';
        
        const active = STATE.keys.find(k=>k.active);
        if(active && active.token) { localStorage.setItem('di_apiKey', active.token); apiKey = active.token; }
        if(STATE.user !== 'Convidado') { localStorage.setItem('di_userName', STATE.user); userName = STATE.user; }

        updateInterface(STATE.user);
        updateActivationBlock(STATE.user);
        renderKeysList();
      }
    }

    function updateSecurityUI() {
      if (SESSION_PASSWORD) { if(els.vaultStatusText) els.vaultStatusText.innerText = "Cofre Protegido (Destrancado)"; } 
      else if (STATE.isEncrypted) { if(els.vaultStatusText) els.vaultStatusText.innerText = "Cofre Trancado"; } 
      else { if(els.vaultStatusText) els.vaultStatusText.innerText = "Cofre Aberto (Sem senha)"; }
    }

    function renderKeysList(){
      if(!els.keyList) return;
      els.keyList.innerHTML = '';
      if(STATE.keys.length===0){ els.keyList.innerHTML = '<div style="color:rgba(255,255,255,0.3);text-align:center;padding:20px">Nenhuma chave armazenada.</div>'; return; }
      STATE.keys.forEach(k=>{
        const div = document.createElement('div');
        div.className = `key-item ${k.active?'active-item':''}`;
        div.innerHTML = `
          <div class="meta" style="flex:1"><div style="font-weight:700;font-size:0.9rem">${escapeHtml(k.name)}</div></div>
          <div class="actions">
            ${!k.active ? `<button class="small-btn" onclick="setActiveKey('${k.id}')">ATIVAR</button>` : `<span style="font-size:0.7rem;font-weight:700;color:var(--neon-cyan);margin-right:10px">ATIVA</span>`}
          </div>`;
        els.keyList.appendChild(div);
      });
    }

    // --- CINEMATIC GESTURES & WINDOW MODES ---
    function handleStart(e) {
      if(e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.closest('.hud-menu-btn') || e.target.closest('.activation-toggle')) return;
      state.startX = e.clientX; state.startY = e.clientY; state.pointerId = e.pointerId;

      if(state.isOrb || state.isHud) {
          state.isDragging = true;
          try { els.card.setPointerCapture(e.pointerId); } catch(err){}
          const rect = els.card.getBoundingClientRect();
          state.dragOffsetX = e.clientX - rect.left; state.dragOffsetY = e.clientY - rect.top;
          els.card.style.transition = 'none';
          return;
      }
      state.timer = setTimeout(() => { transmuteToOrb(e); saveUIState(); }, LONG_PRESS_MS);
    }
    
    function handleMove(e) {
      if(!state.isOrb && !state.isHud && state.timer) {
          const dx = e.clientX - state.startX; const dy = e.clientY - state.startY;
          if (Math.hypot(dx, dy) > 12) { clearTimeout(state.timer); state.timer = null; }
      }
      if(!state.isDragging) return;
      if(state.isOrb) {
          const x = e.clientX - state.dragOffsetX; const y = e.clientY - state.dragOffsetY;
          els.card.style.left = `${x}px`; els.card.style.top = `${y}px`;
          if(y < HUD_SNAP_THRESHOLD && els.snapZone) els.snapZone.classList.add('active');
      }
    }
    
    function handleEnd(e) {
      if(state.timer) clearTimeout(state.timer);
      if(state.isDragging) {
          state.isDragging = false;
          els.card.style.transition = '';
          if(els.snapZone) els.snapZone.classList.remove('active');
          const rect = els.card.getBoundingClientRect();
          if(state.isOrb && rect.top < HUD_SNAP_THRESHOLD) window.setMode('hud');
          else saveUIState();
      }
    }

    function transmuteToOrb(ev) {
      if(navigator.vibrate) navigator.vibrate(40);
      els.card.classList.add('orb','closed'); els.card.classList.remove('content-visible');
      els.card.style.left = `${ev.clientX - 34}px`; els.card.style.top = `${ev.clientY - 34}px`;
      state.isOrb=true; state.isHud=false;
      updateModeButtons('orb');
    }

    window.setMode = (mode, isInitialLoad = false) => {
        updateModeButtons(mode);
        if(mode === 'card') {
            state.isOrb=false; state.isHud=false;
            els.card.style.left=''; els.card.style.top=''; els.card.style.transform='';
            els.card.classList.remove('orb','hud','closed');
            setTimeout(()=>els.card.classList.add('content-visible'),100);
        } else if (mode === 'orb') {
            state.isOrb = true; state.isHud = false;
            els.card.classList.add('orb', 'closed'); els.card.classList.remove('hud', 'content-visible');
        } else if (mode === 'hud') {
            state.isHud = true; state.isOrb = false;
            els.card.classList.add('hud', 'closed'); els.card.classList.remove('orb', 'content-visible');
            els.card.style.top = ''; els.card.style.left = '';
        }
        if(!isInitialLoad) saveUIState();
    };

    function updateModeButtons(mode) {
        if(els.btnModeCard) els.btnModeCard.classList.toggle('active-mode', mode==='card');
        if(els.btnModeOrb) els.btnModeOrb.classList.toggle('active-mode', mode==='orb');
        if(els.btnModeHud) els.btnModeHud.classList.toggle('active-mode', mode==='hud');
    }

    function forceSmallPreview(){
        state.isOrb = false; state.isHud = false;
        els.card.classList.remove('orb','hud');
        els.card.classList.add('closed');
        els.card.classList.remove('content-visible');
        if(els.smallPreview) els.smallPreview.style.display = 'flex';
    }

    function restoreSavedMode(mode, left, top){
        els.card.style.transition = 'all 600ms cubic-bezier(0.16, 1, 0.3, 1)';
        if(mode === 'orb'){
            if(left) els.card.style.left = left;
            if(top) els.card.style.top = top;
            window.setMode('orb', true);
        } else if(mode === 'hud'){
            window.setMode('hud', true);
        } else {
            window.setMode('card', true);
            els.card.classList.remove('closed');
            els.card.classList.add('content-visible');
        }
    }

    // --- ATTACH EVENTS ---
    els.card.addEventListener('pointerdown', handleStart, { passive: false });
    window.addEventListener('pointermove', handleMove, { passive: false });
    window.addEventListener('pointerup', handleEnd, { passive: false });
    
    if(els.avatarTgt) els.avatarTgt.addEventListener('click', () => { if(!state.isOrb && !state.isHud) els.keysModal.style.display='flex'; });
    if(els.closeKeysBtn) els.closeKeysBtn.addEventListener('click', () => els.keysModal.style.display='none');
    if(els.hudMenuBtn) els.hudMenuBtn.addEventListener('click', () => toggleSection('systemCard'));

    // --- INITIALIZATION HOOK ---
    setTimeout(() => {
        els.card.classList.add('active');
        if(els.avatarTgt) els.avatarTgt.classList.add('shown');
        
        loadData();

        const rawUi = localStorage.getItem(UI_STATE_KEY);
        let savedMode = 'card'; let savedLeft = null; let savedTop = null;
        if(rawUi){
            try {
                const parsed = JSON.parse(rawUi);
                savedMode = parsed.mode || 'card';
                savedLeft = parsed.left; savedTop = parsed.top;
            } catch(e){}
        }

        // Se o usuário já passou pelo primeiro boot ou está nos modos isolados, restaura imediatamente
        if (savedMode === 'orb' || savedMode === 'hud' || localStorage.getItem(FIRST_PREVIEW_KEY)) {
            restoreSavedMode(savedMode, savedLeft, savedTop);
        } else {
            // Primeiro Boot do Sistema: Dispara animação sincronizada Solus 78K
            runBootSequence();
            localStorage.setItem(FIRST_PREVIEW_KEY, '1');
        }
    }, 100);

    setInterval(() => { 
        if(els.clock) els.clock.innerText = new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}); 
    }, 1000);
});
