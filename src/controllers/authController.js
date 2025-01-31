const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { email, password } = req.body;
    console.log('Registering user:', email);

    try {
        const { data, error } = await req.supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            console.log('Registration error:', error);
            return res.status(400).json({ error: error.message });
        }

        console.log('User registered:', data);

        // Rediriger vers le tableau de bord après une inscription réussie
        res.redirect('/dashboard');
    } catch (dbError) {
        console.log('Database error saving new user:', dbError);
        return res.status(500).json({ error: 'Database error saving new user' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log('Logging in user:', email);

    const { data, error } = await req.supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.log('Login error:', error);
        return res.status(400).json({ error: error.message });
    }

    console.log('User logged in:', data);

    const token = jwt.sign(
        { sub: data.user.id, userId: data.user.id, aud: 'authenticated' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
    req.session.token = token;
    req.session.userId = data.user.id; // Store user ID in session

    console.log('JWT token generated:', token);

    // Rediriger vers le tableau de bord après une connexion réussie
    res.redirect('/dashboard');
};