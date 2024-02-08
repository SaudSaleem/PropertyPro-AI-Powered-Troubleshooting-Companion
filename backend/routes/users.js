const express = require('express');
const router = express.Router();

const { getUsers, addUser, updateUser } = require('../controllers/users');

router.get('/getUsers', getUsers);
router.post('/addUser', addUser);
router.post('/updateUser', updateUser);

module.exports = router;