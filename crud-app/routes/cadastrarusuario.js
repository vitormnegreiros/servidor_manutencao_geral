const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const db = require('../db/dbConnection');

db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados!');
});

// Endpoint para cadastro de usuário
router.post('/', async (req, res) => {
    const { nome, email, senha } = req.body;

    // Validações de formato usando regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const senhaRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/; // mínimo 8 caracteres, letras, números e especiais

    if (!emailRegex.test(email)) {
        return res.status(400).send({ error: 'Formato de e-mail inválido.' });
    }

    if (!senhaRegex.test(senha)) {
        return res.status(400).send({ error: 'A senha deve ter pelo menos 8 caracteres, incluindo letras, números e caracteres especiais.' });
    }

    try {
        // Verifica se o e-mail já existe
        const queryEmailExists = 'SELECT * FROM usuario WHERE email = ?';
        db.query(queryEmailExists, [email], async (err, results) => {
            if (err) {
                return res.status(500).send({ error: 'Erro ao verificar e-mail.' });
            }

            if (results.length > 0) {
                return res.status(400).send({ error: 'E-mail já cadastrado.' });
            }

            // Criptografa a senha antes de inserir no banco de dados
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(senha, saltRounds);

            // Insere os dados do novo usuário no banco de dados com a senha criptografada
            const queryInsertUser = 'INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?)';
            db.query(queryInsertUser, [nome, email, hashedPassword], (err, result) => {
                if (err) {
                    return res.status(500).send({ error: 'Erro ao registrar usuário.' });
                }
                return res.status(201).send({ message: 'Usuário cadastrado com sucesso!' });
            });
        });
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        return res.status(500).send({ error: 'Erro no servidor ao tentar cadastrar.' });
    }
});

module.exports = router;

