const { User, Chat } = require("../models");

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: {
        model: Chat,
        order: [["updatedAt", "DESC"]], // Order chats by updatedAt attribute in descending order
        limit: 5,
      },
    });
    res.status(200).json(users);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
};

const addUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = req.body;

    // Check if the user exists
    const existingUser = await User.findByPk(userId);
    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the user
    await User.update(updatedUser, { where: { id: userId } });

    // Fetch the updated user from the database
    const updatedUserData = await User.findByPk(userId);

    res.status(200).json(updatedUserData); // Respond with the updated user data
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

module.exports = {
  getUsers,
  addUser,
  updateUser,
};
