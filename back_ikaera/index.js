// server.js

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const { upload, addFormation,
    getAllFormations,
    getFormationById,
    updateFormation,
    deleteFormation
} = require('./ControllersRoutes/formation'); // Import functions and upload middleware
const {
    addComment,
    getAllComments,
    getCommentByIdf,
    getCommentByUserIdFormationId,
    updateComment,
    updateCommentByFormUser,
    deleteComment,
    patchAction,
} = require('./ControllersRoutes/commentaires');
const {
    addUser,
    getAllUsers,
    getUserByEmail,
    updateUser,
    deleteUser
} = require('./ControllersRoutes/utilisateur');

const {
    addStar,
    getAllStars,
    getStarByuser,
    updateStar,
    deleteStar,
    patchEtoile
} = require('./ControllersRoutes/EtoileRate'); 
const {
    addInscription,
    getAllInscription,
    
} = require('./ControllersRoutes/inscription'); 

dotenv.config();

// Initialize express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static folder for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes to handle adding, fetching, updating, and deleting formations
app.post('/api/add', upload.single('image'), addFormation);
app.get('/api/formations', getAllFormations);
app.get('/api/formations/:id', getFormationById);
app.put('/api/formations/:id', upload.single('image'), updateFormation);
app.delete('/api/formations/:id', upload.single('image'), deleteFormation);


// Routes for handling comments
app.post('/api/comments', addComment); // Add a comment
app.get('/api/comments', getAllComments); // Get all comments
app.get('/api/comments/:idf', getCommentByIdf); // Get comment by ID
app.get('/api/comments/:userid/:id', getCommentByUserIdFormationId); // Get comment by ID
app.put('/api/comments/:id', updateComment); // Update comment by ID
app.patch('/api/comments/:idf/:idu/:idc', updateCommentByFormUser); // Update comment by ID
app.delete('/api/comments/:idf/:idu/:idc', deleteComment); // Delete comment by ID
app.patch('/api/comments/:id/action', patchAction); // Update Action status by ID

// User Routes
app.post('/api/utilisateurs', addUser); // Add a new user
app.get('/api/utilisateurs', getAllUsers); // Get all users
app.get('/api/utilisateurs/:email', getUserByEmail); // Get a user by ID
app.put('/api/utilisateurs/:id', updateUser); // Update a user by ID
app.delete('/api/utilisateurs/:id', deleteUser);

// Rating (Star) routes
app.post('/api/stars', addStar);
app.get('/api/stars', getAllStars);
app.get('/api/stars/:iduser', getStarByuser);
app.put('/api/stars/:idformation/:iduser', updateStar);
app.delete('/api/stars/:idformation/:iduser', deleteStar);
app.patch('/api/stars/:idu/:idf', patchEtoile);

app.post('/api/inscription', addInscription);
app.get('/api/inscription', getAllInscription);





app.use('/image', express.static(path.join(__dirname, 'logo')));

// API pour accéder directement à l'image ikaera.png
app.get('/api/image/ikaera', (req, res) => {
  res.sendFile(path.join(__dirname, 'logo', 'ikaera.jpg'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
