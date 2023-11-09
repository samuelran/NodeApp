const mongoose = require('mongoose');
const mongoURL = 'mongodb://127.0.0.1:27017/';
const dbName = 'chatdb';


const connectToDatabase = async () => {
  try {
    await mongoose.connect(`${mongoURL}${dbName}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); 
  }
};

module.exports = connectToDatabase;