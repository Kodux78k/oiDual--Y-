/* FUSION CORE LOGIC (V7)
   Preserving di_ constants for external app communication
*/
lucide.createIcons();

// Helper: pega o primeiro ID existente
const byId = (...ids) => ids.map(id => document.getElementById(id)).find(Boolean);

// REFERENCES
const els = {
  card: byId('mainCard'),
  header: byId('cardHeader'),
  avatarTgt: byId('avatarTarget'),
  input: byId('kardinputUser', 'inputUser', 'userInput'),
  lblHello: byId('lblHello'),
  lblName: byId('lblName'),
  clock: byId('clockTime'),
  smallPreview: byId('smallPreview'),
  smallMiniAvatar: byId('smallMiniAvatar'),
  smallText: byId('smallText'),
  smallIdent: byId('smallIdent'),
  actCard: byId('activationCard'),
  actPre: byId('actPre'),
  actName: byId('actName'),
  actMiniAvatar: byId('actMiniAvatar'),
  actBadge: byId('actBadge'),
  // Buttons
  btnModeCard: byId('btnModeCard'),
  btnModeOrb: byId('btnModeOrb'),
  btnModeHud: byId('btnModeHud'),
  orbMenuTrigger: byId('orbMenuTrigger'),
  hudMenuBtn: byId('hudMenuBtn'),
  snapZone: byId('snap-zone'),
  // Keys UI
  keysModal: byId('keysModal'),
  keyList: byId('keyList'),
  keyName: byId('keyNameInput'),
  keyToken: byId('keyTokenInput'),
  addKeyBtn: byId('addKeyBtn'),
  closeKeysBtn: byId('closeKeysBtn'),
  lockVaultBtn: byId('lockVaultBtn'),
  vaultStatusText: byId('vaultStatusText'),
  // Vault UI
  vaultModal: byId('vaultModal'),
  vaultPass: byId('vaultPassInput'),
  vaultUnlock: byId('vaultUnlockBtn'),
  vaultCancel: byId('vaultCancelBtn'),
  // System UI
  systemCard: byId('systemCard'),
  saveSystemBtn: byId('saveSystemBtn'),
  copyActBtn: byId('copyActBtn')
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

let STATE = {
  keys: [],
  user: 'Convidado',
  isEncrypted: false,
  encryptedData: null
};
let SESSION_PASSWORD = null;

// IMPORTANT: Loading initial di_ constants if available
let apiKey = localStorage.getItem('di_apiKey') || '';
let modelName = localStorage.getItem('di_modelName') || 'nvidia/nemotron-3-nano-30b-a3b:free';
let userName = localStorage.getItem('di_userName') || '';
let infodoseName = localStorage.getItem('di_infodoseName') || '';

function saveUIState() {
  const mode = state.isOrb ? 'orb' : (state.isHud ? 'hud' : 'card');
  const uiState = {
    mode: mode,
    left: els.card?.style.left || '',
    top: els.card?.style.top || ''
  };
  localStorage.setItem(UI_STATE_KEY, JSON.stringify(uiState));
}

function loadUIState() {
  const raw = localStorage.getItem(UI_STATE_KEY);
  if (!raw) return;
  try {
    const ui = JSON.parse(raw);
    if (ui.mode === 'orb' || ui.mode === 'hud') {
      if (els.card) els.card.style.transition = 'none';
      if (ui.mode === 'orb') {
        if (ui.left && els.card) els.card.style.left = ui.left;
        if (ui.top && els.card) els.card.style.top = ui.top;
        window.setMode('orb', true);
      } else {
        window.setMode('hud', true);
      }
      setTimeout(() => { if (els.card) els.card.style.transition = ''; }, 200);
    }
  } catch(e) { console.error("UI Load Error", e); }
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
  if (!raw) return;
  const parsed = JSON.parse(raw);
  if (parsed.isEncrypted) {
    STATE.isEncrypted = true;
    STATE.encryptedData = parsed.data;
    updateSecurityUI();
  } else {
    STATE.keys = parsed.data.keys || [];
    STATE.user = parsed.data.user || 'Convidado';

    const active = STATE.keys.find(k => k.active);
    if (active && active.token) {
      localStorage.setItem('di_apiKey', active.token);
      apiKey = active.token;
    }

    if (STATE.user !== 'Convidado') {
      localStorage.setItem('di_userName', STATE.user);
      userName = STATE.user;
      const userInput = byId('kardinputUser', 'inputUser', 'userInput');
      if (userInput) userInput.value = STATE.user;
    }

    updateInterface(STATE.user);
    renderKeysList();
  }

  const apiInput = byId('kardapiKeyInput', 'apiKeyInput', 'cardApiKeyInput');
  const infoInput = byId('kardinfodoseNameInput', 'infodoseNameInput', 'cardInfodoseNameInput');
  const modelInput = byId('kardmodelSelect', 'modelSelect', 'cardModelSelect');

  if (apiInput) apiInput.value = apiKey;
  if (infoInput) infoInput.value = infodoseName;
  if (modelInput) modelInput.value = modelName;
}

const hashStr = s => { let h = 0xdeadbeef; for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 2654435761); } return (h ^ h >>> 16) >>> 0; };
const createSvg = (id, sz) => `<svg viewBox="0 0 100 100" width="${sz}" height="${sz}"><defs><linearGradient id="g${id}"><stop offset="0%" stop-color="#00f2ff"/><stop offset="100%" stop-color="#bd00ff"/></linearGradient></defs><circle cx="50" cy="50" r="48" fill="#080b12" stroke="rgba(255,255,255,0.1)"/><circle cx="50" cy="50" r="20" fill="url(#g${id})" opacity="0.9"/></svg>`;
const createMiniSvg = (name, sz = 30) => {
  const s = hashStr(name || 'D'); const h1 = s % 360; const h2 = (s * 37) % 360;
  const grad = `<linearGradient id="gm${s}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${h1},90%,50%)"/><stop offset="1" stop-color="hsl(${h2},90%,50%)"/></linearGradient>`;
  return `<svg width="${sz}" height="${sz}" viewBox="0 0 32 32"><defs>${grad}</defs><rect width="32" height="32" rx="8" fill="#0a1016"/><circle cx="16" cy="16" r="6" fill="url(#gm${s})"/></svg>`;
};

