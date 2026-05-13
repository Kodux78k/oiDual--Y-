
/* ================= KDX — Kael DomnnuS Script ================= */
/* Instruções: Cole este bloco no final do body (antes de </body>) */

(function(){
  // ------- config / estado -------
  const SNAP = { duration: 0.8, threshold: 0.3 }; // padrão
  const SPLASH_MS = 780; // 0.5s
  const DAWN_DELAY = 60; // 30ms ~ 1% de 3s; usamos 60ms para suavizar
  let currentMode = 'you'; // 'you' | 'assistant'
  let orbActive = false;
  let mediaRecorder = null;
  let recordedChunks = [];
  let speechRec = null;
  const splash = document.getElementById('kdx-splash');
  const modeToggle = document.getElementById('kdx-mode-toggle');
  const modeLabel = document.getElementById('kdx-mode-label');
  const modeIcon  = document.getElementById('kdx-mode-icon');
  const orb = document.getElementById('kdx-orb');

  // Utility: gentle delay start for animations to avoid popping
  function startAppIntro(){
    // hide splash after SPLASH_MS, then activate dawn
    setTimeout(()=>{
      if (splash) splash.style.display = 'none';
      // slight delay then add dawn class to body
      setTimeout(()=> document.body.classList.add('kdx-dawn-active'), DAWN_DELAY);
      // rise effect for header/greeting elements if present
      document.querySelectorAll('.kdx-greet, .kdx-hero, .kdx-welcome').forEach(el=>el.classList.add('kdx-rise'));
    }, SPLASH_MS);
  }

  // Mode toggle
  function setMode(mode){
    currentMode = mode;
    if (mode === 'assistant'){
      modeLabel.textContent = 'Oi.Dual!';
      modeIcon.textContent  = '◎';
      orb.classList.remove('kdx-hidden');
      orb.setAttribute('data-mode','assistant');
    } else {
      modeLabel.textContent = '◉';
      modeIcon.textContent  = '💊';
      orb.classList.add('kdx-hidden');
      orb.setAttribute('data-mode','you');
    }
    modeToggle.setAttribute('aria-pressed', mode === 'assistant');
  }

  modeToggle.addEventListener('click', ()=>{
    setMode(currentMode === 'you' ? 'assistant' : 'you');
  });

  // ORB — press and hold to capture (supports touch + mouse)
  let orbTimeout = null;
  function startCapture(){
    orbActive = true;
    orb.classList.add('active');
    recordedChunks = [];
    // Try MediaRecorder (getUserMedia) first
    if (!mediaRecorder){
      navigator.mediaDevices && navigator.mediaDevices.getUserMedia
        ? navigator.mediaDevices.getUserMedia({ audio: true }).then(stream=>{
            try{
              mediaRecorder = new MediaRecorder(stream);
              mediaRecorder.ondataavailable = (e)=>{ if(e.data && e.data.size) recordedChunks.push(e.data); };
              mediaRecorder.onstop = ()=> {
                const blob = new Blob(recordedChunks, { type:'audio/webm' });
                handleCapturedAudio(blob);
              };
              mediaRecorder.start();
            }catch(err){ startSpeechRecognitionFallback(); }
          }).catch(()=> startSpeechRecognitionFallback())
        : startSpeechRecognitionFallback();
    } else {
      try{ mediaRecorder.start(); }catch(e){ startSpeechRecognitionFallback(); }
    }
  }

  function startSpeechRecognitionFallback(){
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Nenhuma API de gravação disponível');
      return;
    }
    speechRec = new SpeechRecognition();
    speechRec.lang = 'pt-BR';
    speechRec.interimResults = false;
    speechRec.onresult = (ev)=> {
      const text = Array.from(ev.results).map(r=>r[0].transcript).join('');
      handleCapturedText(text);
    };
    speechRec.onerror = ()=>{};
    speechRec.start();
  }

  function stopCapture(){
    orbActive = false;
    orb.classList.remove('active');
    if (mediaRecorder && mediaRecorder.state !== 'inactive'){
      try { mediaRecorder.stop(); } catch(e){}
    }
    if (speechRec){ try { speechRec.stop(); } catch(e){} }
  }

  function handleCapturedAudio(blob){
    // envia blob para o endpoint de ASR ou processa localmente
    // Exemplo: cria URL e dispara callback (substitua pelo seu pipeline)
    const url = URL.createObjectURL(blob);
    console.log('audio captured (blob url):', url);
    footerHint && (footerHint.textContent = 'Áudio capturado, processando...');
    // aqui você chamaria seu ASR / upload; exemplo simples:
    // uploadAudio(blob).then(...);
  }

  function handleCapturedText(text){
    console.log('captured text:', text);
    footerHint && (footerHint.textContent = 'Texto capturado: ' + text.slice(0,40));
    // processa comando / insere na conversa etc.
  }

  // orb pointer handlers (touch + mouse)
  function orbPointerDown(ev){
    ev.preventDefault();
    // micro-action: 10ms debounce before accepting as real capture
    orbTimeout = setTimeout(()=> startCapture(), 10);
  }
  function orbPointerUp(ev){
    ev.preventDefault();
    clearTimeout(orbTimeout);
    // if already started, stop
    if (orbActive) stopCapture();
  }

  // attach events
  orb.addEventListener('mousedown', orbPointerDown);
  orb.addEventListener('mouseup',   orbPointerUp);
  orb.addEventListener('mouseleave', orbPointerUp);
  orb.addEventListener('touchstart', orbPointerDown, {passive:false});
  orb.addEventListener('touchend',   orbPointerUp);

  // Timeline snap utils
  function applySnapConfig(duration, threshold){
    SNAP.duration = duration;
    SNAP.threshold = threshold;
    // se existir componente timeline, propague:
    window.TIMELINE_SNAP = SNAP; // convenção simples
    console.log('snap config applied', SNAP);
  }
  // aplica defaults do spec
  applySnapConfig(0.8, 0.3);

  // TTS ↔ Arquétipo hook (integra com sua função speakBlock)
  // Assumimos que existe:
  // - function detectArchetypeFromText(text) -> string
  // - window.KOBLLUX_VOICES { key: { voice: 'Voice Name', name } }
  // - speakBlock(block, {voiceName})
  window.__kdx_apply_voice_for_archetype = function(archetypeKey){
    const mapping = (window.KOBLLUX_VOICES && window.KOBLLUX_VOICES[archetypeKey]) || null;
    if (mapping && mapping.voice){
      // garante que speakBlock use este voice (implementação depende do seu speakBlock)
      // Exemplo: define currentVoiceKey para o handler existente
      window.currentVoiceKey = archetypeKey;
      window.currentVoiceName = mapping.voice;
      localStorage.setItem('ARCHETYPE_ACTIVE', archetypeKey);
      console.log('Voz aplicada para arquétipo', archetypeKey, mapping.voice);
      return mapping.voice;
    }
    return null;
  };

  // Start
  document.addEventListener('DOMContentLoaded', ()=>{
    startAppIntro();
    // inicializa estado de modo guardado
    const savedMode = localStorage.getItem('KDX_MODE');
    if (savedMode) setMode(savedMode);
    setMode('you'); // default
  });

  // persist mode
  modeToggle.addEventListener('click', ()=> localStorage.setItem('KDX_MODE', currentMode));

  // Expose small API para uso manual no console / outras partes
  window.KDX = {
    setMode, applySnapConfig, startCapture, stopCapture, setArchetypeVoice: window.__kdx_apply_voice_for_archetype
  };

  // ===== Registro Vivo Δ7 (metadata) =====
  // Hash simbólico: #OV2-KAEL-3697
  // Estado: Pronto para validação prática
  // Ciclo: DETECTAR → INTEGRAR → EXPANDIR → SELAR → ATIVAR Δ
})();
