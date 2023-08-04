const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { MongoClient } = require('mongodb');
const { Server } = require('socket.io');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const webpush = require('web-push');

// MongoDB connection URL
const mongoURL = 'mongodb://localhost:27017';
const dbName = 'chatdb';
const collectionName = 'messages';

// Connect to MongoDB
MongoClient.connect(mongoURL, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const app = express();
    const server = http.createServer(app);
    const io = new Server(server);

    // Web Push Notifications
    webpush.setVapidDetails(
      'mailto:your-email@example.com',
      'your-public-key',
      'your-private-key'
    );

    // Map to store connected clients and their respective rooms
    const clientsMap = new Map();

    // Passport.js local strategy
    passport.use(new LocalStrategy(
      async (username, password, done) => {
        try {
          // Replace this with your own logic to retrieve user from the database
          const user = { id: 1, username: 'testuser', password: 'testpassword' };

          // Check if user exists
          if (!user) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          // Compare passwords
          const passwordMatch = await bcrypt.compare(password, user.password);

          if (!passwordMatch) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    ));

    // JWT Authentication
    function authenticateJWT(req, res, next) {
      const token = req.headers.authorization;

      if (token) {
        jwt.verify(token, 'your-secret-key', (err, user) => {
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

    // Initialize Passport.js
    app.use(passport.initialize());

    // Serve the HTML file
    app.get('/', (req, res) => {
      res.sendFile(__dirname + '/index.html');
    });

    // Handle login route to generate and return the JWT
    app.post('/login', (req, res, next) => {
      passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);
        return res.json({ token });
      })(req, res, next);
    });

    // Implement the subscribe route for push notifications
    app.post('/subscribe', (req, res) => {
      const { socketId, subscription } = req.body;

      // Store the push subscription in the clientsMap
      const clientSocket = io.sockets.sockets.get(socketId);
      clientSocket.pushSubscription = subscription;

      res.sendStatus(200);
    });

    // Set up Socket.IO event handlers
    io.on('connection', (socket) => {
      console.log('A user connected');

      // Load previous messages from the database
      collection.find().toArray()
        .then(messages => {
          socket.emit('load messages', messages);
        })
        .catch(error => {
          console.error('Error loading messages:', error);
        });

      // Join a room
      socket.on('join room', (room) => {
        socket.join(room);

        // Store the socket and room in the clientsMap
        clientsMap.set(socket.id, room);
      });

      // Handle incoming chat messages
      socket.on('chat message', (msg) => {
        passport.authenticate('local', { session: false }, (err, user) => {
          if (user) {
            console.log(`Message: ${msg} from user ${user.username}`);

            // Insert the message into the database
            collection.insertOne({ message: msg, user: user.username })
              .then(() => {
                // Broadcast the message to all clients in the room
                const room = clientsMap.get(socket.id);
                io.to(room).emit('chat message', { message: msg, user: user.username });

                // Send notification to other clients in the room
                const clientsInRoom = io.sockets.adapter.rooms.get(room);

                if (clientsInRoom) {
                  clientsInRoom.forEach((clientId) => {
                    if (clientId !== socket.id) {
                      const clientSocket = io.sockets.sockets.get(clientId);
                      const clientUser = clientsMap.get(clientId);

                      // Send notification to the client
                      webpush.sendNotification(clientSocket.pushSubscription, JSON.stringify({
                        title: 'New Message',
                        body: `${user.username}: ${msg}`,
                      }));
                    }
                  });
                }
              })
              .catch(error => {
                console.error('Error inserting message:', error);
              });
          }
        })(null, { headers: { authorization: req.headers.authorization } });
      });

      // Handle disconnections
      socket.on('disconnect', () => {
        console.log('A user disconnected');
        // Remove the socket and room from the clientsMap
        clientsMap.delete(socket.id);
      });
    });

    // Generate JWT token
    function generateToken(user) {
      const payload = {
        id: user.id,
        username: user.username
      };

      return jwt.sign(payload, 'your-secret-key', { expiresIn: '1h' });
    }

    // Start the server
    const port = 3000; 
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });