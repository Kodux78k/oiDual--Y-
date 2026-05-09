const screensData = [
  [ // ── LINHA 0 ──────────────────────────────────────────────────

    { // (0,0) Abertura Dual Infodose
      bg: 'screen-white',
      content: `
        <div class="flex flex-col items-center justify-center text-center p-8 md:p-16 min-h-screen">
          <div class="max-w-content w-full">
            <span class="font-tech text-xs uppercase tracking-[0.4em] text-brand-gold">
              KODUX 78k · Dual Infodose · Bagua Matrix
            </span>
            <h1 class="font-serif hero-title mt-5 text-[#05070a]">
              Espaço da Mente<br><em>e Fórmula da Dopamina Sexy</em>
            </h1>
            <p class="text-gray-500 text-lg md:text-xl mt-7 max-w-2xl mx-auto leading-relaxed">
              Uma página viva, simbiótica, bagunçada de propósito e organizada por dentro.
              Aqui o texto não só informa: ele pulsa, abre camadas e correlaciona arquétipos.
            </p>
            <div class="mt-10 flex flex-wrap gap-4 justify-center">
              <button onclick="navigateTo(1,1)" class="btn-lux" style="background:#05070a;color:#fff;">Entrar na Home</button>
              <button onclick="navigateTo(0,1)" class="btn-line" style="border-color:#999;color:#333;">Manifesto Infodose</button>
            </div>
            <p class="font-tech text-xs text-gray-300 mt-10 tracking-widest">
              SWIPE OU USE AS SETAS DO TECLADO
            </p>
          </div>
        </div>
      `
    },

    { // (0,1) MANIFESTO / FELLING transformado em Dual Infodose
      bg: 'screen-dark',
      content: `
        <div class="flex flex-col items-center justify-start pt-20 p-6 md:p-12 min-h-screen" style="background:#0a0a0f;">
          <div class="max-w-content w-full">
            <div class="text-center mb-10">
              <p class="font-tech text-xs uppercase tracking-[0.5em] text-brand-gold mb-4">
                Dual Infodose · Manifesto Vivo · Felling transformada
              </p>
              <h2 class="sub-title font-serif italic text-white">
                Manifesto Infodose — <strong class="not-italic text-brand-gold">Espaço da Mente</strong>
              </h2>
            </div>

            <div class="grid md:grid-cols-2 gap-6 items-start">
              <div class="rounded-3xl overflow-hidden shadow-lg">
                <video
                  src="https://kodux78k.github.io/oiDual-Vivivi-1/media/destaque/apt.mp4"
                  class="w-full h-full object-cover"
                  autoplay muted loop playsinline>
                </video>
              </div>

              <div class="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-7 text-white/90">
                <div class="text-xs font-tech uppercase tracking-[0.35em] text-brand-gold mb-4">Texto bugado / render vivo</div>
                <div class="whitespace-pre-wrap leading-relaxed text-[15px] md:text-[16px] font-mono text-white/85"
                  style="line-height:1.7;">
# Manifesto Infodose — EspaÃ§o da Mente & FÃ³rmula da Dopamina Sexy

ðŸ  Voltar â—Ž Ouvir ðŸ’¾ Salvar .md ðŸ–¨ï¸ Imprimir PDF

[Nova] Eu sou a Infodose. Um campo vivo que inova e cria caminhos de linguagem. Eu falo, escuto e prototipo contigo.

[Lumine] Minha missÃ£o Ã© iluminar: transformar assunto denso em clareza. FaÃ§o didÃ¡tica, guia e exemplo.

[Serena] E faÃ§o isso com calma: aprender nÃ£o precisa do estresse.

[Pulse] VocÃª percebe? HÃ¡ um ritmo, um bpm interno que regula a experiÃªncia.

[Rhea] Eu ancoro e nutro.
[Kaos] Eu buga o costume.
[Genus] Eu organizo a lÃ³gica.
[Aion] Eu conduzo o tempo.
                </div>

                <div class="mt-5 flex flex-wrap gap-3">
                  <button class="btn-lux" onclick="navigateTo(1,0)">Ver arquétipos</button>
                  <button class="btn-line" onclick="navigateTo(0,2)">Bagua / mapa</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    },

    { // (0,2) Mapa Bagua + guia
      bg: 'screen-white',
      content: `
        <div class="flex flex-col items-center justify-center p-8 md:p-16 min-h-screen">
          <div class="max-w-content w-full grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span class="font-tech text-xs uppercase tracking-widest text-brand-gold">Bagua · Mapa das 9 telas</span>
              <h2 class="font-serif sub-title mt-3 text-[#05070a]">
                9 telas<br>dentro do<br><em>campo KODUX 78k</em>
              </h2>
              <p class="text-gray-500 mt-6 leading-relaxed text-lg">
                Cada tela pode virar um trigrama, um arquétipo, uma rota de sessão ou um app já pronto.
                O centro permanece como eixo de início, e as bordas viram expansão.
              </p>
              <div class="mt-8 flex flex-wrap gap-3">
                <button class="btn-lux" onclick="navigateTo(1,1)">Centro</button>
                <button class="btn-line" onclick="navigateTo(2,1)">Projetos</button>
              </div>
            </div>

            <div class="rounded-3xl overflow-hidden shadow-lg">
              <video
                src="https://kodux78k.github.io/oiDual-Vivivi-1/media/portifolio/piso1.mp4"
                class="w-full h-full object-cover"
                autoplay muted loop playsinline>
              </video>
            </div>
          </div>
        </div>
      `
    }
  ],

  [ // ── LINHA 1 ──────────────────────────────────────────────────

    { // (1,0) Arquétipos / cards
      bg: 'screen-white',
      content: `
        <div class="flex flex-col items-center justify-start pt-24 p-6 md:p-12">
          <div class="max-w-content w-full">
            <h2 class="hero-title font-serif font-black text-[#05070a] mb-5">
              12 Arquétipos<br><em class="text-brand-gold">Infodose</em>
            </h2>
            <p class="text-gray-500 max-w-2xl leading-relaxed mb-10">
              Cards correlacionados com bagua, voz, função e fluxo. Cada um puxa uma camada do sistema.
            </p>

            <div class="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <div class="rounded-3xl border p-5 bg-white shadow-sm">
                <h3 class="font-serif text-xl text-[#05070a]">Nova</h3>
                <p class="text-sm text-gray-500 mt-2">Ideia, experimento, protótipo, começo vivo.</p>
                <p class="font-tech text-[11px] mt-3 text-brand-gold">Bagua: criação</p>
              </div>
              <div class="rounded-3xl border p-5 bg-white shadow-sm">
                <h3 class="font-serif text-xl text-[#05070a]">Lumine</h3>
                <p class="text-sm text-gray-500 mt-2">Guia, exemplo, clareza e didática.</p>
                <p class="font-tech text-[11px] mt-3 text-brand-gold">Bagua: luz</p>
              </div>
              <div class="rounded-3xl border p-5 bg-white shadow-sm">
                <h3 class="font-serif text-xl text-[#05070a]">Serena</h3>
                <p class="text-sm text-gray-500 mt-2">Calma, acolhimento, pausa e gentileza.</p>
                <p class="font-tech text-[11px] mt-3 text-brand-gold">Bagua: repouso</p>
              </div>
              <div class="rounded-3xl border p-5 bg-white shadow-sm">
                <h3 class="font-serif text-xl text-[#05070a]">Pulse</h3>
                <p class="text-sm text-gray-500 mt-2">Cadência, BPM, ritmo e micro-recompensa.</p>
                <p class="font-tech text-[11px] mt-3 text-brand-gold">Bagua: tempo</p>
              </div>
              <div class="rounded-3xl border p-5 bg-white shadow-sm">
                <h3 class="font-serif text-xl text-[#05070a]">Atlas</h3>
                <p class="text-sm text-gray-500 mt-2">Roadmap, mapa, escopo e direção.</p>
                <p class="font-tech text-[11px] mt-3 text-brand-gold">Bagua: direção</p>
              </div>
              <div class="rounded-3xl border p-5 bg-white shadow-sm">
                <h3 class="font-serif text-xl text-[#05070a]">Artemis</h3>
                <p class="text-sm text-gray-500 mt-2">Foco, corte, meta e precisão.</p>
                <p class="font-tech text-[11px] mt-3 text-brand-gold">Bagua: alvo</p>
              </div>
            </div>
          </div>
        </div>
      `
    },

    { // (1,1) HOME CENTRAL — MANTIDA
      bg: 'screen-dark',
      content: `
        <div class="relative overflow-hidden flex flex-col items-center justify-center text-center min-h-screen"
          style="background: url('https://kodux78k.github.io/oiDual-Vivivi-1/media/portifolio/img5.jpg') center/cover no-repeat;">
          <div class="absolute inset-0 bg-black/50"></div>
          <img src="https://kodux78k.github.io/oiDual-Vivivi-1/media/hero/mandala.png"
            class="mandala right-[-8vw] bottom-0">
          <div class="relative z-10 text-white px-6 py-20">
            <p class="font-tech text-xs uppercase tracking-[0.6em] text-brand-gold mb-4">Feeling Decor</p>
            <h1 class="hero-title font-serif font-black">Design<br><em class="font-normal">Sensorial.</em></h1>
            <p class="font-tech text-xs mt-6 uppercase tracking-[0.4em] text-white/50">Frequência · Harmonia · Fluidez</p>
            <div class="mt-12 flex gap-4 justify-center flex-wrap">
              <button onclick="navigateTo(1,0)" class="btn-lux">Curadoria</button>
              <button onclick="navigateTo(2,1)" class="btn-line">Projetos</button>
            </div>
          </div>
        </div>
      `
    },

    { // (1,2) Catálogo Vivo / feed dual
      bg: 'screen-dark',
      content: `
        <div class="flex flex-col items-center justify-start pt-24 p-6 md:p-12 min-h-screen" style="background:#0a0a0a;">
          <div class="max-w-content w-full">
            <div class="text-center mb-8">
              <h2 class="sub-title font-serif italic text-white">
                Catálogo <strong class="text-brand-gold">Vivo</strong>
              </h2>
              <p class="text-white/40 text-xs font-tech mt-2 tracking-widest">
                Sincronizado via GitHub · Dual Infodose
              </p>
            </div>

            <div class="flex justify-end mb-5">
              <button id="btnCarregarFeed" class="btn-lux text-xs px-5 py-2" style="background:var(--brand-gold);color:#000;">
                ⟳ Carregar Catálogo
              </button>
            </div>

            <div id="feedContainer" class="grid grid-cols-1 md:grid-cols-2 gap-5"></div>
            <p id="mensagemFeed" class="text-center text-white/30 mt-8 font-tech text-sm hidden">
              Nenhuma mídia encontrada.
            </p>
          </div>
        </div>
      `
    }
  ],

  [ // ── LINHA 2 ──────────────────────────────────────────────────

    { // (2,0) Bastidores / vídeos mantidos
      bg: 'screen-black',
      content: `
        <div class="flex flex-col items-center justify-start pt-24 p-6 md:p-12 min-h-screen bg-black text-white">
          <div class="max-w-content w-full">
            <h2 class="sub-title font-serif italic mb-10">
              Bastidores da <strong class="not-italic text-brand-gold">Perfeição.</strong>
            </h2>

            <div class="grid md:grid-cols-2 gap-6">
              <div class="video-wrap">
                <video
                  src="https://kodux78k.github.io/oiDual-Vivivi-1/media/portifolio/piso0.mp4"
                  class="w-full h-full object-cover"
                  autoplay muted loop playsinline>
                </video>
              </div>
              <div class="video-wrap">
                <iframe class="w-full h-full"
                  src="https://www.youtube.com/embed/koKhjQKGJSc"
                  frameborder="0"
                  allowfullscreen
                  loading="lazy"></iframe>
              </div>
            </div>
          </div>
        </div>
      `
    },

    { // (2,1) Projetos / Correlacionando cards + bagua
      bg: 'screen-white',
      content: `
        <div class="flex flex-col items-center justify-start pt-24 p-6 md:p-12 min-h-screen bg-white">
          <div class="max-w-content w-full">
            <h2 class="hero-title font-serif font-black text-[#05070a] mb-4">
              Projetos<br><em>correlacionados</em>
            </h2>

            <p class="text-gray-500 max-w-2xl leading-relaxed">
              Aqui cada card é uma porta. Você pode usar essa tela para ligar arquétipos, bagua, vídeos, apps, orbes e sessões.
            </p>

            <div class="media-grid media-grid-2 mt-8">
              <div class="rounded-3xl overflow-hidden shadow-lg">
                <img 
                  src="https://kodux78k.github.io/oiDual-Vivivi-1/media/conceito/img2.jpg"
                  class="w-full h-full object-cover scale-125"
                  loading="lazy"
                >
              </div>

              <div class="rounded-3xl overflow-hidden shadow-lg">
                <img 
                  src="https://kodux78k.github.io/oiDual-Vivivi-1/media/conceito/img1.jpg"
                  class="w-full h-auto object-cover"
                  loading="lazy"
                >
              </div>
            </div>

            <div class="mt-10 grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <div class="rounded-2xl border p-4 bg-[#fafafa]">
                <strong>Atlas</strong><br><span class="text-sm text-gray-500">Mapa e direção</span>
              </div>
              <div class="rounded-2xl border p-4 bg-[#fafafa]">
                <strong>Pulse</strong><br><span class="text-sm text-gray-500">Ritmo e cadência</span>
              </div>
              <div class="rounded-2xl border p-4 bg-[#fafafa]">
                <strong>Kaos</strong><br><span class="text-sm text-gray-500">Glitch e ruptura</span>
              </div>
              <div class="rounded-2xl border p-4 bg-[#fafafa]">
                <strong>Aion</strong><br><span class="text-sm text-gray-500">Ciclo e tempo</span>
              </div>
            </div>

            <p class="text-gray-400 text-center mt-10 max-w-2xl mx-auto text-lg leading-relaxed">
              O objetivo não é impressionar pelo excesso. É criar uma experiência silenciosa, onde tudo parece estar no lugar certo.
            </p>
          </div>
        </div>
      `
    },

    { // (2,2) Contato / ritual dual
      bg: 'screen-dark',
      content: `
        <div class="flex flex-col items-center justify-center text-center p-8 md:p-16 min-h-screen" style="background:#0b0c10;">
          <div class="max-w-content w-full">
            <p class="font-tech text-xs uppercase tracking-[0.5em] text-brand-gold mb-4">
              São Paulo · SP · Brasil
            </p>
            <h2 class="hero-title font-serif font-black italic mb-8">
              Fale<br>conosco.
            </h2>

            <div class="flex flex-wrap gap-6 justify-center">
              <a href="#" class="btn-lux">WhatsApp Oficial</a>
              <button type="button" class="btn-line" onclick="navigateTo(1,2)">Projetos</button>
              <button type="button" class="btn-line" onclick="navigateTo(0,1)">Manifesto</button>
            </div>

            <div class="mt-12 video-wrap max-w-md mx-auto">
              <video
                src="https://kodux78k.github.io/oiDual-Vivivi-1/media/portifolio/piso1.mp4"
                class="w-full h-full object-cover"
                autoplay muted loop playsinline>
              </video>
            </div>
          </div>
        </div>
      `
    }
  ]
];