const mongoose = require('mongoose');


const ForumPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now }
});


const ForumPost = mongoose.model('ForumPost', ForumPostSchema);

module.exports = ForumPost;
