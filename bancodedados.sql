-- Criação do banco de dados com utf8
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';

-- Seleciona todos os usuários do banco de dados MySQL
SELECT User FROM mysql.user;

-- Criação do banco de dados com utf8
CREATE DATABASE manutencaoGeral
DEFAULT CHARACTER SET utf8
DEFAULT COLLATE utf8_general_ci;

-- Utilizar o banco de dados criado
USE manutencaoGeral;

-- Criação da Tabela de Relatar Problema
CREATE TABLE relatarProblema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo_do_chamado VARCHAR(255) NOT NULL,
    local ENUM('Sala 1', 'Sala 2', 'Sala 3', 'Banheiros Masculinos', 'Banheiros Femininos') NOT NULL,
    tipo_manutencao ENUM('Elétrica', 'Hidráulica', 'Estrutural') NOT NULL,
    urgencia ENUM('Baixa', 'Média', 'Alta') NOT NULL,
    data_abertura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_resolucao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('Pendente', 'Resolvido') DEFAULT 'Pendente',
    mensagem_problema TEXT NOT NULL,
    mensagem_solucao TEXT,
    cpf_tecnico VARCHAR(14),  -- Chave estrangeira para referenciar o técnico pelo CPF
    FOREIGN KEY (cpf_tecnico) REFERENCES cadastroTecnico(cpf)  -- Ligação com cadastroTecnico
) DEFAULT CHARSET=utf8;


-- Tabela cadastroTecnico
CREATE TABLE cadastroTecnico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(50) NOT NULL
) DEFAULT CHARSET=utf8;

-- Inserindo dados na tabela cadastroTecnico
INSERT INTO cadastroTecnico (nome, cpf, telefone) VALUES
('João Silva', '12345678901', '11987654321'),
('Maria Santos', '23456789012', '11876543210'),
('Pedro Oliveira', '34567890123', '11765432109'),
('Ana Souza', '45678901234', '11654321098'),
('Marcos Pereira', '56789012345', '11543210987');

-- Inserindo dados na tabela relatarProblema
INSERT INTO relatarProblema (titulo_do_chamado, local, tipo_manutencao, urgencia, status, mensagem_problema, mensagem_solucao, cpf_tecnico) VALUES
('Lâmpada queimada', 'Sala 2', 'Elétrica', 'Alta', 'Resolvido', 'Lâmpada queimada no teto', 'lampada trocada', '12345678901'),
('Vazamento na pia', 'Banheiros Masculinos', 'Hidráulica', 'Média', 'Pendente', 'Vazamento detectado na pia', 'vazamento resolvido', '23456789012'),
('Tomada sem energia', 'Sala 1', 'Elétrica', 'Baixa', 'Pendente', 'Tomada sem energia perto da porta', 'problema solucionado', '34567890123'),
('Ar condicionado sem funcionar', 'Sala 3', 'Elétrica', 'Alta', 'Pendente', 'Ar condicionado sem funcionamento', 'ar consertado', '45678901234'),
('Rachaduras na parede', 'Sala 3', 'Estrutural', 'Baixa', 'Pendente', 'Rachaduras visíveis na parede do fundo', 'problema estrutural resolvido', '56789012345');


-- Consultas de exemplo

-- Seleciona todos os problemas relatados
SELECT * FROM relatarProblema WHERE status = 'Pendente';

SELECT titulo_do_chamado FROM relatarProblema WHERE status = 'Pendente';

SELECT nome FROM cadastroTecnico;

-- Seleciona problemas por local
SELECT * FROM relatarProblema WHERE local = 'Sala 1';
SELECT * FROM relatarProblema WHERE local = 'Sala 2';
SELECT * FROM relatarProblema WHERE local = 'Sala 3';
SELECT * FROM relatarProblema WHERE local = 'Banheiros Masculinos';
SELECT * FROM relatarProblema WHERE local = 'Banheiros Femininos';

-- Contar o número de problemas relatados em cada local
SELECT local, COUNT(*) as total_problemas FROM relatarProblema GROUP BY local;

-- Selecionar problemas por tipo de manutenção
SELECT * FROM relatarProblema WHERE tipo_manutencao = 'Elétrica';
SELECT * FROM relatarProblema WHERE tipo_manutencao = 'Hidráulica';
SELECT * FROM relatarProblema WHERE tipo_manutencao = 'Estrutural';

-- Selecionar problemas por urgência
SELECT * FROM relatarProblema WHERE urgencia = 'Alta';
SELECT * FROM relatarProblema WHERE urgencia = 'Média';
SELECT * FROM relatarProblema WHERE urgencia = 'Baixa';

-- Ordenar problemas por urgência
SELECT * FROM relatarProblema ORDER BY FIELD(urgencia, 'Baixa', 'Média', 'Alta');

-- Contar os problemas pelo nível de urgência
SELECT urgencia, COUNT(*) as total_problemas FROM relatarProblema GROUP BY urgencia;

-- Seleciona todos os técnicos cadastrados
SELECT * FROM cadastroTecnico;

-- Seleciona técnico pelo CPF
SELECT nome, cpf FROM cadastroTecnico WHERE cpf = '12345678901';

-- Seleciona cadastro de manutenção pelo ID do problema
SELECT * FROM cadastroManutencao WHERE problema_id = 1;

-- Seleciona cadastro de manutenção pelo CPF do técnico
SELECT * FROM cadastroManutencao WHERE cpf_tecnico = '12345678901';

-- Quantidade de registros resolvidos por cada técnico
SELECT cm.cpf_tecnico, COUNT(*) AS total_problemas_resolvidos 
FROM cadastroManutencao cm 
GROUP BY cm.cpf_tecnico;

-- Consulta de histórico geral de manutenção
SELECT rp.local, rp.tipo_manutencao, rp.urgencia, rp.mensagem,
       cm.cpf_tecnico, cm.mensagem
FROM relatarProblema rp
JOIN cadastroManutencao cm ON rp.id = cm.problema_id;

-- Filtragem do histórico por urgência
SELECT rp.local, rp.tipo_manutencao, rp.urgencia, rp.mensagem,
       cm.cpf_tecnico, cm.mensagem
FROM relatarProblema rp
JOIN cadastroManutencao cm ON rp.id = cm.problema_id
WHERE rp.urgencia = 'Alta';

-- Filtragem do histórico por manutenção elétrica
SELECT rp.local, rp.tipo_manutencao, rp.urgencia, rp.mensagem,
       cm.cpf_tecnico, cm.mensagem
FROM relatarProblema rp
JOIN cadastroManutencao cm ON rp.id = cm.problema_id
WHERE rp.tipo_manutencao = 'Elétrica';

-- Filtragem de histórico por técnico específico
SELECT rp.local, rp.tipo_manutencao, rp.urgencia, rp.mensagem,
       cm.cpf_tecnico, cm.mensagem
FROM relatarProblema rp
JOIN cadastroManutencao cm ON rp.id = cm.problema_id
WHERE cm.cpf_tecnico = '12345678901';

-- Filtragem por data de resolução
SELECT rp.local, rp.tipo_manutencao, rp.urgencia, rp.mensagem,
       cm.cpf_tecnico, cm.mensagem
FROM relatarProblema rp
JOIN cadastroManutencao cm ON rp.id = cm.problema_id
WHERE cm.data_resolucao = '2024-01-15';
