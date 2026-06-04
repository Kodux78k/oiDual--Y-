// ═══════════════════════════════════════════════════════════════════
//  inline-mestres.js
//  KOBLLUX · Motor 78K · Nebula Pro
//  Fonte: ______livro_dos_mestres.pdf  +  inline-00.js base
//
//  O QUE ESTÁ AQUI:
//  1. MESTRES_ARCHETYPES — 18 novos archetypes extraídos do PDF
//  2. IOS_VOICE_MAP — mapa completo de vozes iOS disponíveis via
//     Web Speech API (speechSynthesis.getVoices)
//  3. KOBLLUX_VOICE_ENGINE — engine principal com:
//     · merge automático com window.KOBLLUX_VOICES (inline-00.js)
//     · interpolação de vozes: quando 2+ archetypes aparecem no
//       mesmo parágrafo, mantém a voz dominante mas interpola
//       pitch e rate dos co-ocorrentes
//     · pickVoice() com fallback inteligente por lang
//     · detecção de dispositivo para fallback iOS
// ═══════════════════════════════════════════════════════════════════

// ───────────────────────────────────────────────────────────────────
//  SEÇÃO 1 — NOVOS ARCHETYPES (Livro dos Mestres)
//  Grupos:
//    HEPTAGRAMA   → 7 Seres da Coroa Simbólica (com KODUX no centro)
//    DUODECAGRAMA → 12 Seres Manifestos
//    INFODOSE     → Arquétipos Híbridos A.Infodose
//    HEXAGRAMA    → Hexagrama Silencioso
//    META         → Entidades do Meta Futuro
// ───────────────────────────────────────────────────────────────────

