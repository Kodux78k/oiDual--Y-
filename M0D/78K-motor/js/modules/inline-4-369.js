(function() {
  // =========================================
  // 1. ACORDEÃO (mantido original)
  // =========================================
  function makeCollapsible(node) {
    if (!node || node.dataset.accordionInit) return;
    node.dataset.accordionInit = "true";
    const header = node.querySelector('.accordion-header');
    const body = node.querySelector('.collapsible-body');
    if (!header || !body) return;
    if (!header.querySelector('.indicator')) {
      const indicator = document.createElement('span');
      indicator.className = 'indicator';
      indicator.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>';
      header.appendChild(indicator);
    }
    if (!node.classList.contains('is-collapsed') && !node.classList.contains('is-open')) node.classList.add('is-open');
    if (node.classList.contains('is-collapsed')) body.style.height = '0px';
    header.addEventListener('click', (e) => {
      const targetTag = e.target.tagName.toLowerCase();
      if (['input', 'select', 'button', 'textarea'].includes(targetTag)) return;
      const isCollapsed = node.classList.contains('is-collapsed');
      if (isCollapsed) {
        node.classList.remove('is-collapsed');
        node.classList.add('is-open');
        body.style.height = body.scrollHeight + 'px';
        body.addEventListener('transitionend', function handler(ev) {
          if (ev.propertyName === 'height') {
            body.style.height = 'auto';
            body.removeEventListener('transitionend', handler);
          }
        });
      } else {
        body.style.height = body.scrollHeight + 'px';
        void body.offsetHeight;
        node.classList.remove('is-open');
        node.classList.add('is-collapsed');
        body.style.height = '0px';
      }
    });
  }
  window.KobAccordion = {
    open: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; if(card){ card.classList.remove('is-collapsed'); card.classList.add('is-open'); } },
    close: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; if(card){ card.classList.remove('is-open'); card.classList.add('is-collapsed'); } },
    toggle: (card) => { card = (typeof card === 'string') ? document.querySelector(card) : card; card && card.querySelector('.accordion-header')?.click(); }
  };
  const observer = new MutationObserver((muts) => {
    muts.forEach((m) => {
      m.addedNodes && m.addedNodes.forEach((node) => {
        if (!(node instanceof Element)) return;
        if (node.matches && node.matches('.accordion')) makeCollapsible(node);
        node.querySelectorAll && node.querySelectorAll('.accordion').forEach((el) => makeCollapsible(el));
      });
    });
  });
  if (document.body) observer.observe(document.body, { childList: true, subtree: true });
  document.querySelectorAll('.accordion').forEach(makeCollapsible);

  // =========================================
  // 2. BASE DE ARQUÉTIPOS + USER
  // =========================================
  const di_userNameRaw = localStorage.getItem("di_userName") || "";
  const userKey = di_userNameRaw.trim().toLowerCase();
  const displayUserName = di_userNameRaw.trim() || "User";
  
  let ARCHETYPES_BASE = [
  "atlas", "nova", "vitalis", "pulse", "kaos", "kodux", "lumine",
  "aion", "kobllux", "artemis", "serena", "genus", "solus",
  "rhea", "uno", "dual", "trinity", "infodose", "horus", "bllue",
   "luxara",
  "velor", "elysha", "sylon", "naira", "thenir", "eloh", "novael",
  "aelya", "ignyra", "lumara", "kaythar", "elya", "sylla", "anamyx",
  "yamantek", "metalux", "kd1", "koφd1", "christos",
  "aek_dion", "aekael_domnnus", "nephesh_elyon"
];

if (userKey && !ARCHETYPES_BASE.includes(userKey)) {
  ARCHETYPES_BASE.push(userKey);
}

const ARCHETYPES = [...ARCHETYPES_BASE];

