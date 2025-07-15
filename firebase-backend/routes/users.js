const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const db = admin.firestore();
const { authenticate } = require('../middlewares');

// Get all users
router.get('/getUsers', async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    usersSnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// router.post('/addUser', authenticate, async (req, res) => {
//   try {
//     const userData = req.body;
//     const docRef = await db.collection('users').doc(userData.uid).set(userData);
//     res.json({ message: 'User added successfully', ...userData });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
// Add a new user
router.post('/addUser', async (req, res) => {
  try {
    const userData = req.body;
    const docRef = await db.collection('users').add(userData);
    res.json({ id: docRef.id, ...userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a user
router.post('/updateUser', async (req, res) => {
  try {
    const { id, ...userData } = req.body;
    await db.collection('users').doc(id).update(userData);
    res.json({ id, ...userData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 