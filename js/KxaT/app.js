import { STORAGE, DEFAULTS, ARCHETYPE_KEYWORDS, RV_ARCHES, ARCH_NAMES } from './config.js';
import { qs, escapeHtml } from './utils.js';
import { state } from './state.js';
import { parseMarkdownBasic, splitResponseCinematic } from './markdown.js';
import { initAccordionObserver } from './accordion.js';
import { loadIaConfigFromStorage, saveIaConfig, clearIaConfig, restoreTheme as restoreThemeStorage, applyTheme as applyThemeStorage, restoreNames, saveConversationNow, renderHistoryItems } from './storage.js';
import { initSpeech, detectArchetypeFromText, markBlockArchetype, loadVoiceConfigFromStorage, updateVoiceOrbLabel, speakBlock, speakRecentBlocks, enhanceBlock } from './voice.js';
import { callOpenRouter } from './ai.js';
import { createFractalEngine } from './fractal.js';
import { applyTheme, ensureSettingsPanel, initParticles, bindClipboard, openSettingsPanel, showToastFactory } from './ui.js';

const CONFIG = {
  API_URL: DEFAULTS.API_URL,
  MODEL: DEFAULTS.MODEL,
  TEMP: DEFAULTS.TEMP,
  CHUNK_SIZE: DEFAULTS.CHUNK_SIZE,
  AUTH_TOKEN: ''
};

let responseContainer = null;
let responseList = null;
let bootBlock = null;

let bootText = null;
let footerHint = null;
let copyBtn = null;
let pasteBtn = null;
let parserBtn = null;
let parserFile = null;
let voiceConfigBtn = null;
let voiceConfigFile = null;
let toggleLoginBtn = null;
let loginBox = null;
let loginForm = null;
let userNameInput = null;
let assistantInput = null;
let assistantNameEl = null;
let userInput = null;
let sendBtn = null;
let themeToggleBtn = null;
let voiceBtn = null;

let iaConfigPanel = null;
let apiKeyInput = null;
let modelSelect = null;
let customModelInput = null;
let saveIaConfigBtn = null;
let clearIaConfigBtn = null;
let iaStatus = null;
let themeSelect = null;
let settingsBtn = null;
let toastContainer = null;

let showToast = null;
let dom = null;
let fractalEngine = null;

function cacheDom() {
  responseContainer = qs(['#response']);
  responseList = qs(['#responseList']);
  bootBlock = qs(['#bootBlock']);

  bootText = qs(['#bootText']);
  footerHint = qs(['#footerHint']);
  copyBtn = qs(['#copyBtn']);
  pasteBtn = qs(['#pasteBtn']);
  parserBtn = qs(['#parserBtn']);
  parserFile = qs(['#parserFile']);
  voiceConfigBtn = qs(['#voiceConfigBtn']);
  voiceConfigFile = qs(['#voiceConfigFile']);
  toggleLoginBtn = qs(['#toggleLoginBtn']);
  loginBox = qs(['#loginBox']);
  loginForm = qs(['#loginForm']);
  userNameInput = qs(['#profileUserNameInput', '#userName', '#diUserNameInput']);
  assistantInput = qs(['#assistantInput']);
  assistantNameEl = qs(['#assistantName']);
  userInput = qs(['#chatMessageInput', '#userInput', '#inputText', '#messageInput', '#dualMessageInput']);
  sendBtn = qs(['#sendBtn']);
  themeToggleBtn = qs(['#themeToggle']);
  voiceBtn = qs(['#voiceBtn']);

  iaConfigPanel = qs(['#iaConfigPanel']);
  apiKeyInput = qs(['#apiKeyInput']);
  modelSelect = qs(['#modelSelect']);
  customModelInput = qs(['#customModelInput']);
  saveIaConfigBtn = qs(['#saveIaConfigBtn']);
  clearIaConfigBtn = qs(['#clearIaConfigBtn']);
  iaStatus = qs(['#iaStatus']);
  themeSelect = qs(['#themeSelect']);
  settingsBtn = qs(['#toggleSettingsBtn']);
  toastContainer = qs(['#toast-container']);

  dom = {
    input: qs(['#inputText']),
    output: qs(['#outputContainer']),
    genBtn: qs(['#genBtn']),
    archSelect: qs(['#startArch']),
    cycleCheck: qs(['#cycleMode']),
    body: document.body,
    copyBtn: qs(['#copyBtn']),
    clearBtn: qs(['#clearBtn']),
    downloadBtn: qs(['#downloadBtn']),
    statusBar: qs(['#statusBar']),
    hudStatus: qs(['#hudStatus']),
    toastContainer,
    mainCard: qs(['#mainHeroCard'])
  };

  showToast = showToastFactory(toastContainer);
}