const ARCH_NAMES = {
  atlas: "Atlas",
  nova: "Nova",
  vitalis: "Vitalis",
  pulse: "Pulse",
  kaos: "Kaos",
  kodux: "Kodux",
  lumine: "Lumine",
  aion: "Aion",
  kobllux: "Kobllux",
  artemis: "Artemis",
  serena: "Serena",
  genus: "Genus",
  solus: "Solus",
  rhea: "Rhea",
  uno: "Uno",
  dual: "Dual",
  trinity: "Trinity",
  infodose: "Infodose",
  horus: "Horus",
  bllue: "Bllue",

elysha: "Elysha",
Luxara: "Luxara",

  velor: "Velor",

  sylon: "Sylon",
  naira: "Naira",
  thenir: "Thenir",
  eloh: "Eloh",
  novael: "Novael",

  aelya: "Aelya",
  ignyra: "Ignyra",
  lumara: "Lumara",

  kaythar: "Kaythar",
  sylla: "Sylla",
    elya: "Elya",
  anamyx: "Anamyx",

  yamantek: "Yamantek",
  metalux: "Metalux",
  kd1: "KD1",
  "koφd1": "KOΦD1",
  christos: "Christos",

  k_dion: "a€K_Dion",
  kael_domnnus: "a€Kael DommnuS",
  nephesh_elyon: "a€Nephesh Elyon"
};
  if (userKey) ARCH_NAMES[userKey] = di_userNameRaw.trim();

  const userOption = document.getElementById("diUserOption");
  if (userOption) {
    userOption.value = userKey || "user";
    userOption.textContent = `${displayUserName} (Usuário/Núcleo)`;
  }

  // =========================================
  // 3. MOTOR 3·6·9 (com persistência)
  // =========================================
  let di_engineStep = parseInt(localStorage.getItem('kobllux_engine_step') || '0', 10);
  let di_reverse = localStorage.getItem('kobllux_reverse_mode') === 'true';
  let di_jump = parseInt(localStorage.getItem('kobllux_jump_step') || '0', 10);
  let di_use3697 = localStorage.getItem('kobllux_cycle_3697') === 'true';

  function saveEngineState() {
    localStorage.setItem('kobllux_engine_step', String(di_engineStep));
    localStorage.setItem('kobllux_reverse_mode', String(di_reverse));
    localStorage.setItem('kobllux_jump_step', String(di_jump));
    localStorage.setItem('kobllux_cycle_3697', String(di_use3697));
  }

  function syncEngineUI() {
    document.querySelectorAll('[data-engine]').forEach(btn => {
      const val = parseInt(btn.dataset.engine, 10);
      if (val === di_engineStep) btn.classList.add('is-active');
      else btn.classList.remove('is-active');
    });
    document.querySelectorAll('[data-jump]').forEach(btn => {
      const val = parseInt(btn.dataset.jump, 10);
      if (val === di_jump) btn.classList.add('is-active');
      else btn.classList.remove('is-active');
    });
    const reverseBtn = document.getElementById('reverseToggle');
    if (reverseBtn) {
      reverseBtn.textContent = `Reverse: ${di_reverse ? 'ON' : 'OFF'}`;
      reverseBtn.classList.toggle('is-active', di_reverse);
    }
    const cycleBtn = document.getElementById('cycle3697');
    if (cycleBtn) {
      cycleBtn.textContent = `3-6-9-7: ${di_use3697 ? 'ON' : 'OFF'}`;
      cycleBtn.classList.toggle('is-active', di_use3697);
    }
  }

  function di_getSequence(startIndex, length) {
    const total = ARCHETYPES.length;
    const sequence = [];
    let currentIndex = ((startIndex % total) + total) % total;
    const pattern = di_use3697 ? [3, 6, 9, 7] : [di_engineStep];
    for (let i = 0; i < length; i++) {
      sequence.push(ARCHETYPES[currentIndex]);
      let step = pattern[i % pattern.length];
      if (di_reverse) step *= -1;
      step += di_jump;
      currentIndex = (currentIndex + step) % total;
      if (currentIndex < 0) currentIndex += total;
    }
    return sequence;
  }

  function updateStatusWithEngine() {
    const statusBar = document.getElementById('statusBar');
    if (statusBar && !statusBar.textContent.includes('Opcode')) {
      statusBar.textContent = `Motor ${di_engineStep} · ${di_reverse ? 'Reverse' : 'Forward'} · salto +${di_jump} · ${di_use3697 ? '3-6-9-7' : 'Linear'}`;
    }
  }

  // eventos dos controles
  document.querySelectorAll('[data-engine]').forEach(btn => {
    btn.addEventListener('click', () => {
      di_engineStep = parseInt(btn.dataset.engine, 10);
      saveEngineState();
      syncEngineUI();
      updateStatusWithEngine();
      showToast(`Motor +${di_engineStep} ativado`);
    });
  });
  document.querySelectorAll('[data-jump]').forEach(btn => {
    btn.addEventListener('click', () => {
      di_jump = parseInt(btn.dataset.jump, 10);
      saveEngineState();
      syncEngineUI();
      updateStatusWithEngine();
      showToast(`Salto extra +${di_jump}`);
    });
  });
  const reverseBtnDom = document.getElementById('reverseToggle');
  if (reverseBtnDom) {
    reverseBtnDom.addEventListener('click', () => {
      di_reverse = !di_reverse;
      saveEngineState();
      syncEngineUI();
      updateStatusWithEngine();
      showToast(`Reverse ${di_reverse ? 'ATIVADO' : 'DESATIVADO'}`);
    });
  }
  const cycleBtnDom = document.getElementById('cycle3697');
  if (cycleBtnDom) {
    cycleBtnDom.addEventListener('click', () => {
      di_use3697 = !di_use3697;
      saveEngineState();
      syncEngineUI();
      updateStatusWithEngine();
      showToast(`Ciclo 3-6-9-7 ${di_use3697 ? 'ATIVADO' : 'DESATIVADO'}`);
    });
  }
  syncEngineUI();
  updateStatusWithEngine();

  // =========================================
  // 4. DOM ELEMENTOS
  // =========================================
  const dom = {
    input: document.getElementById('inputText'),
    output: document.getElementById('outputContainer'),
    genBtn: document.getElementById('genBtn'),
    archSelect: document.getElementById('startArch'),
    cycleCheck: document.getElementById('cycleMode'),
    body: document.body,
    copyBtn: document.getElementById('copyBtn'),
    clearBtn: document.getElementById('clearBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    statusBar: document.getElementById('statusBar'),
    hudStatus: document.getElementById('hudStatus'),
    toastContainer: document.getElementById('toast-container'),
    mainCard: document.getElementById('mainHeroCard')
  };

  function showToast(message, isError = false) {
    if (!dom.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    if (!isError) {
      const currentColor = getComputedStyle(document.body).getPropertyValue('--kob-voice-primary').trim();
      if (currentColor) toast.style.background = currentColor;
    } else toast.style.background = "#c44";
    dom.toastContainer.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  if (dom.input) {
    const savedInput = localStorage.getItem('kobllux_draft_input');
    if (savedInput) dom.input.value = savedInput;
  }

  if (dom.archSelect) {
    dom.archSelect.addEventListener('change', (e) => {
      dom.body.setAttribute('data-arch', e.target.value);
    });
  }

  // =========================================
  // 5. FUNÇÃO GERAR FRACTAIS (COM MOTOR)
  // =========================================
  function generateFractals() {
    if (!dom.input || !dom.output || !dom.archSelect || !dom.cycleCheck) return;
    const text = dom.input.value.trim();
    if (!text) {
      showToast("Aviso: Texto de entrada vazio.", true);
      return;
    }
    localStorage.setItem('kobllux_draft_input', text);

    const sentencesMatch = text.replace(/\n+/g, ' ').match(/[^.!?]+[.!?]+|[^.!?]+$/g);
    const sentences = sentencesMatch ? sentencesMatch.map(s => s.trim()).filter(Boolean) : [];
    if (sentences.length === 0) return;

    const startArchName = dom.archSelect.value;
    const startIdx = ARCHETYPES.indexOf(startArchName);
    const isCycleMode = dom.cycleCheck.checked;

    // SEQUÊNCIA VIA MOTOR 3·6·9
    const sequence = isCycleMode ? di_getSequence(startIdx, sentences.length) : [ARCHETYPES[startIdx]];

    dom.output.innerHTML = '';
    let resultTextForExport = "";

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
    showToast(`Integração concluída | Motor: +${di_engineStep} | Reverse: ${di_reverse ? 'ON' : 'OFF'} | Salto: +${di_jump} | ${di_use3697 ? 'Ciclo 3697' : 'Linear'}`);
  }

  function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
      if (m === '&') return '&amp;';
      if (m === '<') return '&lt;';
      if (m === '>') return '&gt;';
      return m;
    });
  }

  // eventos principais
  if (dom.genBtn) dom.genBtn.addEventListener('click', generateFractals);
  if (dom.input) {
    dom.input.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generateFractals();
    });
  }

  // copiar / limpar / download
  if (dom.copyBtn) {
    dom.copyBtn.addEventListener('click', async () => {
      const content = localStorage.getItem('kobllux_last_result');
      if (!content) { showToast("Nenhum fractal para copiar.", true); return; }
      try {
        await navigator.clipboard.writeText(content);
        showToast("Fractais copiados para o Códex");
      } catch (err) {
        const ta = document.createElement('textarea');
        ta.value = content;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast("Fractais copiados (fallback)");
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
      showToast("Memória Limpa");
    });
  }
  if (dom.downloadBtn) {
    dom.downloadBtn.addEventListener('click', () => {
      const content = localStorage.getItem('kobllux_last_result');
      if (!content) { showToast("Nenhum fractal para transferir.", true); return; }
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `KOBLLUX_Fractais_${new Date().toISOString().slice(0,10)}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("Transferência Concluída");
    });
  }

  // data-arch inicial
  if (dom.archSelect) dom.body.setAttribute('data-arch', dom.archSelect.value);
})();



(async () => {
  try {
    const ARCHETYPES = await fetch(
      "https://www.infodose.com.br/js/modules/archetypes.json"
    ).then(r => r.json());

    const select = document.getElementById("startArch");
    const userName = localStorage.getItem("di_userName") || "User";

    if (select && Array.isArray(ARCHETYPES) && ARCHETYPES.length) {
      select.innerHTML = "";

      const userOpt = document.createElement("option");
      userOpt.value = userName.toLowerCase();
      userOpt.textContent = `${userName} (Usuário/Núcleo)`;
      select.appendChild(userOpt);

      ARCHETYPES.forEach(a => {
        const opt = document.createElement("option");
        opt.value = a.id || a.name || "";
        opt.textContent = a.name || a.id || "Archetype";
        select.appendChild(opt);
      });

      window.ARCHETYPES = ARCHETYPES;
      window.ARCHETYPE_IDS = ARCHETYPES.map(a => a.id);
      window.ARCHETYPE_NAMES = ARCHETYPES.map(a => a.name);
      window.ARCHETYPE_MAP = Object.fromEntries(
        ARCHETYPES.map(a => [a.id, a])
      );
    }

    console.log("[78K] Archetypes JSON carregado");
  } catch (err) {
    console.error("[78K] Falha ao carregar archetypes.json", err);
  }
})();