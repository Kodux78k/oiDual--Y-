(() => {
  "use strict";

  /* =========================================================
     SELECTORES REAIS DO SEU MOTOR
  ========================================================= */

  const els = {

    navMatrix:
      document.querySelector("#navMatrix"),

    mainCard:
      document.querySelector("#mainCard"),

    avatarTarget:
      document.querySelector("#avatarTarget"),

    inputUser:
      document.querySelector("#inputUserId"),

    themeSwitch:
      document.querySelector("#themeSwitch"),

    usernameDisplay:
      document.querySelector("#usernameDisplay"),

    orbToggle:
      document.querySelector("#orbToggle"),

    modeIndicator:
      document.querySelector("#modeIndicator")
  };

  /* =========================================================
     STORAGE
  ========================================================= */

  const STORAGE = {

    USER:
      "DI_USERNAME",

    THEME:
      "DI_THEME",

    ARCH:
      "DI_ARCH",

    ZPR:
      "DI_ZPR",

    INTENSITY:
      "DI_INTENSITY",

    ORBITALS:
      "DI_ORBITALS"
  };

  /* =========================================================
     ENGINE
  ========================================================= */

  const engine = {

    set(key, value) {

      document.body.dataset[key] = value;

      localStorage.setItem(
        `DI_${key.toUpperCase()}`,
        value
      );
    },

    get(key, fallback = "") {

      return (
        document.body.dataset[key] ||
        localStorage.getItem(
          `DI_${key.toUpperCase()}`
        ) ||
        fallback
      );
    }
  };

  /* =========================================================
     HASH
  ========================================================= */

  function hashString(str = "") {

    let hash = 0;

    for (let i = 0; i < str.length; i++) {

      hash =
        str.charCodeAt(i) +
        ((hash << 5) - hash);

      hash |= 0;
    }

    return Math.abs(hash);
  }

  /* =========================================================
     HCL / SPECTRUM
  ========================================================= */

  function generateSpectrum(username = "Convidado") {

    const seed =
      hashString(username);

    const h1 =
      seed % 360;

    const h2 =
      (h1 + 120 + (seed % 90)) % 360;

    const h3 =
      (h2 + 120 + (seed % 45)) % 360;

    return {

      primary:
        `hsl(${h1} 92% 60%)`,

      secondary:
        `hsl(${h2} 88% 48%)`,

      accent:
        `hsl(${h3} 90% 72%)`,

      glow:
        `hsla(${h1} 100% 70% / .35)`,

      overlay:
        `hsla(${h2} 100% 60% / .12)`
    };
  }

  /* =========================================================
     APPLY USER COLORS
  ========================================================= */

  function applySpectrum(username) {

    const spectrum =
      generateSpectrum(username);

    const root =
      document.documentElement;

    root.style.setProperty(
      "--user-primary",
      spectrum.primary
    );

    root.style.setProperty(
      "--user-secondary",
      spectrum.secondary
    );

    root.style.setProperty(
      "--user-accent",
      spectrum.accent
    );

    root.style.setProperty(
      "--user-glow",
      spectrum.glow
    );

    root.style.setProperty(
      "--user-overlay",
      spectrum.overlay
    );
  }

  /* =========================================================
     ORB AVATAR
  ========================================================= */

  function createOrbitalLayer(index) {

    const orbital =
      document.createElement("span");

    orbital.className =
      "di-orbital";

    orbital.style.setProperty(
      "--i",
      index
    );

    orbital.style.animationDuration =
      `${8 + (index * 2)}s`;

    orbital.style.inset =
      `${-10 - (index * 9)}px`;

    orbital.style.opacity =
      (1 - (index * 0.08)).toFixed(2);

    return orbital;
  }

  function buildOrb(target, count = 3) {

    if (!target) return;

    target.innerHTML = `
      <div class="di-user-orb">
        <div class="di-orb-core"></div>
      </div>
    `;

    const orb =
      target.querySelector(".di-user-orb");

    for (let i = 0; i < count; i++) {

      orb.appendChild(
        createOrbitalLayer(i)
      );
    }
  }

  /* =========================================================
     USER
  ========================================================= */

  function getUsername() {

    return (
      localStorage.getItem(
        STORAGE.USER
      ) ||

      localStorage.getItem(
        "di_userName"
      ) ||

      els.inputUser?.value ||

      "Convidado"
    );
  }

  function setUser(username) {

    const safe =
      String(username || "Convidado")
      .trim();

    engine.set("user", safe);

    localStorage.setItem(
      STORAGE.USER,
      safe
    );

    localStorage.setItem(
      "di_userName",
      safe
    );

    applySpectrum(safe);

    if (els.inputUser) {
      els.inputUser.value = safe;
    }

    if (els.usernameDisplay) {
      els.usernameDisplay.textContent =
        safe;
    }

    const orbitalCount =
      Number(
        engine.get("orbitals", 3)
      );

    buildOrb(
      els.avatarTarget ||
      els.orbToggle,
      orbitalCount
    );
  }

  /* =========================================================
     THEME
  ========================================================= */

  function setTheme(theme = "dark") {

    const finalTheme =
      theme === "light"
        ? "light"
        : "dark";

    engine.set(
      "theme",
      finalTheme
    );

    document.body.classList.toggle(
      "mode-night",
      finalTheme === "dark"
    );

    document.body.classList.toggle(
      "mode-day",
      finalTheme === "light"
    );

    if (els.modeIndicator) {

      els.modeIndicator.innerHTML =
        finalTheme === "dark"
          ? "MODO nO.SºLAR"
          : "MODO SOLAR";
    }
  }

  function toggleTheme() {

    const current =
      engine.get("theme", "dark");

    setTheme(
      current === "dark"
        ? "light"
        : "dark"
    );
  }

  /* =========================================================
     INTENSITY
  ========================================================= */

  function setIntensity(value = .72) {

    const intensity =
      Math.max(
        0.4,
        Math.min(
          1.2,
          Number(value)
        )
      );

    engine.set(
      "intensity",
      intensity.toFixed(2)
    );

    document.documentElement
      .style
      .setProperty(
        "--ui-intensity",
        intensity.toFixed(2)
      );

    document.documentElement
      .style
      .setProperty(
        "--orb-glow-size",
        `${20 + (intensity * 18)}px`
      );
  }

  /* =========================================================
     ZPR
  ========================================================= */

  function setZPR(value = 9) {

    const zpr =
      Math.max(
        1,
        Math.min(
          9,
          Number(value)
        )
      );

    engine.set(
      "zpr",
      String(zpr)
    );
  }

  /* =========================================================
     ORBITALS
  ========================================================= */

  function setOrbitals(value = 3) {

    const total =
      Math.max(
        0,
        Math.min(
          12,
          Number(value)
        )
      );

    engine.set(
      "orbitals",
      String(total)
    );

    buildOrb(
      els.avatarTarget ||
      els.orbToggle,
      total
    );
  }

  /* =========================================================
     ARCH
  ========================================================= */

  function setArch(value = "KOBLLUX") {

    engine.set(
      "arch",
      value
    );
  }

  /* =========================================================
     NAV MATRIX DRAG
  ========================================================= */

  function bindNavMatrix() {

    if (!els.navMatrix) return;

    let dragging = false;

    let startX = 0;

    let startIntensity = .72;

    els.navMatrix.addEventListener(
      "pointerdown",
      e => {

        dragging = true;

        startX =
          e.clientX;

        startIntensity =
          Number(
            engine.get(
              "intensity",
              .72
            )
          );
      }
    );

    window.addEventListener(
      "pointermove",
      e => {

        if (!dragging) return;

        const dx =
          e.clientX - startX;

        const next =
          startIntensity +
          ((dx / innerWidth) * .8);

        setIntensity(next);
      }
    );

    window.addEventListener(
      "pointerup",
      () => {

        dragging = false;
      }
    );
  }

  /* =========================================================
     INPUT USER
  ========================================================= */

  function bindInput() {

    if (!els.inputUser) return;

    const commit = () => {

      const value =
        els.inputUser.value.trim();

      setUser(value);
    };

    els.inputUser.addEventListener(
      "change",
      commit
    );

    els.inputUser.addEventListener(
      "blur",
      commit
    );

    els.inputUser.addEventListener(
      "keydown",
      e => {

        if (e.key === "Enter") {

          e.preventDefault();

          commit();
        }
      }
    );
  }

  /* =========================================================
     INIT
  ========================================================= */

  function init() {

    setTheme(
      localStorage.getItem(
        STORAGE.THEME
      ) || "light"
    );

    setIntensity(
      localStorage.getItem(
        STORAGE.INTENSITY
      ) || .72
    );

    setArch(
      localStorage.getItem(
        STORAGE.ARCH
      ) || "KOBLLUX"
    );

    setZPR(
      localStorage.getItem(
        STORAGE.ZPR
      ) || 9
    );

    setOrbitals(
      localStorage.getItem(
        STORAGE.ORBITALS
      ) || 3
    );

    setUser(
      getUsername()
    );

    bindInput();

    bindNavMatrix();

    if (els.themeSwitch) {

      els.themeSwitch.addEventListener(
        "click",
        toggleTheme
      );
    }
  }

  /* =========================================================
     PUBLIC API
  ========================================================= */

  window.KOBLLUX_ENGINE = {

    setUser,
    setTheme,
    toggleTheme,
    setIntensity,
    setZPR,
    setOrbitals,
    setArch
  };

  document.addEventListener(
    "DOMContentLoaded",
    init
  );

})();