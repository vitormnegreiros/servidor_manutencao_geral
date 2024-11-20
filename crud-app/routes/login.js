require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../db/dbConnection');

const SECRET_KEY = process.env.SECRET_KEY;

// Conexão com o banco de dados
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados!');
});

// Endpoint de login
router.post('/', async (req, res) => {
    const { email, senha } = req.body;

    const queryGetUser = 'SELECT * FROM usuario WHERE email = ?';
    db.query(queryGetUser, [email], async (err, results) => {
        if (err) return res.status(500).send({ error: 'Erro ao buscar usuário.' });
        if (results.length === 0) return res.status(400).send({ error: 'Usuário não encontrado.' });

        const user = results[0];

        // Verifica a senha usando bcrypt
        const validPassword = await bcrypt.compare(senha, user.senha);
        if (!validPassword) return res.status(400).send({ error: 'Senha incorreta.' });

        // Gera um token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).send({ message: 'Login bem-sucedido!', token });
    });
});

module.exports = router;

