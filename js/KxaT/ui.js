export function applyTheme({ STORAGE, localStorage, themeSelect }, theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem(STORAGE.THEME, theme);
  if (themeSelect) themeSelect.value = theme;
}

export function restoreTheme({ STORAGE, localStorage, applyThemeFn }) {
  const theme = localStorage.getItem(STORAGE.THEME) || 'dark';
  applyThemeFn(theme);
}

export function ensureSettingsPanel({
  state,
  STORAGE,
  localStorage,
  applyThemeFn,
  renderHistoryItems,
  saveConversationNow,
  footerHint,
  voiceConfig,
  setVoiceOverride,
  availableVoiceKeys = []
}) {
  const settingsPanelId = 'kdxSettingsPanel';
  if (document.getElementById(settingsPanelId)) return;

  const panel = document.createElement('aside');
  panel.id = settingsPanelId;
  panel.className = 'kdx-settings-panel';
  panel.innerHTML = `
    <header class="kdx-sp-header">
      <strong>Configurações · Dual.Infodose</strong>
      <button id="kdxSpClose" aria-label="Fechar">✕</button>
    </header>
    <div class="kdx-sp-body">
      <section class="kdx-section">
        <label>Tema</label>
        <select id="kdxThemeSelect">
          <option value="dark">Dark</option>
          <option value="medium">Medium Light</option>
          <option value="vibe">Vibe</option>
        </select>
      </section>

      <section class="kdx-section">
        <label>Estilo de página</label>
        <div>
          <button class="kdx-style-btn" data-style="default">Padrão</button>
          <button class="kdx-style-btn" data-style="minimal">Minimal</button>
          <button class="kdx-style-btn" data-style="78k">78K Turbo</button>
        </div>
      </section>

      <section class="kdx-section">
        <label>Voz / Arquétipo ativo</label>
        <div style="display:flex;gap:8px;align-items:center;">
          <select id="kdxVoiceSelect"></select>
          <button id="kdxVoiceApply" class="pill-btn">Aplicar</button>
        </div>
        <small id="kdxVoiceHint" style="opacity:.8;display:block;margin-top:6px;">A voz será selecionada automaticamente ao ler blocos por arquétipo; aqui você pode sobrescrever.</small>
      </section>

      <section class="kdx-section">
        <label>Histórico & Salvamento</label>
        <div style="display:flex;gap:8px;align-items:center;">
          <button id="kdxOpenHistory" class="pill-btn secondary">Abrir Histórico</button>
          <button id="kdxSaveConv" class="pill-btn">Salvar Agora</button>
        </div>
        <div style="margin-top:8px;">
          <label><input type="checkbox" id="kdxAutoSave"/> Salvar conversas automaticamente</label>
        </div>
      </section>

      <section id="kdxHistoryList" class="kdx-section" style="display:none;">
        <label>Histórico de conversas</label>
        <div id="kdxHistoryItems" style="max-height:220px;overflow:auto;"></div>
      </section>
    </div>
    <footer class="kdx-sp-footer">
      <small>Registro Vivo Δ7</small>
    </footer>
  `;
  document.body.appendChild(panel);

  document.getElementById('kdxSpClose').addEventListener('click', () => panel.classList.remove('active'));

  const themeSelect = document.getElementById('kdxThemeSelect');
  themeSelect.value = localStorage.getItem(STORAGE.THEME) || 'dark';
  themeSelect.addEventListener('change', (e) => {
    applyThemeFn(e.target.value === 'medium' ? 'medium' : e.target.value);
    localStorage.setItem(STORAGE.THEME, e.target.value);
  });

  document.querySelectorAll('.kdx-style-btn').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      const style = ev.currentTarget.dataset.style;
      document.body.dataset.pageStyle = style;
      localStorage.setItem('PAGE_STYLE', style);
      if (style === 'minimal') {
        document.documentElement.style.setProperty('--kob-voice-theme-duration', '250ms');
        document.documentElement.style.setProperty('--shadow-soft', '0 6px 12px rgba(0,0,0,.45)');
        document.body.classList.add('minimal-style');
        document.body.classList.remove('turbo-style');
      } else if (style === '78k') {
        document.body.classList.add('turbo-style');
        document.body.classList.remove('minimal-style');
      } else {
        document.body.classList.remove('minimal-style', 'turbo-style');
      }
    });
  });

  const voiceSel = document.getElementById('kdxVoiceSelect');
  voiceSel.innerHTML = '<option value="">Automático (por arquétipo)</option>' + availableVoiceKeys.map(k => `<option value="${k}">${k}</option>`).join('');

  document.getElementById('kdxVoiceApply').addEventListener('click', () => {
    const v = voiceSel.value;
    setVoiceOverride && setVoiceOverride(v);
    if (footerHint) footerHint.textContent = v ? `Voz sobrescrita: ${v}` : 'Voz automática por arquétipo.';
  });

  document.getElementById('kdxOpenHistory').addEventListener('click', () => {
    const hsec = document.getElementById('kdxHistoryList');
    hsec.style.display = hsec.style.display === 'none' ? 'block' : 'none';
    renderHistoryItems && renderHistoryItems();
  });

  document.getElementById('kdxSaveConv').addEventListener('click', () => {
    saveConversationNow && saveConversationNow();
  });

  const auto = localStorage.getItem('KDX_AUTOSAVE') === '1';
  const autoCheck = document.getElementById('kdxAutoSave');
  autoCheck.checked = auto;
  autoCheck.addEventListener('change', (e) => {
    localStorage.setItem('KDX_AUTOSAVE', e.target.checked ? '1' : '0');
  });
}

export function openSettingsPanel() {
  const panel = document.getElementById('kdxSettingsPanel');
  if (!panel) return;
  panel.classList.add('active');
}

export function initParticles() {
  if (!window.particlesJS) {
    console.warn('particlesJS não encontrado.');
    return;
  }
  particlesJS('particles-js', {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: ['#00f5ff', '#ff4bff', '#ffffff'] },
      shape: { type: 'circle' },
      opacity: { value: 0.45, random: true },
      size: { value: 3, random: true },
      line_linked: {
        enable: true,
        distance: 140,
        color: '#00f5ff',
        opacity: 0.25,
        width: 1
      },
      move: {
        enable: true,
        speed: 1.2,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'out',
        bounce: false
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'grab' },
        onclick: { enable: false, mode: 'push' },
        resize: true
      },
      modes: {
        grab: {
          distance: 160,
          line_linked: { opacity: 0.5 }
        }
      }
    },
    retina_detect: true
  });
}

export function bindClipboard({ copyBtn, pasteBtn, responseList, userInput, footerHint, showToast }) {
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const temp = responseList?.innerText || '';
      if (!temp) return;
      try {
        await navigator.clipboard.writeText(temp);
        if (footerHint) footerHint.textContent = 'Tudo copiado.';
        showToast && showToast('Tudo copiado');
      } catch {
        if (footerHint) footerHint.textContent = 'Não consegui copiar.';
        showToast && showToast('Não consegui copiar', true);
      }
    });
  }

  if (pasteBtn) {
    pasteBtn.addEventListener('click', async () => {
      try {
        const txt = await navigator.clipboard.readText();
        if (txt && userInput) userInput.value = txt;
      } catch (e) {}
    });
  }
}

export function showToastFactory(toastContainer) {
  return function showToast(message, isError = false) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    toast.style.background = isError ? '#c44' : '';
    toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };
}
