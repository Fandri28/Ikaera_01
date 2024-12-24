
const pool = require('../config/db');
// Controller to handle adding a star (rating)
const addStar = (req, res) => {
    const { idformation, iduser, rate } = req.body;

    // Check if all required fields are provided and valid
    if (!idformation || !iduser || rate == null || isNaN(rate)) {
        return res.status(400).json({ error: 'Please provide valid values for all fields' });
    }

    const query = `
        INSERT INTO etoile (idformation, iduser, rate)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [idformation, iduser, rate];

    pool.query(query, values)
        .then(result => {
            res.status(201).json({
                message: 'Star (rating) added successfully',
                rating: result.rows[0]
            });
        })
        .catch(error => {
            console.error('Error adding rating:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

// Controller to handle fetching all stars (ratings)
const getAllStars = (req, res) => {
    const query = 'SELECT * FROM etoile;';
    pool.query(query)
        .then(result => {
            res.status(200).json(result.rows);
        })
        .catch(error => {
            console.error('Error fetching ratings:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

// Controller to handle fetching rating (star) by formation and user
const getStarByuser = (req, res) => {
    const { iduser } = req.params;

    const query = 'SELECT * FROM etoile WHERE iduser= $1;';
    pool.query(query, [iduser])
        .then(result => {
            if (result.rows.length > 0) {
                res.status(200).json(result.rows[0]);
            } else {
                res.status(404).json({ error: 'Rating not found' });
            }
        })
        .catch(error => {
            console.error('Error fetching rating:', error);
            res.status(500).json({ error: 'Internal server error' }); // Corrected the second response error
        });
};

// Controller to handle updating a rating (star)
const updateStar = (req, res) => {
    const { idformation, iduser } = req.params;
    const { rate } = req.body;

    // Check if the rate value is provided and valid
    if (rate == null || isNaN(rate)) {
        return res.status(400).json({ error: 'A valid rate is required' });
    }

    const updateQuery = `
        UPDATE etoile
        SET rate = $1, dateRate = CURRENT_TIMESTAMP
        WHERE idformation = $2 AND iduser = $3
        RETURNING *;
    `;

    pool.query(updateQuery, [rate, idformation, iduser])
        .then(result => {
            if (result.rows.length > 0) {
                res.status(200).json({
                    message: 'Rating updated successfully',
                    rating: result.rows[0]
                });
            } else {
                res.status(404).json({ error: 'Rating not found' });
            }
        })
        .catch(error => {
            console.error('Error updating rating:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

// Controller to handle deleting a rating (star)
const deleteStar = (req, res) => {
    const { idformation, iduser } = req.params;

    const deleteQuery = 'DELETE FROM etoile WHERE idformation = $1 AND iduser = $2 RETURNING *;';
    pool.query(deleteQuery, [idformation, iduser])
        .then(result => {
            if (result.rows.length > 0) {
                res.status(200).json({ message: 'Rating deleted successfully' });
            } else {
                res.status(404).json({ error: 'Rating not found' });
            }
        })
        .catch(error => {
            console.error('Error deleting rating:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};
const patchEtoile = (req, res) => {
    const { idu, idf } = req.params;
    const { rate } = req.body;



    const updateQuery = `
        UPDATE etoile
        SET rate = $1
        WHERE Iduser = $2 and idformation = $3
        RETURNING *;
    `;

    pool.query(updateQuery, [rate, idu, idf])
        .then(result => {
            if (result.rows.length > 0) {
                res.status(200).json({
                    message: 'Action status updated successfully',
                    comment: result.rows[0]
                });
            } else {
                res.status(404).json({ error: 'Comment not found' });
            }
        })
        .catch(error => {
            console.error('Error updating action status:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};


// Export the controllers
module.exports = {
    addStar,
    getAllStars,
    getStarByuser,
    updateStar,
    deleteStar,
    patchEtoile

};
