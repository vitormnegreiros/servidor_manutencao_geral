require('dotenv').config();

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db/dbConnection');
const authenticateToken = require('../middleware/authMiddleware');


// Atualizar um registro de manutenção (usando req.body)
// Aplicando o middleware de autenticação
router.put('/', authenticateToken, (req, res) => {
    const { id, cpf_tecnico , mensagem_solucao } = req.body;

    const query = `
        UPDATE relatarProblema
        SET cpf_tecnico = ?, mensagem_solucao = ?, data_resolucao = CURRENT_TIMESTAMP, status = 'Resolvido'
        WHERE id = ?`;

    db.query(query, [cpf_tecnico, mensagem_solucao, id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send('Manutenção atualizada com sucesso');
    });
});

// Ler registros pendentes
// Aplicando o middleware de autenticação
router.get('/pendente', authenticateToken, (req, res) => {
    db.query(`SELECT id, CONCAT(id, ' - ', titulo_do_chamado) AS titulo_do_chamado 
              FROM relatarProblema 
              WHERE status = 'Pendente'`, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(results);
    });
});

// Ler técnicos cadastrados
// Esta rota pode ser protegida se necessário
router.get('/tecnicocadastrado', authenticateToken, (req, res) => {
    db.query(`SELECT id, CONCAT(id, ' - ', nome) AS nome, cpf
                FROM cadastroTecnico;`, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(results);
    });
});

module.exports = router;
