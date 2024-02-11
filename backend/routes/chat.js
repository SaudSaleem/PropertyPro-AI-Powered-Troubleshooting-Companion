const express = require("express");
const router = express.Router();
const { generateResponse, getChatById } = require("../controllers/chat");

router.get('/chat', getChatById);
router.post("/chat", generateResponse);

module.exports = router;