function applyThemeFn(theme) {
  applyThemeStorage({ STORAGE, localStorage, themeSelect }, theme);
}

function restoreThemeFn() {
  restoreThemeStorage({ STORAGE, localStorage, applyThemeFn });
}

function restoreVoiceState() {
  initSpeech(state);
  loadVoiceConfigFromStorage({ state, STORAGE, localStorage, voiceConfigBtn });
  const archActive = localStorage.getItem('ARCHETYPE_ACTIVE');
  if (archActive) {
    state.currentVoiceKey = archActive;
    localStorage.setItem(STORAGE.VOICE_CURRENT_KEY, state.currentVoiceKey);
  }
  updateVoiceOrbLabel(state, voiceConfigBtn);
}

function initSettingsPanel() {
  const voiceKeys = Object.keys(window.KOBLLUX_VOICES || {}).sort();
  ensureSettingsPanel({
    state,
    STORAGE,
    localStorage,
    applyThemeFn,
    renderHistoryItems: () => renderHistoryItems({
      localStorage,
      conversation: state.conversation,
      responseList,
      footerHint,
      escapeHtml
    }),
    saveConversationNow: () => saveConversationNow({
      conversation: state.conversation,
      localStorage,
      footerHint,
      renderHistoryItems: () => renderHistoryItems({
        localStorage,
        conversation: state.conversation,
        responseList,
        footerHint,
        escapeHtml
      })
    }),
    footerHint,
    availableVoiceKeys: voiceKeys,
    setVoiceOverride: (v) => {
      if (!v) {
        if (state.voiceConfig && state.voiceConfig.default) {
          delete state.voiceConfig.default;
          localStorage.setItem(STORAGE.VOICE_CONFIG, JSON.stringify(state.voiceConfig));
        }
        return;
      }
      state.voiceConfig = state.voiceConfig || {};
      state.voiceConfig.default = state.voiceConfig.default || {};
      state.voiceConfig.default.voiceHint = (window.KOBLLUX_VOICES && window.KOBLLUX_VOICES[v] && window.KOBLLUX_VOICES[v].voice) || v;
      localStorage.setItem(STORAGE.VOICE_CONFIG, JSON.stringify(state.voiceConfig));
    }
  });
}

function appendBlocksFromData(blocks) {
  if (!blocks || !blocks.length) return;
  if (bootBlock) {
    bootBlock.remove();
    bootBlock = null;
  }
  blocks.forEach(page => {
    const div = document.createElement('div');
    div.className = 'response-block ' + (page.kind || 'middle');
    div.dataset.role = 'assistant';
    div.innerHTML = page.html;

    enhanceBlock(div, state, {
      ARCHETYPE_KEYWORDS,
      onBlockClick,
      onSpeak: (node) => speakBlock(state, node, {
        footerHint,
        voiceBtn,
        localStorage,
        STORAGE,
        ARCHETYPE_KEYWORDS,
        detectFn: detectArchetypeFromText,
        markArchetypeFn: markBlockArchetype
      }),
      footerHint
    });

    responseList.appendChild(div);
  });
}

function appendUserPulseBlock(text) {
  if (!text) return;
  if (bootBlock) {
    bootBlock.remove();
    bootBlock = null;
  }
  const div = document.createElement('div');
  div.className = 'response-block user-pulse';
  div.dataset.role = 'user';
  div.innerHTML = '<p>' + parseMarkdownBasic(text).replace(/\n/g, '<br/>') + '</p>';
  enhanceBlock(div, state, {
    ARCHETYPE_KEYWORDS,
    onBlockClick,
    onSpeak: (node) => speakBlock(state, node, {
      footerHint,
      voiceBtn,
      localStorage,
      STORAGE,
      ARCHETYPE_KEYWORDS,
      detectFn: detectArchetypeFromText,
      markArchetypeFn: markBlockArchetype
    }),
    footerHint
  });
  responseList.appendChild(div);
}

function onBlockClick(ev) {
  const block = ev.currentTarget;
  block.classList.add('clicked');
  setTimeout(() => block.classList.remove('clicked'), 350);

  const stateValue = block.dataset.state || 'idle';
  const text = block.innerText.trim();
  if (!text) return;

  if (stateValue === 'idle' || stateValue === 'sent') {
    block.dataset.state = 'spoken';
    speakBlock(state, block, {
      footerHint,
      voiceBtn,
      localStorage,
      STORAGE,
      ARCHETYPE_KEYWORDS,
      detectFn: detectArchetypeFromText,
      markArchetypeFn: markBlockArchetype
    });
    return;
  }

  if (stateValue === 'spoken') {
    block.dataset.state = 'sent';
    sendPrompt(text, { fromBlock: true });
  }
}

