import { safeJsonParse } from './utils.js';

export function loadIaConfigFromStorage({ STORAGE, DEFAULTS, CONFIG, apiKeyInput, modelSelect, customModelInput, iaStatus, localStorage }) {
  const key = localStorage.getItem(STORAGE.OPENROUTER_KEY) || '';
  const model = localStorage.getItem(STORAGE.OPENROUTER_MODEL) || DEFAULTS.MODEL;

  CONFIG.API_URL = DEFAULTS.API_URL;
  CONFIG.MODEL = model || DEFAULTS.MODEL;
  CONFIG.TEMP = DEFAULTS.TEMP;
  CONFIG.CHUNK_SIZE = DEFAULTS.CHUNK_SIZE;
  CONFIG.AUTH_TOKEN = key ? 'Bearer ' + key : '';

  if (apiKeyInput) apiKeyInput.value = key;

  let optionFound = false;
  if (modelSelect) {
    Array.from(modelSelect.options).forEach(opt => {
      if (opt.value === model) {
        optionFound = true;
        modelSelect.value = model;
      }
    });
    if (!optionFound) {
      modelSelect.value = 'custom';
      if (customModelInput) customModelInput.value = model;
    }
  }

  if (iaStatus) {
    if (!key) {
      iaStatus.textContent = 'Nenhuma chave salva ainda.';
      iaStatus.className = 'ia-status warn';
    } else {
      iaStatus.textContent = 'Config carregada. Pronto para chamar a IA.';
      iaStatus.className = 'ia-status ok';
    }
  }
}

export function saveIaConfig({ STORAGE, DEFAULTS, CONFIG, apiKeyInput, modelSelect, customModelInput, iaStatus, localStorage }) {
  let key = apiKeyInput ? apiKeyInput.value.trim() : '';
  let model = modelSelect ? modelSelect.value : DEFAULTS.MODEL;

  if (model === 'custom') {
    const custom = customModelInput ? customModelInput.value.trim() : '';
    if (custom) model = custom;
  }
  if (!model) model = DEFAULTS.MODEL;

  if (!key) {
    if (iaStatus) {
      iaStatus.textContent = 'Cole uma chave sk-or-... para salvar.';
      iaStatus.className = 'ia-status warn';
    }
    return false;
  }

  localStorage.setItem(STORAGE.OPENROUTER_KEY, key);
  localStorage.setItem(STORAGE.OPENROUTER_MODEL, model);

  CONFIG.AUTH_TOKEN = 'Bearer ' + key;
  CONFIG.MODEL = model;

  if (iaStatus) {
    iaStatus.textContent = 'Config salva com sucesso.';
    iaStatus.className = 'ia-status ok';
  }
  return true;
}

export function clearIaConfig({ STORAGE, DEFAULTS, CONFIG, apiKeyInput, modelSelect, customModelInput, iaStatus, localStorage }) {
  localStorage.removeItem(STORAGE.OPENROUTER_KEY);
  localStorage.removeItem(STORAGE.OPENROUTER_MODEL);
  if (apiKeyInput) apiKeyInput.value = '';
  if (customModelInput) customModelInput.value = '';
  if (modelSelect) modelSelect.value = DEFAULTS.MODEL;
  CONFIG.AUTH_TOKEN = '';
  CONFIG.MODEL = DEFAULTS.MODEL;
  if (iaStatus) {
    iaStatus.textContent = 'Config limpa. Defina novamente antes de enviar.';
    iaStatus.className = 'ia-status warn';
  }
}

export function restoreTheme({ STORAGE, localStorage, applyTheme }) {
  const theme = localStorage.getItem(STORAGE.THEME) || 'dark';
  applyTheme(theme);
}

export function applyTheme({ STORAGE, localStorage, themeSelect }, theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem(STORAGE.THEME, theme);
  if (themeSelect) themeSelect.value = theme;
}

export function restoreNames({ STORAGE, localStorage, userNameInput, assistantInput, assistantNameEl }) {
  const user = localStorage.getItem(STORAGE.USER_NAME) || '';
  const asst = localStorage.getItem(STORAGE.ASSISTANT_NAME) || 'Dual.Infodose · Cinemático';
  if (user && userNameInput) userNameInput.value = user;
  if (asst && assistantInput) assistantInput.value = asst;
  if (assistantNameEl) assistantNameEl.textContent = asst;
}

export function saveConversationNow({ conversation, localStorage, footerHint, renderHistoryItems }) {
  try {
    const snap = {
      ts: new Date().toISOString(),
      conversation: conversation.slice(0, 100)
    };
    const key = 'KDX_CONV_' + snap.ts;
    localStorage.setItem(key, JSON.stringify(snap));
    const idx = JSON.parse(localStorage.getItem('KDX_CONV_INDEX') || '[]');
    idx.unshift(key);
    localStorage.setItem('KDX_CONV_INDEX', JSON.stringify(idx.slice(0, 50)));
    if (footerHint) footerHint.textContent = 'Conversa salva.';
    renderHistoryItems && renderHistoryItems();
    return true;
  } catch (e) {
    console.error(e);
    if (footerHint) footerHint.textContent = 'Erro ao salvar conversa.';
    return false;
  }
}

export function renderHistoryItems({ localStorage, conversation, responseList, footerHint, escapeHtml }) {
  const container = document.getElementById('kdxHistoryItems');
  if (!container) return;
  container.innerHTML = '';
  const idx = JSON.parse(localStorage.getItem('KDX_CONV_INDEX') || '[]');
  if (idx.length === 0) {
    container.innerHTML = '<div class="lv-callout lv-aside">Nenhuma conversa salva ainda.</div>';
    return;
  }
  idx.forEach(k => {
    try {
      const snap = JSON.parse(localStorage.getItem(k));
      const el = document.createElement('div');
      el.className = 'md-tabelista';
      el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;">
          <div><strong>${snap.ts}</strong><div style="opacity:.85;font-size:.82rem">${snap.conversation.length} itens</div></div>
          <div style="display:flex;gap:6px">
            <button class="lv-btn" data-load="${k}">Carregar</button>
            <button class="lv-btn secondary" data-delete="${k}">Excluir</button>
          </div>
        </div>`;
      container.appendChild(el);
    } catch (e) {}
  });

  container.querySelectorAll('[data-load]').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const key = ev.currentTarget.dataset.load;
      const snap = JSON.parse(localStorage.getItem(key));
      if (snap) {
        conversation.length = 0;
        conversation.push(...snap.conversation.slice());
        responseList.innerHTML = '';
        conversation.slice().reverse().forEach(item => {
          const d = document.createElement('div');
          d.className = 'response-block middle';
          d.innerHTML = `<div><strong>${escapeHtml(item.role)}</strong><div style="opacity:.85;margin-top:6px">${escapeHtml(item.content || '')}</div></div>`;
          responseList.appendChild(d);
        });
        if (footerHint) footerHint.textContent = 'Conversa carregada do histórico.';
      }
    });
  });

  container.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const key = ev.currentTarget.dataset.delete;
      localStorage.removeItem(key);
      const idx = JSON.parse(localStorage.getItem('KDX_CONV_INDEX') || '[]').filter(k => k !== key);
      localStorage.setItem('KDX_CONV_INDEX', JSON.stringify(idx));
      renderHistoryItems({ localStorage, conversation, responseList, footerHint, escapeHtml });
    });
  });
}
