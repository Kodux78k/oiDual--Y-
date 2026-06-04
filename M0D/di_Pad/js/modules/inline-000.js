const ROWS = 3;
const COLS = 3;

const DEFAULT_SESSION_URL = "https://kodux78k.github.io/oiDual--Y-/";
const STORE_KEY = "kx_section_store_v2";

const grid = document.getElementById("grid");
const nav = document.getElementById("navMatrix");

let currentRow = 1;
let currentCol = 1;
let isAnimating = false;

let sectionStore = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
let activeSection = { row: 0, col: 0 };

const screensData = [
  [
    {
      html: `<div class="inner"><div class="wrap stack"><div class="blank-slot">Seção 1 · cole seu HTML aqui</div></div></div>`,
      url: DEFAULT_SESSION_URL
    },
    {
      html: `

        <iframe
          class="win-frame"
          src="https://kodux78k.github.io/oiDual-H0/DH0-10.html"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
          allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          loading="lazy">
        </iframe>
     `,
      url: DEFAULT_SESSION_URL
    },
    {
      html: `<div class="inner"><div class="wrap stack"><div class="blank-slot">Seção 3 · cole seu HTML aqui</div></div></div>`,
      url: DEFAULT_SESSION_URL
    }
  ],
  [
    {
      html: `<div class="inner"><div class="wrap stack"><div class="blank-slot">Seção 4 · cole seu HTML aqui</div></div></div>`,
      url: DEFAULT_SESSION_URL
    },
    {
      html: `<div class="inner"><div class="wrap stack"><div class="blank-slot">Seção 5 · cole seu HTML aqui</div></div></div>`,
      url: DEFAULT_SESSION_URL
    },
    {
      html: `<div class="inner"><div class="wrap stack"><div class="blank-slot">Seção 6 · cole seu HTML aqui</div></div></div>`,
      url: DEFAULT_SESSION_URL
    }
  ],
  [
    {
      html: `<div class="inner"><div class="wrap stack"><div class="blank-slot">Seção 7 · cole seu HTML aqui</div></div></div>`,
      url: DEFAULT_SESSION_URL
    },
    {
      html: `<div class="inner"><div class="wrap stack"><div class="blank-slot">Seção 8 · cole seu HTML aqui</div></div></div>`,
      url: DEFAULT_SESSION_URL
    },
    {
      html: `<div class="inner"><div class="wrap stack"><div class="blank-slot">Seção 9 · cole seu HTML aqui</div></div></div>`,
      url: DEFAULT_SESSION_URL
    }
  ]
];

function slotKey(row, col) {
  return `${row}-${col}`;
}

function defaultSlotData(row, col) {
  return {
    html: screensData?.[row]?.[col]?.html || `<div class="inner"><div class="wrap stack"><div class="blank-slot">Seção ${row * 3 + col + 1} · cole seu HTML aqui</div></div></div>`,
    url: screensData?.[row]?.[col]?.url || DEFAULT_SESSION_URL
  };
}

function getSlotData(row, col) {
  const key = slotKey(row, col);
  return sectionStore[key] || defaultSlotData(row, col);
}

function setSlotData(row, col, data) {
  const key = slotKey(row, col);
  const current = getSlotData(row, col);

  sectionStore[key] = {
    html: data.html ?? current.html,
    url: data.url ?? current.url
  };

  localStorage.setItem(STORE_KEY, JSON.stringify(sectionStore));
}

function loadSession(url) {
  const iframe = document.querySelector("#session-iframe iframe");
  if (!iframe) return;

  const nextUrl = url || DEFAULT_SESSION_URL;
  iframe.src = nextUrl;
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
        Long press na seção abre este painel. Toque curto abre a session.
      </small>
    </div>
  `;

  document.body.appendChild(editor);

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

function openSectionEditor(row, col) {
  ensureEditor();

  activeSection = { row, col };
  const data = getSlotData(row, col);

  document.getElementById("sectionEditorTitle").textContent =
    `Editar seção ${row * 3 + col + 1}`;

  document.getElementById("sectionUrlInput").value = data.url || DEFAULT_SESSION_URL;
  document.getElementById("sectionHtmlInput").value = data.html || "";

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
  const url = document.getElementById("sectionUrlInput").value.trim() || DEFAULT_SESSION_URL;
  const html = document.getElementById("sectionHtmlInput").value;

  setSlotData(activeSection.row, activeSection.col, { url, html });
  buildGrid();
  updateView();
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
  } catch (err) {
    alert("O navegador bloqueou a leitura da área de transferência.");
  }
}

function importSectionFile(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    document.getElementById("sectionHtmlInput").value = String(reader.result || "");
  };
  reader.readAsText(file);
}

function buildGrid() {
  grid.innerHTML = "";

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const data = getSlotData(r, c);

      const screen = document.createElement("div");
      screen.className = "screen";
      screen.dataset.row = String(r);
      screen.dataset.col = String(c);
      screen.dataset.url = data.url || DEFAULT_SESSION_URL;
      screen.innerHTML = data.html;

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
  const LONG_PRESS_MS = 550;

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

function buildNav() {
  nav.innerHTML = "";

  for (let i = 0; i < 9; i++) {
    const dot = document.createElement("div");
    dot.className = "dot";

    const r = Math.floor(i / 3);
    const c = i % 3;

    dot.addEventListener("click", () => navigateTo(r, c));
    nav.appendChild(dot);
  }
}

function updateView() {
  const tx = -currentCol * (100 / 3);
  const ty = -currentRow * (100 / 3);
  grid.style.transform = `translate(${tx}%, ${ty}%)`;

  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", Math.floor(i / 3) === currentRow && i % 3 === currentCol);
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
    dx < 0 ? navigateTo(currentRow, currentCol + 1) : navigateTo(currentRow, currentCol - 1);
  } else if (ay > ax && ay > SWIPE_DIST) {
    dy < 0 ? navigateTo(currentRow + 1, currentCol) : navigateTo(currentRow - 1, currentCol);
  }
}

const drag = { x: 0, y: 0, t: 0, active: false };
const SWIPE_TIME = 350;

document.addEventListener("touchstart", (e) => {
  drag.x = e.touches[0].clientX;
  drag.y = e.touches[0].clientY;
  drag.t = Date.now();
  drag.active = true;
}, { passive: true });

document.addEventListener("touchend", (e) => {
  if (!drag.active) return;

  const dx = e.changedTouches[0].clientX - drag.x;
  const dy = e.changedTouches[0].clientY - drag.y;
  const dt = Date.now() - drag.t;

  drag.active = false;
  if (dt > SWIPE_TIME) return;

  handleSwipe(dx, dy);
}, { passive: true });

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
document.addEventListener("wheel", (e) => {
  if (wheelCooldown) return;

  wheelCooldown = true;
  setTimeout(() => {
    wheelCooldown = false;
  }, 700);

  if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
    e.deltaY > 0 ? navigateTo(currentRow + 1, currentCol) : navigateTo(currentRow - 1, currentCol);
  } else {
    e.deltaX > 0 ? navigateTo(currentRow, currentCol + 1) : navigateTo(currentRow, currentCol - 1);
  }
}, { passive: true });

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