function updateInterface(name) {
  const safe = name || 'Convidado';
  if (els.lblName) els.lblName.innerText = safe;
  if (els.input) els.input.value = safe;
  const activeKey = STATE.keys.find(k => k.active);
  if (els.smallIdent) els.smallIdent.innerText = activeKey ? activeKey.name : '--';
  if (els.actBadge) els.actBadge.innerText = activeKey ? `key:${activeKey.name}` : 'v:--';
  if (els.smallMiniAvatar) els.smallMiniAvatar.innerHTML = createMiniSvg(safe);
  if (els.actMiniAvatar) els.actMiniAvatar.innerHTML = createMiniSvg(safe, 36);
  if (els.actName) els.actName.innerText = safe;
  if (els.avatarTgt) els.avatarTgt.innerHTML = createSvg('Main', 64);
  const phrases = ["Foco estável.", "Ritmo criativo.", "Percepção sutil."];
  if (els.smallText) els.smallText.innerText = activeKey ? `${activeKey.name} [ATIVO]` : (safe === 'Convidado' ? 'Aguardando...' : `${safe} · ${phrases[safe.length % phrases.length]}`);
  const line = `+${'-'.repeat(safe.length + 4)}+`;
  if (els.actPre) els.actPre.innerText = `${line}\n| ${safe.toUpperCase()} |\n${line}\nID: ${hashStr(safe).toString(16)}`;
}

