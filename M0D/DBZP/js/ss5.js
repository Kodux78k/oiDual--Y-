(function () {
  "use strict";

  const DB_NAME   = "kodux-ss-db-v3";
  const LEGACY_DB = "kodux-ss-db-v2";

  const ALL_ID       = "all";
  const FAVORITES_ID = "favorites";

  // ═══════════════════════════════════════════════════════════════
  // KOBLLUX · 12 ARQUÉTIPOS CADIAL
  // Lei: VERDADE × INTEGRAR ÷ Δ = ♾️  |  Fractal: 3×6×9×7 = 1134
  // ═══════════════════════════════════════════════════════════════
  const CADIAL_ARQUETIPOS = [
    { id: "cadial-atlas",   opcode: "0x00", nome: "Atlas",   regra: "BOOT",     rung: 1,  hz: 432, essencia: "Planejador — ordem, estrutura, mapa cósmico",    frase: "Eu organizo o fluxo com sabedoria cósmica."        },
    { id: "cadial-nova",    opcode: "0x02", nome: "Nova",    regra: "SEED",     rung: 2,  hz: 528, essencia: "Inspira — semente, sopro inicial",                frase: "Inspiração viva brota do silêncio eterno."         },
    { id: "cadial-vitalis", opcode: "0x01", nome: "Vitalis", regra: "DELTA",    rung: 3,  hz: 528, essencia: "Momentum — energia vital em expansão",            frase: "Energia vital em expansão harmônica."              },
    { id: "cadial-pulse",   opcode: "0x0B", nome: "Pulse",   regra: "PULSE",    rung: 4,  hz: 639, essencia: "Emocional — ritmo, ressonância, voz",             frase: "Emoção é linguagem que dança."                     },
    { id: "cadial-artemis", opcode: "0x03", nome: "Artemis", regra: "DETECT",   rung: 5,  hz: 672, essencia: "Descoberta — mapa do invisível",                  frase: "Descubro o mapa sagrado do invisível."             },
    { id: "cadial-serena",  opcode: "0x09", nome: "Serena",  regra: "GUARD",    rung: 6,  hz: 528, essencia: "Cuidado — espaço seguro, campo harmônico",        frase: "Cuido do campo, nutro o espaço sagrado."           },
    { id: "cadial-kaos",    opcode: "0x06", nome: "Kaos",    regra: "LIMPAR",   rung: 7,  hz: 741, essencia: "Transformador — ruptura criativa",                frase: "Eu sou o rompimento que revela a verdade."         },
    { id: "cadial-genus",   opcode: "0x07", nome: "Genus",   regra: "SYNTH",    rung: 8,  hz: 594, essencia: "Fabricus — forma viva, síntese",                  frase: "Mãos moldam o invisível em forma viva."            },
    { id: "cadial-lumine",  opcode: "0x08", nome: "Lumine",  regra: "RENDER",   rung: 9,  hz: 432, essencia: "Alegria — luz, clareza, legibilidade",            frase: "A luz dança comigo, leveza é minha lei."           },
    { id: "cadial-solus",   opcode: "0x09", nome: "Solus",   regra: "QA",       rung: 10, hz: 963, essencia: "Sabedoria — silêncio, espelho interno",           frase: "Silêncio ritual, espelho da essência."             },
    { id: "cadial-rhea",    opcode: "0x04", nome: "Rhea",    regra: "INTEGRAR", rung: 11, hz: 528, essencia: "Vínculo — rede, tecelã de almas",                 frase: "Estou em comunhão com todos os elos."              },
    { id: "cadial-aion",    opcode: "0x05", nome: "Aion",    regra: "SELAR",    rung: 12, hz: 777, essencia: "Tempo — carimbo, ∆7, ledger",                    frase: "Sou o tempo vivo, ritmo da eternidade."            },
  ];

  // ═══════════════════════════════════════════════════════════════
  // PRELOADED — faixas e playlists de mídia
  // BUG CORRIGIDO #1: token `hip` solto removido da linha do 2º item
  // ═══════════════════════════════════════════════════════════════
  const PRELOADED = [
    // ── YOUTUBE ──────────────────────────────────────────────────
    {
      type: "youtube",
      id: "Bt_rLbMjJDk",
      url: "https://youtu.be/Bt_rLbMjJDk",
      name: "Trilhas Potencializadoras dos Aromas",
      artist: "Infodose",
      cover: "https://img.youtube.com/vi/Bt_rLbMjJDk/hqdefault.jpg"
    },
    {
      type: "youtube",                        // BUG CORRIGIDO: era `type: "youtube", hip`
      id: "_0wVkryxanE",
      url: "https://youtu.be/_0wVkryxanE",
      name: "Desperte a magia dos 12 Arquétipos",
      artist: "Infodose",
      cover: "https://img.youtube.com/vi/_0wVkryxanE/hqdefault.jpg"
    },
    {
      type: "youtube",
      id: "Id2NI9tv1r4",
      url: "https://youtu.be/Id2NI9tv1r4",
      name: "Infodose • Pra quem merece saber",
      artist: "Infodose",
      cover: "https://img.youtube.com/vi/Id2NI9tv1r4/hqdefault.jpg"
    },
    {
      type: "youtube",
      id: "qldgs0aLdB0",
      url: "https://youtu.be/qldgs0aLdB0",
      name: "A Fórmula da Dopamina Sexy",
      artist: "Infodose",
      cover: "https://img.youtube.com/vi/qldgs0aLdB0/hqdefault.jpg"
    },
    {
      type: "youtube",
      id: "FbutKMpd8MY",
      url: "https://youtu.be/FbutKMpd8MY",
      name: "O Espaço da Mente",
      artist: "Infodose",
      cover: "https://img.youtube.com/vi/FbutKMpd8MY/hqdefault.jpg"
    },
    {
      type: "youtube",
      id: "1L9_rFmIGJ8",
      url: "https://youtu.be/1L9_rFmIGJ8",
      name: "A Recompensa",
      artist: "Infodose",
      cover: "https://img.youtube.com/vi/1L9_rFmIGJ8/hqdefault.jpg"
    },
    {
      type: "youtube",
      id: "koKhjQKGJSc",
      url: "https://youtu.be/koKhjQKGJSc",
      name: "O poder das cortinas",
      artist: "Infodose",
      cover: "https://img.youtube.com/vi/koKhjQKGJSc/hqdefault.jpg"
    },
    {
      type: "youtube",
      id: "KrtOVrk8aDk",
      url: "https://youtu.be/KrtOVrk8aDk",
      name: "Poder sob seus pés",
      artist: "Infodose",
      cover: "https://img.youtube.com/vi/KrtOVrk8aDk/hqdefault.jpg"
    },
    {
      type: "youtube",
      id: "NBWDV6xjUP0",
      url: "https://youtu.be/NBWDV6xjUP0",
      name: "Dopamina e Vícios",
      artist: "Infodose",
      cover: "https://img.youtube.com/vi/NBWDV6xjUP0/hqdefault.jpg"
    },
    {
      type: "youtube",
      id: "dGYbN8jgdNQ",
      url: "https://youtu.be/dGYbN8jgdNQ",
      name: "TDAH e Dopamina",
      artist: "Infodose",
      cover: "https://img.youtube.com/vi/dGYbN8jgdNQ/hqdefault.jpg"
    },
    {
      type: "youtube",
      id: "JBjFhAutIVk",
      url: "https://youtu.be/JBjFhAutIVk",
      name: "Manipule o Subconsciente",
      artist: "Infodose",
      cover: "https://img.youtube.com/vi/JBjFhAutIVk/hqdefault.jpg"
    },
    {
      type: "youtube",
      id: "hfQ1L6fCfAo",
      url: "https://youtu.be/hfQ1L6fCfAo",
      name: "A Deriva no Espaço da Mente",
      artist: "Infodose",
      cover: "https://img.youtube.com/vi/hfQ1L6fCfAo/hqdefault.jpg"
    },
    {
      type: "youtube",
      id: "DTDfkHwuMic",
      url: "https://youtu.be/DTDfkHwuMic",
      name: "Navegando no Universo",
      artist: "Infodose",
      cover: "https://img.youtube.com/vi/DTDfkHwuMic/hqdefault.jpg"
    },
    {
      type: "youtube",
      id: "OVfqxW_Xlhw",
      url: "https://youtu.be/OVfqxW_Xlhw",
      name: "Sinfonia Criativa",
      artist: "Infodose",
      cover: "https://img.youtube.com/vi/OVfqxW_Xlhw/hqdefault.jpg"
    },

    // ── PLAYLIST YOUTUBE ─────────────────────────────────────────
    {
      type: "youtube_playlist",
      playlistId: "PL_XiIUPFx4DSKFuJZZiKCxVUy20PtDdaB",
      url: "https://youtube.com/playlist?list=PL_XiIUPFx4DSKFuJZZiKCxVUy20PtDdaB",
      name: "Playlist • Se chegou até você",
      artist: "Infodose",
      cover: "https://img.youtube.com/vi/Bt_rLbMjJDk/hqdefault.jpg"
    },

    // ── SOUNDCLOUD ───────────────────────────────────────────────
    {
      type: "soundcloud",
      url: "https://m.soundcloud.com/kobf-node-x-kobllux/op_piseiro_galo_c",
      name: "op_piseiro_galo_c",
      artist: "Oi Dual × Info Dose",
      cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg"
    },
    {
      type: "soundcloud",
      url: "https://on.soundcloud.com/Ik165VFQsv6AZPKe0S",
      name: "Short link SoundCloud",
      artist: "Oi Dual × Info Dose",
      cover: "https://i1.sndcdn.com/artworks-default-t500x500.jpg"
    }
  ];

  let db = createDefaultDB();
  let currentTrackId = null;
  let isPlaying      = false;
  let activeEngine   = null;

  let ytPlayer  = null;
  let scWidget  = null;
  let ytReady   = false;

  let widgetState = "ball";
  let isDragging  = false;
  let currentX    = window.innerWidth - 60;
  let currentY    = window.innerHeight - 150;

  const widget   = document.getElementById("kodux-widget");
  const contents = {
    ball:    document.getElementById("content-ball"),
    preview: document.getElementById("content-preview"),
    footer:  document.getElementById("content-footer"),
    full:    document.getElementById("content-full")
  };

  const audioEl = document.getElementById("local-audio");

  // ── UTILITIES ────────────────────────────────────────────────────

  function uid(prefix = "trk") {
    return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function normalizeUrl(rawUrl = "") {
    let url = String(rawUrl || "").trim();
    if (!url) return "";

    if (url.includes("soundcloud.com") || url.includes("on.soundcloud.com")) {
      try {
        const u = new URL(url);
        if (u.hostname.startsWith("m.")) u.hostname = u.hostname.replace(/^m\./, "");
        url = u.toString();
      } catch (e) {
        url = url.replace("://m.soundcloud.com", "://soundcloud.com");
      }
    }

    if (
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.includes("youtube-nocookie.com")
    ) {
      try {
        const u = new URL(url);
        if (u.hostname.startsWith("m."))    u.hostname = "youtube.com";
        if (u.hostname.startsWith("music.")) u.hostname = "youtube.com";
        if (u.hostname.endsWith("youtube-nocookie.com")) u.hostname = "youtube.com";

        let id = null;
        if (u.hostname.includes("youtu.be"))           id = u.pathname.replace("/", "").trim();
        else if (u.pathname.startsWith("/watch"))       id = u.searchParams.get("v");
        else if (u.pathname.startsWith("/shorts/"))     id = u.pathname.split("/")[2];
        else if (u.pathname.startsWith("/embed/"))      id = u.pathname.split("/")[2];
        if (id) url = `https://youtu.be/${id}`;
      } catch (e) {
        url = url
          .replace("://m.youtube.com",     "://youtube.com")
          .replace("://music.youtube.com", "://youtube.com")
          .replace("://youtube-nocookie.com", "://youtube.com");
      }
    }

    return url;
  }

  function extractYouTubeId(rawUrl = "") {
    try {
      const u = new URL(rawUrl);
      if (u.hostname.includes("youtu.be"))        return u.pathname.replace("/", "").trim();
      if (u.pathname.startsWith("/watch"))         return u.searchParams.get("v");
      if (u.pathname.startsWith("/shorts/"))       return u.pathname.split("/")[2];
      if (u.pathname.startsWith("/embed/"))        return u.pathname.split("/")[2];
    } catch (e) {}
    const m = String(rawUrl).match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([0-9A-Za-z_-]{11})/);
    return m ? m[1] : null;
  }

  function extractYouTubePlaylistId(rawUrl = "") {
    try {
      const u = new URL(rawUrl);
      return u.searchParams.get("list");
    } catch (e) {}
    const m = String(rawUrl).match(/[?&]list=([0-9A-Za-z_-]+)/);
    return m ? m[1] : null;
  }

  function normalizeTrack(track) {
    return {
      id:         track.id || uid(),
      type:       track.type || "local",
      url:        normalizeUrl(track.url || ""),
      name:       track.name || "Sem título",
      artist:     track.artist || "Web",
      cover:      track.cover || "https://picsum.photos/100",
      blob:       track.blob || null,
      favorite:   !!track.favorite,
      playlistId: track.playlistId || null,
      // KOBLLUX metadata (opcional — preenchido quando a faixa tem arquétipo associado)
      cadial:     track.cadial || null
    };
  }

  // ── DB ───────────────────────────────────────────────────────────

  function createDefaultDB() {
    // Playlists do sistema
    const systemPlaylists = [
      { id: ALL_ID,       name: "Todas",     system: true, trackIds: [] },
      { id: FAVORITES_ID, name: "Favoritos", system: true, trackIds: [] }
    ];

    // Playlists CADIAL — uma por arquétipo (D1→D12)
    // Cada playlist CADIAL aguarda o usuário popular com faixas alinhadas à essência
    const cadialPlaylists = CADIAL_ARQUETIPOS.map(arq => ({
      id:       arq.id,
      name:     `${arq.nome} · ${arq.regra}`,          // ex: "Atlas · BOOT"
      system:   false,
      trackIds: [],
      cadial:   {
        opcode:   arq.opcode,
        rung:     arq.rung,
        hz:       arq.hz,
        essencia: arq.essencia,
        frase:    arq.frase
      }
    }));

    return {
      version:         3,
      library:         PRELOADED.map(normalizeTrack),
      playlists:       [...systemPlaylists, ...cadialPlaylists],
      activePlaylistId: ALL_ID
    };
  }

  function ensureSystemPlaylists() {
    const hasAll = db.playlists.some(p => p.id === ALL_ID);
    const hasFav = db.playlists.some(p => p.id === FAVORITES_ID);

    if (!hasAll) db.playlists.unshift({ id: ALL_ID, name: "Todas", system: true, trackIds: [] });
    if (!hasFav) db.playlists.splice(1, 0, { id: FAVORITES_ID, name: "Favoritos", system: true, trackIds: [] });

    // Garante que os 12 arquétipos CADIAL existem como playlists
    CADIAL_ARQUETIPOS.forEach(arq => {
      if (!db.playlists.some(p => p.id === arq.id)) {
        db.playlists.push({
          id:       arq.id,
          name:     `${arq.nome} · ${arq.regra}`,
          system:   false,
          trackIds: [],
          cadial:   { opcode: arq.opcode, rung: arq.rung, hz: arq.hz, essencia: arq.essencia, frase: arq.frase }
        });
      }
    });

    db.playlists = db.playlists.filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i);

    if (!db.activePlaylistId || !db.playlists.some(p => p.id === db.activePlaylistId)) {
      db.activePlaylistId = ALL_ID;
    }
  }

  // BUG CORRIGIDO #2: `localStorage.sssetItem(DB_NAMEMEAMEME, ...)` → `localStorage.setItem(DB_NAME, ...)`
  function saveDB() {
    localStorage.setItem(DB_NAME, JSON.stringify(db));
  }

  function migrateLegacyIfNeeded() {
    const rawV3 = localStorage.getItem(DB_NAME);
    if (rawV3) {
      try {
        const parsed = JSON.parse(rawV3);
        db = {
          version:         3,
          library:         Array.isArray(parsed.library) ? parsed.library.map(normalizeTrack) : [],
          playlists:       Array.isArray(parsed.playlists)
            ? parsed.playlists.map(p => ({
                id:       p.id || uid("pl"),
                name:     p.name || "Playlist",
                system:   !!p.system,
                trackIds: Array.isArray(p.trackIds) ? p.trackIds.slice() : [],
                cadial:   p.cadial || null
              }))
            : [],
          activePlaylistId: parsed.activePlaylistId || ALL_ID
        };
        ensureSystemPlaylists();
        return;
      } catch (e) {
        db = createDefaultDB();
        ensureSystemPlaylists();
        saveDB();
        return;
      }
    }

    const legacy = localStorage.getItem(LEGACY_DB);
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy);
        if (Array.isArray(parsed)) {
          db = createDefaultDB();
          db.library = parsed.map(normalizeTrack);
          ensureSystemPlaylists();
          saveDB();
          return;
        }
      } catch (e) {}
    }

    db = createDefaultDB();
    ensureSystemPlaylists();
    saveDB();
  }

  // ── QUERIES ──────────────────────────────────────────────────────

  function getPlaylistById(id) {
    return db.playlists.find(p => p.id === id) || null;
  }

  function getActivePlaylist() {
    return getPlaylistById(db.activePlaylistId) || getPlaylistById(ALL_ID);
  }

  function getTrackById(id) {
    return db.library.find(t => t.id === id) || null;
  }

  function getVisibleTracks() {
    const active = getActivePlaylist();
    if (!active || active.id === ALL_ID) return db.library.slice();
    if (active.id === FAVORITES_ID)      return db.library.filter(t => t.favorite);
    return (active.trackIds || []).map(getTrackById).filter(Boolean);
  }

  // ── RENDER ───────────────────────────────────────────────────────

  function syncPreviewAndMain(track) {
    const fills = [
      { title: "prev-title", artist: "prev-artist", cover: "prev-cover" },
      { title: "foot-title", artist: "foot-artist", cover: "foot-cover" },
      { title: "main-title", artist: "main-artist", cover: "main-cover" }
    ];

    fills.forEach(({ title, artist, cover }) => {
      const titleEl  = document.getElementById(title);
      const artistEl = document.getElementById(artist);
      const coverEl  = document.getElementById(cover);

      if (titleEl)  titleEl.innerText  = track?.name   || "Oráculo";
      if (artistEl) artistEl.innerText = track?.artist  || "Sistema KODUX v2.5";
      if (coverEl)  coverEl.src        = track?.cover   || "https://picsum.photos/100";
    });
  }

  function syncIcons() {
    const icon       = isPlaying ? "ph-pause-circle" : "ph-play-circle";
    const iconSimple = isPlaying ? "ph-pause"        : "ph-play";

    const prevPlay = document.getElementById("prev-play-icon");
    const footPlay = document.getElementById("foot-play-icon");
    const mainPlay = document.getElementById("main-play-icon");

    if (prevPlay) prevPlay.className = `ph-fill ${icon} text-4xl`;
    if (footPlay) footPlay.className = `ph-fill ${icon} text-5xl`;
    if (mainPlay) mainPlay.className = `ph-fill ${iconSimple} text-3xl ${isPlaying ? "" : "ml-1"}`;
  }

  function renderTabs() {
    const tabs = document.getElementById("playlist-tabs");
    if (!tabs) return;

    tabs.innerHTML = "";

    const ordered = [
      getPlaylistById(ALL_ID),
      getPlaylistById(FAVORITES_ID),
      ...db.playlists.filter(p => !p.system && p.id !== ALL_ID && p.id !== FAVORITES_ID)
    ].filter(Boolean);

    ordered.forEach(pl => {
      const visibleCount =
        pl.id === ALL_ID       ? db.library.length :
        pl.id === FAVORITES_ID ? db.library.filter(t => t.favorite).length :
                                 (pl.trackIds || []).length;

      const btn = document.createElement("button");

      // Ícone especial para playlists CADIAL
      const isCadial = !!pl.cadial;
      const icon = pl.id === ALL_ID
        ? "ph-stack"
        : pl.id === FAVORITES_ID
          ? "ph-heart"
          : isCadial
            ? "ph-spiral"         // ícone para arquétipos
            : "ph-playlist";

      // Tooltip com essência do arquétipo
      if (isCadial) btn.title = `[${pl.cadial.opcode}] ${pl.cadial.essencia} · ${pl.cadial.hz}Hz`;

      btn.className = `mini-chip ${db.activePlaylistId === pl.id ? "active" : ""} ${isCadial ? "cadial-chip" : ""}`;
      btn.onclick   = () => setActivePlaylist(pl.id);
      btn.innerHTML = `<i class="ph ${icon}"></i><span>${pl.name}</span><span class="opacity-60">(${visibleCount})</span>`;
      tabs.appendChild(btn);

      if (!pl.system && pl.id !== ALL_ID && pl.id !== FAVORITES_ID) {
        const del = document.createElement("button");
        del.className          = "mini-chip";
        del.style.padding      = "0.55rem 0.7rem";
        del.title              = "Remover playlist";
        del.onclick            = (e) => { e.stopPropagation(); deletePlaylist(pl.id); };
        del.innerHTML          = `<i class="ph ph-trash"></i>`;
        tabs.appendChild(del);
      }
    });
  }

  function renderDestinationSelect() {
    const select = document.getElementById("destination-select");
    if (!select) return;

    const prev   = select.value || db.activePlaylistId || ALL_ID;
    const custom = db.playlists.filter(p => !p.system && p.id !== ALL_ID && p.id !== FAVORITES_ID);

    select.innerHTML =
      `<option value="${ALL_ID}">Todas</option>` +
      `<option value="${FAVORITES_ID}">Favoritos</option>` +
      custom.map(p => `<option value="${p.id}">${p.name}</option>`).join("");

    if ([ALL_ID, FAVORITES_ID, ...custom.map(p => p.id)].includes(prev)) select.value = prev;
    else select.value = db.activePlaylistId || ALL_ID;
  }

  function renderPlaylist() {
    const container = document.getElementById("playlist-container");
    if (!container) return;

    const visible  = getVisibleTracks();
    const active   = getActivePlaylist();
    container.innerHTML = "";

    // Banner CADIAL quando a playlist ativa é um arquétipo
    if (active?.cadial) {
      const banner = document.createElement("div");
      banner.className = "p-4 rounded-2xl border border-white/10 bg-white/5 mb-3";
      banner.innerHTML = `
        <p class="text-[10px] text-[var(--muted)] uppercase tracking-widest mb-1">
          ${active.cadial.opcode} · D${active.cadial.rung} · ${active.cadial.hz}Hz
        </p>
        <p class="text-xs text-white font-semibold">${active.cadial.essencia}</p>
        <p class="text-[10px] text-[var(--muted)] italic mt-1">"${active.cadial.frase}"</p>
      `;
      container.appendChild(banner);
    }

    if (!visible.length) {
      const empty = document.createElement("div");
      empty.className = "p-5 rounded-2xl border border-white/10 bg-white/5 text-center";
      empty.innerHTML = `
        <div class="text-[var(--primary)] text-3xl mb-2"><i class="ph ph-disc"></i></div>
        <h4 class="text-sm font-bold text-white mb-1">Sem faixas aqui</h4>
        <p class="text-[11px] text-[var(--muted)]">Adicione um link, crie uma playlist ou marque favoritos.</p>
      `;
      container.appendChild(empty);
      return;
    }

    visible.forEach(t => {
      const activeItem = t.id === currentTrackId;
      const item       = document.createElement("div");
      item.className   = `flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition ${
        activeItem
          ? "bg-[var(--primary)]/20 border border-[var(--primary)]/30"
          : "bg-white/5 hover:bg-white/10"
      }`;

      item.innerHTML = `
        <img src="${t.cover}" class="w-10 h-10 rounded-lg object-cover border border-white/10">
        <div class="flex-1 overflow-hidden min-w-0">
          <h5 class="text-xs font-bold text-white truncate">${t.name}</h5>
          <p class="text-[10px] text-[var(--muted)] truncate">${t.artist}</p>
          ${t.cadial ? `<p class="text-[9px] text-[var(--primary)] truncate">${t.cadial}</p>` : ""}
        </div>
        <button class="item-action fav ${t.favorite ? "active" : ""}" title="Favoritar"
          onclick="event.stopPropagation(); toggleFavorite('${t.id}')">
          <i class="ph ${t.favorite ? "ph-heart-fill" : "ph-heart"}"></i>
        </button>
        <button class="item-action add" title="Adicionar à playlist escolhida"
          onclick="event.stopPropagation(); quickAddToSelectedPlaylist('${t.id}')">
          <i class="ph ph-plus"></i>
        </button>
        <button class="item-action" title="Excluir"
          onclick="event.stopPropagation(); removeTrack('${t.id}')">
          <i class="ph ph-trash"></i>
        </button>
        ${activeItem && isPlaying ? '<i class="ph-fill ph-waveform text-[var(--primary)] animate-pulse ml-1"></i>' : ""}
      `;

      item.onclick = () => loadAndPlayById(t.id);
      container.appendChild(item);
    });
  }

  function renderEverything() {
    renderTabs();
    renderDestinationSelect();
    renderPlaylist();

    const current = currentTrackId ? getTrackById(currentTrackId) : null;
    syncPreviewAndMain(current);
    syncIcons();
  }

  // ── WIDGET STATE ─────────────────────────────────────────────────

  function setPlaybackMode(track) {
    const isVideo = !!track && (track.type === "youtube" || track.type === "youtube_playlist");
    document.body.classList.toggle("mode-cinema", isVideo);
    document.body.classList.toggle("mode-music", !isVideo);

    const shell = document.getElementById("cinema-shell");
    if (shell) shell.classList.toggle("hidden", !isVideo);
  }

  function stopCurrentPlayback() {
    try { audioEl.pause(); } catch (e) {}
    try { if (ytPlayer && ytPlayer.stopVideo) ytPlayer.stopVideo(); } catch (e) {}
    try { if (scWidget && scWidget.pause)     scWidget.pause();     } catch (e) {}

    isPlaying = false;
    document.body.classList.remove("mode-cinema");
    document.body.classList.add("mode-music");

    const shell = document.getElementById("cinema-shell");
    if (shell) shell.classList.add("hidden");

    syncIcons();
  }

  function updateWidgetState(newState) {
    widgetState = newState;
    if (widget) widget.className = `state-${newState}`;

    Object.values(contents).forEach(el => { if (el) el.classList.add("hidden-content"); });
    if (contents[newState]) contents[newState].classList.remove("hidden-content");

    if (!widget) return;

    if (newState === "ball") {
      widget.style.left      = `${currentX}px`;
      widget.style.top       = `${currentY}px`;
      widget.style.transform = "none";
      widget.style.bottom    = "auto";
    } else if (newState === "preview") {
      widget.style.left      = currentX < window.innerWidth / 2 ? "10px" : `${window.innerWidth - 250}px`;
      widget.style.top       = `${currentY}px`;
      widget.style.transform = "none";
      widget.style.bottom    = "auto";
    } else if (newState === "full") {
      widget.style.left      = "50%";
      widget.style.top       = "50%";
      widget.style.transform = "translate(-50%, -50%)";
      widget.style.bottom    = "auto";
    } else if (newState === "footer") {
      widget.style.transform = "none";
      widget.style.left      = "0";
      widget.style.top       = "auto";
      widget.style.bottom    = "0";
    }
  }

  function initDrag() {
    const handleEls = [contents.ball, ...document.querySelectorAll(".drag-header")].filter(Boolean);
    let initialX = 0;
    let initialY = 0;

    const onStart = (e) => {
      if (!widget) return;
      if (widgetState === "full" || e.target.closest("button, input, select, textarea")) return;

      isDragging = false;
      const touch = e.type === "touchstart" ? e.touches[0] : e;
      initialX = touch.clientX - currentX;
      initialY = touch.clientY - currentY;

      widget.style.transition = "none";
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup",   onEnd);
      document.addEventListener("touchmove", onMove, { passive: false });
      document.addEventListener("touchend",  onEnd);
    };

    const onMove = (e) => {
      isDragging = true;
      e.preventDefault();
      const touch = e.type === "touchmove" ? e.touches[0] : e;
      currentX = touch.clientX - initialX;
      currentY = touch.clientY - initialY;
      widget.style.left = `${currentX}px`;
      widget.style.top  = `${currentY}px`;
    };

    const onEnd = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup",   onEnd);
      document.removeEventListener("touchmove", onMove);
      document.removeEventListener("touchend",  onEnd);

      if (!widget) return;
      widget.style.transition = "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";

      if (currentY > window.innerHeight - 120) updateWidgetState("footer");
      else if (isDragging)                     updateWidgetState("ball");
    };

    handleEls.forEach(h => {
      h.addEventListener("mousedown",  onStart);
      h.addEventListener("touchstart", onStart);
    });
  }

  // ── PLAYBACK ─────────────────────────────────────────────────────

  function ensureYTPlayer() {
    if (ytPlayer) return ytPlayer;

    ytPlayer = new YT.Player("yt-container", {
      height: "100%",
      width:  "100%",
      videoId: "",
      playerVars: { autoplay: 1, playsinline: 1, modestbranding: 1, rel: 0 },
      events: {
        onReady: (e) => {
          const track = currentTrackId ? getTrackById(currentTrackId) : null;
          if (!track) return;
          if (track.type === "youtube_playlist" && track.playlistId) {
            e.target.loadPlaylist({ list: track.playlistId, index: 0 });
          } else if (track.id) {
            e.target.loadVideoById(track.id);
          }
          e.target.playVideo();
          isPlaying = true;
          syncIcons();
        },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.ENDED) playNext();
          isPlaying = (e.data === YT.PlayerState.PLAYING);
          syncIcons();
        }
      }
    });

    return ytPlayer;
  }

  function playYT(track) {
    if (!ytReady) return setTimeout(() => playYT(track), 300);
    ensureYTPlayer();

    if (track.type === "youtube_playlist" && track.playlistId) {
      ytPlayer.loadPlaylist({ list: track.playlistId, index: 0 });
    } else {
      ytPlayer.loadVideoById(track.id);
    }

    ytPlayer.playVideo();
    isPlaying = true;
    syncIcons();
  }

  function playSC(url) {
    const container = document.getElementById("sc-container");
    if (!container) return;

    container.innerHTML = `
      <iframe
        id="sc-frame"
        allow="autoplay"
        src="https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=true&hide_related=true&show_comments=false&show_user=false&show_reposts=false&visual=false"
      ></iframe>
    `;

    scWidget = SC.Widget("sc-frame");
    scWidget.bind(SC.Widget.Events.READY,  () => { scWidget.play(); isPlaying = true;  syncIcons(); });
    scWidget.bind(SC.Widget.Events.FINISH, () => playNext());
    scWidget.bind(SC.Widget.Events.PLAY,   () => { isPlaying = true;  syncIcons(); });
    scWidget.bind(SC.Widget.Events.PAUSE,  () => { isPlaying = false; syncIcons(); });
  }

  function loadAndPlayById(trackId) {
    const track = getTrackById(trackId);
    if (!track) return;

    currentTrackId = trackId;
    activeEngine   = track.type;

    stopCurrentPlayback();
    syncPreviewAndMain(track);
    setPlaybackMode(track);

    if (track.type === "youtube" || track.type === "youtube_playlist") {
      playYT(track);
    } else if (track.type === "soundcloud") {
      playSC(track.url);
    } else if (track.type === "local") {
      if (!track.blob && !track.url) return;
      const src = track.blob ? URL.createObjectURL(track.blob) : track.url;
      audioEl.src = src;
      audioEl.play().catch(() => alert("Clique em Play para iniciar o áudio local (bloqueio do navegador)."));
      isPlaying = true;
      syncIcons();
    }

    renderEverything();
  }

  function togglePlay(e) {
    if (e) e.stopPropagation();

    const visible = getVisibleTracks();
    if (!visible.length) return;

    if (!currentTrackId) { loadAndPlayById(visible[0].id); return; }

    const current = getTrackById(currentTrackId);
    if (!current)  { loadAndPlayById(visible[0].id); return; }

    if (isPlaying) {
      if (activeEngine === "youtube"     && ytPlayer)  ytPlayer.pauseVideo();
      else if (activeEngine === "soundcloud" && scWidget) scWidget.pause();
      else audioEl.pause();
      isPlaying = false;
    } else {
      if (activeEngine === "youtube"     && ytPlayer)  ytPlayer.playVideo();
      else if (activeEngine === "soundcloud" && scWidget) scWidget.play();
      else if (activeEngine === "local")  audioEl.play();
      isPlaying = true;
    }

    syncIcons();
  }

  function playNext() {
    const visible = getVisibleTracks();
    if (!visible.length) return;
    const idx  = currentTrackId ? visible.findIndex(t => t.id === currentTrackId) : -1;
    const next = visible[(idx + 1) % visible.length];
    if (next) loadAndPlayById(next.id);
  }

  function playPrev() {
    const visible = getVisibleTracks();
    if (!visible.length) return;
    const idx  = currentTrackId ? visible.findIndex(t => t.id === currentTrackId) : 0;
    const prev = visible[(idx - 1 + visible.length) % visible.length];
    if (prev) loadAndPlayById(prev.id);
  }

  // ── PLAYLIST MANAGEMENT ──────────────────────────────────────────

  function setActivePlaylist(id) {
    db.activePlaylistId = id;
    saveDB();
    renderEverything();
  }

  function createPlaylist() {
    const input = document.getElementById("new-playlist-input");
    if (!input) return;
    const name = input.value.trim();
    if (!name) return;

    const exists = db.playlists.some(p => p.name.toLowerCase() === name.toLowerCase());
    if (exists) return alert("Já existe uma playlist com esse nome.");

    db.playlists.push({ id: uid("pl"), name, system: false, trackIds: [], cadial: null });
    input.value = "";
    saveDB();
    renderEverything();
  }

  function deletePlaylist(playlistId) {
    const playlist = getPlaylistById(playlistId);
    if (!playlist || playlist.system) return;

    if (!confirm(`Remover a playlist "${playlist.name}"?`)) return;

    db.playlists = db.playlists.filter(p => p.id !== playlistId);
    if (db.activePlaylistId === playlistId) db.activePlaylistId = ALL_ID;
    saveDB();
    renderEverything();
  }

  function toggleFavorite(trackId) {
    const track = getTrackById(trackId);
    if (!track) return;
    track.favorite = !track.favorite;
    saveDB();
    renderEverything();
  }

  function addTrackToPlaylist(trackId, playlistId) {
    const playlist = getPlaylistById(playlistId);
    const track    = getTrackById(trackId);
    if (!track || !playlist) return;

    if (playlist.id === ALL_ID) {
      db.activePlaylistId = ALL_ID;
    } else if (playlist.id === FAVORITES_ID) {
      track.favorite = true;
      db.activePlaylistId = FAVORITES_ID;
    } else {
      if (!playlist.trackIds.includes(trackId)) playlist.trackIds.unshift(trackId);
      db.activePlaylistId = playlist.id;
    }

    saveDB();
    renderEverything();
  }

  function quickAddToSelectedPlaylist(trackId) {
    const select = document.getElementById("destination-select");
    if (!select) return;
    addTrackToPlaylist(trackId, select.value);
  }

  function removeTrack(trackId) {
    const active = getActivePlaylist();
    const track  = getTrackById(trackId);
    if (!track) return;

    if (active.id === FAVORITES_ID) {
      track.favorite = false;
    } else if (active.id === ALL_ID) {
      db.library = db.library.filter(t => t.id !== trackId);
      db.playlists.forEach(p => {
        if (Array.isArray(p.trackIds)) p.trackIds = p.trackIds.filter(id => id !== trackId);
      });
      if (currentTrackId === trackId) { currentTrackId = null; stopCurrentPlayback(); }
    } else {
      active.trackIds = (active.trackIds || []).filter(id => id !== trackId);
      if (currentTrackId === trackId) { currentTrackId = null; stopCurrentPlayback(); }
    }

    saveDB();
    renderEverything();
  }

  function findExistingTrackByUrl(url, type, id) {
    if (type === "youtube"          && id) return db.library.find(t => t.type === "youtube"          && t.id === id)         || null;
    if (type === "youtube_playlist" && id) return db.library.find(t => t.type === "youtube_playlist" && t.playlistId === id) || null;
    if (type === "soundcloud") {
      const norm = normalizeUrl(url);
      return db.library.find(t => t.type === "soundcloud" && normalizeUrl(t.url) === norm) || null;
    }
    return db.library.find(t => normalizeUrl(t.url) === normalizeUrl(url)) || null;
  }

  function normalizeAndInsertToLibrary(track) {
    const normalized = normalizeTrack(track);
    const existing   = findExistingTrackByUrl(normalized.url, normalized.type, normalized.id || normalized.playlistId);

    if (existing) {
      existing.name       = normalized.name       || existing.name;
      existing.artist     = normalized.artist     || existing.artist;
      existing.cover      = normalized.cover      || existing.cover;
      existing.playlistId = normalized.playlistId || existing.playlistId;
      if (normalized.type === "local" && normalized.blob) existing.blob = normalized.blob;
      return existing;
    }

    db.library.unshift(normalized);
    return normalized;
  }

  async function buildTrackFromUrl(url, base = {}) {
    const cleanUrl = normalizeUrl(url);
    if (!cleanUrl) throw new Error("Link vazio.");

    const track = {
      id:         base.id     || uid(),
      type:       base.type   || "local",
      url:        cleanUrl,
      name:       base.name   || "Carregando...",
      artist:     base.artist || "Web",
      cover:      base.cover  || "https://picsum.photos/100",
      blob:       base.blob   || null,
      favorite:   !!base.favorite,
      playlistId: base.playlistId || null,
      cadial:     base.cadial || null
    };

    const ytId     = extractYouTubeId(cleanUrl);
    const ytListId = extractYouTubePlaylistId(cleanUrl);
    const isYT = cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be") || cleanUrl.includes("youtube-nocookie.com");
    const isSC = cleanUrl.includes("soundcloud.com") || cleanUrl.includes("on.soundcloud.com");

    if (isYT) {
      if (ytListId && !ytId) {
        track.type       = "youtube_playlist";
        track.playlistId = ytListId;
        track.name       = base.name   || "YouTube Playlist";
        track.artist     = base.artist || "YouTube";
        track.cover      = base.cover  || "https://picsum.photos/100";
        return normalizeTrack(track);
      }

      if (!ytId) throw new Error("Link YouTube inválido.");

      track.type  = "youtube";
      track.id    = ytId;
      track.cover = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;

      try {
        const res  = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(cleanUrl)}`);
        const data = await res.json();
        track.name   = data.title       || base.name   || "YouTube Track";
        track.artist = data.author_name || base.artist || "YouTube";
      } catch (e) {
        track.name   = base.name   || "YouTube Track";
        track.artist = base.artist || "YouTube";
      }
    } else if (isSC) {
      track.type = "soundcloud";
      try {
        const res  = await fetch(`https://soundcloud.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`);
        const data = await res.json();
        track.name   = data.title         || base.name   || "SoundCloud Track";
        track.artist = data.author_name   || base.artist || "SoundCloud";
        track.cover  = data.thumbnail_url || base.cover  || "https://i1.sndcdn.com/artworks-default-t500x500.jpg";
      } catch (e) {
        track.name   = base.name   || "SoundCloud Track";
        track.artist = base.artist || "SoundCloud";
        track.cover  = base.cover  || "https://i1.sndcdn.com/artworks-default-t500x500.jpg";
      }
    } else {
      track.type   = base.type   || "local";
      track.name   = base.name   || cleanUrl.split("/").pop() || "Arquivo local";
      track.artist = base.artist || "Local";
    }

    return normalizeTrack(track);
  }

  async function hydratePreloadedTracks() {
    const preloadedUrls = new Set(PRELOADED.map(t => normalizeUrl(t.url)));
    let changed = false;

    for (let i = 0; i < db.library.length; i++) {
      const tr = db.library[i];
      if (!preloadedUrls.has(normalizeUrl(tr.url))) continue;
      try {
        const fresh = await buildTrackFromUrl(tr.url, tr);
        db.library[i] = { ...tr, ...fresh, id: tr.id };
        changed = true;
      } catch (e) {}
    }

    if (changed) { saveDB(); renderEverything(); }
  }

  async function addLink() {
    const input       = document.getElementById("link-input");
    const destination = document.getElementById("destination-select");
    if (!input || !destination) return;

    const url = normalizeUrl(input.value.trim());
    if (!url) return;

    let newTrack;
    try {
      newTrack = await buildTrackFromUrl(url);
    } catch (e) {
      return alert(e.message || "Não consegui ler esse link.");
    }

    const inserted = normalizeAndInsertToLibrary(newTrack);

    if (destination.value === FAVORITES_ID) {
      inserted.favorite = true;
    } else if (destination.value !== ALL_ID) {
      const playlist = getPlaylistById(destination.value);
      if (playlist && !playlist.trackIds.includes(inserted.id)) playlist.trackIds.unshift(inserted.id);
    }

    input.value = "";
    saveDB();
    renderEverything();
  }

  // ── EVENT HANDLERS & BOOT ────────────────────────────────────────

  function openFullFromPreview(e) {
    if (e) e.stopPropagation();
    updateWidgetState("full");
  }

  function handleClickOutside(e) {
    if (widgetState === "preview" && widget && !widget.contains(e.target)) {
      updateWidgetState("ball");
    }
  }

  window.openFullFromPreview        = openFullFromPreview;
  window.updateWidgetState          = updateWidgetState;
  window.togglePlay                 = togglePlay;
  window.playNext                   = playNext;
  window.playPrev                   = playPrev;
  window.addLink                    = addLink;
  window.collapseToBall             = (e) => { if (e) e.stopPropagation(); updateWidgetState("ball"); };
  window.toggleFavorite             = toggleFavorite;
  window.removeTrack                = removeTrack;
  window.quickAddToSelectedPlaylist = quickAddToSelectedPlaylist;
  window.createPlaylist             = createPlaylist;
  window.onYouTubeIframeAPIReady    = () => { ytReady = true; };

  // Expõe CADIAL para uso externo (ex: outro módulo KOBLLUX)
  window.KOBLLUX_CADIAL = CADIAL_ARQUETIPOS;

  document.addEventListener("mousedown",  handleClickOutside);
  document.addEventListener("touchstart", handleClickOutside);

  if (widget) {
    widget.onclick = (e) => {
      if (isDragging) return;
      if (widgetState === "ball") updateWidgetState("preview");
    };
  }

  const tag = document.createElement("script");
  tag.src   = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);

  migrateLegacyIfNeeded();
  renderEverything();
  updateWidgetState("ball");
  initDrag();
  hydratePreloadedTracks();

})();
