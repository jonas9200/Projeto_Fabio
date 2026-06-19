# QuantiObra

Sistema inicial para quantitativos, obras, clientes e orçamentos.

## Arquitetura v0.1

```text
frontend/  -> telas do sistema
backend/   -> API Node.js
 dados/    -> arquivos JSON usados como armazenamento temporário
```

## Publicação no Render

Crie dois serviços:

### 1. Backend - Web Service

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

Variáveis de ambiente:

```text
GITHUB_TOKEN=seu_token_do_github
GITHUB_OWNER=jonas9200
GITHUB_REPO=Projeto_Fabio
GITHUB_BRANCH=main
```

### 2. Frontend - Static Site

- Root Directory: `frontend`
- Build Command: deixar vazio
- Publish Directory: `.`

Depois edite em `frontend/js/config.js` a URL do backend em produção.

## Observação

Nesta fase os dados ficam em JSON no GitHub. Depois migraremos para PostgreSQL mantendo a mesma lógica de telas.
