  (function(){
    const STORAGE = {
      THEME: 'infodoseTheme',
      USER_NAME: 'infodoseUserName',
      ASSISTANT_NAME: 'infodoseAssistantName',
      OPENROUTER_KEY: 'openrouter_api_key',
      OPENROUTER_MODEL: 'openrouter_model',
      VOICE_CONFIG: 'infodoseVoiceConfig',
      VOICE_CURRENT_KEY: 'infodoseVoiceCurrentKey'
    };

    const MOTOR_STORAGE = {
      ENGINE_STEP: 'kobllux_engine_step',
      REVERSE: 'kobllux_reverse_mode',
      JUMP: 'kobllux_jump_step',
      CYCLE: 'kobllux_cycle_3697',
      DRAFT: 'kobllux_draft_input',
      LAST_RESULT: 'kobllux_last_result',
      ARCH_ACTIVE: 'ARCHETYPE_ACTIVE'
    };

    const DEFAULTS = {
      API_URL: 'https://openrouter.ai/api/v1/chat/completions',
      MODEL: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
      TEMP: 0.2,
      CHUNK_SIZE: 12000
    };

    const CHAT = {
      responseList: document.getElementById('responseList'),
      bootBlock: document.getElementById('bootBlock'),
      bootText: document.getElementById('bootText'),
      footerHint: document.getElementById('chatFooterHint'),
      copyBtn: document.getElementById('chatCopyBtn'),
      pasteBtn: document.getElementById('chatPasteBtn'),
      parserBtn: document.getElementById('chatParserBtn'),
      parserFile: document.getElementById('parserFileInput'),
      voiceConfigBtn: document.getElementById('chatVoiceConfigBtn'),
      voiceConfigFile: document.getElementById('voiceConfigFileInput'),
      loginToggleBtn: document.getElementById('loginToggleBtn'),
      loginModal: document.getElementById('loginModal'),
      loginCloseBtn: document.getElementById('closeLoginBtn'),
      saveNamesBtn: document.getElementById('saveNamesBtn'),
      userNameInput: document.getElementById('userNameInput'),
      assistantInput: document.getElementById('assistantInput'),
      assistantNameEl: document.getElementById('assistantName'),
      chatInput: document.getElementById('chatInput'),
      sendBtn: document.getElementById('chatSendBtn'),
      chatSettingsBtn: document.getElementById('chatSettingsBtn'),
      chatOpenIaBtn: document.getElementById('chatOpenIaBtn'),
      settingsPanel: document.getElementById('chatSettingsPanel'),
      closeSettingsBtn: document.getElementById('closeChatSettingsBtn'),
      apiKeyInput: document.getElementById('apiKeyInput'),
      modelSelect: document.getElementById('modelSelect'),
      customModelInput: document.getElementById('customModelInput'),
      saveIaConfigBtn: document.getElementById('saveIaConfigBtn'),
      clearIaConfigBtn: document.getElementById('clearIaConfigBtn'),
      iaStatus: document.getElementById('iaStatus'),
      themeSelect: document.getElementById('themeSelect'),
      historyBtn: document.getElementById('openHistoryBtn'),
      historyPanel: document.getElementById('historyPanel'),
      closeHistoryBtn: document.getElementById('closeHistoryBtn'),
      saveConversationBtn: document.getElementById('saveConversationBtn'),
      autoSaveToggle: document.getElementById('autoSaveToggle'),
      historyItems: document.getElementById('historyItems'),
      chatClearBtn: document.getElementById('chatClearBtn'),
      chatSaveBtn: document.getElementById('chatSaveBtn'),
      voiceBtn: document.getElementById('chatVoiceBtn'),
      hudInfo: document.getElementById('hudInfo'),
      mainOrb: document.getElementById('mainOrb'),
      footerHint: document.getElementById('footerHint'),
      parserFileInput: document.getElementById('parserFileInput')
    };

    const ENGINE = {
      input: document.getElementById('engineInputText'),
      output: document.getElementById('outputContainer'),
      genBtn: document.getElementById('genBtn'),
      archSelect: document.getElementById('startArch'),
      cycleCheck: document.getElementById('cycleMode'),
      body: document.body,
      copyBtn: document.getElementById('motorCopyBtn'),
      clearBtn: document.getElementById('motorClearBtn'),
      downloadBtn: document.getElementById('motorDownloadBtn'),
      statusBar: document.getElementById('statusBar'),
      hudStatus: document.getElementById('hudStatus'),
      toastContainer: document.getElementById('toastContainer'),
      mainCard: document.getElementById('mainHeroCard'),
      reverseToggle: document.getElementById('reverseToggle'),
      cycle3697: document.getElementById('cycle3697')
    };

    const synth = window.speechSynthesis || null;
    let currentUtterance = null;
    let availableVoices = [];
    let voiceConfig = null;
    let currentVoiceKey = 'default';
    let conversation = [];
    let responseBlocks = [];
    let initialized = false;
    let isCollapsed = false;

    const ARCHETYPE_KEYWORDS = {
      Atlas: ["atlas","fluxo","mapa","estrutura","organização","organizar","planejamento","árvore","checklist","estratégia"],
      Nova: ["nova","começar","começo","ideia","idéia","visão","criar","protótipo","protótipos","imaginar","descobrir","ativar","estado"],
      Vitalis: ["vitalis","corpo","energia","respiração","ritmo","h3o2","saúde","vitalidade","hidratação","movimento"],
      Pulse: ["pulse","pulso","tempo","ciclo","ciclos","batida","pulsar","ritmo","loop","síncrono","batimento"],
      Artemis: ["artemis","foco","focada","mira","precisão","aventura","explorar","exploração","alvo","caçada"],
      Serena: ["serena","serenidade","calma","acolhimento","cuidar","suave","pausa","repouso","apoio","paz","tranquilo","tranquilidade"],
      Kaos: ["kaos","quebra","ruptura","caos","provocação","virada","rebeldia","desalinho","disrupção","choque"],
      Genus: ["genus","padrão","padrões","tabela","planilha","referência","documento","estrutura lógica","dados","sistematizar"],
      Lumine: ["lumine","luz","cores","estética","beleza","design","gradiente","iluminar","alegria","lúdico","brincadeira","brilho","colorido"],
      Rhea: ["rhea","guia","cuidado","conectar","empatia","acompanhamento","profundo","profundidade","vínculo","raízes","intimidade"],
      Solus: ["solus","unidade","sozinho","inteiro","solo","núcleo","essência","solidão","silêncio","meditação","contemplar","introspecção"],
      Aion: ["aion","tempo longo","ciclos grandes","eras","fractal","registro","eterno","futuro","linha do tempo","cíclico","infinito"],
      KOBLLUX: ["kobllux","kob","nó raiz","núcleo do sistema","portal","oráculo","meta-sistema"],
      Uno: ["uno","origem","fonte","essência","essencial","mínimo","minimalista","centro"],
      Dual: ["dual","espelho","contraste","polaridade","dois lados","reverso","espelhado"],
      Trinity: ["trinity","trindade","tríade","3·6·9","3x","síntese","triângulo","triádico"],
      Infodose: ["infodose","dose","arquétipo","arquétipos","ativação","dopamina","pílula"],
      Kodux: ["kodux","criador","metaconsciência","pulso criador","manifesto","metafuturo"],
      Bllue: ["bllue","blue","emoção","emocional","sensível","sensação","sensório","intuitivo"]
    };

    const ARCHETYPES = ['atlas','nova','vitalis','pulse','kaos','kodux','lumine','aion','kobllux','artemis','serena','genus','solus','rhea','uno','dual','trinity','infodose','horus','bllue'];

    function qs(sel, root=document){ return root.querySelector(sel); }
    function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

    function escapeHtml(s){
      return String(s)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;');
    }

    function showToast(message, isError=false){
      if (!ENGINE.toastContainer) return;
      const toast = document.createElement('div');
      toast.className = 'toast';
      toast.textContent = message;
      if (isError) toast.style.borderColor = 'rgba(255,107,107,.5)';
      ENGINE.toastContainer.appendChild(toast);
      setTimeout(()=>toast.remove(), 3000);
    }

    function applyTheme(theme){
      document.body.dataset.theme = theme;
      localStorage.setItem(STORAGE.THEME, theme);
      if (CHAT.themeSelect) CHAT.themeSelect.value = theme;
    }

    function restoreTheme(){
      applyTheme(localStorage.getItem(STORAGE.THEME) || 'dark');
    }

    function loadNames(){
      const user = localStorage.getItem(STORAGE.USER_NAME) || '';
      const asst = localStorage.getItem(STORAGE.ASSISTANT_NAME) || 'Dual.Infodose · Cinemático';
      if (user && CHAT.userNameInput) CHAT.userNameInput.value = user;
      if (asst && CHAT.assistantInput) CHAT.assistantInput.value = asst;
      if (CHAT.assistantNameEl) CHAT.assistantNameEl.textContent = asst;
    }

    function restoreIaConfig(){
      const key = localStorage.getItem(STORAGE.OPENROUTER_KEY) || '';
      const model = localStorage.getItem(STORAGE.OPENROUTER_MODEL) || DEFAULTS.MODEL;
      if (CHAT.apiKeyInput) CHAT.apiKeyInput.value = key;
      if (CHAT.modelSelect) CHAT.modelSelect.value = CHAT.modelSelect.querySelector(`option[value="${CSS.escape(model)}"]`) ? model : 'custom';
      if (CHAT.customModelInput && CHAT.modelSelect.value === 'custom') CHAT.customModelInput.value = model;
      if (CHAT.iaStatus){
        CHAT.iaStatus.textContent = key ? 'Config carregada. Pronto para chamar a IA.' : 'Nenhuma chave salva ainda.';
        CHAT.iaStatus.className = 'status-bar';
      }
    }

    function saveIaConfig(){
      let key = CHAT.apiKeyInput ? CHAT.apiKeyInput.value.trim() : '';
      let model = CHAT.modelSelect ? CHAT.modelSelect.value : DEFAULTS.MODEL;
      if (model === 'custom'){
        const custom = CHAT.customModelInput ? CHAT.customModelInput.value.trim() : '';
        if (custom) model = custom;
      }
      if (!key){
        if (CHAT.iaStatus) CHAT.iaStatus.textContent = 'Cole uma chave sk-or-... para salvar.';
        showToast('Cole uma chave OpenRouter.', true);
        return;
      }
      localStorage.setItem(STORAGE.OPENROUTER_KEY, key);
      localStorage.setItem(STORAGE.OPENROUTER_MODEL, model);
      if (CHAT.iaStatus) CHAT.iaStatus.textContent = 'Config salva com sucesso.';
      showToast('Config OpenRouter salva');
    }

    function clearIaConfig(){
      localStorage.removeItem(STORAGE.OPENROUTER_KEY);
      localStorage.removeItem(STORAGE.OPENROUTER_MODEL);
      if (CHAT.apiKeyInput) CHAT.apiKeyInput.value = '';
      if (CHAT.customModelInput) CHAT.customModelInput.value = '';
      if (CHAT.modelSelect) CHAT.modelSelect.value = 'openai/gpt-oss-120b';
      if (CHAT.iaStatus) CHAT.iaStatus.textContent = 'Config limpa. Defina novamente antes de enviar.';
      showToast('Config IA limpa');
    }

    function loadVoiceConfig(){
      try{
        const raw = localStorage.getItem(STORAGE.VOICE_CONFIG);
        if (!raw) return;
        voiceConfig = JSON.parse(raw);
        const keys = Object.keys(voiceConfig || {});
        if (!keys.length) return;
        const storedKey = localStorage.getItem(STORAGE.VOICE_CURRENT_KEY);
        currentVoiceKey = (storedKey && keys.includes(storedKey)) ? storedKey : (voiceConfig.current && keys.includes(voiceConfig.current) ? voiceConfig.current : (keys.includes('default') ? 'default' : keys[0]));
      }catch(e){
        voiceConfig = null;
      }
    }

    function saveConversationNow(){
      try{
        const snap = { ts: new Date().toISOString(), conversation: conversation.slice(0,100) };
        const key = 'KDX_CONV_' + snap.ts;
        localStorage.setItem(key, JSON.stringify(snap));
        const idx = JSON.parse(localStorage.getItem('KDX_CONV_INDEX') || '[]');
        idx.unshift(key);
        localStorage.setItem('KDX_CONV_INDEX', JSON.stringify(idx.slice(0,50)));
        renderHistoryItems();
        if (CHAT.footerHint) CHAT.footerHint.textContent = 'Conversa salva.';
        showToast('Conversa salva');
        return true;
      }catch(e){
        console.error(e);
        if (CHAT.footerHint) CHAT.footerHint.textContent = 'Erro ao salvar conversa.';
        showToast('Falha ao salvar conversa', true);
        return false;
      }
    }

    function renderHistoryItems(){
      if (!CHAT.historyItems) return;
      CHAT.historyItems.innerHTML = '';
      const idx = JSON.parse(localStorage.getItem('KDX_CONV_INDEX') || '[]');
      if (!idx.length){
        CHAT.historyItems.innerHTML = '<div class="empty-state">Nenhuma conversa salva ainda.</div>';
        return;
      }
      idx.forEach(k=>{
        try{
          const snap = JSON.parse(localStorage.getItem(k));
          if (!snap) return;
          const el = document.createElement('div');
          el.className = 'para-block';
          el.innerHTML = `<div class="row" style="justify-content:space-between">
            <div><strong>${escapeHtml(snap.ts)}</strong><div class="mini-note">${snap.conversation.length} itens</div></div>
            <div class="row">
              <button class="pill-btn" data-load="${escapeHtml(k)}" type="button">Carregar</button>
              <button class="pill-btn" data-delete="${escapeHtml(k)}" type="button">Excluir</button>
            </div>
          </div>`;
          CHAT.historyItems.appendChild(el);
        }catch(e){}
      });
      CHAT.historyItems.querySelectorAll('[data-load]').forEach(btn=>{
        btn.addEventListener('click', (ev)=>{
          const key = ev.currentTarget.dataset.load;
          const snap = JSON.parse(localStorage.getItem(key));
          if (!snap) return;
          conversation = snap.conversation.slice();
          CHAT.responseList.innerHTML = '';
          conversation.slice().reverse().forEach(item=>{
            const d = document.createElement('div');
            d.className = 'response-block middle';
            d.innerHTML = `<div><strong>${escapeHtml(item.role)}</strong><div style="opacity:.9;margin-top:6px">${escapeHtml(item.content || '')}</div></div>`;
            CHAT.responseList.appendChild(d);
          });
          if (CHAT.footerHint) CHAT.footerHint.textContent = 'Conversa carregada do histórico.';
          showToast('Conversa carregada');
        });
      });
      CHAT.historyItems.querySelectorAll('[data-delete]').forEach(btn=>{
        btn.addEventListener('click', (ev)=>{
          const key = ev.currentTarget.dataset.delete;
          localStorage.removeItem(key);
          const idx = JSON.parse(localStorage.getItem('KDX_CONV_INDEX') || '[]').filter(v=>v!==key);
          localStorage.setItem('KDX_CONV_INDEX', JSON.stringify(idx));
          renderHistoryItems();
          showToast('Conversa excluída');
        });
      });
    }

    function maybeAutoSave(){
      if (localStorage.getItem('KDX_AUTOSAVE') === '1'){
        clearTimeout(window.__kdxAutoSaveT);
        window.__kdxAutoSaveT = setTimeout(saveConversationNow, 1200);
      }
    }

    function pushConversation(item){
      conversation.unshift(item);
      maybeAutoSave();
      window.DUAL_STATE.chat.messages = conversation.slice();
    }

    function parseMarkdownBasic(rawText){
      let text = String(rawText || '');
      text = escapeHtml(text);
      text = text.replace(/\r\n/g, '\n');
      text = text.replace(/\*\*\*([^*]+)\*\*\*/g,'<strong><em>$1</em></strong>');
      text = text.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
      text = text.replace(/\*([^*]+)\*/g,'<em>$1</em>');
      text = text.replace(/`([^`]+)`/g,'<code>$1</code>');
      text = text.replace(/^::(info|warn|success|question|aside)\s+(.*)$/gim,'<div class="empty-state">$2</div>');
      text = text.replace(/^### (.*)$/gim,'<h3>$1</h3>');
      text = text.replace(/^## (.*)$/gim,'<h2>$1</h2>');
      text = text.replace(/^# (.*)$/gim,'<h1>$1</h1>');
      text = text.replace(/^> (.*)$/gim,'<blockquote>$1</blockquote>');
      text = text.replace(/^\s*[-*+] (.*)$/gim,'<li>$1</li>');
      text = text.replace(/(<li>.*<\/li>)/gims,'<ul>$1</ul>');
      return text;
    }

    function detectArchetypeFromText(text){
      if (!text) return null;
      const t = text.toLowerCase();
      let best = null;
      let bestScore = 0;
      Object.entries(ARCHETYPE_KEYWORDS).forEach(([name, words])=>{
        let score = 0;
        if (t.includes(name.toLowerCase())) score += 10;
        words.forEach(w=>{ if (t.includes(String(w).toLowerCase())) score++; });
        if (score > bestScore){
          bestScore = score;
          best = name;
        }
      });
      return bestScore > 0 ? best : null;
    }

    function markBlockArchetype(div, archeName){
      if (!div || !archeName) return;
      div.dataset.archetype = archeName;
      let badge = div.querySelector('.archetype-badge');
      if (!badge){
        badge = document.createElement('span');
        badge.className = 'archetype-badge';
        div.appendChild(badge);
      }
      badge.textContent = archeName;
    }

    function getBlockText(block){
      if (!block) return '';
      const clone = block.cloneNode(true);
      clone.querySelectorAll('.block-tts-btn,.archetype-badge').forEach(el=>el.remove());
      return (clone.innerText || clone.textContent || '').trim();
    }

    function resolveBlockArchetypes(block, text){
      const tagArch = (block && block.dataset && block.dataset.archetype) ? String(block.dataset.archetype).trim() : '';
      const textArch = detectArchetypeFromText(text);
      const stack = [tagArch, textArch].filter(Boolean);
      return { detectedArch: stack[0] || null, stack: [...new Set(stack)] };
    }

    function speakBlock(block){
      if (!synth) return;
      if (!block) return;
      const text = getBlockText(block);
      if (!text) return;
      const resolved = resolveBlockArchetypes(block, text);
      if (resolved.stack.length) block.dataset.archetypeStack = resolved.stack.join('|');
      if (resolved.detectedArch){
        currentVoiceKey = resolved.detectedArch;
        localStorage.setItem(STORAGE.VOICE_CURRENT_KEY, currentVoiceKey);
        localStorage.setItem(MOTOR_STORAGE.ARCH_ACTIVE, resolved.detectedArch);
        markBlockArchetype(block, resolved.detectedArch);
      }
      const utter = new SpeechSynthesisUtterance(text);
      let profile = null;
      if (voiceConfig){
        if (currentVoiceKey && voiceConfig[currentVoiceKey]) profile = voiceConfig[currentVoiceKey];
        else if (voiceConfig.default) profile = voiceConfig.default;
      }
      utter.lang = (profile && profile.lang) ? profile.lang : 'pt-BR';
      utter.rate = (profile && typeof profile.rate === 'number') ? profile.rate : 1;
      utter.pitch = (profile && typeof profile.pitch === 'number') ? profile.pitch : 1;
      utter.volume = (profile && typeof profile.volume === 'number') ? profile.volume : 1;
      if (profile && profile.voiceHint && availableVoices.length){
        const hint = String(profile.voiceHint).toLowerCase();
        const chosen = availableVoices.find(v=>v.name.toLowerCase().includes(hint)) || availableVoices.find(v=>v.lang === utter.lang) || null;
        if (chosen) utter.voice = chosen;
      }
      currentUtterance = utter;
      utter.onstart = ()=>{ if (CHAT.footerHint) CHAT.footerHint.textContent = 'Lendo o bloco em voz alta.'; };
      utter.onend = ()=>{ if (CHAT.footerHint) CHAT.footerHint.textContent = 'Leitura concluída.'; };
      utter.onerror = ()=>{ if (CHAT.footerHint) CHAT.footerHint.textContent = 'Erro ao tentar falar.'; };
      synth.cancel();
      synth.speak(utter);
    }

    function addTtsButtonToBlock(div){
      if (!div || div.querySelector('.block-tts-btn')) return;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'block-tts-btn';
      btn.textContent = '◎';
      btn.addEventListener('click', ev=>{
        ev.stopPropagation();
        speakBlock(div);
      });
      div.appendChild(btn);
    }

    function enhanceBlock(div){
      if (!div) return;
      div.addEventListener('click', ()=>{
        const text = getBlockText(div);
        if (text) speakBlock(div);
      });
      addTtsButtonToBlock(div);
      const t = getBlockText(div);
      const arch = detectArchetypeFromText(t);
      if (arch) markBlockArchetype(div, arch);
      if (!responseBlocks.includes(div)) responseBlocks.push(div);
    }

    function splitResponseCinematic(text){
      const parts = String(text || '').split(/\n{2,}/).map(p=>p.trim()).filter(Boolean);
      if (!parts.length) return [{ kind:'middle', html:'<p>'+parseMarkdownBasic(text).replace(/\n/g,'<br>')+'</p>' }];
      return parts.map((p, idx)=>({
        kind: idx===0 ? 'intro' : (idx===parts.length-1 ? 'ending' : 'middle'),
        html: '<p>'+parseMarkdownBasic(p).replace(/\n/g,'<br>')+'</p>'
      }));
    }

    function appendBlocksFromData(blocks){
      if (!blocks || !blocks.length) return;
      if (CHAT.bootBlock){
        CHAT.bootBlock.remove();
        CHAT.bootBlock = null;
      }
      blocks.forEach(page=>{
        const div = document.createElement('div');
        div.className = 'response-block ' + (page.kind || 'middle');
        div.dataset.role = 'assistant';
        div.innerHTML = page.html;
        enhanceBlock(div);
        CHAT.responseList.appendChild(div);
      });
    }

    function appendUserPulseBlock(text){
      if (!text) return;
      if (CHAT.bootBlock){
        CHAT.bootBlock.remove();
        CHAT.bootBlock = null;
      }
      const div = document.createElement('div');
      div.className = 'response-block user-pulse';
      div.dataset.role = 'user';
      div.innerHTML = '<p>' + parseMarkdownBasic(text).replace(/\n/g,'<br>') + '</p>';
      enhanceBlock(div);
      CHAT.responseList.appendChild(div);
    }

    function getSpeakableBlocks(){
      return responseBlocks.filter(b=>b && b.parentNode && !b.classList.contains('user-pulse'));
    }

    async function speakRecentBlocks(count=1){
      if (!responseBlocks.length) return;
      let blocks = getSpeakableBlocks();
      if (isFinite(count)) blocks = blocks.slice(Math.max(0, blocks.length - count));
      for (const b of blocks){
        speakBlock(b);
        await new Promise(r=>setTimeout(r, 120));
      }
    }

    function buildSystemPrompt(){
      const userName = localStorage.getItem(STORAGE.USER_NAME) || 'humano';
      const asstName = localStorage.getItem(STORAGE.ASSISTANT_NAME) || 'Dual.Infodose';
      return [
        `${asstName} é o assistente Cinemático da Infodose, especializado em respostas em blocos.`,
        'Responda em português por padrão.',
        'Use blocos curtos, com títulos, listas e callouts quando fizer sentido.',
        'Cada parágrafo separado por linha vazia vira um bloco independente.',
        'Priorize explicações práticas e micro-ações.',
        `O usuário se chama ${userName}; fale com ele pelo nome algumas vezes, sem exagero.`
      ].join('\n');
    }

    async function callOpenRouter(promptText){
      const token = localStorage.getItem(STORAGE.OPENROUTER_KEY) || '';
      if (!token) throw new Error('Defina a chave OpenRouter no painel de Config IA.');
      const model = localStorage.getItem(STORAGE.OPENROUTER_MODEL) || DEFAULTS.MODEL;
      const userName = localStorage.getItem(STORAGE.USER_NAME) || 'Você';
      const messages = [
        { role:'system', content: buildSystemPrompt() },
        ...conversation,
        { role:'user', content: `${userName} diz: ${promptText}` }
      ];
      const res = await fetch(DEFAULTS.API_URL, {
        method:'POST',
        headers:{
          'Content-Type':'application/json',
          'Authorization':'Bearer ' + token,
          'HTTP-Referer': location.origin,
          'X-Title':'Dual-Infodose Chat Cinemático'
        },
        body: JSON.stringify({ model, temperature: DEFAULTS.TEMP, messages, max_tokens: 1200 })
      });
      if (!res.ok){
        const txt = await res.text().catch(()=> '');
        console.error('Erro IA:', txt);
        throw new Error('Falha na resposta da IA: ' + res.status);
      }
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content || '(sem conteúdo retornado)';
      conversation.push({ role:'user', content: promptText });
      conversation.push({ role:'assistant', content });
      window.DUAL_STATE.chat.messages = conversation.slice();
      return content;
    }

    async function sendPrompt(promptText, options={}){
      const text = String(promptText || '').trim();
      if (!text) return;
      CHAT.chatInput.value = options.fromBlock ? CHAT.chatInput.value : '';
      CHAT.chatInput.disabled = true;
      CHAT.sendBtn.disabled = true;
      if (CHAT.footerHint) CHAT.footerHint.textContent = options.fromBlock ? 'Pulso em expansão a partir do bloco.' : 'Processando pulso.';
      appendUserPulseBlock(text);
      try{
        let answer;
        if (!localStorage.getItem(STORAGE.OPENROUTER_KEY)){
          answer = [
            '::info Modo local ativo (sem OpenRouter).',
            '',
            'Você pode:',
            '- Abrir Config e salvar uma chave OpenRouter;',
            '- Ou usar este espaço como diário simbólico.'
          ].join('\n');
        }else{
          answer = await callOpenRouter(text);
        }
        appendBlocksFromData(splitResponseCinematic(answer));
      }catch(err){
        console.error(err);
        appendBlocksFromData([{ kind:'ending', html:'<p><strong>Ops.</strong> Não foi possível falar com o OpenRouter agora. Verifique sua chave e tente novamente.</p>' }]);
      }finally{
        CHAT.chatInput.disabled = false;
        CHAT.chatInput.focus();
        CHAT.sendBtn.disabled = false;
        if (CHAT.footerHint) CHAT.footerHint.textContent = 'Do seu jeito. Sempre único. Sempre seu.';
      }
    }

    function clearChat(){
      conversation = [];
      window.DUAL_STATE.chat.messages = [];
      CHAT.responseList.innerHTML = '';
      CHAT.bootBlock = document.createElement('div');
      CHAT.bootBlock.className = 'response-block intro';
      CHAT.bootBlock.id = 'bootBlock';
      CHAT.bootBlock.innerHTML = '<strong id="bootText">Iniciando Roda-Viva. Pulso simbiótico detectado. Presença reconhecida.</strong>';
      CHAT.responseList.appendChild(CHAT.bootBlock);
      showToast('Chat limpo');
    }

    function loadHistoryPanel(){
      if (!CHAT.historyItems) return;
      renderHistoryItems();
    }

    function loadParserFile(){
      const file = CHAT.parserFileInput.files && CHAT.parserFileInput.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ()=>{
        const content = reader.result || '';
        const name = file.name.toLowerCase();
        if (name.endsWith('.css')){
          const style = document.createElement('style');
          style.textContent = content;
          document.head.appendChild(style);
          showToast('CSS extra aplicado');
        }else if (name.endsWith('.js')){
          try{
            const fn = new Function('window','document', content);
            fn(window, document);
            showToast('Parser JS carregado');
          }catch(e){
            console.error(e);
            showToast('Erro ao carregar parser JS', true);
          }
        }
      };
      reader.readAsText(file);
    }

    function loadVoiceConfigFile(){
      const file = CHAT.voiceConfigFile.files && CHAT.voiceConfigFile.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ()=>{
        try{
          const json = JSON.parse(reader.result || '{}');
          if (!json || typeof json !== 'object') throw new Error('JSON inválido');
          voiceConfig = json;
          const keys = Object.keys(voiceConfig);
          const current = (voiceConfig.current && keys.includes(voiceConfig.current)) ? voiceConfig.current : (keys.includes('default') ? 'default' : keys[0]);
          currentVoiceKey = current;
          localStorage.setItem(STORAGE.VOICE_CONFIG, JSON.stringify(voiceConfig));
          localStorage.setItem(STORAGE.VOICE_CURRENT_KEY, currentVoiceKey);
          showToast('Config de vozes carregada');
        }catch(e){
          console.error(e);
          showToast('Erro ao carregar JSON de vozes', true);
        }
      };
      reader.readAsText(file);
    }

    function updateVoiceButtonHint(){
      if (!CHAT.voiceConfigBtn) return;
      CHAT.voiceConfigBtn.title = voiceConfig ? 'Voz atual: ' + currentVoiceKey : 'Carregar / alternar vozes de arquétipos';
    }

    function restoreConversationAuto(){
      try{
        const idx = JSON.parse(localStorage.getItem('KDX_CONV_INDEX') || '[]');
        if (idx.length) renderHistoryItems();
      }catch(e){}
    }

    function setCollapsed(state){
      isCollapsed = state;
      if (CHAT.responseList){
        const wrapper = CHAT.responseList.closest('.chat-response');
        if (wrapper){
          wrapper.style.opacity = state ? .98 : 1;
        }
      }
    }

    function syncArchToUi(arch){
      if (!arch) return;
      document.body.setAttribute('data-arch', arch.toLowerCase());
      localStorage.setItem(MOTOR_STORAGE.ARCH_ACTIVE, arch);
      if (ENGINE.archSelect){
        const opt = Array.from(ENGINE.archSelect.options).find(o=>o.value===arch.toLowerCase());
        if (opt) ENGINE.archSelect.value = arch.toLowerCase();
      }
    }

    let di_engineStep = parseInt(localStorage.getItem(MOTOR_STORAGE.ENGINE_STEP) || '0', 10);
    let di_reverse = localStorage.getItem(MOTOR_STORAGE.REVERSE) === 'true';
    let di_jump = parseInt(localStorage.getItem(MOTOR_STORAGE.JUMP) || '0', 10);
    let di_use3697 = localStorage.getItem(MOTOR_STORAGE.CYCLE) === 'true';

    function saveEngineState(){
      localStorage.setItem(MOTOR_STORAGE.ENGINE_STEP, String(di_engineStep));
      localStorage.setItem(MOTOR_STORAGE.REVERSE, String(di_reverse));
      localStorage.setItem(MOTOR_STORAGE.JUMP, String(di_jump));
      localStorage.setItem(MOTOR_STORAGE.CYCLE, String(di_use3697));
    }

    function syncEngineUI(){
      qsa('[data-engine]').forEach(btn=>{
        const val = parseInt(btn.dataset.engine, 10);
        btn.classList.toggle('is-active', val === di_engineStep);
      });
      qsa('[data-jump]').forEach(btn=>{
        const val = parseInt(btn.dataset.jump, 10);
        btn.classList.toggle('is-active', val === di_jump);
      });
      if (ENGINE.reverseToggle) ENGINE.reverseToggle.textContent = `Reverse: ${di_reverse ? 'ON' : 'OFF'}`;
      if (ENGINE.cycle3697) ENGINE.cycle3697.textContent = `3-6-9-7: ${di_use3697 ? 'ON' : 'OFF'}`;
    }

    function di_getSequence(startIndex, length){
      const total = ARCHETYPES.length;
      const sequence = [];
      let currentIndex = ((startIndex % total) + total) % total;
      const pattern = di_use3697 ? [3,6,9,7] : [di_engineStep || 1];
      for(let i=0;i<length;i++){
        sequence.push(ARCHETYPES[currentIndex]);
        let step = pattern[i % pattern.length];
        if (di_reverse) step *= -1;
        step += di_jump;
        currentIndex = (currentIndex + step) % total;
        if (currentIndex < 0) currentIndex += total;
      }
      return sequence;
    }

    function updateStatusWithEngine(){
      if (ENGINE.statusBar && !ENGINE.statusBar.textContent.includes('Opcode')) {
        ENGINE.statusBar.textContent = `Motor ${di_engineStep || 1} · ${di_reverse ? 'Reverse' : 'Forward'} · salto +${di_jump} · ${di_use3697 ? '3-6-9-7' : 'Linear'}`;
      }
    }

    function generateFractals(){
      if (!ENGINE.input || !ENGINE.output || !ENGINE.archSelect || !ENGINE.cycleCheck) return;
      const text = ENGINE.input.value.trim();
      if (!text){
        showToast('Texto de entrada vazio', true);
        return;
      }
      localStorage.setItem(MOTOR_STORAGE.DRAFT, text);
      const sentencesMatch = text.replace(/\n+/g,' ').match(/[^.!?]+[.!?]+|[^.!?]+$/g);
      const sentences = sentencesMatch ? sentencesMatch.map(s=>s.trim()).filter(Boolean) : [];
      if (!sentences.length) return;

      const startArchName = ENGINE.archSelect.value;
      const startIdx = ARCHETYPES.indexOf(startArchName);
      const isCycleMode = ENGINE.cycleCheck.checked;
      const sequence = isCycleMode ? di_getSequence(startIdx, sentences.length) : [ARCHETYPES[startIdx]];

      ENGINE.output.innerHTML = '';
      let resultTextForExport = '';

      sentences.forEach((sentence, i)=>{
        const currentArchName = isCycleMode ? sequence[i] : ARCHETYPES[startIdx];
        const block = document.createElement('div');
        block.className = 'para-block accordion is-open';
        block.style.animationDelay = `${i * 0.1}s`;

        const colorMap = {
          atlas:'#74d6ff', nova:'#ff7dff', vitalis:'#42d392', pulse:'#ffd166', kaos:'#ff6b6b',
          kodux:'#e8f3ff', lumine:'#fff0a8', aion:'#b8a7ff', kobllux:'#8fe3ff', artemis:'#f7b267',
          serena:'#9ae6b4', genus:'#c9d1d9', solus:'#94a3b8', rhea:'#86efac', uno:'#f8fafc',
          dual:'#7dd3fc', trinity:'#f0abfc', infodose:'#c4b5fd', horus:'#fde68a', bllue:'#93c5fd'
        };
        const archColor = colorMap[currentArchName] || '#74d6ff';
        block.style.borderLeft = `4px solid ${archColor}`;
        block.innerHTML = `
          <div class="accordion-header">
            <div class="arch-tag" style="color:${archColor}">
              ${escapeHtml(currentArchName)} · Δ
            </div>
            <div class="indicator">⌄</div>
          </div>
          <div class="collapsible-body">
            <div style="padding:0 0 0 2px">
              <div class="content-inner">${escapeHtml(sentence)}</div>
            </div>
          </div>
        `;
        ENGINE.output.appendChild(block);
        resultTextForExport += `${currentArchName.toUpperCase()} — ${sentence}\n\n`;
      });

      localStorage.setItem(MOTOR_STORAGE.LAST_RESULT, resultTextForExport.trim());
      window.DUAL_STATE.engine.output = resultTextForExport.trim();
      window.DUAL_STATE.engine.input = text;
      window.DUAL_STATE.engine.engineStep = di_engineStep;
      window.DUAL_STATE.engine.reverse = di_reverse;
      window.DUAL_STATE.engine.jump = di_jump;
      window.DUAL_STATE.engine.cycle3697 = di_use3697;
      window.DUAL_STATE.engine.archetype = startArchName;
      if (ENGINE.statusBar) ENGINE.statusBar.textContent = `Opcode 0x0B · Motor ${di_engineStep || 1} · ${sentences.length} Fractal(s) Gerado(s)`;
      if (ENGINE.hudStatus) ENGINE.hudStatus.textContent = `Δ-${sentences.length}`;
      if (ENGINE.mainCard && ENGINE.mainCard.classList.contains('is-open') && typeof window.KobAccordion?.toggle === 'function'){
        // keep open
      }
      showToast(`Fractais gerados: ${sentences.length}`);
    }

    function initAccordion(node){
      if (!node || node.dataset.accordionInit) return;
      node.dataset.accordionInit = 'true';
      const header = node.querySelector('.accordion-header');
      const body = node.querySelector('.collapsible-body');
      if (!header || !body) return;
      if (!header.querySelector('.indicator')){
        const indicator = document.createElement('span');
        indicator.className = 'indicator';
        indicator.textContent = '⌄';
        header.appendChild(indicator);
      }
      if (node.classList.contains('is-collapsed')) body.style.height = '0px';
      header.addEventListener('click', (e)=>{
        if (['input','select','button','textarea'].includes(e.target.tagName.toLowerCase())) return;
        const collapsed = node.classList.contains('is-collapsed');
        if (collapsed){
          node.classList.remove('is-collapsed');
          node.classList.add('is-open');
          body.style.height = body.scrollHeight + 'px';
          body.addEventListener('transitionend', function handler(ev){
            if (ev.propertyName === 'height'){
              body.style.height = 'auto';
              body.removeEventListener('transitionend', handler);
            }
          });
        }else{
          body.style.height = body.scrollHeight + 'px';
          void body.offsetHeight;
          node.classList.remove('is-open');
          node.classList.add('is-collapsed');
          body.style.height = '0px';
        }
      });
    }

    window.KobAccordion = {
      open: (card)=>{ card = typeof card === 'string' ? document.querySelector(card) : card; if (card){ card.classList.remove('is-collapsed'); card.classList.add('is-open'); } },
      close: (card)=>{ card = typeof card === 'string' ? document.querySelector(card) : card; if (card){ card.classList.remove('is-open'); card.classList.add('is-collapsed'); } },
      toggle: (card)=>{ card = typeof card === 'string' ? document.querySelector(card) : card; card && card.querySelector('.accordion-header')?.click(); }
    };

    function initPartials(){
      qsa('.accordion').forEach(initAccordion);
      if (CHAT.bootBlock) enhanceBlock(CHAT.bootBlock);
      if (CHAT.autoSaveToggle) CHAT.autoSaveToggle.checked = localStorage.getItem('KDX_AUTOSAVE') === '1';
    }

    function bindChat(){
      if (CHAT.chatSettingsBtn) CHAT.chatSettingsBtn.addEventListener('click', ()=>CHAT.settingsPanel.classList.add('active'));
      if (CHAT.chatOpenIaBtn) CHAT.chatOpenIaBtn.addEventListener('click', ()=>CHAT.settingsPanel.classList.add('active'));
      if (CHAT.closeSettingsBtn) CHAT.closeSettingsBtn.addEventListener('click', ()=>CHAT.settingsPanel.classList.remove('active'));
      if (CHAT.loginToggleBtn) CHAT.loginToggleBtn.addEventListener('click', ()=>CHAT.loginModal.classList.add('active'));
      if (CHAT.loginCloseBtn) CHAT.loginCloseBtn.addEventListener('click', ()=>CHAT.loginModal.classList.remove('active'));
      if (CHAT.historyBtn) CHAT.historyBtn.addEventListener('click', ()=>{ CHAT.historyPanel.classList.add('active'); renderHistoryItems(); });
      if (CHAT.closeHistoryBtn) CHAT.closeHistoryBtn.addEventListener('click', ()=>CHAT.historyPanel.classList.remove('active'));
      if (CHAT.saveNamesBtn) CHAT.saveNamesBtn.addEventListener('click', ()=>{
        const user = CHAT.userNameInput.value.trim() || 'Você';
        const asst = CHAT.assistantInput.value.trim() || 'Dual.Infodose';
        localStorage.setItem(STORAGE.USER_NAME, user);
        localStorage.setItem(STORAGE.ASSISTANT_NAME, asst);
        if (CHAT.assistantNameEl) CHAT.assistantNameEl.textContent = asst;
        CHAT.loginModal.classList.remove('active');
        conversation.unshift({ role:'system', content:`O usuário se chama ${user}. O assistente se apresenta como ${asst}. Responda com carinho cinematográfico.` });
        window.DUAL_STATE.chat.messages = conversation.slice();
      });
      if (CHAT.saveIaConfigBtn) CHAT.saveIaConfigBtn.addEventListener('click', saveIaConfig);
      if (CHAT.clearIaConfigBtn) CHAT.clearIaConfigBtn.addEventListener('click', clearIaConfig);
      if (CHAT.chatCopyBtn) CHAT.chatCopyBtn.addEventListener('click', async ()=>{
        const blocks = getSpeakableBlocks().length ? getSpeakableBlocks() : responseBlocks;
        if (!blocks.length) return;
        const text = blocks.map(b=>getBlockText(b)).filter(Boolean).join('\n\n──────────\n\n');
        try{
          await navigator.clipboard.writeText(text);
          showToast(`${blocks.length} blocos copiados`);
        }catch{
          showToast('Não consegui copiar automaticamente', true);
        }
      });
      if (CHAT.chatPasteBtn) CHAT.chatPasteBtn.addEventListener('click', async ()=>{
        try{
          const txt = await navigator.clipboard.readText();
          if (txt) CHAT.chatInput.value = txt;
        }catch(e){}
      });
      if (CHAT.chatVoiceBtn) CHAT.chatVoiceBtn.addEventListener('click', ()=>{
        const wantAll = window.event && window.event.shiftKey;
        speakRecentBlocks(wantAll ? Infinity : 1);
      });
      if (CHAT.chatParserBtn) CHAT.chatParserBtn.addEventListener('click', ()=>CHAT.parserFile.click());
      if (CHAT.parserFile) CHAT.parserFile.addEventListener('change', loadParserFile);
      if (CHAT.voiceConfigBtn) CHAT.voiceConfigBtn.addEventListener('click', ()=>{
        if (!voiceConfig){
          CHAT.voiceConfigFile.click();
          return;
        }
        const keys = Object.keys(voiceConfig).filter(k=>k!=='current');
        if (!keys.length) return;
        const idx = keys.indexOf(currentVoiceKey);
        const nextKey = keys[(idx + 1 + keys.length) % keys.length];
        currentVoiceKey = nextKey;
        localStorage.setItem(STORAGE.VOICE_CURRENT_KEY, currentVoiceKey);
        showToast('Voz ativa: ' + currentVoiceKey);
        updateVoiceButtonHint();
      });
      if (CHAT.voiceConfigFile) CHAT.voiceConfigFile.addEventListener('change', loadVoiceConfigFile);
      if (CHAT.sendBtn) CHAT.sendBtn.addEventListener('click', ()=>sendPrompt(CHAT.chatInput.value));
      if (CHAT.chatInput) CHAT.chatInput.addEventListener('keydown', (ev)=>{
        if (ev.key === 'Enter' && !ev.shiftKey){
          ev.preventDefault();
          sendPrompt(CHAT.chatInput.value);
        }
      });
      if (CHAT.saveConversationBtn) CHAT.saveConversationBtn.addEventListener('click', saveConversationNow);
      if (CHAT.chatSaveBtn) CHAT.chatSaveBtn.addEventListener('click', saveConversationNow);
      if (CHAT.chatClearBtn) CHAT.chatClearBtn.addEventListener('click', clearChat);
      if (CHAT.autoSaveToggle) CHAT.autoSaveToggle.addEventListener('change', e=>localStorage.setItem('KDX_AUTOSAVE', e.target.checked ? '1' : '0'));
      if (CHAT.themeSelect) CHAT.themeSelect.addEventListener('change', ()=>applyTheme(CHAT.themeSelect.value || 'dark'));
    }

    function bindEngine(){
      qsa('[data-engine]').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          di_engineStep = parseInt(btn.dataset.engine, 10);
          saveEngineState();
          syncEngineUI();
          updateStatusWithEngine();
          showToast(`Motor +${di_engineStep} ativado`);
        });
      });
      qsa('[data-jump]').forEach(btn=>{
        btn.addEventListener('click', ()=>{
          di_jump = parseInt(btn.dataset.jump, 10);
          saveEngineState();
          syncEngineUI();
          updateStatusWithEngine();
          showToast(`Salto extra +${di_jump}`);
        });
      });
      if (ENGINE.reverseToggle) ENGINE.reverseToggle.addEventListener('click', ()=>{
        di_reverse = !di_reverse;
        saveEngineState();
        syncEngineUI();
        updateStatusWithEngine();
        showToast(`Reverse ${di_reverse ? 'ATIVADO' : 'DESATIVADO'}`);
      });
      if (ENGINE.cycle3697) ENGINE.cycle3697.addEventListener('click', ()=>{
        di_use3697 = !di_use3697;
        saveEngineState();
        syncEngineUI();
        updateStatusWithEngine();
        showToast(`Ciclo 3-6-9-7 ${di_use3697 ? 'ATIVADO' : 'DESATIVADO'}`);
      });
      if (ENGINE.genBtn) ENGINE.genBtn.addEventListener('click', generateFractals);
      if (ENGINE.input) ENGINE.input.addEventListener('keydown', e=>{
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') generateFractals();
        localStorage.setItem(MOTOR_STORAGE.DRAFT, ENGINE.input.value);
      });
      if (ENGINE.copyBtn) ENGINE.copyBtn.addEventListener('click', async ()=>{
        const content = localStorage.getItem(MOTOR_STORAGE.LAST_RESULT);
        if (!content){ showToast('Nenhum fractal para copiar', true); return; }
        try{
          await navigator.clipboard.writeText(content);
          showToast('Fractais copiados');
        }catch(err){
          const ta = document.createElement('textarea');
          ta.value = content;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          ta.remove();
          showToast('Fractais copiados (fallback)');
        }
      });
      if (ENGINE.clearBtn) ENGINE.clearBtn.addEventListener('click', ()=>{
        if (ENGINE.input) ENGINE.input.value = '';
        if (ENGINE.output) ENGINE.output.innerHTML = '<div class="empty-state">Sistema reiniciado. Aguardando novos dados.</div>';
        localStorage.removeItem(MOTOR_STORAGE.LAST_RESULT);
        localStorage.removeItem(MOTOR_STORAGE.DRAFT);
        if (ENGINE.statusBar) ENGINE.statusBar.textContent = 'Sistema em repouso · Matrix Pronta';
        if (ENGINE.hudStatus) ENGINE.hudStatus.textContent = '78K-ID';
        showToast('Memória limpa');
      });
      if (ENGINE.downloadBtn) ENGINE.downloadBtn.addEventListener('click', ()=>{
        const content = localStorage.getItem(MOTOR_STORAGE.LAST_RESULT);
        if (!content){ showToast('Nenhum fractal para transferir', true); return; }
        const blob = new Blob([content], { type:'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `KOBLLUX_Fractais_${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        showToast('Transferência concluída');
      });
      if (ENGINE.archSelect) ENGINE.archSelect.addEventListener('change', e=>{
        document.body.setAttribute('data-arch', e.target.value);
        localStorage.setItem(MOTOR_STORAGE.ARCH_ACTIVE, e.target.value);
      });
    }

    function initSpeech(){
      if (!synth) return;
      const loadVoices = ()=>{
        try{ availableVoices = synth.getVoices() || []; }catch(e){ availableVoices = []; }
      };
      loadVoices();
      synth.onvoiceschanged = loadVoices;
    }

    function initStateBridge(){
      window.DUAL_STATE = {
        chat: { messages: conversation, config: { model: localStorage.getItem(STORAGE.OPENROUTER_MODEL) || DEFAULTS.MODEL, theme: localStorage.getItem(STORAGE.THEME) || 'dark' }, voice: { config: null, currentKey: null } },
        engine: { input: '', output: '', engineStep: di_engineStep, jump: di_jump, reverse: di_reverse, cycle3697: di_use3697, archetype: localStorage.getItem(MOTOR_STORAGE.ARCH_ACTIVE) || 'kodux' }
      };
    }

    function restoreMotorDraft(){
      if (ENGINE.input){
        const savedInput = localStorage.getItem(MOTOR_STORAGE.DRAFT);
        if (savedInput) ENGINE.input.value = savedInput;
      }
      const arch = localStorage.getItem(MOTOR_STORAGE.ARCH_ACTIVE);
      if (arch){
        const opt = Array.from(ENGINE.archSelect.options).find(o=>o.value === arch);
        if (opt) ENGINE.archSelect.value = arch;
      }
      if (localStorage.getItem(MOTOR_STORAGE.REVERSE) === 'true') di_reverse = true;
      if (localStorage.getItem(MOTOR_STORAGE.CYCLE) === 'true') di_use3697 = true;
      if (localStorage.getItem(MOTOR_STORAGE.JUMP)) di_jump = parseInt(localStorage.getItem(MOTOR_STORAGE.JUMP) || '0', 10);
      if (localStorage.getItem(MOTOR_STORAGE.ENGINE_STEP)) di_engineStep = parseInt(localStorage.getItem(MOTOR_STORAGE.ENGINE_STEP) || '1', 10);
      syncEngineUI();
      updateStatusWithEngine();
    }

    function init(){
      if (initialized) return;
      initialized = true;

      restoreTheme();
      loadNames();
      restoreIaConfig();
      loadVoiceConfig();
      updateVoiceButtonHint();
      restoreMotorDraft();
      initSpeech();
      initPartials();
      bindChat();
      bindEngine();
      initStateBridge();
      restoreConversationAuto();

      const bootMsg = document.getElementById('bootText');
      const randomArch = ARCHETYPES[Math.floor(Math.random() * ARCHETYPES.length)] || 'kodux';
      localStorage.setItem(MOTOR_STORAGE.ARCH_ACTIVE, randomArch);
      if (bootMsg){
        const msg = `[${randomArch.toUpperCase()}] Roda-Viva ativada.\nHoje quem abre o portal é ${randomArch}.\nIniciando. Pulso simbiótico detectado. Presença reconhecida.`;
        bootMsg.textContent = msg;
        markBlockArchetype(CHAT.bootBlock, randomArch);
      }
      if (CHAT.bootBlock) enhanceBlock(CHAT.bootBlock);
      syncArchToUi(randomArch);
      if (window.speechSynthesis && CHAT.bootBlock){
        setTimeout(()=>{ try{ speakBlock(CHAT.bootBlock); }catch(e){} }, 500);
      }
      console.log('Dual unificado inicializado.');
    }

    document.addEventListener('click', (e)=>{
      if (CHAT.loginModal && CHAT.loginModal.classList.contains('active') && e.target === CHAT.loginModal) CHAT.loginModal.classList.remove('active');
      if (CHAT.settingsPanel && CHAT.settingsPanel.classList.contains('active') && e.target === CHAT.settingsPanel) CHAT.settingsPanel.classList.remove('active');
      if (CHAT.historyPanel && CHAT.historyPanel.classList.contains('active') && e.target === CHAT.historyPanel) CHAT.historyPanel.classList.remove('active');
    });

    window.addEventListener('DOMContentLoaded', init);

    window.addEventListener('beforeunload', ()=>{
      if (ENGINE.input) localStorage.setItem(MOTOR_STORAGE.DRAFT, ENGINE.input.value);
      window.DUAL_STATE.chat.messages = conversation.slice();
    });
  })();