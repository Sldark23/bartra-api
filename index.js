const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Configurações Fixas do Usuário
const GITHUB_USER = 'Sldark23';
const GITHUB_REPO = 'bartra-cmds';
const GITHUB_BRANCH = 'main';
const BOT_PREFIX = 'ba!';

app.use(express.json());

// Função para buscar o arquivo config.json do repositório
async function buscarConfig() {
    const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/config.json`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar config.json:', error.message);
        return null;
    }
}

// Função para buscar o conteúdo de um comando (.txt)
async function buscarConteudoComando(arquivo) {
    const url = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${GITHUB_BRANCH}/comandos/${arquivo}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        return null;
    }
}

// Endpoint dinâmico: /executar?input=ba!ping
app.get('/executar', async (req, res) => {
    const input = req.query.input;

    if (!input) {
        return res.status(400).send('Nenhum input fornecido.');
    }

    // Verifica se começa com o prefixo ba!
    if (!input.startsWith(BOT_PREFIX)) {
        return res.status(200).send(''); 
    }

    // Extrai o nome do comando
    const comandoDigitado = input.slice(BOT_PREFIX.length).trim().split(' ')[0].toLowerCase();

    // Busca o mapeamento no config.json
    const config = await buscarConfig();
    if (!config || !config.comandos) {
        return res.status(500).send('Erro ao carregar configurações do bot ou config.json não encontrado no GitHub.');
    }

    let arquivoParaPuxar = null;

    // Procura o comando pelo nome ou pelas aliases
    for (const cmd of config.comandos) {
        if (cmd.nome === comandoDigitado || (cmd.aliases && cmd.aliases.includes(comandoDigitado))) {
            arquivoParaPuxar = cmd.arquivo;
            break;
        }
    }

    if (arquivoParaPuxar) {
        const conteudo = await buscarConteudoComando(arquivoParaPuxar);
        if (conteudo) {
            res.setHeader('Content-Type', 'text/plain; charset=utf-8');
            return res.send(conteudo);
        }
    }

    res.status(404).send('Comando não encontrado no repositório.');
});

// Endpoint de saúde e informações
app.get('/', (req, res) => {
    res.json({
        status: "Online",
        bot: "Bartra",
        prefix: BOT_PREFIX,
        repo: `${GITHUB_USER}/${GITHUB_REPO}`
    });
});

app.listen(port, () => {
    console.log(`Servidor Bartra API rodando na porta ${port}`);
});
