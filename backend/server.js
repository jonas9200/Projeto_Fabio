import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { lerDados, adicionarRegistro } from './services/githubStore.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const tipos = ['clientes', 'obras', 'quantitativos', 'orcamentos'];

app.get('/', (req, res) => {
  res.json({
    status: 'online',
    nome: 'API QuantiObra',
    versao: '0.1.0'
  });
});

for (const tipo of tipos) {
  app.get(`/api/${tipo}`, async (req, res) => {
    try {
      const { dados } = await lerDados(tipo);
      res.json(dados);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: `Erro ao carregar ${tipo}`, detalhe: error.message });
    }
  });

  app.post(`/api/${tipo}`, async (req, res) => {
    try {
      const registro = req.body || {};
      const novo = await adicionarRegistro(tipo, registro);
      res.status(201).json(novo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: `Erro ao salvar ${tipo}`, detalhe: error.message });
    }
  });
}

app.listen(PORT, () => {
  console.log(`API QuantiObra rodando na porta ${PORT}`);
});
