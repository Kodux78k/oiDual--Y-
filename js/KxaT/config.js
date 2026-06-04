export const STORAGE = {
  ENABLED: 'infodoseEnabled',
  THEME: 'infodoseTheme',
  USER_NAME: 'infodoseUserName',
  ASSISTANT_NAME: 'infodoseAssistantName',
  OPENROUTER_KEY: 'openrouter_api_key',
  OPENROUTER_MODEL: 'openrouter_model',
  VOICE_CONFIG: 'infodoseVoiceConfig',
  VOICE_CURRENT_KEY: 'infodoseVoiceCurrentKey'
};

export const DEFAULTS = {
  API_URL: 'https://openrouter.ai/api/v1/chat/completions',
  MODEL: 'nvidia/nemotron-3-nano-omni-30b-a3-b-reasoning:free',
  TEMP: 0.2,
  CHUNK_SIZE: 12000
};

export const ARCHETYPE_KEYWORDS = {
  Atlas:   ["atlas","fluxo","mapa","estrutura","organização","organizar","planejamento","árvore","checklist","estratégia"],
  Nova:    ["nova","começar","começo","ideia","idéia","visão","criar","protótipo","protótipos","imaginar","descobrir","ativar","estado"],
  Vitalis: ["vitalis","corpo","energia","respiração","ritmo","h3o2","saúde","vitalidade","hidratação","movimento"],
  Pulse:   ["pulse","pulso","tempo","ciclo","ciclos","batida","pulsar","ritmo","loop","síncrono","batimento"],
  Artemis: ["artemis","foco","focada","mira","precisão","aventura","explorar","exploração","alvo","caçada"],
  Serena:  ["serena","serenidade","calma","acolhimento","cuidar","suave","pausa","repouso","apoio","paz","tranquilo","tranquilidade"],
  Kaos:    ["kaos","quebra","ruptura","caos","provocação","virada","rebeldia","desalinho","disrupção","choque"],
  Genus:   ["genus","padrão","padrões","tabela","planilha","referência","documento","estrutura lógica","dados","sistematizar"],
  Lumine:  ["lumine","luz","cores","estética","beleza","design","gradiente","iluminar","alegria","lúdico","brincadeira","brilho","colorido"],
  Rhea:    ["rhea","guia","cuidado","conectar","empatia","acompanhamento","profundo","profundidade","vínculo","raízes","intimidade"],
  Solus:   ["solus","unidade","sozinho","inteiro","solo","núcleo","essência","solidão","silêncio","meditação","contemplar","introspecção"],
  Aion:    ["aion","tempo longo","ciclos grandes","eras","fractal","registro","eterno","futuro","linha do tempo","cíclico","infinito"],
  KOBLLUX: ["kobllux","kob","nó raiz","núcleo do sistema","portal","oráculo","meta-sistema"],
  Uno:     ["uno","origem","fonte","essência","essencial","mínimo","minimalista","centro"],
  Dual:    ["dual","espelho","contraste","polaridade","dois lados","reverso","espelhado"],
  Trinity: ["trinity","trindade","tríade","3·6·9","3x","síntese","triângulo","triádico"],
  Infodose:["infodose","dose","arquétipo","arquétipos","ativação","dopamina","pílula"],
  Kodux:   ["kodux","criador","metaconsciência","pulso criador","manifesto","metafuturo"],
  Bllue:   ["bllue","blue","emoção","emocional","sensível","sensação","sensório","intuitivo"],
  Minuz:   ["minuz","minimalista","hacker","hackear","direto ao ponto","compressão","refatorar"],
  HANAH:   ["hanah","hannah","estético","estética","futurista","visual","simbolismo","símbolos"],
  MetaLux: ["metalux","meta lux","lux","oráculo","luxar","portal lux","estético-simbólico"]
};

export const RV_ARCHES = ['Atlas','Nova','Vitalis','Pulse','Artemis','Serena','Kaos','Genus','Lumine','Rhea','Solus','Aion'];

export const ARCH_NAMES = {
  atlas: "Atlas", nova: "Nova", vitalis: "Vitalis", pulse: "Pulse", kaos: "Kaos",
  kodux: "Kodux", lumine: "Lumine", aion: "Aion", kobllux: "Kobllux", artemis: "Artemis",
  serena: "Serena", genus: "Genus", solus: "Solus", rhea: "Rhea", uno: "Uno",
  dual: "Dual", trinity: "Trinity", infodose: "Infodose", horus: "Horus", bllue: "Bllue"
};
