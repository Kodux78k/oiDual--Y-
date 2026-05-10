const THEME_KEY = "kx_theme_v1";
const INTENSITY_KEY = "kx_ui_intensity_v1";

const navMatrix = document.getElementById("navMatrix");

let uiIntensity = Number(localStorage.getItem(INTENSITY_KEY) || "0.72");
let themeMode = localStorage.getItem(THEME_KEY) || "dark";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function applyIntensity(value) {
  uiIntensity = clamp(Number(value) || 0.72, 0.40, 1.20);

  document.documentElement.style.setProperty("--ui-intensity", uiIntensity.toFixed(2));
  document.documentElement.style.setProperty("--glow-size", `${Math.round(22 + uiIntensity * 14)}px`);

  localStorage.setItem(INTENSITY_KEY, uiIntensity.toFixed(2));
}

function setTheme(mode) {
  themeMode = mode === "light" ? "light" : "dark";
  document.body.dataset.theme = themeMode;
  localStorage.setItem(THEME_KEY, themeMode);
}

function toggleTheme() {
  setTheme(themeMode === "dark" ? "light" : "dark");
}

function initThemeSystem() {
  setTheme(themeMode);
  applyIntensity(uiIntensity);

  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleTheme();
    });
  }
}

function bindNavMatrixIntensityControl() {
  if (!navMatrix) return;

  let dragging = false;
  let startX = 0;
  let startIntensity = uiIntensity;
  let moved = false;

  const MOVE_LIMIT = 10;
  const INTENSITY_SCALE = 180;

  navMatrix.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".dot")) return;

    dragging = true;
    moved = false;
    startX = e.clientX;
    startIntensity = uiIntensity;

    navMatrix.setPointerCapture?.(e.pointerId);
  });

  navMatrix.addEventListener("pointermove", (e) => {
    if (!dragging) return;

    const dx = e.clientX - startX;

    if (Math.abs(dx) > MOVE_LIMIT) {
      moved = true;
    }

    const next = startIntensity + (dx / INTENSITY_SCALE) * 0.5;
    applyIntensity(next);
  });

  navMatrix.addEventListener("pointerup", () => {
    if (!dragging) return;

    dragging = false;

    if (!moved) {
      toggleTheme();
    }
  });

  navMatrix.addEventListener("pointercancel", () => {
    dragging = false;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initThemeSystem();
  bindNavMatrixIntensityControl();
});