const express = require('express');
const router = express.Router();
const db = require('../db/dbConnection');

// Atualizar um registro de manutenção (usando req.body)
router.put('/', (req, res) => {
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
        console.log(res)
    });
});



// Ler registros pendentes
router.get('/pendente', (req, res) => {
    db.query(`SELECT id, CONCAT(id, ' - ', titulo_do_chamado) AS titulo_do_chamado 
              FROM relatarProblema 
              WHERE status = 'Pendente'`, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(results);
    });
});


// Ler tecnicos cadastrados
router.get('/tecnicocadastrado', (req, res) => {
    db.query(`SELECT id, CONCAT(id, ' - ', nome) AS nome, cpf
                FROM cadastroTecnico;`, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(results);
    });
});



module.exports = router;
