require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db/dbConnection');
const authenticateToken = require('../middleware/authMiddleware');


// Criar novo técnico
// Adicionando o middleware de autenticação para proteger a rota
router.post('/', authenticateToken, (req, res) => {
    const { nome, cpf, telefone } = req.body;
    const query = 'INSERT INTO cadastroTecnico (nome, cpf, telefone) VALUES (?, ?, ?)';
    
    db.query(query, [nome, cpf, telefone], (err, result) => {
        if (err) {
            console.error('Erro ao inserir no banco de dados:', err); // Log do erro
            return res.status(500).send('Erro ao cadastrar técnico');
        }
        res.status(201).send('Técnico cadastrado com sucesso');
    });
});

module.exports = router;
