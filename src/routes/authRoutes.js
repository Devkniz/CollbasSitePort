const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route pour afficher la page de connexion
router.get('/login', (req, res) => {
    res.render('login');
});

// Route pour afficher la page d'inscription
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', authController.register);
router.post('/login', authController.login);

// Route pour la déconnexion
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Failed to logout');
        }
        res.redirect('/auth/login');
    });
});

module.exports = router;