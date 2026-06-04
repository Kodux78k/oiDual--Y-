/* ZPR ULTIMATE - GERADO POR KODUX ENGINE */

const ZPR_CONFIG = {
  zoneName: "Nexus Zone",
  target: "#app-root",
  mode: "replace",
  assets: {
    css: [
  "https://kodux78k.github.io/oiDual--Y-/css/KxTsK-unified.css",
  "https://kodux78k.github.io/oiDual--Y-/css/kxt-solar.css",
  "https://kodux78k.github.io/oiDual--Y-/css/kob-glass-0.css",
  "https://kodux78k.github.io/oiDual--Y-/M0D/di_Pad/css/zpr.css",
  "https://kodux78k.github.io/oiDual--Y-/M0D/kob-DH0/css/0x01_pulsar_V_D5-2.css"
],
    js: [
  "https://kodux78k.github.io/oiDual--Y-/M0D/di_Pad/js/modules/ZPR.js",
  "https://kodux78k.github.io/oiDual--Y-/M0D/kob-DH0/js/kobdh0-main.js",
  "https://kodux78k.github.io/oiDual--Y-/js/koblluxv30.js",
  "https://kodux78k.github.io/oiDual--Y-/js/kodbrain-66.js",
  "https://kodux78k.github.io/oiDual--Y-/js/di_core.js"
],
    html: [],
    inlineJs: []
  }
};

// APLICAR ZONA
function applyZPR() {
  const target = document.querySelector(ZPR_CONFIG.target);
  if (!target) return console.error('Target não encontrado');
  
  // Injetar CSS
  ZPR_CONFIG.assets.css.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  });

  // Injetar HTML
  if (ZPR_CONFIG.mode === 'replace') {
    target.innerHTML = ZPR_CONFIG.assets.html.join('');
  } else {
    target.innerHTML += ZPR_CONFIG.assets.html.join('');
  }

  // Injetar Scripts
  ZPR_CONFIG.assets.js.forEach(url => {
    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
  });

  // Executar Inline JS
  try {
    
  } catch(err) {
    console.error('ZPR Inline Error:', err);
  }
}

applyZPR();