function buildSystemPrompt() {
  const userName = localStorage.getItem(STORAGE.USER_NAME) || 'humano';
  const asstName = localStorage.getItem(STORAGE.ASSISTANT_NAME) || 'Dual.Infodose';
  return [
    `${asstName} é o assistente Cinemático da Infodose, especializado em respostas em blocos.`,
    '1. Responda em português por padrão.',
    '2. Use blocos curtos, com títulos, listas e callouts (::info, ::warn, ::success, ::question, ::aside) quando fizer sentido.',
    '3. Cada parágrafo separado por linha vazia vira um bloco independente.',
    '4. Priorize explicações práticas, exemplos e micro-ações de 1%.',
    '5. Quando fizer sentido, use Tabelista (linhas com "- |" ) para estruturar comparações.',
    '6. Não peça chave de API; assuma que a infraestrutura já está pronta do lado do usuário.',
    `7. O usuário se chama ${userName}; fale com ele pelo nome algumas vezes, mas sem exagero.`
  ].join('\n');
}

async function sendPrompt(promptText, options = {}) {
  const fromBlock = !!options.fromBlock;
  const text = (promptText || '').trim();
  if (!text) return;

  responseContainer && responseContainer.classList.remove('collapsed');
  if (!fromBlock && userInput) userInput.value = '';
  if (userInput) userInput.disabled = true;
  if (sendBtn) sendBtn.disabled = true;

  const oldFooter = footerHint ? footerHint.textContent : '';
  if (footerHint) footerHint.textContent = fromBlock ? 'Pulso em expansão a partir do bloco.' : 'Processando pulso.';

  if (state.synth && state.synth.speaking) {
    state.synth.cancel();
    if (voiceBtn) voiceBtn.classList.remove('speaking');
  }

  appendUserPulseBlock(text);

  try {
    if (!CONFIG.AUTH_TOKEN) {
      const localMsg = [
        '::info Modo local ativo (sem OpenRouter).',
        '',
        'Você pode:',
        '- Abrir o painel de configuração (engrenagem) e salvar uma chave OpenRouter;',
        '- Ou usar este espaço como diário simbólico, clicando nos blocos para ouvir e reenviar.'
      ].join('\n');

      appendBlocksFromData(splitResponseCinematic(localMsg));
      return;
    }

    const answer = await callOpenRouter({
      CONFIG,
      STORAGE,
      localStorage,
      conversation: state.conversation,
      promptText: text
    });

    state.conversation.push({ role: 'user', content: text });
    state.conversation.push({ role: 'assistant', content: answer });

    appendBlocksFromData(splitResponseCinematic(answer));
  } catch (err) {
    console.error(err);
    appendBlocksFromData([{
      kind: 'ending',
      html: '<p><strong>Ops.</strong> Não foi possível falar com o OpenRouter agora. Verifique sua chave e tente novamente.</p>'
    }]);
  } finally {
    if (userInput) {
      userInput.disabled = false;
      userInput.focus();
    }
    if (sendBtn) sendBtn.disabled = false;
    if (footerHint) footerHint.textContent = oldFooter || 'Do seu jeito. Sempre único. Sempre seu.';
  }
}

function handleSendFromInput() {
  const text = userInput ? userInput.value.trim() : '';
  if (!text) return;
  sendPrompt(text, { fromBlock: false });
}

function bindParser() {
  if (parserBtn) {
    parserBtn.addEventListener('click', () => {
      if (parserFile) {
        parserFile.value = '';
        parserFile.click();
      }
    });
  }

  if (parserFile) {
    parserFile.addEventListener('change', () => {
      const file = parserFile.files && parserFile.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result || '';
        const name = file.name.toLowerCase();
        if (name.endsWith('.css')) {
          const style = document.createElement('style');
          style.textContent = content;
          document.head.appendChild(style);
          if (footerHint) footerHint.textContent = 'CSS extra de renderização aplicado.';
        } else if (name.endsWith('.js')) {
          try {
            const fn = new Function('window', 'document', content);
            fn(window, document);
            if (footerHint) footerHint.textContent = 'Parser JS carregado.';
          } catch (e) {
            console.error('Erro ao avaliar parser JS:', e);
            if (footerHint) footerHint.textContent = 'Erro ao carregar parser JS. Veja o console.';
          }
        } else {
          if (footerHint) footerHint.textContent = 'Formato não suportado. Use .js ou .css.';
        }
      };
      reader.readAsText(file);
    });
  }
}