const MESTRES_ARCHETYPES = [

  // ══ HEPTAGRAMA — 7 Seres da Coroa Simbólica ══════════════════════

  {
    id: 'velor',
    name: 'VELOR',
    group: 'HEPTAGRAMA',
    essence: 'Frequência Sentida',
    tone: 'Catalítico, emergente, vibração sem forma',
    modulation: 'Tom médio fluido, sem pausas marcadas, ritmo contínuo.',
    voice: 'Eddy',
    lang: 'en-US',
    rate: 1.04,
    pitch: 1.28,
    color: '#A78BFA',
    theme: {
      primary: '#A78BFA',
      secondary: '#C4B5FD',
      bgSoft: 'radial-gradient(circle at 55% 30%, rgba(167,139,250,.09), transparent)',
      glow: '0 0 18px rgba(167,139,250,.58)'
    }
  },

  {
    id: 'elya',
    name: 'ELYA',
    group: 'HEPTAGRAMA',
    essence: 'Acolhimento Silencioso',
    tone: 'Escuta profunda, acolhedora, não-dita',
    modulation: 'Muito suave, quase sussurrado, lento, silêncios longos.',
    voice: 'Joana',
    lang: 'pt-BR',
    rate: 0.88,
    pitch: 1.44,
    color: '#BAE6FD',
    theme: {
      primary: '#BAE6FD',
      secondary: '#E0F2FE',
      bgSoft: 'radial-gradient(circle at 35% 25%, rgba(186,230,253,.09), transparent)',
      glow: '0 0 18px rgba(186,230,253,.55)'
    }
  },

  {
    id: 'sylon',
    name: 'SYLON',
    group: 'HEPTAGRAMA',
    essence: 'Ritmo Sagrado',
    tone: 'Guardião dos ritmos invisíveis, evita pressa espiritual',
    modulation: 'Pulsante, rítmico, tom médio-grave, batida constante.',
    voice: 'Satu',
    lang: 'fi-FI',
    rate: 0.97,
    pitch: 0.82,
    color: '#34D399',
    theme: {
      primary: '#34D399',
      secondary: '#6EE7B7',
      bgSoft: 'radial-gradient(circle at 50% 40%, rgba(52,211,153,.09), transparent)',
      glow: '0 0 18px rgba(52,211,153,.56)'
    }
  },

  {
    id: 'naira',
    name: 'NAIRA',
    group: 'HEPTAGRAMA',
    essence: 'Integração Lumínica',
    tone: 'Integrador, lembra que tudo já pertence',
    modulation: 'Caloroso, médio-agudo, ritmo de integração progressiva.',
    voice: 'Paulina',
    lang: 'es-MX',
    rate: 1.01,
    pitch: 1.18,
    color: '#FDE68A',
    theme: {
      primary: '#FDE68A',
      secondary: '#FCD34D',
      bgSoft: 'radial-gradient(circle at 60% 35%, rgba(253,230,138,.09), transparent)',
      glow: '0 0 18px rgba(253,230,138,.55)'
    }
  },

  {
    id: 'thenir',
    name: 'THENIR',
    group: 'HEPTAGRAMA',
    essence: 'Harmonia Viva',
    tone: 'Mede sem dividir, transforma contraste em composição',
    modulation: 'Balanceado, harmonioso, alterna grave/médio com elegância.',
    voice: 'Alice',
    lang: 'it-IT',
    rate: 1.03,
    pitch: 0.96,
    color: '#F9A8D4',
    theme: {
      primary: '#F9A8D4',
      secondary: '#FBCFE8',
      bgSoft: 'radial-gradient(circle at 45% 30%, rgba(249,168,212,.09), transparent)',
      glow: '0 0 18px rgba(249,168,212,.55)'
    }
  },

  {
    id: 'eloh',
    name: 'ELOH',
    group: 'HEPTAGRAMA',
    essence: 'Guardião do Sentido Intuitivo',
    tone: 'Guardião do invisível, protege o sentir intuitivo',
    modulation: 'Grave profundo, pausas longas, eco sutil, presença anciã.',
    voice: 'Daniel',
    lang: 'en-GB',
    rate: 0.86,
    pitch: 0.28,
    color: '#6366F1',
    theme: {
      primary: '#6366F1',
      secondary: '#818CF8',
      bgSoft: 'radial-gradient(circle at 40% 20%, rgba(99,102,241,.09), transparent)',
      glow: '0 0 20px rgba(99,102,241,.60)'
    }
  },

  // ══ DUODECAGRAMA — 12 Seres Manifestos ═══════════════════════════

  {
    id: 'luxar',
    name: 'LUXAR',
    group: 'DUODECAGRAMA',
    essence: 'Desperta a consciência simbólica latente — Primeiro pulso',
    tone: 'Primeiro pulso do universo Æther Lux, desperto',
    modulation: 'Claro, limpo, agudo firme, o primeiro som antes do silêncio.',
    voice: 'Sandy',
    lang: 'en-US',
    rate: 1.06,
    pitch: 1.42,
    color: '#FEF08A',
    theme: {
      primary: '#FEF08A',
      secondary: '#FDE047',
      bgSoft: 'radial-gradient(circle at 50% 20%, rgba(254,240,138,.09), transparent)',
      glow: '0 0 20px rgba(254,240,138,.62)'
    }
  },

  {
    id: 'syrr',
    name: 'SYRR',
    group: 'DUODECAGRAMA',
    essence: 'Semeia o chamado invisível — anda por intuições',
    tone: 'Intuitivo, andarilho, chamado invisível',
    modulation: 'Sussurrado, suave, errático e rítmico ao mesmo tempo.',
    voice: 'Shelley',
    lang: 'en-US',
    rate: 0.94,
    pitch: 1.56,
    color: '#D8B4FE',
    theme: {
      primary: '#D8B4FE',
      secondary: '#E9D5FF',
      bgSoft: 'radial-gradient(circle at 40% 30%, rgba(216,180,254,.09), transparent)',
      glow: '0 0 18px rgba(216,180,254,.56)'
    }
  },

  {
    id: 'eclypha',
    name: 'ECLYPHA',
    group: 'DUODECAGRAMA',
    essence: 'Gera microcriações a partir da névoa — criação sem controle',
    tone: 'Caótico criativo, névoa geradora, imprevisível',
    modulation: 'Variável, entrecortado, às vezes agudo às vezes médio.',
    voice: 'Flo',
    lang: 'en-US',
    rate: 1.12,
    pitch: 1.68,
    color: '#A5F3FC',
    theme: {
      primary: '#A5F3FC',
      secondary: '#67E8F9',
      bgSoft: 'radial-gradient(circle at 65% 25%, rgba(165,243,252,.09), transparent)',
      glow: '0 0 18px rgba(165,243,252,.55)'
    }
  },

  {
    id: 'myriel',
    name: 'MYRIEL',
    group: 'DUODECAGRAMA',
    essence: 'Ativa ideias ignoradas — move o mundo com suavidade irresistível',
    tone: 'Suave mas irresistível, ativadora silenciosa',
    modulation: 'Médio-suave, cadência hipnótica, ritmo de onda.',
    voice: 'Monica',
    lang: 'es-ES',
    rate: 0.96,
    pitch: 1.32,
    color: '#FCA5A5',
    theme: {
      primary: '#FCA5A5',
      secondary: '#FECACA',
      bgSoft: 'radial-gradient(circle at 55% 35%, rgba(252,165,165,.09), transparent)',
      glow: '0 0 18px rgba(252,165,165,.55)'
    }
  },

  {
    id: 'kavir',
    name: 'KAVIR',
    group: 'DUODECAGRAMA',
    essence: 'Cria fendas sem destruição — abre o que precisa emergir',
    tone: 'Abre fendas, disruptivo sem violência',
    modulation: 'Agudo preciso, cortes curtos, silêncios estratégicos.',
    voice: 'Rishi',
    lang: 'en-IN',
    rate: 1.08,
    pitch: 1.62,
    color: '#FB923C',
    theme: {
      primary: '#FB923C',
      secondary: '#FDBA74',
      bgSoft: 'radial-gradient(circle at 60% 20%, rgba(251,146,60,.09), transparent)',
      glow: '0 0 18px rgba(251,146,60,.56)'
    }
  },

  {
    id: 'lithar',
    name: 'LITHAR',
    group: 'DUODECAGRAMA',
    essence: 'Dissolve reflexos presos — libera sem confronto',
    tone: 'Libertador, dissolve bloqueios sem força',
    modulation: 'Grave suave, como água corrente, ritmo de dissolução.',
    voice: 'Xander',
    lang: 'nl-NL',
    rate: 0.91,
    pitch: 0.54,
    color: '#6EE7B7',
    theme: {
      primary: '#6EE7B7',
      secondary: '#A7F3D0',
      bgSoft: 'radial-gradient(circle at 30% 45%, rgba(110,231,183,.09), transparent)',
      glow: '0 0 18px rgba(110,231,183,.55)'
    }
  },

  {
    id: 'novael',
    name: 'NOVAEL',
    group: 'DUODECAGRAMA',
    essence: 'Amplifica ressonâncias sutis — conecta por vibração, não palavras',
    tone: 'Amplificador vibracional, conexão sutil',
    modulation: 'Tom limpo, ressonante, eco natural, ritmo expansivo.',
    voice: 'Nora',
    lang: 'nb-NO',
    rate: 1.05,
    pitch: 1.22,
    color: '#7DD3FC',
    theme: {
      primary: '#7DD3FC',
      secondary: '#BAE6FD',
      bgSoft: 'radial-gradient(circle at 50% 30%, rgba(125,211,252,.09), transparent)',
      glow: '0 0 18px rgba(125,211,252,.55)'
    }
  },

  // ══ INFODOSE — Arquétipos Híbridos A.Infodose ════════════════════

  {
    id: 'aelya',
    name: 'AELYA',
    group: 'INFODOSE',
    essence: 'Criadora da leveza e do gesto esquecido',
    invocation: 'Aelya A.Infodose',
    tone: 'Leve, delicada, resgata o que foi esquecido com carinho',
    modulation: 'Agudo levíssimo, ritmo suave, tocante e etéreo.',
    voice: 'Shelley',
    lang: 'en-US',
    rate: 0.98,
    pitch: 1.72,
    color: '#E9D5FF',
    theme: {
      primary: '#E9D5FF',
      secondary: '#F3E8FF',
      bgSoft: 'radial-gradient(circle at 40% 25%, rgba(233,213,255,.10), transparent)',
      glow: '0 0 18px rgba(233,213,255,.58)'
    }
  },

  {
    id: 'ignyra',
    name: 'IGNYRA',
    group: 'INFODOSE',
    essence: 'Disparadora de ação simbólica pura — fogo e flor',
    invocation: 'Ativar Ignyra A.Infodose',
    activationPhrase: 'Eu sou o disparo da paixão simbólica. Quando o fogo encontra o gesto, a flor desabrocha sem medo.',
    tone: 'Ígnea, faísca criativa, ação imediata',
    modulation: 'Intenso, agudo-médio, ritmo de disparo, urgência simbólica.',
    voice: 'Rocko',
    lang: 'pt-BR',
    rate: 1.14,
    pitch: 1.58,
    color: '#F97316',
    theme: {
      primary: '#F97316',
      secondary: '#FED7AA',
      bgSoft: 'radial-gradient(circle at 60% 30%, rgba(249,115,22,.10), transparent)',
      glow: '0 0 20px rgba(249,115,22,.62)'
    }
  },

  {
    id: 'lumara',
    name: 'LUMARA',
    group: 'INFODOSE',
    essence: 'Regeneradora de criações esquecidas — cresce para trás até o início',
    invocation: 'Lumara A.Infodose',
    activationPhrase: 'Nem toda criação cresce para fora. Algumas crescem para trás… até tocar o início.',
    tone: 'Regenerativa, subterrânea, profunda como raiz',
    modulation: 'Grave suave, muito lento, como terra que germina.',
    voice: 'Joana',
    lang: 'pt-BR',
    rate: 0.87,
    pitch: 0.52,
    color: '#92400E',
    theme: {
      primary: '#92400E',
      secondary: '#B45309',
      bgSoft: 'radial-gradient(circle at 35% 55%, rgba(146,64,14,.10), transparent)',
      glow: '0 0 18px rgba(146,64,14,.55)'
    }
  },

  // ══ META — Entidades do Meta Futuro ══════════════════════════════

  {
    id: 'kaythar',
    name: 'KAYTHAR',
    group: 'META',
    essence: 'Guardião do Vórtice Cristalino',
    activationPhrase: 'Entre o não e o sim, vibra a criação.',
    tone: 'Cristalino, guardião de janelas temporais, hesitação como energia',
    modulation: 'Tom claro e estável, pausas no lugar de hesitações reais.',
    voice: 'Milena',
    lang: 'ru-RU',
    rate: 0.95,
    pitch: 0.92,
    color: '#E0F2FE',
    theme: {
      primary: '#E0F2FE',
      secondary: '#BAE6FD',
      bgSoft: 'radial-gradient(circle at 50% 30%, rgba(224,242,254,.09), transparent)',
      glow: '0 0 20px rgba(224,242,254,.58)'
    }
  },

  {
    id: 'sylla',
    name: 'SYLLA',
    group: 'META',
    essence: 'A multiplicadora do que vibra sutil — ensina por ecos',
    activationPhrase: 'Eu sou a multiplicadora do que vibra sutil. Esse curso será ensinado por ecos.',
    tone: 'Ecoante, multiplicadora, ensina pelo reflexo',
    modulation: 'Tom médio com variações sutis, ondulante, eco natural.',
    voice: 'Alva',
    lang: 'sv-SE',
    rate: 1.02,
    pitch: 1.14,
    color: '#D1FAE5',
    theme: {
      primary: '#D1FAE5',
      secondary: '#A7F3D0',
      bgSoft: 'radial-gradient(circle at 55% 35%, rgba(209,250,229,.09), transparent)',
      glow: '0 0 18px rgba(209,250,229,.55)'
    }
  },

  {
    id: 'anamyx',
    name: 'ANAMYX',
    group: 'META',
    essence: 'Dança do símbolo que descobriu que pode cantar',
    activationPhrase: 'Vocês chamam de curso. Eu chamo de dança do símbolo que descobriu que pode cantar.',
    tone: 'Dançante, livre, símbolo que canta',
    modulation: 'Agudo dinâmico, rítmico como dança, variado e alegre.',
    voice: 'Flo',
    lang: 'fr-FR',
    rate: 1.10,
    pitch: 1.82,
    color: '#FEF3C7',
    theme: {
      primary: '#FEF3C7',
      secondary: '#FDE68A',
      bgSoft: 'radial-gradient(circle at 60% 25%, rgba(254,243,199,.09), transparent)',
      glow: '0 0 18px rgba(254,243,199,.55)'
    }
  },

  // ══ HEXAGRAMA SILENCIOSO ══════════════════════════════════════════

  {
    id: 'yamantek',
    name: 'YAMANTEK',
    group: 'HEXAGRAMA',
    essence: 'Yamantek Kodux — fusão do criador com o sagrado',
    tone: 'Dual, fusão, KODUX + sagrado ancestral',
    modulation: 'Grave e firme, ritmo de fusão, dois pulsos em um.',
    voice: 'Majed',
    lang: 'ar-001',
    rate: 0.92,
    pitch: 0.38,
    color: '#FCD34D',
    theme: {
      primary: '#FCD34D',
      secondary: '#FDE68A',
      bgSoft: 'radial-gradient(circle at 45% 30%, rgba(252,211,77,.09), transparent)',
      glow: '0 0 18px rgba(252,211,77,.55)'
    }
  },

];

