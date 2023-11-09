const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    profilePicture: String,
  });

  const UserProfile = mongoose.model('UserProfile', userProfileSchema);

module.exports = UserProfile;