function updateSecurityUI() {
  if (!els.vaultStatusText || !els.lockVaultBtn) return;
  if (SESSION_PASSWORD) {
    els.vaultStatusText.innerText = "Cofre Protegido (Destrancado)";
    els.lockVaultBtn.innerText = "TRANCAR";
  } else if (STATE.isEncrypted) {
    els.vaultStatusText.innerText = "Cofre Trancado";
    els.lockVaultBtn.innerText = "REDEFINIR";
  } else {
    els.vaultStatusText.innerText = "Cofre Aberto (Sem senha)";
    els.lockVaultBtn.innerText = "CRIAR SENHA";
  }
}

function renderKeysList() {
  if (!els.keyList) return;
  els.keyList.innerHTML = '';
  if (STATE.keys.length === 0) {
    els.keyList.innerHTML = '<div style="color:rgba(255,255,255,0.3);text-align:center;padding:20px">Nenhuma chave armazenada.</div>';
    return;
  }
  STATE.keys.forEach(k => {
    const div = document.createElement('div');
    div.className = `key-item ${k.active ? 'active-item' : ''}`;
    div.innerHTML = `
      <div class="meta" style="flex:1"><div style="font-weight:700;font-size:0.9rem">${escapeHtml(k.name)}</div></div>
      <div class="actions">
        ${!k.active ? `<button class="small-btn" onclick="setActiveKey('${k.id}')">ATIVAR</button>` : `<span style="font-size:0.7rem;font-weight:700;color:var(--neon-cyan);margin-right:10px">ATIVA</span>`}
        <button class="small-btn danger" onclick="removeKey('${k.id}')"><i data-lucide="trash-2" style="width:14px"></i></button>
      </div>`;
    els.keyList.appendChild(div);
  });
  lucide.createIcons();
}

function addKey() {
  const name = els.keyName ? els.keyName.value.trim() : '';
  const token = els.keyToken ? els.keyToken.value.trim() : '';
  if (!name) { showToaster('Nome obrigatório', 'error'); return; }
  const newKey = { id: Date.now().toString(36), name, token, active: STATE.keys.length === 0 };
  STATE.keys.push(newKey);

  if (newKey.active && newKey.token) {
    localStorage.setItem('di_apiKey', newKey.token);
    apiKey = newKey.token;
  }

  saveData(); renderKeysList(); updateInterface(STATE.user);
  if (els.keyName) els.keyName.value = '';
  if (els.keyToken) els.keyToken.value = '';
  showToaster('Chave adicionada!', 'success');
}

window.removeKey = (id) => {
  if (confirm('Remover chave permanentemente?')) {
    STATE.keys = STATE.keys.filter(k => k.id !== id);
    saveData(); renderKeysList(); updateInterface(STATE.user);
  }
};

window.setActiveKey = (id) => {
  let activatedToken = null;
  STATE.keys.forEach(k => {
    k.active = (k.id === id);
    if (k.active) activatedToken = k.token;
  });

  if (activatedToken) {
    localStorage.setItem('di_apiKey', activatedToken);
    apiKey = activatedToken;
    const apiInput = byId('kardapiKeyInput', 'apiKeyInput', 'cardApiKeyInput');
    if (apiInput) apiInput.value = activatedToken;
    showToaster('Chave sincronizada com o Chat.', 'success');
  }

  saveData(); renderKeysList(); updateInterface(STATE.user);
};

// --- VAULT EVENTS ---
function openManager() {
  if (STATE.isEncrypted && !SESSION_PASSWORD) {
    if (els.vaultModal) els.vaultModal.style.display = 'flex';
    if (els.vaultPass) els.vaultPass.focus();
  } else {
    if (els.keysModal) els.keysModal.style.display = 'flex';
  }
}

