
  (()=>{
    if (window.__KOB_BUTTON_FADE_AND_TTS_SHADOW_PATCH__) return;
    window.__KOB_BUTTON_FADE_AND_TTS_SHADOW_PATCH__ = true;

    const css = `
    :root{
      --kob-voice-theme-duration: 1100ms;
    }
    .btn,
    .chip,
    button,
    #fab,
    .fab,
    .menu button,
    details.acc,
    details.acc summary,
    .kob-tts-dock button,
    .kob-tts-panel.is-dock button{
      transition:
        background-color var(--kob-voice-theme-duration) ease-in-out,
        background        var(--kob-voice-theme-duration) ease-in-out,
        border-color      var(--kob-voice-theme-duration) ease-in-out,
        color             var(--kob-voice-theme-duration) ease-in-out,
        box-shadow        var(--kob-voice-theme-duration) ease-in-out;
    }
    .kob-tts-dock{
      box-shadow:
        0 6px 14px rgba(0,0,0,.30),
        inset 0 0 0 1px rgba(255,255,255,.04) !important;
    }`;
    const style = document.createElement('style');
    style.id = 'KOB_BUTTON_FADE_AND_TTS_SHADOW_CSS';
    style.textContent = css;
    document.head.appendChild(style);
    console.log('🎨 KOB_BUTTON_FADE_AND_TTS_SHADOW_PATCH ativo');
  })();
  