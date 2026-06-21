(() => {
  if (window.KoduxBrain?.__brainStable) return;

  const Brain = {
    __brainStable: true,
    state: {},
    raf: 0,
    idleTimer: 0,
    _bound: false,

    // =========================
    // STORAGE (0x01)
    // =========================
    readAll() {
      const data = {};
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        const raw = localStorage.getItem(k);
        try { data[k] = JSON.parse(raw); } catch { data[k] = raw; }
      }
      this.state = data;
      return data;
    },

    get(key, fallback = null) {
      const v = this.state[key];
      return v === undefined ? fallback : v;
    },

    set(key, value) {
      localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
      this.state[key] = value;
      this.sync();
      return value;
    },

    // =========================
    // HELPERS (0x02-0x07)
    // =========================
    norm(v, fallback = "Convidado") {
      const s = String(v ?? "").trim();
      return s || fallback;
    },

    resolveName() {
      // 5 fontes de identidade em cascata
      const master = this.get("di_userName", "")?.trim?.() || "";
      if (master) return master;
      const inputUser = document.querySelector("#inputUser")?.value?.trim();
      if (inputUser) return inputUser;

      const compatUser = this.get("userName", "")?.trim?.() || "";
      if (compatUser) return compatUser;

      const infodoseStore = this.get("infodose:userName", "")?.trim?.() || "";
      if (infodoseStore) return infodoseStore;

      const infodoseInput = document.querySelector("#infodoseNameInput")?.value?.trim();
      if (infodoseInput) return infodoseInput;

      return "Convidado";
    },

    setText(sel, value) {
      const el = document.querySelector(sel);
      if (el) el.textContent = value;
    },

    setHtml(sel, value) {
      const el = document.querySelector(sel);
      if (el) el.innerHTML = value;
    },

    // MurmurHash3 — Selo criptográfico (0x07)
    hashStr(s = "") {
      let h = 0xdeadbeef;
      for (let i = 0; i < s.length; i++) {
        h = Math.imul(h ^ s.charCodeAt(i), 2654435761);
      }
      return (h ^ (h >>> 16)) >>> 0;
    },

    // ✦ CORREÇÃO CRÍTICA: makeOrbAvatar (0x04) ✦
    makeOrbAvatar(name = "DUAL", size = 64) {
      const safe = this.norm(name, "DUAL");
      const seed = this.hashStr(safe);
      const baseHue = seed % 360;
      const accentHue = (seed * 1.618) % 360;
      const id = "orb_" + seed.toString(36);

      // Usa cor do sistema se disponível
      const usePrimary = getComputedStyle(document.documentElement)
        .getPropertyValue("--kob-voice-primary")
        .trim();

      const c1 = usePrimary || `hsl(${baseHue},100%,65%)`;
      const c2 = usePrimary || `hsl(${accentHue},90%,45%)`;
      return `
        <svg width="${size}" height="${size}" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="${gid}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="hsl(${baseHue},100%,55%)"/>
              <stop offset="100%" stop-color="hsl(${accentHue},90%,45%)"/>
            </linearGradient>
          </defs>
          <rect width="32" height="32" rx="7" fill="#071018"/>
          <circle cx="16" cy="16" r="9" fill="url(#${id})" opacity="0.25"/>
          <circle cx="16" cy="16" r="7" fill="url(#${id})"/>
          <circle cx="16" cy="16" r="13" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="1"/>
        </svg>
      `;
    },

    renderOrb(targetSel, name, size) {
      const el = document.querySelector(targetSel);
      if (!el) return;
      const safe = this.norm(name, "DUAL");
      el.dataset.orbName = safe;
      el.innerHTML = this.makeOrbAvatar(safe, size);
    },

    // =========================
    // SOURCE OF TRUTH (0x03-0x06)
    // =========================
    syncIdentity(name = null, source = null) {
      const safe = this.norm(name ?? this.resolveName(), "Convidado");

      if (source === "master") {
        localStorage.setItem("di_userName", safe);
        localStorage.setItem("userName", safe);
        this.state.di_userName = safe;
        this.state.userName = safe;
      }

      if (source === "infodose") {
        localStorage.setItem("infodose:userName", safe);
        this.state["infodose:userName"] = safe;
      }

      // Expansão para toda UI (0x03)
      document.documentElement.dataset.diName = safe;
      document.body.dataset.user = safe;

      this.setText("#lblName", safe);
      this.setText("#actName", safe);
      this.setText("#smallText", safe);
      this.setText("#hudStatus", safe);      this.setText("#usernameDisplay", safe);

      const hasActiveKey =
        Boolean((this.get("di_apiKey", "") || "").trim()) ||
        Boolean(window.STATE?.keys?.some?.(k => k?.active));

      const activeKey = window.STATE?.keys?.find?.(k => k?.active);
      const smallIdent = activeKey?.name || (hasActiveKey ? "active" : "--");

      this.setText("#smallIdent", smallIdent);
      this.setText("#actBadge", hasActiveKey ? "key:active" : "v:--");

      this.renderOrb("#main-orb", safe, 48);
      this.renderOrb("#avatarTarget", safe, 64);
      this.renderOrb("#smallMiniAvatar", safe, 24);
      this.renderOrb("#actMiniAvatar", safe, 24);
    },

    syncTheme() {
      const theme = this.get("dual_theme", this.get("theme", "dark"));
      const solar = this.get("di_solarMode", "auto");
      const visual = this.get("arch:visualPreset", "cinematic-soft");
      const bloom = this.get("dual.ui.bloom", 0);

      document.body.dataset.theme = theme;
      document.body.dataset.solar = solar;
      document.body.dataset.visual = visual;
      document.documentElement.style.setProperty("--ui-bloom", String(bloom));
    },

    syncMode() {
      const mode =
        this.get("fusion_os_ui_state", {})?.mode ||
        this.get("bodyPlayerMode") ||
        document.body.dataset.mode ||
        "player";

      const bodyPlayer = document.querySelector("#bodyPlayer");
      if (bodyPlayer) bodyPlayer.dataset.mode = mode;
      document.body.dataset.mode = mode;
    },

    // Fusão espacial mainCard ↔ symbolBar (0x05)
    syncFusionState() {
      const mainCard = document.querySelector("#mainCard");
      const symbolBar = document.querySelector("#symbolBar");
      if (!mainCard || !symbolBar) return;

      const card = mainCard.getBoundingClientRect();
      const bar = symbolBar.getBoundingClientRect();
      const dx = Math.max(0, Math.max(card.left - bar.right, bar.left - card.right));
      const dy = Math.max(0, Math.max(card.top - bar.bottom, bar.top - card.bottom));
      const dist = Math.hypot(dx, dy);

      const near = dist < 180;
      const fused = dist < 96;

      mainCard.classList.toggle("di-near-bar", near);
      mainCard.classList.toggle("di-fused", fused);
      symbolBar.classList.toggle("di-fuse-glow", near);

      const btnArch = document.querySelector("#btn-arch");
      if (btnArch) btnArch.classList.toggle("di-orb-returning", fused);
    },

    hydrateInputs() {
      const master = this.get("di_userName", "")?.trim?.() || "";
      const infodose = this.get("infodose:userName", "")?.trim?.() || "";
      const apiKey = this.get("di_apiKey", "");
      const model = this.get("di_modelName", "");

      const inputUser = document.querySelector("#inputUser");
      if (inputUser && !inputUser.value && master) inputUser.value = master;

      const infodoseInput = document.querySelector("#infodoseNameInput");
      if (infodoseInput && !infodoseInput.value && infodose) infodoseInput.value = infodose;

      const apiKeyInput = document.querySelector("#apiKeyInput");
      if (apiKeyInput && !apiKeyInput.value && apiKey) apiKeyInput.value = apiKey;

      const modelSelect = document.querySelector("#modelSelect");
      if (modelSelect && model) modelSelect.value = model;
    },

    // =========================
    // BINDINGS (0x0A-0x0B)
    // =========================
    bindInputs() {
      const bind = (sel, onChange) => {
        const el = document.querySelector(sel);
        if (!el || el.dataset.brainBound === "1") return;
        el.dataset.brainBound = "1";
        const run = () => onChange(el.value);
        el.addEventListener("input", run);
        el.addEventListener("change", run);
      };

      bind("#inputUser", (v) => {
        this.syncIdentity(this.norm(v, "Convidado"), "master");        this.syncFusionState();
      });

      bind("#infodoseNameInput", (v) => {
        this.syncIdentity(this.norm(v, "Convidado"), "infodose");
      });

      bind("#apiKeyInput", (v) => {
        const safe = (v || "").trim();
        localStorage.setItem("di_apiKey", safe);
        this.state.di_apiKey = safe;
        this.syncIdentity();
      });

      bind("#modelSelect", (v) => {
        const safe = (v || "").trim();
        localStorage.setItem("di_modelName", safe);
        this.state.di_modelName = safe;
      });

      const saveBtn = document.querySelector("#saveSystemBtn");
      if (saveBtn && saveBtn.dataset.brainBound !== "1") {
        saveBtn.dataset.brainBound = "1";
        saveBtn.addEventListener("click", () => {
          this.readAll();
          this.hydrateInputs();
          this.syncIdentity();
          this.syncTheme();
          this.syncMode();
          this.syncFusionState();
        });
      }
    },

    bindEvents() {
      if (this._bound) return;
      this._bound = true;

      window.addEventListener("storage", () => { this.readAll(); this.sync(); });

      document.addEventListener("di:name:update", (e) => {
        const name = this.norm(e.detail?.name, "");
        if (!name) return;
        this.syncIdentity(name, "master");
        this.syncFusionState();
      });

      document.addEventListener("pointerdown", () => this.pingIdle(false), { passive: true });
      document.addEventListener("pointermove", () => this.pingIdle(false), { passive: true });
      document.addEventListener("keydown", () => this.pingIdle(false));      document.addEventListener("scroll", () => this.pingIdle(false), { passive: true });
    },

    // Idle — 1870ms de silêncio (0x08)
    pingIdle(isIdle) {
      clearTimeout(this.idleTimer);
      const targets = document.querySelectorAll(".kob-tts-dock, #kodux-widget, [data-idle-target]");
      targets.forEach(el => el.classList.toggle("idle", !!isIdle));
      this.idleTimer = setTimeout(() => {
        targets.forEach(el => el.classList.add("idle"));
      }, 1870);
    },

    // Sync — requestAnimationFrame (0x09)
    sync() {
      cancelAnimationFrame(this.raf);
      this.raf = requestAnimationFrame(() => {
        this.readAll();
        this.hydrateInputs();
        this.syncIdentity();
        this.syncTheme();
        this.syncMode();
        this.syncFusionState();
        this.bindInputs();
      });
    },

    // BOOT — Nascimento do cérebro (0x0C)
    boot() {
      this.readAll();
      this.bindEvents();
      this.bindInputs();
      this.hydrateInputs();
      this.syncIdentity();
      this.syncTheme();
      this.syncMode();
      this.syncFusionState();
      this.pingIdle(false);

      // MutationObserver — Eternização
      const observer = new MutationObserver(() => this.syncFusionState());
      observer.observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["class", "style", "data-mode", "data-theme"]
      });

      window.addEventListener("resize", () => this.syncFusionState(), { passive: true });
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
          this.sync();
          this.syncFusionState();
        }, { once: true });
      } else {
        this.sync();
        this.syncFusionState();
      }
    }
  };

  // ═══════════════════════════════════════════════════════════════════
  // EXPORTAÇÃO GLOBAL (0x0B)
  // ═══════════════════════════════════════════════════════════════════
  window.KoduxBrain = Brain;

  window.DI = window.DI || {};
  window.DI.syncNameUI = (name) => Brain.syncIdentity(name, "master");
  window.DI.renderOrb = (...args) => Brain.renderOrb(...args);
  window.DI.makeOrbAvatar = (...args) => Brain.makeOrbAvatar(...args);

  // ✠ BOOT ✠
  Brain.boot();

  console.log("✠ KODUXBRAIN ATIVO · 13 Opcodes · SELO 0x00 ✠");
  console.log("3 × 6 × 9 × 7 = 1134 Hz = ∞");
})();