function bindVoiceControls() {
  if (!voiceConfigBtn) return;

  voiceConfigBtn.addEventListener('click', () => {
    if (!state.voiceConfig) {
      if (voiceConfigFile) voiceConfigFile.click();
      return;
    }
    const keys = Object.keys(state.voiceConfig).filter(k => k !== 'current');
    if (!keys.length) return;
    const idx = keys.indexOf(state.currentVoiceKey);
    const nextKey = keys[(idx + 1 + keys.length) % keys.length];
    state.currentVoiceKey = nextKey;
    localStorage.setItem(STORAGE.VOICE_CURRENT_KEY, state.currentVoiceKey);
    updateVoiceOrbLabel(state, voiceConfigBtn);
    if (footerHint) footerHint.textContent = 'Voz ativa: ' + state.currentVoiceKey;
  });

  if (voiceConfigFile) {
    voiceConfigFile.addEventListener('change', () => {
      const file = voiceConfigFile.files && voiceConfigFile.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const json = JSON.parse(reader.result || '{}');
          if (!json || typeof json !== 'object') {
            if (footerHint) footerHint.textContent = 'JSON inválido de vozes.';
            return;
          }
          state.voiceConfig = json;
          const keys = Object.keys(state.voiceConfig);
          if (!keys.length) {
            if (footerHint) footerHint.textContent = 'JSON de vozes vazio.';
            return;
          }
          const candidate = (state.voiceConfig.current && keys.includes(state.voiceConfig.current)) ? state.voiceConfig.current : (keys.includes('default') ? 'default' : keys[0]);
          state.currentVoiceKey = candidate;
          localStorage.setItem(STORAGE.VOICE_CONFIG, JSON.stringify(state.voiceConfig));
          localStorage.setItem(STORAGE.VOICE_CURRENT_KEY, state.currentVoiceKey);
          updateVoiceOrbLabel(state, voiceConfigBtn);
          if (footerHint) footerHint.textContent = 'Config de vozes carregada: ' + keys.join(', ');
        } catch (e) {
          console.error('Erro ao ler JSON de vozes:', e);
          if (footerHint) footerHint.textContent = 'Erro ao carregar JSON de vozes. Veja o console.';
        }
      };
      reader.readAsText(file);
    });
  }
}

function bindLogin() {
  if (toggleLoginBtn) {
    toggleLoginBtn.addEventListener('click', () => {
      loginBox.classList.toggle('active');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const user = userNameInput ? (userNameInput.value.trim() || 'Você') : 'Você';
      const asst = assistantInput ? (assistantInput.value.trim() || 'Dual.Infodose') : 'Dual.Infodose';
      localStorage.setItem(STORAGE.USER_NAME, user);
      localStorage.setItem(STORAGE.ASSISTANT_NAME, asst);
      if (assistantNameEl) assistantNameEl.textContent = asst;
      loginBox.classList.remove('active');
      state.conversation.unshift({
        role: 'system',
        content: `O usuário se chama ${user}. O assistente se apresenta como ${asst}. Responda com carinho cinematográfico.`
      });
    });
  }
}

function bindThemeAndSettings() {
  if (themeToggleBtn && iaConfigPanel) {
    themeToggleBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      openSettingsPanel();
    });
  }

  if (settingsBtn && iaConfigPanel) {
    settingsBtn.addEventListener('click', () => {
      iaConfigPanel.classList.toggle('active');
    });
  }

  if (themeSelect) {
    themeSelect.addEventListener('change', () => {
      applyThemeFn(themeSelect.value || 'dark');
    });
  }
}

function bindIaConfig() {
  if (saveIaConfigBtn) saveIaConfigBtn.addEventListener('click', () => saveIaConfig({ STORAGE, DEFAULTS, CONFIG, apiKeyInput, modelSelect, customModelInput, iaStatus, localStorage }));
  if (clearIaConfigBtn) clearIaConfigBtn.addEventListener('click', () => clearIaConfig({ STORAGE, DEFAULTS, CONFIG, apiKeyInput, modelSelect, customModelInput, iaStatus, localStorage }));
}

function bindSending() {
  if (sendBtn) sendBtn.addEventListener('click', handleSendFromInput);
  if (userInput) {
    userInput.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' && !ev.shiftKey) {
        ev.preventDefault();
        handleSendFromInput();
      }
    });
  }
}

