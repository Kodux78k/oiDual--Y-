/*
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('sw.js')
        .then(() => console.log('✔️ Service Worker registrado'))
        .catch(err => console.error('❌ Service Worker falhou:', err));
    }
  */

// RHEA bridge · cola motor → chat
// Cole no KxaT, em qualquer inline-*.js

window.KBLX_motorToChat = function() {
  const stored = localStorage.getItem('kobllux_last_result');
  if (!stored) { console.warn('[KBLX] Nenhum resultado do motor encontrado.'); return; }

  const responseList = document.getElementById('responseList');
  if (!responseList) return;

  const wrapper = document.createElement('div');
  wrapper.className = 'response-block motor-inject-block';
  wrapper.dataset.source = '78k-motor';
  wrapper.dataset.ts = Date.now();

  // Cada linha "ARCHNAME — sentence" vira um bloco colorido
  const frags = stored.trim().split('\n\n').filter(Boolean).map(line => {
    const dash = line.indexOf(' — ');
    if (dash === -1) return `<div class="motor-frag">${line}</div>`;
    const arch = line.slice(0, dash).trim().toLowerCase();
    const text = line.slice(dash + 3).trim();
    return `<div class="motor-frag" data-arch="${arch}">
      <span class="arch-label" style="opacity:.6;font-size:.78em">${arch.toUpperCase()}</span>
      <span class="frag-text"> — ${text}</span>
    </div>`;
  });

  wrapper.innerHTML = frags.join('');
  responseList.appendChild(wrapper);
  responseList.scrollTop = responseList.scrollHeight;
};

// Botão de acionamento (pode ser o #parserBtn ou um novo):
// document.getElementById('parserBtn')?.addEventListener('click', window.KBLX_motorToChat);
// Cole no KxaT inline-10.js ou no final do inline-7-9.js

