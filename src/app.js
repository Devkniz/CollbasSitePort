const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');

const app = express();

// Configuration des vues
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1);


// Middleware pour parser les requêtes
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Utilisation du routeur
app.use('/', indexRouter);

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
