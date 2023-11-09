require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const webpush = require('web-push');
const mongoose = require('mongoose');
const multer = require('multer');
const router = express.Router();



const connectToDatabase = require('./database/database');
const User = require('./models/User');
const UserProfile = require('./models/Profile');
const Message = require('./models/Message');
const ForumPost = require('./models/ForumPost');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const forumPostRoutes = require('./routes/forumPostRoutes');
const profileRoutes = require('./routes/profileRoutes');
const commentRoutes = require('./routes/commentRoutes');


//const mongoURL = 'mongodb://127.0.0.1:27017';
//const dbName = 'chatdb';
const SECRET_KEY = process.env.SECRET_KEY;
const app = express();

connectToDatabase().then(() => {
    const server = app.listen(3000, () => {
        console.log('Server running on port 3000');
    });

    const io = new Server(server, {
        cors: {
            origin: "http://localhost:8080",
            methods: ["GET", "POST", "DELETE"],
            credentials: true
        }
    });
});
    app.use(cors({
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST', 'DELETE'],
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

    app.use(passport.initialize());
    app.use(express.static('build'));

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
                    date: responseObject.date
                });
            } catch (error) {
                console.error('Error handling new message:', error);
            }
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

      const upload = multer({ storage });


      module.exports.io = io;
        module.exports.upload = upload;
        module.exports.storage = storage;
        module.exports.clientsMap = clientsMap;
     module.exports.SECRET_KEY = SECRET_KEY;
        