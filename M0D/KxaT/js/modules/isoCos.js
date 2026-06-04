
  // ═══════════════════════════════════════════════════════════
  // [KOBLLUX ∆³ · OPCODES]  fonte canônica
  // ═══════════════════════════════════════════════════════════
  const KOBLLUX_OPCODES = {
    '0x00': { nome: 'INICIAR',     freq: 396, geom: '○', cor: '#b978ff', dim: 'D0·Ponto'   },
    '0x01': { nome: 'PULSAR',      freq: 432, geom: '●', cor: '#67e6ff', dim: 'D1·Linha'   },
    '0x02': { nome: 'INTEGRAR',    freq: 528, geom: '―', cor: '#7cffb2', dim: 'D2·Plano'   },
    '0x03': { nome: 'EXPANDIR',    freq: 639, geom: '▢', cor: '#4de0ff', dim: 'D3·Volume'  },
    '0x04': { nome: 'DISSOLVER',   freq: 594, geom: '◇', cor: '#ff9ad1', dim: 'D2·Trans'   },
    '0x05': { nome: 'CONVERGIR',   freq: 672, geom: '⧉', cor: '#ff7a00', dim: 'D∩·Foco'    },
    '0x06': { nome: 'CRISTALIZAR', freq: 741, geom: '☯', cor: '#a8ff78', dim: 'D3·Rede'    },
    '0x07': { nome: 'SELAR',       freq: 777, geom: '✧', cor: '#ffd700', dim: 'D3·Tetrae'  },
    '0x08': { nome: 'TESTEMUNHAR', freq: 852, geom: '◉', cor: '#00b894', dim: 'D∞·Círculo' },
    '0x09': { nome: 'MANIFESTAR',  freq: 963, geom: '♾', cor: '#6c5ce7', dim: 'S²·Esfera'  },
    '0x0A': { nome: 'EQUILIBRAR',  freq: 528, geom: '⚖', cor: '#74b9ff', dim: 'SO(2)'     },
    '0x0B': { nome: 'RESSONAR',    freq: 432, geom: '◎', cor: '#ff52e5', dim: 'Ondas·1D'   },
    '0x0C': { nome: 'CONCLUIR',    freq: 999, geom: '♾', cor: '#f2c94c', dim: 'T²·Toro'    }
  };

  // ═══════════════════════════════════════════════════════════
  // [ARCHETYPES_DB] · 12 arquétipos canônicos
  //   primary = cor original do arquétipo
  //   secondary = cor do opcode mapeado (KOBLLUX_OPCODES[opcode].cor)
  // ═══════════════════════════════════════════════════════════
  const ARCHETYPES_DB = [
    { id: 'ATLAS',   name: 'ATLAS',   desc: 'Estrutura & Governo',    opcode: '0x02', primary: '#38BDF8', drk: 'A ordem externa reflete a clareza interna.' },
    { id: 'NOVA',    name: 'NOVA',    desc: 'Inovação & Fluxo',       opcode: '0x01', primary: '#F97316', drk: 'O erro é apenas um dado não processado.' },
    { id: 'VITALIS', name: 'VITALIS', desc: 'Energia & Ação',         opcode: '0x03', primary: '#22C55E', drk: 'O corpo sabe antes da mente duvidar.' },
    { id: 'PULSE',   name: 'PULSE',   desc: 'Ritmo & Emoção',         opcode: '0x0B', primary: '#EC4899', drk: 'Sinta a batida do caos e dance com ela.' },
    { id: 'ARTEMIS', name: 'ARTEMIS', desc: 'Foco & Caça',            opcode: '0x05', primary: '#A855F7', drk: 'Defina o alvo. O resto é apenas ruído.' },
    { id: 'SERENA',  name: 'SERENA',  desc: 'Paz & Harmonia',         opcode: '0x0A', primary: '#7DD3FC', drk: 'No centro do furacão, existe um ponto imóvel.' },
    { id: 'KAOS',    name: 'KAOS',    desc: 'Mudança & Entropia',     opcode: '0x04', primary: '#FACC15', drk: 'Quebre o padrão hoje. Amanhã nasce o novo.' },
    { id: 'GENUS',   name: 'GENUS',   desc: 'Criação & Arte',         opcode: '0x09', primary: '#E5E7EB', drk: 'A excelência habita nos detalhes.' },
    { id: 'LUMINE',  name: 'LUMINE',  desc: 'Brilho & Carisma',       opcode: '0x07', primary: '#FDE047', drk: 'Irradie sem medo.' },
    { id: 'SOLUS',   name: 'SOLUS',   desc: 'Vazio & Verdade',        opcode: '0x08', primary: '#0EA5E9', drk: 'O silêncio revela mais que mil estímulos.' },
    { id: 'RHEA',    name: 'RHEA',    desc: 'Cuidado & Raiz',         opcode: '0x06', primary: '#16A34A', drk: 'Nutra a raiz e o fruto virá.' },
    { id: 'HORUS',   name: 'HORUS',   desc: 'Visão & Estratégia',     opcode: '0x0C', primary: '#5500FF', drk: 'Observe o todo antes de agir.' }
  ];

  // ═══════════════════════════════════════════════════════════
  // [STATE]
  // ═══════════════════════════════════════════════════════════
  let currentArchIdx = 0;
  const STATE = {
    get archetype() { return ARCHETYPES_DB[currentArchIdx]; }
  };

  const $  = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);

  // ═══════════════════════════════════════════════════════════
  // [ARCHETYPE ENGINE] · aplica cores + opcode + meta-strip
  // ═══════════════════════════════════════════════════════════
  function applyArchetype(idx) {
    currentArchIdx = (idx + ARCHETYPES_DB.length) % ARCHETYPES_DB.length;
    const a = ARCHETYPES_DB[currentArchIdx];
    const op = KOBLLUX_OPCODES[a.opcode];

    document.documentElement.style.setProperty('--arch-primary',   a.primary);
    document.documentElement.style.setProperty('--arch-secondary', op.cor);
    document.documentElement.style.setProperty('--arch-glow',      a.primary);

    $('#archName').textContent  = a.name;
    $('#archDesc').textContent  = a.desc;
    $('#archCounter').textContent = String(currentArchIdx + 1).padStart(2, '0') + '/' + String(ARCHETYPES_DB.length).padStart(2, '0');

    $('#metaOpcode').textContent = a.opcode;
    $('#metaVerb').textContent   = op.nome;
    $('#metaGeom').textContent   = op.geom;
    $('#metaFreq').textContent   = op.freq + 'Hz';
    $('#metaDim').textContent    = op.dim;

    $('#avatarGlyph').textContent   = op.geom;
    $('#collapsedGlyph').textContent = op.geom;

    // Activation seed
    const userName = localStorage.getItem('di_userName') || 'Convidado';
    $('#actPre').textContent =
      `[${a.name}·${a.opcode}·${op.nome}·${op.freq}Hz·${op.dim}]\n` +
      `> ${a.drk}\n` +
      `> bind ${userName} → ${a.id}.activate()\n` +
      `> S(${a.id}) = Σbᵢ·2^(i-1)  ·  geom: ${op.geom}\n` +
      `> primary:${a.primary}  · opcode:${op.cor}`;
    $('#actBadge').textContent = `${a.opcode}·${op.geom}`;

    // active chip
    $$('#archStrip .arch-chip').forEach((el, i) => {
      el.classList.toggle('active', i === currentArchIdx);
    });

    // persist
    localStorage.setItem('di_activeArchetype', a.id);
    console.log(`[KOBLLUX] ${a.name} → ${a.opcode} ${op.nome} ${op.geom} ${op.freq}Hz · ${op.dim}`);
  }

  function nextArchetype() { applyArchetype(currentArchIdx + 1); }
  function prevArchetype() { applyArchetype(currentArchIdx - 1); }

  // ═══════════════════════════════════════════════════════════
  // [STRIP CROMÁTICA] · 12 chips
  // ═══════════════════════════════════════════════════════════
  function buildStrip() {
    const strip = $('#archStrip');
    strip.innerHTML = '';
    ARCHETYPES_DB.forEach((a, i) => {
      const chip = document.createElement('div');
      chip.className = 'arch-chip';
      chip.style.background = `radial-gradient(circle at 35% 35%, ${a.primary}, ${KOBLLUX_OPCODES[a.opcode].cor})`;
      chip.style.color = a.primary;
      chip.title = `${a.name} · ${a.opcode} ${KOBLLUX_OPCODES[a.opcode].nome}`;
      chip.addEventListener('click', () => applyArchetype(i));
      strip.appendChild(chip);
    });
  }

  // ═══════════════════════════════════════════════════════════
  // [NAME SYNC] · di_syncNameUI
  // ═══════════════════════════════════════════════════════════
  function di_syncNameUI(name) {
    const safe = (name || '').trim() || 'Convidado';
    localStorage.setItem('di_userName', safe);
    localStorage.setItem('userName', safe);
    $('#lblName').textContent  = safe;
    $('#actName').textContent  = safe;
    $('#smallText').textContent = safe;
    $('#smallIdent').textContent = 'Principal';
    // re-renderiza seed
    applyArchetype(currentArchIdx);
  }

  // ═══════════════════════════════════════════════════════════
  // [TOGGLES]
  // ═══════════════════════════════════════════════════════════
  function toggleSection(id) {
    const el = $('#' + id);
    if (!el) return;
    const hidden = el.classList.contains('activation-hidden');
    $$('.activation-card').forEach(c => c.classList.add('activation-hidden'));
    if (hidden) el.classList.remove('activation-hidden');
  }
  function setMode(mode) {
    $$('.mode-btn').forEach(b => b.classList.remove('active-mode'));
    $('#btnMode' + mode.charAt(0).toUpperCase() + mode.slice(1))?.classList.add('active-mode');

    const card = $('#mainCard');
    if (mode === 'orb') {
      card.classList.add('closed');
    } else {
      card.classList.remove('closed');
    }
    console.log('[KOBLLUX] Modo: ' + mode);
  }
  function toggleCard() {
    const card = $('#mainCard');
    const wasClosed = card.classList.contains('closed');
    card.classList.toggle('closed', !wasClosed);
    if (wasClosed) {
      // reabriu
      $$('.mode-btn').forEach(b => b.classList.remove('active-mode'));
      $('#btnModeCard').classList.add('active-mode');
      setTimeout(() => $('#inputUser')?.focus(), 300);
      window.KOBLLUX_LOG?.emit('CARD·OPEN', { detail: 'orb → expand' });
    } else {
      $$('.mode-btn').forEach(b => b.classList.remove('active-mode'));
      $('#btnModeOrb').classList.add('active-mode');
      window.KOBLLUX_LOG?.emit('CARD·CLOSE', { detail: 'expand → orb' });
    }
  }
  function openModal(id)  { $(id)?.classList.add('active'); }
  function closeModal(id) { $(id)?.classList.remove('active'); }

  function updateClock() {
    const now = new Date();
    $('#clockTime').textContent = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  setInterval(updateClock, 1000); updateClock();

  // ═══════════════════════════════════════════════════════════
  // [KOBLLUX·3×6×9 LOGGER] · canal único de eventos
  //   3 → DETECTAR (Ponto · 432Hz)
  //   6 → INTEGRAR (Linha  · 528Hz)
  //   9 → EXPANDIR (Triângulo · 639Hz)
  // ═══════════════════════════════════════════════════════════
  const KOBLLUX_LOG = {
    count: 0,
    sequence: [3, 6, 9],
    frequencies: { 3: 432, 6: 528, 9: 639 },
    phases: {
      3: 'Ponto (Gênese)',
      6: 'Linha (Fluxo)',
      9: 'Triângulo (Síntese)'
    },
    modes: { 3: 'DETECTAR', 6: 'INTEGRAR', 9: 'EXPANDIR' },

    emit(source, payload = {}) {
      this.count++;
      const idx   = (this.count - 1) % 3;
      const val   = this.sequence[idx];
      const freq  = this.frequencies[val];
      const phase = this.phases[val];
      const mode  = this.modes[val];
      const cycle = Math.ceil(this.count / 3);
      const sum   = this.count * val;
      const delta = val * 3;
      const arch  = STATE.archetype;
      const op    = KOBLLUX_OPCODES[arch.opcode];

      const coord = (payload.x != null && payload.y != null)
        ? `(${payload.x.toFixed(1)}, ${payload.y.toFixed(1)})` : '—';
      const detail = payload.detail || '';

      // console grupo colorido
      console.log(
        `%c[KOBLLUX·3×6×9] %c#${this.count} %c${source}`,
        `color:${arch.primary};font-weight:bold`,
        'color:#f0f',
        `color:${op.cor}`,
        `\n  ▸ VALOR: ${val}  | FREQ: ${freq}Hz | FASE: ${phase}` +
        `\n  ▸ COORD: ${coord} | TIPO: ${payload.type || source}` +
        `\n  ▸ CICLO: ${cycle}/∞ | Σ=${sum} | Δ=${delta} | MODE: ${mode}` +
        `\n  ▸ ARQ:   ${arch.name} (${arch.opcode}·${op.nome}·${op.geom}·${op.freq}Hz)` +
        (detail ? `\n  ▸ DETAIL: ${detail}` : '')
      );

      // readout DOM
      const ro = $('#fieldReadout');
      if (ro) {
        ro.innerHTML =
          `<span class="ev">#${this.count}</span> ` +
          `<span class="v${val}">${val}·${mode}·${freq}Hz</span> ` +
          `| ${source} ${coord}<br>` +
          `<span style="opacity:.6">cycle ${cycle} · Σ=${sum} · Δ=${delta} · ` +
          `${arch.name}/${arch.opcode}·${op.geom}</span>`;
      }
      return { val, freq, phase, mode, cycle };
    }
  };
  window.KOBLLUX_LOG = KOBLLUX_LOG;

  // ═══════════════════════════════════════════════════════════
  // [PARTICLES ENGINE] · particles.js + sync com arquétipo
  // ═══════════════════════════════════════════════════════════
  function hexToRgba(hex, a) {
    const h = hex.replace('#','');
    const r = parseInt(h.substring(0,2),16);
    const g = parseInt(h.substring(2,4),16);
    const b = parseInt(h.substring(4,6),16);
    return `rgba(${r},${g},${b},${a})`;
  }
  function initParticles() {
    if (typeof particlesJS === 'undefined') return;
    const a  = STATE.archetype;
    const op = KOBLLUX_OPCODES[a.opcode];

    particlesJS('particles-js', {
      particles: {
        number:  { value: 48, density: { enable: true, value_area: 900 } },
        color:   { value: [a.primary, op.cor, '#ffffff'] },
        shape:   { type: 'circle' },
        opacity: {
          value: 0.55, random: true,
          anim:  { enable: true, speed: 0.8, opacity_min: 0.08, sync: false }
        },
        size:    {
          value: 2.6, random: true,
          anim:  { enable: true, speed: 1.6, size_min: 0.4, sync: false }
        },
        line_linked: {
          enable: true, distance: 150, color: a.primary,
          opacity: 0.22, width: 1
        },
        move: {
          enable: true, speed: 1.4, direction: 'none',
          random: true, straight: false, out_mode: 'out',
          attract: { enable: true, rotateX: 600, rotateY: 1200 }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: true, mode: 'bubble' },
          resize:  true
        },
        modes: {
          grab:   { distance: 180, line_linked: { opacity: 0.55 } },
          bubble: { distance: 260, size: 8, duration: 0.5, opacity: 0.9, speed: 3 },
          push:   { particles_nb: 3 }
        }
      },
      retina_detect: true
    });
  }
  function syncParticlesToArchetype() {
    if (!window.pJSDom || !window.pJSDom.length) return;
    try {
      const a  = STATE.archetype;
      const op = KOBLLUX_OPCODES[a.opcode];
      const ps = window.pJSDom[0].pJS;
      ps.particles.color.value = [a.primary, op.cor, '#ffffff'];
      ps.particles.line_linked.color = a.primary;
      // re-render cores em tempo real
      ps.particles.array.forEach(p => {
        const pool = [a.primary, op.cor, '#ffffff'];
        const hex  = pool[Math.floor(Math.random() * pool.length)];
        const h = hex.replace('#','');
        p.color.rgb = {
          r: parseInt(h.substring(0,2),16),
          g: parseInt(h.substring(2,4),16),
          b: parseInt(h.substring(4,6),16)
        };
      });
      ps.fn.particlesRefresh();
    } catch(e) { /* silent */ }
  }
  // hook: aplicar arch também ressoa partículas
  const _applyArchetype = applyArchetype;
  applyArchetype = function(idx) {
    _applyArchetype(idx);
    syncParticlesToArchetype();
  };

  function spawnFieldPulse(x, y) {
    const p = document.createElement('div');
    p.className = 'field-pulse';
    p.style.left = x + 'px';
    p.style.top  = y + 'px';
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1100);
  }

  // ═══════════════════════════════════════════════════════════

  // [BOOT]
  // ═══════════════════════════════════════════════════════════
  document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();

    buildStrip();

    const savedArch = localStorage.getItem('di_activeArchetype');
    const idx = ARCHETYPES_DB.findIndex(a => a.id === savedArch);
    applyArchetype(idx >= 0 ? idx : 0);

    // partículas só depois do primeiro applyArchetype (que pinta o pano)
    initParticles();
    setTimeout(syncParticlesToArchetype, 400);

    const savedName = localStorage.getItem('di_userName') || localStorage.getItem('userName');
    di_syncNameUI(savedName || 'Convidado');

    // ── EVENT LISTENERS DO CAMPO (partículas) ──
    const field = document.getElementById('particles-js');
    ['mousedown', 'touchstart'].forEach(evt => {
      field.addEventListener(evt, (e) => {
        const touch = e.touches ? e.touches[0] : e;
        const x = touch.clientX;
        const y = touch.clientY;
        const r = KOBLLUX_LOG.emit('CAMPO', {
          x, y,
          type: evt === 'touchstart' ? 'TOQUE' : 'CLIQUE'
        });
        spawnFieldPulse(x, y);
        // ressonância 9 (Síntese) → próximo arquétipo
        if (r.val === 9) {
          KOBLLUX_LOG.emit('RESSONÂNCIA', { detail: 'val=9 · cycle archetype' });
          nextArchetype();
        }
      }, { passive: true });
    });
    // hover silencioso a cada 250ms — só readout, sem console flood
    let _lastHover = 0;
    field.addEventListener('mousemove', (e) => {
      const now = Date.now();
      if (now - _lastHover < 250) return;
      _lastHover = now;
      const ro = $('#fieldReadout');
      const a  = STATE.archetype;
      if (ro && !STATE._silentReadout) {
        // só atualiza coord se nenhum evento recente reescreveu
      }
    }, { passive: true });

    $('#inputUser')?.addEventListener('input', e => di_syncNameUI(e.target.value));
    $('#infodoseNameInput')?.addEventListener('input', e => di_syncNameUI(e.target.value));

    $('#archPrev')?.addEventListener('click', prevArchetype);
    $('#archNext')?.addEventListener('click', nextArchetype);

    // orb colapsado → reabre
    $('#collapsedOrb')?.addEventListener('click', toggleCard);
    // avatar header → cofre
    $('#avatarTarget')?.addEventListener('click', () => openModal('#keysModal'));

    // duplo clique no header colapsa
    $('#cardHeader')?.addEventListener('dblclick', toggleCard);

    $('#closeKeysBtn')?.addEventListener('click', () => closeModal('#keysModal'));
    $('#lockVaultBtn')?.addEventListener('click', () => {
      closeModal('#keysModal'); openModal('#vaultModal');
    });
    $('#vaultCancelBtn')?.addEventListener('click', () => closeModal('#vaultModal'));
    $('#vaultUnlockBtn')?.addEventListener('click', () => {
      closeModal('#vaultModal');
      console.log('[KOBLLUX] Cofre desbloqueado');
    });

    $('#copyActBtn')?.addEventListener('click', async () => {
      const text = $('#actPre')?.textContent || '';
      try {
        await navigator.clipboard.writeText(text);
        const btn = $('#copyActBtn');
        const original = btn.textContent;
        btn.textContent = 'COPIADO!';
        setTimeout(() => btn.textContent = original, 1500);
      } catch (e) { console.error(e); }
    });

    $('#saveSystemBtn')?.addEventListener('click', () => {
      const name  = $('#infodoseNameInput')?.value;
      const key   = $('#apiKeyInput')?.value;
      const model = $('#modelSelect')?.value;
      console.log('[KOBLLUX] Config salva:', { name, key: key ? '***' : '', model });
      const btn = $('#saveSystemBtn');
      const original = btn.textContent;
      btn.textContent = '✓ SALVO';
      setTimeout(() => btn.textContent = original, 1400);
    });

    // teclado: ←/→ navega arquétipos · espaço colapsa
    document.addEventListener('keydown', (e) => {
      if (e.target.matches('input, textarea, select')) return;
      if (e.key === 'ArrowRight') { nextArchetype(); e.preventDefault(); }
      if (e.key === 'ArrowLeft')  { prevArchetype(); e.preventDefault(); }
      if (e.key === ' ')          { toggleCard();     e.preventDefault(); }
    });

    setTimeout(() => { if (window.lucide) lucide.createIcons(); }, 100);
  });

  // expor API
  window.KOBLLUX_CARD = {
    applyArchetype, nextArchetype, prevArchetype,
    toggleCard, toggleSection, setMode,
    di_syncNameUI, openModal, closeModal,
    ARCHETYPES_DB, KOBLLUX_OPCODES
  };
  