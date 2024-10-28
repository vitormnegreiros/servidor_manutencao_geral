const express = require('express');
const router = express.Router();
const db = require('../db/dbConnection');

// Criar novo técnico
router.post('/', (req, res) => {
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


// Ler todos os técnicos cadastrados
/*router.get('/', (req, res) => {
    db.query('SELECT * FROM cadastroTecnico', (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(results);
    });
});*/

// Ler um técnico pelo CPF (usando req.body)
/*router.get('/cpf', (req, res) => {
    const { cpf } = req.body;
    db.query('SELECT * FROM cadastroTecnico WHERE cpf = ?', [cpf], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result[0]);
    });
});*/

// Atualizar um técnico (usando req.body)
/*router.put('/cpf', (req, res) => {
    const { cpf, nome, telefone } = req.body;
    const query = `UPDATE cadastroTecnico SET nome = ?, telefone = ? WHERE cpf = ?`;
    db.query(query, [nome, telefone, cpf], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send('Dados do técnico atualizados com sucesso');
    });
});*/

// Deletar um técnico (usando req.body)
/*router.delete('/cpf', (req, res) => {
    const { cpf } = req.body;
    db.query('DELETE FROM cadastroTecnico WHERE cpf = ?', [cpf], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send('Técnico deletado com sucesso');
    });
});*/

module.exports = router;