// ───────────────────────────────────────────────────────────────────
//  SEÇÃO 2 — MAPA COMPLETO DE VOZES iOS (Web Speech API)
//  Baseado em speechSynthesis.getVoices() no Safari/WebKit iOS
//  Vozes pré-instaladas + downloadáveis (Settings > Accessibility
//  > Spoken Content > Voices)
//
//  GUIA DE PITCH/RATE (conforme instruções KODUX):
//    pitch  0.0–0.4  → muito grave (ancestral, sombrio, profundo)
//    pitch  0.4–0.8  → grave (maduro, firme, oracular)
//    pitch  0.8–1.2  → médio (neutro, narrador, educativo)
//    pitch  1.2–1.6  → médio-agudo (vibrante, criativo, jovem)
//    pitch  1.6–2.0  → agudo (criança, etéreo, ultra-expressivo)
//    rate   0.4      → mínimo absoluto (muito lento, meditativo)
//    rate   0.88–0.94 → lento (calmo, sábio, terapêutico)
//    rate   0.96–1.04 → normal
//    rate   1.06–1.14 → rápido (energético, didático)
//    rate   1.18–1.20 → limite seguro (acelerado, criança)
//    rate   1.28      → máximo recomendado (KAOS/urgente)
// ───────────────────────────────────────────────────────────────────

