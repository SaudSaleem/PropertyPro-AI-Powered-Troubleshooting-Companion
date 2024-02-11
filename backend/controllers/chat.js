const OpenAI = require("openai");
const { Chat } = require("../models");
const config = require("../config/config.json");

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});
console.log('openai', openai, config.OPENAI_API_KEY)
// Helper function to fetch latest 5 messages from Chat model
async function fetchChatHistory(chatId) {
  try {
    // Fetch latest 5 messages for the user
    const chatHistory = await Chat.findAll({
      where: { chatId },
      order: [["createdAt", "DESC"]], // Sort by createdAt timestamp in descending order
      limit: 5,
    });
    return chatHistory.map((chat) => ({
      role: chat.role,
      content: chat.content,
    }));
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

    if (req.body.chatId) {
      // Fetch latest 5 messages from chat history
      chatHistory = await fetchChatHistory(req.body.chatId);
      chatHistory.push({ role: "user", content: req.body.userPrompt });
      context = chatHistory;
    } else {
      const systemPrompt = { role: "system", content: config.SYSTEM_PROMPT };
      const userPrompt = { role: "user", content: req.body.userPrompt };
      context = [systemPrompt, userPrompt];
    }

    // Call OpenAI API to generate a response
    const response = await openai.chatCompletion.create({
      model: "gpt-3.5-turbo",
      messages: context,
      max_tokens: 2000,
      temperature: 0.7,
      top_p: 0.7,
    });
    const assistantResponse = {
      role: "assistant",
      content: response.data.choices[0].message.content,
    };
    if (req.body.chatId) {
      context = [...context, assistantResponse];
      await Chat.update(
        { conversation: JSON.stringify(context) },
        {
          where: { id: req.body.chatId },
        }
      );
    } else {
       context = [userPrompt, assistantResponse];
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
  const { chatId } = req.body;
  try {
    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    return res.status(200).json({ chat });
  } catch (error) {
    console.error('Error fetching chat:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { generateResponse, getChatById };
