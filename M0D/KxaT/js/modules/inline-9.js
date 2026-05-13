
// KDX.DevPanel · Botão DEV + injeção de SVG em botões de copiar configuração
(function(){
  const ID = 'kdxDevMiniToggle';
  const MAX_TRIES = 12;
  const INTERVAL_MS = 500;

  // SVGs embutidos
  const SVG_GEAR = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"
         xmlns="http://www.w3.org/2000/svg">
      <path d="M12 15.5A3.5 3.5 0 1112 8.5a3.5 3.5 0 010 7z" fill="currentColor"/>
      <path d="M19.4 13.1a7.9 7.9 0 000-2.2l2.1-1.6a.5.5 0 00.12-.64l-2-3.46a.5.5 0 00-.6-.22l-2.5 1a8 8 0 00-1.9-1.1l-.38-2.65a.5.5 0 00-.5-.42h-4a.5.5 0 00-.5.42l-.38 2.66a8 8 0 00-1.9 1.1l-2.5-1a.5.5 0 00-.6.22l-2 3.46a.5.5 0 00.12.64L4.6 10.9a7.9 7.9 0 000 2.2L2.5 14.7a.5.5 0 00-.12.64l2 3.46c.13.23.4.33.63.23l2.5-1a8 8 0 001.9 1.1l.38 2.66c.05.25.26.42.5.42h4c.24 0 .45-.17.5-.42l.38-2.66a8 8 0 001.9-1.1l2.5 1c.23.1.5 0 .63-.23l2-3.46a.5.5 0 00-.12-.64l-2.1-1.6z" fill="currentColor" opacity="0.85"/>
    </svg>
  `;

  const SVG_CLIP = `
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"
         xmlns="http://www.w3.org/2000/svg">
      <path d="M16 2H8a2 2 0 00-2 2v1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="6" y="6" width="12" height="14" rx="2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 10h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
    </svg>
  `;

  // injeta SVG em um botão (mantém label se houver)
  function injectSvgIntoButton(btn, svgHtml, opts = {}){
    if (!btn || !(btn instanceof HTMLElement)) return;
    // evita duplicar se já tiver
    if (btn.dataset.kdxSvgInjected === '1') return;
    const wrapper = document.createElement('span');
    wrapper.className = 'kdx-svg-wrap';
    wrapper.style.display = 'inline-flex';
    wrapper.style.alignItems = 'center';
    wrapper.style.gap = '6px';
    wrapper.style.pointerEvents = 'none'; // icon não captura cliques
    wrapper.innerHTML = svgHtml;
    // opcional: posicionar antes do texto ou substituir conteúdo
    if (opts.beforeText === false){
      // append after
      btn.appendChild(wrapper);
    } else {
      // prepend (default)
      btn.insertBefore(wrapper, btn.firstChild);
    }
    btn.dataset.kdxSvgInjected = '1';
    // ajuste estético: reduzir texto padding-left se houver
    btn.style.display = btn.style.display || 'inline-flex';
    btn.style.alignItems = 'center';
    btn.style.gap = btn.style.gap || '6px';
  }

  // Seletor para detectar botões de copiar configuração
  const COPY_SELECTORS = [
    '.kdxCopyBtn',
    '[data-kdx-copy]',
    '.btn-copy-config',
    '.kdxCopyConfig',
    '[data-copy-config]'
  ].join(',');

  // cria botão DEV (com ícone gear)
  function createButton(panel){
    if (!panel) return null;
    if (document.getElementById(ID)) return document.getElementById(ID);

    const anchor =
      document.getElementById('assistantName') ||
      document.getElementById('logoContainer') ||
      document.getElementById('kdxDevHeader') ||
      document.body;

    const btn = document.createElement('button');
    btn.id = ID;
    btn.type = 'button';
    btn.title = 'Abrir painel DEV';
    btn.setAttribute('aria-label','KDX Dev Toggle');
    // adicionar texto visível para acessibilidade e tela pequena
    const txt = document.createElement('span');
    txt.textContent = 'DEV';
    txt.style.fontSize = '11px';
    txt.style.fontWeight = '600';
    txt.style.pointerEvents = 'none';

    Object.assign(btn.style, {
      fontSize: '4px',
      padding: '6px 10px',
      borderRadius: '999px',
      border: '1px solid rgba(0,245,255,.6)',
      background: 'linear-gradient(180deg, rgba(2,5,14,.98), rgba(6,10,22,.94))',
      color: '#00f5ff',
      marginLeft: '8px',
      cursor: 'pointer',
      opacity: '0.18',
      transition: 'opacity .12s ease, transform .09s ease',
      zIndex: 0,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px'
    });

    // insert icon then text (prepend icon)
    btn.innerHTML = ''; // garantir vazio antes de injetar
    injectSvgIntoButton(btn, SVG_GEAR, { beforeText: true });
    btn.appendChild(txt);

    btn.addEventListener('mouseenter', ()=> btn.style.opacity = '1');
    btn.addEventListener('mouseleave', ()=> btn.style.opacity = '0.88');
    btn.addEventListener('mousedown', ()=> btn.style.transform = 'translateY(1px)');
    btn.addEventListener('mouseup', ()=> btn.style.transform = '');

    btn.addEventListener('click', ()=>{
      panel.classList.toggle('open');
      if (panel.classList.contains('open')) try{ panel.focus(); }catch(e){}
    });

    if (anchor !== document.body && anchor.parentNode){
      try{
        anchor.parentNode.insertBefore(btn, anchor.nextSibling);
      }catch(e){
        pinToCorner(btn);
      }
    } else {
      pinToCorner(btn);
    }

    console.info('[KDX] Botão DEV anexado com SVG.');
    return btn;
  }

  function pinToCorner(btn){
    btn.style.position = 'fixed';
    btn.style.top = '12px';
    btn.style.right = '12px';
    btn.style.boxShadow = '0 6px 18px rgba(0,0,0,.45)';
    document.body.appendChild(btn);
  }

  // injeta SVG clipboard em botões de copiar config já existentes
  function injectClipboardToExisting(){
    try{
      const nodes = Array.from(document.querySelectorAll(COPY_SELECTORS));
      nodes.forEach(btn=>{
        injectSvgIntoButton(btn, SVG_CLIP, { beforeText: true });
      });
      if (nodes.length) appendLog && appendLog('system', `SVG clipboard injetado em ${nodes.length} botões.`);
    }catch(e){
      console.warn('[KDX] Erro ao injetar clipboard SVG:', e);
    }
  }

  // observa DOM para novos botões de copy dinamicamente adicionados
  function observeForCopyButtons(){
    if (!('MutationObserver' in window)) return;
    const obs = new MutationObserver((mrs)=>{
      for (const m of mrs){
        for (const node of m.addedNodes){
          if (!(node instanceof HTMLElement)) continue;
          // se o nó em si for botão de copy
          if (node.matches && node.matches(COPY_SELECTORS)){
            injectSvgIntoButton(node, SVG_CLIP, { beforeText: true });
          }
          // ou se tiver descendentes que batam no seletor
          const found = node.querySelector && node.querySelector(COPY_SELECTORS);
          if (found) injectSvgIntoButton(found, SVG_CLIP, { beforeText: true });
        }
      }
    });
    obs.observe(document.documentElement || document.body, { childList: true, subtree: true });
    return obs;
  }

  // attachDevToggle orchestration (immediate, retries, observer)
  function attachDevToggle(){
    const panel = document.getElementById('kdxDevPanel');
    if (!panel) {
      console.warn('[KDX] DevPanel ainda não existe — attachDevToggle falhou (chamada direta).');
      return null;
    }
    // create button
    createButton(panel);
    // inject clipboard svg in existing copy buttons
    injectClipboardToExisting();
    // start observing copy buttons
    observeForCopyButtons();
    return true;
  }

  // retry and observer logic
  let tries = 0;
  let intervalId = null;
  let domObserver = null;

  function startRetry(){
    if (intervalId) return;
    intervalId = setInterval(()=>{
      tries++;
      const panel = document.getElementById('kdxDevPanel');
      if (panel){
        attachDevToggle();
        clearInterval(intervalId);
        intervalId = null;
        if (domObserver){ domObserver.disconnect(); domObserver = null; }
        return;
      }
      if (tries >= MAX_TRIES){
        clearInterval(intervalId);
        intervalId = null;
        console.warn('[KDX] DevPanel não encontrado após retries. Parando tentativas.');
      }
    }, INTERVAL_MS);
  }

  function startDomObserver(){
    if (domObserver) return;
    try{
      domObserver = new MutationObserver((mrs)=>{
        for (const m of mrs){
          for (const n of m.addedNodes){
            if (!(n instanceof HTMLElement)) continue;
            if (n.id === 'kdxDevPanel' || n.querySelector && n.querySelector('#kdxDevPanel')){
              attachDevToggle();
              if (intervalId){ clearInterval(intervalId); intervalId = null; }
              if (domObserver){ domObserver.disconnect(); domObserver = null; }
              return;
            }
          }
        }
      });
      domObserver.observe(document.documentElement || document.body, { childList:true, subtree:true });
    }catch(e){
      console.warn('[KDX] MutationObserver indisponível — relying on retry only.', e);
    }
  }

  // bootstrap
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=>{
      if (!attachDevToggle()){
        startRetry();
        startDomObserver();
      }
    });
  } else {
    if (!attachDevToggle()){
      startRetry();
      startDomObserver();
    }
  }

  // exposed helper (opcional) para injetar em elementos específicos manualmente
  window.KDX = window.KDX || {};
  window.KDX.injectCopyIcon = function(el){
    try{
      const node = (typeof el === 'string') ? document.querySelector(el) : el;
      if (!node) return false;
      injectSvgIntoButton(node, SVG_CLIP, { beforeText: true });
      return true;
    }catch(e){
      return false;
    }
  };

})();
