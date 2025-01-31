const express = require('express');
const router = express.Router();
const Topic = require('../models/topicModel');
const Document = require('../models/documentModel');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/topics', authMiddleware, async (req, res) => {
    console.log('Accessing the topics page');
    try {
        const topics = await Topic.getAll();
        res.render('topics', { topics, userId: req.session.userId });
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).send('Error fetching topics');
    }
});

router.post('/topics/respond/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { response } = req.body;
    const userId = req.session.userId; // Assuming user ID is stored in session

    try {
        const data = await Topic.respond(id, userId, response);
        console.log('Response added:', data);
        res.redirect('/topics');
    } catch (error) {
        console.error('Error adding response:', error);
        res.status(500).send('Error adding response');
    }
});

router.get('/auth/profile', authMiddleware, (req, res) => {
    console.log('Accessing the profile page');
    res.render('profile');
});

router.post('/topics/create', authMiddleware, async (req, res) => {
    const { title, description } = req.body;
    const userId = req.session.userId; // Assuming user ID is stored in session

    try {
        const data = await Topic.create(title, description, userId);
        console.log('Topic created:', data);
        res.redirect('/topics');
    } catch (error) {
        console.error('Error creating topic:', error);
        res.status(500).send('Error creating topic');
    }
});

router.get('/topics/edit/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const { data: topic, error } = await req.supabase
            .from('topics')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching topic:', error);
            return res.status(500).send('Error fetching topic');
        }

        res.render('editTopic', { topic });
    } catch (error) {
        console.error('Error fetching topic:', error);
        res.status(500).send('Error fetching topic');
    }
});

router.post('/topics/edit/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const data = await Topic.update(id, title, description);
        console.log('Topic updated:', data);
        res.redirect('/topics');
    } catch (error) {
        console.error('Error updating topic:', error);
        res.status(500).send('Error updating topic');
    }
});

router.post('/topics/delete/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const data = await Topic.delete(id);
        console.log('Topic deleted:', data);
        res.redirect('/topics');
    } catch (error) {
        console.error('Error deleting topic:', error);
        res.status(500).send('Error deleting topic');
    }
});

router.get('/files/my-files', authMiddleware, async (req, res) => {
    console.log('Accessing the files page');
    console.log('Authorization Header:', req.headers.authorization);
    console.log('Received token:', req.session.token);
    try {
        const documents = await Document.findAll();
        res.render('files', { documents });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).send('Error fetching documents');
    }
});

router.post('/files/upload', authMiddleware, async (req, res) => {
    const { title, description, fileUrl } = req.body;
    const userId = req.session.userId; // Assuming user ID is stored in session

    try {
        const data = await Document.create({ title, description, file_url: fileUrl, user_id: userId });
        console.log('Document uploaded:', data);
        res.redirect('/files/my-files');
    } catch (error) {
        console.error('Error uploading document:', error);
        res.status(500).send('Error uploading document');
    }
});

module.exports = router;