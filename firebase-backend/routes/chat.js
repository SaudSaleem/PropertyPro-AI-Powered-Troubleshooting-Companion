require('dotenv').config();
const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const OpenAI = require("openai");
const config = require("../config/config.json");
const { extractUserIdFromToken } = require('../middlewares');
const db = admin.firestore();

console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to fetch latest 5 messages from Firestore
async function fetchChatHistory(chatId) {
  try {
    const chatDoc = await db.collection('chats').doc(chatId).get();
    if (chatDoc.exists) {
      const chatData = chatDoc.data();
      return JSON.parse(chatData.conversation || '[]');
    }
    return [];
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
}

// Helper function to call OpenAI API with context
async function generateResponse(userPrompt, chatId, userId) {
  try {
    let context = [];
    let chatHistory = [];
    
    if (chatId) {
      // Fetch latest messages from chat history
      chatHistory = await fetchChatHistory(chatId);
      chatHistory.unshift({ role: "system", content: config.SYSTEM_PROMPT });
      chatHistory.push({ role: "user", content: userPrompt });
      context = chatHistory;
    } else {
      const systemPrompt = { role: "system", content: config.SYSTEM_PROMPT };
      const userPromptObj = { role: "user", content: userPrompt };
      context = [systemPrompt, userPromptObj];
    }

    // Call OpenAI API to generate a response
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: context,
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 0.7,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const assistantResponse = {
      role: "assistant",
      content: response.choices[0].message.content,
    };

    let finalChatId = chatId;
    
    if (chatId) {
      // Update existing chat
      context = context.filter(chat => chat.role !== 'system');
      context = [...context, assistantResponse];
      await db.collection('chats').doc(chatId).update({
        conversation: JSON.stringify(context),
        timestamp: new Date().toISOString(),
      });
    } else {
      // Create new chat
      const userPromptObj = { role: "user", content: userPrompt };
      context = [userPromptObj, assistantResponse];
      const chatRef = await db.collection('chats').add({
        userId,
        conversation: JSON.stringify(context),
        timestamp: new Date().toISOString(),
      });
      finalChatId = chatRef.id;
    }

    return {
      success: true,
      message: assistantResponse.content,
      chatId: finalChatId,
    };
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    throw new Error(`Failed to generate response error: ${error.message}`);
  }
}

// Get chat by ID
router.get('/chat', async (req, res) => {
  try {
    const { chatId } = req.query;
    const chatDoc = await db.collection('chats').doc(chatId).get();
    
    if (!chatDoc.exists) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    const chatData = chatDoc.data();
    const messages = JSON.parse(chatData.conversation || '[]');
    
    res.json({ messages });
  } catch (error) {
    console.error('Error fetching chat:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Generate chat response (handles both creation and updates)
router.post('/chat', extractUserIdFromToken, async (req, res) => {
  try {
    const { userPrompt, userId, chatId } = req.body;
    console.log('Chat request:', { userPrompt, userId, chatId });
    
    if (!userPrompt) {
      return res.status(400).json({ error: 'userPrompt is required' });
    }
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const result = await generateResponse(userPrompt, chatId, userId);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal Server Error',
      message: error.message 
    });
  }
});

module.exports = router; 