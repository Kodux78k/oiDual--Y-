
  (()=>{
    if (window.__KOBLLUX_VOICE_THEME_PATCH__) return;
    window.__KOBLLUX_VOICE_THEME_PATCH__ = true;

    const COLOR_MAP = {
      kobllux:{ primary:'#00d8d8', secondary:'#d800d8', accent:'#39FFB6', bg_soft:'rgba(0,216,216,0.08)', glow:'0 0 18px rgba(0,216,216,0.55)' },
      cooplux:{ primary:'#39FFB6', secondary:'#00d8d8', accent:'#ffffff', bg_soft:'rgba(57,255,182,0.10)', glow:'0 0 16px rgba(57,255,182,0.60)' },
      fitlux:{ primary:'#FFC857', secondary:'#FFE39A', accent:'#22252f', bg_soft:'rgba(255,200,87,0.12)', glow:'0 0 16px rgba(255,200,87,0.70)' },
      atlas:{ primary:'#6CCFF6', secondary:'#1B4965', accent:'#CAE9FF', bg_soft:'rgba(108,207,246,0.10)', glow:'0 0 14px rgba(108,207,246,0.55)' },
      nova:{ primary:'#FF6FB5', secondary:'#FFD6E8', accent:'#FFE066', bg_soft:'rgba(255,111,181,0.12)', glow:'0 0 16px rgba(255,111,181,0.65)' },
      vitalis:{ primary:'#00F5A0', secondary:'#00D9F5', accent:'#0b1720', bg_soft:'rgba(0,245,160,0.10)', glow:'0 0 18px rgba(0,245,160,0.65)' },
      pulse:{ primary:'#A259FF', secondary:'#2D1B69', accent:'#F1E4FF', bg_soft:'rgba(162,89,255,0.12)', glow:'0 0 18px rgba(162,89,255,0.70)' },
      serena:{ primary:'#7AD3A8', secondary:'#154734', accent:'#EAFBF3', bg_soft:'rgba(122,211,168,0.12)', glow:'0 0 16px rgba(122,211,168,0.65)' },
      kaos:{ primary:'#FF5C8A', secondary:'#3D000F', accent:'#FFD6E0', bg_soft:'rgba(255,92,138,0.12)', glow:'0 0 20px rgba(255,92,138,0.75)' },
      genus:{ primary:'#4EE1A0', secondary:'#193A3A', accent:'#E1FFF2', bg_soft:'rgba(78,225,160,0.10)', glow:'0 0 16px rgba(78,225,160,0.65)' },
      lumine:{ primary:'#FFE066', secondary:'#FF9F1C', accent:'#2F2F40', bg_soft:'rgba(255,224,102,0.16)', glow:'0 0 18px rgba(255,224,102,0.75)' },
      rhea:{ primary:'#00B894', secondary:'#055E55', accent:'#D1FFF6', bg_soft:'rgba(0,184,148,0.14)', glow:'0 0 16px rgba(0,184,148,0.65)' },
      solus:{ primary:'#4B6584', secondary:'#0B1420', accent:'#E3EFFA', bg_soft:'rgba(75,101,132,0.16)', glow:'0 0 14px rgba(75,101,132,0.65)' },
      aion:{ primary:'#00A8E8', secondary:'#001F54', accent:'#C4F1FF', bg_soft:'rgba(0,168,232,0.14)', glow:'0 0 16px rgba(0,168,232,0.70)' },
      uno:{ primary:'#FFFFFF', secondary:'#BBBBBB', accent:'#FFFFFF', bg_soft:'rgba(255,255,255,0.05)', glow:'0 0 16px rgba(255,255,255,0.35)' },
      dual:{ primary:'#FF9F1C', secondary:'#2EC4B6', accent:'#f5f5f5', bg_soft:'rgba(255,159,28,0.10)', glow:'0 0 14px rgba(255,159,28,0.65)' },
      trinity:{ primary:'#00d8d8', secondary:'#FFE066', accent:'#ffffff', bg_soft:'rgba(0,216,216,0.09)', glow:'0 0 18px rgba(0,216,216,0.70)' },
      infodose:{ primary:'#39FFB6', secondary:'#FFE066', accent:'#11141c', bg_soft:'rgba(57,255,182,0.12)', glow:'0 0 18px rgba(57,255,182,0.75)' },
      kodux:{ primary:'#FF6FB5', secondary:'#5B2C6F', accent:'#FDEBFF', bg_soft:'rgba(91,44,111,0.18)', glow:'0 0 16px rgba(255,111,181,0.70)' },
      bllue:{ primary:'#4A90E2', secondary:'#142850', accent:'#E3F2FF', bg_soft:'rgba(74,144,226,0.14)', glow:'0 0 16px rgba(74,144,226,0.70)' },
      minuz:{ primary:'#FF3366', secondary:'#111111', accent:'#FFE3ED', bg_soft:'rgba(255,51,102,0.16)', glow:'0 0 16px rgba(255,51,102,0.75)' },
      hanah:{ primary:'#FFB6C1', secondary:'#3C1F3C', accent:'#FFE9F0', bg_soft:'rgba(255,182,193,0.16)', glow:'0 0 16px rgba(255,182,193,0.70)' },
      metalux:{ primary:'#B0E0E6', secondary:'#202733', accent:'#F0FBFF', bg_soft:'rgba(176,224,230,0.16)', glow:'0 0 18px rgba(176,224,230,0.70)' }
    };

    const root = document.documentElement;
    const body = document.body;

    function normalizeKey(s){
      return String(s||'').normalize('NFD')
        .replace(/\p{Diacritic}/gu,'')
        .toLowerCase()
        .replace(/[^a-z0-9]/g,'');
    }

    function detectArchKeyFromText(text){
      if(!text) return null;
      const raw = String(text);
      const trimmed = raw.trim();
      const lowAll  = trimmed.toLowerCase();

      const m = trimmed.match(/^\[([^\]]+)\]/);
      if(m){
        const namePart = m[1].split('—')[0].split('-')[0].trim();
        const k = normalizeKey(namePart);
        if(COLOR_MAP[k]) return k;
      }

      for(const key of Object.keys(COLOR_MAP)){
        if(lowAll.includes(key)) return key;
      }

      try{
        if(window.KOB_TTS_VOICE_STYLE_HOOK){
          const arch = window.KOB_TTS_VOICE_STYLE_HOOK(raw);
          const k = normalizeKey(arch);
          if(COLOR_MAP[k]) return k;
        }
      }catch(e){}

      return null;
    }

    function applyColorTheme(key){
      const cfg = COLOR_MAP[key];
      if(!cfg) return;

      root.style.setProperty('--kob-voice-primary',   cfg.primary  || '#00d8d8');
      root.style.setProperty('--kob-voice-secondary', cfg.secondary|| cfg.primary || '#d800d8');
      root.style.setProperty('--kob-voice-accent',    cfg.accent   || '#ffffff');
      root.style.setProperty('--kob-voice-bg-soft',   cfg.bg_soft  || 'rgba(0,0,0,0.25)');
      root.style.setProperty('--kob-voice-glow',      cfg.glow     || '0 0 0 transparent');

      if(body){
        body.setAttribute('data-voice-arch', key);
      }

      try{
        window.dispatchEvent(new CustomEvent('KOB_VOICE_COLOR',{ detail:{ id:key, color:cfg } }));
      }catch(e){}
    }

    const prevSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);

    window.speechSynthesis.speak = function(u){
      try{
        if(u instanceof SpeechSynthesisUtterance){
          const key = detectArchKeyFromText(u.text||'');
          if(key){
            applyColorTheme(key);
            console.log('🎨 KOBLLUX THEME →', key);
          }
        }
      }catch(e){
        console.warn('KOBLLUX_VOICE_THEME_PATCH error:', e);
      }
      return prevSpeak(u);
    };

    console.log('⚡ KOBLLUX_VOICE_THEME_PATCH ativo — cores dinâmicas por arquétipo');
  })();
  