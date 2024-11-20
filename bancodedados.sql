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


-- Tabela cadastroTecnico
CREATE TABLE cadastroTecnico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE NOT NULL,
    telefone VARCHAR(50) NOT NULL
) DEFAULT CHARSET=utf8;


-- Criação da Tabela de Relatar Problema
CREATE TABLE relatarProblema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo_do_chamado VARCHAR(255) UNIQUE NOT NULL,
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


CREATE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario TINYINT NOT NULL DEFAULT 0  -- 0 para usuário comum, 1 para técnico
);

