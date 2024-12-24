// formation.js

const multer = require('multer'); // Import multer
const fs = require('fs'); // Importation du module fs pour gérer les fichiers
const path = require('path');
const pool = require('../config/db'); // Import the pool from db.js

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Specify the folder for uploads
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Save with unique filename
    }
});
const upload = multer({ storage });

// Controller to handle adding a formation
const addFormation = (req, res) => {
    const { titre, description, frais, lieu, date_ajout } = req.body;
    const image = req.file ? req.file.path : null; // Get the image path from multer

    if (!titre || !description || !frais || !lieu || !date_ajout) {
        return res.status(400).json({ error: 'Please fill in all fields' });
    }

    const query = `
        INSERT INTO formations (titre, description, frais, lieu, date_ajout, image)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [titre, description, frais, lieu, date_ajout, image];

    pool.query(query, values)
        .then(result => {
            res.status(201).json({
                message: 'Formation added successfully',
                formation: result.rows[0]
            });
        })
        .catch(error => {
            console.error('Error adding formation:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

// Controller to handle fetching all formations
const getAllFormations = (req, res) => {
    const query = 'SELECT * FROM formations;';
    pool.query(query)
        .then(result => {
            res.status(200).json(result.rows);
        })
        .catch(error => {
            console.error('Error fetching formations:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

// Controller to handle fetching a formation by ID
const getFormationById = (req, res) => {
    const id = req.params.id;

    const query = 'SELECT * FROM formations WHERE id = $1;';
    pool.query(query, [id])
        .then(result => {
            if (result.rows.length > 0) {
                res.status(200).json(result.rows[0]);
            } else {
                res.status(404).json({ error: 'Formation not found' });
            }
        })
        .catch(error => {
            console.error('Error fetching formation:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};

// Controller to handle updating a formation by ID
const updateFormation = (req, res) => {
    const id = req.params.id;
    const { titre, description, frais, lieu } = req.body;
    const newImage = req.file ? req.file.path : null; // Nouvelle image si elle est uploadée

    // Requête pour récupérer l'ancienne image avant de faire la mise à jour
    const getOldImageQuery = 'SELECT image FROM formations WHERE id = $1';
    const updateQuery = `
        UPDATE formations
        SET titre = $1, description = $2, frais = $3, lieu = $4, image = $5
        WHERE id = $6
        RETURNING *;
    `;

    // Première étape : récupérer l'image actuelle dans la base de données
    pool.query(getOldImageQuery, [id])
        .then(result => {
            if (result.rows.length > 0) {
                const oldImage = result.rows[0].image;

                // Si une nouvelle image est fournie, supprimer l'ancienne image du serveur
                if (newImage && oldImage) {
                    fs.unlink(oldImage, (err) => {
                        if (err) {
                            console.error('Erreur lors de la suppression de l\'ancienne image :', err);
                        } else {
                            console.log('Ancienne image supprimée avec succès.');
                        }
                    });
                }

                // Mise à jour avec la nouvelle image (ou conserver l'ancienne si pas de nouvelle image)
                const updatedImage = newImage ? newImage : oldImage;
                const values = [titre, description, frais, lieu, updatedImage, id];

                // Deuxième étape : mettre à jour la formation avec les nouvelles données
                pool.query(updateQuery, values)
                    .then(updateResult => {
                        if (updateResult.rows.length > 0) {
                            res.status(200).json({
                                message: 'Formation mise à jour avec succès',
                                formation: updateResult.rows[0]
                            });
                        } else {
                            res.status(404).json({ error: 'Formation non trouvée' });
                        }
                    })
                    .catch(error => {
                        console.error('Erreur lors de la mise à jour de la formation :', error);
                        res.status(500).json({ error: 'Erreur interne du serveur' });
                    });
            } else {
                res.status(404).json({ error: 'Formation non trouvée' });
            }
        })
        .catch(error => {
            console.error('Erreur lors de la récupération de la formation :', error);
            res.status(500).json({ error: 'Erreur interne du serveur' });
        });
};

// Controller to handle deleting a formation by ID
const deleteFormation = (req, res) => {
    const id = req.params.id;

    // Étape 1 : Récupérer l'image associée à la formation avant de la supprimer
    const getImageQuery = 'SELECT image FROM formations WHERE id = $1;';

    // Récupération de l'ancienne image dans la base de données
    pool.query(getImageQuery, [id])
        .then(result => {
            if (result.rows.length > 0) {
                const imagePath = result.rows[0].image; // Chemin de l'image stocké dans la base de données

                // Étape 2 : Supprimer la formation de la base de données
                const deleteQuery = 'DELETE FROM formations WHERE id = $1 RETURNING *;';
                pool.query(deleteQuery, [id])
                    .then(deleteResult => {
                        if (deleteResult.rows.length > 0) {
                            // Formation supprimée avec succès

                            // Étape 3 : Supprimer l'image du dossier 'uploads' (si elle existe)
                            if (imagePath) {
                                const filePath = path.join(__dirname, imagePath); // Construire le chemin absolu de l'image
                                
                                // Vérifier si l'image existe avant de tenter de la supprimer
                                fs.exists(filePath, (exists) => {
                                    if (exists) {
                                        fs.unlink(filePath, (err) => {
                                            if (err) {
                                                console.error('Error deleting image:', err);
                                                return res.status(500).json({ error: 'Error deleting image' });
                                            } else {
                                                console.log('Image deleted successfully');
                                            }
                                        });
                                    } else {
                                        console.log('Image does not exist, skipping deletion');
                                    }
                                });
                            }

                            // Répondre au client
                            res.status(200).json({ message: 'Formation and associated image deleted successfully' });
                        } else {
                            res.status(404).json({ error: 'Formation not found' });
                        }
                    })
                    .catch(error => {
                        console.error('Error deleting formation:', error);
                        res.status(500).json({ error: 'Internal server error' });
                    });
            } else {
                res.status(404).json({ error: 'Formation not found' });
            }
        })
        .catch(error => {
            console.error('Error retrieving formation image:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};


// Exporting the functions and upload middleware for use in the main server file
module.exports = {
    upload,
    addFormation,
    getAllFormations,
    getFormationById,
    updateFormation,
    deleteFormation
};
