import { escapeHtml } from './utils.js';

export function buildTabelistaHtml(rawBlock) {
  const lines = String(rawBlock).trim().split('\n').filter(l => l.trim().startsWith('|'));
  if (lines.length < 3) {
    return '<pre>' + escapeHtml(rawBlock).replace(/\n/g, '<br/>') + '</pre>';
  }

  function cells(line) {
    return line.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
  }

  const headerCells = cells(lines[0]);
  const headerText = headerCells.join(' | ');
  const secondCells = cells(lines[1]);
  const isSeparator = secondCells.every(c => /^:?-+:?$/.test(c));
  const subText = isSeparator ? '' : secondCells.join(' | ');
  const dataLines = lines.slice(isSeparator ? 2 : 1);

  let html = '<div class="md-tabelista">';
  html += '<div class="tbl-head">' + escapeHtml(headerText) + '</div>';
  if (subText) html += '<div class="tbl-sub">' + escapeHtml(subText) + '</div>';
  html += '<ul>';

  dataLines.forEach(line => {
    const cols = cells(line);
    if (!cols.length) return;
    const col1 = escapeHtml(cols[0]);
    const rest = cols.slice(1).map((c, idx) => {
      const cls = 'tbl-col' + (idx + 2);
      return '<span class="' + cls + '">' + escapeHtml(c) + '</span>';
    }).join(' | ');
    html += '<li><span class="tbl-col1">' + col1 + '</span>';
    if (rest) html += ' | ' + rest;
    html += '</li>';
  });

  html += '</ul></div>';
  return html;
}

export function parseMarkdownBasic(rawText) {
  if (!rawText) return '';

  if (typeof window.customMarkdownParser === 'function') {
    try {
      const html = window.customMarkdownParser(rawText);
      if (typeof html === 'string') return html;
    } catch (e) {
      console.warn('customMarkdownParser falhou, usando parser interno.', e);
    }
  }

  let text = String(rawText);
  const tableMap = {};
  let tableIndex = 0;

  text = text.replace(/((?:^\|.*\n?){3,})/gm, match => {
    const id = '@@TABLE_' + (tableIndex++) + '@@';
    tableMap[id] = buildTabelistaHtml(match);
    return id;
  });

  text = escapeHtml(text).replace(/\r\n/g, '\n');

  text = text.replace(/\[\[btn:([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, action, label) => {
    const act = escapeHtml(action.trim());
    const lab = escapeHtml((label && label.trim()) || action.trim());
    return '<button class="lv-btn" data-action="' + act + '">' + lab + '</button>';
  });

  text = text.replace(/^::(info|warn|success|question|aside)\s+(.*)$/gm,
    '<div class="lv-callout lv-$1">$2</div>');

  text = text.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

  text = text.replace(/```([\s\S]*?)```/g, (_m, code) => {
    return '<pre><code>' + code.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</code></pre>';
  });

  text = text.replace(/^### (.*)$/gim, '<h3>$1</h3>');
  text = text.replace(/^## (.*)$/gim, '<h2>$1</h2>');
  text = text.replace(/^# (.*)$/gim, '<h1>$1</h1>');
  text = text.replace(/^> (.*)$/gim, '<blockquote>$1</blockquote>');
  text = text.replace(/^\s*[-*+] (.*)$/gim, '<li>$1</li>');
  text = text.replace(/(?:<li>.*?<\/li>)+/gims, match => '<ul>' + match + '</ul>');

  Object.keys(tableMap).forEach(id => {
    text = text.replace(id, tableMap[id]);
  });

  return text;
}

export function splitResponseCinematic(text) {
  const parts = String(text || '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
  if (!parts.length) {
    return [{ kind: 'middle', html: '<p>' + parseMarkdownBasic(text).replace(/\n/g, '<br/>') + '</p>' }];
  }
  return parts.map((p, idx) => ({
    kind: idx === 0 ? 'intro' : (idx === parts.length - 1 ? 'ending' : 'middle'),
    html: '<p>' + parseMarkdownBasic(p).replace(/\n/g, '<br/>') + '</p>'
  }));
}
