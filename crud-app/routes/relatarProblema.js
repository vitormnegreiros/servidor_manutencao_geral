const express = require('express');
const router = express.Router();
const db = require('../db/dbConnection');

// Criar novo problema relatado
router.post('/', (req, res) => {
    const { titulo_do_Chamado, local, tipo_manutencao, urgencia, mensagem_problema } = req.body;

    // Verifica se todos os campos obrigatórios estão presentes
    if (!titulo_do_Chamado || !local || !tipo_manutencao || !urgencia || !mensagem_problema) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // O campo 'data_abertura' será preenchido automaticamente pelo banco de dados
    const query = `INSERT INTO relatarProblema (titulo_do_chamado, local, tipo_manutencao, urgencia, mensagem_problema) 
                   VALUES (?, ?, ?, ?, ?)`;
    
    db.query(query, [titulo_do_Chamado, local, tipo_manutencao, urgencia, mensagem_problema], (err, result) => {
        if (err) {
            console.error('Erro ao salvar no banco de dados:', err); // Log do erro para debug
            return res.status(500).json({ error: 'Erro ao salvar no banco de dados' });
        }
        res.status(201).json({ message: 'Problema relatado com sucesso', id: result.insertId }); // Retorna o ID do novo registro
    });
});

// Atualizar um problema relatado
/*router.put('/:id', (req, res) => {
    const { id } = req.body;
    const { titulo_do_Chamado, local, tipo_manutencao, urgencia, mensagem_problema } = req.body;

    // Verifica se todos os campos obrigatórios estão presentes
    if (!titulo_do_Chamado || !local || !tipo_manutencao || !urgencia || !mensagem_problema) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const query = `UPDATE relatarProblema 
                   SET titulo_do_chamado = ?, local = ?, tipo_manutencao = ?, urgencia = ?, mensagem_problema = ? 
                   WHERE id = ?`;
    
    db.query(query, [titulo_do_Chamado, local, tipo_manutencao, urgencia, mensagem_problema, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar no banco de dados:', err); // Log do erro para debug
            return res.status(500).json({ error: 'Erro ao atualizar no banco de dados' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Problema não encontrado' });
        }

        res.status(200).json({ message: 'Problema atualizado com sucesso' });
    });
});*/

// Deletar um problema relatado
/*router.delete('/:id', (req, res) => {
    const { id } = req.body;

    const query = 'DELETE FROM relatarProblema WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar no banco de dados:', err); // Log do erro para debug
            return res.status(500).json({ error: 'Erro ao deletar no banco de dados' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Problema não encontrado' });
        }

        res.status(200).json({ message: 'Problema deletado com sucesso' });
    });
});*/

module.exports = router;