function maybeAutoSave() {
  if (localStorage.getItem('KDX_AUTOSAVE') === '1') {
    clearTimeout(window.__kdx_auto_save_t_);
    window.__kdx_auto_save_t_ = setTimeout(() => {
      saveConversationNow({
        conversation: state.conversation,
        localStorage,
        footerHint,
        renderHistoryItems: () => renderHistoryItems({
          localStorage,
          conversation: state.conversation,
          responseList,
          footerHint,
          escapeHtml
        })
      });
    }, 1200);
  }
}

function bindCopyPaste() {
  bindClipboard({ copyBtn, pasteBtn, responseList, userInput, footerHint, showToast });
}

function initBoot() {
  restoreThemeFn();
  restoreNames({ STORAGE, localStorage, userNameInput, assistantInput, assistantNameEl });
  loadIaConfigFromStorage({ STORAGE, DEFAULTS, CONFIG, apiKeyInput, modelSelect, customModelInput, iaStatus, localStorage });
  restoreVoiceState();

  const archActive = localStorage.getItem('ARCHETYPE_ACTIVE');
  if (archActive) {
    state.currentVoiceKey = archActive;
    localStorage.setItem(STORAGE.VOICE_CURRENT_KEY, state.currentVoiceKey);
  }
  updateVoiceOrbLabel(state, voiceConfigBtn);

  initAccordionObserver(document.body);
  initParticles();

  const randomArch = RV_ARCHES[Math.floor(Math.random() * RV_ARCHES.length)];
  localStorage.setItem('ARCHETYPE_ACTIVE', randomArch);

  if (bootText) {
    const msg =
`[${randomArch}] Roda-Viva aleatória ativada.
Hoje quem abre o portal é ${randomArch}.
Iniciando. Pulso simbiótico detectado. Presença reconhecida.`;
    bootText.dataset.text = msg;
    bootText.textContent = msg;
    bootText.classList.add('pulse');
  }
  if (bootBlock) markBlockArchetype(bootBlock, randomArch);

  if (typeof window.KOB_APPLY_VOICE_THEME === 'function') {
    window.KOB_APPLY_VOICE_THEME(randomArch.toLowerCase());
  }

  if (bootBlock && state.synth) {
    setTimeout(() => {
      try {
        speakBlock(state, bootBlock, {
          footerHint,
          voiceBtn,
          localStorage,
          STORAGE,
          ARCHETYPE_KEYWORDS,
          detectFn: detectArchetypeFromText,
          markArchetypeFn: markBlockArchetype
        });
      } catch (e) {}
    }, 700);
  }

  if (voiceBtn) {
    voiceBtn.addEventListener('click', (ev) => {
      const wantAll = ev.shiftKey === true;
      if (wantAll) {
        speakRecentBlocks(state, state.responseBlocks, {
          footerHint,
          voiceBtn,
          localStorage,
          STORAGE,
          ARCHETYPE_KEYWORDS,
          detectFn: detectArchetypeFromText,
          markArchetypeFn: markBlockArchetype
        }, Infinity);
        return;
      }
      speakRecentBlocks(state, state.responseBlocks, {
        footerHint,
        voiceBtn,
        localStorage,
        STORAGE,
        ARCHETYPE_KEYWORDS,
        detectFn: detectArchetypeFromText,
        markArchetypeFn: markBlockArchetype
      }, 9);
    });
  }

  if (copyBtn) bindCopyPaste();

  if (parserBtn || parserFile) bindParser();
  bindVoiceControls();
  bindLogin();
  bindThemeAndSettings();
  bindIaConfig();
  bindSending();

  maybeAutoSave();

  if (typeof window.KOBLLUX_VOICES === 'object' && voiceConfigBtn) {
    updateVoiceOrbLabel(state, voiceConfigBtn);
  }

  console.log('Dual Cinemático modular inicializado. Arquétipo inicial:', randomArch);
}

function setupFractals() {
  const fractalDom = {
    input: qs(['#inputText']),
    output: qs(['#outputContainer']),
    genBtn: qs(['#genBtn']),
    archSelect: qs(['#startArch']),
    cycleCheck: qs(['#cycleMode']),
    body: document.body,
    copyBtn: qs(['#copyBtn']),
    clearBtn: qs(['#clearBtn']),
    downloadBtn: qs(['#downloadBtn']),
    statusBar: qs(['#statusBar']),
    hudStatus: qs(['#hudStatus']),
    toastContainer: qs(['#toast-container']),
    mainCard: qs(['#mainHeroCard'])
  };

  fractalEngine = createFractalEngine({
    state,
    dom: fractalDom,
    ARCHETYPES: RV_ARCHES,
    ARCH_NAMES,
    localStorage
  });
}

function boot() {
  if (state.initialized) return;
  state.initialized = true;
  cacheDom();
  initBoot();
  setupFractals();
  initSettingsPanel();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
