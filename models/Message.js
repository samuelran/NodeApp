const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: String,  
  author: {  
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  date: { type: Date, default: Date.now }
});
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;