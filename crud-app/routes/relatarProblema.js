require('dotenv').config(); 

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/dbConnection');
const authenticateToken = require('../middleware/authMiddleware');


// Criar novo problema relatado
router.post('/',authenticateToken , (req, res) => {
    const { titulo_do_chamado, local, tipo_manutencao, urgencia, mensagem_problema } = req.body;

    // Verifica se todos os campos obrigatórios estão presentes
    if (!titulo_do_chamado || !local || !tipo_manutencao || !urgencia || !mensagem_problema) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Query para inserir um novo registro
    const query = `
        INSERT INTO relatarProblema (titulo_do_chamado, local, tipo_manutencao, urgencia, mensagem_problema)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(query, [titulo_do_chamado, local, tipo_manutencao, urgencia, mensagem_problema], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') { // Tratamento do erro de entrada duplicada
                return res.status(400).json({ error: 'O título do chamado já existe. Escolha um título diferente.' });
            }
            console.error('Erro ao salvar no banco de dados:', err); // Log do erro para debug
            return res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
        }
        res.status(201).json({ message: 'Problema relatado com sucesso', id: result.insertId });
    });
});

module.exports = router;
