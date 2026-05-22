// archs-engine.js
'use strict';

// 1. Matriz de Arquétipos Atualizada com KD1 Ajustado e Aliases Robustos
export const ARCHETYPES = [
  {
    id: 'kd1',
    name: 'KD1',
    aliases: ['kd1', 'kd°1', 'k-d-1', 'K°D1', 'cade primeiro', 'kd graus 1'],
    tone: 'Núcleo silencioso, preciso, centralizado',
    modulation: 'Baixo, limpo, quase ritualístico, com pausas curtas.',
    voice: 'Satu',
    lang: 'fi-FI',
    rate: 0.89,
    pitch: 0.1,
    color: '#9BE7FF',
    theme: {
      primary: '#9BE7FF',
      secondary: '#6A5CFF',
      bgSoft: 'radial-gradient(circle at 45% 25%, rgba(155,231,255,.10), transparent)',
      glow: '0 0 18px rgba(155,231,255,.58)'
    }
  },
  {
    id: 'christos',
    name: 'CHRISTOS',
    aliases: ['christos', 'cristo', 'cristos', 'jesus'],
    voice: 'Paulina',
    lang: 'safe',
    speechLang: 'pt-BR',
    rate: 0.33,
    pitch: 0.03,
    color: '#FFB84D',
    theme: {
      primary: '#FFB84D',
      secondary: '#FFD166',
      bgSoft: 'radial-gradient(circle at 45% 30%, rgba(255,184,77,.10), transparent)',
      glow: '0 0 18px rgba(255,184,77,.58)'
    }
  }
];

// Chave padronizada do ecossistema DUAL
const STORAGE_KEY = 'di_user_archetype_map';

// Auxiliares de Normalização de Texto
function normalizeText(txt) {
  return String(txt || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-°]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Varre o texto em busca de aliases de acionamento
export function detectArchetype(text) {
  const cleanText = normalizeText(text);
  if (!cleanText) return null;

  return ARCHETYPES.find(arch => {
    const triggers = [arch.id, arch.name, ...(arch.aliases || [])].map(normalizeText);
    return triggers.some(trigger => trigger && cleanText.includes(trigger));
  }) || null;
}

// Gerenciamento de Persistência (LocalStorage Centralizado di_)
export function saveUserArchetype(username, archetypeId) {
  const cleanUser = normalizeText(username);
  if (!cleanUser) return;

  try {
    const map = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    map[cleanUser] = archetypeId;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (e) {
    console.error("Erro ao salvar no di_ LocalStorage", e);
  }
}

export function getUserArchetype(username) {
  const cleanUser = normalizeText(username);
  if (!cleanUser) return null;

  try {
    const map = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const archId = map[cleanUser];
    return ARCHETYPES.find(a => a.id === archId) || null;
  } catch {
    return null;
  }
}

// Aplica a identidade visual ao Fusion Card e atualiza o Wake Orb Avatar
export function applyArchetypeUI(archetype) {
  const avatar = document.getElementById('wakeOrbAvatar');
  const label = document.getElementById('archTagLabel');
  const dot = document.getElementById('archIndicatorDot');
  const card = document.getElementById('dualFusionCard');

  if (!archetype) return;

  // Atualiza Textos
  if (label) label.textContent = archetype.name;
  
  // Injeta variáveis CSS no escopo do Card para alimentar o Orbe e as Bordas
  if (card) {
    card.style.setProperty('--arch-color', archetype.color);
    card.style.setProperty('--arch-glow', archetype.theme?.glow || 'none');
    card.style.setProperty('--arch-bgSoft', archetype.theme?.bgSoft || 'transparent');
    card.style.borderColor = archetype.color;
  }

  if (dot) {
    dot.style.background = archetype.color;
  }

  // Efeito pulsante/reativo no Wake Orb Avatar baseado no ritmo (rate)
  if (avatar) {
    avatar.style.background = archetype.theme?.bgSoft || archetype.color;
    avatar.style.boxShadow = archetype.theme?.glow || 'none';
  }
}

// Execução de Voz (TTS)
export function playArchetypeVoice(archetype) {
  if (!archetype || !('speechSynthesis' in window)) return;

  const utterance = new SpeechSynthesisUtterance();
  // Se for KD1 emitindo som ritualístico ou Christos
  utterance.text = `${archetype.name} ativado. ${archetype.tone || ''}`;
  utterance.lang = archetype.speechLang || archetype.lang || 'pt-BR';
  utterance.rate = archetype.rate ?? 1;
  utterance.pitch = archetype.pitch ?? 1;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}