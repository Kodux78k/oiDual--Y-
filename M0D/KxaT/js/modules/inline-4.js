
  (()=>{
    if (window.__KOB_BG_FADE_OVERRIDE__) return;
    window.__KOB_BG_FADE_OVERRIDE__ = true;

    const css = `
    :root{
      --kob-voice-theme-duration: 7800ms;
    }
    body,
    .nebula{
      transition:
        background-color var(--kob-voice-theme-duration) ease-in-out !important,
        background        var(--kob-voice-theme-duration) ease-in-out !important,
        box-shadow        var(--kob-voice-theme-duration) ease-in-out !important,
        color             var(--kob-voice-theme-duration) ease-in-out !important,
        filter            var(--kob-voice-theme-duration) ease-in-out !important;
    }`;
    const style = document.createElement('style');
    style.id = 'KOB_BG_FADE_CSS';
    style.textContent = css;
    document.head.appendChild(style);
    console.log('🎨 KOB_BG_FADE_OVERRIDE ativo (body + .nebula com fade ~7.8s)');
  })();
  