if (els.vaultUnlock) els.vaultUnlock.addEventListener('click', async () => {
  const pass = els.vaultPass ? els.vaultPass.value : '';
  try {
    const decrypted = await CRYPTO.decrypt(STATE.encryptedData, pass);
    SESSION_PASSWORD = pass; STATE.keys = decrypted.keys; STATE.user = decrypted.user;
    const active = STATE.keys.find(k => k.active);

    if (active && active.token) { localStorage.setItem('di_apiKey', active.token); apiKey = active.token; }
    if (STATE.user) { localStorage.setItem('di_userName', STATE.user); userName = STATE.user; }

    if (els.vaultModal) els.vaultModal.style.display = 'none';
    if (els.keysModal) els.keysModal.style.display = 'flex';
    if (els.vaultPass) els.vaultPass.value = '';
    renderKeysList(); updateSecurityUI(); showToaster('Cofre destrancado.', 'success');
  } catch(e) { showToaster('Senha incorreta.', 'error'); }
});

if (els.lockVaultBtn) els.lockVaultBtn.addEventListener('click', () => {
  if (!SESSION_PASSWORD && !STATE.isEncrypted) {
    const newPass = prompt("Defina uma senha para o Cofre:");
    if (newPass) { SESSION_PASSWORD = newPass; saveData(); showToaster("Cofre trancado.", 'success'); }
  } else if (SESSION_PASSWORD) {
    SESSION_PASSWORD = null;
    if (els.keysModal) els.keysModal.style.display = 'none';
    showToaster("Sessão do cofre encerrada.", 'success');
  } else {
    showToaster("Cofre já criptografado. Desbloqueie para redefinir.", 'error');
  }
  updateSecurityUI();
});

if (els.vaultCancel) els.vaultCancel.addEventListener('click', () => { if (els.vaultModal) els.vaultModal.style.display = 'none'; });
if (els.closeKeysBtn) els.closeKeysBtn.addEventListener('click', () => { if (els.keysModal) els.keysModal.style.display = 'none'; });
if (els.addKeyBtn) els.addKeyBtn.addEventListener('click', addKey);

// --- CINEMATIC GESTURES & MODES (REFINED V7) ---
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

const FIRST_PREVIEW_DURATION = 5000;
const HUD_SNAP_THRESHOLD = 60;
const SWIPE_DOWN_THRESHOLD = 80;
const LONG_PRESS_MS = 350;

if (els.card) els.card.addEventListener('pointerdown', handleStart, { passive: false });
window.addEventListener('pointermove', handleMove, { passive: false });
window.addEventListener('pointerup', handleEnd, { passive: false });

// Opening Configs
if (els.avatarTgt) els.avatarTgt.addEventListener('click', (e) => { if (!state.isOrb && !state.isHud) openManager(); });
if (els.orbMenuTrigger) els.orbMenuTrigger.addEventListener('click', (e) => { e.stopPropagation(); window.setMode('card'); toggleSection('systemCard', true); });
if (els.hudMenuBtn) els.hudMenuBtn.addEventListener('click', (e) => { e.stopPropagation(); window.setMode('card'); toggleSection('systemCard', true); });

if (els.header) {
  els.header.addEventListener('click', (e) => {
    if (state.isHud && !state.isDragging && !e.target.closest('.hud-menu-btn')) {
      window.setMode('card');
      toggleSection('systemCard', true);
    }
  });
}

if (els.card) els.card.addEventListener('contextmenu', (e) => {
  if (state.isOrb || state.isHud) { e.preventDefault(); window.setMode('card'); }
});

function handleStart(e) {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT' || (e.target.tagName === 'BUTTON' && !e.target.closest('.orb-menu-trigger'))) return;
  if (!state.isOrb && !state.isHud && !els.header?.contains(e.target)) return;

  state.startX = e.clientX;
  state.startY = e.clientY;
  state.pointerId = e.pointerId;

  if (state.isOrb || state.isHud) {
    state.isDragging = true;
    try { els.card.setPointerCapture(e.pointerId); } catch(err){}
    const rect = els.card.getBoundingClientRect();
    state.dragOffsetX = e.clientX - rect.left;
    state.dragOffsetY = e.clientY - rect.top;
    els.card.style.transition = 'none';
    return;
  }

  state.timer = setTimeout(() => {
    transmuteToOrb(e);
    saveUIState();
  }, LONG_PRESS_MS);
}

