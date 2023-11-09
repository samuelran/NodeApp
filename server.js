const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const multer = require('multer');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes.js');
const connectToDatabase = require('./database/database.js');
const User = require('./models/User.js');


require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3000;

connectToDatabase().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:8080',
            methods: ['GET', 'POST', 'DELETE', 'PUT'],
            credentials: true,
        },
    });

    app.use(cors({
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST', 'DELETE'],
        credentials: true,
    }));

    app.use(express.json());

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
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

    app.use(passport.initialize());
    app.use(express.static('build'));

    app.use('/login', userRoutes);

    io.on('connection', (socket) => {
        socket.join('general');

        socket.on('new message', async (msg) => {
            try {
                const user = await User.findById(socket.userId);
                if (!user) {
                    console.error(`No user found with ID: ${socket.userId}`);
                    return;
                }

                const responseObject = await createAndSaveMessage(msg.content, user._id);

                socket.to('general').emit('chat message', {
                    content: responseObject.content,
                    author: user.email,
                    date: responseObject.date,
                });
            } catch (error) {
                console.error('Error handling new message:', error);
            }
        });
    });

    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'public/profilePictures');
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1]);
        },
    });

    const upload = multer({ storage }); // Commented out since it is not used.

});

//module.exports.io = io;