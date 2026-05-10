/* ═══════════════════════════════════════════════════════════
   0x03 · EXPANDIR · V · D7
   Matrix 3×3 + Presets + Session Loader + Button Panel
   ═══════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  const ROWS = 3;
  const COLS = 3;

  const DEFAULT_SESSION_URL =
   "https://kodux78k.github.io/oiDual--Y-/M0D/kob-DH0/";
  const STORE_KEY = "di_navSesh";

  const grid = document.getElementById("ZPR");
  const nav = document.getElementById("navMatrix");

  let currentRow = 1;
  let currentCol = 1;
  let isAnimating = false;

  let sectionStore = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
  let activeSection = { row: 1, col: 1 };

  const PRESET_MATRIX = [
    [
      { title: "Portal", tag: "Abertura", preset: "portal" },
      { title: "Norte", tag: "Carreira", preset: "north" },
      { title: "Horizonte", tag: "Visão", preset: "horizon" }
    ],
    [
      { title: "Leste", tag: "Expansão", preset: "east" },
      { title: "Núcleo", tag: "Centro", preset: "core" },
      { title: "Oeste", tag: "Sintonia", preset: "west" }
    ],
    [
      { title: "Base", tag: "Fundação", preset: "base" },
      { title: "Sul", tag: "Raiz", preset: "south" },
      { title: "Síntese", tag: "Fechamento", preset: "synthesis" }
    ]
  ];

  const PRESET_OPTIONS = [
    { value: "portal", label: "Portal / Abertura" },
    { value: "north", label: "Norte / Carreira" },
    { value: "horizon", label: "Horizonte / Visão" },
    { value: "east", label: "Leste / Expansão" },
    { value: "core", label: "Núcleo / Centro" },
    { value: "west", label: "Oeste / Sintonia" },
    { value: "base", label: "Base / Fundação" },
    { value: "south", label: "Sul / Raiz" },
    { value: "synthesis", label: "Síntese / Fechamento" }
  ];

  function slotKey(row, col) {
    return `${row}-${col}`;
  }

  function defaultPresetMeta(row, col) {
    return PRESET_MATRIX?.[row]?.[col] || {
      title: `Seção ${row * 3 + col + 1}`,
      tag: "Cole seu HTML aqui",
      preset: "portal"
    };
  }

  function blankSlotHtml(title, tag) {
    return `<div class="inner"><div class="wrap stack"><div class="blank-slot">${title} · ${tag}</div></div></div>`;
  }

  function sanitizeSectionHtml(html) {
    let out = String(html || "");

    const replacements = [
      ['id="session-iframe"', 'id="session-iframe-embedded"'],
      ["id='session-iframe'", "id='session-iframe-embedded'"],
      [
        "handleHeaderClick(event, 'session-iframe')",
        "handleHeaderClick(event, 'session-iframe-embedded')"
      ],
      [
        'handleHeaderClick(event, "session-iframe")',
        'handleHeaderClick(event, "session-iframe-embedded")'
      ],
      ["toggleCollapse('session-iframe')", "toggleCollapse('session-iframe-embedded')"],
      ['toggleCollapse("session-iframe")', 'toggleCollapse("session-iframe-embedded")'],
      ["toggleMaximize('session-iframe')", "toggleMaximize('session-iframe-embedded')"],
      ['toggleMaximize("session-iframe")', 'toggleMaximize("session-iframe-embedded")'],
      ["minimizeWindow('session-iframe')", "minimizeWindow('session-iframe-embedded')"],
      ['minimizeWindow("session-iframe")', 'minimizeWindow("session-iframe-embedded")'],
      ["closeWindow('session-iframe')", "closeWindow('session-iframe-embedded')"],
      ['closeWindow("session-iframe")', 'closeWindow("session-iframe-embedded")']
    ];

    for (const [from, to] of replacements) {
      out = out.split(from).join(to);
    }

    return out;
  }

  function defaultSlotData(row, col) {
    const meta = defaultPresetMeta(row, col);
    return {
      title: meta.title,
      tag: meta.tag,
      preset: meta.preset,
      html: blankSlotHtml(meta.title, meta.tag),
      url: DEFAULT_SESSION_URL
    };
  }

  function getSlotData(row, col) {
    const key = slotKey(row, col);
    const current = sectionStore[key] || {};
    const fallback = defaultSlotData(row, col);

    return {
      title: current.title ?? fallback.title,
      tag: current.tag ?? fallback.tag,
      preset: current.preset ?? fallback.preset,
      html: current.html ?? fallback.html,
      url: current.url ?? fallback.url
    };
  }

  function setSlotData(row, col, data) {
    const key = slotKey(row, col);
    const current = getSlotData(row, col);

    const next = {
      title: data.title ?? current.title,
      tag: data.tag ?? current.tag,
      preset: data.preset ?? current.preset,
      html: data.html !== undefined ? sanitizeSectionHtml(data.html) : current.html,
      url: data.url ?? current.url
    };

    sectionStore[key] = next;
    localStorage.setItem(STORE_KEY, JSON.stringify(sectionStore));
  }

  function loadSession(url) {
    const iframe = document.querySelector("#session-iframe iframe");
    if (!iframe) return;

    iframe.src = url || DEFAULT_SESSION_URL;
  }

  function ensureEditor() {
    if (document.getElementById("sectionEditor")) return;

    const editor = document.createElement("div");
    editor.id = "sectionEditor";
    editor.className = "section-editor hidden";
    editor.setAttribute("aria-hidden", "true");

    editor.innerHTML = `
      <div class="section-editor__panel">
        <div class="section-editor__hdr">
          <strong id="sectionEditorTitle">Editar seção</strong>
          <button type="button" id="closeSectionEditorBtn">✕</button>
        </div>

        <label class="section-editor__label">
          Título
          <input id="sectionTitleInput" type="text" placeholder="Ex.: Núcleo" />
        </label>

        <label class="section-editor__label">
          Tag / função
          <input id="sectionTagInput" type="text" placeholder="Ex.: Centro" />
        </label>

        <label class="section-editor__label">
          Preset
          <select id="sectionPresetInput"></select>
        </label>

        <label class="section-editor__label">
          URL da session / iframe
          <input id="sectionUrlInput" type="url" placeholder="https://..." />
        </label>

        <label class="section-editor__label">
          HTML da seção
          <textarea id="sectionHtmlInput" spellcheck="false" placeholder="<div>..."></textarea>
        </label>

        <div class="section-editor__actions">
          <input id="sectionFileInput" type="file" accept=".html,.htm,.txt" hidden>
          <button type="button" id="pasteFromClipboardBtn">Colar HTML</button>
          <button type="button" id="importFileBtn">Importar arquivo</button>
          <button type="button" id="saveSectionBtn">Salvar seção</button>
          <button type="button" id="openSectionBtn">Abrir session</button>
        </div>

        <small class="section-editor__hint">
          Toque curto na seção abre a session. Long press abre este painel. Long press no dot também abre o painel.
        </small>
      </div>
    `;

    document.body.appendChild(editor);

    const presetSelect = document.getElementById("sectionPresetInput");
    presetSelect.innerHTML = PRESET_OPTIONS
      .map((opt) => `<option value="${opt.value}">${opt.label}</option>`)
      .join("");

    document.getElementById("closeSectionEditorBtn").addEventListener("click", closeSectionEditor);
    document.getElementById("saveSectionBtn").addEventListener("click", saveActiveSection);
    document.getElementById("openSectionBtn").addEventListener("click", openActiveSession);
    document.getElementById("pasteFromClipboardBtn").addEventListener("click", pasteFromClipboard);

    document.getElementById("importFileBtn").addEventListener("click", () => {
      document.getElementById("sectionFileInput").click();
    });

    document.getElementById("sectionFileInput").addEventListener("change", (e) => {
      importSectionFile(e.target.files && e.target.files[0]);
      e.target.value = "";
    });

    editor.addEventListener("click", (e) => {
      if (e.target.id === "sectionEditor") closeSectionEditor();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSectionEditor();
    });
  }

  function setEditorPresetOptions(value) {
    const select = document.getElementById("sectionPresetInput");
    if (!select) return;

    select.value = value || "portal";
  }

  function openSectionEditor(row, col) {
    ensureEditor();

    activeSection = { row, col };
    const data = getSlotData(row, col);

    document.getElementById("sectionEditorTitle").textContent =
      `Editar seção ${row * 3 + col + 1}`;

    document.getElementById("sectionTitleInput").value = data.title || "";
    document.getElementById("sectionTagInput").value = data.tag || "";
    document.getElementById("sectionUrlInput").value = data.url || DEFAULT_SESSION_URL;
    document.getElementById("sectionHtmlInput").value = data.html || "";
    setEditorPresetOptions(data.preset);

    const editor = document.getElementById("sectionEditor");
    editor.classList.remove("hidden");
    editor.setAttribute("aria-hidden", "false");
  }

  function closeSectionEditor() {
    const editor = document.getElementById("sectionEditor");
    if (!editor) return;

    editor.classList.add("hidden");
    editor.setAttribute("aria-hidden", "true");
  }

  function saveActiveSection() {
    const title = document.getElementById("sectionTitleInput").value.trim() || "";
    const tag = document.getElementById("sectionTagInput").value.trim() || "";
    const preset = document.getElementById("sectionPresetInput").value || "portal";
    const url = document.getElementById("sectionUrlInput").value.trim() || DEFAULT_SESSION_URL;
    const html = document.getElementById("sectionHtmlInput").value;

    setSlotData(activeSection.row, activeSection.col, {
      title,
      tag,
      preset,
      url,
      html
    });

    buildGrid();
    updateView();
    closeSectionEditor();
  }

  function openActiveSession() {
    const url = document.getElementById("sectionUrlInput").value.trim() || DEFAULT_SESSION_URL;
    loadSession(url);
    closeSectionEditor();
  }

  async function pasteFromClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      const ta = document.getElementById("sectionHtmlInput");
      if (text) ta.value = text;
    } catch {
      alert("O navegador bloqueou a leitura da área de transferência.");
    }
  }

  function importSectionFile(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      document.getElementById("sectionHtmlInput").value = sanitizeSectionHtml(text);
    };
    reader.readAsText(file);
  }

  function buildGrid() {
    if (!grid) return;

    grid.innerHTML = "";

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const data = getSlotData(r, c);

        const screen = document.createElement("div");
        screen.className = "screen";
        screen.dataset.row = String(r);
        screen.dataset.col = String(c);
        screen.dataset.url = data.url || DEFAULT_SESSION_URL;
        screen.dataset.title = data.title || "";
        screen.dataset.tag = data.tag || "";
        screen.dataset.preset = data.preset || "";

        screen.innerHTML = data.html || blankSlotHtml(`Seção ${r * 3 + c + 1}`, "Cole seu HTML aqui");

        attachScreenPressBehavior(screen, r, c);
        grid.appendChild(screen);
      }
    }
  }

  function attachScreenPressBehavior(screen, row, col) {
    let pressTimer = null;
    let pressStartX = 0;
    let pressStartY = 0;
    let pressStartTime = 0;
    let longPressed = false;
    let moved = false;

    const MOVE_LIMIT = 12;
    const LONG_PRESS_MS = 3550;

    const clearPress = () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    screen.addEventListener("pointerdown", (e) => {
      if (e.button !== undefined && e.button !== 0) return;

      pressStartX = e.clientX;
      pressStartY = e.clientY;
      pressStartTime = Date.now();
      longPressed = false;
      moved = false;

      clearPress();
      pressTimer = setTimeout(() => {
        longPressed = true;
        openSectionEditor(row, col);
      }, LONG_PRESS_MS);
    });

    screen.addEventListener("pointermove", (e) => {
      if (!pressTimer) return;

      const dx = Math.abs(e.clientX - pressStartX);
      const dy = Math.abs(e.clientY - pressStartY);

      if (dx > MOVE_LIMIT || dy > MOVE_LIMIT) {
        moved = true;
        clearPress();
      }
    });

    screen.addEventListener("pointerup", () => {
      const elapsed = Date.now() - pressStartTime;
      clearPress();

      if (longPressed || moved) return;
      if (elapsed >= LONG_PRESS_MS) return;

      const url = screen.dataset.url || DEFAULT_SESSION_URL;
      loadSession(url);
    });

    screen.addEventListener("pointercancel", () => {
      clearPress();
    });

    screen.addEventListener("contextmenu", (e) => {
      e.preventDefault();
    });
  }

  function attachDotBehavior(dot, row, col) {
    let pressTimer = null;
    let pressStartX = 0;
    let pressStartY = 0;
    let longPressed = false;
    let moved = false;

    const MOVE_LIMIT = 10;
    const LONG_PRESS_MS = 3550;

    const clearPress = () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    dot.addEventListener("pointerdown", (e) => {
      if (e.button !== undefined && e.button !== 0) return;

      pressStartX = e.clientX;
      pressStartY = e.clientY;
      longPressed = false;
      moved = false;

      clearPress();
      pressTimer = setTimeout(() => {
        longPressed = true;
        openSectionEditor(row, col);
      }, LONG_PRESS_MS);
    });

    dot.addEventListener("pointermove", (e) => {
      if (!pressTimer) return;

      const dx = Math.abs(e.clientX - pressStartX);
      const dy = Math.abs(e.clientY - pressStartY);

      if (dx > MOVE_LIMIT || dy > MOVE_LIMIT) {
        moved = true;
        clearPress();
      }
    });

    dot.addEventListener("pointerup", () => {
      clearPress();
      if (longPressed || moved) return;
      navigateTo(row, col);
    });

    dot.addEventListener("pointercancel", clearPress);
    dot.addEventListener("contextmenu", (e) => e.preventDefault());
  }

  function buildNav() {
    if (!nav) return;

    nav.innerHTML = "";

    for (let i = 0; i < 9; i++) {
      const dot = document.createElement("div");
      dot.className = "dot";

      const r = Math.floor(i / 3);
      const c = i % 3;
      const meta = defaultPresetMeta(r, c);

      dot.title = `${meta.title} · ${meta.tag}`;
      dot.dataset.row = String(r);
      dot.dataset.col = String(c);

      attachDotBehavior(dot, r, c);
      nav.appendChild(dot);
    }
  }

  function updateView() {
    if (!ZPR) return;

    const tx = -currentCol * (100 / 3);
    const ty = -currentRow * (100 / 3);
    ZPR.style.transform = `translate(${tx}%, ${ty}%)`;

    document.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle(
        "active",
        Math.floor(i / 3) === currentRow && i % 3 === currentCol
      );
    });
  }

  window.navigateTo = function (row, col) {
    if (row < 0 || row >= ROWS || col < 0 || col >= COLS) return;
    if (row === currentRow && col === currentCol) return;
    if (isAnimating) return;

    isAnimating = true;
    currentRow = row;
    currentCol = col;
    updateView();

    setTimeout(() => {
      isAnimating = false;
    }, 560);
  };

  function handleSwipe(dx, dy) {
    const ax = Math.abs(dx);
    const ay = Math.abs(dy);
    const SWIPE_DIST = 45;

    if (ax > ay && ax > SWIPE_DIST) {
      dx < 0
        ? navigateTo(currentRow, currentCol + 1)
        : navigateTo(currentRow, currentCol - 1);
    } else if (ay > ax && ay > SWIPE_DIST) {
      dy < 0
        ? navigateTo(currentRow + 1, currentCol)
        : navigateTo(currentRow - 1, currentCol);
    }
  }

  const drag = { x: 0, y: 0, t: 0, active: false };
  const SWIPE_TIME = 350;

  document.addEventListener(
    "touchstart",
    (e) => {
      if (!e.touches || !e.touches[0]) return;
      drag.x = e.touches[0].clientX;
      drag.y = e.touches[0].clientY;
      drag.t = Date.now();
      drag.active = true;
    },
    { passive: true }
  );

  document.addEventListener(
    "touchend",
    (e) => {
      if (!drag.active || !e.changedTouches || !e.changedTouches[0]) return;

      const dx = e.changedTouches[0].clientX - drag.x;
      const dy = e.changedTouches[0].clientY - drag.y;
      const dt = Date.now() - drag.t;

      drag.active = false;
      if (dt > SWIPE_TIME) return;

      handleSwipe(dx, dy);
    },
    { passive: true }
  );

  document.addEventListener("mousedown", (e) => {
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.t = Date.now();
    drag.active = true;
  });

  document.addEventListener("mouseup", (e) => {
    if (!drag.active) return;

    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    const dt = Date.now() - drag.t;

    drag.active = false;
    if (dt > SWIPE_TIME || (Math.abs(dx) < 45 && Math.abs(dy) < 45)) return;

    handleSwipe(dx, dy);
  });

  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowRight":
        navigateTo(currentRow, currentCol + 1);
        break;
      case "ArrowLeft":
        navigateTo(currentRow, currentCol - 1);
        break;
      case "ArrowDown":
        navigateTo(currentRow + 1, currentCol);
        break;
      case "ArrowUp":
        navigateTo(currentRow - 1, currentCol);
        break;
      case "Home":
        navigateTo(1, 1);
        break;
    }
  });

  let wheelCooldown = false;

  document.addEventListener(
    "wheel",
    (e) => {
      if (wheelCooldown) return;

      wheelCooldown = true;
      setTimeout(() => {
        wheelCooldown = false;
      }, 700);

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.deltaY > 0
          ? navigateTo(currentRow + 1, currentCol)
          : navigateTo(currentRow - 1, currentCol);
      } else {
        e.deltaX > 0
          ? navigateTo(currentRow, currentCol + 1)
          : navigateTo(currentRow, currentCol - 1);
      }
    },
    { passive: true }
  );

  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".di_icons-btn[data-url], .symbol-button[data-url]");
    if (!btn) return;

    const url = btn.dataset.url || DEFAULT_SESSION_URL;
    loadSession(url);
  });

  buildGrid();
  buildNav();
  updateView();
  ensureEditor();
})();