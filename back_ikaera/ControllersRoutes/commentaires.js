 
const pool = require('../config/db'); // Importer le pool depuis db.js

// Controller to handle adding a comment
const addComment = (req, res) => {
    const { Idproduit, Iduser, Commentaire, date, Action } = req.body;

    if (!Idproduit || !Iduser || !Commentaire || !date) {
        return res.status(400).json({ error: 'Please fill in all fields' });
    }

    const query = `
        INSERT INTO commentaires (Idproduit, Iduser, Commentaire, date, Action)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;

    const values = [Idproduit, Iduser, Commentaire, date, Action];

    pool.query(query, values)
        .then(result => {
            res.status(201).json({
                message: 'Comment added successfully',
                comment: result.rows[0]
            });
        })
        .catch(error => {
            console.error('Error adding comment:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

// Controller to handle fetching all comments
const getAllComments = (req, res) => {
    const query = 'SELECT * FROM commentaires;';
    pool.query(query)
        .then(result => {
            res.status(200).json(result.rows);
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

// Controller to handle fetching a comment by ID

const getCommentByIdf = (req, res) => {
    const id = req.params.idf;

    const query = 'SELECT * FROM commentaires WHERE Idcomment = $1;';
    pool.query(query, [id])
        .then(result => {
            if (result.rows.length > 0) {
                res.status(200).json(result.rows[0]);
            } else {
                res.status(404).json({ error: 'Comment not found' });
            }
        })
        .catch(error => {
            console.error('Error fetching comment:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

// const getCommentByid = (req, res) => {
//     const id = req.params.id;

//     const query = 'SELECT c.Idcomment, c.Idproduit, c.commentaire,c.date c.Action FROM commentaires c JOIN utilisateur u ON c.Iduser = u.id WHERE u.email = $1;';
//     pool.query(query, [id])
//         .then(result => {
//             if (result.rows.length > 0) {
//                 res.status(200).json(result.rows[0]);
//             } else {
//                 res.status(404).json({ error: 'Comment not found' });
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching comment:', error);
//             res.status(500).json({ error: 'Internal server error' });
//         });
// };

const getCommentByUserIdFormationId = (req, res) => {
    const {userid, id} = req.params;

    const query = 'SELECT * FROM commentaires  WHERE iduser = $1 AND idproduit = $2;';
    pool.query(query, [userid, id])
        .then(result => {
            if (result.rows.length > 0) {
                res.status(200).json(result.rows[0]);
            } else {
                res.status(404).json({ error: 'Comment not found' });
            }
        })
        .catch(error => {
            console.error('Error fetching comment:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

// Controller to handle updating a comment by ID
const updateComment = (req, res) => {
    const id = req.params.id;
    const { Idproduit, Iduser, Commentaire, Rate, Action } = req.body;

    const updateQuery = `
        UPDATE commentaires
        SET Idproduit = $1, Iduser = $2, Commentaire = $3, Rate = $4, Action = $5
        WHERE Idcomment = $6
        RETURNING *;
    `;

    const values = [Idproduit, Iduser, Commentaire, Rate, Action, id];

    pool.query(updateQuery, values)
        .then(result => {
            if (result.rows.length > 0) {
                res.status(200).json({
                    message: 'Comment updated successfully',
                    comment: result.rows[0]
                });
            } else {
                res.status(404).json({ error: 'Comment not found' });
            }
        })
        .catch(error => {
            console.error('Error updating comment:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};
const updateCommentByFormUser = (req, res) => {
    const {idf, idu, idc} = req.params; // idf = id produit, idu = id utilisateur, idc = id commentaire
    const {commentaire} = req.body;

    const updateQuery = `
        UPDATE commentaires
        SET commentaire = $1
        WHERE Idcomment = $2 AND Idproduit = $3 AND Iduser = $4 
        RETURNING *;
    `;

    const values = [commentaire, idc, idf, idu];

    pool.query(updateQuery, values)
        .then(result => {
            if (result.rows.length > 0) {
                res.status(200).json({
                    message: 'Comment updated successfully',
                    comment: result.rows[0]
                });
            } else {
                res.status(404).json({ error: 'Comment not found' });
            }
        })
        .catch(error => {
            console.error('Error updating comment:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};


// Controller to handle deleting a comment by ID
const deleteComment = (req, res) => {
    const {idf, idu, idc} = req.params;

    const deleteQuery = 'DELETE FROM commentaires WHERE Idcomment = $1 AND idproduit = $2 AND iduser = $3  RETURNING *;';
    pool.query(deleteQuery, [idc, idf, idu ])
        .then(result => {
            if (result.rows.length > 0) {
                res.status(200).json({ message: 'Comment deleted successfully' });
            } else {
                res.status(404).json({ error: 'Comment not found' });
            }
        })
        .catch(error => {
            console.error('Error deleting comment:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};
// Controller to handle updating the Action status of a comment by ID
const patchAction = (req, res) => {
    const id = req.params.id;
    const { Action } = req.body;

    if (Action === undefined) {
        return res.status(400).json({ error: 'Action field is required' });
    }

    const updateQuery = `
        UPDATE commentaires
        SET Action = $1
        WHERE Idcomment = $2
        RETURNING *;
    `;

    pool.query(updateQuery, [Action, id])
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
// Exporting the controllers
module.exports = {
    addComment,
    getAllComments,
    getCommentByIdf,
    getCommentByUserIdFormationId,
    updateComment,
    updateCommentByFormUser,
    deleteComment,
    patchAction
};
