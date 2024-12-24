const pool = require('../config/db');
// Controller to handle adding a star (rating)
const addInscription = (req, res) => {
    const { nom_complet, idformation, iduser, email, total, date_inscription, montantpayer, status } = req.body;

    const query = `
        INSERT INTO inscription (nom_complet, idformation, iduser, email, total, date_inscription, montantpayer, status)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;
    const values = [nom_complet, idformation, iduser, email, total, date_inscription, montantpayer, status];

    pool.query(query, values)
        .then(result => {
            res.status(201).json({
                message: 'Inscription added successfully',
                inscription: result.rows[0]
            });
        })
        .catch(error => {
            console.error('Error adding inscription:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

const getAllInscription = (req, res) => {
    const query = 'SELECT * FROM inscription;';
    pool.query(query)
        .then(result => {
            res.status(200).json(result.rows);
        })
        .catch(error => {
            console.error('Error fetching ratings:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

module.exports = {
    addInscription,
    getAllInscription,
};