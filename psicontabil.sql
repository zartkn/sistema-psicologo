CREATE DATABASE IF NOT EXISTS psicontabil;

use psicontabil;

CREATE TABLE IF NOT EXISTS Usuarios (
  id int AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS Notas (
	id_Nota INT AUTO_INCREMENT PRIMARY KEY, 
	id_Psicologo INT,
    valor INT NOT NULL,
    nome VARCHAR (200) NOT NULL,
    cpf VARCHAR (11) NOT NULL,
    telefone VARCHAR (11) NOT NULL,
    finalizado BOOLEAN DEFAULT FALSE
);

select * from Notas;
select * from Usuarios;