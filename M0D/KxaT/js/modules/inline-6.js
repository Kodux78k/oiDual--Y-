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