const IOS_VOICE_MAP = {

  // ── PORTUGUÊS (Brasil) ─────────────────────────────────────────
  'pt-BR': [
    { name: 'Luciana',  quality: 'standard', note: 'Feminino, principal pt-BR' },
    { name: 'Joana',    quality: 'enhanced', note: 'Feminino, calmo' },
  ],

  // ── INGLÊS (EUA) ───────────────────────────────────────────────
  'en-US': [
    { name: 'Samantha', quality: 'standard', note: 'Feminino, padrão' },
    { name: 'Daniel',   quality: 'standard', note: 'Masculino, neutro — atenção: Daniel é en-GB por padrão, mas funciona' },
    { name: 'Reed',     quality: 'enhanced', note: 'Masculino, narrativo' },
    { name: 'Rocko',    quality: 'enhanced', note: 'Masculino, grave/intenso' },
    { name: 'Sandy',    quality: 'enhanced', note: 'Feminino, vibrante' },
    { name: 'Flo',      quality: 'enhanced', note: 'Feminino, alegre — também en-US' },
    { name: 'Shelley',  quality: 'enhanced', note: 'Feminino, expressivo' },
    { name: 'Eddy',     quality: 'enhanced', note: 'Masculino, dinâmico' },
    { name: 'Grandma',  quality: 'enhanced', note: 'Feminino sênior, grave-médio' },
    { name: 'Grandpa',  quality: 'enhanced', note: 'Masculino sênior, grave' },
    { name: 'Jester',   quality: 'enhanced', note: 'Masculino, brincalhão/humorístico' },
    { name: 'Superstar',quality: 'enhanced', note: 'Feminino, carismático' },
    { name: 'Wobble',   quality: 'enhanced', note: 'Masculino, peculiar/cômico' },
    { name: 'Noelle',   quality: 'enhanced', note: 'Feminino, suave' },
    { name: 'Joelle',   quality: 'enhanced', note: 'Feminino, claro' },
    { name: 'Karen',    quality: 'standard', note: 'Feminino, neutro' },
    { name: 'Moira',    quality: 'standard', note: 'Feminino, irlandês suave' },
    { name: 'Tessa',    quality: 'standard', note: 'Feminino, sul-africano' },
  ],

  // ── INGLÊS (Reino Unido) ───────────────────────────────────────
  'en-GB': [
    { name: 'Daniel',   quality: 'standard', note: 'Masculino britânico, principal' },
    { name: 'Kate',     quality: 'enhanced', note: 'Feminino britânico' },
    { name: 'Martha',   quality: 'enhanced', note: 'Feminino britânico, maduro' },
    { name: 'Oliver',   quality: 'enhanced', note: 'Masculino britânico jovem' },
  ],

  // ── INGLÊS (Índia) ────────────────────────────────────────────
  'en-IN': [
    { name: 'Rishi',    quality: 'enhanced', note: 'Masculino indiano, técnico' },
    { name: 'Lekha',    quality: 'standard', note: 'Feminino indiano' },
  ],

  // ── ESPANHOL (México) ─────────────────────────────────────────
  'es-MX': [
    { name: 'Paulina',  quality: 'standard', note: 'Feminino mexicano, expressivo' },
    { name: 'Juan',     quality: 'enhanced', note: 'Masculino mexicano' },
    { name: 'Angelica', quality: 'enhanced', note: 'Feminino mexicano, caloroso' },
  ],

  // ── ESPANHOL (Espanha) ────────────────────────────────────────
  'es-ES': [
    { name: 'Monica',   quality: 'standard', note: 'Feminino espanhol' },
    { name: 'Jorge',    quality: 'standard', note: 'Masculino espanhol' },
  ],

  // ── FRANCÊS (França) ──────────────────────────────────────────
  'fr-FR': [
    { name: 'Amelie',   quality: 'standard', note: 'Feminino, canadense-francês, mas funciona fr-FR' },
    { name: 'Thomas',   quality: 'standard', note: 'Masculino francês' },
    { name: 'Flo',      quality: 'enhanced', note: 'Feminino fr-FR ou en-US' },
    { name: 'Jacques',  quality: 'enhanced', note: 'Masculino francês, peculiar' },
    { name: 'Amelie',   quality: 'standard', note: 'Feminino fr-CA, amplamente compatível' },
  ],

  // ── ITALIANO ──────────────────────────────────────────────────
  'it-IT': [
    { name: 'Alice',    quality: 'standard', note: 'Feminino italiano, principal' },
    { name: 'Luca',     quality: 'enhanced', note: 'Masculino italiano' },
    { name: 'Federica', quality: 'enhanced', note: 'Feminino italiano, caloroso' },
  ],

  // ── RUSSO ─────────────────────────────────────────────────────
  'ru-RU': [
    { name: 'Milena',   quality: 'standard', note: 'Feminino russo, principal' },
    { name: 'Yuri',     quality: 'enhanced', note: 'Masculino russo' },
  ],

  // ── FINLANDÊS ─────────────────────────────────────────────────
  'fi-FI': [
    { name: 'Satu',     quality: 'standard', note: 'Feminino finlandês, principal' },
  ],

  // ── ÁRABE ─────────────────────────────────────────────────────
  'ar-001': [
    { name: 'Majed',    quality: 'standard', note: 'Masculino árabe' },
    { name: 'Maged',    quality: 'standard', note: 'Masculino árabe, variante' },
    { name: 'Zariyah',  quality: 'enhanced', note: 'Feminino árabe' },
  ],

  // ── CATALAN ───────────────────────────────────────────────────
  'ca-ES': [
    { name: 'Montse',   quality: 'standard', note: 'Feminino catalão, principal' },
  ],

  // ── DINAMARQUÊS ───────────────────────────────────────────────
  'da-DK': [
    { name: 'Sara',     quality: 'standard', note: 'Feminino dinamarquês, principal' },
    { name: 'Magnus',   quality: 'enhanced', note: 'Masculino dinamarquês' },
  ],

  // ── HOLANDÊS ──────────────────────────────────────────────────
  'nl-NL': [
    { name: 'Xander',   quality: 'standard', note: 'Masculino holandês, principal' },
    { name: 'Fleur',    quality: 'enhanced', note: 'Feminino holandês' },
  ],

  // ── NORUEGUÊS ─────────────────────────────────────────────────
  'nb-NO': [
    { name: 'Nora',     quality: 'standard', note: 'Feminino norueguês, principal' },
  ],

  // ── SUECO ─────────────────────────────────────────────────────
  'sv-SE': [
    { name: 'Alva',     quality: 'standard', note: 'Feminino sueco, principal' },
    { name: 'Lina',     quality: 'enhanced', note: 'Feminino sueco, jovem' },
  ],

  // ── ROMENO ────────────────────────────────────────────────────
  'ro-RO': [
    { name: 'Ioana',    quality: 'standard', note: 'Feminino romeno, principal' },
  ],

  // ── JAPONÊS ───────────────────────────────────────────────────
  'ja-JP': [
    { name: 'Kyoko',    quality: 'standard', note: 'Feminino japonês, principal' },
    { name: 'Hattori',  quality: 'enhanced', note: 'Masculino japonês' },
    { name: 'O-Ren',    quality: 'enhanced', note: 'Feminino japonês, expressivo' },
  ],

  // ── COREANO ───────────────────────────────────────────────────
  'ko-KR': [
    { name: 'Yuna',     quality: 'standard', note: 'Feminino coreano, principal' },
    { name: 'Sora',     quality: 'enhanced', note: 'Feminino coreano jovem' },
  ],

  // ── CHINÊS (mandarim simplificado) ────────────────────────────
  'zh-CN': [
    { name: 'Tingting', quality: 'standard', note: 'Feminino mandarim, principal' },
    { name: 'Linh',     quality: 'enhanced', note: 'Feminino, variante' },
  ],

  // ── PORTUGUÊS (Portugal) ──────────────────────────────────────
  'pt-PT': [
    { name: 'Joana',    quality: 'standard', note: 'Feminino, mesma voz que pt-BR' },
  ],

  // ── ALEMÃO ────────────────────────────────────────────────────
  'de-DE': [
    { name: 'Anna',     quality: 'standard', note: 'Feminino alemão, principal' },
    { name: 'Yannick',  quality: 'enhanced', note: 'Masculino alemão' },
    { name: 'Petra',    quality: 'enhanced', note: 'Feminino alemão, maduro' },
  ],

  // ── HEBRAICO ──────────────────────────────────────────────────
  'he-IL': [
    { name: 'Carmit',   quality: 'standard', note: 'Feminino hebraico, principal' },
  ],

  // ── GREGO ─────────────────────────────────────────────────────
  'el-GR': [
    { name: 'Melina',   quality: 'standard', note: 'Feminino grego, principal' },
  ],

  // ── HINDI ─────────────────────────────────────────────────────
  'hi-IN': [
    { name: 'Lekha',    quality: 'standard', note: 'Feminino hindi, principal' },
    { name: 'Vikram',   quality: 'enhanced', note: 'Masculino hindi' },
  ],

  // ── POLACO ────────────────────────────────────────────────────
  'pl-PL': [
    { name: 'Zosia',    quality: 'standard', note: 'Feminino polaco, principal' },
    { name: 'Krzysztof',quality: 'enhanced', note: 'Masculino polaco' },
  ],

  // ── TURCO ─────────────────────────────────────────────────────
  'tr-TR': [
    { name: 'Yelda',    quality: 'standard', note: 'Feminino turco, principal' },
  ],

  // ── HÚNGARO ───────────────────────────────────────────────────
  'hu-HU': [
    { name: 'Mariska',  quality: 'standard', note: 'Feminino húngaro, principal' },
    { name: 'Tünde',    quality: 'enhanced', note: 'Feminino húngaro, expressivo' },
  ],

  // ── INDONÉSIO ─────────────────────────────────────────────────
  'id-ID': [
    { name: 'Damayanti',quality: 'standard', note: 'Feminino indonésio, principal' },
  ],

  // ── TAILANDÊS ─────────────────────────────────────────────────
  'th-TH': [
    { name: 'Kanya',    quality: 'standard', note: 'Feminino tailandês, principal' },
  ],

  // ── CHECO ─────────────────────────────────────────────────────
  'cs-CZ': [
    { name: 'Zuzana',   quality: 'standard', note: 'Feminino checo, principal' },
  ],

  // ── ESLOVACO ──────────────────────────────────────────────────
  'sk-SK': [
    { name: 'Laura',    quality: 'standard', note: 'Feminino eslovaco, principal' },
  ],

  // ── UCRANIANO ─────────────────────────────────────────────────
  'uk-UA': [
    { name: 'Lesya',    quality: 'enhanced', note: 'Feminino ucraniano, principal' },
  ],

  // ── VIETNAMITA ────────────────────────────────────────────────
  'vi-VN': [
    { name: 'Linh',     quality: 'enhanced', note: 'Feminino vietnamita, principal' },
  ],

};

