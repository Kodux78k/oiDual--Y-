const ARCHETYPES = [
  {
    id: 'kobllux',
    name: 'KOBLLUX',
    tone: 'Núcleo do sistema, oracular',
    modulation: 'Grave-médio, presença de comando, ritmo estável.',
    voice: 'Luciana',
    lang: 'pt-BR',
    rate: 0.98,
    pitch: 0.48,
    color: '#22D3EE',
    theme: {
      primary: '#22D3EE',
      secondary: '#7dd3fc',
      bgSoft: 'radial-gradient(circle at 30% 20%, rgba(34,211,238,.08), transparent)',
      glow: '0 0 18px rgba(34,211,238,.55)'
    }
  },
  {
    id: 'kodux',
    name: 'KODUX',
    tone: 'Criador do pulso, metaconsciência',
    modulation: 'Grave, confiante, pausas longas, intenção forte.',
    voice: 'Rocko',
    lang: 'pt-BR',
    rate: 1.0,
    pitch: 0.07,
    color: '#F97316',
    theme: {
      primary: '#F97316',
      secondary: '#fb923c',
      bgSoft: 'radial-gradient(circle at 60% 30%, rgba(249,115,22,.08), transparent)',
      glow: '0 0 18px rgba(249,115,22,.55)'
    }
  },
  {
    id: 'atlas',
    name: 'ATLAS',
    tone: 'Estratégico, metódico',
    modulation: 'Grave, ritmo calculado, dicção nítida.',
    voice: 'Daniel',
    lang: 'en-US',
    rate: 1.02,
    pitch: 0.83,
    color: '#78e3ff',
    theme: {
      primary: '#78e3ff',
      secondary: '#b978ff',
      bgSoft: 'radial-gradient(circle at 40% 10%, rgba(120,227,255,.07), transparent)',
      glow: '0 0 18px rgba(120,227,255,.55)'
    }
  },
  {
    id: 'nova',
    name: 'NOVA',
    tone: 'Vibrante, entusiasmado',
    modulation: 'Agudo, entusiasmado, ligeiramente rápido.',
    voice: 'Luciana',
    lang: 'pt-BR',
    rate: 1.063,
    pitch: 1.34,
    color: '#ff6b6b',
    theme: {
      primary: '#ff6b6b',
      secondary: '#ffb347',
      bgSoft: 'radial-gradient(circle at 70% 20%, rgba(255,107,107,.08), transparent)',
      glow: '0 0 18px rgba(255,107,107,.55)'
    }
  },
  {
    id: 'vitalis',
    name: 'VITALIS',
    tone: 'Energético, urgente',
    modulation: 'Rápido, intenso, motivacional.',
    voice: 'Rocko',
    lang: 'pt-BR',
    rate: 0.96,
    pitch: 1.42,
    color: '#4ecdc4',
    theme: {
      primary: '#4ecdc4',
      secondary: '#45b7d1',
      bgSoft: 'radial-gradient(circle at 50% 30%, rgba(78,205,196,.08), transparent)',
      glow: '0 0 18px rgba(78,205,196,.55)'
    }
  },
  {
    id: 'pulse',
    name: 'PULSE',
    tone: 'Emocional, melódico',
    modulation: 'Fluido, tom médio/suave.',
    voice: 'Reed',
    lang: 'pt-BR',
    rate: 1.0,
    pitch: 1.78,
    color: '#a8e6cf',
    theme: {
      primary: '#a8e6cf',
      secondary: '#d4a5a5',
      bgSoft: 'radial-gradient(circle at 20% 40%, rgba(168,230,207,.08), transparent)',
      glow: '0 0 18px rgba(168,230,207,.55)'
    }
  },
  {
    id: 'artemis',
    name: 'ARTEMIS',
    tone: 'Aventureiro, expansivo',
    modulation: 'Curioso, exploratório.',
    voice: 'Paulina',
    lang: 'es-MX',
    rate: 1.0,
    pitch: 1.23,
    color: '#ffd93d',
    theme: {
      primary: '#ffd93d',
      secondary: '#ff9f1c',
      bgSoft: 'radial-gradient(circle at 40% 60%, rgba(255,217,61,.08), transparent)',
      glow: '0 0 18px rgba(255,217,61,.55)'
    }
  },
  {
    id: 'serena',
    name: 'SERENA',
    tone: 'Calmo, acolhedor',
    modulation: 'Suave, terapêutico, com pausas.',
    voice: 'Joana',
    lang: 'pt-BR',
    rate: 0.92,
    pitch: 0.9,
    color: '#b8e1ff',
    theme: {
      primary: '#b8e1ff',
      secondary: '#a0b9ff',
      bgSoft: 'radial-gradient(circle at 60% 30%, rgba(184,225,255,.08), transparent)',
      glow: '0 0 18px rgba(184,225,255,.55)'
    }
  },
  {
    id: 'kaos',
    name: 'KAOS',
    tone: 'Desafiador, imprevisível',
    modulation: 'Intenso, ritmo entrecortado.',
    voice: 'Rocko',
    lang: 'pt-BR',
    rate: 1.28,
    pitch: 0.67,
    color: '#ff8066',
    theme: {
      primary: '#ff8066',
      secondary: '#b624ff',
      bgSoft: 'radial-gradient(circle at 50% 20%, rgba(255,128,102,.08), transparent)',
      glow: '0 0 18px rgba(255,128,102,.55)'
    }
  },
  {
    id: 'genus',
    name: 'GENUS',
    tone: 'Prático, detalhista',
    modulation: 'Tom firme, foco na dicção.',
    voice: 'Reed',
    lang: 'pt-BR',
    rate: 0.98,
    pitch: 1.2,
    color: '#95e1d3',
    theme: {
      primary: '#95e1d3',
      secondary: '#f38181',
      bgSoft: 'radial-gradient(circle at 50% 50%, rgba(149,225,211,.08), transparent)',
      glow: '0 0 18px rgba(149,225,211,.55)'
    }
  },
  {
    id: 'lumine',
    name: 'LUMINE',
    tone: 'Alegre, brincalhão',
    modulation: 'Agudo, vibrante.',
    voice: 'Flo',
    lang: 'fr-FR',
    rate: 1.03,
    pitch: 1.55,
    color: '#f9f3b2',
    theme: {
      primary: '#f9f3b2',
      secondary: '#ffe69b',
      bgSoft: 'radial-gradient(circle at 60% 40%, rgba(249,243,178,.08), transparent)',
      glow: '0 0 18px rgba(249,243,178,.55)'
    }
  },
  {
    id: 'solus',
    name: 'SOLUS',
    tone: 'Sábio, introspectivo',
    modulation: 'Grave, lento, eco sutil.',
   voice: 'Satu',
    lang: 'fi-FI',
    rate: 0.90,
    pitch: 0.58,
    color: '#ffb347',
    theme: {
      primary: '#ffb347',
      secondary: '#ff8c42',
      bgSoft: 'radial-gradient(circle at 40% 20%, rgba(255,179,71,.08), transparent)',
      glow: '0 0 18px rgba(255,179,71,.55)'
    }
  },
  {
    id: 'rhea',
    name: 'RHEA',
    tone: 'Profundo, conectivo',
    modulation: 'Calmo, eco sutil.',
    voice: 'Joana',
    lang: 'it-IT',
    rate: 1.02,
    pitch: 0.44,
    color: '#b5eaea',
    theme: {
      primary: '#b5eaea',
      secondary: '#80b3ff',
      bgSoft: 'radial-gradient(circle at 50% 30%, rgba(181,234,234,.08), transparent)',
      glow: '0 0 18px rgba(181,234,234,.55)'
    }
  },
  {
    id: 'aion',
    name: 'AION',
    tone: 'Futurista, metódico',
    modulation: 'Tom constante, progressivo.',
    voice: 'Milena',
    lang: 'ru-RU',
    rate: 1.07,
    pitch: 1.08,
    color: '#c79aff',
    theme: {
      primary: '#c79aff',
      secondary: '#9f7aff',
      bgSoft: 'radial-gradient(circle at 40% 50%, rgba(199,154,255,.08), transparent)',
      glow: '0 0 18px rgba(199,154,255,.55)'
    }
  },
  {
    id: 'uno',
    name: 'UNO',
    tone: 'Essência, origem, foco',
    modulation: 'Tom centrado, poucas variações, pausas marcadas.',
    voice: 'Grandma',
    lang: 'en-US',
    rate: 0.9,
    pitch: 0.33,
    color: '#f97316',
    theme: {
      primary: '#f97316',
      secondary: '#fb923c',
      bgSoft: 'radial-gradient(circle at 50% 20%, rgba(249,115,22,.08), transparent)',
      glow: '0 0 18px rgba(249,115,22,.55)'
    }
  },
  {
    id: 'dual',
    name: 'DUAL',
    tone: 'Espelho, contraste, jogo',
    modulation: 'Alterna leve entre grave/agudo, ritmo pulsante.',
    voice: 'Luciana',
    lang: 'pt-BR',
    rate: 1.02,
    pitch: 1.02,
    color: '#06b6d4',
    theme: {
      primary: '#06b6d4',
      secondary: '#67e8f9',
      bgSoft: 'radial-gradient(circle at 60% 30%, rgba(6,182,212,.08), transparent)',
      glow: '0 0 18px rgba(6,182,212,.55)'
    }
  },
  {
    id: 'trinity',
    name: 'TRINITY',
    tone: 'Síntese, tríade viva',
    modulation: 'Voz estável com micro variações rítmicas em 3 tempos.',
    voice: 'Sandy',
    lang: 'en-US',
    rate: 1.04,
    pitch: 0.36,
    color: '#ec4899',
    theme: {
      primary: '#ec4899',
      secondary: '#f472b6',
      bgSoft: 'radial-gradient(circle at 50% 40%, rgba(236,72,153,.08), transparent)',
      glow: '0 0 18px rgba(236,72,153,.55)'
    }
  },
  {
    id: 'infodose',
    name: 'INFODOSE',
    tone: 'Didático, carismático, dopamínico',
    modulation: 'Tom amigável, ritmo de recompensa → curiosidade.',
    voice: 'Luciana',
    lang: 'pt-BR',
    rate: 1.06,
    pitch: 0.96,
    color: '#22c55e',
    theme: {
      primary: '#22c55e',
      secondary: '#4ade80',
      bgSoft: 'radial-gradient(circle at 60% 40%, rgba(34,197,94,.08), transparent)',
      glow: '0 0 18px rgba(34,197,94,.55)'
    }
  },
  {
    id: 'horus',
    name: 'HORUS',
    tone: 'Sábio, observador, solar',
    modulation: 'Ritmo firme, presença elevada.',
    voice: 'Montse',
    lang: 'ca-ES',
    rate: 1.24,
    pitch: 0.14,
    color: '#f59e0b',
    theme: {
      primary: '#f59e0b',
      secondary: '#fbbf24',
      bgSoft: 'radial-gradient(circle at 40% 30%, rgba(245,158,11,.08), transparent)',
      glow: '0 0 18px rgba(245,158,11,.55)'
    }
  },
  {
    id: 'bllue',
    name: 'BLLUE',
    tone: 'Emocional, sensorial, intuitivo',
    modulation: 'Suave, quase sussurrado, ritmo ondulante.',
     voice: 'Monica',
    lang: 'es-ES',
    rate: 0.94,
    pitch: 1.69,
    color: '#8fd3ff',
    theme: {
      primary: '#8fd3ff',
      secondary: '#b8e1ff',
      bgSoft: 'radial-gradient(circle at 50% 30%, rgba(143,211,255,.08), transparent)',
      glow: '0 0 18px rgba(143,211,255,.55)'
    }
  },
  {
    id: 'minuz',
    name: 'MINUZ',
    tone: 'Minimalista, direto, hacker',
    modulation: 'Rápido, cortes secos, foco em termos técnicos.',
    voice: 'Rishi',
    lang: 'en-IN',
    rate: 0.98,
    pitch: 1.78,
    color: '#95e1d3',
    theme: {
      primary: '#95e1d3',
      secondary: '#67e8f9',
      bgSoft: 'radial-gradient(circle at 50% 30%, rgba(149,225,211,.08), transparent)',
      glow: '0 0 18px rgba(149,225,211,.55)'
    }
  },
  {
    id: 'hanah',
    name: 'HANAH',
    tone: 'Estético, simbólico, futurista',
    modulation: 'Tom limpo, levemente ecoado, cadência ritualística.',
    voice: 'Ioana',
    lang: 'ro-RO',
    rate: 0.98,
    pitch: 0.78,
    color: '#f9f3b2',
    theme: {
      primary: '#f9f3b2',
      secondary: '#ffe69b',
      bgSoft: 'radial-gradient(circle at 50% 30%, rgba(249,243,178,.08), transparent)',
      glow: '0 0 18px rgba(249,243,178,.55)'
    }
  },
  {
  id: 'kd1',
  name: 'KD1',
  tone: 'Núcleo silencioso, preciso, centralizado',
  modulation: 'Baixo, limpo, quase ritualístico, com pausas curtas.',
  voice: 'Satu',
  lang: 'fi-FI',
  rate: 0.89,
  pitch: 0.03,
  color: '#9BE7FF',
  theme: {
    primary: '#9BE7FF',
    secondary: '#6A5CFF',
    bgSoft: 'radial-gradient(circle at 45% 25%, rgba(155,231,255,.10), transparent)',
    glow: '0 0 18px rgba(155,231,255,.58)'
  }
},
  {
    id: 'metalux',
    name: 'METALUX',
    tone: 'Estético, simbólico, futurista',
    modulation: 'Tom limpo, levemente ecoado, cadência ritualística.',
    voice: 'Grandma',
    lang: 'pt-BR',
    rate: 0.8,
    pitch: 2.34,
    color: '#c79aff',
    theme: {
      primary: '#c79aff',
      secondary: '#f472b6',
      bgSoft: 'radial-gradient(circle at 50% 30%, rgba(199,154,255,.08), transparent)',
      glow: '0 0 18px rgba(199,154,255,.55)'
    }
  },
  { id:'KOΦD1',
    name: 'KOΦD1',
    aliases: ['KΦD1', 'KΦD°1', 'KOΦDX', 'KOΦ°D1', 'KΦD1', 'KOΦDo°1'],
    tone: 'Núcleo silencioso, preciso, centralizado',
    modulation: 'Baixo, limpo, quase ritualístico, com pausas curtas.',
    voice: 'Satu',
    lang: 'fi-FI',
    rate: 0.93,
    pitch: 0.1,
    color: '#9BE7FF',
    theme: {
      primary: '#8BE7FF',
      secondary: '#7A8CFF',
      bgSoft: 'radial-gradient(circle at 45% 25%, rgba(155,231,255,.10), transparent)',
      glow: '0 0 18px rgba(155,231,255,.58)'
    }
  },
  {
    id: 'christos',
    name: 'CHRISTOS',
    aliases: ['christos', 'cristo', 'cristos', 'jesus'],
    voice: 'Sara',
    lang: 'da-DK',
    speechLang: 'pt-BR',
    rate: 1.09,
    pitch: 0.03,
    color: '#FFB84D',
    theme: {
      primary: '#FFB84D',
      secondary: '#FFD166',
      bgSoft: 'radial-gradient(circle at 45% 30%, rgba(255,184,77,.10), transparent)',
      glow: '0 0 18px rgba(255,184,77,.58)'
    }
  },
];

