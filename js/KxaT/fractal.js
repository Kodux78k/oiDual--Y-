import { escapeHtml } from './utils.js';

function createToast(dom, message, isError = false) {
  if (!dom.toastContainer) return;
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  if (!isError) {
    const currentColor = getComputedStyle(document.body).getPropertyValue('--kob-voice-primary').trim();
    if (currentColor) toast.style.background = currentColor;
  } else {
    toast.style.background = '#c44';
  }
  dom.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function syncEngineUI(state) {
  document.querySelectorAll('[data-engine]').forEach(btn => {
    const val = parseInt(btn.dataset.engine, 10);
    if (val === state.engine.step) btn.classList.add('is-active');
    else btn.classList.remove('is-active');
  });
  document.querySelectorAll('[data-jump]').forEach(btn => {
    const val = parseInt(btn.dataset.jump, 10);
    if (val === state.engine.jump) btn.classList.add('is-active');
    else btn.classList.remove('is-active');
  });
  const reverseBtn = document.getElementById('reverseToggle');
  if (reverseBtn) {
    reverseBtn.textContent = `Reverse: ${state.engine.reverse ? 'ON' : 'OFF'}`;
    reverseBtn.classList.toggle('is-active', state.engine.reverse);
  }
  const cycleBtn = document.getElementById('cycle3697');
  if (cycleBtn) {
    cycleBtn.textContent = `3-6-9-7: ${state.engine.use3697 ? 'ON' : 'OFF'}`;
    cycleBtn.classList.toggle('is-active', state.engine.use3697);
  }
}

function diGetSequence(archs, state, startIndex, length) {
  const total = archs.length;
  const sequence = [];
  let currentIndex = ((startIndex % total) + total) % total;
  const pattern = state.engine.use3697 ? [3, 6, 9, 7] : [state.engine.step];

  for (let i = 0; i < length; i++) {
    sequence.push(archs[currentIndex]);
    let step = pattern[i % pattern.length];
    if (state.engine.reverse) step *= -1;
    step += state.engine.jump;
    currentIndex = (currentIndex + step) % total;
    if (currentIndex < 0) currentIndex += total;
  }
  return sequence;
}

export function createFractalEngine({ state, dom, ARCHETYPES, ARCH_NAMES, localStorage }) {
  function saveEngineState() {
    localStorage.setItem('kobllux_engine_step', String(state.engine.step));
    localStorage.setItem('kobllux_reverse_mode', String(state.engine.reverse));
    localStorage.setItem('kobllux_jump_step', String(state.engine.jump));
    localStorage.setItem('kobllux_cycle_3697', String(state.engine.use3697));
  }

  function updateStatusWithEngine() {
    const statusBar = document.getElementById('statusBar');
    if (statusBar && !statusBar.textContent.includes('Opcode')) {
      statusBar.textContent = `Motor ${state.engine.step} · ${state.engine.reverse ? 'Reverse' : 'Forward'} · salto +${state.engine.jump} · ${state.engine.use3697 ? '3-6-9-7' : 'Linear'}`;
    }
  }

  function loadStateFromStorage() {
    state.engine.step = parseInt(localStorage.getItem('kobllux_engine_step') || '0', 10);
    state.engine.reverse = localStorage.getItem('kobllux_reverse_mode') === 'true';
    state.engine.jump = parseInt(localStorage.getItem('kobllux_jump_step') || '0', 10);
    state.engine.use3697 = localStorage.getItem('kobllux_cycle_3697') === 'true';
  }

  function generateFractals() {
    if (!dom.input || !dom.output || !dom.archSelect || !dom.cycleCheck) return;
    const text = dom.input.value.trim();
    if (!text) {
      createToast(dom, 'Aviso: Texto de entrada vazio.', true);
      return;
    }
    localStorage.setItem('kobllux_draft_input', text);

    const sentencesMatch = text.replace(/\n+/g, ' ').match(/[^.!?]+[.!?]+|[^.!?]+$/g);
    const sentences = sentencesMatch ? sentencesMatch.map(s => s.trim()).filter(Boolean) : [];
    if (sentences.length === 0) return;

    const startArchName = dom.archSelect.value;
    const startIdx = ARCHETYPES.indexOf(startArchName);
    const isCycleMode = dom.cycleCheck.checked;
    const sequence = isCycleMode ? diGetSequence(ARCHETYPES, state, startIdx, sentences.length) : [ARCHETYPES[startIdx]];

    dom.output.innerHTML = '';
    let resultTextForExport = '';

    sentences.forEach((sentence, i) => {
      const currentArchName = isCycleMode ? sequence[i] : ARCHETYPES[startIdx];
      const block = document.createElement('div');
      block.className = 'para-block accordion is-open';
      block.style.animationDelay = `${i * 0.1}s`;

      const dummyBody = document.createElement('body');
      dummyBody.setAttribute('data-arch', currentArchName);
      document.documentElement.appendChild(dummyBody);
      const archColor = getComputedStyle(dummyBody).getPropertyValue('--kob-voice-primary').trim();
      document.documentElement.removeChild(dummyBody);

      block.style.setProperty('--kob-voice-primary', archColor);
      block.style.setProperty('--kob-voice-bg-soft', `color-mix(in srgb, ${archColor} 12%, transparent)`);
      block.style.borderLeftColor = archColor;
      block.style.setProperty('--card-accent', archColor);

      const displayArchName = ARCH_NAMES[currentArchName] || currentArchName;

      block.innerHTML = `
        <div class="accordion-header">
          <div class="arch-tag" style="color: ${archColor}; border-color: color-mix(in srgb, ${archColor} 30%, rgba(255,255,255,0.1))">
            ${displayArchName} · Δ
          </div>
        </div>
        <div class="collapsible-body">
          <div class="content-inner">${escapeHtml(sentence)}</div>
        </div>
      `;
      dom.output.appendChild(block);
      resultTextForExport += `${displayArchName.toUpperCase()} — ${sentence}\n\n`;
    });

    localStorage.setItem('kobllux_last_result', resultTextForExport.trim());
    const total = sentences.length;
    if (dom.statusBar) dom.statusBar.textContent = `Opcode 0x0B · Motor 3·6·9 · ${total} Fractal(s) Gerado(s)`;
    if (dom.hudStatus) dom.hudStatus.textContent = `Δ-${total}`;

    if (dom.mainCard && dom.mainCard.classList.contains('is-open')) {
      dom.mainCard.querySelector('.accordion-header')?.click();
    }
    createToast(dom, `Integração concluída | Motor: +${state.engine.step} | Reverse: ${state.engine.reverse ? 'ON' : 'OFF'} | Salto: +${state.engine.jump} | ${state.engine.use3697 ? 'Ciclo 3697' : 'Linear'}`);
  }

  function bindControls() {
    document.querySelectorAll('[data-engine]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.engine.step = parseInt(btn.dataset.engine, 10);
        saveEngineState();
        syncEngineUI(state);
        updateStatusWithEngine();
        createToast(dom, `Motor +${state.engine.step} ativado`);
      });
    });

    document.querySelectorAll('[data-jump]').forEach(btn => {
      btn.addEventListener('click', () => {
        state.engine.jump = parseInt(btn.dataset.jump, 10);
        saveEngineState();
        syncEngineUI(state);
        updateStatusWithEngine();
        createToast(dom, `Salto extra +${state.engine.jump}`);
      });
    });

    const reverseBtnDom = document.getElementById('reverseToggle');
    if (reverseBtnDom) {
      reverseBtnDom.addEventListener('click', () => {
        state.engine.reverse = !state.engine.reverse;
        saveEngineState();
        syncEngineUI(state);
        updateStatusWithEngine();
        createToast(dom, `Reverse ${state.engine.reverse ? 'ATIVADO' : 'DESATIVADO'}`);
      });
    }

    const cycleBtnDom = document.getElementById('cycle3697');
    if (cycleBtnDom) {
      cycleBtnDom.addEventListener('click', () => {
        state.engine.use3697 = !state.engine.use3697;
        saveEngineState();
        syncEngineUI(state);
        updateStatusWithEngine();
        createToast(dom, `Ciclo 3-6-9-7 ${state.engine.use3697 ? 'ATIVADO' : 'DESATIVADO'}`);
      });
    }

    if (dom.genBtn) dom.genBtn.addEventListener('click', generateFractals);
    if (dom.input) {
      dom.input.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generateFractals();
      });
    }

    if (dom.copyBtn) {
      dom.copyBtn.addEventListener('click', async () => {
        const content = localStorage.getItem('kobllux_last_result');
        if (!content) { createToast(dom, 'Nenhum fractal para copiar.', true); return; }
        try {
          await navigator.clipboard.writeText(content);
          createToast(dom, 'Fractais copiados para o Códex');
        } catch (err) {
          const ta = document.createElement('textarea');
          ta.value = content;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          createToast(dom, 'Fractais copiados (fallback)');
        }
      });
    }

    if (dom.clearBtn) {
      dom.clearBtn.addEventListener('click', () => {
        if (dom.input) dom.input.value = '';
        if (dom.output) dom.output.innerHTML = '<div class="empty-state">Sistema reiniciado. Aguardando novos dados.</div>';
        localStorage.removeItem('kobllux_last_result');
        localStorage.removeItem('kobllux_draft_input');
        if (dom.statusBar) dom.statusBar.textContent = 'Sistema em repouso · Matrix Pronta';
        if (dom.hudStatus) dom.hudStatus.textContent = '78K-ID';
        if (dom.mainCard && dom.mainCard.classList.contains('is-collapsed')) dom.mainCard.querySelector('.accordion-header')?.click();
        createToast(dom, 'Memória Limpa');
      });
    }

    if (dom.downloadBtn) {
      dom.downloadBtn.addEventListener('click', () => {
        const content = localStorage.getItem('kobllux_last_result');
        if (!content) { createToast(dom, 'Nenhum fractal para transferir.', true); return; }
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `KOBLLUX_Fractais_${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        createToast(dom, 'Transferência Concluída');
      });
    }

    if (dom.archSelect) dom.archSelect.addEventListener('change', (e) => {
      dom.body.setAttribute('data-arch', e.target.value);
    });

    if (dom.archSelect) dom.body.setAttribute('data-arch', dom.archSelect.value);
  }

  loadStateFromStorage();
  syncEngineUI(state);
  updateStatusWithEngine();
  bindControls();

  return {
    generateFractals,
    syncEngineUI: () => syncEngineUI(state),
    updateStatusWithEngine,
    loadStateFromStorage
  };
}
