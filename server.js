const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const webpush = require('web-push');
const mongoose = require('mongoose');

const connectToDatabase = require('./database');
const User = require('./models/user');
const Message = require('./models/messages');
const ForumPost = require('./models/ForumPost');

const mongoURL = 'mongodb://127.0.0.1:27017';
const dbName = 'chatdb';
const SECRET_KEY = process.env.SECRET_KEY || 'your_default_key_for_development';

connectToDatabase().then(() => {
    const app = express();
    const server = app.listen(3000, () => {
        console.log('Server running on port 3000');
    });

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:8080",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    app.use(cors({
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST'],
        credentials: true
    }));
    app.use(express.json());

    const clientsMap = new Map();

    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email: email.toLowerCase() });

                if (!user) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                const isPasswordValid = await bcrypt.compare(password, user.password);

                if (!isPasswordValid) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    function authenticateJWT(req, res, next) {
        const token = req.headers.authorization;

        if (token) {
            jwt.verify(token, SECRET_KEY, (err, user) => {
                if (err) {
                    return res.sendStatus(403);
                }

                req.user = user;
                next();
            });
        } else {
            res.sendStatus(401);
        }
    }

    app.use(passport.initialize());
    app.use(express.static('build'));

    app.post('/login', (req, res, next) => {
        passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const token = jwt.sign({ email: user.email, id: user._id }, SECRET_KEY, { expiresIn: '1h' });
            return res.json({ token, email: user.email });
        })(req, res, next);
    });

    app.post('/register', async (req, res) => {
        try {
            const { email, password } = req.body;

            const existingUser = await User.findOne({ email: email.toLowerCase() });

            if (existingUser) {
                return res.status(409).json({ error: 'User with this email already exists' });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = new User({
                email: email.toLowerCase(),
                password: hashedPassword,
            });

            await newUser.save();

            const token = jwt.sign({ email: newUser.email, id: newUser._id }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.get('/forum-posts', async (req, res) => {
        try {
            const posts = await ForumPost.find().populate('author', 'email');
            res.json(posts);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.post('/forum-posts', authenticateJWT, async (req, res) => {
        try {
            const { title, content } = req.body;
            const newPost = new ForumPost({
                title,
                content,
                author: req.user.id
            });

            await newPost.save();
            res.json(newPost);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.delete('/forum-posts/:id', authenticateJWT, async (req, res) => {
        try {
            const postId = req.params.id;
            await ForumPost.findByIdAndDelete(postId);
            res.sendStatus(200);
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    app.post('/subscribe', (req, res) => {
        const { socketId, subscription } = req.body;

        const clientSocket = io.sockets.sockets.get(socketId);
        clientSocket.pushSubscription = subscription;

        res.sendStatus(200);
    });

    io.on('connection', (socket) => {
        socket.on('join room', (room) => {
            socket.join(room);
            clientsMap.set(socket.id, room);
        });

        socket.on('chat message', async (msg) => {
            try {
                const user = await User.findById(socket.userId);
                if (!user) {
                    console.error(`No user found with ID: ${socket.userId}`);
                    return;
                }

                const message = new Message({
                    content: msg.content,
                    author: user._id
                });

                await message.save();

                const room = clientsMap.get(socket.id);
                if (room) {
                    io.to(room).emit('chat message', msg);
                } else {
                    console.error("User not in any room, can't broadcast message.");
                }

                io.in(clientsMap.get(socket.id)).emit('chat message', {
                    content: msg.content,
                    author: user.email
                });

                if (socket.pushSubscription) {
                    const notificationPayload = {
                        notification: {
                            title: 'New message',
                            body: msg.content,
                            icon: 'icons/icon-96x96.png',
                            vibrate: [100, 50, 100],
                            data: {
                                dateOfArrival: Date.now(),
                                primaryKey: 1
                            },
                            actions: [{
                                action: 'explore',
                                title: 'Go to the chat'
                            }]
                        }
                    };

                    webpush.sendNotification(socket.pushSubscription, JSON.stringify(notificationPayload))
                        .catch(error => {
                            console.error('Error sending push notification:', error);
                        });
                }
            } catch (error) {
                console.error('Error saving message:', error);
            }
        });

        socket.on('disconnect', () => {
            clientsMap.delete(socket.id);
        });
    });

}).catch(error => {
    console.error('Error connecting to MongoDB:', error);
});
