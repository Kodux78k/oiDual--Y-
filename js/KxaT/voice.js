import { sleep, getBlockText } from './utils.js';

export function initSpeech(state) {
  const synth = window.speechSynthesis || null;
  state.synth = synth;
  if (!synth) return null;

  const loadVoices = () => {
    try { state.availableVoices = synth.getVoices() || []; }
    catch (e) { state.availableVoices = []; }
  };

  loadVoices();
  synth.onvoiceschanged = loadVoices;
  return synth;
}

export function detectArchetypeFromText(text, ARCHETYPE_KEYWORDS) {
  if (!text) return null;
  const t = text.toLowerCase();
  let best = null;
  let bestScore = 0;

  Object.entries(ARCHETYPE_KEYWORDS).forEach(([name, words]) => {
    let score = 0;
    if (t.includes(name.toLowerCase())) score += 10;
    words.forEach(w => {
      if (t.includes(String(w).toLowerCase())) score++;
    });
    if (score > bestScore) {
      bestScore = score;
      best = name;
    }
  });

  return bestScore > 0 ? best : null;
}

export function markBlockArchetype(div, archeName) {
  if (!div || !archeName) return;
  div.dataset.archetype = archeName;
  let badge = div.querySelector('.archetype-badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'archetype-badge';
    div.appendChild(badge);
  }
  badge.textContent = archeName;
}

export function resolveBlockArchetypes(block, text, detectFn) {
  const tagArch = (block && block.dataset && block.dataset.archetype) ? String(block.dataset.archetype).trim() : '';
  const textArch = detectFn(text);
  const stack = [tagArch, textArch].filter(Boolean);
  const uniqueStack = [...new Set(stack)];
  return {
    tagArch: tagArch || null,
    textArch: textArch || null,
    detectedArch: uniqueStack[0] || null,
    stack: uniqueStack
  };
}

export function updateVoiceOrbLabel(state, voiceConfigBtn) {
  if (!voiceConfigBtn) return;
  const label = state.currentVoiceKey || 'voz';
  voiceConfigBtn.title = state.voiceConfig
    ? 'Voz atual: ' + label + ' (clique para alternar)'
    : 'Carregar / alternar vozes de arquétipos';
}

export function loadVoiceConfigFromStorage({ state, STORAGE, localStorage, voiceConfigBtn }) {
  try {
    const raw = localStorage.getItem(STORAGE.VOICE_CONFIG);
    if (!raw) return;
    state.voiceConfig = JSON.parse(raw);
    const keys = Object.keys(state.voiceConfig || {});
    if (!keys.length) return;
    const storedKey = localStorage.getItem(STORAGE.VOICE_CURRENT_KEY);
    const candidate =
      (storedKey && keys.includes(storedKey)) ? storedKey :
      (state.voiceConfig.current && keys.includes(state.voiceConfig.current)) ? state.voiceConfig.current :
      (keys.includes('default') ? 'default' : keys[0]);
    state.currentVoiceKey = candidate;
    updateVoiceOrbLabel(state, voiceConfigBtn);
  } catch (e) {
    console.warn('Erro ao carregar config de voz:', e);
    state.voiceConfig = null;
  }
}

export function addTtsButtonToBlock(div, onSpeak) {
  if (!div || div.querySelector('.block-tts-btn')) return;
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'block-tts-btn';
  btn.textContent = '◎';
  btn.addEventListener('click', (ev) => {
    ev.stopPropagation();
    onSpeak(div);
  });
  div.appendChild(btn);
}

export function getSpeakableBlocks(responseBlocks) {
  return (responseBlocks || []).filter(b => b && b.parentNode && !b.classList.contains('user-pulse'));
}

