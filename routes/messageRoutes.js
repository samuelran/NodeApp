
const express = require('express');
const router = express.Router();
const {io} = require('../server');
const Message = require('../models/Message');
const User = require('../models/User');
const { authenticateJWT } = require('../middleware/auth');

async function createAndSaveMessage(content, authorId) {
    try {
        const currentDate = new Date().toISOString();

        const message = new Message({
            content: content,
            author: authorId,
            date: currentDate
        });

        const savedMessage = await message.save();

        return {
            content: content,
            author: authorId,
            date: currentDate
        };
    } catch (error) {
        console.error("Error saving message:", error);
        throw error;
    }
}

router.post('/messages', authenticateJWT, async (req, res) => {
    try {
        const { content } = req.body;
        const responseObject = await createAndSaveMessage(content, req.user.id);

        io.to('general').emit('chat message', {
            content: responseObject.content,
            author: req.user.email,
            date: responseObject.date
        });

        res.status(201).json(responseObject);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;