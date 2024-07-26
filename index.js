const cors = require('cors');
const express = require('express');
const admin = require('firebase-admin');
const serviceAccount = require('./dados.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const app = express();
const hostname = '127.0.0.1';
const port = '3000';

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/pegaCards', async (req, res) => {
    try {
        const resposta = await db.collection('atividade').get();
        const atividade = resposta.docs.map(doc => ({
            id: doc.id, ...doc.data()
        }));
        res.status(200).json({ atividade });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar atividade' });
    }
});

app.post('/addCard', async (req, res) => {
    const { nome, descricao } = req.body;

    if (nome && descricao) {
        try {
            const novaAtividade = { nome, descricao };
            const docRef = await db.collection('atividade').add(novaAtividade);
            res.status(201).json({ message: 'Atividade adicionada com sucesso!' });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao adicionar atividade' });
        }
    } else {
        res.status(400).json({ error: 'Faltando dados obrigatórios' });
    }
});

app.use((req, res) => {
    res.status(404).send('Função não encontrada...');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});