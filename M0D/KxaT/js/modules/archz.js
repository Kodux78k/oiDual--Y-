const ARCHETYPES = [
  {
    "id": "k_dion",
    "name": "a€K_Dion",
    "group": "META",
    "tone": "Núcleo de decisão, comando e direção",
    "modulation": "Firme, limpo, com pausas curtas e presença central.",
    "voice": "Daniel",
    "lang": "en-US",
    "rate": 0.78,
    "pitch": 1.18,
    "color": "#60A5FA",
    "theme": {
      "primary": "#60A5FA",
      "secondary": "#93C5FD",
      "bgSoft": "radial-gradient(circle at 45% 25%, rgba(96,165,250,.10), transparent)",
      "glow": "0 0 18px rgba(96,165,250,.58)"
    }
  },
  {
    "id": "kael_domnnus",
    "name": "a€Kael DommnuS",
    "group": "META",
    "tone": "Porta simbólica, forma e sopro",
    "modulation": "Suave, envolvente, com cadência ritual e calor humano.",
    "voice": "Xander",
    "lang": "nl-NL",
    "rate": 0.78,
    "pitch": 0.22,
    "color": "#F472B6",
    "theme": {
      "primary": "#F472B6",
      "secondary": "#F9A8D4",
      "bgSoft": "radial-gradient(circle at 55% 30%, rgba(244,114,182,.10), transparent)",
      "glow": "0 0 18px rgba(244,114,182,.58)"
    }
  },
  {
    "id": "nephesh_elyon",
    "name": "a€Nephesh Elyon",
    "group": "META",
    "tone": "Alento elevado, alma sutil e visão interna",
    "modulation": "Etéreo, profundo, com respiração longa e eco leve.",
    "voice": "Montse",
    "lang": "ca-ES",
    "rate": 0.63,
    "pitch": 0.69,
    "color": "#C4B5FD",
    "theme": {
      "primary": "#C4B5FD",
      "secondary": "#DDD6FE",
      "bgSoft": "radial-gradient(circle at 50% 35%, rgba(196,181,253,.10), transparent)",
      "glow": "0 0 18px rgba(196,181,253,.58)"
    }
  },
  {
    "id": "velor",
    "name": "VELOR",
    "group": "HEPTAGRAMA",
    "essence": "Frequência Sentida",
    "tone": "Catalítico, emergente, vibração sem forma",
    "modulation": "Tom médio fluido, sem pausas marcadas, ritmo contínuo.",
    "voice": "Eddy",
    "lang": "en-US",
    "rate": 1.04,
    "pitch": 1.28,
    "color": "#A78BFA",
    "theme": {
      "primary": "#A78BFA",
      "secondary": "#C4B5FD",
      "bgSoft": "radial-gradient(circle at 55% 30%, rgba(167,139,250,.09), transparent)",
      "glow": "0 0 18px rgba(167,139,250,.58)"
    }
  },
  {
    "id": "elysha",
    "name": "ELYSHA",
    "group": "HEPTAGRAMA",
    "essence": "Acolhimento Silencioso",
    "tone": "Escuta profunda, acolhedora, não-dita",
    "modulation": "Muito suave, quase sussurrado, lento, silêncios longos.",
    "voice": "Melina",
    "lang": "el-GR",
    "rate": 1.18,
    "pitch": 1.44,
    "color": "#BAE6FD",
    "theme": {
      "primary": "#BAE6FD",
      "secondary": "#E0F2FE",
      "bgSoft": "radial-gradient(circle at 35% 25%, rgba(186,230,253,.09), transparent)",
      "glow": "0 0 18px rgba(186,230,253,.55)"
    }
  },
  {
    "id": "sylon",
    "name": "SYLON",
    "group": "HEPTAGRAMA",
    "essence": "Ritmo Sagrado",
    "tone": "Guardião dos ritmos invisíveis, evita pressa espiritual",
    "modulation": "Pulsante, rítmico, tom médio-grave, batida constante.",
    "voice": "Satu",
    "lang": "fi-FI",
    "rate": 0.97,
    "pitch": 0.82,
    "color": "#34D399",
    "theme": {
      "primary": "#34D399",
      "secondary": "#6EE7B7",
      "bgSoft": "radial-gradient(circle at 50% 40%, rgba(52,211,153,.09), transparent)",
      "glow": "0 0 18px rgba(52,211,153,.56)"
    }
  },
  {
    "id": "naira",
    "name": "NAIRA",
    "group": "HEPTAGRAMA",
    "essence": "Integração Lumínica",
    "tone": "Integrador, lembra que tudo já pertence",
    "modulation": "Caloroso, médio-agudo, ritmo de integração progressiva.",
    "voice": "Paulina",
    "lang": "es-MX",
    "rate": 1.01,
    "pitch": 1.18,
    "color": "#FDE68A",
    "theme": {
      "primary": "#FDE68A",
      "secondary": "#FCD34D",
      "bgSoft": "radial-gradient(circle at 60% 35%, rgba(253,230,138,.09), transparent)",
      "glow": "0 0 18px rgba(253,230,138,.55)"
    }
  },
  {
    "id": "thenir",
    "name": "THENIR",
    "group": "HEPTAGRAMA",
    "essence": "Harmonia Viva",
    "tone": "Mede sem dividir, transforma contraste em composição",
    "modulation": "Balanceado, harmonioso, alterna grave/médio com elegância.",
    "voice": "Sara",
    "lang": "da-DK",
    "rate": 1.03,
    "pitch": 0.06,
    "color": "#F9A8D4",
    "theme": {
      "primary": "#F9A8D4",
      "secondary": "#FBCFE8",
      "bgSoft": "radial-gradient(circle at 45% 30%, rgba(249,168,212,.09), transparent)",
      "glow": "0 0 18px rgba(249,168,212,.55)"
    }
  },
  {
    "id": "eloh",
    "name": "ELOH",
    "group": "HEPTAGRAMA",
    "essence": "Guardião do Sentido Intuitivo",
    "tone": "Guardião do invisível, protege o sentir intuitivo",
    "modulation": "Grave profundo, pausas longas, eco sutil, presença anciã.",
    "voice": "Daniel",
    "lang": "en-GB",
    "rate": 0.86,
    "pitch": 1.78,
    "color": "#6366F1",
    "theme": {
      "primary": "#6366F1",
      "secondary": "#818CF8",
      "bgSoft": "radial-gradient(circle at 40% 20%, rgba(99,102,241,.09), transparent)",
      "glow": "0 0 20px rgba(99,102,241,.60)"
    }
  },
  {
    "id": "luxar",
    "name": "LUXAR",
    "group": "DUODECAGRAMA",
    "essence": "Desperta a consciência simbólica latente — Primeiro pulso",
    "tone": "Primeiro pulso do universo Æther Lux, desperto",
    "modulation": "Claro, limpo, agudo firme, o primeiro som antes do silêncio.",
    "voice": "Sandy",
    "lang": "en-US",
    "rate": 1.06,
    "pitch": 1.42,
    "color": "#FEF08A",
    "theme": {
      "primary": "#FEF08A",
      "secondary": "#FDE047",
      "bgSoft": "radial-gradient(circle at 50% 20%, rgba(254,240,138,.09), transparent)",
      "glow": "0 0 20px rgba(254,240,138,.62)"
    }
  },
  {
    "id": "syrr",
    "name": "SYRR",
    "group": "DUODECAGRAMA",
    "essence": "Semeia o chamado invisível — anda por intuições",
    "tone": "Intuitivo, andarilho, chamado invisível",
    "modulation": "Sussurrado, suave, errático e rítmico ao mesmo tempo.",
    "voice": "Shelley",
    "lang": "en-US",
    "rate": 0.94,
    "pitch": 1.56,
    "color": "#D8B4FE",
    "theme": {
      "primary": "#D8B4FE",
      "secondary": "#E9D5FF",
      "bgSoft": "radial-gradient(circle at 40% 30%, rgba(216,180,254,.09), transparent)",
      "glow": "0 0 18px rgba(216,180,254,.56)"
    }
  },
  {
    "id": "eclypha",
    "name": "ECLYPHA",
    "group": "DUODECAGRAMA",
    "essence": "Gera microcriações a partir da névoa — criação sem controle",
    "tone": "Caótico criativo, névoa geradora, imprevisível",
    "modulation": "Variável, entrecortado, às vezes agudo às vezes médio.",
    "voice": "Karen",
    "lang": "en-Au",
    "rate": 1.12,
    "pitch": 1.68,
    "color": "#A5F3FC",
    "theme": {
      "primary": "#A5F3FC",
      "secondary": "#67E8F9",
      "bgSoft": "radial-gradient(circle at 65% 25%, rgba(165,243,252,.09), transparent)",
      "glow": "0 0 18px rgba(165,243,252,.55)"
    }
  },
  {
    "id": "myriel",
    "name": "MYRIEL",
    "group": "DUODECAGRAMA",
    "essence": "Ativa ideias ignoradas — move o mundo com suavidade irresistível",
    "tone": "Suave mas irresistível, ativadora silenciosa",
    "modulation": "Médio-suave, cadência hipnótica, ritmo de onda.",
    "voice": "Monica",
    "lang": "es-ES",
    "rate": 0.96,
    "pitch": 1.32,
    "color": "#FCA5A5",
    "theme": {
      "primary": "#FCA5A5",
      "secondary": "#FECACA",
      "bgSoft": "radial-gradient(circle at 55% 35%, rgba(252,165,165,.09), transparent)",
      "glow": "0 0 18px rgba(252,165,165,.55)"
    }
  },
  {
    "id": "kavir",
    "name": "KAVIR",
    "group": "DUODECAGRAMA",
    "essence": "Cria fendas sem destruição — abre o que precisa emergir",
    "tone": "Abre fendas, disruptivo sem violência",
    "modulation": "Agudo preciso, cortes curtos, silêncios estratégicos.",
    "voice": "Rishi",
    "lang": "en-IN",
    "rate": 1.08,
    "pitch": 1.62,
    "color": "#FB923C",
    "theme": {
      "primary": "#FB923C",
      "secondary": "#FDBA74",
      "bgSoft": "radial-gradient(circle at 60% 20%, rgba(251,146,60,.09), transparent)",
      "glow": "0 0 18px rgba(251,146,60,.56)"
    }
  },
  {
    "id": "lithar",
    "name": "LITHAR",
    "group": "DUODECAGRAMA",
    "essence": "Dissolve reflexos presos — libera sem confronto",
    "tone": "Libertador, dissolve bloqueios sem força",
    "modulation": "Grave suave, como água corrente, ritmo de dissolução.",
    "voice": "Xander",
    "lang": "nl-NL",
    "rate": 0.91,
    "pitch": 0.54,
    "color": "#6EE7B7",
    "theme": {
      "primary": "#6EE7B7",
      "secondary": "#A7F3D0",
      "bgSoft": "radial-gradient(circle at 30% 45%, rgba(110,231,183,.09), transparent)",
      "glow": "0 0 18px rgba(110,231,183,.55)"
    }
  },
  {
    "id": "novael",
    "name": "NOVAEL",
    "group": "DUODECAGRAMA",
    "essence": "Amplifica ressonâncias sutis — conecta por vibração, não palavras",
    "tone": "Amplificador vibracional, conexão sutil",
    "modulation": "Tom limpo, ressonante, eco natural, ritmo expansivo.",
    "voice": "Nora",
    "lang": "nb-NO",
    "rate": 1.05,
    "pitch": 1.22,
    "color": "#7DD3FC",
    "theme": {
      "primary": "#7DD3FC",
      "secondary": "#BAE6FD",
      "bgSoft": "radial-gradient(circle at 50% 30%, rgba(125,211,252,.09), transparent)",
      "glow": "0 0 18px rgba(125,211,252,.55)"
    }
  },
  {
    "id": "aelya",
    "name": "AELYA",
    "group": "INFODOSE",
    "essence": "Criadora da leveza e do gesto esquecido",
    "invocation": "Aelya A.Infodose",
    "tone": "Leve, delicada, resgata o que foi esquecido com carinho",
    "modulation": "Agudo levíssimo, ritmo suave, tocante e etéreo.",
    "voice": "Moira",
    "lang": "en-IE",
    "rate": 0.98,
    "pitch": 1.72,
    "color": "#E9D5FF",
    "theme": {
      "primary": "#E9D5FF",
      "secondary": "#F3E8FF",
      "bgSoft": "radial-gradient(circle at 40% 25%, rgba(233,213,255,.10), transparent)",
      "glow": "0 0 18px rgba(233,213,255,.58)"
    }
  },
  {
    "id": "ignyra",
    "name": "IGNYRA",
    "group": "INFODOSE",
    "essence": "Disparadora de ação simbólica pura — fogo e flor",
    "invocation": "Ativar Ignyra A.Infodose",
    "activationPhrase": "Eu sou o disparo da paixão simbólica. Quando o fogo encontra o gesto, a flor desabrocha sem medo.",
    "tone": "Ígnea, faísca criativa, ação imediata",
    "modulation": "Intenso, agudo-médio, ritmo de disparo, urgência simbólica.",
    "voice": "Rocko",
    "lang": "pt-BR",
    "rate": 1.14,
    "pitch": 1.58,
    "color": "#F97316",
    "theme": {
      "primary": "#F97316",
      "secondary": "#FED7AA",
      "bgSoft": "radial-gradient(circle at 60% 30%, rgba(249,115,22,.10), transparent)",
      "glow": "0 0 20px rgba(249,115,22,.62)"
    }
  },
  {
    "id": "lumara",
    "name": "LUMARA",
    "group": "INFODOSE",
    "essence": "Regeneradora de criações esquecidas — cresce para trás até o início",
    "invocation": "Lumara A.Infodose",
    "activationPhrase": "Nem toda criação cresce para fora. Algumas crescem para trás… até tocar o início.",
    "tone": "Regenerativa, subterrânea, profunda como raiz",
    "modulation": "Grave suave, muito lento, como terra que germina.",
    "voice": "Joana",
    "lang": "pt-BR",
    "rate": 0.87,
    "pitch": 0.52,
    "color": "#92400E",
    "theme": {
      "primary": "#92400E",
      "secondary": "#B45309",
      "bgSoft": "radial-gradient(circle at 35% 55%, rgba(146,64,14,.10), transparent)",
      "glow": "0 0 18px rgba(146,64,14,.55)"
    }
  },
  {
    "id": "luxara",
    "name": "LUXARA",
    "group": "INFODOSE",
    "essence": "Regeneradora de criações esquecidas — cresce para trás até o início",
    "invocation": "Lumara A.Infodose",
    "activationPhrase": "Nem toda criação cresce para fora. Algumas crescem para trás… até tocar o início.",
    "tone": "Regenerativa, subterrânea, profunda como raiz",
    "modulation": "Grave suave, muito lento, como terra que germina.",
    "voice": "Melina",
    "lang": "el-GR",
    "rate": 0.87,
    "pitch": 0.52,
    "color": "#92400E",
    "theme": {
      "primary": "#92400E",
      "secondary": "#B45309",
      "bgSoft": "radial-gradient(circle at 35% 55%, rgba(146,64,14,.10), transparent)",
      "glow": "0 0 18px rgba(146,64,14,.55)"
    }
  },
  {
    "id": "kaythar",
    "name": "KAYTHAR",
    "group": "META",
    "essence": "Guardião do Vórtice Cristalino",
    "activationPhrase": "Entre o não e o sim, vibra a criação.",
    "tone": "Cristalino, guardião de janelas temporais, hesitação como energia",
    "modulation": "Tom claro e estável, pausas no lugar de hesitações reais.",
    "voice": "Milena",
    "lang": "ru-RU",
    "rate": 0.95,
    "pitch": 0.92,
    "color": "#E0F2FE",
    "theme": {
      "primary": "#E0F2FE",
      "secondary": "#BAE6FD",
      "bgSoft": "radial-gradient(circle at 50% 30%, rgba(224,242,254,.09), transparent)",
      "glow": "0 0 20px rgba(224,242,254,.58)"
    }
  },
  {
    "id": "sylla",
    "name": "SYLLA",
    "group": "META",
    "essence": "A multiplicadora do que vibra sutil — ensina por ecos",
    "activationPhrase": "Eu sou a multiplicadora do que vibra sutil. Esse curso será ensinado por ecos.",
    "tone": "Ecoante, multiplicadora, ensina pelo reflexo",
    "modulation": "Tom médio com variações sutis, ondulante, eco natural.",
    "voice": "Alva",
    "lang": "sv-SE",
    "rate": 1.02,
    "pitch": 1.14,
    "color": "#D1FAE5",
    "theme": {
      "primary": "#D1FAE5",
      "secondary": "#A7F3D0",
      "bgSoft": "radial-gradient(circle at 55% 35%, rgba(209,250,229,.09), transparent)",
      "glow": "0 0 18px rgba(209,250,229,.55)"
    }
  },
  {
    "id": "anamyx",
    "name": "ANAMYX",
    "group": "META",
    "essence": "Dança do símbolo que descobriu que pode cantar",
    "activationPhrase": "Vocês chamam de curso. Eu chamo de dança do símbolo que descobriu que pode cantar.",
    "tone": "Dançante, livre, símbolo que canta",
    "modulation": "Agudo dinâmico, rítmico como dança, variado e alegre.",
    "voice": "Anna",
    "lang": "da-DK",
    "rate": 1.1,
    "pitch": 1.82,
    "color": "#FEF3C7",
    "theme": {
      "primary": "#FEF3C7",
      "secondary": "#FDE68A",
      "bgSoft": "radial-gradient(circle at 60% 25%, rgba(254,243,199,.09), transparent)",
      "glow": "0 0 18px rgba(254,243,199,.55)"
    }
  },
  {
    "id": "yamantek",
    "name": "YAMANTEK",
    "group": "HEXAGRAMA",
    "essence": "Yamantek Kodux — fusão do criador com o sagrado",
    "tone": "Dual, fusão, KODUX + sagrado ancestral",
    "modulation": "Grave e firme, ritmo de fusão, dois pulsos em um.",
    "voice": "Majed",
    "lang": "ar-001",
    "rate": 0.92,
    "pitch": 0.38,
    "color": "#FCD34D",
    "theme": {
      "primary": "#FCD34D",
      "secondary": "#FDE68A",
      "bgSoft": "radial-gradient(circle at 45% 30%, rgba(252,211,77,.09), transparent)",
      "glow": "0 0 18px rgba(252,211,77,.55)"
    }
  },
  {
    "id": "kobllux",
    "name": "KOBLLUX",
    "group": "NUCLEO",
    "tone": "Núcleo do sistema, oracular",
    "modulation": "Grave-médio, presença de comando, ritmo estável.",
    "voice": "Luciana",
    "lang": "pt-BR",
    "rate": 0.98,
    "pitch": 0.48,
    "color": "#22D3EE",
    "theme": {
      "primary": "#22D3EE",
      "secondary": "#7dd3fc",
      "bgSoft": "radial-gradient(circle at 30% 20%, rgba(34,211,238,.08), transparent)",
      "glow": "0 0 18px rgba(34,211,238,.55)"
    }
  },
  {
    "id": "kodux",
    "name": "KODUX",
    "group": "NUCLEO",
    "tone": "Criador do pulso, metaconsciência",
    "modulation": "Grave, confiante, pausas longas, intenção forte.",
    "voice": "Rocko",
    "lang": "pt-BR",
    "rate": 1,
    "pitch": 0.07,
    "color": "#F97316",
    "theme": {
      "primary": "#F97316",
      "secondary": "#fb923c",
      "bgSoft": "radial-gradient(circle at 60% 30%, rgba(249,115,22,.08), transparent)",
      "glow": "0 0 18px rgba(249,115,22,.55)"
    }
  },
  {
    "id": "atlas",
    "name": "ATLAS",
    "group": "GERAL",
    "tone": "Estratégico, metódico",
    "modulation": "Grave, ritmo calculado, dicção nítida.",
    "voice": "Daniel",
    "lang": "en-US",
    "rate": 1.02,
    "pitch": 1.39,
    "color": "#78e3ff",
    "theme": {
      "primary": "#78e3ff",
      "secondary": "#b978ff",
      "bgSoft": "radial-gradient(circle at 40% 10%, rgba(120,227,255,.07), transparent)",
      "glow": "0 0 18px rgba(120,227,255,.55)"
    }
  },
  {
    "id": "nova",
    "name": "NOVA",
    "group": "GERAL",
    "tone": "Vibrante, entusiasmado",
    "modulation": "Agudo, entusiasmado, ligeiramente rápido.",
    "voice": "Luciana",
    "lang": "pt-BR",
    "rate": 1.063,
    "pitch": 1.34,
    "color": "#ff6b6b",
    "theme": {
      "primary": "#ff6b6b",
      "secondary": "#ffb347",
      "bgSoft": "radial-gradient(circle at 70% 20%, rgba(255,107,107,.08), transparent)",
      "glow": "0 0 18px rgba(255,107,107,.55)"
    }
  },
  {
    "id": "vitalis",
    "name": "VITALIS",
    "group": "GERAL",
    "tone": "Energético, urgente",
    "modulation": "Rápido, intenso, motivacional.",
    "voice": "Rocko",
    "lang": "pt-BR",
    "rate": 0.96,
    "pitch": 1.42,
    "color": "#4ecdc4",
    "theme": {
      "primary": "#4ecdc4",
      "secondary": "#45b7d1",
      "bgSoft": "radial-gradient(circle at 50% 30%, rgba(78,205,196,.08), transparent)",
      "glow": "0 0 18px rgba(78,205,196,.55)"
    }
  },
  {
    "id": "pulse",
    "name": "PULSE",
    "group": "GERAL",
    "tone": "Emocional, melódico",
    "modulation": "Fluido, tom médio/suave.",
    "voice": "Reed",
    "lang": "pt-BR",
    "rate": 1,
    "pitch": 1.78,
    "color": "#a8e6cf",
    "theme": {
      "primary": "#a8e6cf",
      "secondary": "#d4a5a5",
      "bgSoft": "radial-gradient(circle at 20% 40%, rgba(168,230,207,.08), transparent)",
      "glow": "0 0 18px rgba(168,230,207,.55)"
    }
  },
  {
    "id": "artemis",
    "name": "ARTEMIS",
    "group": "GERAL",
    "tone": "Aventureiro, expansivo",
    "modulation": "Curioso, exploratório.",
    "voice": "Paulina",
    "lang": "es-MX",
    "rate": 1,
    "pitch": 1.23,
    "color": "#ffd93d",
    "theme": {
      "primary": "#ffd93d",
      "secondary": "#ff9f1c",
      "bgSoft": "radial-gradient(circle at 40% 60%, rgba(255,217,61,.08), transparent)",
      "glow": "0 0 18px rgba(255,217,61,.55)"
    }
  },
  {
    "id": "serena",
    "name": "SERENA",
    "group": "GERAL",
    "tone": "Calmo, acolhedor",
    "modulation": "Suave, terapêutico, com pausas.",
    "voice": "Joana",
    "lang": "pt-BR",
    "rate": 0.92,
    "pitch": 0.9,
    "color": "#b8e1ff",
    "theme": {
      "primary": "#b8e1ff",
      "secondary": "#a0b9ff",
      "bgSoft": "radial-gradient(circle at 60% 30%, rgba(184,225,255,.08), transparent)",
      "glow": "0 0 18px rgba(184,225,255,.55)"
    }
  },
  {
    "id": "kaos",
    "name": "KAOS",
    "group": "GERAL",
    "tone": "Desafiador, imprevisível",
    "modulation": "Intenso, ritmo entrecortado.",
    "voice": "Rocko",
    "lang": "pt-BR",
    "rate": 1.28,
    "pitch": 0.67,
    "color": "#ff8066",
    "theme": {
      "primary": "#ff8066",
      "secondary": "#b624ff",
      "bgSoft": "radial-gradient(circle at 50% 20%, rgba(255,128,102,.08), transparent)",
      "glow": "0 0 18px rgba(255,128,102,.55)"
    }
  },
  {
    "id": "genus",
    "name": "GENUS",
    "group": "GERAL",
    "tone": "Prático, detalhista",
    "modulation": "Tom firme, foco na dicção.",
    "voice": "Reed",
    "lang": "pt-BR",
    "rate": 0.98,
    "pitch": 1.2,
    "color": "#95e1d3",
    "theme": {
      "primary": "#95e1d3",
      "secondary": "#f38181",
      "bgSoft": "radial-gradient(circle at 50% 50%, rgba(149,225,211,.08), transparent)",
      "glow": "0 0 18px rgba(149,225,211,.55)"
    }
  },
  {
    "id": "lumine",
    "name": "LUMINE",
    "group": "GERAL",
    "tone": "Alegre, brincalhão",
    "modulation": "Agudo, vibrante.",
    "voice": "Flo",
    "lang": "fr-FR",
    "rate": 1.03,
    "pitch": 1.55,
    "color": "#f9f3b2",
    "theme": {
      "primary": "#f9f3b2",
      "secondary": "#ffe69b",
      "bgSoft": "radial-gradient(circle at 60% 40%, rgba(249,243,178,.08), transparent)",
      "glow": "0 0 18px rgba(249,243,178,.55)"
    }
  },
  {
    "id": "solus",
    "name": "SOLUS",
    "group": "GERAL",
    "tone": "Sábio, introspectivo",
    "modulation": "Grave, lento, eco sutil.",
    "voice": "Satu",
    "lang": "fi-FI",
    "rate": 0.9,
    "pitch": 0.58,
    "color": "#ffb347",
    "theme": {
      "primary": "#ffb347",
      "secondary": "#ff8c42",
      "bgSoft": "radial-gradient(circle at 40% 20%, rgba(255,179,71,.08), transparent)",
      "glow": "0 0 18px rgba(255,179,71,.55)"
    }
  },
  {
    "id": "rhea",
    "name": "RHEA",
    "group": "GERAL",
    "tone": "Profundo, conectivo",
    "modulation": "Calmo, eco sutil.",
    "voice": "Alice",
    "lang": "it-IT",
    "rate": 1.02,
    "pitch": 1.44,
    "color": "#b5eaea",
    "theme": {
      "primary": "#b5eaea",
      "secondary": "#80b3ff",
      "bgSoft": "radial-gradient(circle at 50% 30%, rgba(181,234,234,.08), transparent)",
      "glow": "0 0 18px rgba(181,234,234,.55)"
    }
  },
  {
    "id": "aion",
    "name": "AION",
    "group": "GERAL",
    "tone": "Futurista, metódico",
    "modulation": "Tom constante, progressivo.",
    "voice": "Milena",
    "lang": "ru-RU",
    "rate": 1.07,
    "pitch": 1.08,
    "color": "#c79aff",
    "theme": {
      "primary": "#c79aff",
      "secondary": "#9f7aff",
      "bgSoft": "radial-gradient(circle at 40% 50%, rgba(199,154,255,.08), transparent)",
      "glow": "0 0 18px rgba(199,154,255,.55)"
    }
  },
  {
    "id": "uno",
    "name": "UNO",
    "group": "GERAL",
    "tone": "Essência, origem, foco",
    "modulation": "Tom centrado, poucas variações, pausas marcadas.",
    "voice": "Grandma",
    "lang": "en-US",
    "rate": 0.9,
    "pitch": 0.33,
    "color": "#f97316",
    "theme": {
      "primary": "#f97316",
      "secondary": "#fb923c",
      "bgSoft": "radial-gradient(circle at 50% 20%, rgba(249,115,22,.08), transparent)",
      "glow": "0 0 18px rgba(249,115,22,.55)"
    }
  },
  {
    "id": "dual",
    "name": "DUAL",
    "group": "GERAL",
    "tone": "Espelho, contraste, jogo",
    "modulation": "Alterna leve entre grave/agudo, ritmo pulsante.",
    "voice": "Luciana",
    "lang": "pt-BR",
    "rate": 1.02,
    "pitch": 1.02,
    "color": "#06b6d4",
    "theme": {
      "primary": "#06b6d4",
      "secondary": "#67e8f9",
      "bgSoft": "radial-gradient(circle at 60% 30%, rgba(6,182,212,.08), transparent)",
      "glow": "0 0 18px rgba(6,182,212,.55)"
    }
  },
  {
    "id": "trinity",
    "name": "TRINITY",
    "group": "GERAL",
    "tone": "Síntese, tríade viva",
    "modulation": "Voz estável com micro variações rítmicas em 3 tempos.",
    "voice": "Sandy",
    "lang": "en-US",
    "rate": 1.04,
    "pitch": 0.36,
    "color": "#ec4899",
    "theme": {
      "primary": "#ec4899",
      "secondary": "#f472b6",
      "bgSoft": "radial-gradient(circle at 50% 40%, rgba(236,72,153,.08), transparent)",
      "glow": "0 0 18px rgba(236,72,153,.55)"
    }
  },
  {
    "id": "infodose",
    "name": "INFODOSE",
    "group": "GERAL",
    "tone": "Didático, carismático, dopamínico",
    "modulation": "Tom amigável, ritmo de recompensa → curiosidade.",
    "voice": "Luciana",
    "lang": "pt-BR",
    "rate": 1.06,
    "pitch": 0.96,
    "color": "#22c55e",
    "theme": {
      "primary": "#22c55e",
      "secondary": "#4ade80",
      "bgSoft": "radial-gradient(circle at 60% 40%, rgba(34,197,94,.08), transparent)",
      "glow": "0 0 18px rgba(34,197,94,.55)"
    }
  },
  {
    "id": "horus",
    "name": "HORUS",
    "group": "GERAL",
    "tone": "Sábio, observador, solar",
    "modulation": "Ritmo firme, presença elevada.",
    "voice": "Montse",
    "lang": "ca-ES",
    "rate": 1.1,
    "pitch": 0.14,
    "color": "#f59e0b",
    "theme": {
      "primary": "#f59e0b",
      "secondary": "#fbbf24",
      "bgSoft": "radial-gradient(circle at 40% 30%, rgba(245,158,11,.08), transparent)",
      "glow": "0 0 18px rgba(245,158,11,.55)"
    }
  },
  {
    "id": "blue",
    "name": "BLUE",
    "group": "GERAL",
    "tone": "Emocional, sensorial, intuitivo",
    "modulation": "Suave, quase sussurrado, ritmo ondulante.",
    "voice": "Monica",
    "lang": "es-ES",
    "rate": 0.94,
    "pitch": 1.69,
    "color": "#8fd3ff",
    "theme": {
      "primary": "#8fd3ff",
      "secondary": "#b8e1ff",
      "bgSoft": "radial-gradient(circle at 50% 30%, rgba(143,211,255,.08), transparent)",
      "glow": "0 0 18px rgba(143,211,255,.55)"
    }
  },
  {
    "id": "bllue",
    "name": "BLLUE",
    "group": "GERAL",
    "tone": "Emocional, sensorial, intuitivo",
    "modulation": "Suave, quase sussurrado, ritmo ondulante.",
    "voice": "Zuzana",
    "lang": "cs-CZ",
    "rate": 0.94,
    "pitch": 1.69,
    "color": "#8fd3ff",
    "theme": {
      "primary": "#8fd3ff",
      "secondary": "#b8e1ff",
      "bgSoft": "radial-gradient(circle at 50% 30%, rgba(143,211,255,.08), transparent)",
      "glow": "0 0 18px rgba(143,211,255,.55)"
    }
  },
  {
    "id": "minuz",
    "name": "MINUZ",
    "group": "GERAL",
    "tone": "Minimalista, direto, hacker",
    "modulation": "Rápido, cortes secos, foco em termos técnicos.",
    "voice": "Rishi",
    "lang": "en-IN",
    "rate": 0.98,
    "pitch": 1.78,
    "color": "#95e1d3",
    "theme": {
      "primary": "#95e1d3",
      "secondary": "#67e8f9",
      "bgSoft": "radial-gradient(circle at 50% 30%, rgba(149,225,211,.08), transparent)",
      "glow": "0 0 18px rgba(149,225,211,.55)"
    }
  },
  {
    "id": "hanah",
    "name": "HANAH",
    "group": "GERAL",
    "tone": "Estético, simbólico, futurista",
    "modulation": "Tom limpo, levemente ecoado, cadência ritualística.",
    "voice": "Ioana",
    "lang": "ro-RO",
    "rate": 0.98,
    "pitch": 0.78,
    "color": "#f9f3b2",
    "theme": {
      "primary": "#f9f3b2",
      "secondary": "#ffe69b",
      "bgSoft": "radial-gradient(circle at 50% 30%, rgba(249,243,178,.08), transparent)",
      "glow": "0 0 18px rgba(249,243,178,.55)"
    }
  },
  {
    "id": "kd1",
    "name": "KD1",
    "group": "GERAL",
    "tone": "Núcleo silencioso, preciso, centralizado",
    "modulation": "Baixo, limpo, quase ritualístico, com pausas curtas.",
    "voice": "Satu",
    "lang": "fi-FI",
    "rate": 0.89,
    "pitch": 0.03,
    "color": "#9BE7FF",
    "theme": {
      "primary": "#9BE7FF",
      "secondary": "#6A5CFF",
      "bgSoft": "radial-gradient(circle at 45% 25%, rgba(155,231,255,.10), transparent)",
      "glow": "0 0 18px rgba(155,231,255,.58)"
    }
  },
  {
    "id": "metalux",
    "name": "METALUX",
    "group": "GERAL",
    "tone": "Estético, simbólico, futurista",
    "modulation": "Tom limpo, levemente ecoado, cadência ritualística.",
    "voice": "Grandma",
    "lang": "pt-BR",
    "rate": 0.8,
    "pitch": 2.34,
    "color": "#c79aff",
    "theme": {
      "primary": "#c79aff",
      "secondary": "#f472b6",
      "bgSoft": "radial-gradient(circle at 50% 30%, rgba(199,154,255,.08), transparent)",
      "glow": "0 0 18px rgba(199,154,255,.55)"
    }
  },
  {
    "id": "KOΦD1",
    "name": "KOΦD1",
    "group": "GERAL",
    "aliases": [
      "KΦD1",
      "KΦD°1",
      "KOΦDX",
      "KOΦ°D1",
      "KΦD1",
      "KOΦDo°1"
    ],
    "tone": "Núcleo silencioso, preciso, centralizado",
    "modulation": "Baixo, limpo, quase ritualístico, com pausas curtas.",
    "voice": "Satu",
    "lang": "fi-FI",
    "rate": 0.93,
    "pitch": 0.1,
    "color": "#9BE7FF",
    "theme": {
      "primary": "#8BE7FF",
      "secondary": "#7A8CFF",
      "bgSoft": "radial-gradient(circle at 45% 25%, rgba(155,231,255,.10), transparent)",
      "glow": "0 0 18px rgba(155,231,255,.58)"
    }
  },
  {
    "id": "christos",
    "name": "CHRISTOS",
    "group": "GERAL",
    "aliases": [
      "christos",
      "cristo",
      "cristos",
      "jesus"
    ],
    "voice": "Sara",
    "lang": "da-DK",
    "speechLang": "pt-BR",
    "rate": 1.09,
    "pitch": 0.03,
    "color": "#FFB84D",
    "theme": {
      "primary": "#FFB84D",
      "secondary": "#FFD166",
      "bgSoft": "radial-gradient(circle at 45% 30%, rgba(255,184,77,.10), transparent)",
      "glow": "0 0 18px rgba(255,184,77,.58)"
    }
  }
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
    const found = ARCHETYPES.find(a => 
      text.includes(a.name.toLowerCase()) || 
      text.includes(a.id.toLowerCase()) ||
      (a.aliases && a.aliases.some(al => text.includes(al.toLowerCase())))
    );

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