export function speakBlock(state, block, deps) {
  const {
    footerHint,
    voiceBtn,
    localStorage,
    STORAGE,
    ARCHETYPE_KEYWORDS,
    detectFn,
    markArchetypeFn
  } = deps;

  const synth = state.synth || window.speechSynthesis || null;
  if (!synth) {
    if (footerHint) footerHint.textContent = 'Seu navegador não suporta voz (SpeechSynthesis).';
    return;
  }
  if (!block) {
    if (footerHint) footerHint.textContent = 'Nenhum bloco selecionado.';
    return;
  }

  const text = getBlockText(block);
  if (!text) {
    if (footerHint) footerHint.textContent = 'Nada para ler nesse bloco.';
    return;
  }

  const resolved = resolveBlockArchetypes(block, text, (t) => detectFn(t, ARCHETYPE_KEYWORDS));
  if (resolved.stack.length) block.dataset.archetypeStack = resolved.stack.join('|');

  if (resolved.detectedArch) {
    state.currentVoiceKey = resolved.detectedArch;
    localStorage.setItem('ARCHETYPE_ACTIVE', resolved.detectedArch);
    localStorage.setItem(STORAGE.VOICE_CURRENT_KEY, state.currentVoiceKey);
    markArchetypeFn(block, resolved.detectedArch);
  }

  if (synth.speaking) {
    synth.cancel();
    if (voiceBtn) voiceBtn.classList.remove('speaking');
  }

  const utter = new SpeechSynthesisUtterance(text);

  let profile = null;
  if (state.voiceConfig) {
    if (state.currentVoiceKey && state.voiceConfig[state.currentVoiceKey]) profile = state.voiceConfig[state.currentVoiceKey];
    else if (state.voiceConfig.default) profile = state.voiceConfig.default;
  }

  utter.lang = (profile && profile.lang) ? profile.lang : 'pt-BR';
  utter.rate = (profile && typeof profile.rate === 'number') ? profile.rate : 1;
  utter.pitch = (profile && typeof profile.pitch === 'number') ? profile.pitch : 1;
  utter.volume = (profile && typeof profile.volume === 'number') ? profile.volume : 1;

  if (profile && profile.voiceHint && state.availableVoices && state.availableVoices.length) {
    const hint = String(profile.voiceHint).toLowerCase();
    let chosen = state.availableVoices.find(v => v.name.toLowerCase().includes(hint));
    if (!chosen) chosen = state.availableVoices.find(v => v.lang === utter.lang) || null;
    if (chosen) utter.voice = chosen;
  }

  state.currentUtterance = utter;

  utter.onstart = () => {
    if (voiceBtn) voiceBtn.classList.add('speaking');
    if (footerHint) footerHint.textContent = 'Lendo o bloco em voz alta.';
  };
  utter.onend = () => {
    if (voiceBtn) voiceBtn.classList.remove('speaking');
    if (footerHint) footerHint.textContent = 'Leitura concluída.';
  };
  utter.onerror = () => {
    if (voiceBtn) voiceBtn.classList.remove('speaking');
    if (footerHint) footerHint.textContent = 'Erro ao tentar falar.';
  };

  synth.cancel();
  synth.speak(utter);
}

export function speakBlockPromise(state, block, deps) {
  return new Promise((resolve) => {
    if (!block) return resolve();

    const text = getBlockText(block);
    if (!text) return resolve();

    const highlightClass = deps.highlightClass || 'speaking';
    const highlightDuration = deps.highlightDuration || 90;
    const synth = state.synth || window.speechSynthesis || null;

    block.dataset.state = 'spoken';
    block.classList.add(highlightClass);

    function finish() {
      setTimeout(() => {
        block.classList.remove(highlightClass);
        resolve();
      }, highlightDuration);
    }

    if (synth && typeof synth.speak === 'function') {
      try {
        speakBlock(state, block, deps);
      } catch (e) {
        console.warn('speakBlock threw', e);
        const estMs = Math.min(Math.max(text.length * 35, 500), 12000);
        setTimeout(finish, estMs);
        return;
      }

      const utter = state.currentUtterance;
      if (utter) {
        const origOnEnd = utter.onend;
        let called = false;
        utter.onend = function (e) {
          try { if (typeof origOnEnd === 'function') origOnEnd.call(this, e); } catch (err) { console.warn(err); }
          if (!called) { called = true; finish(); }
        };
        const origOnError = utter.onerror;
        utter.onerror = function (e) {
          try { if (typeof origOnError === 'function') origOnError.call(this, e); } catch (err) { console.warn(err); }
          if (!called) { called = true; finish(); }
        };
        const safetyTimeout = Math.min(Math.max(text.length * 60, 2000), 20000);
        setTimeout(() => { if (!called) { called = true; finish(); } }, safetyTimeout);
        return;
      }
    }

    const estMs = Math.min(Math.max(text.length * 40, 500), 12000);
    setTimeout(finish, estMs);
  });
}

export async function speakRecentBlocks(state, responseBlocks, deps, count = 9, opts = {}) {
  if (!responseBlocks || !responseBlocks.length) return;
  let blocks = getSpeakableBlocks(responseBlocks);

  if (Number.isFinite(count)) {
    const start = Math.max(0, blocks.length - count);
    blocks = blocks.slice(start);
  }

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b) b.dataset.state = 'spoken';
    await speakBlockPromise(state, b, deps);
    await sleep(opts.pauseBetween ?? 120);
  }
}

export function enhanceBlock(div, state, deps) {
  if (!div) return;
  div.dataset.state = div.dataset.state || 'idle';
  div.addEventListener('click', deps.onBlockClick);
  addTtsButtonToBlock(div, deps.onSpeak);
  const t = getBlockText(div);
  const arch = detectArchetypeFromText(t, deps.ARCHETYPE_KEYWORDS);
  if (arch) markBlockArchetype(div, arch);
  if (!state.responseBlocks.includes(div)) state.responseBlocks.push(div);
}
