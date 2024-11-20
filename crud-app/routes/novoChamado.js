require('dotenv').config(); 

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/dbConnection');
const authenticateToken = require('../middleware/authMiddleware');


// Rota para obter chamados pendentes ordenados pela data de abertura mais recente
router.get('/',authenticateToken, (req, res) => {
    const query = `
    SELECT 
    rp.id AS chamado_id,
    rp.titulo_do_chamado,
    rp.data_abertura AS data,
    rp.local,
    rp.tipo_manutencao,
    rp.mensagem_problema,
    rp.mensagem_solucao,
    ct.nome AS tecnico_responsavel
    FROM 
    relatarProblema rp
    LEFT JOIN 
    cadastroTecnico ct ON rp.cpf_tecnico = ct.cpf  
    WHERE 
    rp.status = 'Pendente'
    ORDER BY
    rp.data_abertura DESC;
    `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Erro ao buscar chamados pendentes:', err); // Log do erro
        return res.status(500).send('Erro ao buscar chamados pendentes.');
      }
      res.json(results);
    });
});

module.exports = router;