function handleMove(e) {
  if (!state.isOrb && !state.isHud && state.timer) {
    const dx = e.clientX - state.startX;
    const dy = e.clientY - state.startY;
    const dist = Math.hypot(dx, dy);

    if (dist > 12 && (dy < -10 || Math.abs(dx) > 18)) {
      clearTimeout(state.timer); state.timer = null;
      transmuteToOrb(e);
      const rect = els.card.getBoundingClientRect();
      state.dragOffsetX = e.clientX - rect.left;
      state.dragOffsetY = e.clientY - rect.top;
      try { els.card.setPointerCapture(e.pointerId); } catch(err){}
      els.card.style.transition = 'none';
    }
  }

  if (!state.isDragging) return;
  e.preventDefault();

  if (state.isOrb) {
    const x = e.clientX - state.dragOffsetX;
    const y = e.clientY - state.dragOffsetY;
    els.card.style.left = `${x}px`;
    els.card.style.top = `${y}px`;

    if (y < HUD_SNAP_THRESHOLD) els.snapZone?.classList.add('active');
    else els.snapZone?.classList.remove('active');

  } else if (state.isHud) {
    const deltaY = e.clientY - state.startY;
    if (deltaY > 0) {
      els.card.style.transform = `translateX(-50%) translateY(${deltaY * 0.4}px)`;
      if (deltaY > SWIPE_DOWN_THRESHOLD) els.snapZone?.classList.add('active');
      else els.snapZone?.classList.remove('active');
    }
  }
}

function handleEnd(e) {
  if (state.timer) { clearTimeout(state.timer); state.timer = null; }

  if (state.isDragging) {
    state.isDragging = false;
    try { els.card.releasePointerCapture && els.card.releasePointerCapture(state.pointerId); } catch(err){}
    els.card.style.transition = '';
    els.snapZone?.classList.remove('active');

    if (state.isOrb) {
      const rect = els.card.getBoundingClientRect();
      if (rect.top < HUD_SNAP_THRESHOLD) {
        setMode('hud');
      } else {
        saveUIState();
      }
    } else if (state.isHud) {
      const deltaY = e.clientY - state.startY;
      if (deltaY > SWIPE_DOWN_THRESHOLD) {
        const x = e.clientX - 34;
        const y = e.clientY - 10;
        els.card.style.left = `${x}px`;
        els.card.style.top = `${y}px`;
        setMode('orb');
      } else {
        els.card.style.transform = `translateX(-50%) translateY(0)`;
      }
    }
  } else {
    if (!state.isOrb && !state.isHud && els.header?.contains(e.target)) {
      toggleCardState();
    }
  }
  state.pointerId = null;
}

function transmuteToOrb(eOrX) {
  let x, y, ev;
  if (eOrX && eOrX.clientX !== undefined) { ev = eOrX; x = ev.clientX; y = ev.clientY; }
  else { return; }

  if (navigator.vibrate) navigator.vibrate(40);
  els.card.classList.add('orb', 'closed');
  els.card.classList.remove('content-visible');

  els.card.style.left = (x - 34) + 'px';
  els.card.style.top = (y - 34) + 'px';

  state.isOrb = true; state.isHud = false;

  state.isDragging = true;
  if (ev && ev.pointerId) {
    state.pointerId = ev.pointerId;
    try { els.card.setPointerCapture(ev.pointerId); } catch(e){}
    const rect = els.card.getBoundingClientRect();
    state.dragOffsetX = x - rect.left;
    state.dragOffsetY = y - rect.top;
  }

  updateModeButtons('orb');
}

