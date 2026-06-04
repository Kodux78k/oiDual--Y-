
  (()=>{

    const ARCHETYPES = [
      { id:'atlas',   name:'Atlas',   tone:'Estratégico, metódico',        modulation:'Grave, ritmo calculado, dicção nítida.',        voice:'Reed',    rate:1.0,  pitch:0.93 },
      { id:'nova',    name:'Nova',    tone:'Vibrante, entusiasmado',       modulation:'Agudo, entusiasmado, ligeiramente rápido.',      voice:'Luciana', rate:1.063, pitch:1.34 },
      { id:'vitalis', name:'Vitalis', tone:'Energético, urgente',          modulation:'Rápido, intenso, motivacional.',                  voice:'Rocko',   rate:0.96, pitch:1.42 },
      { id:'pulse',   name:'Pulse',   tone:'Emocional, melódico',          modulation:'Fluido, tom médio/suave.',                       voice:'Reed',    rate:1.0, pitch:1.14 },
      { id:'artemis', name:'Artemis', tone:'Aventureiro, expansivo',       modulation:'Curioso, exploratório.',                         voice:'Paulina',    rate:1.00, pitch:1.23 },
      { id:'serena',  name:'Serena',  tone:'Calmo, acolhedor',             modulation:'Suave, terapêutico, com pausas.',                voice:'Joana',   rate:0.92, pitch:0.90 },
      { id:'kaos',    name:'Kaos',    tone:'Desafiador, imprevisível',     modulation:'Intenso, ritmo entrecortado.',                   voice:'Rocko',   rate:1.53, pitch:0.67 },
      { id:'genus',   name:'Genus',   tone:'Prático, detalhista',          modulation:'Tom firme, foco na dicção.',                     voice:'Reed',    rate:0.98, pitch:1.20 },
      { id:'lumine',  name:'Lumine',  tone:'Alegre, brincalhão',           modulation:'Agudo, vibrante.',                               voice:'Flo',     rate:1.030, pitch:1.55 },
      { id:'solus',   name:'Solus',   tone:'Sábio, introspectivo',         modulation:'Grave, lento, eco sutil.',                       voice:'Satu',    rate:0.88, pitch:0.87 },
      { id:'rhea',    name:'Rhea',    tone:'Profundo, conectivo',          modulation:'Calmo, eco sutil.',                              voice:'Joana',   rate:1.02, pitch:0.44 },
      { id:'aion',    name:'Aion',    tone:'Futurista, metódico',          modulation:'Tom constante, progressivo.',                    voice:'Monica',  rate:0.98, pitch:1.00 },
      { id:'kobllux', name:'KOBLLUX', tone:'Núcleo do sistema, oracular',
        modulation:'Grave-médio, presença de comando, ritmo estável.',     voice:'es_m',  rate:0.98, pitch:0.48 },
      { id:'uno',     name:'Uno',     tone:'Essência, origem, foco',
        modulation:'Tom centrado, poucas variações, pausas marcadas.',     voice:'Grandma',    rate:0.90, pitch:0.93 },
      { id:'dual',    name:'Dual',    tone:'Espelho, contraste, jogo',
        modulation:'Alterna leve entre grave/agudo, ritmo pulsante.',      voice:'pt_m',    rate:1.02, pitch:1.02 },
      { id:'trinity', name:'Trinity', tone:'Síntese, tríade viva',
        modulation:'Voz estável com micro variações rítmicas em 3 tempos.', voice:'Sandy', rate:1.04, pitch:1.04 },
      { id:'infodose',name:'Infodose',tone:'Didático, carismático, dopamínico',
        modulation:'Tom amigável, ritmo de recompensa → curiosidade.',      voice:'Luciana', rate:1.06, pitch:0.96 },
      { id:'kodux',   name:'KODUX',   tone:'Criador do pulso, metaconsciência',
        modulation:'Grave, confiante, pausas longas, intenção forte.',      voice:'Reed pt-BR',  rate:0.86, pitch:0.18 },
      { id:'bllue',   name:'Bllue',   tone:'Emocional, sensorial, intuitivo',
        modulation:'Suave, quase sussurrado, ritmo ondulante.',            voice:'Joana',   rate:0.94, pitch:1.69 },
      { id:'minuz',   name:'Minuz',   tone:'Minimalista, direto, hacker',
        modulation:'Rápido, cortes secos, foco em termos técnicos.',       voice:'Reed',    rate:1.05, pitch:0.90 },
      { id:'hanah',   name:'HANAH',   tone:'Estético, simbólico, futurista',
        modulation:'Tom limpo, levemente ecoado, cadência ritualística.',  voice:'Monica',  rate:1.00, pitch:1.08 },
      { id:'metalux', name:'MetaLux', tone:'Estético, simbólico, futurista',
        modulation:'Tom limpo, levemente ecoado, cadência ritualística.',  voice:'Grandma',  rate:0.80, pitch:1.68 }
    ];

    window.KOBLLUX_VOICES = ARCHETYPES.reduce((acc,a)=>{
      acc[a.name.toLowerCase()] = a;
      return acc;
    },{});

    const origSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
    window.speechSynthesis.speak = (u)=>{
      const text = (u.text||'').toLowerCase();
      const found = ARCHETYPES.find(a=> text.includes(a.name.toLowerCase()));
      if(found){
        const voices = speechSynthesis.getVoices();
        const match = voices.find(v=> v && v.name && v.name.includes(found.voice));
        if(match) u.voice = match;
        u.pitch = found.pitch;
        u.rate  = found.rate;
        console.log('🎙️ KOBLLUX Voice →', found.name, '→', found.voice, `(rate=${found.rate}, pitch=${found.pitch})`);
      }
      origSpeak(u);
    };

    console.log('⚡ KOBLLUX Voices Integradas —', ARCHETYPES.length, 'perfis ativos');
    window.dispatchEvent(new Event('KOBLLUX_VOICES_READY'));
  })();
  