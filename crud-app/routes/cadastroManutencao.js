const express = require('express');
const router = express.Router();
const db = require('../db/dbConnection');

// Atualizar um registro de manutenção (usando req.body)
router.put('/', (req, res) => {
    const { titulo_do_chamado, tecnico_Responsavel , mensagem_solucao, data_resolucao } = req.body;

    const query = `
        UPDATE relatarProblema
        SET tecnico_Responsavel = ?, mensagem_solucao = ?, data_resolucao = ?, status = 'Resolvido'
        WHERE titulo_do_chamado = ?`;

    db.query(query, [tecnico_Responsavel, mensagem_solucao, data_resolucao, titulo_do_chamado], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send('Manutenção atualizada com sucesso');
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
    db.query(`SELECT id, CONCAT(id, ' - ', nome) AS nome 
              FROM cadastroTecnico`, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(results);
    });
});



module.exports = router;
