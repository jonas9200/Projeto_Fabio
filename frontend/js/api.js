const API_BASE_URL = localStorage.getItem('quantiobra_api_url') || '';

function getApiUrl(path) {
  if (!API_BASE_URL) {
    throw new Error('API não configurada. Informe a URL do backend em Configurações.');
  }
  return API_BASE_URL.replace(/\/$/, '') + path;
}

async function apiListar(tipo) {
  const resp = await fetch(getApiUrl('/api/' + tipo));
  if (!resp.ok) throw new Error('Erro ao carregar ' + tipo);
  return resp.json();
}

async function apiSalvar(tipo, dados) {
  const resp = await fetch(getApiUrl('/api/' + tipo), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados)
  });
  if (!resp.ok) {
    const erro = await resp.json().catch(() => ({}));
    throw new Error(erro.detalhe || erro.erro || 'Erro ao salvar');
  }
  return resp.json();
}

function configurarApi() {
  const atual = localStorage.getItem('quantiobra_api_url') || '';
  const nova = prompt('Informe a URL do backend/API:', atual);
  if (nova) {
    localStorage.setItem('quantiobra_api_url', nova.trim());
    alert('API configurada com sucesso.');
    location.reload();
  }
}
