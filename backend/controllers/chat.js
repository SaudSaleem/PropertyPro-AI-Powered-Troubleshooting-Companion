require('dotenv').config();
const OpenAI = require("openai");
const { Chat } = require("../models");
const config = require("../config/config.json");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log('openai', process.env.OPENAI_API_KEY)
// Helper function to fetch latest 5 messages from Chat model
async function fetchChatHistory(chatId) {
  try {
    // Fetch latest 5 messages for the user
    const chatHistory = await Chat.findOne({
      where: { id: chatId },
      order: [["createdAt", "DESC"]], // Sort by createdAt timestamp in descending order
      limit: 5,
    });
    if(chatHistory){
      return JSON.parse(chatHistory.conversation);
    }
    return [];
  } catch (error) {
    console.error("Error fetching chat history:", error);
    return [];
  }
}

// Helper function to call OpenAI API with context
async function generateResponse(req, res) {
  try {
    let context = [];
    let chatHistory = [];
    let newChatInstance = [];
    const userPrompt = req.body.userPrompt;
    let userPromptObj = {};
    if (req.body.chatId) {
      // Fetch latest 5 messages from chat history
      chatHistory = await fetchChatHistory(req.body.chatId);
      chatHistory.unshift({ role: "system", content: config.SYSTEM_PROMPT })
      chatHistory.push({ role: "user", content: userPrompt });
      context = chatHistory;
    } else {
      const systemPrompt = { role: "system", content: config.SYSTEM_PROMPT };
      userPromptObj = { role: "user", content: userPrompt };
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
    if (req.body.chatId) {
      context = context.filter(chat => chat.role != 'system');
      context = [...context, assistantResponse];
      await Chat.update(
        { conversation: JSON.stringify(context) },
        {
          where: { id: req.body.chatId },
        }
      );
    } else {
       context = [userPromptObj, assistantResponse];
       newChatInstance = await Chat.create({
        userId: req.userId,
        conversation: JSON.stringify(context),
      });
    }
    res.status(200).json({
        success: true,
        message: assistantResponse.content,
        chatId: newChatInstance.id,
      });
  } catch (error) {
    console.error("Error calling OpenAI API:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

const getChatById = async (req, res) => {
  const { chatId } = req.query;
  try {
    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    const messages = JSON.parse(chat.conversation)
    return res.status(200).json({ messages });
  } catch (error) {
    console.error('Error fetching chat:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { generateResponse, getChatById };
