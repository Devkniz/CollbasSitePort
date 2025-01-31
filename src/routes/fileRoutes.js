// filepath: /home/mouks/testAppWeb/node-web-app/src/routes/fileRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const fileController = require('../controllers/fileController');

console.log("File Controller:", fileController);

// Route pour afficher les fichiers
router.get('/', fileController.getFiles);

// Route pour uploader un fichier
router.post('/upload', upload.single('file'), fileController.uploadFile);

module.exports = router;