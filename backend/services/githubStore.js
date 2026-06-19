import { Octokit } from '@octokit/rest';

const owner = process.env.GITHUB_OWNER;
const repo = process.env.GITHUB_REPO;
const branch = process.env.GITHUB_BRANCH || 'main';
const token = process.env.GITHUB_TOKEN;

if (!owner || !repo || !token) {
  console.warn('Atenção: configure GITHUB_OWNER, GITHUB_REPO e GITHUB_TOKEN no ambiente.');
}

const octokit = new Octokit({ auth: token });

const arquivosPermitidos = {
  clientes: 'dados/clientes.json',
  obras: 'dados/obras.json',
  quantitativos: 'dados/quantitativos.json',
  orcamentos: 'dados/orcamentos.json'
};

function getPath(tipo) {
  const path = arquivosPermitidos[tipo];
  if (!path) throw new Error('Tipo de dados inválido.');
  return path;
}

export async function lerDados(tipo) {
  const path = getPath(tipo);
  try {
    const response = await octokit.repos.getContent({ owner, repo, path, ref: branch });
    const content = Buffer.from(response.data.content, 'base64').toString('utf-8');
    const dados = JSON.parse(content || '[]');
    return { dados, sha: response.data.sha, path };
  } catch (error) {
    if (error.status === 404) return { dados: [], sha: null, path };
    throw error;
  }
}

export async function salvarDados(tipo, dados, mensagem = 'Atualizar dados do QuantiObra') {
  const { sha, path } = await lerDados(tipo);
  const content = JSON.stringify(dados, null, 2) + '\n';

  const params = {
    owner,
    repo,
    path,
    message: mensagem,
    content: Buffer.from(content, 'utf-8').toString('base64'),
    branch
  };

  if (sha) params.sha = sha;

  const response = await octokit.repos.createOrUpdateFileContents(params);
  return response.data;
}

export async function adicionarRegistro(tipo, registro) {
  const { dados } = await lerDados(tipo);
  const novo = {
    id: Date.now(),
    criado_em: new Date().toISOString(),
    ...registro
  };
  dados.push(novo);
  await salvarDados(tipo, dados, `Adicionar ${tipo} no QuantiObra`);
  return novo;
}
