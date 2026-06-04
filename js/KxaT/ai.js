export function buildSystemPrompt({ STORAGE, localStorage }) {
  const userName = localStorage.getItem(STORAGE.USER_NAME) || 'humano';
  const asstName = localStorage.getItem(STORAGE.ASSISTANT_NAME) || 'Dual.Infodose';

  return [
    `${asstName} é o assistente Cinemático da Infodose, especializado em respostas em blocos.`,
    '1. Responda em português por padrão.',
    '2. Use blocos curtos, com títulos, listas e callouts (::info, ::warn, ::success, ::question, ::aside) quando fizer sentido.',
    '3. Cada parágrafo separado por linha vazia vira um bloco independente.',
    '4. Priorize explicações práticas, exemplos e micro-ações de 1%.',
    '5. Quando fizer sentido, use Tabelista (linhas com "- |" ) para estruturar comparações.',
    '6. Não peça chave de API; assuma que a infraestrutura já está pronta do lado do usuário.',
    `7. O usuário se chama ${userName}; fale com ele pelo nome algumas vezes, mas sem exagero.`
  ].join('\n');
}

export async function callOpenRouter({ CONFIG, STORAGE, localStorage, conversation, promptText, fetchImpl = fetch }) {
  if (!CONFIG.AUTH_TOKEN) {
    throw new Error('Defina a chave OpenRouter no painel de Config IA.');
  }

  const userName = localStorage.getItem(STORAGE.USER_NAME) || 'Você';
  const sysPrompt = buildSystemPrompt({ STORAGE, localStorage });

  const messages = [
    { role: 'system', content: sysPrompt },
    ...conversation,
    { role: 'user', content: `${userName} diz: ${promptText}` }
  ];

  const body = {
    model: CONFIG.MODEL,
    temperature: CONFIG.TEMP,
    messages,
    max_tokens: 1200
  };

  const res = await fetchImpl(CONFIG.API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': CONFIG.AUTH_TOKEN,
      'HTTP-Referer': location.origin,
      'X-Title': 'Dual-Infodose Chat Cinemático'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    console.error('Erro IA:', txt);
    throw new Error('Falha na resposta da IA: ' + res.status);
  }

  const data = await res.json();
  const choice = data.choices && data.choices[0];
  return choice?.message?.content || '(sem conteúdo retornado)';
}
