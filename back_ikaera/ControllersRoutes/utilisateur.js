const pool = require('../config/db'); // Import the pool from db.js

// Controller to handle adding a user
const addUser = (req, res) => {
    const { non, prenom, email, session, password } = req.body;

    if (!non || !prenom || !email || !session || !password) {
        return res.status(400).json({ error: 'Please fill in all fields' });
    }

    const query = `
        INSERT INTO utilisateur (non, prenom, email, session, password)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    const values = [non, prenom, email, session, password];

    pool.query(query, values)
        .then(result => {
            res.status(201).json({
                message: 'User added successfully',
                user: result.rows[0]
            });
        })
        .catch(error => {
            console.error('Error adding user:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

// Controller to handle fetching all users
const getAllUsers = (req, res) => {
    const query = 'SELECT * FROM utilisateur;';
    pool.query(query)
        .then(result => {
            res.status(200).json(result.rows);
        })
        .catch(error => {
            console.error('Error fetching users:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

// Controller to handle fetching a user by ID
const getUserByEmail = (req, res) => {
    const email = req.params.email;  // Expect email instead of id

    const query = 'SELECT * FROM utilisateur WHERE email = $1;';  // Search by email
    pool.query(query, [email])
        .then(result => {
            if (result.rows.length > 0) {
                res.status(200).json(result.rows[0]);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch(error => {
            console.error('Error fetching user:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};


// Controller to handle updating a user by ID
const updateUser = (req, res) => {
    const id = req.params.id;
    const { non, prenom, email, session, password } = req.body;

    const query = `
        UPDATE utilisateur
        SET non = $1, prenom = $2, email = $3, role = $4, password = $5
        WHERE id = $6
        RETURNING *;
    `;

    const values = [non, prenom, email, session, password, id];

    pool.query(query, values)
        .then(result => {
            if (result.rows.length > 0) {
                res.status(200).json({
                    message: 'User updated successfully',
                    user: result.rows[0]
                });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch(error => {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

// Controller to handle deleting a user by ID
const deleteUser = (req, res) => {
    const id = req.params.id;

    const query = 'DELETE FROM utilisateur WHERE id = $1 RETURNING *;';
    pool.query(query, [id])
        .then(result => {
            if (result.rows.length > 0) {
                res.status(200).json({ message: 'User deleted successfully' });
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

// Exporting the functions for use in the main server file
module.exports = {
    addUser,
    getAllUsers,
    getUserByEmail,
    updateUser,
    deleteUser
};
