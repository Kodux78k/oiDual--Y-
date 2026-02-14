// modules/particles.module.js
// KOBLLUX ∴ TRINITY — particles module (self-injecting + config from DOM)
// Author: auto-generated for your repo
// Usage: import { di_initParticles, di_destroyParticles } from './modules/particles.module.js';

const DI_STYLE_ID = 'di-particles-styles';
const DI_SCRIPT_ID = 'di-particles-lib';
let DI_CURRENT_TARGET = null;

// Default CSS injected (pointer-events none, full absolute cover)
const DI_CSS = `
/* di particles module injected style */
#particles-js {
  position: absolute !important;
  inset: 0 !important;
  z-index: 0 !important;
  pointer-events: none !important;
}
`;

// Default config baseline
const DI_DEFAULT_CONFIG = {
  particles: {
    number: { value: 40 },
    color: { value: ['#0ff', '#f0f'] },
    shape: { type: 'circle' },
    opacity: { value: 0.4 },
    size: { value: 2.4 },
    line_linked: {
      enable: true,
      distance: 150,
      color: '#ffffff',
      opacity: 0.2,
      width: 1
    },
    move: { enable: true, speed: 1.5 }
  },
  retina_detect: true
};

// util: inject CSS once
function di_injectStyles(css = DI_CSS) {
  if (document.getElementById(DI_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = DI_STYLE_ID;
  style.textContent = css;
  document.head.appendChild(style);
}

// util: load particles.js if not present (returns promise)
function di_loadParticlesLib(src = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js') {
  return new Promise((resolve, reject) => {
    if (window.particlesJS) return resolve(window.particlesJS);
    if (document.getElementById(DI_SCRIPT_ID)) {
      // script already added but not yet loaded
      const existing = document.getElementById(DI_SCRIPT_ID);
      existing.addEventListener('load', () => resolve(window.particlesJS));
      existing.addEventListener('error', reject);
      return;
    }
    const s = document.createElement('script');
    s.id = DI_SCRIPT_ID;
    s.src = src;
    s.async = true;
    s.onload = () => resolve(window.particlesJS);
    s.onerror = (e) => reject(new Error('Failed to load particles lib: ' + e.message));
    document.head.appendChild(s);
  });
}

// util: read color list from container data or CSS var
function di_readColorsFromDOM(container) {
  // 1) data-colors attribute (comma separated)
  const ds = container.dataset.colors;
  if (ds && ds.trim()) return ds.split(',').map(s => s.trim()).filter(Boolean);

  // 2) CSS variable --particles-colors on container or :root
  const cs = getComputedStyle(container).getPropertyValue('--particles-colors') ||
             getComputedStyle(document.documentElement).getPropertyValue('--particles-colors');
  if (cs && cs.trim()) return cs.split(',').map(s => s.trim()).filter(Boolean);

  // 3) fallback to a single color var
  const single = getComputedStyle(container).getPropertyValue('--particles-color') ||
                 getComputedStyle(document.documentElement).getPropertyValue('--particles-color');
  if (single && single.trim()) return [single.trim()];

  // 4) default
  return DI_DEFAULT_CONFIG.particles.color.value.slice();
}

// util: small mobile detection
function di_isMobileLike() {
  try {
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) return true;
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  } catch (e) { return false; }
}

// destroy by target id (safe)
function di_destroyByTarget(targetId = 'particles-js') {
  if (!window.pJSDom || !Array.isArray(window.pJSDom)) return;
  for (let i = window.pJSDom.length - 1; i >= 0; i--) {
    const p = window.pJSDom[i];
    try {
      const el = p?.pJS?.canvas?.el;
      if (!el) continue;
      const parent = el.parentNode;
      if (parent && parent.id === targetId) {
        // use the lib's destroy helper if available
        if (p.pJS && p.pJS.fn && p.pJS.fn.vendors && typeof p.pJS.fn.vendors.destroypJS === 'function') {
          p.pJS.fn.vendors.destroypJS();
        }
        // remove from array
        window.pJSDom.splice(i, 1);
      }
    } catch (e) { /* ignore */ }
  }
}

// PUBLIC API: init
export async function di_initParticles({
  di_target = 'particles-js',
  di_config = {},
  di_autoInjectContainer = true,
  di_autoInjectStyles = true,
  di_libSrc = 'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js',
  di_waitForInteraction = false // if true, init only after first user interaction
} = {}) {

  DI_CURRENT_TARGET = di_target;

  // optionally inject CSS
  if (di_autoInjectStyles) di_injectStyles();

  // ensure container exists
  let container = document.getElementById(di_target);
  if (!container && di_autoInjectContainer) {
    container = document.createElement('div');
    container.id = di_target;
    // insert as first child of body so it's behind everything if z-index 0
    document.body.insertBefore(container, document.body.firstChild);
  }
  if (!container) {
    console.warn('[di_particles] Container not found and auto-inject disabled.');
    return;
  }

  // allow lazy init after user interaction
  const doInit = async () => {
    try {
      await di_loadParticlesLib(di_libSrc);

      // read colors from DOM / CSS
      const colors = di_readColorsFromDOM(container);
      // build merged config
      const merged = JSON.parse(JSON.stringify(DI_DEFAULT_CONFIG)); // deep-ish clone
      // apply color (array or single)
      merged.particles.color.value = (colors.length === 1) ? colors[0] : colors;

      // merge provided di_config (simple shallow deep for particles)
      if (di_config && typeof di_config === 'object') {
        // shallow merge top level
        Object.assign(merged, di_config);
        if (di_config.particles) {
          merged.particles = { ...merged.particles, ...di_config.particles };
          // if di_config.particles.color present, override
          if (di_config.particles.color) merged.particles.color = di_config.particles.color;
        }
      }

      // mobile adjustments
      if (di_isMobileLike()) {
        merged.particles.number.value = merged.particles.number?.value ? Math.min(merged.particles.number.value, 30) : 30;
        if (merged.particles.line_linked) merged.particles.line_linked.enable = false;
        // slightly reduce motion
        if (merged.particles.move) merged.particles.move.speed = Math.min(merged.particles.move.speed || 1.5, 1.2);
      }

      // destroy existing instance tied to this container (safe)
      try { di_destroyByTarget(di_target); } catch (e) {}

      // finally init
      if (typeof window.particlesJS === 'function') {
        window.particlesJS(di_target, merged);
      } else if (window.particlesJS) {
        // older libs may expose differently
        window.pJSDom = window.pJSDom || [];
        window.particlesJS(di_target, merged);
      } else {
        console.error('[di_particles] particlesJS not available after loading script.');
      }

      // store applied config for debugging
      container.dataset.diConfig = JSON.stringify(merged);

    } catch (err) {
      console.error('[di_particles] init error:', err);
    }
  };

  if (di_waitForInteraction) {
    const onFirst = () => {
      document.removeEventListener('pointerdown', onFirst);
      document.removeEventListener('keydown', onFirst);
      doInit();
    };
    document.addEventListener('pointerdown', onFirst, { once: true });
    document.addEventListener('keydown', onFirst, { once: true });
    return;
  } else {
    // immediate init
    await doInit();
    return;
  }
}

// PUBLIC API: destroy (by current or provided target)
export function di_destroyParticles(di_target = DI_CURRENT_TARGET || 'particles-js') {
  di_destroyByTarget(di_target);
  // remove injected canvas element if still present
  const el = document.getElementById(di_target);
  if (el) {
    // leave the container div but remove child canvas nodes
    const canv = el.querySelectorAll('canvas');
    canv.forEach(c => c.remove());
    delete el.dataset.diConfig;
  }
}

// PUBLIC API: reinit with new options
export async function di_reinitParticles(opts = {}) {
  di_destroyParticles(opts.di_target);
  return di_initParticles(opts);
}