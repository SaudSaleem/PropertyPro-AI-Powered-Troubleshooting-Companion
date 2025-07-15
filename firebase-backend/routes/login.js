const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.json');

const db = admin.firestore();

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Get user from Firestore users collection by email
    const usersRef = db.collection('users');
    const snapshot = await usersRef.where('email', '==', email).get();
    
    if (snapshot.empty) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Get the first user document (assuming email is unique)
    let user = null;
    let userId = null;
    snapshot.forEach(doc => {
      user = doc.data();
      userId = doc.id;
    });
    console.log('user', user, password);
    // Compare the provided password with the hashed password
    const passwordMatch = password == user.password;
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    // Passwords match, authentication successful
    // Generate a JWT token
    const token = jwt.sign({ userId: userId }, config.token_secret, {
      expiresIn: '2h',
    });
    
    // Set the token as a cookie or in the response body
    res.cookie('token', token, { httpOnly: true }); // Set as HTTP-only cookie for security

    // Return success response with token
    const userResponse = {
      name: user.name,
      email: user.email,
      role: user.role
    };
    
    return res.status(200).json({ 
      message: 'Login successful', 
      token, 
      user: userResponse 
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router; 