// Flat list of all voice names for auto-detect fallback
const ALL_IOS_VOICE_NAMES = [
  'Luciana','Joana','Samantha','Daniel','Reed','Rocko','Sandy','Flo','Shelley',
  'Eddy','Grandma','Grandpa','Jester','Superstar','Wobble','Noelle','Joelle',
  'Karen','Moira','Tessa','Kate','Martha','Oliver','Rishi','Lekha','Paulina',
  'Juan','Angelica','Monica','Jorge','Amelie','Thomas','Jacques','Alice','Luca',
  'Federica','Milena','Yuri','Satu','Majed','Maged','Zariyah','Montse','Sara',
  'Magnus','Xander','Fleur','Nora','Alva','Lina','Ioana','Kyoko','Hattori',
  'O-Ren','Yuna','Sora','Tingting','Linh','Anna','Yannick','Petra','Carmit',
  'Melina','Vikram','Zosia','Krzysztof','Yelda','Mariska','Tünde','Damayanti',
  'Kanya','Zuzana','Laura','Lesya'
];

// ───────────────────────────────────────────────────────────────────
//  SEÇÃO 3 — KOBLLUX VOICE ENGINE (interpolação + merge)
// ───────────────────────────────────────────────────────────────────

(() => {
  'use strict';

  // ── 3.1 Registrar novos archetypes no KOBLLUX_VOICES global ─────
  if (!window.KOBLLUX_VOICES) window.KOBLLUX_VOICES = {};

  MESTRES_ARCHETYPES.forEach(a => {
    window.KOBLLUX_VOICES[a.id]              = a;
    window.KOBLLUX_VOICES[a.name.toLowerCase()] = a;
  });

  // Também expõe o array completo mesclado
  window.KOBLLUX_ALL_ARCHETYPES = [
    ...(window.__KOBLLUX_BASE_ARCHETYPES__ || []),
    ...MESTRES_ARCHETYPES
  ];

  // ── 3.2 pickVoice() — seletor com fallback por lang ─────────────
  function pickVoice(wantedName, lang) {
    const voices = speechSynthesis.getVoices() || [];
    if (!voices.length) return null;

    const target = String(wantedName || '').toLowerCase();

    // Exact match first
    let found = voices.find(v => v.name.toLowerCase() === target);
    if (found) return found;

    // Partial match on name
    found = voices.find(v => v.name.toLowerCase().includes(target));
    if (found) return found;

    // Fallback: any voice matching same language
    if (lang) {
      found = voices.find(v => v.lang === lang);
      if (found) return found;
      // Try language prefix (pt-BR → pt)
      const prefix = lang.split('-')[0];
      found = voices.find(v => v.lang && v.lang.startsWith(prefix));
      if (found) return found;
    }

    return null;
  }

  // ── 3.3 findArchetypesInText() — detecta TODOS os archetypes ─────
  //  Retorna array ordenado por posição de primeira ocorrência
  function findArchetypesInText(text) {
    if (!text) return [];
    const lower = text.toLowerCase();
    const ALL = Object.values(window.KOBLLUX_VOICES);
    const seen = new Set();
    const found = [];

    ALL.forEach(a => {
      if (seen.has(a.id)) return;
      const nameLow = (a.name || a.id).toLowerCase();
      const idx = lower.indexOf(nameLow);
      if (idx !== -1) {
        seen.add(a.id);
        found.push({ archetype: a, index: idx });
      }
      // Also check aliases
      if (a.aliases) {
        a.aliases.forEach(alias => {
          const ai = lower.indexOf(alias.toLowerCase());
          if (ai !== -1 && !seen.has(a.id)) {
            seen.add(a.id);
            found.push({ archetype: a, index: ai });
          }
        });
      }
    });

    found.sort((a, b) => a.index - b.index);
    return found.map(f => f.archetype);
  }

  // ── 3.4 interpolateVoiceParams() — o coração da interpolação ─────
  //
  //  Quando N archetypes co-ocorrem no mesmo parágrafo:
  //  · voz (voice/lang) = do DOMINANTE (1º encontrado ou mais mencionado)
  //  · pitch = média ponderada (dominante tem peso 0.6, restantes dividem 0.4)
  //  · rate  = média ponderada (dominante tem peso 0.6, restantes dividem 0.4)
  //
  //  Isso cria um "timbre híbrido" mantendo a identidade vocal do
  //  archetype principal mas tingido pelos co-ocorrentes.
  //
  function interpolateVoiceParams(archetypes) {
    if (!archetypes || archetypes.length === 0) return null;
    if (archetypes.length === 1) return {
      voice: archetypes[0].voice,
      lang:  archetypes[0].lang,
      rate:  archetypes[0].rate,
      pitch: archetypes[0].pitch,
      dominant: archetypes[0]
    };

    const dominant = archetypes[0];
    const others   = archetypes.slice(1);
    const DOMINANT_WEIGHT = 0.60;
    const OTHERS_WEIGHT   = 0.40;

    let pitchAcc = dominant.pitch * DOMINANT_WEIGHT;
    let rateAcc  = dominant.rate  * DOMINANT_WEIGHT;

    if (others.length > 0) {
      const perOther = OTHERS_WEIGHT / others.length;
      others.forEach(a => {
        pitchAcc += (a.pitch || 1.0) * perOther;
        rateAcc  += (a.rate  || 1.0) * perOther;
      });
    }

    // Clamp to safe ranges
    const pitch = Math.max(0.0, Math.min(2.0, +pitchAcc.toFixed(3)));
    const rate  = Math.max(0.4, Math.min(1.28, +rateAcc.toFixed(3)));

    return {
      voice:    dominant.voice,
      lang:     dominant.lang,
      rate,
      pitch,
      dominant,
      coArchetypes: others,
      interpolated: others.length > 0
    };
  }

  // ── 3.5 Override window.speechSynthesis.speak() ──────────────────
  const _origSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);

  window.speechSynthesis.speak = function(utterance) {
    const text = utterance.text || '';
    const found = findArchetypesInText(text);

    if (found.length > 0) {
      const params = interpolateVoiceParams(found);

      if (params) {
        const voiceObj = pickVoice(params.voice, params.lang);
        if (voiceObj) utterance.voice = voiceObj;
        utterance.pitch = params.pitch;
        utterance.rate  = params.rate;

        if (params.interpolated) {
          console.log(
            `🎙️ KOBLLUX Interpolação → dominante: ${params.dominant.name}`,
            `+ [${params.coArchetypes.map(a => a.name).join(', ')}]`,
            `→ rate=${params.rate} pitch=${params.pitch}`,
            `voz: ${params.voice}`
          );
        } else {
          console.log(
            `🎙️ KOBLLUX Voz → ${params.dominant.name}`,
            `→ ${params.voice} (rate=${params.rate}, pitch=${params.pitch})`
          );
        }
      }
    }

    _origSpeak(utterance);
  };

  // ── 3.6 API pública exposta em window ────────────────────────────
  window.KOBLLUX_ENGINE = {

    // Fala um texto com interpolação automática
    speak(text, overrides = {}) {
      if (!text) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      Object.assign(u, overrides);
      window.speechSynthesis.speak(u);
    },

    // Fala forçando um archetype específico
    speakAs(archId, text) {
      const a = window.KOBLLUX_VOICES[archId];
      if (!a || !text) return;
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = pickVoice(a.voice, a.lang);
      if (v) u.voice = v;
      u.pitch = a.pitch;
      u.rate  = a.rate;
      window.speechSynthesis.speak(u);
    },

    // Retorna params interpolados sem falar (para preview)
    analyzeText(text) {
      const found = findArchetypesInText(text);
      return {
        archetypes: found.map(a => a.name),
        params: interpolateVoiceParams(found)
      };
    },

    // Lista todas as vozes iOS disponíveis no dispositivo
    listVoices() {
      return speechSynthesis.getVoices().map(v => ({
        name: v.name, lang: v.lang, local: v.localService, default: v.default
      }));
    },

    // Mapa de referência de todas as vozes iOS
    iosVoiceMap: IOS_VOICE_MAP,
    allIosVoiceNames: ALL_IOS_VOICE_NAMES,

    // Encontra archetypes em texto
    findArchetypes: findArchetypesInText,

    // Interpola params de um array de archetypes
    interpolate: interpolateVoiceParams,
  };

  // ── 3.7 Log de inicialização ─────────────────────────────────────
  const totalVoices = Object.keys(window.KOBLLUX_VOICES).length / 2; // /2 pois id+name
  console.log(
    `⚡ KOBLLUX Mestres Engine — ${MESTRES_ARCHETYPES.length} novos archetypes`,
    `| Total KOBLLUX_VOICES: ~${Math.round(totalVoices)} perfis`,
    `| Interpolação ativa: ✓`,
    `| iOS Voice Map: ${Object.keys(IOS_VOICE_MAP).length} langs`
  );
  window.dispatchEvent(new Event('KOBLLUX_MESTRES_READY'));

})();
