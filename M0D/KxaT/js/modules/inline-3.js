
  (()=>{
    if (window.__KOB_THEME_TRANSITION_SOFT_OVERRIDE__) return;
    window.__KOB_THEME_TRANSITION_SOFT_OVERRIDE__ = true;

    const css = `
    :root{
      --kob-voice-theme-duration: 6600ms;
    }
    body,
    .nebula,
    .nebula-bg,
    .page,
    .page-inner,
    details.acc,
    .btn,
    #fab,
    .kob-tts-dock,
    .kob-tts-panel.is-dock {
      transition:
        background-color var(--kob-voice-theme-duration) ease-in-out,
        background        var(--kob-voice-theme-duration) ease-in-out,
        box-shadow        var(--kob-voice-theme-duration) ease-in-out,
        border-color      var(--kob-voice-theme-duration) ease-in-out,
        color             var(--kob-voice-theme-duration) ease-in-out;
    }`;
    const style = document.createElement('style');
    style.id = 'KOB_THEME_TRANSITION_SOFT_CSS';
    style.textContent = css;
    document.head.appendChild(style);
    console.log('🎨 KOB_THEME_TRANSITION_SOFT_OVERRIDE ativo (fade ~6.6s)');
  })();
  