/* ═══════════════════════════════════════════════════════════
   DI BUTTON ICON LOADER + LONG PRESS PANEL
   ═══════════════════════════════════════════════════════════ */

(() => {
  "use strict";

  const CACHE_KEY = "di_btn_icon_cache_v2";
  const STORAGE_PREFIX = "symbol_button_";
  const LP = 1870;
  const DASH = 2 * Math.PI * 19;

  let _activeBtn = null;
  let _timer = null;
  let _raf = null;
  let _t0 = null;

  const cache = loadCache();

  function storageGet(storage, key) {
    try {
      const raw = storage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function storageSet(storage, key, value) {
    try {
      storage.setItem(key, JSON.stringify(value));
    } catch {}
  }

  function storageRemove(storage, key) {
    try {
      storage.removeItem(key);
    } catch {}
  }

  function loadCache() {
    return storageGet(localStorage, CACHE_KEY) || {};
  }

  function saveCache(nextCache) {
    storageSet(localStorage, CACHE_KEY, nextCache);
  }

  function normKey(url) {
    try {
      return new URL(url, location.href).href;
    } catch {
      return String(url || "");
    }
  }

  function getStorageKey(btn) {
    if (!btn) return null;
    if (btn.id) return `${STORAGE_PREFIX}${btn.id}`;
    if (btn.dataset.storeKey) return `${STORAGE_PREFIX}${btn.dataset.storeKey}`;
    return null;
  }

  async function fetchText(url) {
    const res = await fetch(url, { mode: "cors", credentials: "omit" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  }

  async function fetchJSON(url) {
    const res = await fetch(url, { mode: "cors", credentials: "omit" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  }

  function pickBestIcon(icons = []) {
    if (!Array.isArray(icons) || !icons.length) return null;

    const parsed = icons
      .map((i) => ({
        ...i,
        sizeNum: (() => {
          const m = String(i.sizes || "").match(/(\d+)\s*x\s*(\d+)/i);
          return m ? Math.max(+m[1], +m[2]) : 0;
        })()
      }))
      .sort((a, b) => b.sizeNum - a.sizeNum);

    return (
      parsed.find((i) => String(i.sizes || "").includes("192")) ||
      parsed.find((i) => i.sizeNum >= 192) ||
      parsed[0] ||
      null
    );
  }

  async function resolveIcon(url) {
    const key = normKey(url);
    if (cache[key]) return cache[key];

    try {
      const base = new URL(key);
      const html = await fetchText(base.href);
      const doc = new DOMParser().parseFromString(html, "text/html");

      const manifestLink = doc.querySelector('link[rel="manifest"]');
      if (manifestLink) {
        const manifestUrl = new URL(manifestLink.getAttribute("href"), base).href;

        try {
          const manifest = await fetchJSON(manifestUrl);
          const icon = pickBestIcon(manifest?.icons);

          if (icon?.src) {
            const resolved = new URL(icon.src, manifestUrl).href;
            cache[key] = resolved;
            saveCache(cache);
            return resolved;
          }
        } catch {}
      }

      const apple = doc.querySelector(
        'link[rel="apple-touch-icon"], link[rel="apple-touch-icon-precomposed"]'
      );

      if (apple?.getAttribute("href")) {
        const resolved = new URL(apple.getAttribute("href"), base).href;
        cache[key] = resolved;
        saveCache(cache);
        return resolved;
      }

      const shortcut = doc.querySelector('link[rel="shortcut icon"], link[rel="icon"]');

      if (shortcut?.getAttribute("href")) {
        const resolved = new URL(shortcut.getAttribute("href"), base).href;
        cache[key] = resolved;
        saveCache(cache);
        return resolved;
      }

      const fallback = new URL("/favicon.ico", base).href;
      cache[key] = fallback;
      saveCache(cache);
      return fallback;
    } catch {
      const fallback = (() => {
        try {
          return new URL("/favicon.ico", new URL(key, location.href)).href;
        } catch {
          return null;
        }
      })();

      if (fallback) {
        cache[key] = fallback;
        saveCache(cache);
      }

      return fallback;
    }
  }

  function ensureRing(btn) {
    if (!btn || btn.querySelector(".kblx-ring")) return;

    btn.style.position = "relative";

    const d = document.createElement("div");
    d.className = "kblx-ring";
    d.style.position = "absolute";
    d.style.inset = "0";
    d.style.pointerEvents = "none";
    d.style.display = "grid";
    d.style.placeItems = "center";

    d.innerHTML = `
      <svg viewBox="0 0 44 44" aria-hidden="true"
        style="width:100%;height:100%;transform:rotate(-90deg);overflow:visible;">
        <circle
          cx="22"
          cy="22"
          r="19"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-dasharray="${DASH}"
          stroke-dashoffset="${DASH}">
        </circle>
      </svg>
    `;

    btn.appendChild(d);
  }

  function ring(btn, pct) {
    const c = btn?.querySelector(".kblx-ring circle");
    if (!c) return;
    c.style.transition = "none";
    c.style.strokeDashoffset = DASH * (1 - Math.min(pct, 1));
  }

  function ringReset(btn) {
    if (!btn) return;
    const c = btn.querySelector(".kblx-ring circle");
    if (!c) return;
    c.style.transition = "stroke-dashoffset .2s ease";
    c.style.strokeDashoffset = DASH;
  }

  function paintButton(btn, iconUrl) {
    if (!btn || !iconUrl) return;

    btn.classList.add("di-icon-ready");
    btn.dataset.diIconDone = "1";

    btn.innerHTML = "";

    const img = document.createElement("img");
    img.className = "di-btn-icon-img";
    img.alt = "";
    img.loading = "lazy";
    img.decoding = "async";
    img.src = iconUrl;

    img.onerror = () => {
      const fallback = document.createElement("span");
      fallback.className = "di-btn-icon-fallback";
      fallback.textContent = btn.dataset.fallback || "◉";
      btn.innerHTML = "";
      btn.appendChild(fallback);
      ensureRing(btn);
    };

    btn.appendChild(img);
    ensureRing(btn);
  }

  async function processButton(btn) {
    const url = btn?.dataset?.url;
    if (!url) return;

    ensureRing(btn);

    const icon = await resolveIcon(url);
    if (icon) paintButton(btn, icon);
  }

  async function run() {
    const buttons = Array.from(document.querySelectorAll(".symbol-button[data-url], .di_icons-btn[data-url]"));
    await Promise.all(buttons.map(processButton));
  }

  function restoreButtons() {
    document.querySelectorAll(".symbol-button, .di_icons-btn").forEach((btn) => {
      const key = getStorageKey(btn);
      if (!key) return;

      const sessionData = storageGet(sessionStorage, key);
      const localData = storageGet(localStorage, key);
      const data = sessionData || localData;

      if (!data) return;

      if (data.url) {
        btn.dataset.url = data.url;
      }

      if (data.iconUrl) {
        paintButton(btn, data.iconUrl);
      } else if (btn.dataset.url) {
        btn.dataset.diIconDone = "";
        processButton(btn);
      }
    });
  }

  async function updateAttrBtn(
    btn,
    {
      url,
      save = true,
      session = true,
      refresh = true,
      fallback = "◉"
    } = {}
  ) {
    if (!btn || !url) return null;

    const cleanUrl = String(url).trim();
    if (!cleanUrl) return null;

    btn.dataset.url = cleanUrl;
    btn.dataset.fallback = fallback;
    btn.dataset.diIconDone = "";

    ensureRing(btn);

    let iconUrl = null;

    if (refresh) {
      iconUrl = await resolveIcon(cleanUrl);
      if (iconUrl) paintButton(btn, iconUrl);
    }

    const payload = {
      id: btn.id || "",
      url: cleanUrl,
      iconUrl: iconUrl || "",
      updatedAt: Date.now()
    };

    const key = getStorageKey(btn);
    if (key) {
      if (session) storageSet(sessionStorage, key, payload);
      if (save) storageSet(localStorage, key, payload);
      if (!session && !save) {
        storageRemove(sessionStorage, key);
        storageRemove(localStorage, key);
      }
    }

    window.dispatchEvent(new CustomEvent("di-button-updated", { detail: payload }));

    return payload;
  }

  function openPanel(btn) {
    _activeBtn = btn;

    const back = document.getElementById("kblx-back");
    const ttl = document.getElementById("kblx-ttl");
    const inp = document.getElementById("kblx-inp");

    if (!back || !ttl || !inp) return;

    const sym =
      btn.dataset.id ||
      btn.getAttribute("aria-label") ||
      btn.textContent.trim().slice(0, 1) ||
      "?";

    ttl.textContent = 'Botão ' + sym + ' [data-id="' + (btn.dataset.id || "") + '"]';
    inp.value = btn.dataset.url || "";
    back.classList.add("open");
    setTimeout(() => inp.focus(), 80);
  }

  function closePanel() {
    const back = document.getElementById("kblx-back");
    if (!back) return;

    back.classList.remove("open");
    _activeBtn = null;
  }

  function saveUrl() {
    if (!_activeBtn) return;

    const inp = document.getElementById("kblx-inp");
    if (!inp) return;

    const v = inp.value.trim();
    if (v) {
      _activeBtn.dataset.url = v;

      const payload = {
        id: _activeBtn.id || "",
        url: v,
        iconUrl: _activeBtn.querySelector("img")?.src || "",
        updatedAt: Date.now()
      };

      const key = getStorageKey(_activeBtn);
      if (key) {
        storageSet(sessionStorage, key, payload);
        storageSet(localStorage, key, payload);
      }

      window.dispatchEvent(new CustomEvent("di-button-updated", { detail: payload }));

      const hud = document.getElementById("hudStatus");
      if (hud) {
        const prev = hud.textContent;
        hud.textContent = "✓ data-url atualizado";
        setTimeout(() => {
          hud.textContent = prev;
        }, 2500);
      }
    }

    closePanel();
  }

  function bindPanelEvents() {
    const back = document.getElementById("kblx-back");
    const saveBtn = document.getElementById("kblx-btn-save");
    const closeBtn = document.getElementById("kblx-btn-close");

    if (saveBtn && !saveBtn.dataset.bound) {
      saveBtn.dataset.bound = "1";
      saveBtn.addEventListener("click", saveUrl);
    }

    if (closeBtn && !closeBtn.dataset.bound) {
      closeBtn.dataset.bound = "1";
      closeBtn.addEventListener("click", closePanel);
    }

    if (back && !back.dataset.bound) {
      back.dataset.bound = "1";
      back.addEventListener("click", (e) => {
        if (e.target === back) closePanel();
      });
    }

    if (!document.body.dataset.kblxKeyBound) {
      document.body.dataset.kblxKeyBound = "1";
      document.addEventListener("keydown", (e) => {
        const panelOpen = document.getElementById("kblx-back")?.classList.contains("open");
        if (!panelOpen) return;

        if (e.key === "Escape") closePanel();
        if (e.key === "Enter") saveUrl();
      });
    }
  }

  function bindLongPress(btn) {
    if (!btn || btn.dataset.kblxBound === "1") return;
    btn.dataset.kblxBound = "1";

    ensureRing(btn);

    function onDown() {
      _t0 = Date.now();

      clearTimeout(_timer);
      cancelAnimationFrame(_raf);

      _timer = setTimeout(() => {
        cancelAnimationFrame(_raf);
        ringReset(btn);
        _t0 = null;
        bindPanelEvents();
        openPanel(btn);
      }, LP);

      (function tick() {
        if (_t0 === null) return;
        ring(btn, (Date.now() - _t0) / LP);
        _raf = requestAnimationFrame(tick);
      })();
    }

    function onUp() {
      clearTimeout(_timer);
      cancelAnimationFrame(_raf);
      ringReset(btn);
      _t0 = null;
    }

    btn.addEventListener("pointerdown", onDown, { passive: true });
    btn.addEventListener("pointerup", onUp, { passive: true });
    btn.addEventListener("pointerleave", onUp, { passive: true });
    btn.addEventListener("pointercancel", onUp, { passive: true });
  }

  function observeDynamicButtons() {
    const root = document.body;
    if (!root) return;

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === "childList") {
          m.addedNodes.forEach((node) => {
            if (!(node instanceof Element)) return;

            if (node.matches?.(".symbol-button[data-url], .di_icons-btn[data-url]")) {
              ensureRing(node);
              bindLongPress(node);
              processButton(node);
            }

            node
              .querySelectorAll?.(".symbol-button[data-url], .di_icons-btn[data-url]")
              .forEach((btn) => {
                ensureRing(btn);
                bindLongPress(btn);
                processButton(btn);
              });
          });
        }

        if (m.type === "attributes" && m.attributeName === "data-url") {
          const btn = m.target;
          if (btn?.classList?.contains("symbol-button") || btn?.classList?.contains("di_icons-btn")) {
            btn.dataset.diIconDone = "";
            ensureRing(btn);
            bindLongPress(btn);
            processButton(btn);
          }
        }
      }
    });

    mo.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-url"]
    });
  }

  function init() {
    bindPanelEvents();
    restoreButtons();
    run();

    document
      .querySelectorAll(".symbol-button[data-url], .di_icons-btn[data-url]")
      .forEach((btn) => {
        ensureRing(btn);
        bindLongPress(btn);
      });

    observeDynamicButtons();
  }

  window.DI_ICON_LOADER = {
    refresh: run,
    clearCache() {
      Object.keys(cache).forEach((k) => delete cache[k]);
      saveCache(cache);
    },
    updateAttrBtn,
    restoreButtons
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();