function revertToCard() {
  state.isOrb = false; state.isHud = false;
  els.card.style.transition = 'all 0.5s var(--ease-smooth)';
  els.card.style.left = ''; els.card.style.top = '';
  els.card.style.width = ''; els.card.style.height = '';
  els.card.style.transform = '';
  els.card.classList.remove('orb', 'hud', 'closed');
  setTimeout(() => els.card.classList.add('content-visible'), 300);
}

window.setMode = (mode, isInitialLoad = false) => {
  updateModeButtons(mode);

  if (mode === 'card') {
    revertToCard();
  } else if (mode === 'orb') {
    state.isOrb = true; state.isHud = false;
    els.card.classList.add('orb', 'closed');
    els.card.classList.remove('hud', 'content-visible');
    els.card.style.transform = 'none';
  } else if (mode === 'hud') {
    state.isHud = true; state.isOrb = false;
    els.card.classList.add('hud', 'closed');
    els.card.classList.remove('orb', 'content-visible');
    els.card.style.top = '';
    els.card.style.left = '';
    els.card.style.transform = '';
  }

  if (!isInitialLoad) saveUIState();
};

function updateModeButtons(mode) {
  [els.btnModeCard, els.btnModeOrb, els.btnModeHud].forEach(b => b && b.classList.remove('active-mode'));
  if (mode === 'card' && els.btnModeCard) els.btnModeCard.classList.add('active-mode');
  if (mode === 'orb' && els.btnModeOrb) els.btnModeOrb.classList.add('active-mode');
  if (mode === 'hud' && els.btnModeHud) els.btnModeHud.classList.add('active-mode');
}

function toggleCardState() {
  if (els.card.classList.contains('animating')) return;
  const isClosed = els.card.classList.contains('closed');
  els.card.classList.add('animating');
  if (isClosed) {
    els.card.classList.remove('closed');
    els.card.animate([{ transform: 'scale(0.95)', opacity: 0.8 }, { transform: 'scale(1)', opacity: 1 }], { duration: 400 }).onfinish = () => {
      els.card.classList.remove('animating');
      els.card.classList.add('content-visible');
    };
  } else {
    els.card.classList.remove('content-visible');
    els.card.animate([{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(10px)', opacity: 1 }], { duration: 200 }).onfinish = () => {
      els.card.classList.add('closed');
      els.card.classList.remove('animating');
    };
  }
}

function escapeHtml(s) { return s ? s.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c])) : ''; }
function showToaster(txt, type = 'default') {
  const wrap = document.getElementById('toasterWrap');
  if (!wrap) return;
  const t = document.createElement('div');
  t.className = `toaster ${type}`;
  t.innerText = txt;
  wrap.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2500);
}
function toggleSection(id, forceOpen = false) {
  const el = document.getElementById(id);
  if (!el) return;
  const h = el.classList.contains('activation-hidden');
  if (forceOpen && !h) return;
  el.classList.toggle('activation-hidden', !forceOpen && !h);
  el.classList.toggle('activation-open', forceOpen || h);
}

// Logic Init
if (els.input) {
  els.input.addEventListener('input', (e) => {
    STATE.user = e.target.value;
    localStorage.setItem('di_userName', STATE.user);
    updateInterface(e.target.value);
    saveData();
  });
}

if (els.copyActBtn) {
  els.copyActBtn.addEventListener('click', async () => {
    try {
      const txt = document.getElementById('actPre')?.innerText || '';
      await navigator.clipboard.writeText(txt);
      showToaster('Ativação copiada', 'success');
    } catch(e) { showToaster('Erro ao copiar ativação', 'error'); }
  });
}

