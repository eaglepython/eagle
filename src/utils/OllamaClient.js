const DEFAULT_OLLAMA_URL = 'http://localhost:11434';

export function loadOllamaSettings() {
  try {
    return { enabled: false, baseUrl: DEFAULT_OLLAMA_URL, model: '', ...JSON.parse(localStorage.getItem('lifeTrackerOllamaSettings') || '{}') };
  } catch {
    return { enabled: false, baseUrl: DEFAULT_OLLAMA_URL, model: '' };
  }
}

function normalizeBaseUrl(value) {
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error('Enter a valid local Ollama URL, such as http://localhost:11434.');
  }
  const isLoopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname.toLowerCase());
  if (!isLoopback || !['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
    throw new Error('For privacy, the Ollama address must point to this computer (localhost or loopback).');
  }
  return url.origin;
}

async function readJson(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.error || `Ollama returned HTTP ${response.status}`);
  }
  return body;
}

export async function getOllamaModels(baseUrl = DEFAULT_OLLAMA_URL) {
  const url = `${normalizeBaseUrl(baseUrl)}/api/tags`;
  let response;
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' }
    });
  } catch {
    throw new Error('Could not reach Ollama. Make sure Ollama is running and allows this site in OLLAMA_ORIGINS.');
  }

  const data = await readJson(response);
  return (data.models || []).map((model) => model.name).filter(Boolean);
}

export async function chatWithOllama({ baseUrl = DEFAULT_OLLAMA_URL, model, messages }) {
  const url = `${normalizeBaseUrl(baseUrl)}/api/chat`;
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ model, messages, stream: false, options: { temperature: 0.3 } })
    });
  } catch {
    throw new Error('Could not reach Ollama. Check that it is running and that OLLAMA_ORIGINS includes this site.');
  }

  const data = await readJson(response);
  const content = data.message?.content?.trim();
  if (!content) throw new Error('Ollama returned an empty response.');
  return content;
}

export { DEFAULT_OLLAMA_URL };
