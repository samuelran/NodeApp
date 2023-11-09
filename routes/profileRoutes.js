const express = require('express');
const router = express.Router();
const authenticateJWT = require('../middleware/auth.js');
const { createAndSaveUserProfile, updateProfile } = require('../models/userProfile.js');


router.post('/userprofiles', authenticateJWT, async (req, res) => {
    try {
      const { name, email, profilePicture, about } = req.body;
      const userId = req.user._id;
  
      const userProfile = await createAndSaveUserProfile(
        userId,
        name,
        email,
        profilePicture,
        about
      );
  
      res.status(201).json(userProfile);
    } catch (error) {
      console.error("Error creating user profile:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.put('/userProfile', authenticateJWT, async (req, res) => {
    try {
      const { name, email, profilePicture, about } = req.body;
      const userId = req.user.id;
  
      const updates = { name, email, profilePicture, about };
  
      const updatedProfile = await updateProfile(userId, updates);
  
      res.status(200).json(updatedProfile);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });   
  router.get('/userprofiles', authenticateJWT, async (req, res) =>{
    try{
        const { name, email, profilePicture, about } = req.user;
        res.status(200).json({ name, email, profilePicture, about });  
    }catch (error) {
        console.error("Error fetching user profile", error); 
        res.status(500).json({ error: 'Internal server error' });
    }
    
  })

module.exports = router;