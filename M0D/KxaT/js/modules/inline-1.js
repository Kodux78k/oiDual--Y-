
  (()=>{
    if (!('speechSynthesis' in window)) return;

    const root = document.documentElement;
    const body = document.body;
    const metaTheme = document.querySelector('meta[name="theme-color"]') || null;

    const BASE = {};
    const VARS = ['--grad-a','--grad-b','--bg','--panel','--ink','--muted'];
    const cs = getComputedStyle(root);
    VARS.forEach(v=>{
      BASE[v] = cs.getPropertyValue(v) || '';
    });

    const DEFAULT_THEME = {
      neutral: {
        gradA: BASE['--grad-a'],
        gradB: BASE['--grad-b'],
        bg:    BASE['--bg'],
        panel: BASE['--panel'],
        ink:   BASE['--ink'],
        muted: BASE['--muted'],
        meta:  '#070b14'
      },
      atlas:   { gradA:'#00c4ff', gradB:'#0066ff', bg:'#050814', panel:'#0b1020', ink:'#eaf6ff', muted:'#8aa4c8', meta:'#04101f' },
      nova:    { gradA:'#ff7ad9', gradB:'#ffb347', bg:'#140512', panel:'#20091f', ink:'#ffeefc', muted:'#ffb7e4', meta:'#2a0723' },
      vitalis: { gradA:'#00ff95', gradB:'#00ffd0', bg:'#04140e', panel:'#071e17', ink:'#eafff7', muted:'#8fdac2', meta:'#012018' },
      pulse:   { gradA:'#ff5fa7', gradB:'#5f8bff', bg:'#120517', panel:'#1b0a22', ink:'#ffeafd', muted:'#c79ddc', meta:'#24082a' },
      serena:  { gradA:'#7bc7ff', gradB:'#7bffe0', bg:'#03111a', panel:'#071823', ink:'#eaf6ff', muted:'#99bfd7', meta:'#031520' },
      kaos:    { gradA:'#ff4b81', gradB:'#ffdd55', bg:'#18040a', panel:'#250811', ink:'#ffeef4', muted:'#ffb3c9', meta:'#24030b' },
      genus:   { gradA:'#9b8fff', gradB:'#5fffe3', bg:'#070718', panel:'#0c0d22', ink:'#eef0ff', muted:'#a4a8dd', meta:'#08081f' },
      lumine:  { gradA:'#ffe66b', gradB:'#ff9bff', bg:'#170a06', panel:'#25120e', ink:'#fff7e3', muted:'#f3cfa2', meta:'#261308' },
      solus:   { gradA:'#6b8cff', gradB:'#341f5f', bg:'#050715', panel:'#090b1f', ink:'#e3e8ff', muted:'#9ea4d6', meta:'#050716' },
      rhea:    { gradA:'#3cffd2', gradB:'#3c8bff', bg:'#031411', panel:'#071d19', ink:'#eafffb', muted:'#8cd8c8', meta:'#031914' },
      aion:    { gradA:'#9c7bff', gradB:'#4fd5ff', bg:'#060414', panel:'#0c0920', ink:'#f0e9ff', muted:'#b19de4', meta:'#07051a' },

      kobllux: { gradA:'#00ffd0', gradB:'#00b3ff', bg:'#020812', panel:'#050d18', ink:'#eafcff', muted:'#8ac7dd', meta:'#010710' },
      uno:     { gradA:'#ffffff', gradB:'#8ee7ff', bg:'#05070b', panel:'#090b11', ink:'#f5f8ff', muted:'#aeb4c8', meta:'#05070b' },
      dual:    { gradA:'#ff7ab3', gradB:'#7af0ff', bg:'#0b0510', panel:'#13081c', ink:'#ffeefe', muted:'#c49ccf', meta:'#0c0714' },
      trinity: { gradA:'#7affd1', gradB:'#ffef7a', bg:'#060b05', panel:'#0b1409', ink:'#f7ffef', muted:'#b7d7a9', meta:'#050c05' },

      infodose:{ gradA:'#00d8d8', gradB:'#d800d8', bg:'#050813', panel:'#090f1e', ink:'#f2f5ff', muted:'#a1a8c8', meta:'#060818' },
      kodux:   { gradA:'#00f5ff', gradB:'#0078ff', bg:'#02060f', panel:'#050a16', ink:'#e5f5ff', muted:'#8bb5d6', meta:'#020610' },
      bllue:   { gradA:'#6be1ff', gradB:'#3c6bff', bg:'#020911', panel:'#04121d', ink:'#e7f6ff', muted:'#8fbad3', meta:'#020b13' },
      minuz:   { gradA:'#b7b7b7', gradB:'#4b4b4b', bg:'#050505', panel:'#101010', ink:'#f3f3f3', muted:'#a5a5a5', meta:'#050505' },
      hanah:   { gradA:'#ffb3f8', gradB:'#70d7ff', bg:'#130514', panel:'#1c0b1e', ink:'#ffeefe', muted:'#c9a4d8', meta:'#160819' },
      metalux: { gradA:'#f5ff8a', gradB:'#8af5ff', bg:'#080b02', panel:'#101507', ink:'#f9ffe6', muted:'#c6d39b', meta:'#090d03' }
    };

    const THEMES = Object.assign({}, DEFAULT_THEME, (window.KOB_VOICE_THEME || {}));

    function setVar(name, value){
      if (value != null && value !== '') {
        root.style.setProperty(name, value);
      }
    }

    function applyTheme(id){
      const key = (id && String(id).toLowerCase()) || 'neutral';
      const cfg = THEMES[key] || THEMES.neutral;
      setVar('--grad-a', cfg.gradA);
      setVar('--grad-b', cfg.gradB);
      setVar('--bg',     cfg.bg);
      setVar('--panel',  cfg.panel);
      setVar('--ink',    cfg.ink);
      setVar('--muted',  cfg.muted);
      if (metaTheme && cfg.meta) metaTheme.setAttribute('content', cfg.meta);

      if (key === 'neutral'){
        body.removeAttribute('data-voice-arch');
      } else {
        body.setAttribute('data-voice-arch', key);
      }
    }
    window.KOB_APPLY_VOICE_THEME = applyTheme;

    function detectArchFromUtterance(u){
      const t = (u && u.text || '').toLowerCase();
      if (!t) return null;

      if (window.KOBLLUX_VOICES){
        for (const k in window.KOBLLUX_VOICES){
          if (!Object.prototype.hasOwnProperty.call(window.KOBLLUX_VOICES,k)) continue;
          const arch = window.KOBLLUX_VOICES[k];
          const name = String(arch.name || k).toLowerCase();
          if (t.includes('['+name) || t.includes(name+']') || t.includes(name+' —') || t.includes('## '+name) || t.includes(name)){
            return (arch.id || name || k).toLowerCase();
          }
        }
      }

      for (const k in THEMES){
        if (k === 'neutral') continue;
        if (t.includes(k.toLowerCase())) return k.toLowerCase();
      }

      return null;
    }

    const prevSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
    const prevCancel = window.speechSynthesis.cancel.bind(window.speechSynthesis);

    window.speechSynthesis.speak = function(u){
      try{
        const archId = detectArchFromUtterance(u);
        if (archId){
          applyTheme(archId);
        }
      }catch(e){
        console.warn('[KOB_VOICE_THEME_PATCH] erro ao detectar arquétipo', e);
      }
      return prevSpeak(u);
    };

    window.speechSynthesis.cancel = function(){
      try{ applyTheme(null); }catch{}
      return prevCancel();
    };

    applyTheme(null);
  })();
  