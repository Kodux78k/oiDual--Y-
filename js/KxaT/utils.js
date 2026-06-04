export const qs = (selectors, root = document) => {
  for (const sel of selectors) {
    const el = root.querySelector(sel);
    if (el) return el;
  }
  return null;
};

export function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function safeJsonParse(raw, fallback = null) {
  try { return JSON.parse(raw); }
  catch { return fallback; }
}

export function getBlockText(block) {
  if (!block) return '';
  const clone = block.cloneNode(true);
  clone.querySelectorAll('.block-tts-btn,.archetype-badge').forEach(el => el.remove());
  return (clone.innerText || clone.textContent || '').trim();
}
