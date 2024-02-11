const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config/config.json");

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ where: { email } });
    // If user not found, return error
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }
    // Passwords match, authentication successful
    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, config.token_secret, {
      expiresIn: "2h",
    });
    // Set the token as a cookie or in the response body
    res.cookie("token", token, { httpOnly: true }); // Set as HTTP-only cookie for security

    // Return success response with token
     user = {
      name: user.name,
      email: user.email,
      role: user.role
    }
    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  loginUser,
};
