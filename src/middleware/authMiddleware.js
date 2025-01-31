const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    if (req.session.token) {
        req.headers.authorization = `Bearer ${req.session.token}`;
    }
    const token = req.session.token;

    if (!token) {
        console.log('No token in session');
        req.isAuthenticated = false;
        return res.redirect('/auth/login');
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log('JWT verification error:', err);
            req.isAuthenticated = false;
            return res.redirect('/auth/login');
        }

        console.log('JWT verified:', decoded);

        req.isAuthenticated = true;
        req.user = decoded;
        next();
    });
};

module.exports = (req, res, next) => {
    const token = req.session.token;
    if (!token) {
        console.log('No token provided');
        return res.redirect('/auth/login');
    }
    console.log('Received token:', token);
    next();
};