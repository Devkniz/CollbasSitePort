const Topic = require('../models/topicModel');

// Get all topics
exports.getAllTopics = async (req, res) => {
    try {
        const topics = await Topic.find();
        res.status(200).json({
            status: 'success',
            results: topics.length,
            data: {
                topics
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Get a single topic by ID
exports.getTopicById = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        if (!topic) {
            return res.status(404).json({
                status: 'fail',
                message: 'Topic not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                topic
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Create a new topic
exports.createTopic = async (req, res) => {
    try {
        const newTopic = await Topic.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                topic: newTopic
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Update a topic by ID
exports.updateTopic = async (req, res) => {
    try {
        const topic = await Topic.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        if (!topic) {
            return res.status(404).json({
                status: 'fail',
                message: 'Topic not found'
            });
        }
        res.status(200).json({
            status: 'success',
            data: {
                topic
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Delete a topic by ID
exports.deleteTopic = async (req, res) => {
    try {
        const topic = await Topic.findByIdAndDelete(req.params.id);
        if (!topic) {
            return res.status(404).json({
                status: 'fail',
                message: 'Topic not found'
            });
        }
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};