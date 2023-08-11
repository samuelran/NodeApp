const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: String,  
  author: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
const Message = mongoose.model('Message', messageSchema);

module.exports = Message; // Export the Message model