if (els.saveSystemBtn) {
  els.saveSystemBtn.addEventListener('click', () => {
    infodoseName = byId('kardinfodoseNameInput', 'infodoseNameInput', 'cardInfodoseNameInput')?.value.trim() || '';
    const newKey = byId('kardapiKeyInput', 'apiKeyInput', 'cardApiKeyInput')?.value.trim() || '';
    const newModel = byId('kardmodelSelect', 'modelSelect', 'cardModelSelect')?.value.trim() || '';

    if (newKey) {
      apiKey = newKey;
      localStorage.setItem('di_apiKey', apiKey);
      if (typeof STATE !== 'undefined') {
        const active = STATE.keys.find(k => k.active);
        if (active) { active.token = newKey; saveData(); }
      }
    }

    modelName = newModel || modelName;
    localStorage.setItem('di_modelName', modelName);
    localStorage.setItem('di_infodoseName', infodoseName);

    toggleSection('systemCard', false);
    showToaster('Configurações Salvas (di_ synced)', 'success');
  });
}

// KEY para controlar primeira exibição do small preview
const FIRST_PREVIEW_KEY = 'fusion_orb_smallpreview_shown';

function showFirstRunPreviewIfNeeded() {
  try {
    if (localStorage.getItem(FIRST_PREVIEW_KEY)) return;
    if (state.isOrb || state.isHud) return;

    const rawUi = localStorage.getItem(UI_STATE_KEY);
    if (rawUi) {
      try {
        const parsed = JSON.parse(rawUi);
        if (parsed && parsed.mode === 'orb') return;
      } catch(_) {}
    }

    els.card.classList.add('closed');
    if (els.smallPreview) {
      els.smallPreview.style.display = 'flex';
      els.smallPreview.style.opacity = 0;
      requestAnimationFrame(() => els.smallPreview.style.transition = 'opacity 260ms ease-out');
      requestAnimationFrame(() => els.smallPreview.style.opacity = 1);
    }

    els.card.classList.remove('content-visible');
    localStorage.setItem(FIRST_PREVIEW_KEY, '1');
    saveUIState();

  } catch (err) {
    console.error('First preview error', err);
  }
}

// INITIAL LOAD (CINEMATIC SMALL PREVIEW)
setTimeout(() => {
  els.card?.classList.add('active');
  els.avatarTgt?.classList.add('shown');

  loadData();

  const rawUi = localStorage.getItem(UI_STATE_KEY);
  let savedMode = 'card';
  let savedLeft = null;
  let savedTop = null;

  if (rawUi) {
    try {
      const parsed = JSON.parse(rawUi);
      savedMode = parsed.mode || 'card';
      savedLeft = parsed.left;
      savedTop = parsed.top;
    } catch(e) {}
  }

  forceSmallPreview();

  setTimeout(() => {
    restoreSavedMode(savedMode, savedLeft, savedTop);
  }, FIRST_PREVIEW_DURATION);

}, 100);

