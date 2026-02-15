// === Mood + Frases dinâmicas ===
    const timeNowEl   = document.getElementById('timeNow');
    const moodLabelEl = document.getElementById('moodLabel');
    const greetingEl  = document.getElementById('heroGreeting');
    const subtitleEl  = document.getElementById('heroSubtitle');
    const rangeEl     = document.getElementById('timeRange');
    const fillEl      = document.getElementById('rangeFill');

    const MOOD_LABELS = {
      manha: [
        'Manhã focada',
        'Primeiro passo, sem pressa',
        'Amanhecer organizado'
      ],
      tarde: [
        'Tarde produtiva',
        'Metade do dia, seguimos',
        'Checkpoint do foco'
      ],
      noite: [
        'Noite tranquila',
        'Desacelera sem travar',
        'Encerrando com 1%'
      ]
    };

    const SUBTITLES = {
      manha: [
        'Sua dose de hoje já está organizada',
        'Começa leve, mas consistente',
        'Um ajuste agora salva seu dia inteiro'
      ],
      tarde: [
        'Seguimos juntos pela metade do dia.',
        'Respira, ajusta dois blocos e continua.',
        'Ainda dá tempo de mudar o roteiro de hoje.'
      ],
      noite: [
        'Desacelera, mas mantém o seu 1%.',
        'Fecha o dia com intenção, não com culpa.',
        'Pouco com intenção vale mais que muito na pressa.'
      ]
    };

    function pick(arr){
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function getMoodFromHour(h){
      if(h >= 5 && h < 12) return 'manha';
      if(h >= 12 && h < 18) return 'tarde';
      return 'noite';
    }

    function applyMood(mood){
      document.body.dataset.mood = mood;
      if(MOOD_LABELS[mood]){
        moodLabelEl.textContent = pick(MOOD_LABELS[mood]);
      }
      if(mood === 'manha'){
        greetingEl.textContent = 'Bom dia, Dual';
      } else if(mood === 'tarde'){
        greetingEl.textContent = 'Boa tarde, Dual';
      } else {
        greetingEl.textContent = 'Boa noite, Dual';
      }
      if(SUBTITLES[mood]){
        subtitleEl.textContent = pick(SUBTITLES[mood]);
      }
    }

    function updateFromHour(h, {syncSlider = false} = {}){
      const clamped = Math.min(23, Math.max(6, h));
      const span = (clamped - 6) / (23 - 6);
      const safeSpan = 0.04 + span * 0.96;
      if(fillEl){
        fillEl.style.transform = `scaleX(${safeSpan})`;
      }
      if(syncSlider && rangeEl){
        rangeEl.value = clamped;
      }
      applyMood(getMoodFromHour(clamped));
    }

    function updateClock(){
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      if(timeNowEl){
        timeNowEl.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      }
      updateFromHour(h);
    }

    // === Apps/Docs Play Store ===
    const DOCS_HIDDEN_KEY = 'dual_docs_hidden_v1';

    const BASE_DOCS = [
      {
        id: 'dual-editor',
        titulo: '✏️ Dual Editor',
        tag: 'Criação',
        grupo: 'trabalho',
        url: 'https://example.com/dual-editor'
      },
      {
        id: 'chat-ia',
        titulo: '💬 Chat IA Local',
        tag: 'Chat',
        grupo: 'trabalho',
        url: 'https://example.com/chat'
      },
      {
        id: 'livro-vivo',
        titulo: '📖 Livro Vivo',
        tag: 'Estudo',
        grupo: 'estudo',
        url: 'https://example.com/livro'
      },
      {
        id: 'pessoal-notas',
        titulo: '📝 Notas Pessoais',
        tag: 'Pessoal',
        grupo: 'pessoal',
        url: 'https://example.com/notas'
      }
    ];

    function loadHiddenDocs(){
      try{
        const raw = localStorage.getItem(DOCS_HIDDEN_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch(e){
        return [];
      }
    }

    function saveHiddenDocs(list){
      try{
        localStorage.setItem(DOCS_HIDDEN_KEY, JSON.stringify(list));
      } catch(e){}
    }

    function renderDocs(filter){
      const container = document.getElementById('docsList');
      if(!container) return;
      container.innerHTML = '';
      const hidden = new Set(loadHiddenDocs());
      BASE_DOCS.forEach(doc => {
        if(hidden.has(doc.id)) return;
        if(filter && filter !== 'todos' && doc.grupo !== filter) return;

        const item = document.createElement('div');
        item.className = 'doc-item';
        item.dataset.id = doc.id;
        item.dataset.url = doc.url;

        const top = document.createElement('div');
        top.className = 'doc-top';

        const left = document.createElement('div');
        const title = document.createElement('div');
        title.className = 'doc-title';
        title.textContent = doc.titulo;
        const tag = document.createElement('div');
        tag.className = 'doc-tag';
        tag.textContent = doc.tag;

        left.appendChild(title);
        left.appendChild(tag);

        const group = document.createElement('div');
        group.className = 'doc-tag';
        group.textContent = doc.grupo;

        top.appendChild(left);
        top.appendChild(group);

        const actions = document.createElement('div');
        actions.className = 'doc-actions';

        const btnInside = document.createElement('button');
        btnInside.className = 'doc-btn primary';
        btnInside.textContent = 'Abrir aqui';
        btnInside.addEventListener('click', () => {
          openInViewer(doc.titulo, doc.url);
        });

        const btnOutside = document.createElement('button');
        btnOutside.className = 'doc-btn';
        btnOutside.textContent = 'Abrir fora';
        btnOutside.addEventListener('click', () => {
          if(doc.url && doc.url !== '#'){
            window.open(doc.url, '_blank');
          }
        });

        const btnHide = document.createElement('button');
        btnHide.className = 'doc-btn danger';
        btnHide.textContent = 'Ocultar';
        btnHide.addEventListener('click', () => {
          const current = loadHiddenDocs();
          if(!current.includes(doc.id)){
            current.push(doc.id);
            saveHiddenDocs(current);
          }
          item.remove();
        });

        actions.appendChild(btnInside);
        actions.appendChild(btnOutside);
        actions.appendChild(btnHide);

        item.appendChild(top);
        item.appendChild(actions);
        container.appendChild(item);
      });
    }

    // === Viewer destacável ===
    const viewerCard  = document.getElementById('appViewer');
    const viewerTitle = document.getElementById('viewerTitle');
    const viewerFrame = document.getElementById('viewerFrame');
    const viewerOpenOutsideBtn = document.getElementById('viewerOpenOutside');
    const viewerCloseBtn       = document.getElementById('viewerClose');

    let lastViewerUrl = null;

    function openInViewer(title, url){
      if(!viewerCard) return;
      viewerTitle.textContent = title || 'App';
      lastViewerUrl = url || null;
      if(viewerFrame){
        viewerFrame.src = url || 'about:blank';
      }
      viewerCard.hidden = false;
      viewerCard.scrollIntoView({behavior:'smooth', block:'center'});
    }

    if(viewerOpenOutsideBtn){
      viewerOpenOutsideBtn.addEventListener('click', () => {
        if(lastViewerUrl && lastViewerUrl !== '#'){
          window.open(lastViewerUrl, '_blank');
        }
      });
    }

    if(viewerCloseBtn){
      viewerCloseBtn.addEventListener('click', () => {
        viewerCard.hidden = true;
        if(viewerFrame){
          viewerFrame.src = 'about:blank';
        }
      });
    }

    // === INIT ===
    document.addEventListener('DOMContentLoaded', () => {
      // slider ↔ mood
      if(rangeEl){
        rangeEl.addEventListener('input', e => {
          const v = parseInt(e.target.value, 10) || 9;
          updateFromHour(v);
        });
      }

      // menu principal: abre/fecha stack alvo sem fechar os outros
      document.querySelectorAll('.menu-item').forEach(btn => {
        btn.addEventListener('click', () => {
          const target = btn.dataset.target;
          if(!target) return;
          const stack = document.getElementById(`stack-${target}`);
          if(!stack) return;
          stack.open = !stack.open;
          if(stack.open){
            stack.scrollIntoView({behavior:'smooth', block:'start'});
          }
        });
      });

      // filtros de docs/apps
      document.querySelectorAll('.docs-filter-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          document.querySelectorAll('.docs-filter-pill').forEach(p => p.classList.remove('active'));
          pill.classList.add('active');
          const filter = pill.dataset.filter || 'todos';
          renderDocs(filter);
        });
      });

      const now = new Date();
      const start = Math.min(23, Math.max(6, now.getHours()));
      updateFromHour(start, {syncSlider:true});
      updateClock();
      setInterval(updateClock, 60 * 1000);

      // inicial docs
      renderDocs('todos');
    });