(function attachFileToChat() {
  const sendBtn = document.getElementById('sendBtn');
  if (!sendBtn) return;

  // Cria input oculto de arquivo
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.txt,.md,.json,.html,.css,.js,.pdf';
  fileInput.style.display = 'none';
  fileInput.id = 'chatFileInput';
  document.body.appendChild(fileInput);

  // Botão de clipe (insere antes do sendBtn)
  const clipBtn = document.createElement('button');
  clipBtn.type = 'button';
  clipBtn.title = 'Anexar arquivo ao chat';
  clipBtn.id = 'chatClipBtn';
  clipBtn.innerHTML = '📎';
  clipBtn.style.cssText = `
    background:transparent; border:none; color:var(--grad-a,#0cf);
    font-size:1.2rem; cursor:pointer; padding:0 8px; opacity:.7;
  `;
  sendBtn.parentNode.insertBefore(clipBtn, sendBtn);

  clipBtn.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      const content = e.target.result;
      const userInput = document.getElementById('userInput');

      // Injeta como contexto: o arquivo vai como prefixo da próxima mensagem
      if (userInput) {
        const prev = userInput.value.trim();
        userInput.value = `[ARQUIVO: ${file.name}]\n\`\`\`\n${content.slice(0, 8000)}\n\`\`\`\n${prev ? '\n' + prev : ''}`;
      }
      fileInput.value = ''; // reset
    };

    if (file.type.startsWith('text') || /\.(md|json|html|css|js|txt)$/i.test(file.name)) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  });
})();




 
(function(){
  var MOTOR_HTML = "<!DOCTYPE html>\n<html lang=\"pt\"><head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no\">\n  <title>KOBLLUX \u00b7 HERO-DOCK 78K \u00b7 VEEB</title>\n  \n  <!-- Fontes -->\n  <link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n  <link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin=\"\">\n  <link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800&amp;family=JetBrains+Mono:wght@400;700&amp;family=Montserrat:wght@800;900&amp;display=swap\" rel=\"stylesheet\">\n  <meta name=\"apple-mobile-web-app-capable\" content=\"yes\">\n<meta name=\"apple-mobile-web-app-status-bar-style\" content=\"black-translucent\">\n<link rel=\"apple-touch-icon\" href=\"https://kodux78k.github.io/oiDual--Y-/M0D/78K-motor/icon-192.png\">\n\n  \n<link rel=\"manifest\" href=\"https://kodux78k.github.io/oiDual--Y-/M0D/78K-motor/manifest.json\">\n\n <link rel=\"stylesheet\" href=\"https://kodux78k.github.io/oiDual--Y-/M0D/78K-motor/css/main-v2.css\">\n  \n\n <link rel=\"stylesheet\" href=\"https://kodux78k.github.io/oiDual--Y-/M0D/78K-motor/css/main-0-1.css\">\n <link rel=\"stylesheet\" href=\"https://kodux78k.github.io/oiDual--Y-/M0D/78K-motor/css/motor-369.css\">\n</head>\n<body data-arch=\"kodux\">\n\n  <div class=\"container\">\n    <!-- Bloco Principal (Agora \u00e9 um Acorde\u00e3o) -->\n    <main class=\"fusion-card accordion is-open\" id=\"mainHeroCard\">\n      <!-- HEADER ACORDE\u00c3O -->\n      <div class=\"header-78k accordion-header\">\n        <div style=\"display: flex; align-items: center; gap: 20px;\">\n          <div class=\"logo-orb\"></div>\n          <div class=\"title-block\">\n            <h1>Motor 78K</h1>\n            <p>Kobllux Matrix Densa \u00b7 VEEB</p>\n          </div>\n        </div>\n        <!-- Indicador ser\u00e1 injetado pelo JS ou pode ser hardcoded. Deixaremos o JS injetar. -->\n      </div>\n      \n      <!-- BODY ACORDE\u00c3O -->\n      <div class=\"collapsible-body\">\n        <div class=\"input-group\">\n          <textarea id=\"inputText\" placeholder=\"Insira o texto original aqui. O motor usar\u00e1 a pontua\u00e7\u00e3o (. ! ?) para segmentar os fractais...\"></textarea>\n        </div>\n        \n        <div class=\"controls-grid\">\n          <div class=\"input-group\">\n            <label>Frequ\u00eancia Inicial (Arqu\u00e9tipo)</label>\n            <select id=\"startArch\">\n              <option value=\"atlas\">Atlas (Ordem/Estrutura)</option>\n<option value=\"nova\">Nova (Energia/Inova\u00e7\u00e3o)</option>\n<option value=\"vitalis\">Vitalis (Crescimento/Vida)</option>\n<option value=\"pulse\">Pulse (Ritmo/A\u00e7\u00e3o)</option>\n<option value=\"kaos\">Kaos (Desconstru\u00e7\u00e3o)</option>\n<option value=\"kodux\" selected>Kodux (S\u00edntese/Mestre)</option>\n<option value=\"lumine\">Lumine (Clareza/Luz)</option>\n<option value=\"aion\">Aion (Tempo/Eternidade)</option>\n<option value=\"kobllux\">Kobllux (Origem/N\u00facleo)</option>\n<option value=\"artemis\">Artemis (Foco/Estrat\u00e9gia)</option>\n<option value=\"serena\">Serena (Equil\u00edbrio/Calma)</option>\n<option value=\"genus\">Genus (L\u00f3gica/Intelig\u00eancia)</option>\n<option value=\"solus\">Solus (Isolamento/Profundidade)</option>\n<option value=\"rhea\">Rhea (Fluxo/Natureza)</option>\n<option value=\"uno\">Uno (Unidade/Ess\u00eancia)</option>\n<option value=\"dual\">Dual (Polaridade/Espelho)</option>\n<option value=\"trinity\">Trinity (Integra\u00e7\u00e3o/Totalidade)</option>\n<option value=\"infodose\">Infodose (S\u00edntese/R\u00e1pida)</option>\n<option value=\"horus\">Horus (Vis\u00e3o/Consci\u00eancia)</option>\n<option value=\"bllue\">Bllue (Expans\u00e3o/Digital)</option>\n<option value=\"user\" id=\"diUserOption\"></option>            </select>\n          </div>\n          \n          <label class=\"checkbox-wrapper\" title=\"Alterna os arqu\u00e9tipos sequencialmente para cada par\u00e1grafo gerado\">\n            <input type=\"checkbox\" id=\"cycleMode\" checked=\"\">\n            <span>Modo Roda Viva (Ciclagem)</span>\n          </label>\n        </div>\n<!-- PAINEL MOTOR 3\u00b76\u00b79 -->\n<div class=\"engine-controls accordion is-collapsed\">\n\n  <div class=\"accordion-header\">\n    <div class=\"arch-tag\">\n      \u2699\ufe0f Motor 3\u00b76\u00b79 \u00b7\n    </div>\n  </div>\n\n  <div class=\"collapsible-body\">\n    <div class=\"engine-row\">\n      <div style=\"display:flex; align-items:center; gap:12px; flex-wrap:wrap;\">\n        <label>\u26a1 Motor</label>\n        <div class=\"btn-group\">\n          <!-- NOVO BOT\u00c3O NEUTRO + \u00cdCONES EM TODOS -->\n          <button type=\"button\" class=\"engine-btn\" data-engine=\"1\" title=\"Estado Neutro - Sem avan\u00e7o de arqu\u00e9tipos\">\u26aa Neutro</button>\n          <button type=\"button\" class=\"engine-btn\" data-engine=\"3\" title=\"+3\">\u27953</button>\n          <button type=\"button\" class=\"engine-btn\" data-engine=\"6\" title=\"+6\">\u27956</button>\n          <button type=\"button\" class=\"engine-btn\" data-engine=\"9\" title=\"+9\">\u27959</button>\n        </div>\n      </div>\n\n      <!-- o resto do engine-row fica IGUAL (Dire\u00e7\u00e3o, Salto, Ciclo Especial) -->\n      <div style=\"display:flex; align-items:center; gap:12px; flex-wrap:wrap;\">\n        <label>\ud83d\udd04 Dire\u00e7\u00e3o</label>\n        <button type=\"button\" class=\"engine-btn\" id=\"reverseToggle\">Reverse: OFF</button>\n      </div>\n\n      <div style=\"display:flex; align-items:center; gap:12px; flex-wrap:wrap;\">\n        <label>\u2934\ufe0f Salto</label>\n        <div class=\"btn-group\">\n          <button type=\"button\" class=\"engine-btn\" data-jump=\"0\">0</button>\n          <button type=\"button\" class=\"engine-btn\" data-jump=\"3\">+3</button>\n          <button type=\"button\" class=\"engine-btn\" data-jump=\"6\">+6</button>\n          <button type=\"button\" class=\"engine-btn\" data-jump=\"9\">+9</button>\n        </div>\n      </div>\n\n      <div style=\"display:flex; align-items:center; gap:12px; flex-wrap:wrap;\">\n        <label>\ud83c\udf00 Ciclo Especial</label>\n        <button type=\"button\" class=\"engine-btn\" id=\"cycle3697\">3-6-9-7: OFF</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n        <button class=\"btn-generate\" id=\"genBtn\">Integrar Fractais de Texto</button>\n      </div>\n    </main>\n\n    <!-- \u00c1rea de Sa\u00edda (.content) -->\n    <div id=\"outputContainer\" class=\"output-area content\">\n      <div class=\"empty-state\">Aguardando inser\u00e7\u00e3o de dados. O processamento ocorrer\u00e1 na frequ\u00eancia selecionada.</div>\n    </div>\n\n    <div class=\"status-bar\" id=\"statusBar\">Sistema em repouso \u00b7 Matrix Pronta</div>\n  </div>\n\n  <!-- HUD Magn\u00e9tico -->\n  <div class=\"symbol-bar\" id=\"hudBar\">\n    <div class=\"drag-handle\" id=\"hudDrag\" title=\"Arrastar HUD\"></div>\n    <button class=\"symbol-btn\" id=\"copyBtn\" title=\"Copiar Texto Processado\">\n      <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\" ry=\"2\"></rect><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"></path></svg>\n    </button>\n    <button class=\"symbol-btn\" id=\"clearBtn\" title=\"Limpar Tudo\">\n      <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><polyline points=\"3 6 5 6 21 6\"></polyline><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path><line x1=\"10\" y1=\"11\" x2=\"10\" y2=\"17\"></line><line x1=\"14\" y1=\"11\" x2=\"14\" y2=\"17\"></line></svg>\n    </button>\n    <button class=\"symbol-btn\" id=\"downloadBtn\" title=\"Transferir Documento\">\n      <svg width=\"20\" height=\"20\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\"></path><polyline points=\"7 10 12 15 17 10\"></polyline><line x1=\"12\" y1=\"15\" x2=\"12\" y2=\"3\"></line></svg>\n    </button>\n    <div class=\"hud-info\" id=\"hudStatus\">78K-ID</div>\n  </div>\n\n  <div id=\"toast-container\"></div>\n\n <section class=\"archetypes-section\">\n      <div class=\"section-header\">\n        <p class=\"section-label\">Opcode 0x0B \u00b7 Os 12 Agentes C\u00f3smicos</p>\n        <h2 class=\"section-title\">Arqu\u00e9tipos da Matrix Densa</h2>\n      </div>\n      <div class=\"archetypes-grid\" id=\"archetypes-grid\"></div>\n    </section>\n\n  <script src=\"https://kodux78k.github.io/oiDual--Y-/M0D/78K-motor/js/modules/inline-1-369.js\"><\/script>\n\n\n<style>\nbody{overflow-y:auto}\n\n</style>\n\n<script>\n(function(){\n  function applyPayload(data){\n    try{\n      data = data || {};\n      var input = document.getElementById('inputText');\n      var startArch = document.getElementById('startArch');\n      var cycleMode = document.getElementById('cycleMode');\n      var reverseBtn = document.getElementById('reverseToggle');\n      var genBtn = document.getElementById('genBtn');\n\n      if (data.arch && startArch){\n        var arch = String(data.arch).toLowerCase();\n        var match = Array.from(startArch.options).find(function(opt){ return opt.value === arch; });\n        if (match) startArch.value = arch;\n      }\n      if (typeof data.text === 'string' && input){\n        input.value = data.text;\n        input.dispatchEvent(new Event('input', { bubbles: true }));\n      }\n      if (typeof data.cycle !== 'undefined' && cycleMode){\n        cycleMode.checked = !!data.cycle;\n      }\n      if (typeof data.step !== 'undefined'){\n        var stepBtn = document.querySelector('[data-engine=\"' + String(data.step) + '\"]');\n        if (stepBtn) stepBtn.click();\n      }\n      if (typeof data.jump !== 'undefined'){\n        var jumpBtn = document.querySelector('[data-jump=\"' + String(data.jump) + '\"]');\n        if (jumpBtn) jumpBtn.click();\n      }\n      if (typeof data.reverse !== 'undefined' && reverseBtn){\n        var isOn = /ON/.test(reverseBtn.textContent || '');\n        if (!!data.reverse !== isOn) reverseBtn.click();\n      }\n      if (data.run !== false && genBtn){\n        genBtn.click();\n      }\n    }catch(err){\n      console.error('KDX motor bridge error:', err);\n    }\n  }\n\n  window.addEventListener('message', function(ev){\n    var d = ev && ev.data ? ev.data : {};\n    if (!d || d.type !== 'kdx-motor-load') return;\n    applyPayload(d.payload || d);\n  });\n\n  window.KDX_MOTOR = { applyPayload: applyPayload };\n\n  window.addEventListener('load', function(){\n    try{\n      if (window.parent && window.parent !== window){\n        window.parent.postMessage({ type: 'kdx-motor-ready' }, '*');\n      }\n    }catch(e){}\n  });\n})();\n<\/script>\n\n</body></html>\n\n<!--\n\n<script>\nconst userName = localStorage.getItem(\"di_userName\") || \"User\";\nconst userOption = document.getElementById(\"diUserOption\");\n\nuserOption.value = userName.toLowerCase();\nuserOption.textContent = `${userName} (Usu\u00e1rio/N\u00facleo)`;\n\n<\/script>\n\n\n  <script src=\"https://kodux78k.github.io/oiDual--Y-/M0D/78K-motor/js/modules/inline-0-v2.js\"><\/script>\n  \n  <script src=\"https://kodux78k.github.io/oiDual--Y-/M0D/78K-motor/js/modules/inline-0.js\"><\/script>\n\n<script type=\"module\" src=\"./js/main.js\"><\/script>\n\n  <script type=\"module\" src=\"https://kodux78k.github.io/oiDual--Y-/M0D/78K-motor/js/main.js\"><\/script>\n\n-->\n";
  var motorUrl = null;
  var motorReady = false;
  var pendingMotorPayload = null;
  var longPressTimer = null;
  var longPressFired = false;

  function qs(id) { return document.getElementById(id); }

  function latestSpeakableText() {
    var root = qs('responseList');
    if (!root) return '';

    var blocks = root.querySelectorAll('.response-block');

    var allText = '';

    for (var i = 0; i < blocks.length; i++) {
        var b = blocks[i];
        if (!b) continue;

        var txt = (b.innerText || b.textContent || '').trim();

        if (txt) {
            allText += txt + '\n\n────────\n\n';
        }
    }

    return allText.trim();
}

  function getCurrentArchFromBlock(block) {
    if (!block) return null;
    var arch = block.dataset ? (block.dataset.archetype || block.dataset.arch) : '';
    if (arch) return String(arch).trim();
    var active = localStorage.getItem('ARCHETYPE_ACTIVE') || localStorage.getItem('ARCHETYPE_ACTIVE'.toLowerCase());
    return active || null;
  }

  function ensureMotorSrc() {
    var frame = qs('motorFrame');
    if (!frame) return null;
    if (motorUrl) return motorUrl;
    try {
      var blob = new Blob([MOTOR_HTML], { type: 'text/html;charset=utf-8' });
      motorUrl = URL.createObjectURL(blob);
      frame.src = motorUrl;
      return motorUrl;
    } catch (err) {
      console.error('Falha ao criar blob do motor:', err);
      frame.srcdoc = MOTOR_HTML;
      return null;
    }
  }

  function openMotorDock(payload, opts) {
    var dock = qs('motorDock');
    var frame = qs('motorFrame');
    if (!dock || !frame) return;
    ensureMotorSrc();
    dock.hidden = false;
    document.body.classList.add('motor-mode');
    var state = qs('motorDockState');
    if (state) state.textContent = (opts && opts.localOnly) ? 'modo local · eco do espaço mental' : 'modo motor · pronto';
    var btn = qs('toggleMotorBtn');
    if (btn) btn.setAttribute('aria-pressed', 'true');
    if (payload) sendToMotor(payload, opts);
  }

  function closeMotorDock() {
    var dock = qs('motorDock');
    var btn = qs('toggleMotorBtn');
    if (dock) dock.hidden = true;
    document.body.classList.remove('motor-mode');
    if (btn) btn.setAttribute('aria-pressed', 'false');
  }

  function toggleMotorDock(payload, opts) {
    var dock = qs('motorDock');
    if (!dock) return;
    if (dock.hidden) openMotorDock(payload, opts);
    else closeMotorDock();
  }

  function flushMotorPayload() {
    var frame = qs('motorFrame');
    if (!frame || !frame.contentWindow || !pendingMotorPayload) return;
    try {
      frame.contentWindow.postMessage({ type: 'kdx-motor-load', payload: pendingMotorPayload }, '*');
      pendingMotorPayload = null;
    } catch (e) {
      console.warn('flushMotorPayload failed', e);
    }
  }

  function sendToMotor(payload, opts) {
    var frame = qs('motorFrame');
    if (!frame) return;
    ensureMotorSrc();
    pendingMotorPayload = payload || {};
    if (motorReady) flushMotorPayload();
    if (opts && opts.keepOpen) openMotorDock(null, opts);
  }

  function wireBlockMotorButtons() {
    var root = qs('responseList');
    if (!root || root.dataset.motorButtonsWired === '1') return;
    root.dataset.motorButtonsWired = '1';

    var obs = new MutationObserver(function() {
      root.querySelectorAll('.response-block').forEach(function(block) {
        if (block.querySelector('.send-to-motor-btn')) return;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'send-to-motor-btn';
        btn.textContent = '↗78K';
        btn.addEventListener('click', function(ev) {
          ev.stopPropagation();
          var text = (block.innerText || block.textContent || '').trim();
          if (!text) return;
          var arch = getCurrentArchFromBlock(block) || localStorage.getItem('ARCHETYPE_ACTIVE') || 'kodux';
          openMotorDock(null, { localOnly: false });
          sendToMotor({
            type: 'kdx-motor-load',
            text: text,
            arch: arch,
            cycle: true,
            run: true
          });
          var hint = qs('footerHint');
          if (hint) hint.textContent = 'Mensagem enviada ao motor 78K.';
        });
        block.appendChild(btn);
      });
    });
    obs.observe(root, { childList: true, subtree: true });
  }

  function wireMotorToggle() {
    var btn = qs('toggleMotorBtn');
    if (btn && btn.dataset.wired !== '1') {
      btn.dataset.wired = '1';
      btn.addEventListener('click', function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        toggleMotorDock({
          text: latestSpeakableText(),
          arch: localStorage.getItem('ARCHETYPE_ACTIVE') || 'kodux',
          cycle: true,
          run: true
        }, { keepOpen: true });
      });
    }

    var dockClose = qs('motorDockClose');
    if (dockClose && dockClose.dataset.wired !== '1') {
      dockClose.dataset.wired = '1';
      dockClose.addEventListener('click', function() { closeMotorDock(); });
    }

    var star = qs('kdx-mode-toggle');
    if (star && star.dataset.wired !== '1') {
      star.dataset.wired = '1';
      star.addEventListener('click', function(ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();
        openMotorDock({
          type: 'kdx-motor-load',
          text: latestSpeakableText(),
          arch: localStorage.getItem('ARCHETYPE_ACTIVE') || 'kodux',
          cycle: true,
          run: true
        }, { keepOpen: true });
      }, true);

      star.addEventListener('pointerdown', function() {
        longPressFired = false;
        clearTimeout(longPressTimer);
        longPressTimer = setTimeout(function() {
          longPressFired = true;
          openMotorDock({
            type: 'kdx-motor-load',
            text: latestSpeakableText(),
            arch: localStorage.getItem('ARCHETYPE_ACTIVE') || 'kodux',
            cycle: false,
            run: false
          }, { localOnly: true, keepOpen: true });
          var hint = qs('footerHint');
          if (hint) hint.textContent = 'Modo local ativado: o motor apenas ecoa a leitura.';
        }, 520);
      });
      star.addEventListener('pointerup', function() { clearTimeout(longPressTimer); });
      star.addEventListener('pointerleave', function() { clearTimeout(longPressTimer); });
      star.addEventListener('pointercancel', function() { clearTimeout(longPressTimer); });
    }
  }

  function applyAriaStates() {
    var dock = qs('motorDock');
    var btn = qs('toggleMotorBtn');
    var star = qs('kdx-mode-toggle');
    if (dock && btn) btn.setAttribute('aria-pressed', dock.hidden ? 'false' : 'true');
    if (star) star.classList.toggle('kdx-motor-armed', !dock || !dock.hidden);
  }

  window.addEventListener('message', function(ev) {
    var d = ev && ev.data ? ev.data : null;
    if (!d) return;
    if (d.type === 'kdx-motor-ready') {
      motorReady = true;
      flushMotorPayload();
      var hint = qs('footerHint');
      if (hint) hint.textContent = 'Motor 78K USE•TRANSFORME•DEVOLVA';
    }
  });

  function boot() {
    wireBlockMotorButtons();
    wireMotorToggle();
    ensureMotorSrc();
    var frame = qs('motorFrame');
    if (frame) {
      frame.addEventListener('load', function() {
        setTimeout(flushMotorPayload, 150);
      });
    }
    applyAriaStates();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.KDX_MOTOR_PATCH = {
    open: openMotorDock,
    close: closeMotorDock,
    toggle: toggleMotorDock,
    send: sendToMotor
  };
})();