setInterval(() => {
  if (els.clock) {
    els.clock.innerText = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}, 1000);

function forceSmallPreview() {
  state.isOrb = false;
  state.isHud = false;

  els.card.classList.remove('orb', 'hud');
  els.card.classList.add('closed');
  els.card.classList.remove('content-visible');

  els.card.style.left = '';
  els.card.style.top = '';
  els.card.style.transform = '';

  els.card.style.opacity = 0;
  els.card.style.transition = 'opacity 400ms ease';
  requestAnimationFrame(() => {
    els.card.style.opacity = 1;
  });
}

function restoreSavedMode(mode, left, top) {
  els.card.style.transition = 'all 600ms var(--ease-smooth)';

  if (mode === 'orb') {
    if (left) els.card.style.left = left;
    if (top) els.card.style.top = top;
    window.setMode('orb');
  } else if (mode === 'hud') {
    window.setMode('hud');
  } else {
    window.setMode('card');
    els.card.classList.remove('closed');
    els.card.classList.add('content-visible');
  }
}

(function () {
  function getNameValue() {
    const input = byId('inputUser', 'kardinputUser', 'userInput');
    const saved = localStorage.getItem('di_userName') || '';
    const current = input && input.value ? input.value.trim() : '';
    return current || saved || 'Convidado';
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

  function makeMiniAvatarHTML(name, size = 36) {
    const seed = (name || 'DUAL').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
    const h1 = seed % 360;
    const h2 = (seed * 37) % 360;
    const id = 'g' + seed.toString(36);
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <defs>
          <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="hsl(${h1},100%,55%)"/>
            <stop offset="100%" stop-color="hsl(${h2},90%,45%)"/>
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="7" fill="#071018"/>
        <circle cx="16" cy="16" r="7" fill="url(#${id})"/>
        <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
      </svg>
    `;
  }

  function createAsciiActivation(name) {
    const clean = (name || '').trim() || 'Convidado';
    const displayName = `${clean}.Dual Infodose`;
    const title = 'CÉREBRO-ORÁCULO — BASE v1';

    const width = 35;
    const top = `+${'-'.repeat(width)}+`;
    const titleLine = `| ${padTo(title, width - 2)} |`;
    const nameLine = `Ativar: ${displayName}`;

    return {
      ascii: [top, titleLine, top, nameLine].join('\n'),
      displayName,
      root: root369(clean),
      title
    };
  }

  function updateActivationBlock(name) {
    const els2 = {
      actPre: document.getElementById('actPre'),
      actName: document.getElementById('actName'),
      actTitle: document.getElementById('actTitle'),
      actMiniAvatar: document.getElementById('actMiniAvatar'),
      actBadge: document.getElementById('actBadge'),
      smallText: document.getElementById('smallText'),
      smallIdent: document.getElementById('smallIdent')
    };

    const data = createAsciiActivation(name);

    if (els2.actPre) els2.actPre.innerText = data.ascii;
    if (els2.actName) els2.actName.innerText = data.displayName;
    if (els2.actTitle) els2.actTitle.innerText = data.title;
    if (els2.actMiniAvatar) els2.actMiniAvatar.innerHTML = makeMiniAvatarHTML(name || 'DUAL', 36);

    if (els2.actBadge) {
      els2.actBadge.innerText = `v:${data.root}`;
      els2.actBadge.classList.remove('vibe-gold');
      if (data.root === 3 || data.root === 6 || data.root === 9) {
        els2.actBadge.classList.add('vibe-gold');
      }
    }

    if (els2.smallText) {
      els2.smallText.innerText = (name && name.trim())
        ? `${name.trim()} · canal ASCII ativo`
        : 'Aguardando ativação...';
    }

    if (els2.smallIdent) {
      els2.smallIdent.innerText = (name && name.trim()) ? `v:${data.root}` : '--';
    }
  }

  window.createAsciiActivation = createAsciiActivation;
  window.updateActivationBlock = updateActivationBlock;

  function bindLiveUpdate() {
    const input = byId('inputUser', 'kardinputUser', 'userInput');
    if (!input) return;

    const run = () => {
      const name = input.value.trim() || 'Convidado';
      localStorage.setItem('di_userName', name);
      updateInterface(name);
      updateActivationBlock(name);
    };

    input.addEventListener('input', run);
    input.addEventListener('blur', run);

    run();
  }

  function hookButtons() {
    const copyBtn = document.getElementById('copyActBtn');
    const dlBtn = document.getElementById('downloadActBtn');
    const actCard = document.getElementById('activationCard');

    if (copyBtn) {
      copyBtn.onclick = async () => {
        const pre = document.getElementById('actPre');
        if (!pre) return;
        try {
          await navigator.clipboard.writeText(pre.innerText);
        } catch (_) {
          const ta = document.createElement('textarea');
          ta.value = pre.innerText;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
      };
    }

    if (dlBtn) {
      dlBtn.onclick = async () => {
        if (!window.html2canvas || !actCard) return;
        const canvas = await html2canvas(actCard, { backgroundColor: null, scale: 2 });
        const a = document.createElement('a');
        a.download = `activation-${Date.now()}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      };
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      bindLiveUpdate();
      hookButtons();
    });
  } else {
    bindLiveUpdate();
    hookButtons();
  }
})();