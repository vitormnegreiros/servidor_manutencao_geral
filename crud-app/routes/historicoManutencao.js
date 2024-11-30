require('dotenv').config(); 

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db/dbConnection');
const authenticateToken = require('../middleware/authMiddleware');



// Rota para buscar todas as manutenções
router.get('/', authenticateToken , (req, res) => {
    db.query(`
     SELECT 
        rp.id AS chamado_id,
        rp.data_abertura AS data,
        rp.local,
        rp.tipo_manutencao,
        rp.titulo_do_chamado,
        rp.mensagem_solucao,
        ct.nome AS tecnico_responsavel
    FROM 
        relatarProblema rp
    LEFT JOIN 
        cadastroTecnico ct ON rp.cpf_tecnico = ct.cpf  
    WHERE 
        rp.status = 'Resolvido';
    `, (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao buscar o histórico de manutenção.');
        }
        res.status(200).json(results);
    });
});

// Rota para filtrar manutenções por intervalo de datas
router.get('/data', authenticateToken , (req, res) => {
    const { dataInicio, dataFim } = req.query;

    const query = `
    SELECT 
    rp.local, rp.tipo_manutencao, rp.urgencia, rp.mensagem_problema, 
    cm.cpf_tecnico, cm.mensagem_solucao AS mensagem_solucao, cm.data_resolucao
    FROM 
    relatarProblema rp
    JOIN 
    cadastroManutencao cm ON rp.id = cm.problema_id
    WHERE 
    cm.data_resolucao BETWEEN ? AND ?
    `;

    db.query(query, [dataInicio, dataFim], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao buscar o histórico de manutenção.');
        }
        res.status(200).json(results);
    });
});

// Rota para filtrar manutenções por local
router.get('/local',authenticateToken, (req, res) => {
    const { local } = req.query;

    const query = `
    SELECT 
    rp.local, rp.tipo_manutencao, rp.urgencia, rp.mensagem_problema, 
    cm.cpf_tecnico, cm.mensagem_solucao AS mensagem_solucao, cm.data_resolucao
    FROM 
    relatarProblema rp
    JOIN 
    cadastroManutencao cm ON rp.id = cm.problema_id
    WHERE 
    rp.local LIKE ?

    `;

    db.query(query, [`%${local}%`], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao buscar o histórico de manutenção.');
        }
        res.status(200).json(results);
    });
});

// Rota para filtrar manutenções por tipo
router.get('/tipo',authenticateToken, (req, res) => {
    const { tipoManutencao } = req.query;

    const query = `
    SELECT 
    rp.local, rp.tipo_manutencao, rp.urgencia, rp.mensagem_problema, 
    cm.cpf_tecnico, cm.mensagem_solucao AS mensagem_solucao, cm.data_resolucao
    FROM 
    relatarProblema rp
    JOIN 
    cadastroManutencao cm ON rp.id = cm.problema_id
    WHERE 
    rp.tipo_manutencao LIKE ?

    `;

    db.query(query, [`%${tipoManutencao}%`], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao buscar o histórico de manutenção.');
        }
        res.status(200).json(results);
    });
});

// Rota para filtrar manutenções por técnico responsável
router.get('/tecnico',authenticateToken, (req, res) => {
    const { cpfTecnico } = req.query;

    const query = `
    SELECT 
    rp.local, rp.tipo_manutencao, rp.urgencia, rp.mensagem_problema, 
    cm.cpf_tecnico, cm.mensagem_solucao AS mensagem_solucao, cm.data_resolucao
    FROM 
    relatarProblema rp
    JOIN 
    cadastroManutencao cm ON rp.id = cm.problema_id
    WHERE 
    cm.cpf_tecnico = ?

    `;

    db.query(query, [cpfTecnico], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao buscar o histórico de manutenção.');
        }
        res.status(200).json(results);
    });
});

// Rota para buscar manutenção por ID
router.get('/id',authenticateToken, (req, res) => {
    const { id } = req.query;

    db.query('SELECT * FROM cadastroManutencao WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result[0]);
    });
});

// Rota para buscar problemas relatados por ID
router.get('/problema-id',authenticateToken, (req, res) => {
    const { id } = req.query;

    db.query('SELECT * FROM relatarProblema WHERE id = ?', [id], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).json(result[0]);
    });
});

// Rota combinada para múltiplos filtros
router.get('/filtrado',authenticateToken, (req, res) => {
    const { dataInicio, dataFim } = req.query;

    const query = `
    SELECT 
    rp.local, rp.tipo_manutencao, rp.urgencia, rp.mensagem_problema, 
    cm.cpf_tecnico, cm.mensagem_solucao AS mensagem_solucao, cm.data_resolucao
    FROM 
    relatarProblema rp
    JOIN 
    cadastroManutencao cm ON rp.id = cm.problema_id
    WHERE 
    DATE(cm.data_resolucao) BETWEEN ? AND ?

    `;

    db.query(query, [dataInicio, dataFim], (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao buscar o histórico de manutenção.');
        }
        res.status(200).json(results);
    });
});

// Rota para pegar todos os locais disponíveis
router.get('/locais',authenticateToken, (req, res) => {
    const query = `
        SELECT DISTINCT local 
        FROM relatarProblema
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao buscar locais.');
        }
        res.status(200).json(results);
    });
});


// Rota para pegar todos os tipos de manutenção disponíveis
router.get('/tipos-manutencao',authenticateToken , (req, res) => {
    const query = `
        SELECT DISTINCT tipo_manutencao 
        FROM relatarProblema
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao buscar tipos de manutenção.');
        }
        res.status(200).json(results);
    });
});


// Rota para pegar todos os técnicos disponíveis
router.get('/tecnicos',authenticateToken , (req, res) => {
    const query = `
        SELECT DISTINCT cpf, nome
        FROM cadastroTecnico;
    `;

    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).send('Erro ao buscar técnicos.');
        }
        res.status(200).json(results);
    });
});




module.exports = router;
