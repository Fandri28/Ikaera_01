--psql -U postgres -d ikaera_db
--CREATE DATABASE ikaera_db;
--psql -U postgres -d ikaera_db
--pierre.lemoine@example.com
--password789
\c ikaera_db
CREATE TABLE IF NOT EXISTS utilisateur (id SERIAL PRIMARY KEY, non VARCHAR(100) NOT NULL, prenom VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, role VARCHAR(100) NOT NULL, password VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE commentaires (Idcomment SERIAL PRIMARY KEY, Idproduit INTEGER NOT NULL, Iduser INTEGER NOT NULL, Commentaire TEXT NOT NULL, date Date NOT NULL, Action VARCHAR(255) NOT NULL);
CREATE TABLE formations (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    frais NUMERIC(10, 2) NOT NULL,
    lieu VARCHAR(255) NOT NULL,
    date_ajout TIMESTAMP NOT NULL,
    image VARCHAR(255)
);
CREATE TABLE etoile (id SERIAL PRIMARY KEY, idformation INTEGER NOT NULL, iduser INTEGER NOT NULL, rate INTEGER NOT NULL, dateRate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (idformation) REFERENCES formations(id));

CREATE TABLE inscription (   nom_complet VARCHAR(255),   idinscription SERIAL PRIMARY KEY,   idformation INT,   iduser INT,   email VARCHAR(255),   total DECIMAL(10, 2),   date_inscription DATE,   montantpayer DECIMAL(10, 2),   status VARCHAR(50));