require('dotenv').config(); // Ensure this is at the top to load env variables
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./src/routes/authRoutes');
const fileRoutes = require('./src/routes/fileRoutes');
const authMiddleware = require('./src/middleware/authMiddleware');
const { createClient } = require('@supabase/supabase-js');
const indexRoutes = require('./src/routes/index');
const sequelize = require('./src/config/database');


const app = express();
const PORT = process.env.PORT || 3000;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
    auth: { persistSession: false }
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use((req, res, next) => {
    req.supabase = supabase;
    next();
});
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.token ? true : false;
    next();
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

console.log('Middleware and view engine setup complete.');

// Routes
app.use('/auth', authRoutes);
app.use('/files', fileRoutes);
app.use('/', indexRoutes);


console.log('Routes setup complete.');

// Root route
app.get('/', (req, res) => {
    res.redirect('/auth/register');
});

// Dashboard route (protected)
app.get('/dashboard', authMiddleware, (req, res) => {
    res.render('dashboard');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

sequelize.sync({ force: false }) 
    .then(() => console.log(' Database synchronized'))
    .catch((err) => console.error(' Error synchronizing database', err));