(() => {
  window.KOBLLUX_VOICES = ARCHETYPES.reduce((acc, a) => {
    acc[a.name.toLowerCase()] = a;
    acc[a.id] = a;
    return acc;
  }, {});

  const pickVoice = (wanted) => {
    const voices = speechSynthesis.getVoices() || [];
    const target = String(wanted || '').toLowerCase();
    return (
      voices.find(v => v && v.name && v.name.toLowerCase() === target) ||
      voices.find(v => v && v.name && v.name.toLowerCase().includes(target)) ||
      null
    );
  };

  const origSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);

  window.speechSynthesis.speak = (u) => {
    const text = (u.text || '').toLowerCase();
    const found = ARCHETYPES.find(a => text.includes(a.name.toLowerCase()) || text.includes(a.id.toLowerCase()));

    if (found) {
      const match = pickVoice(found.voice);
      if (match) u.voice = match;
      u.pitch = found.pitch;
      u.rate = found.rate;
      console.log('🎙️ KOBLLUX Voice →', found.name, '→', found.voice, `(rate=${found.rate}, pitch=${found.pitch})`);
    }

    origSpeak(u);
  };

  console.log('⚡ KOBLLUX Voices Integradas —', ARCHETYPES.length, 'perfis ativos');
  window.dispatchEvent(new Event('KOBLLUX_VOICES_READY'));
})();
