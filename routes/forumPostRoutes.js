const express = require('express');
const router = express.Router();
const ForumPost = require('../models/ForumPost');

router.get('/forum-posts', async (req, res) => {
    try {
        const posts = await ForumPost.find().populate('author', 'email');
        res.json(posts);
    } catch (error) {
        console.error("Error fetching forum posts:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/forum-posts', authenticateJWT, async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required' });
        }

        const newPost = new ForumPost({
            title,
            content,
            author: req.user.id
        });

        await newPost.save();
        res.json(newPost);
    } catch (error) {
        console.error("Error saving forum post:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/forum-posts/:id', authenticateJWT, async (req, res) => {
    try {
        const postId = req.params.id;
        const postToDelete = await ForumPost.findById(postId);

        if (!postToDelete) {
            return res.status(404).json({ error: 'Post not found' });
        }

        await ForumPost.deleteOne({ _id: postId });
        res.json({ success: true });
    } catch (error) {
        console.error("Error deleting forum post:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




module.exports = router;
